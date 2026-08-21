const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type TokenGetter = () => string | null;
type RefreshHandler = () => Promise<string | null>;

let getAccessToken: TokenGetter = () => null;
let refreshAccessToken: RefreshHandler = async () => null;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Wires the client to the app's auth state. Called once by AuthProvider on
 * mount so every apiFetch call can attach the current access token and
 * recover from a 401 without any component owning fetch/refresh logic.
 */
export function configureApiClient(config: { getAccessToken: TokenGetter; refreshAccessToken: RefreshHandler }) {
  getAccessToken = config.getAccessToken;
  refreshAccessToken = config.refreshAccessToken;
}

/** Coalesces concurrent 401s onto a single in-flight refresh call. */
function refreshOnce(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

interface FetchOptions {
  method?: string;
  body?: unknown;
  /** Skip attaching the access token and skip 401 retry — for endpoints
   * that run before a session exists (login, register, refresh, logout). */
  skipAuth?: boolean;
}

function doFetch(path: string, options: FetchOptions, token: string | null): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
}

/**
 * Every request includes credentials so the browser attaches/receives the
 * HttpOnly refresh-token cookie. The access token, when present, is sent
 * as a Bearer header rather than a cookie so it is never persisted by the
 * browser. A 401 on an authenticated request triggers one shared silent
 * refresh; the failed request is retried once with the new token.
 */
export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const token = options.skipAuth ? null : getAccessToken();
  let res = await doFetch(path, options, token);

  if (res.status === 401 && !options.skipAuth) {
    const newToken = await refreshOnce();
    if (newToken) {
      res = await doFetch(path, options, newToken);
    }
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data && typeof data === "object" && "error" in data ? String(data.error) : null) ?? res.statusText;
    throw new ApiError(res.status, message);
  }

  return data as T;
}
