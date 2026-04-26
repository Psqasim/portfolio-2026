import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { Preloader } from "@/components/layout/Preloader";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { personSchema } from "@/lib/jsonld";
import { personal } from "@/data/personal";
import "./globals.css";

const SITE_URL = "https://psqasim-portfolio-2026.vercel.app";

const inter = localFont({
  src: "../fonts/InterVariable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const notoJP = localFont({
  src: "../fonts/NotoSansJP-400.woff2",
  variable: "--font-noto-jp",
  display: "swap",
  weight: "400",
});

const jetbrains = localFont({
  src: "../fonts/JetBrainsMono-400.woff2",
  variable: "--font-jetbrains",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Muhammad Qasim — Agentic AI Engineer",
    template: "%s · Muhammad Qasim",
  },
  description:
    "Agentic AI Engineer in Karachi, Pakistan. Builds autonomous AI systems that run 24/7 — MCP servers, multi-agent orchestration, and production-grade agent workflows.",
  applicationName: "Muhammad Qasim — Portfolio",
  authors: [{ name: "Muhammad Qasim" }],
  keywords: [
    "Agentic AI Engineer",
    "AI systems",
    "MCP servers",
    "multi-agent orchestration",
    "Muhammad Qasim",
    "Karachi",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Muhammad Qasim — Agentic AI Engineer",
    description:
      "Autonomous AI systems that run 24/7. 5 shipped systems, 200+ tests passing, deployed on cloud.",
    siteName: "Muhammad Qasim — Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Muhammad Qasim — Agentic AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Qasim — Agentic AI Engineer",
    description:
      "Autonomous AI systems that run 24/7. 6 shipped, 200+ tests, deployed on cloud.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = JSON.stringify(personSchema(personal));
  const fontClass = `${inter.variable} ${notoJP.variable} ${jetbrains.variable}`;

  return (
    <html lang="en" suppressHydrationWarning className={fontClass}>
      <body className="antialiased">
        <ThemeProvider>
          <MotionProvider>
            <Preloader />
            <Navbar />
            <ToastProvider>
              {children}
              <Footer />
            </ToastProvider>
            <ChatWidget />
          </MotionProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </body>
    </html>
  );
}
