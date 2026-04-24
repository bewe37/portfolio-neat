import type { Metadata } from "next"
import "./globals.css"
import ShadowBg from "@/components/ShadowBg"

export const metadata: Metadata = {
  title: "Georgius — Product Designer",
  description: "Design engineer at AMD based in Toronto.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ShadowBg />
{children}
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
