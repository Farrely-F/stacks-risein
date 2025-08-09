import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Quantum Tic Tac Toe",
  description: "Play Tic Tac Toe with a quantum twist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable}  antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
