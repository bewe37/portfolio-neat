"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimate } from "framer-motion"
import { getBuddy, BUDDIES, type BuddyDef, type AnimDef } from "@/lib/buddies"

const SCALE        = 3
const MAIN_RIGHT   = 16
const BUDDY_W      = 32 * SCALE
const SUMMON_RIGHT = MAIN_RIGHT + BUDDY_W + 16

// ── Dialog lines ──────────────────────────────────────────────
const DIALOG: Record<string, string[]> = {
  fox: [
    "Nice kerning.",
    "Still here? Impressive.",
    "I've seen better portfolios. Kidding.",
    "You clicked me. Bold.",
    "I'm watching you scroll.",
    "Did you read everything?",
  ],
  squirrel: [
    "NOT NOW I'M BUSY",
    "Did you see my 17 side projects??",
    "AHHHHHH",
    "Wait what were we doing",
    "I found a bug. It's mine now.",
    "SO MUCH ENERGY",
  ],
  cat: [
    "...",
    "hmm.",
    "I was sleeping.",
    "Don't.",
    "*ignores you*",
    "fine.",
  ],
}

// ── Reusable sprite renderer ──────────────────────────────────
function SpriteView({
  buddy, animKey, scale = SCALE, flip = false,
}: {
  buddy: BuddyDef; animKey: string; scale?: number; flip?: boolean
}) {
  const divRef = useRef<HTMLDivElement>(null)
  const w = buddy.tileW * scale
  const h = buddy.tileH * scale

  useEffect(() => {
    const el = divRef.current
    if (!el) return
    const anim: AnimDef = buddy.anims[animKey] ?? buddy.anims[buddy.idleAnim]
    let frame = 0
    el.style.backgroundPosition = `0px -${anim.row * h}px`
    const id = setInterval(() => {
      frame = (frame + 1) % anim.frames
      el.style.backgroundPosition = `-${frame * w}px -${anim.row * h}px`
    }, 1000 / anim.fps)
    return () => clearInterval(id)
  }, [animKey, buddy, w, h])

  return (
    <div
      ref={divRef}
      style={{
        width:              w,
        height:             h,
        backgroundImage:    `url('${buddy.src}')`,
        backgroundRepeat:   "no-repeat",
        backgroundSize:     `${buddy.sheetW * scale}px ${buddy.sheetH * scale}px`,
        backgroundPosition: "0px 0px",
        imageRendering:     "pixelated",
        transform:          flip ? "scaleX(-1)" : "none",
        flexShrink:         0,
      }}
    />
  )
}

export { SpriteView }

// ── Pet indicator ─────────────────────────────────────────────
const SPARKS = [
  { angle: -80, dist: 28, size: 9  },
  { angle: -40, dist: 34, size: 13 },
  { angle:   0, dist: 30, size: 10 },
  { angle:  40, dist: 26, size: 12 },
  { angle:  80, dist: 32, size: 8  },
]

function PetHand({ onDone }: { onDone: () => void }) {
  return (
    <div style={{ position: "absolute", bottom: "70%", right: 10, width: 0, height: 0, pointerEvents: "none", zIndex: 75 }}>
      {SPARKS.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180
        const tx  = Math.cos(rad) * s.dist
        const ty  = -Math.sin(rad) * s.dist
        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1.1 }}
            animate={{ opacity: 0, x: tx, y: ty, scale: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.03, ease: [0.215, 0.61, 0.355, 1] }}
            onAnimationComplete={i === SPARKS.length - 1 ? onDone : undefined}
            style={{ position: "absolute", fontSize: s.size, color: "var(--c-primary)", userSelect: "none", lineHeight: 1 }}
          >
            ✦
          </motion.div>
        )
      })}
    </div>
  )
}

// ── Speech bubble ─────────────────────────────────────────────
function SpeechBubble({ text, bottomOffset }: { text: string; bottomOffset?: number }) {
  return (
    <div style={{
      position:      "absolute",
      bottom:        bottomOffset !== undefined ? bottomOffset : "calc(100% - 24px)",
      right:         0,
      background:    "var(--bg)",
      border:        "1px solid var(--border)",
      borderRadius:  10,
      padding:       "12px 16px 10px",
      fontSize:      12,
      fontFamily:    "var(--font-sans)",
      fontWeight:    500,
      color:         "var(--c-primary)",
      whiteSpace:    "nowrap",
      boxShadow:     "0 4px 18px rgba(0,0,0,0.10)",
      animation:     "bubbleIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
      pointerEvents: "none",
      zIndex:        70,
    }}>
      {text}
      <div style={{
        position:   "absolute",
        bottom:     -5,
        right:      18,
        width:      9,
        height:     9,
        background: "var(--bg)",
        border:     "1px solid var(--border)",
        borderTop:  "none",
        borderLeft: "none",
        transform:  "rotate(45deg)",
      }} />
    </div>
  )
}

