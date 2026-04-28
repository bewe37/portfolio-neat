"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BUDDIES, type BuddyDef } from "@/lib/buddies"
import { SpriteView } from "@/components/SpriteBuddy"
import LogoAvatar from "@/components/LogoAvatar"

const SCALE = 4

// ── Meteor canvas ─────────────────────────────────────────────
interface MeteorData {
  x: number; y: number
  vx: number; vy: number
  age: number; life: number
  tail: number; bright: boolean
}

const ANGLE = 32 * Math.PI / 180
const COS   = Math.cos(ANGLE)
const SIN   = Math.sin(ANGLE)

function MeteorCanvas({ spawnRef }: {
  spawnRef: React.RefObject<((x: number, y: number) => void) | null>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext("2d")!
    const meteors: MeteorData[] = []
    let raf          = 0
    let lastTime     = performance.now()
    let nextSpawnIn  = 0

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    function spawn(bright = false, sx?: number, sy?: number) {
      const spd = bright ? 750 : 160 + Math.random() * 220
      meteors.push({
        x:      sx ?? (0.05 + Math.random() * 0.85) * canvas.width,
        y:      sy ?? -10  + Math.random() * canvas.height * 0.35,
        vx:     COS * spd,
        vy:     SIN * spd,
        age:    0,
        life:   bright ? 1.1 : 1.6 + Math.random() * 2.6,
        tail:   bright ? 240 : 60 + Math.random() * 90,
        bright,
      })
    }

    spawnRef.current = (x, y) => spawn(true, x, y)

    // Static stars — generated once, reused every frame
    interface Star {
      x: number; y: number       // fractional position (0–1)
      ox: number; oy: number     // origin for drift
      r: number
      base: number               // base opacity
      phase: number              // twinkle phase offset
      speed: number              // twinkle speed
      driftR: number             // drift radius (px)
      driftPhase: number         // drift phase
      driftSpeed: number         // drift speed
    }
    const stars: Star[] = Array.from({ length: 90 }, () => {
      const x = Math.random(), y = Math.random()
      return {
        x, y, ox: x, oy: y,
        r:          0.4 + Math.random() * 1.2,
        base:       0.18 + Math.random() * 0.48,
        phase:      Math.random() * Math.PI * 2,
        speed:      0.3 + Math.random() * 1.2,
        driftR:     8  + Math.random() * 24,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.04 + Math.random() * 0.08,
      }
    })

    // Sparkles — occasional bright cross-shaped flares on random stars
    interface Sparkle { starIdx: number; age: number; life: number; size: number }
    const sparkles: Sparkle[] = []
    let nextSparkleIn = 1.5 + Math.random() * 2

    function spawnSparkle() {
      const idx = Math.floor(Math.random() * stars.length)
      // Don't stack on an already-sparkling star
      if (sparkles.some(s => s.starIdx === idx)) return
      sparkles.push({ starIdx: idx, age: 0, life: 0.9 + Math.random() * 0.5, size: 6 + Math.random() * 10 })
    }

    // Seed with staggered meteors
    for (let i = 0; i < 6; i++) {
      spawn()
      meteors[i].age = Math.random() * meteors[i].life * 0.6
    }

    function frame(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars with drift + varied twinkle
      const t = now / 1000
      for (const s of stars) {
        const twinkle = Math.sin(t * s.speed + s.phase)
        // Occasional deep dim: when twinkle dips below -0.7, star nearly vanishes
        const alpha   = Math.max(0, s.base + twinkle * 0.22)
        const px = (s.ox * canvas.width)  + Math.cos(t * s.driftSpeed + s.driftPhase) * s.driftR
        const py = (s.oy * canvas.height) + Math.sin(t * s.driftSpeed + s.driftPhase * 1.3) * s.driftR * 0.6
        ctx.beginPath()
        ctx.arc(px, py, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()
      }

      nextSpawnIn -= dt
      if (nextSpawnIn <= 0) {
        spawn()
        nextSpawnIn = 1.8 + Math.random() * 3.5
      }

      // Sparkle timer
      nextSparkleIn -= dt
      if (nextSparkleIn <= 0) {
        spawnSparkle()
        nextSparkleIn = 1.2 + Math.random() * 2.5
      }

      // Draw sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sp = sparkles[i]
        sp.age += dt
        if (sp.age >= sp.life) { sparkles.splice(i, 1); continue }

        const t2   = sp.age / sp.life
        // Sharp rise, slow fade
        const fade = t2 < 0.2 ? t2 / 0.2 : 1 - ((t2 - 0.2) / 0.8)
        const s    = stars[sp.starIdx]
        const px   = (s.ox * canvas.width)  + Math.cos(now / 1000 * s.driftSpeed + s.driftPhase) * s.driftR
        const py   = (s.oy * canvas.height) + Math.sin(now / 1000 * s.driftSpeed + s.driftPhase * 1.3) * s.driftR * 0.6
        const sz   = sp.size * fade

        ctx.save()
        ctx.globalAlpha = fade
        ctx.strokeStyle = "#fff"
        ctx.lineWidth   = 1

        // 4-point cross
        for (let a = 0; a < 4; a++) {
          const angle = (a / 4) * Math.PI
          const len   = a % 2 === 0 ? sz : sz * 0.55
          ctx.beginPath()
          ctx.moveTo(px + Math.cos(angle) * 1.5, py + Math.sin(angle) * 1.5)
          ctx.lineTo(px + Math.cos(angle) * len,  py + Math.sin(angle) * len)
          ctx.moveTo(px - Math.cos(angle) * 1.5, py - Math.sin(angle) * 1.5)
          ctx.lineTo(px - Math.cos(angle) * len,  py - Math.sin(angle) * len)
          ctx.stroke()
        }

        // Centre glow
        const glow = ctx.createRadialGradient(px, py, 0, px, py, sz * 0.8)
        glow.addColorStop(0, `rgba(255,245,210,${fade * 0.9})`)
        glow.addColorStop(1, "rgba(255,245,210,0)")
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(px, py, sz * 0.8, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        m.age += dt
        if (m.age >= m.life) { meteors.splice(i, 1); continue }

        const t    = m.age / m.life
        const fade = t < 0.08 ? t / 0.08 : t > 0.62 ? 1 - (t - 0.62) / 0.38 : 1

        const hx = m.x + m.vx * m.age
        const hy = m.y + m.vy * m.age
        const tx = hx - COS * m.tail
        const ty = hy - SIN * m.tail

        const g = ctx.createLinearGradient(tx, ty, hx, hy)
        if (m.bright) {
          g.addColorStop(0,   "rgba(255,200,100,0)")
          g.addColorStop(0.6, `rgba(255,225,150,${0.6 * fade})`)
          g.addColorStop(1,   `rgba(255,255,235,${fade})`)
        } else {
          g.addColorStop(0, "rgba(255,255,255,0)")
          g.addColorStop(1, `rgba(255,255,255,${0.42 * fade})`)
        }

        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(hx, hy)
        ctx.strokeStyle = g
        ctx.lineWidth   = m.bright ? 2.5 : 1
        ctx.stroke()

        if (m.bright) {
          const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, 10)
          glow.addColorStop(0, `rgba(255,245,200,${fade * 0.9})`)
          glow.addColorStop(1, "rgba(255,245,200,0)")
          ctx.beginPath()
          ctx.arc(hx, hy, 10, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else {
        lastTime = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibility)
      spawnRef.current = null
    }
  }, [spawnRef])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
      }}
    />
  )
}

