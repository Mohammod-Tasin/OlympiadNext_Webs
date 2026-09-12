import type { Metadata } from "next";
import { PaymentClient } from "./PaymentClient";

export const metadata: Metadata = {
  title: "Complete Payment | OlympiadNext",
  description: "Submit your bKash/Nagad payment details to complete your olympiad registration.",
};

export default function PaymentPage() {
  return <PaymentClient />;
}
