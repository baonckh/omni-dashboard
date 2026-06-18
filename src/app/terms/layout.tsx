import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "OmniAI Terms of Service — terms governing the use of the OmniAI platform, AI services, payment, and legal agreements.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
