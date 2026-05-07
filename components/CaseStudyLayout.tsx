"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import MarqueeFooter from "@/components/MarqueeFooter"
import { playClick } from "@/lib/click-sound"

interface Spec       { label: string; value: string | string[] }
interface Contact    { platform: string; handle: string; href: string }
interface Experience { company: string; role: string; period: string }

interface BentoItem {
  video?: string
  image?: string
  label?: string
  span?: number
}

interface ContentBlock {
  image?: string
  images?: string[]
  videos?: string[]
  title?: string
  body?: string
  highlight?: boolean
  note?: string
  objectPosition?: string
}

interface StatBlock { value: string; label: string; body?: string }
interface CardItem  { icon?: string; title: string; body: string }

interface Section {
  label: string
  title?: string
  body?: string
  image?: string
  images?: string[]
  videos?: string[]
  contents?: ContentBlock[]
  experience?: Experience[]
  contacts?: Contact[]
  stat?: StatBlock
  cards?: CardItem[]
  bento?: BentoItem[]
  accordion?: boolean
}

interface Props {
  title: string
  category?: string
  year?: string
  role: string
  team?: string
  overview: string
  specs: Spec[]
  cover?: string
  sections: Section[]
  lockedSections?: Section[]
  password?: string
  passwordDesc?: string
  backHref?: string
  banner?: React.ReactNode
}

const FADE     = { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }
const VIEWPORT = { once: true, margin: "-48px" }


function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
      <span style={{
        fontFamily:    "var(--font-sans)",
        fontSize:      11,
        fontWeight:    600,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        color:         "var(--c-secondary)",
        whiteSpace:    "nowrap" as const,
      }}>
        {text}
      </span>
      <div style={{ flex: 1, height: 1, backgroundColor: "var(--divider)" }} />
    </div>
  )
}

function MediaBox({ src, video }: { src: string; video?: boolean }) {
  return (
    <div style={{
      borderRadius: 14, overflow: "hidden",
      backgroundColor: "var(--surface)",
      border: "1px solid var(--border)",
    }}>
      {video
        ? <video src={src} autoPlay muted loop playsInline style={{ width: "100%", display: "block" }} />
        /* eslint-disable-next-line @next/next/no-img-element */
        : <img src={src} alt="" draggable={false} style={{ width: "100%", display: "block" }} />
      }
    </div>
  )
}

function MediaGrid({ srcs, videos }: { srcs?: string[]; videos?: string[] }) {
  if (!srcs?.length && !videos?.length) return null
  const allMedia = [
    ...(srcs   ?? []).map(s => ({ src: s, video: false })),
    ...(videos ?? []).map(s => ({ src: s, video: true  })),
  ]
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {allMedia.map(({ src, video }, i) => <MediaBox key={i} src={src} video={video} />)}
    </div>
  )
}

