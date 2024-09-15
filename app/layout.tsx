import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Inter as FontSans } from "next/font/google"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "selectaraunt",
  description: "The fastest way to build apps with Next.js and Supabase",
  icons: {
    icon: '/favicon.ico'
  }
};

import { cn } from "@/lib/utils"
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className='h-full w-full' >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={cn(
          "h-svh bg-background font-sans antialiased",
          fontSans.variable
        )}

      >{children}</body>
      {/* <body className="w-full h-full bg-background text-foreground"> */}
      {/* </body> */}
    </html>
  );
}
