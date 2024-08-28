import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRM Gálago",
  description: "Ferramenta para registro de atendimento Gálago",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
