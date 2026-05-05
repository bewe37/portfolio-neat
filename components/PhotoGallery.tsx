"use client"

import { useRef, useState, useCallback } from "react"
import { motion, useMotionValue, AnimatePresence } from "framer-motion"

interface Photo { src: string; label?: string }

const PHOTOS: Photo[] = [
  { src: "/nyc.jpg",         label: "Employees Only - NYC"      },
  { src: "/austria.jpg",     label: "Austria"       },
  { src: "/korea.jpg",       label: "Korea"         },
  { src: "/paris.jpg",       label: "Paris"         },
  { src: "/parisSelfie.jpg", label: "Paris & Me"         },
  { src: "/vanc.jpg",        label: "Vancouver"     },
  { src: "/BC.jpg",          label: "Vancouver Island"            },
  { src: "/banfff.jpg",      label: "Banff"         },
  { src: "/dawg.jpg",        label: "Leo - My Dawg"                         },
  { src: "/fred.jpg",        label: "Toronto - Fred Again"                         },
  { src: "/image3.jpg",      label: "Dumbo"                          },
  { src: "/image4.jpg",       label: "Austria"                        },
]

// Scatter layout — 12 photos in two rows of 6
const SCATTER_W = 1100
const LAYOUT = [
  // Row 1
  { x:   8, y:  24, r: -5.5 },
  { x: 188, y:  14, r:  3.2 },
  { x: 368, y:  30, r: -2.8 },
  { x: 548, y:  10, r:  5.5 },
  { x: 728, y:  28, r: -4.0 },
  { x: 908, y:  18, r:  3.8 },
  // Row 2
  { x:   8, y: 238, r:  4.5 },
  { x: 188, y: 224, r: -6.0 },
  { x: 368, y: 244, r:  2.8 },
  { x: 548, y: 228, r: -3.5 },
  { x: 728, y: 240, r:  4.8 },
  { x: 908, y: 226, r: -5.0 },
]

const SPRING = { type: "spring" as const, stiffness: 300, damping: 24 }
const GENIE  = { type: "spring" as const, stiffness: 260, damping: 22 }

