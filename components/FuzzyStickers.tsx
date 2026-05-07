"use client"

import { useRef, useEffect, useState, useCallback } from "react"

const PEEL_EASING = `2s linear(0,0.002 0.4%,0.008 0.9%,0.02 1.4%,0.035 1.9%,0.055 2.4%,0.083 3%,0.11 3.5%,0.146 4.1%,0.214 5.1%,0.297 6.2%,0.624 10.2%,0.756 11.9%,0.821 12.8%,0.874 13.6%,0.93 14.5%,0.975 15.3%,1.016 16.1%,1.053 16.9%,1.085 17.7%,1.116 18.6%,1.139 19.4%,1.16 20.3%,1.176 21.2%,1.187 22.1%,1.195 23.2%,1.197 24.4%,1.193 25.6%,1.183 26.9%,1.17 28.1%,1.153 29.4%,1.055 35.6%,1.031 37.3%,1.012 38.8%,0.994 40.6%,0.98 42.3%,0.97 44.1%,0.964 45.9%,0.961 48.3%,0.964 51.1%,0.97 53.7%,0.997 62.7%,1.003 66%,1.007 69.3%,1.007 74.4%,1 89.2%,1)`
const HOVER_EASING = `1s linear(0,0.008 1.1%,0.031 2.2%,0.129 4.8%,0.257 7.2%,0.671 14.2%,0.789 16.5%,0.881 18.6%,0.957 20.7%,1.019 22.9%,1.063 25.1%,1.094 27.4%,1.114 30.7%,1.112 34.5%,1.018 49.9%,0.99 59.1%,1)`
const PAD   = "10px"
const START = `calc(-1 * ${PAD})`
const END   = `calc(100% + ${PAD})`
const PH    = "30%"
const PA    = "60%"

// ── Fuzzy shape SVGs ────────────────────────────────────────────────────────
// Each is 120×120, filled with colour, white stroke outline

function enc(svg: string) {
  return "data:image/svg+xml," + encodeURIComponent(svg)
}

// 4-point sparkle star
const STAR = enc(`<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M60 8 C60 8 64 44 76 60 C64 76 60 112 60 112 C60 112 56 76 44 60 C56 44 60 8 60 8Z" fill="#F5A623" stroke="white" stroke-width="5" stroke-linejoin="round"/>
  <path d="M8 60 C8 60 44 56 60 44 C76 56 112 60 112 60 C112 60 76 64 60 76 C44 64 8 60 8 60Z" fill="#F5A623" stroke="white" stroke-width="5" stroke-linejoin="round"/>
</svg>`)

// Spiky daisy (many small petals)
const SPIKY = enc(`<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M60 10
    C62 28 68 30 72 22 C70 38 78 42 84 36 C78 50 86 56 92 52
    C84 62 90 70 96 68 C86 76 88 84 94 86
    C82 88 80 96 86 100 C74 98 70 106 72 112
    C66 104 60 106 60 112 C54 106 48 104 48 112
    C50 106 46 98 34 100 C40 96 38 88 26 86
    C32 84 34 76 24 68 C30 70 36 62 28 52
    C34 56 42 50 34 36 C40 42 48 38 46 22
    C52 30 58 28 60 10Z"
    fill="#4A7CF7" stroke="white" stroke-width="5" stroke-linejoin="round"/>
</svg>`)

// Puffy cloud flower (rounded bumps)
const PUFFY = enc(`<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M60 14
    C64 14 70 18 70 24 C76 18 84 18 88 24 C94 24 98 30 96 36
    C102 38 106 46 102 52 C108 56 108 66 102 68
    C106 74 104 82 98 84 C98 90 92 96 86 94
    C84 100 76 102 72 98 C68 104 62 104 60 100
    C58 104 52 104 48 98 C44 102 36 100 34 94
    C28 96 22 90 22 84 C16 82 14 74 18 68
    C12 66 12 56 18 52 C14 46 18 38 24 36
    C22 30 26 24 32 24 C36 18 44 18 50 24
    C50 18 56 14 60 14Z"
    fill="#56BFEF" stroke="white" stroke-width="5" stroke-linejoin="round"/>
</svg>`)

// Swirl spiky flower
const SWIRL = enc(`<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M60 10
    C66 20 76 16 80 8 C82 22 92 24 98 18
    C96 32 106 38 112 34 C106 46 112 56 112 60
    C106 60 106 72 114 76 C104 76 100 86 106 92
    C94 88 88 96 92 104 C80 98 76 108 78 114
    C70 106 60 110 58 116 C54 108 44 110 40 116
    C40 106 30 102 22 108 C26 98 20 88 10 92
    C16 84 12 74 4 76 C10 68 8 58 4 52
    C12 52 18 42 14 32 C24 38 32 32 30 18
    C38 26 48 22 48 10 C52 20 62 18 60 10Z"
    fill="#E8423A" stroke="white" stroke-width="5" stroke-linejoin="round"/>
</svg>`)

const STICKERS = [
  { svg: STAR,  size: 88,  top:  48, right: 120, rotate: -12 },
  { svg: SPIKY, size: 72,  top: 160, right:  44, rotate:  18 },
  { svg: PUFFY, size: 68,  top: 260, right: 130, rotate:  -8 },
  { svg: SWIRL, size: 70,  top: 350, right:  60, rotate:  22 },
]

