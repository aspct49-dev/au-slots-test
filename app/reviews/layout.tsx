import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slot Reviews",
  description: "Honest slot reviews from AUSlots — RTP, volatility, features, and streamer ratings for Gates of Olympus, Sweet Bonanza, Wanted Dead or Wild, and more.",
  alternates: { canonical: "https://theausofficial.com/reviews" },
  openGraph: {
    title: "Slot Reviews | TheAusOfficial",
    description: "Honest slot reviews from AUSlots — RTP, volatility, features, and streamer ratings.",
    url: "https://theausofficial.com/reviews",
  },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
