import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About OmniAI",
  description:
    "Learn about OmniAI — our mission to help Vietnamese SMEs automate customer care with AI omnichannel platform.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
