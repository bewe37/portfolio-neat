"use client"

import { motion, AnimatePresence, useAnimation } from "framer-motion"
import {
  useState,
  useMemo,
  useRef,
  useEffect,
  type CSSProperties,
} from "react"
import { createPortal } from "react-dom"

/* ── pseudo-random ───────────────────────────────────────────────────── */
function makeRand(seed: number) {
  return (step: number) => {
    const x = Math.sin(seed * 9301 + step * 49297) * 233280
    return x - Math.floor(x)
  }
}

/* ── rough ellipse path ──────────────────────────────────────────────── */
function buildRoughEllipsePath(
  vbW: number,
  vbH: number,
  padX: number,
  padY: number,
  seed: number,
  roughness: number,
  overshoot: number,
  offsetX = 0,
  offsetY = 0,
  rotation = 0
): string {
  const rand = makeRand(seed)
  const jitter = (amp: number, n: number) => (rand(n) - 0.5) * amp
  const cx = vbW / 2 + offsetX
  const cy = vbH / 2 + offsetY
  const rx = vbW / 2 - padX
  const ry = vbH / 2 - padY
  const N = 20
  const radial = 4 * roughness
  const tangent = 6 * roughness
  const armJitter = 0.25 * roughness
  const rot = (rotation * Math.PI) / 180

  type Pt = { x: number; y: number; t: number }
  const anchors: Pt[] = []
  for (let i = 0; i <= N; i++) {
    const baseT = -Math.PI / 2 + (2 * Math.PI * i) / N
    const extra =
      i === N ? (overshoot / ((rx + ry) / 2)) * (roughness * 0.5 + 0.8) : 0
    const t = baseT + extra
    const rJit = jitter(radial, i * 3 + 1)
    const rxi = rx + rJit
    const ryi = ry + rJit * 0.85
    const tangentShift = jitter(tangent / ((rxi + ryi) / 2), i * 3 + 2)
    const tt = t + tangentShift
    let px = rxi * Math.cos(tt)
    let py = ryi * Math.sin(tt)
    if (rot !== 0) {
      const rxp = px * Math.cos(rot) - py * Math.sin(rot)
      const ryp = px * Math.sin(rot) + py * Math.cos(rot)
      px = rxp; py = ryp
    }
    anchors.push({ x: cx + px, y: cy + py, t: tt })
  }

  const segs: string[] = [`M ${anchors[0].x.toFixed(2)} ${anchors[0].y.toFixed(2)}`]
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i]
    const b = anchors[i + 1]
    const dt = b.t - a.t
    const baseArm = (4 / 3) * Math.tan(dt / 4)
    const arm1 = baseArm * (1 + jitter(armJitter, i * 5 + 3))
    const arm2 = baseArm * (1 + jitter(armJitter, i * 5 + 4))
    const prev = i === 0 ? a : anchors[i - 1]
    const next = i + 2 >= anchors.length ? b : anchors[i + 2]
    const t1x = (b.x - prev.x) * 0.5
    const t1y = (b.y - prev.y) * 0.5
    const t2x = (next.x - a.x) * 0.5
    const t2y = (next.y - a.y) * 0.5
    const c1x = a.x + t1x * arm1 + jitter(radial * 0.5, i * 5 + 5)
    const c1y = a.y + t1y * arm1 + jitter(radial * 0.5, i * 5 + 6)
    const c2x = b.x - t2x * arm2 + jitter(radial * 0.5, i * 5 + 7)
    const c2y = b.y - t2y * arm2 + jitter(radial * 0.5, i * 5 + 8)
    segs.push(
      `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${b.x.toFixed(2)} ${b.y.toFixed(2)}`
    )
  }
  return segs.join(" ")
}