function Bento({ items }: { items: BentoItem[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          gridColumn:      item.span === 2 ? "span 2" : "span 1",
          borderRadius:    14,
          overflow:        "hidden",
          border:          "1px solid var(--border)",
          backgroundColor: "var(--surface)",
        }}>
          {item.video && (
            <video src={item.video} autoPlay muted loop playsInline style={{ width: "100%", display: "block" }} />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {item.image && <img src={item.image} alt={item.label ?? ""} draggable={false} style={{ width: "100%", display: "block" }} />}
          {item.label && (
            <div style={{ padding: "6px 12px", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--c-faint)" }}>
              {item.label}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function StatCallout({ stat }: { stat: StatBlock }) {
  return (
    <div style={{
      padding:         "32px 36px",
      borderRadius:    16,
      marginBottom:    32,
      border:          "1px solid var(--border)",
      backgroundColor: "var(--surface)",
    }}>
      <span style={{
        fontFamily:    "var(--font-sans)",
        fontSize:      64,
        fontWeight:    800,
        color:         "var(--c-primary)",
        letterSpacing: "-0.04em",
        lineHeight:    1,
        display:       "block",
      }}>
        {stat.value}
      </span>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--c-mid)", margin: "14px 0 0", letterSpacing: "-0.01em" }}>
        {stat.label}
      </p>
      {stat.body && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 400, color: "var(--c-body)", margin: "6px 0 0", lineHeight: 1.7 }}>
          {stat.body}
        </p>
      )}
    </div>
  )
}

function Cards({ cards }: { cards: CardItem[] }) {
  return (
    <div className="rsp-stack" style={{
      display:             "grid",
      gridTemplateColumns: `repeat(${Math.min(cards.length, 2)}, 1fr)`,
      gap:                 14,
      marginTop:           16,
    }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          padding:         "22px 26px",
          borderRadius:    14,
          border:          "1px solid var(--border)",
          backgroundColor: "var(--surface)",
        }}>
          {card.icon && (
            <span style={{ fontSize: 18, display: "block", marginBottom: 12 }}>{card.icon}</span>
          )}
          <h4 style={{
            fontFamily:    "var(--font-sans)",
            fontSize:      14,
            fontWeight:    600,
            color:         "var(--c-high)",
            letterSpacing: "-0.01em",
            margin:        "0 0 8px",
          }}>
            {card.title}
          </h4>
          <p style={{
            fontFamily:    "var(--font-sans)",
            fontSize:      14,
            fontWeight:    400,
            color:         "var(--c-body)",
            margin:        0,
            lineHeight:    1.7,
            letterSpacing: "-0.01em",
          }}>
            {card.body}
          </p>
        </div>
      ))}
    </div>
  )
}

function renderContentBlock(block: ContentBlock, bi: number) {
  if (block.highlight) {
    const isNumbered = block.title && /^\d+$/.test(block.title.trim())
    return (
      <motion.div
        key={bi}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ ...FADE, delay: bi * 0.05 }}
        style={{
          padding:      isNumbered ? "36px 40px" : "52px 48px",
          borderRadius: 18,
          border:       "1px solid var(--border)",
          textAlign:    isNumbered ? "left" : "center",
        }}
      >
        {isNumbered && (
          <span style={{
            fontFamily:    "var(--font-sans)",
            fontSize:      11,
            fontWeight:    700,
            letterSpacing: "0.1em",
            color:         "var(--c-faint)",
            display:       "block",
            marginBottom:  20,
          }}>
            {block.title}
          </span>
        )}
        {!isNumbered && block.title && (
          <p style={{
            fontFamily:    "var(--font-sans)",
            fontSize:      22,
            fontWeight:    600,
            color:         "var(--c-primary)",
            letterSpacing: "-0.025em",
            lineHeight:    1.45,
            margin:        "0 auto",
            maxWidth:      760,
          }}>
            {block.title}
          </p>
        )}
        {block.body && (
          <p style={{
            fontFamily:    "var(--font-sans)",
            fontSize:      isNumbered ? 22 : 15,
            fontWeight:    400,
            color:         isNumbered ? "var(--c-primary)" : "var(--c-body)",
            margin:        (!isNumbered && block.title) ? "16px auto 0" : 0,
            lineHeight:    isNumbered ? 1.55 : 1.7,
            letterSpacing: isNumbered ? "-0.025em" : "0",
            maxWidth:      isNumbered ? "none" : 640,
          }}>
            {block.body}
          </p>
        )}
      </motion.div>
    )
  }

  const allImages = block.image ? [block.image] : (block.images ?? [])
  const allVideos = block.videos ?? []
  const hasMedia  = allImages.length > 0 || allVideos.length > 0

  // Note variant: image on the left, sticky side-note on the right (below on mobile)
  if (block.note && block.image) {
    return (
      <motion.div
        key={bi}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ ...FADE, delay: bi * 0.05 }}
        className="rsp-stack"
        style={{ display: "grid", gridTemplateColumns: "1fr 212px", gap: 24, alignItems: "start" }}
      >
        <MediaBox src={block.image} />

        {/* Sticky note */}
        <div style={{
          position:      "sticky",
          top:           80,
          background:    "rgba(252,240,140,0.55)",
          border:        "1px solid rgba(200,170,0,0.22)",
          borderRadius:  12,
          overflow:      "hidden",
          boxShadow:     "0 4px 18px rgba(160,130,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          transform:     "rotate(-0.6deg)",
        }}>
          {/* Tape strip at top */}
          <div style={{
            height:     6,
            background: "rgba(240,210,0,0.35)",
            borderBottom: "1px solid rgba(200,170,0,0.18)",
          }} />

          <div style={{ padding: "14px 16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
            {block.title && (
              <span style={{
                fontFamily:    "'Departure Mono', monospace",
                fontSize:      9,
                fontWeight:    700,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color:         "rgba(120,95,0,0.65)",
              }}>
                {block.title}
              </span>
            )}
            <p style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      13,
              fontWeight:    500,
              color:         "rgba(60,45,0,0.82)",
              lineHeight:    1.75,
              margin:        0,
              letterSpacing: "-0.01em",
            }}>
              {block.note}
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      key={bi}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ ...FADE, delay: bi * 0.05 }}
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
    >
      {(block.title || block.body) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {block.title && (
            <h3 style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      22,
              fontWeight:    600,
              color:         "var(--c-primary)",
              letterSpacing: "-0.025em",
              lineHeight:    1.2,
              margin:        0,
            }}>
              {block.title}
            </h3>
          )}
          {block.body && (
            <p style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      16,
              fontWeight:    400,
              color:         "var(--c-body)",
              letterSpacing: "-0.01em",
              lineHeight:    1.85,
              margin:        0,
              whiteSpace:    "pre-line",
            }}>
              {block.body}
            </p>
          )}
        </div>
      )}
      {hasMedia && (
        <MediaGrid srcs={allImages.length ? allImages : undefined} videos={allVideos.length ? allVideos : undefined} />
      )}
    </motion.div>
  )
}

