import {
  Archivo as FontDisplay,
  Inter as FontSans,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontDisplay = FontDisplay({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
});

