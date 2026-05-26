import type { Metadata } from "next"
import "./globals.css"
import PageTransition from "@/components/PageTransition"
import SharedNav from "@/components/SharedNav"
import MobileMenu from "@/components/MobileMenu"
import { Geist, Playfair_Display, Gabriela } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const gabriela = Gabriela({ subsets: ['latin'], weight: '400', variable: '--font-gabriela', display: 'swap' });

export const metadata: Metadata = {
  title: "Georgius Bryan",
  description: "Product designer based in Toronto.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, playfair.variable, gabriela.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){if(localStorage.getItem('theme')==='light')document.body&&document.body.classList.remove('dark')})()` }} />
      </head>
      <body className="dark">
        <SharedNav />
        <MobileMenu />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
