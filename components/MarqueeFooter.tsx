"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

function FooterLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500,
        letterSpacing: "-0.01em", textDecoration: "none",
        color: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.72)",
        transition: "color 0.15s ease",
      }}
    >
      {label}
    </a>
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
        color: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.72)",
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
  const year   = new Date().getFullYear()
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })

  const ease = [0.16, 1, 0.3, 1] as const
  const dur  = 0.9

  return (
    <div ref={ref} style={{
      width:     "100vw",
      position:  "relative",
      left:      "50%",
      transform: "translateX(-50%)",
      minHeight: 260,
      marginTop: 32,
    }}>
      {/* Image layer — expands from content-width to full viewport */}
      <motion.div
        initial={{ left: 48, right: 48, borderRadius: 16 }}
        animate={{
          left:         inView ? 0 : 48,
          right:        inView ? 0 : 48,
          borderRadius: inView ? 0 : 16,
        }}
        transition={{ duration: dur, ease }}
        style={{ position: "absolute", top: 0, bottom: 0, overflow: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Scene.png" alt="" style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)" }} />
      </motion.div>

      {/* Content — always constrained to content width */}
      <div className="rsp-footer-inner" style={{
        position:       "relative",
        zIndex:         1,
        minHeight:      260,
        maxWidth:       1200,
        margin:         "0 auto",
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "space-between",
        padding:        "80px 8px",
        gap:            20,
      }}>
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

        <div className="rsp-footer-bottom" style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 24,
        }}>
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500,
            color: "rgba(255,255,255,0.55)", letterSpacing: "-0.01em",
          }}>
            © {year} Georgius. All rights reserved.
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
            {[
              { label: "LinkedIn", href: "https://linkedin.com/in/gbryanw" },
              { label: "X",        href: "https://x.com/gbryanwt" },
            ].map(l => <FooterLink key={l.href} {...l} />)}
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
            <BackToTop />
          </div>
        </div>
      </div>
    </div>
  )
}
