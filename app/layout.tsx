import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--f-display-next",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-sans-next",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--f-body-next",
  display: "swap",
});
const jetMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--f-mono-next",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#060e1c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://simoneldavid.com"),
  title: "Simonel David - Business Development Director, ROSPIN",
  description:
    "Simonel-Olimpiu David. Business Development Director for ROSPIN. DevOps engineer at COERA. EO Platform PM at AIM-SPACE. Connecting cloud infrastructure to orbital ambition. Based in Cluj-Napoca, Romania.",
  openGraph: {
    title: "Simonel David - Business Development Director, ROSPIN",
    description:
      "Connecting cloud infrastructure to orbital ambition. Building Romania's space economy from Cluj-Napoca.",
    images: ["/assets/portrait-hero.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simonel David - Business Development Director, ROSPIN",
    description:
      "Connecting cloud infrastructure to orbital ambition. Building Romania's space economy from Cluj-Napoca.",
    images: ["/assets/portrait-hero.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontClass = `${fraunces.variable} ${spaceGrotesk.variable} ${inter.variable} ${jetMono.variable}`;
  return (
    <html lang="en" className={fontClass}>
      <body>{children}</body>
    </html>
  );
}
