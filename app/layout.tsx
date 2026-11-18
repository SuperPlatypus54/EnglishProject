import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const assetStyles = {
  "--workstation-wallpaper": `url("${basePath}/workstation.webp")`,
  "--workstation-wallpaper-mobile": `url("${basePath}/workstation-mobile.webp")`,
  "--family-contact-sheet": `url("${basePath}/photos/family-contact-sheet.webp")`,
} as CSSProperties;

export const metadata: Metadata = {
  title: "James Bond's Computer",
  description: "Examine the recovered MeridianOS workstation from The Grand Meridian.",
  applicationName: "MeridianOS",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1523",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={assetStyles}>{children}</body>
    </html>
  );
}
