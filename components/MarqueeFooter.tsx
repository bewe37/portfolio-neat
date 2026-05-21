"use client"

import { useState, useEffect } from "react"

function torontoTime() {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: "America/Toronto",
    hour:     "numeric",
    minute:   "2-digit",
    hour12:   true,
  })
}

export default function MarqueeFooter() {
  const year = new Date().getFullYear()
  const [time, setTime] = useState(torontoTime())

  useEffect(() => {
    const tick = setInterval(() => setTime(torontoTime()), 1000)
    return () => clearInterval(tick)
  }, [])

  const dim   = "rgba(255,255,255,0.55)"
  const dimLo = "rgba(255,255,255,0.38)"
  const hover = "rgba(255,255,255,0.90)"

  const label: React.CSSProperties = {
    fontFamily:     "var(--font-sans)",
    fontSize:       13,
    fontWeight:     400,
    letterSpacing:  "-0.01em",
    color:          dim,
    textDecoration: "none",
    display:        "block",
    transition:     "color 0.15s ease",
    lineHeight:     1.8,
  }

  return (
    <footer style={{
      background: "var(--bg)",
      padding:    "clamp(32px, 4vw, 48px) clamp(20px, 4vw, 48px)",
      marginTop:  "auto",
    }}>
      <div style={{
        maxWidth:       1200,
        margin:         "0 auto",
        display:        "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap:            24,
        alignItems:     "end",
      }}>

        {/* Col 1 — tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ ...label, color: dim }}>
            Sleep is a design constraint.
          </span>
          <span style={{ ...label, color: dimLo }}>
            Available for hire if you catch me awake.
          </span>
        </div>

        {/* Col 2 — location + copyright, centered */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
          <span style={label}>Toronto · {time}</span>
          <span style={{ ...label, color: dimLo, fontSize: 11 }}>
            © {year} Georgius Bryan
          </span>
        </div>

        {/* Col 3 — links, right-aligned */}
        <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
          <a href="mailto:bryanwinata112@gmail.com" style={label}
            onMouseEnter={e => (e.currentTarget.style.color = hover)}
            onMouseLeave={e => (e.currentTarget.style.color = dim)}
          >Email</a>
          <a href="https://linkedin.com/in/gbryanw" target="_blank" rel="noopener noreferrer" style={label}
            onMouseEnter={e => (e.currentTarget.style.color = hover)}
            onMouseLeave={e => (e.currentTarget.style.color = dim)}
          >LinkedIn</a>
          <a href="https://twitter.com/gbryanwt" target="_blank" rel="noopener noreferrer" style={label}
            onMouseEnter={e => (e.currentTarget.style.color = hover)}
            onMouseLeave={e => (e.currentTarget.style.color = dim)}
          >Twitter</a>
        </div>

      </div>
    </footer>
  )
}