function Card({
  photo, ix, iy, ir, zIndex, onActivate, onOpen, containerRef,
}: {
  photo: Photo
  ix: number; iy: number; ir: number
  zIndex: number
  onActivate: () => void
  onOpen: (rect: DOMRect) => void
  containerRef: React.RefObject<HTMLDivElement>
}) {
  const x = useMotionValue(ix)
  const y = useMotionValue(iy)
  const [hovered,  setHovered]  = useState(false)
  const [dragging, setDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const dragDist = useRef(0)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY }
    dragDist.current = 0
    onActivate()
  }, [onActivate])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (pointerStart.current) {
      const dx = e.clientX - pointerStart.current.x
      const dy = e.clientY - pointerStart.current.y
      dragDist.current = Math.sqrt(dx * dx + dy * dy)
    }
    if (dragDist.current < 6 && cardRef.current) {
      onOpen(cardRef.current.getBoundingClientRect())
    }
  }, [onOpen])

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={containerRef}
      dragMomentum={true}
      dragElastic={0}
      dragTransition={{ bounceStiffness: 380, bounceDamping: 36, power: 0.12, timeConstant: 160 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onDragStart={() => { setDragging(true); onActivate() }}
      onDragEnd={() => setDragging(false)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{
        rotate: dragging ? ir * 0.2 : hovered ? 0 : ir,
        scale:  dragging ? 1.08 : hovered ? 1.04 : 1,
      }}
      transition={SPRING}
      style={{
        position:    "absolute",
        top:         0,
        left:        0,
        x, y,
        zIndex,
        cursor:      dragging ? "grabbing" : "grab",
        touchAction: "none",
        willChange:  "transform",
      }}
    >
      <div style={{
        backgroundColor: "#fefcf8",
        padding:         "8px 8px 32px",
        borderRadius:    3,
        boxShadow:       dragging || hovered
          ? "0 28px 64px rgba(0,0,0,0.28), 0 8px 20px rgba(0,0,0,0.13)"
          : "0 4px 16px rgba(0,0,0,0.11), 0 1px 4px rgba(0,0,0,0.06)",
        transition:      "box-shadow 0.22s ease",
        userSelect:      "none",
      }}>
        <div style={{
          overflow:  "hidden",
          borderRadius: 1,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
          lineHeight: 0,
          width:  156,
          height: 148,
          flexShrink: 0,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.label ?? ""}
            draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
          />
        </div>
        <p style={{
          margin:        0,
          padding:       "9px 4px 0",
          fontFamily:    "'Departure Mono', monospace",
          fontSize:      10,
          fontWeight:    400,
          color:         "rgba(0,0,0,0.38)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          textAlign:     "center",
          lineHeight:    1,
          minHeight:     12,
        }}>
          {photo.label ?? ""}
        </p>
      </div>
    </motion.div>
  )
}

interface LightboxState { photo: Photo; originRect: DOMRect }

const PREVIEW_PHOTOS = PHOTOS.filter(p => p.label).slice(0, 4)

export default function PhotoGallery() {
  const containerRef = useRef<HTMLDivElement>(null!)
  const [zStack, setZStack] = useState<number[]>(PHOTOS.map((_, i) => i + 1))
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  function bringToFront(i: number) {
    setZStack(prev => {
      const cur = prev[i]
      return prev.map((z, j) => j === i ? PHOTOS.length : z > cur ? z - 1 : z)
    })
  }

  function openLightbox(photo: Photo, rect: DOMRect) {
    setLightbox({ photo, originRect: rect })
  }

  function closeLightbox() {
    setLightbox(null)
  }

  // Compute genie origin as viewport-relative center of the source card
  const originX = lightbox ? lightbox.originRect.left + lightbox.originRect.width / 2 : 0
  const originY = lightbox ? lightbox.originRect.top  + lightbox.originRect.height / 2 : 0

  return (
    <>
      {/* ── Desktop: draggable polaroid scatter ── */}
      <div
        className="rsp-gallery-desktop"
        ref={containerRef}
        style={{
          position:        "relative",
          height:          480,
          borderRadius:    16,
          overflow:        "hidden",
          backgroundColor: "var(--surface)",
          backgroundImage: "radial-gradient(circle, var(--dot-color) 1px, transparent 1px)",
          backgroundSize:  "18px 18px",
        }}
      >
        {/* Centered scatter wrapper */}
        <div style={{
          position: "absolute",
          top:      0,
          left:     "50%",
          width:    SCATTER_W,
          height:   "100%",
          transform: `translateX(${-SCATTER_W / 2}px)`,
        }}>
          {PHOTOS.map((photo, i) => (
            <Card
              key={i}
              photo={photo}
              ix={LAYOUT[i % LAYOUT.length].x}
              iy={LAYOUT[i % LAYOUT.length].y}
              ir={LAYOUT[i % LAYOUT.length].r}
              zIndex={zStack[i]}
              onActivate={() => bringToFront(i)}
              onOpen={(rect) => openLightbox(photo, rect)}
              containerRef={containerRef}
            />
          ))}
        </div>
      </div>

      {/* ── Lightbox overlay ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeLightbox}
            style={{
              position:        "fixed",
              inset:           0,
              zIndex:          9999,
              backgroundColor: "rgba(0,0,0,0.72)",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              backdropFilter:  "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <motion.div
              key="card"
              initial={{
                scale:   0.15,
                opacity: 0,
                x: originX - window.innerWidth  / 2,
                y: originY - window.innerHeight / 2,
              }}
              animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              exit={{
                scale:   0.15,
                opacity: 0,
                x: originX - window.innerWidth  / 2,
                y: originY - window.innerHeight / 2,
              }}
              transition={GENIE}
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: "#fefcf8",
                padding:         "8px 8px 40px",
                borderRadius:    3,
                boxShadow:       "0 40px 120px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.2)",
                maxWidth:        "min(420px, 80vw)",
                width:           "auto",
                cursor:          "default",
              }}
            >
              <div style={{
                overflow:  "hidden",
                borderRadius: 1,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
                lineHeight: 0,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightbox.photo.src}
                  alt={lightbox.photo.label ?? ""}
                  draggable={false}
                  style={{ width: "100%", display: "block", objectFit: "contain", maxHeight: "45vh" }}
                />
              </div>
              <p style={{
                margin:        0,
                padding:       "14px 4px 0",
                fontFamily:    "'Departure Mono', monospace",
                fontSize:      11,
                fontWeight:    400,
                color:         "rgba(0,0,0,0.38)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                textAlign:     "center",
                lineHeight:    1,
                minHeight:     14,
              }}>
                {lightbox.photo.label ?? ""}
              </p>
            </motion.div>

            {/* Close hint */}
            <motion.button
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.18 }}
              onClick={closeLightbox}
              style={{
                position:        "fixed",
                top:             24,
                right:           28,
                background:      "rgba(255,255,255,0.12)",
                border:          "1px solid rgba(255,255,255,0.18)",
                borderRadius:    99,
                padding:         "6px 16px",
                fontFamily:      "var(--font-sans)",
                fontSize:        13,
                fontWeight:      500,
                color:           "rgba(255,255,255,0.8)",
                cursor:          "pointer",
                backdropFilter:  "blur(4px)",
              }}
            >
              Close
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile: simple 2×2 grid ── */}
      <div className="rsp-gallery-mobile" style={{ display: "none" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, borderRadius: 16, overflow: "hidden" }}>
          {PREVIEW_PHOTOS.map((photo, i) => (
            <div key={i} style={{ position: "relative", aspectRatio: "1", overflow: "hidden", backgroundColor: "var(--surface)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.label ?? ""}
                draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {photo.label && (
                <span style={{
                  position:      "absolute",
                  bottom:        8,
                  left:          10,
                  fontFamily:    "'Departure Mono', monospace",
                  fontSize:      8,
                  fontWeight:    400,
                  color:         "rgba(255,255,255,0.82)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  textShadow:    "0 1px 4px rgba(0,0,0,0.5)",
                }}>
                  {photo.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
