import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giveaways",
  description: "Join AUSlots community giveaways. Regular prizes for loyal stream viewers including free spins, cash, and merchandise.",
  alternates: { canonical: "https://auslotsrewards.com/giveaways" },
  openGraph: {
    title: "Giveaways | AUSlotsRewards",
    description: "Join AUSlots community giveaways. Regular prizes for loyal stream viewers.",
    url: "https://auslotsrewards.com/giveaways",
  },
};

export default function GiveawaysLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
