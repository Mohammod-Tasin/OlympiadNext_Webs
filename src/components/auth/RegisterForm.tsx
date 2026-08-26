"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { ApiError } from "@/lib/api/client";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { LEVEL_OPTIONS, MEDIUM_OPTIONS } from "@/lib/constants/academic";

const MIN_PASSWORD_LENGTH = 8;

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [level, setLevel] = useState("");
  const [medium, setMedium] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    setSubmitting(true);
    try {
      await register({
        email,
        password,
        full_name: fullName.trim(),
        institution_name: institutionName.trim(),
        level,
        medium,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-xl font-bold text-olympiad-900">Create an Account</h1>
        <p className="mt-1 text-sm text-olympiad-800/70">Register to start competing in olympiads.</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="full-name"
            label="Full name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

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

          <Input
            id="institution"
            label="Institution name"
            type="text"
            required
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
          />

          <Select id="level" label="Level" required value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="" disabled>
              Select your level
            </option>
            {LEVEL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>

          <Select id="medium" label="Medium" required value={medium} onChange={(e) => setMedium(e.target.value)}>
            <option value="" disabled>
              Select your medium
            </option>
            {MEDIUM_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>

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
