import type { Metadata } from "next"
import "./globals.css"
import ShadowBg from "@/components/ShadowBg"
import PageTransition from "@/components/PageTransition"
import SharedNav from "@/components/SharedNav"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { DialRoot } from "dialkit"
import "dialkit/styles.css"

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Georgius Bryan",
  description: "Design engineer at AMD based in Toronto.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
      </head>
      <body>
        <ShadowBg />
        <SharedNav />
        <PageTransition>{children}</PageTransition>
        <DialRoot position="bottom-left" />
      </body>
    </html>
  )
}
