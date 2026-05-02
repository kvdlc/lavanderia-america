import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BackToTop } from "@/components/ui/BackToTop";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Lavandería América — Limpieza con Estándares de Acero",
    template: "%s | Lavandería América",
  },
  description:
    "Lavandería industrial para el sector minero y corporativo. Servicio de lavado de frazadas, edredones y ropa industrial con los más altos estándares de calidad.",
  keywords: "lavandería, industrial, minería, frazadas, edredones, ropa industrial, Perú",
  openGraph: {
    title: "Lavandería América — Limpieza con Estándares de Acero",
    description: "Lavandería industrial para el sector minero y corporativo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans">
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
