import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/atoms";
import { ThemeProvider } from "@/components/atoms";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: "Indonesian Stock Trading Tool",
    template: "%s | ID-STRATO",
  },
  description: "A web-app that helps Indonesian traders.",
  keywords: ["Indonesia", "Stock", "Trading"],
  authors: [{ name: "Pholenk" }],
  creator: "Pholenk",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ID-STRATO",
    title: "Indonesian Stock Trading Tool",
    description: "A web-app that helps Indonesian traders.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indonesian Stock Trading Tool",
    description: "A web-app that helps Indonesian traders.",
  },
};

const NunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap"
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        NunitoSans.className
      )}
    >
      <body className="min-h-full max-w-full flex flex-col">
        <ReduxProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
