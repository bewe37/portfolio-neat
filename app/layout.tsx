import type { Metadata } from "next"
import "./globals.css"
import ShadowBg from "@/components/ShadowBg"
import BuddyGate from "@/components/BuddyGate"

export const metadata: Metadata = {
  title: "Georgius Bryan",
  description: "Design engineer at AMD based in Toronto.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/sqwam.png" as="image" />
      </head>
      <body>
        <ShadowBg />
        {children}
        <BuddyGate />
        <div style={{
          position:       "fixed",
          bottom:         0,
          left:           0,
          right:          0,
          height:              80,
          backdropFilter:      "blur(8px)",
          WebkitBackdropFilter:"blur(8px)",
          maskImage:           "linear-gradient(to top, black 0%, transparent 100%)",
          WebkitMaskImage:     "linear-gradient(to top, black 0%, transparent 100%)",
          pointerEvents:       "none",
          zIndex:              50,
        }} />
      </body>
    </html>
  )
}
