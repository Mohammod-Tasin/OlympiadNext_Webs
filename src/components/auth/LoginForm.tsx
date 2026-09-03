"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { ApiError } from "@/lib/api/client";
import { sendEmailOTP, verifyEmailOTP } from "@/lib/api/authApi";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "./OtpInput";
import { GoogleSignInButton } from "./GoogleSignInButton";

const OTP_LENGTH = 6;

/** The backend rejects login for an account whose email is still unverified;
 * treat that one case as recoverable in-place via the OTP flow. */
function isUnverifiedEmail(err: unknown): boolean {
  return err instanceof ApiError && (err.status === 403 || /verif/i.test(err.message));
}

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      router.push("/dashboard");
    } catch (err) {
      if (isUnverifiedEmail(err)) {
        setNeedsVerification(true);
        setOtp("");
        setError("Your email isn't verified yet. Enter the code we sent you, or resend it.");
      } else {
        setError(err instanceof ApiError ? err.message : "Login failed");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      await sendEmailOTP(email.trim());
      setNotice(`We sent a new code to ${email.trim()}.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend the code");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      await verifyEmailOTP(email.trim(), otp);
      // Credentials are still in state, so finish the sign-in the user started.
      await login(email.trim(), password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid or expired code");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-xl font-bold text-olympiad-900">
          {needsVerification ? "Verify your email" : "Welcome Back"}
        </h1>
        <p className="mt-1 text-sm text-olympiad-800/70">
          {needsVerification
            ? `Enter the 6-digit code sent to ${email.trim()}.`
            : "Log in to continue to your dashboard."}
        </p>
      </CardHeader>

      <CardContent>
        {needsVerification ? (
          <form onSubmit={handleVerify} className="flex flex-col items-center gap-5">
            <OtpInput value={otp} onChange={setOtp} disabled={submitting} />

            {notice && <p className="text-sm text-emerald-600">{notice}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              loading={submitting}
              disabled={otp.length < OTP_LENGTH}
              className="w-full"
            >
              Verify & sign in
            </Button>

            <button
              type="button"
              onClick={handleResend}
              disabled={submitting}
              className="text-sm font-medium text-olympiad-500 hover:text-olympiad-800 disabled:opacity-60"
            >
              Resend code
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input
                id="email"
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                id="password"
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" loading={submitting} className="mt-2 w-full">
                {submitting ? "Logging in..." : "Log in"}
              </Button>
            </form>

            <div className="my-4 flex items-center gap-3 text-xs uppercase text-olympiad-800/50">
              <span className="h-px flex-1 bg-olympiad-50" />
              or
              <span className="h-px flex-1 bg-olympiad-50" />
            </div>

            <GoogleSignInButton onError={setError} />
          </>
        )}
      </CardContent>

      <CardFooter>
        <p className="text-sm text-olympiad-800/80">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-olympiad-500 hover:text-olympiad-800">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
