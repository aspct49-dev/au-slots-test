import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import { AuthProvider } from "@/context/AuthContext";
import Particles from "@/components/Particles";
import ScrollProgress from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: "AUSlotsRewards — Stream. Earn. Win.",
  description:
    "Australia's #1 streaming rewards community. Earn points watching AUSlots live on Kick, compete on leaderboards, enter raffles, and win prizes.",
  keywords: ["auslots", "streaming rewards", "kick streamer", "slots", "casino", "australia"],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "AUSlotsRewards — Stream. Earn. Win.",
    description: "Australia's #1 streaming rewards community.",
    type: "website",
    url: "https://auslotsrewards.com",
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
