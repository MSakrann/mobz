import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";

import "@drape/app/globals.css";

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Drape",
  description: "Studio product photos from a phone shot.",
};

export const viewport: Viewport = {
  themeColor: "#12191B",
};

export default function DrapeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={onest.className}>{children}</div>;
}
