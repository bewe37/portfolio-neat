"use client"

import { useState } from "react"
import { playClick } from "@/lib/click-sound"

function NavLink({ href, label }: { href: string; label: string }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={href}
      onClick={() => playClick()}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily:    "var(--font-sans)",
        fontSize:      14,
        fontWeight:    500,
        letterSpacing: "-0.01em",
        color:         hov ? "rgb(255,107,48)" : "var(--c-dim)",
        transition:    "color 0.15s ease",
        textDecoration: "none",
        padding:       "4px 0",
        whiteSpace:    "nowrap",
      }}
    >
      {label}
    </a>
  )
}


export default function HeaderNav() {
  return (
    <nav style={{ display: "inline-flex", alignItems: "center", gap: 20 }}>
      <NavLink href="/"      label="Work"  />
      <NavLink href="/about" label="About" />
    </nav>
  )
}
