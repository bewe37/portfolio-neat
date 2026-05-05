"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { EnvelopeSimple, LinkedinLogo, XLogo } from "@phosphor-icons/react"
import { playClick } from "@/lib/click-sound"

const LINKS = [
  { Icon: EnvelopeSimple, label: "Email",    handle: "bryanwinata112@gmail.com", href: "mailto:bryanwinata112@gmail.com"      },
  { Icon: LinkedinLogo,   label: "LinkedIn", handle: "/in/gbryanw",              href: "https://www.linkedin.com/in/gbryanw/" },
  { Icon: XLogo,          label: "X",        handle: "@gbryanwt",                href: "https://x.com/gbryanwt"               },
]

export default function ContactList() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {LINKS.map(({ Icon, label, handle, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playClick()}
          onMouseEnter={() => setHovered(label)}
          onMouseLeave={() => setHovered(null)}
          style={{
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "space-between",
            padding:         "10px 12px",
            borderRadius:    8,
            textDecoration:  "none",
            color:           "inherit",
            backgroundColor: hovered === label ? "var(--hover-bg)" : "transparent",
            transition:      "background-color 0.15s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon size={15} weight="regular" color="var(--c-secondary)" />
            <span style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      14,
              fontWeight:    500,
              color:         "var(--c-body)",
              letterSpacing: "-0.01em",
            }}>
              {label}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="rsp-handle" style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      14,
              fontWeight:    400,
              color:         hovered === label ? "rgb(255,107,48)" : "var(--c-dim)",
              letterSpacing: "-0.01em",
              transition:    "color 0.18s ease",
            }}>
              {handle}
            </span>
            <motion.span
              animate={{ rotate: hovered === label ? 45 : 0, color: hovered === label ? "rgb(255,107,48)" : "var(--c-faint)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ fontSize: 13, display: "inline-block" }}
            >↗</motion.span>
          </div>
        </a>
      ))}
    </div>
  )
}
