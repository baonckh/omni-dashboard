import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "OmniAI Privacy Policy — how we collect, use, and protect your data. Comply with GDPR, Vietnamese Decree 13/2023, and CCPA.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
