
'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import { createGlobalStyle } from "styled-components";



const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
