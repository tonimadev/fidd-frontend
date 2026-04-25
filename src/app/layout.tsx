import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});
import { AuthProvider } from "@/context/auth-context";
import { GoogleAuthProvider } from "@/context/google-auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIDD - Cartões de Selos Virtuais",
  description: "Plataforma de gerenciamento de clubes de selos para lojas e estabelecimentos comerciais.",
  keywords: ["clube de selos", "cartão de selos", "fidd", "marketing", "retenção de clientes", "selos", "recompensas"],
  authors: [{ name: "FIDD Team" }],
  creator: "FIDD Team",
  publisher: "FIDD",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://fidd.com.br"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FIDD - Cartões de Selos Virtuais",
    description: "Aumente a retenção de seus clientes com nossa plataforma de clube de selos digital.",
    url: "https://fidd.com.br",
    siteName: "FIDD",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/fidd.png",
        width: 1200,
        height: 630,
        alt: "FIDD - Cartões de Selos Virtuais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FIDD - Cartões de Selos Virtuais",
    description: "Gerencie seu clube de selos de forma simples e segura.",
    images: ["/fidd.png"],
  },
  icons: {
    icon: "/fidd.png",
    apple: "/fidd.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { QueryProvider } from "@/context/query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <GoogleAuthProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </GoogleAuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
