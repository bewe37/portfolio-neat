"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { playClick } from "@/lib/click-sound"

const LINKS = [
  { label: "Email",    handle: "bryanwinata112@gmail.com", href: "mailto:bryanwinata112@gmail.com"      },
  { label: "LinkedIn", handle: "/in/gbryanw",              href: "https://www.linkedin.com/in/gbryanw/" },
  { label: "Twitter",  handle: "@gbryanwt",                href: "https://x.com/gbryanwt"               },
]

const ORANGE = "rgb(255,107,48)"

export default function ContactList() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {LINKS.map(({ label, handle, href }, i, arr) => (
        <div key={label} style={{
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          padding: "8px 0", gap: 12,
          borderBottom: i < arr.length - 1 ? "1px solid var(--divider)" : "none",
        }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
            {label}
          </span>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playClick()}
            onMouseEnter={() => setHovered(label)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex", alignItems: "center", gap: 3,
              fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400,
              color: hovered === label ? ORANGE : "var(--c-faint)",
              letterSpacing: "-0.01em", textDecoration: "none",
              transition: "color 0.15s ease",
            }}
          >
            {handle}
            <motion.span
              animate={{
                rotate: hovered === label ? 45 : 0,
                x:      hovered === label ? 1 : 0,
                y:      hovered === label ? -1 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              style={{ fontSize: 11, display: "inline-block", originX: "50%", originY: "50%" }}
            >
              ↗
            </motion.span>
          </a>
        </div>
      ))}
    </div>
  )
}
