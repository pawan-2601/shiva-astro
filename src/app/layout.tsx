import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/context/AuthContext";
import { BookingProvider } from "@/context/BookingContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://loquacious-starlight-a7767b.netlify.app"),
  title: "Shiva Astro Solutions | Premium Vedic Astrology by Acharya Shri Shiv Kumar Shukla",
  description: "Authentic Vedic astrology consultations by Acharya Shri Shiv Kumar Shukla with over 45 years of experience. Get clarity on career, relationships, and health.",
  keywords: ["Vedic Astrology", "Janam Kundli", "Kundli Matching", "Best Astrologer in Navi Mumbai", "Career Astrology", "Online Astrologer"],
  authors: [{ name: "Acharya Shri Shiv Kumar Shukla" }],
  openGraph: {
    title: "Shiva Astro Solutions | Premium Vedic Astrology",
    description: "Authentic Vedic astrology consultations by Acharya Shri Shiv Kumar Shukla. 45+ years of trusted experience.",
    url: "https://loquacious-starlight-a7767b.netlify.app",
    siteName: "Shiva Astro Solutions",
    images: [
      {
        url: "/acharya.jpg",
        width: 1200,
        height: 630,
        alt: "Shiva Astro Solutions",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shiva Astro Solutions | Premium Vedic Astrology",
    description: "Authentic Vedic astrology consultations by Acharya Shri Shiv Kumar Shukla.",
    images: ["/acharya.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Shiva Astro Solutions",
    "image": "https://loquacious-starlight-a7767b.netlify.app/acharya.jpg",
    "@id": "https://loquacious-starlight-a7767b.netlify.app",
    "url": "https://loquacious-starlight-a7767b.netlify.app",
    "telephone": "+919892784073",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Office 301, Kamdhenu 23 West, Kopar Khairane",
      "addressLocality": "Navi Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "400710",
      "addressCountry": "IN"
    },
    "founder": {
      "@type": "Person",
      "name": "Acharya Shri Shiv Kumar Shukla"
    }
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
        <AuthProvider>
          <BookingProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
