"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

function FooterLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500,
        letterSpacing: "-0.01em", textDecoration: "none",
        color: hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
        transition: "color 0.15s ease",
      }}
    >
      {label}
    </Link>
  )
}

function BackToTop() {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      animate={{ y: hovered ? -2 : 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "none", border: "none", cursor: "pointer", padding: 0,
        display: "inline-flex", alignItems: "center", gap: 5,
        color: hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
        fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500,
        letterSpacing: "-0.01em", transition: "color 0.15s ease",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6"
          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back to top
    </motion.button>
  )
}

export default function MarqueeFooter() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ position: "relative", width: "100%", minHeight: 260, overflow: "hidden", marginTop: 32, borderRadius: 16 }}>

      {/* Scene background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Scene.png" alt="" style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center",
        pointerEvents: "none",
      }} />

      {/* Overlay — lightened so image breathes more */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)" }} />

      {/* Content */}
      <div className="rsp-footer-inner" style={{
        position:       "relative",
        zIndex:         1,
        height:         "100%",
        minHeight:      260,
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "space-between",
        padding:        "44px 40px",
        gap:            20,
      }}>
        {/* Quote */}
        <p style={{
          fontFamily:    "var(--font-sans)",
          fontSize:      "clamp(18px, 3vw, 28px)",
          fontWeight:    500,
          color:         "#fff",
          letterSpacing: "-0.03em",
          lineHeight:    1.25,
          margin:        0,
          maxWidth:      560,
          opacity:       0.92,
        }}>
          "The art challenges the technology, and the technology inspires the art."
        </p>

        {/* Bottom row */}
        <div className="rsp-footer-bottom" style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 24,
        }}>
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500,
            color: "rgba(255,255,255,0.3)", letterSpacing: "-0.01em",
          }}>
            © {year} Georgius. All rights reserved.
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
            {[
              { label: "Work",  href: "/" },
              { label: "About", href: "/about" },
            ].map(l => <FooterLink key={l.href} {...l} />)}
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  )
}