// ── Buddy card ────────────────────────────────────────────────
function BuddyCard({ buddy, selected, dimmed, onSelect }: {
  buddy: BuddyDef; selected: boolean; dimmed: boolean; onSelect: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const animKey = dimmed ? "sleep" : hovered || selected ? buddy.hoverAnim : buddy.idleAnim

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:  "none",
        border:      "none",
        padding:     0,
        cursor:      "pointer",
        display:     "flex",
        flexDirection: "column",
        alignItems:  "center",
        gap:         16,
        outline:     "none",
        opacity:     dimmed ? 0.35 : 1,
        filter:      dimmed ? "saturate(0)" : "none",
        transform:   selected ? "translateY(-8px) scale(1.04)" : hovered && !dimmed ? "translateY(-4px) scale(1.02)" : "none",
        transition:  "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease, filter 0.4s ease",
      }}
    >
      <div style={{
        width:          buddy.tileW * SCALE + 32,
        height:         buddy.tileH * SCALE + 32,
        borderRadius:   20,
        border:         `2px solid ${selected ? "var(--c-primary)" : "var(--border)"}`,
        background:     selected ? "var(--hover-bg)" : "var(--image-bg)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        transition:     "border-color 0.2s ease, background 0.2s ease",
        boxShadow:      selected ? "0 0 0 4px var(--c-ghost)" : "none",
        position:       "relative",
        overflow:       "hidden",
      }}>
        <div style={{
          position:        "absolute", inset: 0,
          backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)",
          backgroundSize:  "10px 10px",
          pointerEvents:   "none",
        }} />
        <SpriteView buddy={buddy} animKey={animKey} scale={SCALE} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 700, color: "var(--c-primary)", letterSpacing: "-0.01em" }}>
          {buddy.name}
        </span>
      </div>

      {selected && (
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          background: "var(--c-primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4.2 7.5L10 1" stroke="var(--bg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </button>
  )
}

