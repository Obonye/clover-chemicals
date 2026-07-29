import {
  Archivo as FontDisplay,
  Inter as FontSans,
  Space_Mono as FontMono,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const fontDisplay = FontDisplay({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
});
