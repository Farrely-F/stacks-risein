import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/contexts/WalletContext";
import { AuctionProvider } from "@/contexts/AuctionContext";
import { Toaster } from "@/components/ui/sonner";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "Stacks Auction - Decentralized NFT Auction Platform",
  description:
    "A decentralized auction platform built on the Stacks blockchain for NFT trading with transparent and secure smart contracts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} antialiased`}>
        <WalletProvider>
          <AuctionProvider>
            {children}
            <Toaster />
          </AuctionProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