// ── Welcome step ──────────────────────────────────────────────
function WelcomeStep({ onContinue, onSkip }: { onContinue: () => void; onSkip: () => void }) {
  const spawnRef = useRef<((x: number, y: number) => void) | null>(null)

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    // Don't spawn if clicking a button
    if ((e.target as HTMLElement).closest("button")) return
    spawnRef.current?.(e.clientX, e.clientY)
  }

  return (
    <div
      onClick={handleClick}
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        minHeight:      "100dvh",
        padding:        "40px 24px",
        position:       "relative",
        fontFamily:     "var(--font-sans)",
        background:     "#18181b",
        overflow:       "hidden",
        cursor:         "default",
      }}
    >
      <MeteorCanvas spawnRef={spawnRef} />

      {/* Edge fades */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 100, background: "linear-gradient(to bottom, #18181b, transparent)", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: "linear-gradient(to top, #18181b, transparent)", pointerEvents: "none", zIndex: 1 }} />

      {/* Footer */}
      <div style={{
        position:    "absolute", bottom: 28, left: 32,
        zIndex:      2,
        fontFamily:  "'Departure Mono', monospace",
        fontSize:    11,
        color:       "rgba(244,244,245,0.55)",
        letterSpacing: "0.04em",
        lineHeight:  1.5,
        animation:   "fadeUp 0.55s 0.45s cubic-bezier(0.22,1,0.36,1) both",
        userSelect:  "none",
      }}>
        Georgius Bryan<br />
        <span style={{ color: "rgba(244,244,245,0.32)" }}>Portfolio — 2025</span>
      </div>

      <div style={{
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        gap:           28,
        maxWidth:      480,
        textAlign:     "center",
        position:      "relative",
        zIndex:        2,
      }}>
        <div style={{ animation: "fadeUp 0.55s 0.05s cubic-bezier(0.22,1,0.36,1) both" }}>
          <motion.div
            initial={{ y: 0, rotate: -6 }}
            animate={{ y: -14, rotate: 6 }}
            transition={{
              y:      { duration: 3.0, repeat: Infinity, repeatType: "reverse", ease: [0.37, 0, 0.63, 1], delay: 0.6 },
              rotate: { duration: 4.2, repeat: Infinity, repeatType: "reverse", ease: [0.37, 0, 0.63, 1], delay: 0.2 },
            }}
          >
            <LogoAvatar />
          </motion.div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h1
            style={{
              fontSize:      clamp(36, 54),
              fontWeight:    800,
              color:         "#f4f4f5",
              margin:        0,
              letterSpacing: "-0.04em",
              lineHeight:    1.08,
              cursor:        "default",
              animation:     "fadeUp 0.55s 0.14s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            Hey, I'm <span className="shiny-text">Georgius</span>.
          </h1>

          <p style={{
            fontSize:   17,
            fontWeight: 500,
            color:      "rgba(244,244,245,0.65)",
            margin:     "0 auto",
            lineHeight: 1.55,
            maxWidth:   360,
            textAlign:  "center",
            animation:  "fadeUp 0.55s 0.22s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            Every good portfolio needs a companion. Pick one and they'll keep you company.
          </p>
        </div>

        <div style={{
          display:   "flex",
          gap:       10,
          animation: "fadeUp 0.55s 0.3s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          <button
            className="btn-dark-fill"
            onClick={onContinue}
            style={{
              padding:       "12px 32px",
              borderRadius:  99,
              border:        "none",
              fontSize:      14,
              fontWeight:    600,
              fontFamily:    "var(--font-sans)",
              cursor:        "pointer",
              letterSpacing: "-0.01em",
              position:      "relative",
              overflow:      "hidden",
            }}
          >
            Pick a companion →
          </button>
          <button
            onClick={onSkip}
            style={{
              padding:       "12px 22px",
              borderRadius:  99,
              border:        "1px solid rgba(244,244,245,0.15)",
              background:    "rgba(255,255,255,0.04)",
              color:         "rgba(244,244,245,0.45)",
              fontSize:      14,
              fontWeight:    500,
              fontFamily:    "var(--font-sans)",
              cursor:        "pointer",
              letterSpacing: "-0.01em",
              transition:    "color 0.15s ease, border-color 0.15s ease, background 0.15s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color        = "rgba(244,244,245,0.85)"
              e.currentTarget.style.borderColor  = "rgba(244,244,245,0.35)"
              e.currentTarget.style.background   = "rgba(255,255,255,0.08)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color        = "rgba(244,244,245,0.45)"
              e.currentTarget.style.borderColor  = "rgba(244,244,245,0.15)"
              e.currentTarget.style.background   = "rgba(255,255,255,0.04)"
            }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Close (X) button ──────────────────────────────────────────
function BackBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:   "absolute", top: 24, left: 24,
        display:    "inline-flex", alignItems: "center", justifyContent: "center",
        width:      32, height: 32, borderRadius: "50%",
        background: hov ? "var(--hover-bg)" : "transparent",
        border:     "1px solid var(--border)",
        cursor:     "pointer",
        color:      hov ? "var(--c-primary)" : "var(--c-secondary)",
        transition: "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
        padding:    0,
      }}
      aria-label="Close"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </button>
  )
}

// ── Pixel draw canvas ─────────────────────────────────────────
const DRAW_PALETTE = [
  "#000000", "#1D2B53", "#7E2553", "#008751",
  "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8",
  "#FF004D", "#FFA300", "#FFEC27", "#00E436",
  "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA",
]
const DG = 16  // grid size
const DC = 18  // cell px

function DrawCanvas({ onSave }: { onSave: () => void }) {
  const [pixels,   setPixels]   = useState<(string | null)[]>(() => Array(DG * DG).fill(null))
  const [color,    setColor]    = useState(DRAW_PALETTE[8])
  const [erasing,  setErasing]  = useState(false)
  const [painting, setPainting] = useState(false)
  const [history,  setHistory]  = useState<(string | null)[][]>([])
  const gridRef    = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLCanvasElement>(null)
  const hasContent = pixels.some(Boolean)

  useEffect(() => {
    const cv = previewRef.current; if (!cv) return
    const ctx = cv.getContext("2d")!
    ctx.clearRect(0, 0, DG, DG)
    pixels.forEach((px, i) => {
      if (!px) return
      ctx.fillStyle = px
      ctx.fillRect(i % DG, Math.floor(i / DG), 1, 1)
    })
  }, [pixels])

  function applyAt(idx: number) {
    if (idx < 0 || idx >= DG * DG) return
    setPixels(prev => {
      const val = erasing ? null : color
      if (prev[idx] === val) return prev
      const next = [...prev]; next[idx] = val; return next
    })
  }

  function startPaint(idx: number, e: React.MouseEvent) {
    e.preventDefault()
    setHistory(h => [...h.slice(-29), [...pixels]])
    setPainting(true); applyAt(idx)
  }

  function handleTouchStart(e: React.TouchEvent) {
    e.preventDefault()
    setHistory(h => [...h.slice(-29), [...pixels]])
    setPainting(true)
    const t = e.touches[0], rect = gridRef.current!.getBoundingClientRect()
    applyAt(Math.floor((t.clientY - rect.top) / DC) * DG + Math.floor((t.clientX - rect.left) / DC))
  }

  function handleTouchMove(e: React.TouchEvent) {
    e.preventDefault(); if (!painting) return
    const t = e.touches[0], rect = gridRef.current!.getBoundingClientRect()
    applyAt(Math.floor((t.clientY - rect.top) / DC) * DG + Math.floor((t.clientX - rect.left) / DC))
  }

  const undo  = () => { if (!history.length) return; setPixels(history[history.length - 1]); setHistory(h => h.slice(0, -1)) }
  const clear = () => { if (!hasContent) return; setHistory(h => [...h.slice(-29), [...pixels]]); setPixels(Array(DG * DG).fill(null)) }

  function save() {
    let topRow = DG
    pixels.forEach((px, i) => { if (px) { const r = Math.floor(i / DG); if (r < topRow) topRow = r } })
    const cv = document.createElement("canvas"); cv.width = DG; cv.height = DG
    const ctx = cv.getContext("2d")!
    pixels.forEach((px, i) => { if (!px) return; ctx.fillStyle = px; ctx.fillRect(i % DG, Math.floor(i / DG), 1, 1) })
    localStorage.setItem("customBuddyData", cv.toDataURL("image/png"))
    localStorage.setItem("customBuddyTop", String(topRow / DG))
    localStorage.setItem("buddyId", "custom")
    window.dispatchEvent(new Event("buddySelected"))
    onSave()
  }

  const PV = DG * 3

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* Left: grid + tools */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            ref={gridRef}
            onMouseLeave={() => setPainting(false)}
            onMouseUp={() => setPainting(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setPainting(false)}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${DG}, ${DC}px)`,
              borderRadius: 10, overflow: "hidden",
              border: "1px solid var(--border-mid)",
              userSelect: "none", touchAction: "none",
              cursor: erasing ? "cell" : "crosshair",
              backgroundImage: `linear-gradient(45deg,rgba(0,0,0,.06) 25%,transparent 25%),linear-gradient(-45deg,rgba(0,0,0,.06) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,rgba(0,0,0,.06) 75%),linear-gradient(-45deg,transparent 75%,rgba(0,0,0,.06) 75%)`,
              backgroundSize: `${DC * 2}px ${DC * 2}px`,
              backgroundPosition: `0 0, 0 ${DC}px, ${DC}px -${DC}px, -${DC}px 0`,
            }}
          >
            {pixels.map((px, i) => (
              <div key={i}
                onMouseDown={(e) => startPaint(i, e)}
                onMouseEnter={() => { if (painting) applyAt(i) }}
                style={{ width: DC, height: DC, backgroundColor: px ?? "transparent", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.07)" }}
              />
            ))}
          </div>

          {/* Tools below grid */}
          <div style={{ display: "flex", gap: 6 }}>
            {([
              { label: "Erase", active: erasing,  onClick: () => setErasing(e => !e), disabled: false },
              { label: "Undo",  active: false,     onClick: undo,                      disabled: !history.length },
              { label: "Clear", active: false,     onClick: clear,                     disabled: !hasContent },
            ] as const).map(btn => (
              <button key={btn.label} onClick={btn.onClick} disabled={btn.disabled} style={{
                flex: 1, padding: "7px 0", borderRadius: 8, border: "1px solid var(--border-mid)",
                background: btn.active ? "var(--c-primary)" : "transparent",
                color: btn.disabled ? "var(--c-faint)" : btn.active ? "var(--bg)" : "var(--c-secondary)",
                fontSize: 10, fontWeight: 700, fontFamily: "var(--font-sans)",
                letterSpacing: "0.06em", textTransform: "uppercase" as const,
                cursor: btn.disabled ? "default" : "pointer", transition: "all 0.15s ease",
              }}>{btn.label}</button>
            ))}
          </div>
        </div>

        {/* Right panel: preview + palette */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 148 }}>

          {/* Preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, color: "var(--c-secondary)", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Preview</span>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: PV + 28, height: PV + 28, borderRadius: 12,
                border: "1px solid var(--border-mid)", background: "var(--surface)",
                display: "flex", alignItems: "center", justifyContent: "center",
                backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)",
                backgroundSize: "8px 8px",
              }}
            >
              <canvas ref={previewRef} width={DG} height={DG}
                style={{ width: PV, height: PV, imageRendering: "pixelated", display: "block" }}
              />
            </motion.div>
          </div>

          {/* Palette */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, color: "var(--c-secondary)", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Colors</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 32px)", gap: 5 }}>
              {DRAW_PALETTE.map(c => (
                <motion.button key={c}
                  onClick={() => { setColor(c); setErasing(false) }}
                  whileHover={{ scale: 1.18 }} whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 440, damping: 18 }}
                  style={{
                    width: 32, height: 32, borderRadius: 8, backgroundColor: c,
                    border: "none",
                    outline: color === c && !erasing ? "3px solid var(--c-primary)" : "2px solid transparent",
                    outlineOffset: 2, cursor: "pointer",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.22)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <motion.button
        onClick={save} disabled={!hasContent}
        animate={{ opacity: hasContent ? 1 : 0.32, y: hasContent ? 0 : 4 }}
        transition={{ duration: 0.22 }}
        style={{
          padding: "11px 32px", borderRadius: 99, border: "none",
          background: "var(--c-primary)", color: "var(--bg)",
          fontSize: 14, fontWeight: 700, fontFamily: "var(--font-sans)",
          cursor: hasContent ? "pointer" : "default", letterSpacing: "-0.01em",
        }}
      >
        Use as companion →
      </motion.button>
    </div>
  )
}

// ── Companion step ────────────────────────────────────────────
function CompanionStep({ selected, onSelect, onConfirm, onConfirmDraw, onBack, confirmed, initialTab = "pick" }: {
  selected: string | null
  onSelect: (id: string) => void
  onConfirm: () => void
  onConfirmDraw: () => void
  onBack: () => void
  confirmed: boolean
  initialTab?: "pick" | "draw"
}) {
  const [tab, setTab] = useState<"pick" | "draw">(initialTab)
  const pickBtnRef = useRef<HTMLButtonElement>(null)
  const drawBtnRef = useRef<HTMLButtonElement>(null)
  const [pillStyle, setPillStyle] = useState({ x: 0, width: 0 })

  useEffect(() => {
    const ref = tab === "pick" ? pickBtnRef.current : drawBtnRef.current
    if (ref) setPillStyle({ x: ref.offsetLeft, width: ref.offsetWidth })
  }, [tab])

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
      minHeight: "100dvh", padding: "88px 24px 48px", position: "relative",
      fontFamily: "var(--font-sans)", background: "var(--bg)", overflowY: "auto",
    }}>
      <BackBtn onClick={onBack} />

      {/* ── Fixed header: toggle + title ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: confirmed ? 0 : 1, y: confirmed ? 4 : 0 }}
        transition={{ duration: 0.35 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, marginBottom: 36 }}
      >
        {/* Sliding pill toggle */}
        <div style={{ position: "relative", display: "flex", gap: 3, padding: 4, borderRadius: 99, background: "var(--surface)", border: "1px solid var(--border-mid)" }}>
          {pillStyle.width > 0 && (
            <motion.span
              animate={{ x: pillStyle.x, width: pillStyle.width }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              style={{
                position: "absolute", top: 4, bottom: 4, left: 0,
                borderRadius: 99, background: "var(--bg)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                pointerEvents: "none",
              }}
            />
          )}
          {(["pick", "draw"] as const).map(t => (
            <motion.button
              key={t}
              ref={t === "pick" ? pickBtnRef : drawBtnRef}
              onClick={() => setTab(t)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
              style={{
                padding: "8px 20px", borderRadius: 99, border: "none",
                background: "transparent",
                color: tab === t ? "var(--c-primary)" : "var(--c-secondary)",
                fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sans)",
                cursor: "pointer", letterSpacing: "-0.01em",
                display: "flex", alignItems: "center", gap: 6,
                position: "relative", zIndex: 1,
                transition: "color 0.2s ease",
              }}
            >
              {t === "pick" ? "Pick a companion" : (
                <>
                  Draw your own
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </motion.button>
          ))}
        </div>

        <h1 style={{
          fontSize: clamp(28, 42), fontWeight: 800, color: "var(--c-primary)",
          margin: 0, letterSpacing: "-0.03em", textAlign: "center",
        }}>
          {tab === "pick" ? "Pick your companion." : "Draw your companion."}
        </h1>
      </motion.div>

      {/* ── Tab content — crossfades, no layout shift ── */}
      <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
        <AnimatePresence mode="wait" initial={false}>
          {tab === "pick" ? (
            <motion.div
              key="pick"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: confirmed ? 0 : 1, y: confirmed ? -8 : 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>
                {BUDDIES.map((buddy, i) => (
                  <div key={buddy.id} style={{ animation: `buddyCardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.08}s both` }}>
                    <BuddyCard buddy={buddy} selected={selected === buddy.id}
                      dimmed={selected !== null && selected !== buddy.id}
                      onSelect={() => onSelect(buddy.id)} />
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 36,
                opacity: selected && !confirmed ? 1 : 0,
                transform: selected && !confirmed ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                pointerEvents: selected ? "auto" : "none",
                visibility: selected ? "visible" : "hidden",
              }}>
                <button className="btn-shiny" onClick={onConfirm} style={{
                  padding: "12px 36px", borderRadius: 99, border: "none",
                  background: "var(--c-primary)", color: "var(--bg)",
                  fontSize: 14, fontWeight: 700, fontFamily: "var(--font-sans)",
                  cursor: "pointer", letterSpacing: "-0.01em", position: "relative", overflow: "hidden",
                }}>
                  {`Let's go with ${BUDDIES.find(b => b.id === selected)?.name ?? ""} →`}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="draw"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: confirmed ? 0 : 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <DrawCanvas onSave={onConfirmDraw} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

import { Suspense } from "react"

export const dynamic = "force-dynamic"

// ── Page ──────────────────────────────────────────────────────
function OnboardingPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const drawMode     = searchParams.get("draw") === "1"
  const editMode     = searchParams.get("edit") === "1"
  const skipWelcome  = drawMode || editMode

  const [step,      setStep]      = useState<0 | 1>(skipWelcome ? 1 : 0)
  const [selected,  setSelected]  = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [mounted,   setMounted]   = useState(false)
  const [revealing, setRevealing] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Only redirect if this is a fresh first-visit (not editing/drawing)
    if (!skipWelcome && localStorage.getItem("buddyId")) router.replace("/")
  }, [router, skipWelcome])

  function goToStep1() { setRevealing(true) }

  function goBack() {
    if (skipWelcome) {
      router.replace("/")
    } else {
      setStep(0)
      setRevealing(false)
    }
  }

  function confirm() {
    if (!selected) return
    localStorage.setItem("buddyId", selected)
    window.dispatchEvent(new Event("buddySelected"))
    setConfirmed(true)
    setTimeout(() => router.replace("/"), 600)
  }

  function confirmDraw() {
    setConfirmed(true)
    setTimeout(() => router.replace("/"), 600)
  }

  function skip() {
    localStorage.setItem("buddyId", "none")
    router.replace("/")
  }

  if (!mounted) return null

  return (
    <div style={{
      minHeight:  "100dvh",
      overflow:   "hidden",
      position:   "relative",
      background: step === 0 ? "#18181b" : "var(--bg)",
    }}>
      {/* Companion step — circle clip reveals it (or shown immediately in edit/draw mode) */}
      <div
        style={{
          position:  "fixed",
          inset:     0,
          zIndex:    15,
          clipPath:  step === 1 ? "none" : revealing ? undefined : "circle(0% at 50% 50%)",
          animation: revealing ? "circleOpen 1.3s cubic-bezier(0.22,1,0.36,1) forwards" : undefined,
        }}
        onAnimationEnd={revealing ? () => { setRevealing(false); setStep(1) } : undefined}
      >
        <CompanionStep
          selected={selected}
          onSelect={setSelected}
          onConfirm={confirm}
          onConfirmDraw={confirmDraw}
          onBack={goBack}
          confirmed={confirmed}
          initialTab={drawMode ? "draw" : "pick"}
        />
      </div>

      {/* Dark welcome overlay — hidden in edit/draw mode */}
      {step === 0 && !skipWelcome && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10 }}>
          <WelcomeStep onContinue={goToStep1} onSkip={skip} />
        </div>
      )}

      <style>{`
        @keyframes textShine {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shiny-text {
          background: linear-gradient(
            90deg,
            #f4f4f5 0%,
            #f4f4f5 35%,
            rgba(255,255,255,1) 47%,
            rgba(255,230,200,1) 50%,
            rgba(255,255,255,1) 53%,
            #f4f4f5 65%,
            #f4f4f5 100%
          );
          background-size: 250% auto;
          background-position: -200% center;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .shiny-text:hover {
          animation: textShine 0.75s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes circleOpen {
          from { clip-path: circle(0%   at 50% 50%); }
          to   { clip-path: circle(150% at 50% 50%); }
        }
        @keyframes buddyCardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .btn-dark-fill {
          background: linear-gradient(to top, rgb(255,107,48) 50%, #f4f4f5 50%);
          background-size: 100% 205%;
          background-position: 0% 0%;
          color: #18181b;
          transition: background-position 0.42s cubic-bezier(0.22,1,0.36,1),
                      color 0.3s ease, box-shadow 0.25s ease;
        }
        .btn-dark-fill:hover {
          background-position: 0% 100%;
          color: #fff;
          box-shadow: 0 8px 28px rgba(255,107,48,0.35);
        }
        @keyframes btnShimmer {
          0%   { left: -100%; }
          100% { left: 160%; }
        }
        .btn-shiny { position: relative; overflow: hidden; }
        .btn-shiny::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 55%; height: 100%;
          background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%);
          transform: skewX(-18deg);
          pointer-events: none;
        }
        .btn-shiny:hover::after { animation: btnShimmer 0.48s ease forwards; }
      `}</style>
    </div>
  )
}

function clamp(min: number, max: number): number {
  return typeof window !== "undefined"
    ? Math.min(max, Math.max(min, window.innerWidth * 0.04))
    : max
}

export default function Page() {
  return (
    <Suspense>
      <OnboardingPage />
    </Suspense>
  )
}
