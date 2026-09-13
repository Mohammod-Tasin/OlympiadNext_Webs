import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Stepper } from "@/components/ui/Stepper";

export const metadata: Metadata = {
  title: "Register | OlympiadNext",
  description: "Create an OlympiadNext account to register for national academic olympiads.",
};

export default function RegisterPage() {
  return (
    <div className="page-center">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Stepper currentStep="account" />
        <RegisterForm />
      </div>
    </div>
  );
}
