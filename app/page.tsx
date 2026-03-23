import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to My App — a production-ready Next.js starter with Material You design.",
};

export default function Page() {
  return <HomePage />;
}
