import type { Metadata } from "next";
import localFont from "next/font/local";
import { RequestProvider } from "@/components/request-context";
import "./globals.css";

const archivo = localFont({
  src: [
    {
      path: "../public/fonts/archivo-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/archivo-bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});
const sans = localFont({
  src: [
    {
      path: "../public/fonts/dm-sans-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/dm-sans-semibold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});
const serif = localFont({
  src: [
    {
      path: "../public/fonts/lora-regular.ttf",
      weight: "400",
      style: "normal",
    },
    { path: "../public/fonts/lora-italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "McGarrett — Two homepage directions",
  description:
    "Explore two thoughtfully designed homepage concepts for McGarrett A/C & Heating in Tomball and Greater Houston.",
  robots: { index: false, follow: false },
  icons: { icon: "/images/mcgarrett-logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${sans.variable} ${serif.variable}`}
      >
        <RequestProvider>{children}</RequestProvider>
      </body>
    </html>
  );
}
