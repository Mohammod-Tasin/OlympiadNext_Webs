"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { ApiError } from "@/lib/api/client";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-xl font-bold text-olympiad-900">Welcome Back</h1>
        <p className="mt-1 text-sm text-olympiad-800/70">Log in to continue to your dashboard.</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
