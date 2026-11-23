import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giveaways",
  description: "Join our community giveaways. Regular prizes for loyal stream viewers including free spins, cash, and merchandise.",
  alternates: { canonical: "https://theausofficial.com/giveaways" },
  openGraph: {
    title: "Giveaways | TheAusOfficial",
    description: "Join our community giveaways. Regular prizes for loyal stream viewers.",
    url: "https://theausofficial.com/giveaways",
  },
};

export default function GiveawaysLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
