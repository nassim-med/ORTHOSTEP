import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const metadataBase = siteUrl ? new URL(siteUrl) : undefined;

const openGraph = {
  title: "ORTHOSTEP | Orthopedic Shoes et Semelles",
  description: "Premium orthopedic footwear brand with support, comfort, and medical-grade posture benefits.",
  type: "website" as const,
  images: [
    {
      url: "https://images.unsplash.com/photo-1528701800489-20d0d0c32d20?auto=format&fit=crop&w=1200&q=80",
      width: 1200,
      height: 630,
      alt: "ORTHOSTEP orthopedic shoes"
    }
  ]
};

export const metadata = {
  title: "ORTHOSTEP | Orthopedic Shoes et Semelles",
  description: "ORTHOSTEP orthopedic shoes and insoles designed for comfort, support, and healthy movement.",
  ...(metadataBase ? { metadataBase } : {}),
  openGraph: siteUrl ? { ...openGraph, url: siteUrl } : openGraph,
  twitter: {
    card: "summary_large_image",
    title: "ORTHOSTEP | Orthopedic Shoes et Semelles",
    description: "Premium orthopedic footwear brand with support, comfort, and medical-grade posture benefits."
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