function AccordionContents({ contents }: { contents: ContentBlock[] }) {
  const [active, setActive] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const block = contents[active]
  const mediaSrc = block.videos?.[0]
    ? { src: block.videos[0], video: true }
    : block.image
      ? { src: block.image, video: false }
      : block.images?.[0]
        ? { src: block.images[0], video: false }
        : null
  const objectPos = block.objectPosition ?? "center center"

  const onCarouselScroll = () => {
    const el = carouselRef.current
    if (!el) return
    setActive(Math.round(el.scrollLeft / el.offsetWidth))
  }

  const scrollToSlide = (i: number) => {
    carouselRef.current?.scrollTo({ left: i * (carouselRef.current.offsetWidth), behavior: "smooth" })
  }

  return (
    <>
      {/* Desktop: accordion list + sticky media */}
      <div className="rsp-accordion-desktop" style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 56, alignItems: "start" }}>
        <div style={{ borderTop: "1px solid var(--divider)" }}>
          {contents.map((item, i) => {
            const isActive = active === i
            return (
              <button
                key={i}
                onClick={() => { playClick(); setActive(i) }}
                style={{
                  width:      "100%",
                  display:    "flex",
                  flexDirection: "column",
                  gap:        0,
                  padding:    "22px 0",
                  background: "none",
                  border:     "none",
                  borderBottom: "1px solid var(--divider)",
                  cursor:     "pointer",
                  textAlign:  "left",
                }}
              >
                {/* Header row: number + title + chevron */}
                <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 20px", gap: "0 16px", alignItems: "center" }}>
                  <span style={{
                    fontFamily:    "var(--font-sans)",
                    fontSize:      11,
                    fontWeight:    600,
                    color:         isActive ? "var(--c-primary)" : "var(--c-faint)",
                    letterSpacing: "0.06em",
                    lineHeight:    1.5,
                    transition:    "color 0.2s",
                    alignSelf:     "start",
                    paddingTop:    2,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{
                    fontFamily:    "var(--font-sans)",
                    fontSize:      17,
                    fontWeight:    600,
                    color:         isActive ? "var(--c-primary)" : "var(--c-dim)",
                    letterSpacing: "-0.02em",
                    lineHeight:    1.3,
                    transition:    "color 0.2s",
                  }}>
                    {item.title}
                  </span>
                  <motion.svg
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    style={{ flexShrink: 0, opacity: isActive ? 0.7 : 0.3 }}
                  >
                    <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </motion.svg>
                </div>

                {/* Collapsible body */}
                <AnimatePresence initial={false}>
                  {isActive && item.body && (
                    <motion.div
                      key="body"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden", paddingLeft: 44 }}
                    >
                      <span style={{
                        fontFamily:    "var(--font-sans)",
                        fontSize:      15,
                        fontWeight:    400,
                        color:         "var(--c-secondary)",
                        lineHeight:    1.75,
                        letterSpacing: "-0.01em",
                        display:       "block",
                        paddingTop:    10,
                      }}>
                        {item.body}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </div>

        <div style={{ position: "sticky", top: 80 }}>
          <AnimatePresence mode="wait">
            {mediaSrc && (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                style={{ borderRadius: 14, overflow: "hidden", backgroundColor: "var(--surface)", border: "1px solid var(--border)", height: 440 }}
              >
                {mediaSrc.video
                  ? <video src={mediaSrc.src} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: objectPos, display: "block" }} />
                  /* eslint-disable-next-line @next/next/no-img-element */
                  : <img src={mediaSrc.src} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: objectPos, display: "block" }} />
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile: snap-scroll carousel */}
      <div className="rsp-accordion-mobile" style={{ display: "none" }}>
        <div
          ref={carouselRef}
          onScroll={onCarouselScroll}
          style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        >
          {contents.map((item, i) => {
            const src = item.videos?.[0]
              ? { src: item.videos[0], video: true }
              : item.image
                ? { src: item.image, video: false }
                : item.images?.[0]
                  ? { src: item.images[0], video: false }
                  : null
            const objPos = item.objectPosition ?? "center center"
            return (
              <div key={i} style={{ minWidth: "100%", maxWidth: "100%", flexShrink: 0, overflow: "hidden", scrollSnapAlign: "start", display: "flex", flexDirection: "column", gap: 16 }}>
                {src && (
                  <div style={{ borderRadius: 14, overflow: "hidden", backgroundColor: "var(--surface)", border: "1px solid var(--border)", height: 260 }}>
                    {src.video
                      ? <video src={src.src} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: objPos, display: "block" }} />
                      /* eslint-disable-next-line @next/next/no-img-element */
                      : <img src={src.src} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: objPos, display: "block" }} />
                    }
                  </div>
                )}
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "var(--c-faint)", letterSpacing: "0.06em", paddingTop: 2, flexShrink: 0 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--c-primary)", letterSpacing: "-0.015em", lineHeight: 1.3 }}>
                      {item.title}
                    </span>
                    {item.body && (
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, color: "var(--c-secondary)", lineHeight: 1.75, letterSpacing: "-0.01em", wordBreak: "break-word" }}>
                        {item.body}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
          {contents.map((_, i) => (
            <button
              key={i}
              onClick={() => { playClick(); scrollToSlide(i) }}
              style={{
                width:        active === i ? 16 : 6,
                height:       6,
                borderRadius: 3,
                background:   active === i ? "var(--c-primary)" : "var(--c-ghost)",
                border:       "none",
                cursor:       "pointer",
                padding:      0,
                transition:   "width 0.2s ease, background 0.2s ease",
              }}
            />
          ))}
        </div>
      </div>
    </>
  )
}

function MultiHighlight({ contents, marginTop }: { contents: ContentBlock[]; marginTop: number }) {
  return (
    <div style={{ marginTop }}>
      <div className="rsp-mh-desktop" style={{ display: "grid", gridTemplateColumns: `repeat(${contents.length}, 1fr)`, gap: 16 }}>
        {contents.map((block, bi) => renderContentBlock(block, bi))}
      </div>
      <div className="rsp-mh-mobile" style={{ display: "none", flexDirection: "column", gap: 12 }}>
        {contents.map((block, bi) => renderContentBlock(block, bi))}
      </div>
    </div>
  )
}


function BackButton({ href }: { href: string }) {
  const [hovered, setHovered] = useState(false)
  const router = useRouter()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") router.push(href)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [href, router])

  return (
    <Link
      href={href}
      onClick={() => playClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rsp-hide-mobile"
      style={{
        position:      "fixed", top: 28, left: 32, zIndex: 200,
        fontFamily:    "var(--font-sans)",
        fontSize:      14,
        fontWeight:    500,
        letterSpacing: "-0.01em",
        color:         hovered ? "var(--c-primary)" : "var(--c-dim)",
        textDecoration: "none",
        transition:    "color 0.15s ease",
      }}
    >
      Home
    </Link>
  )
}

const RENDER_W   = 200
const DISPLAY_W  = 110
const NOODLE_SCALE = DISPLAY_W / RENDER_W
const BOT_H      = 89
const MID_H_FULL = 91
const MIN_H      = 18
const TOP_H      = 81
const WRAP_H     = 180
const TOP_DROP   = 14

function NoodleAnimation() {
  const midClipRef = useRef<HTMLDivElement>(null)
  const topImgRef  = useRef<HTMLImageElement>(null)

  useEffect(() => {
    let rafId: number
    function tick() {
      const st  = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p   = max > 0 ? Math.min(1, Math.max(0, st / max)) : 0
      const midH = Math.max(MIN_H, Math.round(MID_H_FULL * (1 - p)))
      if (midClipRef.current) midClipRef.current.style.height = midH + "px"
      if (topImgRef.current)  topImgRef.current.style.bottom  = (BOT_H + midH - TOP_DROP) + "px"
    }
    function onScroll() {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(tick)
    }
    tick()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId) }
  }, [])

  return (
    <div style={{ position: "relative", width: DISPLAY_W, height: Math.round(WRAP_H * NOODLE_SCALE), flexShrink: 0, overflow: "visible" }}>
      {/* Inner div rendered at full 200px then scaled down — keeps SVG crisp */}
      <div style={{
        position:        "absolute",
        bottom:          0,
        left:            0,
        width:           RENDER_W,
        height:          WRAP_H,
        transform:       `scale(${NOODLE_SCALE})`,
        transformOrigin: "bottom left",
        overflow:        "visible",
        opacity:         0,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/noodle-bottom.svg" alt="" draggable={false}
          style={{ position: "absolute", bottom: 0, left: 0, width: RENDER_W, height: BOT_H }} />

        <div ref={midClipRef}
          style={{ position: "absolute", bottom: BOT_H, left: 0, width: RENDER_W, height: MID_H_FULL, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/noodle-middle.svg" alt="" draggable={false}
            style={{ position: "absolute", bottom: 0, left: 0, width: RENDER_W, height: MID_H_FULL }} />
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={topImgRef} src="/noodle-top.svg" alt="" draggable={false}
          style={{ position: "absolute", bottom: BOT_H + MID_H_FULL - TOP_DROP, left: 0, width: RENDER_W, height: TOP_H }} />
      </div>
    </div>
  )
}

function TableOfContents({ backHref, items, activeId }: {
  backHref: string
  items: Array<{ label: string; id: string }>
  activeId: string
}) {
  const [hovId, setHovId] = useState<string | null>(null)
  const [hovHome, setHovHome] = useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", paddingTop: 56 }}>
      <Link
        href={backHref}
        onClick={() => playClick()}
        onMouseEnter={() => setHovHome(true)}
        onMouseLeave={() => setHovHome(false)}
        style={{
          fontFamily:     "var(--font-sans)",
          fontSize:       13,
          fontWeight:     400,
          color:          hovHome ? "rgb(255,107,48)" : "var(--c-dim)",
          letterSpacing:  "-0.01em",
          lineHeight:     1.4,
          textDecoration: "none",
          transition:     "color 0.18s ease",
          padding:        "5px 0",
          display:        "block",
        }}
      >
        Home
      </Link>
      <div style={{ height: 1, backgroundColor: "var(--divider)", margin: "16px 0" }} />
      <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {items.map(({ label, id }) => {
          const isActive = activeId === id
          const isHov    = hovId === id
          return (
            <button
              key={id}
              onClick={() => { playClick(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }) }}
              onMouseEnter={() => setHovId(id)}
              onMouseLeave={() => setHovId(null)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "5px 0", textAlign: "left" }}
            >
              <span style={{
                fontFamily:    "var(--font-sans)",
                fontSize:      13,
                fontWeight:    isActive ? 600 : 400,
                color:         isHov ? "rgb(255,107,48)" : isActive ? "var(--c-primary)" : "var(--c-dim)",
                letterSpacing: "-0.01em",
                lineHeight:    1.4,
                transition:    "color 0.18s ease",
              }}>
                {label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function SectionBlock({ sec, id }: { sec: Section; id?: string }) {
  const topImages   = sec.image ? [sec.image] : (sec.images ?? [])
  const hasTopMedia = topImages.length > 0 || (sec.videos?.length ?? 0) > 0

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ ...FADE, delay: 0 }}
      style={{ paddingTop: 40, paddingBottom: 40 }}
    >
      <SectionLabel text={sec.label} />

      {sec.stat && <StatCallout stat={sec.stat} />}

      {sec.title && (
        <h2 style={{
          fontFamily:    "var(--font-sans)",
          fontSize:      22,
          fontWeight:    600,
          color:         "var(--c-primary)",
          letterSpacing: "-0.025em",
          lineHeight:    1.2,
          margin:        `0 0 ${sec.body ? 16 : hasTopMedia || sec.bento || sec.accordion ? 28 : 0}px`,
        }}>
          {sec.title}
        </h2>
      )}

      {sec.body && (
        <p style={{
          fontFamily:    "var(--font-sans)",
          fontSize:      16,
          fontWeight:    400,
          color:         "var(--c-body)",
          letterSpacing: "-0.01em",
          lineHeight:    1.85,
          margin:        `0 0 ${hasTopMedia || sec.cards || sec.bento ? 32 : 0}px`,
          whiteSpace:    "pre-line",
        }}>
          {sec.body}
        </p>
      )}

      {sec.bento && <Bento items={sec.bento} />}

      {hasTopMedia && (
        <MediaGrid
          srcs={topImages.length ? topImages : undefined}
          videos={sec.videos?.length ? sec.videos : undefined}
        />
      )}

      {sec.cards && <Cards cards={sec.cards} />}

      {sec.contacts && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          {sec.contacts.map(c => (
            <a key={c.platform} href={c.href} target="_blank" rel="noopener noreferrer" onClick={() => playClick()} style={{
              fontFamily:      "var(--font-sans)",
              fontSize:        13,
              fontWeight:      600,
              color:           "var(--c-mid)",
              letterSpacing:   "-0.01em",
              textDecoration:  "none",
              padding:         "9px 20px",
              borderRadius:    99,
              border:          "1px solid var(--border-mid)",
              backgroundColor: "var(--hover-bg)",
            }}>
              {c.platform} ↗
            </a>
          ))}
        </div>
      )}

      {sec.contents && (
        sec.accordion
          ? <div style={{ marginTop: (hasTopMedia || sec.bento) ? 36 : 0 }}>
              <AccordionContents contents={sec.contents} />
            </div>
          : (() => {
              const allHighlight   = sec.contents!.every(b => b.highlight)
              const multiHighlight = allHighlight && sec.contents!.length > 1
              const mt = (hasTopMedia || sec.bento || sec.body) ? 28 : 0
              if (multiHighlight) {
                return <MultiHighlight contents={sec.contents!} marginTop={mt} />
              }
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 40, marginTop: mt }}>
                  {sec.contents!.map((block, bi) => renderContentBlock(block, bi))}
                </div>
              )
            })()
      )}

      {sec.experience && (
        <div style={{ borderTop: "1px solid var(--divider)", marginTop: 8 }}>
          {sec.experience.map((exp, ei) => (
            <motion.div
              key={ei}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.4, delay: ei * 0.05 }}
              style={{
                display:             "grid",
                gridTemplateColumns: "160px 1fr 1fr",
                gap:                 24,
                padding:             "18px 0",
                borderBottom:        "1px solid var(--divider)",
              }}
            >
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "var(--c-high)" }}>{exp.company}</span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 400, color: "var(--c-secondary)" }}>{exp.role}</span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "var(--c-faint)", textAlign: "right" }}>{exp.period}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function SpecValue({ value }: { value: string | string[] }) {
  const items = Array.isArray(value) ? value : [value]
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {items.map((v, i) => (
        <span key={i} style={{
          fontFamily:    "var(--font-sans)",
          fontSize:      13,
          fontWeight:    500,
          color:         "var(--c-secondary)",
          letterSpacing: "-0.01em",
          lineHeight:    1.55,
        }}>
          {v}
        </span>
      ))}
    </div>
  )
}

