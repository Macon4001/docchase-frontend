import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { NotificationProvider } from "@/components/NotificationProvider";

export const metadata: Metadata = {
  title: "Gettingdocs - AI Document Collection Assistant for Accountants",
  description: "Accountants spend up to 3 hours daily chasing documents. Cut that time in half with AI-powered WhatsApp automation. Stop chasing clients and start collecting documents automatically.",
  keywords: [
    "document collection for accountants",
    "accounting document automation",
    "WhatsApp document collection",
    "accountant productivity tools",
    "client document chasing",
    "accounting workflow automation",
    "AI document assistant",
    "automated document reminders",
    "accounting practice management",
    "document management for accountants",
    "time saving tools for accountants",
    "client communication automation",
    "bookkeeping document collection",
    "tax document collection",
    "VAT return documents",
  ],
  authors: [{ name: "Gettingdocs" }],
  creator: "Blue Haven Digital",
  publisher: "Gettingdocs",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://gettingdocs.com",
    siteName: "Gettingdocs",
    title: "Gettingdocs - Stop Chasing Documents, Start Collecting",
    description: "Accountants spend up to 3 hours daily chasing documents. AI-powered WhatsApp automation cuts that time in half.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gettingdocs - AI Document Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gettingdocs - AI Document Collection Assistant",
    description: "Cut document chasing time in half with AI-powered WhatsApp automation for accountants",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <Providers>
          <NotificationProvider>
            {children}
            <Toaster position="bottom-right" richColors expand={true} />
          </NotificationProvider>
        </Providers>
      </body>
    </html>
  );
}
