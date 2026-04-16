import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "View your redemption history, reward status, and points activity on AUSlotsRewards.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
