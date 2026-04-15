import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import { AuthProvider } from "@/context/AuthContext";
import Particles from "@/components/Particles";
import ScrollProgress from "@/components/ScrollProgress";

const BASE_URL = "https://auslotsrewards.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AUSlotsRewards — Stream. Earn. Win.",
    template: "%s | AUSlotsRewards",
  },
  description:
    "Australia's #1 streaming rewards community. Earn points watching AUSlots live on Kick, enter raffles, and win prizes.",
  keywords: ["auslots", "streaming rewards", "kick streamer", "slots", "casino", "australia", "bonus hunt", "free spins"],
  authors: [{ name: "AUSlots" }],
  creator: "AUSlots",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "AUSlotsRewards — Stream. Earn. Win.",
    description: "Australia's #1 streaming rewards community. Earn points watching AUSlots live on Kick, enter raffles, and win prizes.",
    type: "website",
    url: BASE_URL,
    siteName: "AUSlotsRewards",
    images: [{ url: "/images/logo.png", width: 512, height: 512, alt: "AUSlotsRewards" }],
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "AUSlotsRewards — Stream. Earn. Win.",
    description: "Australia's #1 streaming rewards community.",
    images: ["/images/logo.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-white antialiased noise-overlay scanlines">
        <AuthProvider>
          <ScrollProgress />
          {/* Global ambient particles */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <Particles count={35} maxSize={2} speed={0.15} />
          </div>
          <div className="relative z-10">
            <Navbar />
            <main className="pt-16">{children}</main>
            <Footer />
          </div>
          <LoginModal />
        </AuthProvider>
      </body>
    </html>
  );
}
