import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { StoreProvider } from "@/components/store-provider";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mi Dieta",
  description: "Plan nutricional semanal",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mi Dieta",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geist.className} antialiased`}>
        <StoreProvider>
          <div className="flex flex-col h-screen overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
