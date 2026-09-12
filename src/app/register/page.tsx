import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register | OlympiadNext",
  description: "Create an OlympiadNext account to register for national academic olympiads.",
};

export default function RegisterPage() {
  return (
    <div className="page-center">
      <RegisterForm />
    </div>
  );
}
