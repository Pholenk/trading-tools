import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/components/atoms/ReduxProvider";
import { ThemeProvider } from "@/components/atoms/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "My App",
    template: "%s | My App",
  },
  description: "A Next.js application built with Material You design system.",
  keywords: ["Next.js", "TypeScript", "Material You", "React"],
  authors: [{ name: "My App" }],
  creator: "My App",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "My App",
    title: "My App",
    description: "A Next.js application built with Material You design system.",
  },
  twitter: {
    card: "summary_large_image",
    title: "My App",
    description: "A Next.js application built with Material You design system.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
