import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";
import { ThemeProvider } from "@/components/ThemeInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ImageUpload",
  description: "Una aplicación sencilla para subir y gestionar imágenes.",
  icons: {
    icon: '/resources/logo-small.svg',
    shortcut: '/resources/logo-small-32x32.png'  // opcional fallback PNG
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>

      </body>
    </html>
  );
}
