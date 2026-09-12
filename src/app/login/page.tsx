import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | OlympiadNext",
  description: "Log in to your OlympiadNext account to manage your olympiad registrations and results.",
};

export default function LoginPage() {
  return (
    <div className="page-center">
      <LoginForm />
    </div>
  );
}
