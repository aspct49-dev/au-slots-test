import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Points Shop",
  description: "Spend your AUSlots points on free spins, casino credits, and prizes. Redeem rewards from ViperSpin, Zesty.Bet, and more.",
  alternates: { canonical: "https://theausofficial.com/points-shop" },
  openGraph: {
    title: "Points Shop | TheAusOfficial",
    description: "Spend your AUSlots points on free spins, casino credits, and prizes.",
    url: "https://theausofficial.com/points-shop",
  },
};

export default function PointsShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
