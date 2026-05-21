"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import MarqueeFooter from "@/components/MarqueeFooter"
import FloatingNav from "@/components/FloatingNav"
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
  insight?: string
  insightTitle?: string
  objectPosition?: string
}

interface StatBlock { value: string; label: string; body?: string }
interface CardItem  { icon?: string; title: string; body: string }

interface Section {
  label: string
  title?: string
  href?: string
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
  footnote?: string
  beforeAfter?: [string, string]
  hideToc?: boolean
}

interface NextProject { label: string; title: string; href: string }

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
  nextProject?: NextProject
}

const FADE     = { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }
const VIEWPORT = { once: true, margin: "-48px" }


function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
      <span style={{
        fontFamily:    "var(--font-sans)",
        fontSize:      11,
        fontWeight:    500,
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
      borderRadius: 8, overflow: "hidden",
      backgroundColor: "var(--surface)",
      border: "1px solid var(--border)",
    }}>
      {video
        ? <video src={src} autoPlay muted loop playsInline preload="metadata" style={{ width: "100%", display: "block" }} />
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
          borderRadius:    8,
          overflow:        "hidden",
          border:          "1px solid var(--border)",
          backgroundColor: "var(--surface)",
        }}>
          {item.video && (
            <video src={item.video} autoPlay muted loop playsInline preload="metadata" style={{ width: "100%", display: "block" }} />
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
      borderRadius:    10,
      marginBottom:    28,
      border:          "1px solid var(--border)",
      backgroundColor: "var(--surface)",
      display:         "flex",
      flexDirection:   "column",
      width:           "100%",
    }}>
      <span style={{
        fontFamily:    "var(--font-sans)",
        fontSize:      88,
        fontWeight:    800,
        color:         "var(--c-primary)",
        letterSpacing: "-0.04em",
        lineHeight:    1,
        display:       "block",
      }}>
        {stat.value}
      </span>
      <div style={{ width: 40, height: 2, backgroundColor: "var(--border)", margin: "20px 0 16px" }} />
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, color: "var(--c-mid)", margin: 0, letterSpacing: "-0.01em" }}>
        {stat.label}
      </p>
      {stat.body && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 400, color: "var(--c-body)", margin: "8px 0 0", lineHeight: 1.7 }}>
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
          borderRadius:    10,
          border:          "1px solid var(--border)",
          backgroundColor: "var(--surface)",
        }}>
          {card.icon && (
            <span style={{ fontSize: 18, display: "block", marginBottom: 12 }}>{card.icon}</span>
          )}
          <h4 style={{
            fontFamily:    "var(--font-sans)",
            fontSize:      14,
            fontWeight:    500,
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

function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [pct, setPct] = useState(50)
  const ref = useRef<HTMLDivElement>(null)

  const update = (clientX: number) => {
    const el = ref.current
    if (!el) return
    const { left, width } = el.getBoundingClientRect()
    setPct(Math.min(100, Math.max(0, ((clientX - left) / width) * 100)))
  }

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const move = (e: MouseEvent) => update(e.clientX)
    const up   = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up) }
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)
  }

  const onTouchMove = (e: React.TouchEvent) => update(e.touches[0].clientX)

  return (
    <div ref={ref} style={{ position: "relative", borderRadius: 8, overflow: "hidden", cursor: "col-resize", userSelect: "none", border: "1px solid var(--border)" }}
      onMouseDown={onMouseDown} onTouchMove={onTouchMove}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt="After" style={{ width: "100%", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", width: `${pct}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt="Before" style={{ width: ref.current?.offsetWidth ?? "100%", maxWidth: "none", display: "block" }} />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pct}%`, transform: "translateX(-50%)", width: 2, backgroundColor: "white", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 32, height: 32, borderRadius: "50%", backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2L1 6L4 10M8 2L11 6L8 10" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
      <div style={{ position: "absolute", top: 10, left: 10, padding: "2px 6px", borderRadius: 4, backgroundColor: "rgba(0,0,0,0.4)", color: "white", fontSize: 9, fontWeight: 500, letterSpacing: "0.06em", pointerEvents: "none" }}>BLUEPRINT</div>
      <div style={{ position: "absolute", top: 10, right: 10, padding: "2px 6px", borderRadius: 4, backgroundColor: "rgba(0,0,0,0.4)", color: "white", fontSize: 9, fontWeight: 500, letterSpacing: "0.06em", pointerEvents: "none" }}>FINAL DESIGN</div>
    </div>
  )
}

function HighlightCarousel({ images }: { images: string[] }) {
  const [active, setActive] = useState(0)
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt="" style={{ width: "100%", display: "block" }} />
      </div>
      {images.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width:           i === active ? 16 : 6,
                height:          6,
                borderRadius:    99,
                border:          "none",
                backgroundColor: i === active ? "var(--c-primary)" : "var(--border)",
                padding:         0,
                cursor:          "pointer",
                transition:      "width 0.2s ease, background-color 0.2s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function renderContentBlock(block: ContentBlock, bi: number) {
  if (block.highlight) {
    const isNumbered  = block.title && /^\d+$/.test(block.title.trim())
    const hlImages    = block.images ?? (block.image ? [block.image] : [])
    return (
      <motion.div
        key={bi}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ ...FADE, delay: bi * 0.05 }}
        style={{
          padding:         isNumbered ? "24px 24px" : "24px 24px",
          borderRadius:    10,
          border:          "1px solid var(--border)",
          backgroundColor: "var(--surface)",
          textAlign:       "left",
          display:         "flex",
          flexDirection:   "column",
        }}
      >
        <div>
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
              fontSize:      16,
              fontWeight:    500,
              color:         "var(--c-primary)",
              letterSpacing: "-0.025em",
              lineHeight:    1.45,
              margin:        0,
            }}>
              {block.title}
            </p>
          )}
          {block.body && (
            <p style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      isNumbered ? 22 : (!block.title ? 18 : 16),
              fontWeight:    isNumbered ? 400 : (!block.title ? 500 : 400),
              color:         isNumbered ? "var(--c-primary)" : (!block.title ? "var(--c-primary)" : "var(--c-body)"),
              margin:        (!isNumbered && block.title) ? "6px 0 0" : 0,
              lineHeight:    isNumbered ? 1.55 : (!block.title ? 1.5 : 1.7),
              letterSpacing: isNumbered ? "-0.025em" : (!block.title ? "-0.02em" : "0"),
            }}>
              {block.body}
            </p>
          )}
        </div>
        {hlImages.length > 0 && <HighlightCarousel images={hlImages} />}
      </motion.div>
    )
  }

  const allImages = block.image ? [block.image] : (block.images ?? [])
  const allVideos = block.videos ?? []
  const hasMedia  = allImages.length > 0 || allVideos.length > 0

  // Note variant: with image → side by side; without → standalone card
  if (block.note) {
    const noteCard = (
      <div className="sticky-note" style={{
        borderRadius: 10,
        overflow:     "hidden",
        transform:    "rotate(-0.6deg)",
        ...(block.image ? { position: "sticky", top: 80 } : {}),
      }}>
        <div className="sticky-note-tape" style={{ height: 6 }} />
        <div style={{ padding: "14px 16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
          {block.title && (
            <span className="sticky-note-label" style={{
              fontFamily:    "'Departure Mono', monospace",
              fontSize:      9,
              fontWeight:    700,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
            }}>
              {block.title}
            </span>
          )}
          <p className="sticky-note-body" style={{
            fontFamily:    "var(--font-sans)",
            fontSize:      13,
            fontWeight:    500,
            lineHeight:    1.75,
            margin:        0,
            letterSpacing: "-0.01em",
          }}>
            {block.note}
          </p>
        </div>
      </div>
    )

    return (
      <motion.div
        key={bi}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ ...FADE, delay: bi * 0.05 }}
        className={block.image ? "rsp-stack" : undefined}
        style={block.image
          ? { display: "grid", gridTemplateColumns: "1fr 212px", gap: 24, alignItems: "start" }
          : {}}
      >
        {block.image && <MediaBox src={block.image} />}
        {noteCard}
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
              fontWeight:    500,
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
      {block.insight && (
        <div style={{
          display:         "flex",
          alignItems:      "flex-start",
          gap:             12,
          padding:         "20px 20px",
          borderRadius:    10,
          border:          "1px solid var(--border)",
          backgroundColor: "var(--surface)",
        }}>
          <img src="/Spark.svg" alt="" style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      18,
              fontWeight:    500,
              color:         "var(--c-primary)",
              lineHeight:    1.4,
              margin:        0,
              letterSpacing: "-0.02em",
            }}>
              {block.insightTitle}
            </p>
            <p style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      16,
              fontWeight:    400,
              color:         "var(--c-body)",
              lineHeight:    1.7,
              margin:        0,
              letterSpacing: "-0.01em",
            }}>
              {block.insight}
            </p>
          </div>
        </div>
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
      {/* Desktop: full-width stacked items with dividers */}
      <div className="rsp-accordion-desktop" style={{ display: "flex", flexDirection: "column" }}>
        {contents.map((item, i) => {
          const src = item.videos?.[0]
            ? { src: item.videos[0], video: true }
            : item.image
              ? { src: item.image, video: false }
              : item.images?.[0]
                ? { src: item.images[0], video: false }
                : null
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ ...FADE, delay: i * 0.05 }}
              style={{ paddingTop: i === 0 ? 0 : 48, display: "flex", flexDirection: "column", gap: 24 }}
            >
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.02em", lineHeight: 1.3, margin: 0 }}>
                  {item.title}
                </p>
                {item.body && (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 400, color: "var(--c-body)", lineHeight: 1.85, letterSpacing: "-0.01em", margin: "6px 0 0" }}>
                    {item.body}
                  </p>
                )}
              </div>
              {src && (
                <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
                  {src.video
                    ? <video src={src.src} autoPlay muted loop playsInline preload="metadata" style={{ width: "100%", display: "block" }} />
                    /* eslint-disable-next-line @next/next/no-img-element */
                    : <img src={src.src} alt="" draggable={false} style={{ width: "100%", display: "block" }} />
                  }
                </div>
              )}
            </motion.div>
          )
        })}
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
                  <div style={{ borderRadius: 8, overflow: "hidden", backgroundColor: "var(--surface)", border: "1px solid var(--border)", height: 260 }}>
                    {src.video
                      ? <video src={src.src} autoPlay muted loop playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: objPos, display: "block" }} />
                      /* eslint-disable-next-line @next/next/no-img-element */
                      : <img src={src.src} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: objPos, display: "block" }} />
                    }
                  </div>
                )}
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500, color: "var(--c-faint)", letterSpacing: "0.06em", paddingTop: 2, flexShrink: 0 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.015em", lineHeight: 1.3 }}>
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


