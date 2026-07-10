import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { siteConfig } from "../config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: siteConfig.nome,

  description: siteConfig.descricao,

  applicationName: siteConfig.nome,

  authors: [
    {
      name: siteConfig.nome,
    },
  ],

  creator: siteConfig.nome,

  publisher: siteConfig.nome,

  verification: {
    google: "WM3OPapFJe5xi4XlDz4H3i6hQ-KPmAEUK9piDowmkZM",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: siteConfig.nome,
    description: siteConfig.descricao,
    url: siteConfig.url,
    siteName: siteConfig.nome,
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.nome,
    description: siteConfig.descricao,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <Header />
        {children}
        <Footer />
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  );
}