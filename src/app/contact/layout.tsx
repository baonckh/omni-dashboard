import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with OmniAI — contact our team for support, partnership inquiries, or general questions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
