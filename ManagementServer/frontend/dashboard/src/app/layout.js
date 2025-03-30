'use client';

import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const showNavbar = !pathname.startsWith('/dashboard');

  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {showNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
