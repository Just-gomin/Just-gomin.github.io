import type { Metadata, Viewport } from "next";
import { Nanum_Gothic_Coding } from "next/font/google";
import "./globals.css";
import { BLOG_DESCRIPTION, BLOG_TITLE } from "@/features/common";
import { Nav } from "@/features/common/components";

const nanumGothicCoding = Nanum_Gothic_Coding({
  weight: ["400", "700"],
  variable: "--font-nanum-gothic-coding",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  metadataBase: new URL("https://just-gomin.github.io"),
  manifest: "/favicon/manifest.json",
  openGraph: {
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    siteName: BLOG_TITLE,
    type: "website",
    locale: "ko_KR",
    url: "/",
  },
  icons: {
    icon: [
      { url: "/favicon/android-icon-192x192.png", sizes: "192x192" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: [
      { url: "/favicon/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/favicon/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/favicon/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/favicon/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/favicon/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/favicon/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/favicon/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/favicon/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/favicon/apple-icon-180x180.png", sizes: "180x180" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#7C7365",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="msapplication-TileColor" content="#7C7365" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      </head>
      <body
        className={`${nanumGothicCoding.variable} antialiased font-nanum-gothic-coding `}
      >
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