// ── Single sticker ───────────────────────────────────────────────────────────
function Sticker({ svg, size, top, right, rotate, filterId }: {
  svg: string; size: number; top: number; right: number; rotate: number; filterId: string
}) {
  const containerRef   = useRef<HTMLDivElement>(null)
  const draggableRef   = useRef<HTMLDivElement>(null)
  const plRef          = useRef<SVGFEPointLightElement>(null)
  const plFlippedRef   = useRef<SVGFEPointLightElement>(null)
  const isDragging     = useRef(false)
  const dragOffset     = useRef({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [active,  setActive]  = useState(false)

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const el  = containerRef.current
      const pl  = plRef.current
      const plf = plFlippedRef.current
      if (!el || !pl || !plf) return
      const rect = el.getBoundingClientRect()
      pl.setAttribute("x",  String(e.clientX - rect.left))
      pl.setAttribute("y",  String(e.clientY - rect.top))
      plf.setAttribute("x", String(e.clientX - rect.left))
      plf.setAttribute("y", String(rect.height - (e.clientY - rect.top)))
      if (isDragging.current && draggableRef.current) {
        draggableRef.current.style.left = (e.clientX - dragOffset.current.x) + "px"
        draggableRef.current.style.top  = (e.clientY - dragOffset.current.y) + "px"
      }
    }
    function onMouseUp() { isDragging.current = false }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp) }
  }, [])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!draggableRef.current) return
    isDragging.current = true
    const rect = draggableRef.current.getBoundingClientRect()
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    draggableRef.current.style.position = "fixed"
    draggableRef.current.style.left = rect.left + "px"
    draggableRef.current.style.top  = rect.top  + "px"
    draggableRef.current.style.right = "auto"
  }, [])

  const mainClip = active
    ? `polygon(${START} ${PA}, ${END} ${PA}, ${END} ${END}, ${START} ${END})`
    : hovered
    ? `polygon(${START} ${PH}, ${END} ${PH}, ${END} ${END}, ${START} ${END})`
    : `polygon(${START} ${START}, ${END} ${START}, ${END} ${END}, ${START} ${END})`

  const flapClip = active
    ? `polygon(${START} ${START}, ${END} ${START}, ${END} ${PA}, ${START} ${PA})`
    : hovered
    ? `polygon(${START} ${START}, ${END} ${START}, ${END} ${PH}, ${START} ${PH})`
    : `polygon(${START} ${START}, ${END} ${START}, ${END} ${START}, ${START} ${START})`

  const flapTop = active
    ? `calc(-100% + 2 * ${PA} - 1px)`
    : hovered
    ? `calc(-100% + 2 * ${PH} - 1px)`
    : `calc(-100% - ${PAD} - ${PAD})`

  const transition = active ? `all ${PEEL_EASING}` : `all ${HOVER_EASING}`
  const plId    = `${filterId}_pl`
  const plFId   = `${filterId}_plf`
  const shadowId = `${filterId}_shadow`
  const fillId  = `${filterId}_fill`

  return (
    <>
      <svg height="0" width="0" style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          <filter id={plId}>
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feSpecularLighting result="spec" in="blur" specularExponent="100" specularConstant="0.1" lightingColor="white">
              <fePointLight ref={plRef} x="60" y="60" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" operator="screen" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id={plFId}>
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feSpecularLighting result="spec" in="blur" specularExponent="100" specularConstant="0.6" lightingColor="white">
              <fePointLight ref={plFlippedRef} x="60" y="60" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" operator="screen" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id={shadowId}>
            <feDropShadow dx="1" dy="2" stdDeviation="4" floodColor="black" floodOpacity="0.15" />
          </filter>
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
        style={{ position: "absolute", top, right, cursor: "grab", zIndex: 20, userSelect: "none" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); setActive(false) }}
          onMouseDown={() => setActive(true)}
          onMouseUp={() => setActive(false)}
          style={{ position: "relative" }}
        >
          {/* Body */}
          <div style={{ clipPath: mainClip, transition, filter: `url(#${shadowId})`, willChange: "clip-path" }}>
            <div style={{ filter: `url(#${plId})` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={svg} alt="" draggable={false} style={{ width: size, display: "block", transform: `rotate(${rotate}deg)` }} />
            </div>
          </div>

          {/* Shadow blob */}
          <div style={{ position: "absolute", top: "0.6rem", left: "0.3rem", width: "100%", height: "100%", filter: "brightness(0) blur(8px)", opacity: 0.12, pointerEvents: "none" }}>
            <div style={{ filter: `url(#${fillId})` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={svg} alt="" draggable={false} style={{ width: size, display: "block", transform: `rotate(${rotate}deg)` }} />
            </div>
          </div>

          {/* Peeled flap */}
          <div style={{ position: "absolute", width: "100%", height: "100%", left: 0, top: flapTop, clipPath: flapClip, transform: "scaleY(-1)", transition, willChange: "clip-path, top", pointerEvents: "none" }}>
            <div style={{ filter: `url(#${plFId})` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={svg} alt="" draggable={false} style={{ width: size, display: "block", transform: `rotate(${rotate}deg)`, filter: `url(#${fillId})` }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function FuzzyStickers() {
  return (
    <>
      {STICKERS.map((s, i) => (
        <Sticker key={i} {...s} filterId={`fuzzy_${i}`} />
      ))}
    </>
  )
}