export default function CaseStudyLayout({
  title, category: _category, year: _year, role, team, overview, specs, cover,
  sections, lockedSections, password, passwordDesc,
  backHref = "/", banner,
}: Props) {
  const [unlocked, setUnlocked] = useState(false)
  const [pwInput,  setPwInput]  = useState("")
  const [pwError,  setPwError]  = useState(false)
  const [activeId, setActiveId] = useState("sec-overview")

  const paragraphs = overview.split("\n\n").filter(Boolean)
  const allSpecs: Spec[] = [
    { label: "Role", value: role },
    ...(team ? [{ label: "Team", value: team }] : []),
    ...specs,
  ]

  const tocItems = [
    { label: "Overview", id: "sec-overview" },
    ...sections.map((s, si) => ({ label: s.label, id: `sec-s${si}` })),
    ...(unlocked && lockedSections ? lockedSections.map((s, si) => ({ label: s.label, id: `sec-l${si}` })) : []),
  ]

  useEffect(() => {
    const ids = tocItems.map(t => t.id)
    const observer = new IntersectionObserver(
      (entries) => {
        // pick the topmost section that is currently intersecting
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked])

  const tryUnlock = () => {
    if (pwInput === password) { setUnlocked(true); setPwError(false) }
    else setPwError(true)
  }

  return (
    <>
    <BackButton href={backHref} />
    <Link
      href={backHref}
      onClick={() => playClick()}
      className="rsp-back-mobile"
      style={{
        display:        "none",
        position:       "fixed",
        top:            20,
        left:           20,
        zIndex:         1002,
        alignItems:     "center",
        justifyContent: "center",
        width:          36,
        height:         36,
        borderRadius:   8,
        background:     "var(--bg)",
        border:         "1px solid var(--border)",
        textDecoration: "none",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M8.5 2.5L4.5 7L8.5 11.5" stroke="var(--c-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Link>
    <div style={{ minHeight: "100dvh", display: "flex", justifyContent: "center" }}>
      <div
        className="rsp-cs-grid"
        style={{
          width:               "100%",
          maxWidth:            1200,
          display:             "grid",
          gridTemplateColumns: "280px 1fr",
          alignItems:          "start",
          padding:             "0 48px",
        }}
      >
        {/* TOC Sidebar — desktop only */}
        <div
          className="rsp-toc-sidebar"
          style={{
            position:      "sticky",
            top:           0,
            height:        "100dvh",
            display:       "flex",
            flexDirection: "row",
            alignItems:    "flex-start",
            gap:           16,
            paddingRight:  24,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <TableOfContents backHref={backHref} items={tocItems} activeId={activeId} />
          </div>
          <div style={{ paddingTop: 56, display: "flex", flexDirection: "column", justifyContent: "center", height: "100dvh" }}>
            <NoodleAnimation />
          </div>
        </div>

        {/* Main content */}
        <main className="rsp-pb" style={{ width: "100%", paddingTop: 56, paddingBottom: 120, minWidth: 0 }}>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={FADE}
            style={{ marginBottom: cover ? 40 : 0 }}
          >
            <h1 className="rsp-cs-h1" style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      36,
              fontWeight:    600,
              color:         "var(--c-primary)",
              letterSpacing: "-0.03em",
              lineHeight:    1.1,
              margin:        "0 0 16px",
            }}>
              {title}
            </h1>

            <div style={{
              display:             "grid",
              gridTemplateColumns: `repeat(${Math.min(allSpecs.length, 5)}, 1fr)`,
              gap:                 32,
              paddingTop:          16,
            }}>
              {allSpecs.map(s => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{
                    fontFamily:    "var(--font-sans)",
                    fontSize:      10,
                    fontWeight:    600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    color:         "var(--c-secondary)",
                  }}>
                    {s.label}
                  </span>
                  <SpecValue value={s.value} />
                </div>
              ))}
            </div>
          </motion.div>

          {banner && <div style={{ marginTop: 24 }}>{banner}</div>}

          {cover && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...FADE, delay: 0.1 }}
              style={{
                borderRadius:    18,
                overflow:        "hidden",
                marginTop:       banner ? 20 : 36,
                border:          "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                maxHeight:       540,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt={title} draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </motion.div>
          )}

          {/* Project Summary */}
          <div id="sec-overview" style={{ marginTop: 52, paddingTop: 48, marginBottom: 52 }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.4 }}
            >
              <SectionLabel text="Project Summary" />
            </motion.div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ ...FADE, delay: i * 0.08 }}
                  style={{
                    fontFamily:    "var(--font-sans)",
                    fontSize:      i === 0 ? 20 : 16,
                    fontWeight:    i === 0 ? 500 : 400,
                    color:         i === 0 ? "var(--c-primary)" : "var(--c-secondary)",
                    letterSpacing: i === 0 ? "-0.02em" : "-0.01em",
                    lineHeight:    i === 0 ? 1.6 : 1.85,
                    margin:        0,
                  }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Sections */}
          {sections.map((sec, si) => (
            <SectionBlock key={si} sec={sec} id={`sec-s${si}`} />
          ))}

          {/* Password gate */}
          {password && !unlocked && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={FADE}
              style={{ paddingTop: 40, paddingBottom: 40 }}
            >
              <SectionLabel text="NDA — Protected Content" />
              {passwordDesc && (
                <p style={{
                  fontFamily:    "var(--font-sans)",
                  fontSize:      16,
                  fontWeight:    500,
                  color:         "var(--c-secondary)",
                  lineHeight:    1.75,
                  margin:        "0 0 32px",
                  letterSpacing: "-0.01em",
                }}>
                  {passwordDesc}
                </p>
              )}
              <div style={{
                display: "flex", gap: 0, alignItems: "stretch", maxWidth: 380,
                border: `1px solid ${pwError ? "rgb(220,60,50)" : "var(--border)"}`,
                borderRadius: 12, overflow: "hidden",
                backgroundColor: "var(--surface)",
                transition: "border-color 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}>
                <input
                  type="password"
                  value={pwInput}
                  onChange={e => { setPwInput(e.target.value); setPwError(false) }}
                  onKeyDown={e => { if (e.key === "Enter") tryUnlock() }}
                  placeholder="Enter password"
                  style={{
                    flex:            1,
                    padding:         "13px 16px",
                    border:          "none",
                    backgroundColor: "transparent",
                    fontFamily:      "var(--font-sans)",
                    fontSize:        14,
                    color:           "var(--c-primary)",
                    outline:         "none",
                    minWidth:        0,
                  }}
                />
                <button
                  onClick={() => { playClick(); tryUnlock() }}
                  style={{
                    padding:         "13px 20px",
                    cursor:          "pointer",
                    border:          "none",
                    borderLeft:      "1px solid var(--border)",
                    backgroundColor: "transparent",
                    fontFamily:      "var(--font-sans)",
                    fontSize:        13,
                    fontWeight:      600,
                    letterSpacing:   "-0.01em",
                    color:           "var(--c-primary)",
                    flexShrink:      0,
                    transition:      "background 0.15s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--hover-bg)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  Unlock
                </button>
              </div>
              {pwError && (
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "rgb(220,60,50)", margin: "8px 0 0" }}>
                  Incorrect password
                </p>
              )}

            </motion.div>
          )}

          {/* Locked sections */}
          {password && unlocked && lockedSections?.map((sec, si) => (
            <SectionBlock key={`locked-${si}`} sec={sec} id={`sec-l${si}`} />
          ))}

        </main>
      </div>
    </div>
    <MarqueeFooter />
    </>
  )
}
