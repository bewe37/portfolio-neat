"use client"

// Sticker peel effect based on the work of @BalintFerenczy on Twitter

import { useRef, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { playClick } from "@/lib/click-sound"

const PEELBACK_HOVER  = "30%"
const PEELBACK_ACTIVE = "60%"
const PAD   = "10px"
const START = `calc(-1 * ${PAD})`
const END   = `calc(100% + ${PAD})`
const PEEL_EASING  = `2s linear(0,0.002 0.4%,0.008 0.9%,0.02 1.4%,0.035 1.9%,0.055 2.4%,0.083 3%,0.11 3.5%,0.146 4.1%,0.214 5.1%,0.297 6.2%,0.624 10.2%,0.756 11.9%,0.821 12.8%,0.874 13.6%,0.93 14.5%,0.975 15.3%,1.016 16.1%,1.053 16.9%,1.085 17.7%,1.116 18.6%,1.139 19.4%,1.16 20.3%,1.176 21.2%,1.187 22.1%,1.195 23.2%,1.197 24.4%,1.193 25.6%,1.183 26.9%,1.17 28.1%,1.153 29.4%,1.055 35.6%,1.031 37.3%,1.012 38.8%,0.994 40.6%,0.98 42.3%,0.97 44.1%,0.964 45.9%,0.961 48.3%,0.964 51.1%,0.97 53.7%,0.997 62.7%,1.003 66%,1.007 69.3%,1.007 74.4%,1 89.2%,1)`
const HOVER_EASING = `1s linear(0,0.008 1.1%,0.031 2.2%,0.129 4.8%,0.257 7.2%,0.671 14.2%,0.789 16.5%,0.881 18.6%,0.957 20.7%,1.019 22.9%,1.063 25.1%,1.094 27.4%,1.114 30.7%,1.112 34.5%,1.018 49.9%,0.99 59.1%,1)`

interface StickerDef {
  id: string; src: string; label: string
  size: number; top: number; right?: number | string; left?: number | string; rotate: number; defaultOn: boolean
}

const ALL_STICKERS: StickerDef[] = [
  { id: "thunder", src: "/Thunder.svg",    label: "Thunder", size: 86,  top:  80, left: "calc(50% - 280px - 86px - 16px)", rotate: -15, defaultOn: true  },
  { id: "cloud",   src: "/Cloud.svg",      label: "Cloud",   size: 84,  top:  80, left: "calc(50% + 280px + 16px)", rotate:  18, defaultOn: true  },
  { id: "green",   src: "/Green.svg",      label: "Green",   size: 100, top:  40, right: 160, rotate: -12, defaultOn: false },
  { id: "bang",    src: "/Bang.svg",       label: "Bang",    size: 80,  top: 260, right: 100, rotate:  -8, defaultOn: false },
  { id: "spark",   src: "/Spark.svg",      label: "Spark",   size: 76,  top: 160, right: 160, rotate:  22, defaultOn: false },
  { id: "figma",   src: "/Figma.svg",      label: "Figma",   size: 76,  top: 280, right:  50, rotate:   8, defaultOn: false },
  { id: "claude",  src: "/Claude.svg",     label: "Claude",  size: 80,  top: 300, right: 160, rotate: -10, defaultOn: false },
  { id: "vercel",  src: "/Vercel.svg",     label: "Vercel",  size: 76,  top: 200, right: 240, rotate:  12, defaultOn: false },
  { id: "hello",   src: "/HelloWorld.svg", label: "Hello",   size: 92,  top: 100, right: 240, rotate:  16, defaultOn: false },
  { id: "taxi",    src: "/Taxi.svg",       label: "Taxi",    size: 100, top: 220, right:  60, rotate:   8, defaultOn: false },
  { id: "ramen",   src: "/Ramen.svg",      label: "Ramen",   size: 84,  top: 220, right: 160, rotate: -10, defaultOn: false },
]

function Sticker({ src, size, top, right, left, rotate, uid, spawnAt }: {
  src: string; size: number; top: number; right?: number | string; left?: number | string
  rotate: number; uid: string; spawnAt?: { x: number; y: number }
}) {
  const draggableRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging   = useRef(false)
  const dragOffset   = useRef({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [active,  setActive]  = useState(false)

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (isDragging.current && draggableRef.current) {
        const el = draggableRef.current
        const parent = el.offsetParent as HTMLElement | null
        const parentRect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 }
        el.style.left  = (e.clientX - dragOffset.current.x - parentRect.left) + "px"
        el.style.top   = (e.clientY - dragOffset.current.y - parentRect.top)  + "px"
      }
    }
    function onMouseUp() {
      isDragging.current = false
      setActive(false)
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup",   onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup",   onMouseUp)
    }
  }, [])

  // If spawned from palette, immediately start dragging from cursor position
  useEffect(() => {
    if (!spawnAt) return
    const el = draggableRef.current
    if (!el) return
    const parent = el.offsetParent as HTMLElement | null
    const parentRect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 }
    // center the sticker on the cursor
    dragOffset.current = { x: size / 2, y: size / 2 }
    el.style.right = "auto"
    el.style.left  = (spawnAt.x - size / 2 - parentRect.left) + "px"
    el.style.top   = (spawnAt.y - size / 2 - parentRect.top)  + "px"
    isDragging.current = true
    setActive(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onMouseDown(e: React.MouseEvent) {
    const el = draggableRef.current
    if (!el) return
    e.preventDefault()
    const rect = el.getBoundingClientRect()
    const parent = el.offsetParent as HTMLElement | null
    const parentRect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 }
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    el.style.right = "auto"
    el.style.left  = (rect.left - parentRect.left) + "px"
    el.style.top   = (rect.top  - parentRect.top)  + "px"
    isDragging.current = true
    setActive(true)
  }

  const mainClip = active
    ? `polygon(${START} ${PEELBACK_ACTIVE}, ${END} ${PEELBACK_ACTIVE}, ${END} ${END}, ${START} ${END})`
    : hovered
    ? `polygon(${START} ${PEELBACK_HOVER},  ${END} ${PEELBACK_HOVER},  ${END} ${END}, ${START} ${END})`
    : `polygon(${START} ${START}, ${END} ${START}, ${END} ${END}, ${START} ${END})`

  const flapClip = active
    ? `polygon(${START} ${START}, ${END} ${START}, ${END} ${PEELBACK_ACTIVE}, ${START} ${PEELBACK_ACTIVE})`
    : hovered
    ? `polygon(${START} ${START}, ${END} ${START}, ${END} ${PEELBACK_HOVER},  ${START} ${PEELBACK_HOVER})`
    : `polygon(${START} ${START}, ${END} ${START}, ${END} ${START}, ${START} ${START})`

  const flapTop = active
    ? `calc(-100% + 2 * ${PEELBACK_ACTIVE} - 1px)`
    : hovered
    ? `calc(-100% + 2 * ${PEELBACK_HOVER} - 1px)`
    : `calc(-100% - ${PAD} - ${PAD})`

  const transition = active ? `all ${PEEL_EASING}` : `all ${HOVER_EASING}`
  const imgStyle: React.CSSProperties = { width: size, display: "block", transform: `rotate(${rotate}deg)`, userSelect: "none" }

  const fillId = `st-fi-${uid}`

  return (
    <>
      <svg height="0" width="0" style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          <filter id={fillId}>
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
            <feFlood floodColor="rgb(179,179,179)" result="flood" />
            <feComposite operator="in" in="flood" in2="shape" />
          </filter>
        </defs>
      </svg>

      <div
        ref={draggableRef}
        onMouseDown={onMouseDown}
        style={{ position: "absolute", top, right, left, cursor: isDragging.current ? "grabbing" : "grab", zIndex: 20, userSelect: "none" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); if (!isDragging.current) setActive(false) }}
          style={{ position: "relative" }}
        >
          {/* Main sticker body */}
          <div style={{ clipPath: mainClip, transition, willChange: "clip-path" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" draggable={false} style={imgStyle} />
          </div>

          {/* Drop shadow blob */}
          <div style={{ position: "absolute", top: "0.1rem", left: "0.05rem", width: "100%", height: "100%", filter: "brightness(0) blur(0.5px)", opacity: 0.04, pointerEvents: "none" }}>
            <div style={{ filter: `url(#${fillId})` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" draggable={false} style={imgStyle} />
            </div>
          </div>

          {/* Peeled flap */}
          <div style={{ position: "absolute", width: "100%", height: "100%", left: 0, top: flapTop, clipPath: flapClip, transform: "scaleY(-1)", transition, willChange: "clip-path, top", pointerEvents: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" draggable={false} style={{ ...imgStyle, filter: `url(#${fillId})` }} />
          </div>
        </div>
      </div>
    </>
  )
}

export default function FuzzyStickers() {
  const [active, setActive] = useState<Set<string>>(
    () => new Set(ALL_STICKERS.filter(s => s.defaultOn).map(s => s.id))
  )
  const [spawnMap, setSpawnMap] = useState<Record<string, { x: number; y: number }>>({})
  const [paletteOpen, setPaletteOpen] = useState(false)

  function handlePaletteMouseDown(s: StickerDef, e: React.MouseEvent) {
    if (active.has(s.id)) {
      // already on canvas — just toggle off
      playClick()
      setActive(prev => { const n = new Set(prev); n.delete(s.id); return n })
      return
    }
    // spawn and immediately drag from cursor
    playClick()
    setSpawnMap(prev => ({ ...prev, [s.id]: { x: e.clientX, y: e.clientY } }))
    setActive(prev => { const n = new Set(prev); n.add(s.id); return n })
  }

  return (
    <>
      {ALL_STICKERS.filter(s => active.has(s.id)).map(s => (
        <Sticker
          key={s.id} uid={s.id} src={s.src} size={s.size}
          top={s.top} right={s.right} left={s.left} rotate={s.rotate}
          spawnAt={spawnMap[s.id]}
        />
      ))}

      <div style={{ position: "absolute", bottom: 24, right: 0, zIndex: 30 }}>
        <AnimatePresence>
          {paletteOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 6 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute", bottom: 44, right: 0,
                background: "var(--bg)", border: "none",
                borderRadius: 16, padding: "10px 10px",
                display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4,
                boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)",
                width: 212, transformOrigin: "bottom right",
              }}
            >
              {ALL_STICKERS.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02, duration: 0.14, ease: "easeOut" }}
                  onMouseDown={e => handlePaletteMouseDown(s, e)}
                  title={s.label}
                  style={{
                    background:   active.has(s.id) ? "var(--surface)" : "transparent",
                    border:       `1.5px solid ${active.has(s.id) ? "var(--border-mid)" : "transparent"}`,
                    borderRadius: 10, padding: 5, cursor: "grab",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.label} draggable={false} style={{ width: 30, height: 30, objectFit: "contain" }} />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => { playClick(); setPaletteOpen(o => !o) }}
          title="Stickers"
          onMouseEnter={e => { const svgs = (e.currentTarget as HTMLElement).querySelectorAll("rect"); svgs.forEach(r => r.setAttribute("fill", "rgb(255,107,48)")) }}
          onMouseLeave={e => { const svgs = (e.currentTarget as HTMLElement).querySelectorAll("rect"); svgs.forEach(r => r.setAttribute("fill", "var(--c-secondary)")) }}
          style={{
            background: "var(--bg)", border: "none",
            borderRadius: 8, width: 32, height: 32, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="4" y="7" width="8" height="6" rx="1" fill="var(--c-secondary)" style={{ transition: "fill 0.15s" }} />
            <rect x="5.5" y="4" width="5" height="4" rx="1" fill="var(--c-secondary)" opacity="0.6" style={{ transition: "fill 0.15s" }} />
            <rect x="2" y="13" width="12" height="1.5" rx="0.75" fill="var(--c-secondary)" opacity="0.5" style={{ transition: "fill 0.15s" }} />
          </svg>
        </button>
      </div>
    </>
  )
}
