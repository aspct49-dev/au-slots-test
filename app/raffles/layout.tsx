import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raffles",
  description: "Enter AUSlots raffles using your stream points. Win cash prizes, free spins, and exclusive rewards. New raffles added regularly.",
  alternates: { canonical: "https://auslotsrewards.com/raffles" },
  openGraph: {
    title: "Raffles | AUSlotsRewards",
    description: "Enter AUSlots raffles using your stream points. Win cash prizes, free spins, and exclusive rewards.",
    url: "https://auslotsrewards.com/raffles",
  },
};

export default function RafflesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
