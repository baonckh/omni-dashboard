import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "OmniAI documentation — learn how to set up your bot, integrate channels, use the API, and more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
