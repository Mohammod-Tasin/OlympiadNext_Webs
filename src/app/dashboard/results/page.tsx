import type { Metadata } from "next";
import { ResultsClient } from "./ResultsClient";

export const metadata: Metadata = {
  title: "Results | OlympiadNext",
  description: "Your round-by-round results across registered olympiad events.",
};

export default function ResultsPage() {
  return <ResultsClient />;
}
