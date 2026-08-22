"use client";

import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import * as authApi from "@/lib/api/authApi";
import { ApiError, configureApiClient } from "@/lib/api/client";
import type { AuthStatus, User } from "@/types/auth";

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

// Refresh a little before actual expiry so an in-flight request never
// races an access token that just died.
const REFRESH_SKEW_MS = 30_000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // The API client reads this ref (not React state) so a token set moments
  // ago is visible to the very next fetch, without waiting on a re-render.
  const accessTokenRef = useRef<string | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearScheduledRefresh = () => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
    }
  };

  const clearSession = useCallback(() => {
    clearScheduledRefresh();
    accessTokenRef.current = null;
    setAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  // Stores the token (ref + state) and schedules the next proactive
  // refresh just before it expires.
  const applyToken = useCallback((token: string, expiresAt: string) => {
    accessTokenRef.current = token;
    setAccessToken(token);

    clearScheduledRefresh();
    const delay = Math.max(new Date(expiresAt).getTime() - Date.now() - REFRESH_SKEW_MS, 0);
    refreshTimer.current = setTimeout(() => {
      void refreshAccessToken();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, delay);
  }, []);

  const syncIdentity = useCallback(async () => {
    try {
      const me = await authApi.me();
      setUser(me);
      setStatus("authenticated");
    } catch (err) {
      clearSession();
      throw err;
    }
  }, [clearSession]);

  const applySession = useCallback(
    async (token: string, expiresAt: string) => {
      applyToken(token, expiresAt);
      await syncIdentity();
    },
    [applyToken, syncIdentity],
  );

  // Passed to the API client's 401 interceptor, and reused for the
  // proactive timer above and the initial-mount bootstrap below. A missed
  // proactive refresh (backgrounded tab, clock drift) is recovered
  // reactively the next time any request comes back 401.
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await authApi.refresh();
      applyToken(res.access_token, res.access_token_expires_at);
      return res.access_token;
    } catch {
      clearSession();
      return null;
    }
  }, [applyToken, clearSession]);

  useEffect(() => {
    configureApiClient({
      getAccessToken: () => accessTokenRef.current,
      refreshAccessToken,
      onAuthFailure: clearSession,
    });

    void (async () => {
      const token = await refreshAccessToken();
      if (!token) return;
      try {
        await syncIdentity();
      } catch {
        // clearSession already ran inside syncIdentity's catch
      }
    })();

    return clearScheduledRefresh;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email, password);
      await applySession(res.access_token, res.access_token_expires_at);
    },
    [applySession],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.register(email, password);
      await applySession(res.access_token, res.access_token_expires_at);
    },
    [applySession],
  );

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      const res = await authApi.loginWithGoogle(idToken);
      await applySession(res.access_token, res.access_token_expires_at);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      if (!(err instanceof ApiError)) throw err;
    } finally {
      clearSession();
    }
  }, [clearSession]);

  return (
    <AuthContext.Provider value={{ status, user, accessToken, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
