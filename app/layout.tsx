import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muchi Koi — Find a Cobbler in Dhaka",
  description: "Find the nearest cobbler in Dhaka instantly, for free. A community-driven platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#FAF8F5" />
      </head>
      <body>{children}</body>
    </html>
  );
}
