import type {Metadata} from "next";
import Script from "next/script";
import type {ReactNode} from "react";
import "./globals.css";

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
const title = "European Tech Internships 2027";
const description =
  "Search and filter open software, data, security, and technology internships across Europe for the 2027 cycle.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {default: title, template: `%s | ${title}`},
  description,
  applicationName: title,
  authors: [{name: "Simone Siega", url: "https://simonesiega.com"}],
  creator: "Simone Siega",
  publisher: "Simone Siega",
  alternates: {canonical: "/"},
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: title,
    title,
    description,
    images: [{url: "/opengraph-image", width: 1200, height: 630, alt: title}],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
  robots: {index: true, follow: true},
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
