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

const MIN_PASSWORD_LENGTH = 8;
const OTP_LENGTH = 6;

type Step = "form" | "otp" | "verified";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    setSubmitting(true);
    try {
      await register({
        email: email.trim(),
        password,
      });
      setOtp("");
      setStep("otp");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await verifyEmailOTP(email.trim(), otp);
      setStep("verified");
      router.push("/login");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid or expired code");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError(null);
    setSubmitting(true);
    try {
      await sendEmailOTP(email.trim());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend the code");
    } finally {
      setSubmitting(false);
    }
  }

  if (step !== "form") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-xl font-bold text-olympiad-900">Verify your email</h1>
          <p className="mt-1 text-sm text-olympiad-800/70">
            {step === "verified"
              ? "Your email is verified. Redirecting you to login…"
              : `Enter the 6-digit code we sent to ${email}.`}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleVerify} className="flex flex-col items-center gap-5">
            <OtpInput value={otp} onChange={setOtp} disabled={submitting || step === "verified"} />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              loading={submitting}
              disabled={otp.length < OTP_LENGTH || step === "verified"}
              className="w-full"
            >
              Verify email
            </Button>

            <button
              type="button"
              onClick={handleResend}
              disabled={submitting || step === "verified"}
              className="text-sm font-medium text-olympiad-500 hover:text-olympiad-800 disabled:opacity-60"
            >
              Resend code
            </button>
          </form>
        </CardContent>

        <CardFooter>
          <p className="text-sm text-olympiad-800/80">
            Already verified?{" "}
            <Link href="/login" className="font-medium text-olympiad-500 hover:text-olympiad-800">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-xl font-bold text-olympiad-900">Create an Account</h1>
        <p className="mt-1 text-sm text-olympiad-800/70">Register to start competing in olympiads.</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
            minLength={MIN_PASSWORD_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="text-xs text-olympiad-800/60">
            You&apos;ll add your name, institution and academic details after verifying your email.
          </p>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" loading={submitting} className="mt-2 w-full">
            {submitting ? "Creating account..." : "Register"}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs uppercase text-olympiad-800/50">
          <span className="h-px flex-1 bg-olympiad-50" />
          or
          <span className="h-px flex-1 bg-olympiad-50" />
        </div>

        <GoogleSignInButton onError={setError} />
      </CardContent>

      <CardFooter>
        <p className="text-sm text-olympiad-800/80">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-olympiad-500 hover:text-olympiad-800">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
