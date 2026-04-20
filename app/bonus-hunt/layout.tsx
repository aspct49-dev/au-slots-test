import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bonus Hunt",
  description: "Follow AUSlots bonus hunts live. Guess the final balance to win prizes and earn extra points. Updated in real time during streams.",
  alternates: { canonical: "https://theausofficial.com/bonus-hunt" },
  openGraph: {
    title: "Bonus Hunt | TheAusOfficial",
    description: "Follow AUSlots bonus hunts live. Guess the final balance to win prizes.",
    url: "https://theausofficial.com/bonus-hunt",
  },
};

export default function BonusHuntLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
