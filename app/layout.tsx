import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CryptoTrack | Professional Cryptocurrency Dashboard",
  description: "Track cryptocurrency prices, manage your portfolio, and stay updated with the latest crypto market trends.",
  keywords: ["cryptocurrency", "bitcoin", "ethereum", "crypto dashboard", "portfolio tracker"],
  authors: [{ name: "CryptoTrack" }],
  openGraph: {
    title: "CryptoTrack | Professional Cryptocurrency Dashboard",
    description: "Track cryptocurrency prices, manage your portfolio, and stay updated with the latest crypto market trends.",
    type: "website",
    images: ["/logo/crypto-track.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
