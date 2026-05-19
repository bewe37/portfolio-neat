"use client"

import { useRef, useLayoutEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { playClick } from "@/lib/click-sound"

const LINKS = [
  { href: "/",      label: "Work" },
  { href: "/about", label: "About" },
]

export default function HeaderNav() {
  const pathname  = usePathname()
  const navRef    = useRef<HTMLElement>(null)
  const wrapRefs  = useRef<(HTMLSpanElement | null)[]>([])
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)

  const activeIdx = LINKS.findIndex(({ href }) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)
  )

  useLayoutEffect(() => {
    const nav  = navRef.current
    const wrap = wrapRefs.current[activeIdx]
    if (!nav || !wrap) { setPill(null); return }
    const navRect  = nav.getBoundingClientRect()
    const wrapRect = wrap.getBoundingClientRect()
    setPill({ left: wrapRect.left - navRect.left, width: wrapRect.width })
  }, [activeIdx])

  return (
    <nav ref={navRef} style={{ display: "inline-flex", alignItems: "center", gap: 4, position: "relative" }}>
      {pill && (
        <span
          aria-hidden
          style={{
            position:      "absolute",
            top:           0,
            bottom:        0,
            left:          pill.left,
            width:         pill.width,
            background:    "var(--surface)",
            borderRadius:  6,
            transition:    "left 0.32s cubic-bezier(0.22,1,0.36,1), width 0.32s cubic-bezier(0.22,1,0.36,1)",
            pointerEvents: "none",
            zIndex:        0,
          }}
        />
      )}

      {LINKS.map(({ href, label }, i) => {
        const active = i === activeIdx
        return (
          <span key={href} ref={el => { wrapRefs.current[i] = el }} style={{ position: "relative", zIndex: 1 }}>
            <Link
              href={href}
              onClick={() => playClick()}
              style={{
                display:        "block",
                fontFamily:     "var(--font-sans)",
                fontSize:       14,
                fontWeight:     500,
                letterSpacing:  "-0.01em",
                color:          active ? "var(--c-primary)" : "var(--c-dim)",
                transition:     "color 0.18s ease",
                textDecoration: "none",
                padding:        "4px 10px",
                borderRadius:   6,
                whiteSpace:     "nowrap",
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "rgb(255,107,48)" }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--c-dim)" }}
            >
              {label}
            </Link>
          </span>
        )
      })}
    </nav>
  )
}
