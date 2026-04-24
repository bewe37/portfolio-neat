"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue } from "framer-motion"

interface Photo { src: string; label?: string }

const PHOTOS: Photo[] = [
  { src: "/nyc.jpg",     label: "New York"  },
  { src: "/austria.jpg", label: "Austria"   },
  { src: "/korea.jpg",   label: "Korea"     },
  { src: "/paris.jpg",   label: "Paris"     },
  { src: "/vanc.jpg",    label: "Vancouver" },
  { src: "/sqwam.png",   label: "Squamish"  },
  { src: "/dawg.jpg"                         },
  { src: "/fred.jpg"                         },
  { src: "/image3.jpg"                       },
  { src: "/image4.jpg"                       },
]

// pre-set scatter so the table looks intentional, not random
// x capped at ~590 so all cards are visible at ~750px container width
const LAYOUT = [
  { x: 240, y:  40, r: -5.5 },
  { x: 374, y:  96, r:  3.2 },
  { x: 514, y:  34, r: -2.8 },
  { x: 648, y:  82, r:  5.5 },
  { x: 782, y:  32, r: -4.2 },
  { x: 304, y: 230, r:  4.5 },
  { x: 436, y: 224, r: -6.0 },
  { x: 574, y: 212, r:  2.8 },
  { x: 706, y: 222, r: -3.5 },
  { x: 824, y: 208, r:  4.8 },
]

const SPRING = { type: "spring" as const, stiffness: 280, damping: 22 }

function Card({
  photo, ix, iy, ir, zIndex, onActivate, containerRef,
}: {
  photo: Photo
  ix: number; iy: number; ir: number
  zIndex: number
  onActivate: () => void
  containerRef: React.RefObject<HTMLDivElement>
}) {
  const x = useMotionValue(ix)
  const y = useMotionValue(iy)
  const [hovered,  setHovered]  = useState(false)
  const [dragging, setDragging] = useState(false)

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragMomentum={true}
      dragElastic={0}
      dragTransition={{ bounceStiffness: 380, bounceDamping: 36, power: 0.12, timeConstant: 160 }}
      onPointerDown={onActivate}
      onDragStart={() => { setDragging(true); onActivate() }}
      onDragEnd={() => setDragging(false)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{
        rotate: dragging ? ir * 0.25 : hovered ? 0 : ir,
        scale:  dragging ? 1.09 : hovered ? 1.05 : 1,
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
        backgroundColor: "#ffffff",
        padding:         "7px 7px 30px",
        borderRadius:    3,
        boxShadow:       dragging || hovered
          ? "0 22px 52px rgba(0,0,0,0.24), 0 4px 14px rgba(0,0,0,0.10)"
          : "0 4px 18px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.06)",
        transition:  "box-shadow 0.2s ease",
        userSelect:  "none",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.label ?? ""}
          draggable={false}
          style={{ width: 122, height: 132, objectFit: "cover", display: "block", pointerEvents: "none" }}
        />
        <p style={{
          margin:        "10px 0 0",
          fontFamily:    "var(--font-sans)",
          fontSize:      9,
          fontWeight:    600,
          color:         "rgba(0,0,0,0.28)",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          textAlign:     "center",
          minHeight:     12,
        }}>
          {photo.label ?? ""}
        </p>
      </div>
    </motion.div>
  )
}

const PREVIEW_PHOTOS = PHOTOS.filter(p => p.label).slice(0, 4)

export default function PhotoGallery() {
  const containerRef = useRef<HTMLDivElement>(null!)
  const [zStack, setZStack] = useState<number[]>(PHOTOS.map((_, i) => i + 1))

  function bringToFront(i: number) {
    setZStack(prev => {
      const cur = prev[i]
      return prev.map((z, j) => j === i ? PHOTOS.length : z > cur ? z - 1 : z)
    })
  }

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
        <p style={{
          position: "absolute", bottom: 14, right: 18, zIndex: 0,
          fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 500,
          color: "var(--c-faint)", letterSpacing: "0.06em", textTransform: "lowercase",
          margin: 0, pointerEvents: "none",
        }}>
          drag to play
        </p>

        {PHOTOS.map((photo, i) => (
          <Card
            key={i}
            photo={photo}
            ix={LAYOUT[i % LAYOUT.length].x}
            iy={LAYOUT[i % LAYOUT.length].y}
            ir={LAYOUT[i % LAYOUT.length].r}
            zIndex={zStack[i]}
            onActivate={() => bringToFront(i)}
            containerRef={containerRef}
          />
        ))}
      </div>

      {/* ── Mobile: simple 2×2 grid + View all ── */}
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
                  position: "absolute", bottom: 8, left: 10,
                  fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 600,
                  color: "rgba(255,255,255,0.8)", letterSpacing: "0.07em",
                  textTransform: "uppercase", textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                }}>
                  {photo.label}
                </span>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
          <a href="/gallery" style={{
            fontFamily:      "var(--font-sans)",
            fontSize:        13,
            fontWeight:      600,
            color:           "var(--c-mid)",
            letterSpacing:   "-0.01em",
            textDecoration:  "none",
            padding:         "9px 24px",
            borderRadius:    99,
            border:          "1px solid var(--border-mid)",
            backgroundColor: "var(--hover-bg)",
          }}>
            View all
          </a>
        </div>
      </div>
    </>
  )
}