/* ── Tooltip ─────────────────────────────────────────────────────────── */
function Tooltip({
  show,
  anchor,
  imageSrc,
  width,
  height,
  radius,
  offset,
}: {
  show: boolean
  anchor: React.RefObject<HTMLElement | null>
  imageSrc?: string
  width: number
  height: number
  radius: number
  offset: number
}) {
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!show || !anchor.current || typeof window === "undefined") return
    const update = () => {
      const el = anchor.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setCoords({ x: r.left + window.scrollX + r.width / 2, y: r.bottom + window.scrollY })
    }
    update()
    window.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
    }
  }, [show, anchor])

  if (typeof document === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {show && imageSrc && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.96, transition: { duration: 0.12, ease: "easeIn" } }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: "absolute",
            top: coords.y + offset,
            left: coords.x,
            transform: "translateX(-50%)",
            zIndex: 99999,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width,
              height,
              borderRadius: radius,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 48px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.35)",
              backgroundColor: "rgb(20,20,20)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

/* ── PenChip ─────────────────────────────────────────────────────────── */
function PenChip({
  label, link, color, strokeWidth, duration, idleOpacity, wordGap,
  circlePadX, circlePadY, roughness, textColor, seedBase, image,
  tooltipWidth, tooltipHeight, tooltipRadius, tooltipOffset, font,
}: {
  label: string; link?: string; color: string; strokeWidth: number
  duration: number; idleOpacity: number; wordGap: number; circlePadX: number
  circlePadY: number; roughness: number; textColor: string; seedBase: number
  image?: { src?: string }; tooltipWidth: number; tooltipHeight: number
  tooltipRadius: number; tooltipOffset: number; font?: string
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [hovered, setHovered] = useState(false)
  const seed = useMemo(() => seedBase + label.length * 17, [seedBase, label])

  const vbW = 300, vbH = 80, pathInset = 14, overshoot = 22

  const pathPrimary = useMemo(() =>
    buildRoughEllipsePath(vbW, vbH, pathInset, pathInset, seed, roughness, overshoot,
      0, 0, (makeRand(seed)(99) - 0.5) * 6 * roughness),
    [seed, roughness]
  )
  const pathSecondary = useMemo(() =>
    buildRoughEllipsePath(vbW, vbH, pathInset, pathInset, seed + 9991, roughness * 0.9,
      overshoot * 0.6, (makeRand(seed)(1000) - 0.5) * 3 * roughness,
      (makeRand(seed)(1001) - 0.5) * 2 * roughness, (makeRand(seed)(1002) - 0.5) * 4 * roughness),
    [seed, roughness]
  )

  const controls = useAnimation()
  const controlsSecondary = useAnimation()

  const draw = (delay = 0) => {
    controls.set({ pathLength: 0, opacity: 1 })
    controlsSecondary.set({ pathLength: 0, opacity: 0 })
    controls.start({ pathLength: 1, transition: { duration, ease: [0.65, 0, 0.35, 1], delay } })
    controlsSecondary.start({
      pathLength: 1, opacity: 1,
      transition: {
        pathLength: { duration: duration * 0.7, ease: [0.65, 0, 0.35, 1], delay: delay + duration * 0.55 },
        opacity: { duration: 0.2, delay: delay + duration * 0.55 },
      },
    })
  }

  useEffect(() => {
    draw(0.15 + (seedBase - 1) * 0.35)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEnter = () => { setHovered(true); draw() }
  const handleLeave = () => setHovered(false)

  const chipPadding = circlePadX + wordGap
  const showSecondary = roughness >= 0.6

  const inner = (
    <motion.span
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: "relative", display: "inline-block",
        padding: `0 ${chipPadding}px`, color: textColor,
        cursor: link ? "pointer" : "default", textDecoration: "none", whiteSpace: "nowrap",
      }}
      animate={{ color: hovered ? color : textColor }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <span style={{ position: "relative", zIndex: 1, fontFamily: font ?? "inherit" }}>{label}</span>
      <motion.svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: `-${circlePadY}px`,
          left: `${wordGap}px`,
          width: `calc(100% - ${wordGap * 2}px)`,
          height: `calc(100% + ${circlePadY * 2}px)`,
          pointerEvents: "none",
          overflow: "visible",
        }}
        animate={{ opacity: hovered ? 1 : idleOpacity }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        aria-hidden
      >
        <motion.path
          d={pathPrimary} fill="none" stroke={color}
          strokeWidth={strokeWidth * (vbW / 200)}
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 1 }} animate={controls}
        />
        {showSecondary && (
          <motion.path
            d={pathSecondary} fill="none" stroke={color}
            strokeWidth={strokeWidth * (vbW / 200) * 0.75}
            strokeLinecap="round" strokeLinejoin="round"
            opacity={0.45} initial={{ pathLength: 0, opacity: 0 }} animate={controlsSecondary}
          />
        )}
      </motion.svg>
      <Tooltip
        show={hovered} anchor={ref} imageSrc={image?.src}
        width={tooltipWidth} height={tooltipHeight} radius={tooltipRadius} offset={tooltipOffset}
      />
    </motion.span>
  )

  if (link) return <a href={link} style={{ color: "inherit", textDecoration: "none", display: "inline" }}>{inner}</a>
  return inner
}

