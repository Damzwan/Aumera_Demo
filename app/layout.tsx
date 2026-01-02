import type {Metadata} from "next";
import {Pixelify_Sans} from "next/font/google";
import "./globals.css";

const gameFont = Pixelify_Sans({
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-pixel',
});

export const metadata: Metadata = {
    title: "Aumera demo",
    description: "Chat with an Aumera",
};

export default function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${gameFont.className} antialiased bg-zinc-900 text-white`}>
        {children}
        </body>
        </html>
    );
}