import type {Metadata} from "next";
import Script from "next/script";
import type {ReactNode} from "react";
import "./globals.css";

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "European Tech Internships 2027",
  description: "Open European technology internships for the 2027 cycle.",
  icons: {
    icon: "/favicon.svg",
  },
};

const themeScript = `
  try {
    var savedTheme = localStorage.getItem("internships-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = savedTheme || (prefersDark ? "dark" : "light");
  } catch (_) {}
`;

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
