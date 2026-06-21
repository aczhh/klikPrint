import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/AppContext";

export const metadata: Metadata = {
  title: "Klikprint - Presisi Digital dalam Setiap Cetakan",
  description: "Layanan pencetakan digital berkualitas tinggi untuk dokumen, foto, poster, dan kebutuhan marketing Anda.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
