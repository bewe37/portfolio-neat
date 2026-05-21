import type { Metadata } from "next"
import "./globals.css"
import PageTransition from "@/components/PageTransition"
import SharedNav from "@/components/SharedNav"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Georgius Bryan",
  description: "Product designer based in Toronto.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
      </head>
      <body className="dark">
        <SharedNav />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
