import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {InventoryContextProvider} from "@/context/InventoryContext";
import {Toaster} from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "Cautiontape Robotics inventory management system. Created by Justin Abuyuan.",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode }>) {
    return (
    <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`} // TODO: ADD THEME TOGGLE
        >
            <StackProvider app={stackServerApp}>
                <StackTheme>
                    <InventoryContextProvider>
                        {children}
                        <Toaster />
                    </InventoryContextProvider>
                </StackTheme>
            </StackProvider>
        </body>
    </html>
    );
}
