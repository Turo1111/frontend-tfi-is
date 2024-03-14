
'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import { createGlobalStyle } from "styled-components";
import { Provider } from "react-redux";
import Alerta from "@/components/Alerta";
import { store } from "@/redux/store";



const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store} >
          <Alerta/>
          {children}
        </Provider>
      </body>
    </html>
  );
}
