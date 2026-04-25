"use client"

import { useEffect, useRef, useState } from "react"
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
function PetHand({ onDone }: { onDone: () => void }) {
  return (
    <div
      onAnimationEnd={onDone}
      style={{
        position:      "absolute",
        bottom:        "60%",
        right:         2,
        fontSize:      14,
        lineHeight:    1,
        pointerEvents: "none",
        zIndex:        75,
        userSelect:    "none",
        color:         "var(--c-primary)",
        animation:     "petHand 0.9s ease-out forwards",
      }}
    >
      ✦
    </div>
  )
}

// ── Speech bubble ─────────────────────────────────────────────
function SpeechBubble({ text }: { text: string }) {
  return (
    <div style={{
      position:      "absolute",
      bottom:        "calc(100% - 24px)",
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

// ── Main page buddy ───────────────────────────────────────────
export default function SpriteBuddy() {
  const [buddy,    setBuddy]    = useState<BuddyDef | null>(null)
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

      <style>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: scale(0.85) translateY(4px); transform-origin: bottom right; }
          to   { opacity: 1; transform: scale(1)    translateY(0);   transform-origin: bottom right; }
        }
        @keyframes summonSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes petHand {
          0%   { transform: translateY(-18px) rotate(-22deg); opacity: 0; }
          10%  { opacity: 1; }
          28%  { transform: translateY(7px)   rotate(-8deg); }
          50%  { transform: translateY(-9px)  rotate(-16deg); }
          68%  { transform: translateY(5px)   rotate(-6deg); }
          88%  { opacity: 1; }
          100% { transform: translateY(-20px) rotate(-22deg); opacity: 0; }
        }
      `}</style>
    </>
  )
}