/* ── Main ────────────────────────────────────────────────────────────── */
export default function HeroTextWithPen({
  before = "Hey, I'm",
  middle = "a design engineer at",
  after = "based in Toronto. I spend most of my time crafting polished interfaces for web experiences, and I'm passionate about accessibility, web animation and building products.",
  name = "Georgius",
  nameLink = "",
  nameColor = "rgb(255, 107, 48)",
  nameImage,
  company = "AMD",
  companyLink = "/amd_software_simplified",
  companyColor = "rgb(176, 190, 255)",
  companyImage,
  strokeWidth = 1.6,
  duration = 0.7,
  idleOpacity = 0.7,
  wordGap = 4,
  circlePadX = 8,
  circlePadY = 10,
  roughness = 1,
  textColor = "rgba(255, 255, 255, 0.95)",
  dimmedColor = "rgba(255, 255, 255, 0.55)",
  fontSize = 16,
  lineHeight = 1.75,
  fontWeight = 500,
  fontFamily = "var(--font-sans)",
  nameFont,
  companyFont,
  tooltipWidth = 160,
  tooltipHeight = 110,
  tooltipRadius = 10,
  tooltipOffset = 12,
  style,
}: {
  before?: string; middle?: string; after?: string
  name?: string; nameLink?: string; nameColor?: string; nameImage?: { src?: string }
  company?: string; companyLink?: string; companyColor?: string; companyImage?: { src?: string }
  strokeWidth?: number; duration?: number; idleOpacity?: number; wordGap?: number
  circlePadX?: number; circlePadY?: number; roughness?: number
  textColor?: string; dimmedColor?: string; fontSize?: number; lineHeight?: number
  fontWeight?: number; fontFamily?: string; nameFont?: string; companyFont?: string
  tooltipWidth?: number; tooltipHeight?: number; tooltipRadius?: number; tooltipOffset?: number
  style?: CSSProperties
}) {
  const [blockHovered, setBlockHovered] = useState(false)
  const chipProps = { strokeWidth, duration, idleOpacity, wordGap, circlePadX, circlePadY, roughness, textColor, tooltipWidth, tooltipHeight, tooltipRadius, tooltipOffset }

  return (
    <motion.p
      onMouseEnter={() => setBlockHovered(true)}
      onMouseLeave={() => setBlockHovered(false)}
      style={{ margin: 0, fontFamily, fontSize: `${fontSize}px`, fontWeight, lineHeight, letterSpacing: "-0.01em", ...style }}
      animate={{ color: blockHovered ? dimmedColor : textColor }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {before}
      <PenChip label={name} link={nameLink || undefined} color={nameColor} seedBase={1} image={nameImage} font={nameFont} {...chipProps} />
      {middle}
      <PenChip label={company} link={companyLink || undefined} color={companyColor} seedBase={2} image={companyImage} font={companyFont} {...chipProps} />
      {after}
    </motion.p>
  )
}