// ── Summoned creature ─────────────────────────────────────────
function SummonedBuddy({ buddy }: { buddy: BuddyDef }) {
  const divRef      = useRef<HTMLDivElement>(null)
  const animRef     = useRef(buddy.idleAnim)
  const flipRef     = useRef(false)
  const [speech, setSpeech] = useState<string | null>(null)
  const [petId,  setPetId]  = useState<number | null>(null)
  const petCount    = useRef(0)
  const speechTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const lineRef     = useRef(0)

  // Behaviour pool
  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>
    function next() {
      const picked = buddy.pool[Math.floor(Math.random() * buddy.pool.length)]
      animRef.current = picked
      flipRef.current = ["walk", "run", "trot"].includes(picked) && Math.random() < 0.5
      tid = setTimeout(next, 2000 + Math.random() * 4000)
    }
    tid = setTimeout(next, 800 + Math.random() * 1200)
    return () => clearTimeout(tid)
  }, [buddy])

  // Sprite frame ticker + flip
  useEffect(() => {
    const el = divRef.current
    if (!el) return
    const safeEl = el
    const w = buddy.tileW * SCALE
    const h = buddy.tileH * SCALE
    let lastAnim = ""
    let iid: ReturnType<typeof setInterval> | undefined

    function startAnim() {
      const key     = animRef.current
      const animDef = buddy.anims[key] ?? buddy.anims[buddy.idleAnim]
      clearInterval(iid)
      let frame = 0
      safeEl.style.backgroundPosition = `0px -${animDef.row * h}px`
      safeEl.style.transform = flipRef.current ? "scaleX(-1)" : "none"
      lastAnim = key
      iid = setInterval(() => {
        if (animRef.current !== lastAnim) { startAnim(); return }
        frame = (frame + 1) % animDef.frames
        safeEl.style.backgroundPosition = `-${frame * w}px -${animDef.row * h}px`
        safeEl.style.transform = flipRef.current ? "scaleX(-1)" : "none"
      }, 1000 / animDef.fps)
    }
    startAnim()
    return () => clearInterval(iid)
  }, [buddy])

  function handleClick() {
    petCount.current++
    setPetId(petCount.current)
    const lines = DIALOG[buddy.id] ?? ["..."]
    clearTimeout(speechTimer.current)
    setSpeech(lines[lineRef.current % lines.length])
    lineRef.current++
    speechTimer.current = setTimeout(() => setSpeech(null), 2500)
  }

  const w = buddy.tileW * SCALE
  const h = buddy.tileH * SCALE

  return (
    <div
      onClick={handleClick}
      style={{
        position:   "fixed",
        bottom:     12,
        right:      SUMMON_RIGHT,
        zIndex:     58,
        cursor:     "pointer",
        lineHeight: 0,
        animation:  "summonSlideUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      <div style={{ position: "relative", lineHeight: 0 }}>
        {speech && <SpeechBubble text={speech} />}
        {petId !== null && <PetHand key={petId} onDone={() => setPetId(null)} />}
        <div
          ref={divRef}
          style={{
            width:              w,
            height:             h,
            backgroundImage:    `url('${buddy.src}')`,
            backgroundRepeat:   "no-repeat",
            backgroundSize:     `${buddy.sheetW * SCALE}px ${buddy.sheetH * SCALE}px`,
            backgroundPosition: "0px 0px",
            imageRendering:     "pixelated",
          }}
        />
      </div>
    </div>
  )
}

// ── Custom drawn buddy ────────────────────────────────────────
function CustomBuddy() {
  const [src,         setSrc]         = useState<string | null>(null)
  const [topFraction, setTopFraction] = useState(0.1)
  const [speech,      setSpeech]      = useState<string | null>(null)
  const [petId,       setPetId]       = useState<number | null>(null)
  const petCount    = useRef(0)
  const lineRef     = useRef(0)
  const speechTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [imgRef, animate] = useAnimate()

  useEffect(() => {
    setSrc(localStorage.getItem("customBuddyData"))
    const t = localStorage.getItem("customBuddyTop")
    if (t) setTopFraction(parseFloat(t))
    function onUpdate() {
      if (localStorage.getItem("buddyId") !== "custom") return
      setSrc(localStorage.getItem("customBuddyData"))
      const t2 = localStorage.getItem("customBuddyTop")
      if (t2) setTopFraction(parseFloat(t2))
    }
    window.addEventListener("buddySelected", onUpdate)
    return () => window.removeEventListener("buddySelected", onUpdate)
  }, [])

  useEffect(() => {
    if (!src || !imgRef.current) return
    let cancelled = false

    async function roam() {
      let x = 0

      while (!cancelled) {
        // Measure every step so resizes are respected.
        // The container sits at right:MAIN_RIGHT. translateX moves it left (positive) or right (negative).
        // Left limit: container's natural left edge - padding so it never clips left edge.
        // Right limit: keep at least 8px of the companion visible on the right edge.
        const rect    = imgRef.current!.getBoundingClientRect()
        const naturalLeft  = rect.left - x          // left edge ignoring current transform
        const maxLeft  = Math.max(0, naturalLeft - 8)  // how far left we can go
        const maxRight = Math.min(8, window.innerWidth - rect.right + x - 8) // how far right

        const nextX = Math.max(-maxRight, Math.min(maxLeft, (Math.random() - 0.5) * Math.min(maxLeft + maxRight, 160)))
        const dist  = Math.abs(nextX - x)
        const dur   = 0.5 + (dist / 100) * 1.0 + Math.random() * 0.4

        if (Math.random() < 0.22) {
          const midX = (x + nextX) / 2
          await animate(imgRef.current, { x: midX, y: -38 }, { duration: dur * 0.45, ease: [0.215, 0.61, 0.355, 1] })
          if (cancelled) break
          await animate(imgRef.current, { x: nextX, y: 0 }, { duration: dur * 0.4, ease: [0.55, 0, 1, 0.45] })
        } else {
          await animate(imgRef.current, { x: nextX }, { duration: dur, ease: "easeInOut" })
        }

        if (cancelled) break
        x = nextX
        await new Promise(r => setTimeout(r, 400 + Math.random() * 900))
      }
    }

    roam()
    return () => { cancelled = true }
  }, [src])

  function handleClick() {
    petCount.current++
    setPetId(petCount.current)
    const lines = ["You drew me!", "One of a kind.", "Pixel perfect.", "Still here!", "Made with love.", "✦"]
    clearTimeout(speechTimer.current)
    setSpeech(lines[lineRef.current % lines.length])
    lineRef.current++
    speechTimer.current = setTimeout(() => setSpeech(null), 2500)
  }

  if (!src) return null

  const bubbleBottom = Math.round((1 - topFraction) * 96) + 6

  return (
    <div onClick={handleClick} style={{ position: "fixed", bottom: 12, right: MAIN_RIGHT, zIndex: 60, cursor: "pointer", lineHeight: 0 }}>
      <div style={{ position: "relative", lineHeight: 0 }}>
        {speech && <SpeechBubble text={speech} bottomOffset={bubbleBottom} />}
        {petId !== null && <PetHand key={petId} onDone={() => setPetId(null)} />}
        <img
          ref={imgRef}
          src={src} alt="Your companion" draggable={false}
          style={{ width: 96, height: 96, imageRendering: "pixelated", display: "block" }}
        />
      </div>
    </div>
  )
}

// ── Main page buddy ───────────────────────────────────────────
export default function SpriteBuddy() {
  const [buddy,    setBuddy]    = useState<BuddyDef | null>(null)
  const [isCustom, setIsCustom] = useState(false)
  const [speech,   setSpeech]   = useState<string | null>(null)
  const [summoned, setSummoned] = useState<{ id: number; buddy: BuddyDef } | null>(null)
  const [petId,    setPetId]    = useState<number | null>(null)
  const petCount    = useRef(0)

  const divRef      = useRef<HTMLDivElement>(null)
  const animRef     = useRef<string>("")
  const flipRef     = useRef(false)
  const clickCount  = useRef(0)
  const lineIndex   = useRef(0)
  const speechTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    function load() {
      const id = localStorage.getItem("buddyId")
      if (!id || id === "none") return
      if (id === "custom") { setIsCustom(true); setBuddy(null); return }
      setIsCustom(false)
      const def = getBuddy(id)
      if (!def) return
      setBuddy(def)
      animRef.current = def.idleAnim
    }
    load()
    window.addEventListener("buddySelected", load)
    return () => window.removeEventListener("buddySelected", load)
  }, [])

  // Behaviour pool
  useEffect(() => {
    if (!buddy) return
    let tid: ReturnType<typeof setTimeout>
    function next() {
      const picked = buddy!.pool[Math.floor(Math.random() * buddy!.pool.length)]
      animRef.current = picked
      flipRef.current = ["walk", "run", "trot"].includes(picked) && Math.random() < 0.4
      tid = setTimeout(next, 1800 + Math.random() * 4200)
    }
    tid = setTimeout(next, 1200)
    return () => clearTimeout(tid)
  }, [buddy])

  // Sprite frame ticker + flip
  useEffect(() => {
    if (!buddy) return
    const el = divRef.current
    if (!el) return
    const safeEl = el
    const w = buddy.tileW * SCALE
    const h = buddy.tileH * SCALE
    let lastAnim = ""
    let iid: ReturnType<typeof setInterval> | undefined

    function startAnim() {
      const key     = animRef.current || buddy!.idleAnim
      const animDef = buddy!.anims[key] ?? buddy!.anims[buddy!.idleAnim]
      clearInterval(iid)
      let frame = 0
      safeEl.style.backgroundPosition = `0px -${animDef.row * h}px`
      safeEl.style.transform = flipRef.current ? "scaleX(-1)" : "none"
      lastAnim = key
      iid = setInterval(() => {
        if (animRef.current !== lastAnim) { startAnim(); return }
        frame = (frame + 1) % animDef.frames
        safeEl.style.backgroundPosition = `-${frame * w}px -${animDef.row * h}px`
        safeEl.style.transform = flipRef.current ? "scaleX(-1)" : "none"
      }, 1000 / animDef.fps)
    }
    startAnim()
    return () => clearInterval(iid)
  }, [buddy])

  function handleClick() {
    if (!buddy) return

    petCount.current++
    setPetId(petCount.current)

    const lines = DIALOG[buddy.id] ?? ["..."]
    clearTimeout(speechTimer.current)
    setSpeech(lines[lineIndex.current % lines.length])
    lineIndex.current++
    speechTimer.current = setTimeout(() => setSpeech(null), 2500)

    clickCount.current++
    if (clickCount.current === 3 && summoned === null) {
      const pick = BUDDIES.filter(b => b.id !== buddy.id)[
        Math.floor(Math.random() * (BUDDIES.length - 1))
      ]
      if (pick) setSummoned({ id: Date.now(), buddy: pick })
    }
  }

  const keyframes = `
    @keyframes bubbleIn {
      from { opacity: 0; transform: scale(0.85) translateY(4px); transform-origin: bottom right; }
      to   { opacity: 1; transform: scale(1)    translateY(0);   transform-origin: bottom right; }
    }
    @keyframes summonSlideUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

  `

  if (isCustom) return <><CustomBuddy /><style>{keyframes}</style></>
  if (!buddy) return null

  const w = buddy.tileW * SCALE
  const h = buddy.tileH * SCALE

  return (
    <>
      {summoned && <SummonedBuddy key={summoned.id} buddy={summoned.buddy} />}

      <div
        onClick={handleClick}
        style={{
          position:   "fixed",
          bottom:     12,
          right:      MAIN_RIGHT,
          zIndex:     60,
          cursor:     "pointer",
          lineHeight: 0,
        }}
      >
        <div style={{ position: "relative", lineHeight: 0 }}>
          {speech && <SpeechBubble text={speech} />}
          {petId !== null && <PetHand key={petId} onDone={() => setPetId(null)} />}
          <div
            ref={divRef}
            style={{
              width:              w,
              height:             h,
              backgroundImage:    `url('${buddy.src}')`,
              backgroundRepeat:   "no-repeat",
              backgroundSize:     `${buddy.sheetW * SCALE}px ${buddy.sheetH * SCALE}px`,
              backgroundPosition: "0px 0px",
              imageRendering:     "pixelated",
            }}
          />
        </div>
      </div>

      <style>{keyframes}</style>
    </>
  )
}