function MobileBackBar({ href }: { href: string }) {
  return (
    <Link
      href={href}
      onClick={() => playClick()}
      className="rsp-back-mobile"
      style={{
        display: "none", alignItems: "center", gap: 8,
        padding: "20px 20px 12px",
        fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
        letterSpacing: "-0.01em", color: "var(--c-secondary)",
        textDecoration: "none",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Back
    </Link>
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

const SPARKLE_COLORS = ["#e8443a", "#e07b00", "#c9a000", "#2ba84a", "#1a8fc9", "#9b3fd4"]
const SPARKLE_COUNT  = 8

function HighlightsButton({ id, isActive, onClick, prefix }: { id: string; isActive: boolean; onClick: () => void; prefix?: string }) {
  const [burst, setBurst] = useState(false)
  const [hov, setHov]     = useState(false)

  const handleClick = () => {
    onClick()
    setBurst(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setBurst(true)))
    setTimeout(() => setBurst(false), 700)
  }

  const particles = Array.from({ length: SPARKLE_COUNT }, (_, i) => {
    const angle  = (i / SPARKLE_COUNT) * 360
    const color  = SPARKLE_COLORS[i % SPARKLE_COLORS.length]
    const dist   = 22 + Math.random() * 12
    const rad    = (angle * Math.PI) / 180
    const tx     = Math.cos(rad) * dist
    const ty     = Math.sin(rad) * dist
    return { color, tx, ty, angle, i }
  })

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: "none", border: "none", cursor: "pointer", padding: "5px 0", textAlign: "left", position: "relative" }}
    >
      {burst && particles.map(({ color, tx, ty, i }) => (
        <span
          key={i}
          style={{
            position:  "absolute",
            left:      "50%",
            top:       "50%",
            width:     3,
            height:    3,
            borderRadius: "50%",
            backgroundColor: color,
            pointerEvents: "none",
            transform: `translate(-50%, -50%)`,
            animation: `toc-sparkle-${i} 0.65s cubic-bezier(0.22,1,0.36,1) forwards`,
          }}
        />
      ))}
      <style>{`
        ${particles.map(({ tx, ty, i }) => `
          @keyframes toc-sparkle-${i} {
            0%   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { transform: translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0); opacity: 0; }
          }
        `).join("")}
        @keyframes toc-hl-shimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
      {prefix && (
        <span style={{
          fontFamily:    "var(--font-sans)",
          fontSize:      13,
          fontWeight:    isActive ? 500 : 400,
          letterSpacing: "-0.01em",
          lineHeight:    1.4,
          color:         isActive ? "var(--c-primary)" : "var(--c-dim)",
          transition:    "color 0.18s ease",
        }}>
          {prefix}
        </span>
      )}
      <span style={{
        fontFamily:    "var(--font-sans)",
        fontSize:      13,
        fontWeight:    isActive ? 500 : 400,
        letterSpacing: "-0.01em",
        lineHeight:    1.4,
        background:           "linear-gradient(90deg, #e8443a, #e07b00, #c9a000, #2ba84a, #1a8fc9, #9b3fd4, #e8443a)",
        backgroundSize:       "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor:  "transparent",
        backgroundClip:       "text",
        animation:            (hov || isActive) ? "toc-hl-shimmer 1s linear infinite" : "none",
        transition:           "opacity 0.15s ease",
        opacity:              (hov || isActive) ? 1 : 0.85,
      }}>
        Highlights
      </span>
    </button>
  )
}

function TableOfContents({ backHref, items, activeId }: {
  backHref: string
  items: Array<{ label: string; id: string }>
  activeId: string
}) {
  const [hovId, setHovId] = useState<string | null>(null)
  const [hovHome, setHovHome] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.body.classList.contains("dark"))
  }, [])

  const handleThemeToggle = () => {
    const next = !isDark
    setIsDark(next)
    document.body.classList.add("theme-switching")
    if (next) {
      document.body.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.body.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
    setTimeout(() => document.body.classList.remove("theme-switching"), 600)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", paddingTop: 56 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link
          href={backHref}
          onClick={() => playClick()}
          onMouseEnter={() => setHovHome(true)}
          onMouseLeave={() => setHovHome(false)}
          style={{
            fontFamily:     "var(--font-sans)",
            fontSize:       13,
            fontWeight:     400,
            color:          hovHome ? "var(--c-primary)" : "var(--c-dim)",
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
        <button
          onClick={handleThemeToggle}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            background: "none",
            border:     "none",
            cursor:     "pointer",
            padding:    "5px 0 5px 8px",
            color:      "var(--c-dim)",
            transition: "color 0.15s ease",
            display:    "flex",
            alignItems: "center",
            position:   "relative",
            width:      14,
            height:     14,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--c-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--c-dim)")}
        >
          {/* Sun */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "absolute", transition: "opacity 0.3s ease, transform 0.3s ease", opacity: isDark ? 1 : 0, transform: isDark ? "rotate(0deg) scale(1)" : "rotate(45deg) scale(0.6)" }}>
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          {/* Moon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "absolute", transition: "opacity 0.3s ease, transform 0.3s ease", opacity: isDark ? 0 : 1, transform: isDark ? "rotate(-45deg) scale(0.6)" : "rotate(0deg) scale(1)" }}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
      <div style={{ height: 1, backgroundColor: "var(--divider)", margin: "16px 0" }} />
      <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {items.map(({ label, id }) => {
          const isActive = activeId === id
          const isHov    = hovId === id

          if (label === "Highlights" || label === "Overview / Highlights") {
            return (
              <HighlightsButton
                key={id}
                id={id}
                isActive={isActive}
                prefix={label === "Overview / Highlights" ? "Overview / " : undefined}
                onClick={() => { playClick(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }) }}
              />
            )
          }

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
                fontWeight:    isActive ? 500 : 400,
                letterSpacing: "-0.01em",
                lineHeight:    1.4,
                transition:    "color 0.18s ease",
                color: isHov ? "var(--c-primary)" : isActive ? "var(--c-primary)" : "var(--c-dim)",
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
          fontWeight:    500,
          color:         "var(--c-primary)",
          letterSpacing: "-0.03em",
          lineHeight:    1.2,
          margin:        `0 0 ${sec.body ? 16 : hasTopMedia || sec.bento || sec.accordion ? 28 : 0}px`,
        }}>
          {sec.href ? (
            <Link href={sec.href} onClick={() => playClick()}
              style={{ textDecoration: "none", color: "inherit", display: "inline-flex", alignItems: "center", gap: 10 }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.6"; (e.currentTarget.querySelector(".next-arrow") as HTMLElement).style.transform = "translateX(4px)" }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; (e.currentTarget.querySelector(".next-arrow") as HTMLElement).style.transform = "translateX(0px)" }}
            >
              {sec.title}
              <svg className="next-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ transition: "transform 0.2s ease", flexShrink: 0 }}>
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ) : sec.title}
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

      {sec.beforeAfter && (
        <div style={{ marginTop: 32 }}>
          <BeforeAfterSlider before={sec.beforeAfter[0]} after={sec.beforeAfter[1]} />
        </div>
      )}

      {!sec.beforeAfter && hasTopMedia && (
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
              fontWeight:      500,
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
          ? <div style={{ marginTop: (hasTopMedia || sec.bento || sec.body) ? 36 : 0 }}>
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

      {sec.footnote && (
        <p style={{
          fontFamily:    "var(--font-sans)",
          fontSize:      13,
          fontWeight:    400,
          fontStyle:     "italic",
          color:         "var(--c-faint)",
          letterSpacing: "0.01em",
          lineHeight:    1.6,
          margin:        "20px 0 0",
        }}>
          {sec.footnote}
        </p>
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
  backHref = "/", banner, nextProject,
}: Props) {
  const [unlocked, setUnlocked] = useState(false)
  const [pwInput,  setPwInput]  = useState("")
  const [pwError,  setPwError]  = useState(false)
  const allSpecs: Spec[] = [
    { label: "Role", value: role },
    ...(team ? [{ label: "Team", value: team }] : []),
    ...specs,
  ]

  const tocItems = [
    { label: "Overview", id: "sec-overview" },
    ...sections.map((s, si) => ({ label: s.label, id: `sec-s${si}`, hide: s.hideToc })).filter(t => !t.hide),
    ...(unlocked && lockedSections ? lockedSections.map((s, si) => ({ label: s.label, id: `sec-l${si}`, hide: s.hideToc })).filter(t => !t.hide) : []),
  ]

  const [activeId, setActiveId] = useState(tocItems[0]?.id ?? "")

  const tocIds = tocItems.map(t => t.id).join(",")

  useEffect(() => {
    const ids = tocItems.map(t => t.id)
    const observer = new IntersectionObserver(
      (entries) => {
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
  }, [tocIds])

  const tryUnlock = () => {
    if (pwInput === password) { setUnlocked(true); setPwError(false) }
    else setPwError(true)
  }

  return (
    <>
    <MobileBackBar href={backHref} />
    <div style={{ display: "flex", justifyContent: "center" }}>
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
            height:        "fit-content",
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
          <div style={{ paddingTop: 56, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <NoodleAnimation />
          </div>
        </div>

        {/* Main content */}
        <main className="rsp-cs-main" style={{ width: "100%", paddingTop: 56, paddingBottom: 40, minWidth: 0 }}>

          {/* Header */}
          <motion.div
            id="sec-overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={FADE}
            style={{
              marginBottom: 40,
            }}
          >
            <h1 className="rsp-cs-h1" style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      22,
              fontWeight:    500,
              color:         "var(--c-primary)",
              letterSpacing: "-0.025em",
              lineHeight:    1.2,
              margin:        "0 0 10px",
            }}>
              {title}
            </h1>

            <p style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      16,
              fontWeight:    400,
              color:         "var(--c-body)",
              letterSpacing: "-0.01em",
              lineHeight:    1.85,
              margin:        "0 0 24px",
            }}>
              {overview}
            </p>


            <div style={{
              display:             "grid",
              gridTemplateColumns: `repeat(${Math.min(allSpecs.length, 5)}, 1fr)`,
              gap:                 24,
            }}>
              {allSpecs.map(s => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{
                    fontFamily:    "var(--font-sans)",
                    fontSize:      10,
                    fontWeight:    500,
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

          {banner && <div style={{ marginBottom: 24 }}>{banner}</div>}

          {cover && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...FADE, delay: 0.1 }}
              style={{
                borderRadius:    8,
                overflow:        "hidden",
                marginBottom:    40,
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
                  fontWeight:    400,
                  color:         "var(--c-body)",
                  lineHeight:    1.85,
                  margin:        "0 0 32px",
                  letterSpacing: "-0.01em",
                }}>
                  {passwordDesc}
                </p>
              )}
              <div style={{
                display: "flex", gap: 0, alignItems: "stretch", maxWidth: 380,
                border: `1px solid ${pwError ? "rgb(220,60,50)" : "var(--border)"}`,
                borderRadius: 10, overflow: "hidden",
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
                    fontWeight:      500,
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
    {nextProject && (
      <div style={{ borderTop: "1px solid var(--divider)", padding: "48px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 1200, padding: "0 48px" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--c-secondary)" }}>
            {nextProject.label}
          </span>
          <Link
            href={nextProject.href}
            onClick={() => playClick()}
            style={{ display: "block", textDecoration: "none", marginTop: 12 }}
          >
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "clamp(22px, 3vw, 36px)",
              fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.03em",
              lineHeight: 1.2, margin: 0,
              transition: "opacity 0.15s ease",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {nextProject.title} →
            </p>
          </Link>
        </div>
      </div>
    )}
    <div style={{ overflow: "hidden" }}><MarqueeFooter /></div>
    </>
  )
}
