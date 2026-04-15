import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slot Reviews",
  description: "Honest slot reviews from AUSlots — RTP, volatility, features, and streamer ratings for Gates of Olympus, Sweet Bonanza, Wanted Dead or Wild, and more.",
  alternates: { canonical: "https://auslotsrewards.com/reviews" },
  openGraph: {
    title: "Slot Reviews | AUSlotsRewards",
    description: "Honest slot reviews from AUSlots — RTP, volatility, features, and streamer ratings.",
    url: "https://auslotsrewards.com/reviews",
  },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
