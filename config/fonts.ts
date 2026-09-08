import {
  Archivo as FontDisplay,
  Inter as FontSans,
  Space_Mono as FontMono,
  Sora as FontMedicalDisplay,
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

// Clover Medical's display font — swapped in for --font-display only under
// /medical (see the `body:has([data-division="medical"])` rule in
// styles/globals.css).
export const fontMedicalDisplay = FontMedicalDisplay({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
});
