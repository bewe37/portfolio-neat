"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { playClick } from "@/lib/click-sound"

type ImageTag = "food" | "me" | "places"
interface GalleryImage { src: string; tag?: ImageTag }

const IMAGES: GalleryImage[] = [
  { src: "/parisSelfie.jpg",                                 tag: "me"     },
  { src: "/AnnaLena.jpg",                                    tag: "food"   },
  { src: "/IMG_3021.jpg",                                    tag: "places" },
  { src: "/Bonitos.jpg",                                     tag: "food"   },
  { src: "/nyc.jpg",                                         tag: "places" },
  { src: "/Dailo.jpg",                                       tag: "food"   },
  { src: "/IMG_1562.jpg",                                    tag: "places" },
  { src: "/Bubbys.jpg",                                      tag: "food"   },
  { src: "/banfff.jpg",                                      tag: "places" },
  { src: "/LaSalumeria.jpg",                                 tag: "food"   },
  { src: "/IMG_4678.jpg",                                    tag: "me"     },
  { src: "/Mhel.jpg",                                        tag: "food"   },
  { src: "/koreaphoto.jpg",                                  tag: "places" },
  { src: "/Mimi Chinese.jpg",                                tag: "food"   },
  { src: "/IMG_3449.jpg",                                    tag: "me"     },
  { src: "/Shakers Club.jpg",                                tag: "food"   },
  { src: "/austria.jpg",                                     tag: "places" },
  { src: "/Suite115.jpg",                                    tag: "food"   },
  { src: "/IMG_1776.jpg",                                    tag: "me"     },
  { src: "/FullSizeRender.jpg",                              tag: "me"     },
  { src: "/paris.jpg",                                       tag: "places" },
  { src: "/IMG_3861.jpg",                                    tag: "places" },
  { src: "/BC.jpg",                                          tag: "me"     },
  { src: "/IMG_1951.jpg",                                    tag: "me"     },
  { src: "/vanc.jpg",                                        tag: "places" },
  { src: "/IMG_2147.jpg",                                    tag: "food"   },
  { src: "/dawg.jpg",                                        tag: "me"     },
  { src: "/IMG_5169.jpg",                                    tag: "places" },
  { src: "/fred.jpg",                                        tag: "places" },
  { src: "/image3.jpg",                                      tag: "places" },
  { src: "/image4.jpg",                                      tag: "places" },
  { src: "/156.JPG",                                         tag: "food"   },
  { src: "/0FB14169-ED68-447E-8F6C-A9302E239FB8.JPG",        tag: "places" },
  { src: "/IMG_0815.jpg",                                    tag: "food"   },
  { src: "/IMG_4280.jpg",                                    tag: "places" },
  { src: "/IMG_5840.jpg",                                    tag: "places" },
  { src: "/IMG_9527.jpg",                                    tag: "places" },
  { src: "/IMG_1235.jpg",                                    tag: "places" },
  { src: "/venice.jpg",                                      tag: "me"     },
]

const CARD_H           = 180
const PORTRAIT_W_RATIO = 0.75
const COLS             = 7
const ROWS             = 5
const GAP_X            = 240
const GAP_Y            = 240

export const GALLERY_IMAGES = IMAGES

// Module-level image cache — shared across all GalleryCanvas instances
const cachedImgs: (HTMLImageElement | null)[] = IMAGES.map(() => null)
let cachedLoadCount = 0
if (typeof window !== "undefined") {
  IMAGES.forEach((item, i) => {
    if (cachedImgs[i]) return
    const img = new Image()
    img.onload = () => { cachedImgs[i] = img; cachedLoadCount++ }
    img.src = item.src
  })
}

const FILTERS: { label: string; value: ImageTag | "all" }[] = [
  { label: "All",    value: "all"    },
  { label: "Me",     value: "me"     },
  { label: "Food",   value: "food"   },
  { label: "Places", value: "places" },
]

interface GalleryCanvasProps {
  fullPage?: boolean
  showFilters?: boolean
  showClose?: boolean
}

export function GalleryCanvas({ fullPage = false, showFilters = false, showClose = false }: GalleryCanvasProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const offscreenRef = useRef<HTMLCanvasElement | null>(null)
  const [activeFilter, setActiveFilter] = useState<ImageTag | "all">("all")
  const filterRef        = useRef<ImageTag | "all">("all")
  const pendingFilterRef = useRef<ImageTag | "all">("all")
  const rebuildRef = useRef<(() => void) | null>(null)
  const alphaRef      = useRef(1)
  const fadeStateRef  = useRef<"idle" | "out" | "in">("idle")
  const mountedRef    = useRef(false)

  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return }
    pendingFilterRef.current = activeFilter
    if (fadeStateRef.current !== "idle") return
    fadeStateRef.current = "out"
  }, [activeFilter])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const offscreen = document.createElement("canvas")
    offscreenRef.current = offscreen
    const ctx2d = offscreen.getContext("2d")!

    const gl = canvas.getContext("webgl", { alpha: true }) as WebGLRenderingContext | null
    if (!gl) return

    const dpr = window.devicePixelRatio || 1

    // WebGL canvas stays at full window size — never resized (resizing resets WebGL context)
    canvas.width  = Math.round(window.innerWidth  * dpr)
    canvas.height = Math.round(window.innerHeight * dpr)
    gl.viewport(0, 0, canvas.width, canvas.height)

    // W/H track the actual CSS rendered size for grid layout — updated without touching canvas
    const initRect = canvas.getBoundingClientRect()
    let W = initRect.width  > 0 ? initRect.width  : window.innerWidth
    let H = initRect.height > 0 ? initRect.height : window.innerHeight
    offscreen.width  = Math.round(W * dpr)
    offscreen.height = Math.round(H * dpr)
    let texW = offscreen.width, texH = offscreen.height

    function syncSize() {
      const rect = canvas!.getBoundingClientRect()
      if (rect.width  > 0) W = rect.width
      if (rect.height > 0) H = rect.height
      const newW = Math.round(W * dpr), newH = Math.round(H * dpr)
      offscreen.width  = newW
      offscreen.height = newH
      gl!.viewport(0, 0, canvas!.width, canvas!.height)
      // Reallocate texture if offscreen size changed
      if (newW !== texW || newH !== texH) {
        gl!.bindTexture(gl!.TEXTURE_2D, tex)
        gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, newW, newH, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null)
        texW = newW; texH = newH
      }
    }
    const ro = new ResizeObserver(syncSize)
    ro.observe(canvas)

    // WebGL shaders
    const vsSource = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0, 1);
      }
    `
    const fsSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform sampler2D u_tex;
      uniform float u_barrel;
      uniform float u_vignette;
      uniform float u_overscan;
      vec2 barrelDistort(vec2 uv, float k) {
        vec2 cc = uv - 0.5;
        return uv + cc * dot(cc, cc) * k;
      }
      void main() {
        vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
        // Scale UV inward so barrel-distorted edges never exceed 0-1
        vec2 scaled = (uv - 0.5) * u_overscan + 0.5;
        vec2 d = barrelDistort(scaled, u_barrel);
        // Clamp instead of discard — fills edge pixels with nearest color
        d = clamp(d, 0.001, 0.999);
        vec4 color = texture2D(u_tex, d);
        vec2 vc = uv - 0.5;
        float v = 1.0 - smoothstep(0.15, 0.75, dot(vc, vc) * u_vignette);
        gl_FragColor = vec4(color.rgb * v, color.a);
      }
    `

    function compileShader(type: number, src: string) {
      const s = gl!.createShader(type)!
      gl!.shaderSource(s, src); gl!.compileShader(s); return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vsSource))
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSource))
    gl.linkProgram(prog); gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, "a_pos")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTex      = gl.getUniformLocation(prog, "u_tex")
    const uBarrel   = gl.getUniformLocation(prog, "u_barrel")
    const uVignette = gl.getUniformLocation(prog, "u_vignette")
    const uOverscan = gl.getUniformLocation(prog, "u_overscan")

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    // Allocate texture storage once at the offscreen canvas size — updated in-place each frame via texSubImage2D
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, offscreen.width, offscreen.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    texW = offscreen.width; texH = offscreen.height

    // Use module-level cache so images shared across instances don't reload
    const imgs = cachedImgs
    let loadedCount = cachedLoadCount
    IMAGES.forEach((item, i) => {
      if (imgs[i]) return
      const img = new Image()
      img.onload = () => { imgs[i] = img; loadedCount++; cachedLoadCount++; idle = false }
      img.src = item.src
    })

    interface Card { imgIdx: number; x: number; y: number }
    let cards: Card[] = []
    const TILE_W = COLS * GAP_X
    const TILE_H = ROWS * GAP_Y

    function buildCards() {
      const f = filterRef.current
      const filtered = IMAGES.map((img, i) => ({ img, i })).filter(({ img }) => f === "all" || img.tag === f)
      cards = []
      let idx = 0
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const item = filtered[idx % filtered.length]
          cards.push({ imgIdx: item.i, x: col * GAP_X, y: row * GAP_Y })
          idx++
        }
      }
    }
    buildCards()
    rebuildRef.current = buildCards

    function getCardW(imgIdx: number) {
      const img = imgs[imgIdx]
      if (!img || !img.naturalWidth) return Math.round(CARD_H * PORTRAIT_W_RATIO)
      const ar = img.naturalWidth / img.naturalHeight
      return ar < 1 ? Math.round(CARD_H * PORTRAIT_W_RATIO) : Math.round(CARD_H * ar)
    }

    function roundRect(x: number, y: number, w: number, h: number, r: number) {
      ctx2d.beginPath()
      ctx2d.moveTo(x+r,y); ctx2d.lineTo(x+w-r,y); ctx2d.arcTo(x+w,y,x+w,y+r,r)
      ctx2d.lineTo(x+w,y+h-r); ctx2d.arcTo(x+w,y+h,x+w-r,y+h,r)
      ctx2d.lineTo(x+r,y+h); ctx2d.arcTo(x,y+h,x,y+h-r,r)
      ctx2d.lineTo(x,y+r); ctx2d.arcTo(x,y,x+r,y,r)
      ctx2d.closePath()
    }

    function drawCard(card: Card, wx: number, wy: number) {
      const img = imgs[card.imgIdx]; if (!img) return
      const cw = getCardW(card.imgIdx)
      const x = wx - cw/2, y = wy - CARD_H/2
      ctx2d.save()
      ctx2d.shadowColor = "rgba(0,0,0,0.35)"; ctx2d.shadowBlur = 14; ctx2d.shadowOffsetY = 4
      ctx2d.save(); roundRect(x,y,cw,CARD_H,6); ctx2d.clip()
      ctx2d.shadowColor = "transparent"
      const ar = img.naturalWidth/img.naturalHeight, cardAr = cw/CARD_H
      let sw=cw,sh=CARD_H,sx=x,sy=y
      if (ar>cardAr) { sw=CARD_H*ar; sx=x-(sw-cw)/2 } else { sh=cw/ar; sy=y-(sh-CARD_H)/2 }
      ctx2d.drawImage(img,sx,sy,sw,sh)
      ctx2d.restore(); ctx2d.restore()
    }

    let ox = 0, oy = 0
    let vx=0, vy=0, dragging=false, lastX=0, lastY=0, raf=0, visible=true, idle=false
    let dotGridDrawn = false // dot grid is static — only draw once

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(loop)
    }, { threshold: 0 })
    io.observe(canvas)

    const onVis = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0 }
      else if (!raf) raf = requestAnimationFrame(loop)
    }
    document.addEventListener("visibilitychange", onVis)

    function loop() {
      if (!visible || document.hidden) { raf = 0; return }
      if (!gl) return
      raf = requestAnimationFrame(loop)
      if (!dragging) { ox+=vx; oy+=vy; vx*=0.93; vy*=0.93 }
      ox = ((ox%TILE_W)+TILE_W)%TILE_W
      oy = ((oy%TILE_H)+TILE_H)%TILE_H

      // Drive filter fade inside the RAF loop — no setInterval needed
      const fs = fadeStateRef.current
      if (fs === "out") {
        alphaRef.current = Math.max(0, alphaRef.current - 0.08)
        if (alphaRef.current <= 0) {
          filterRef.current = pendingFilterRef.current
          rebuildRef.current?.()
          fadeStateRef.current = "in"
        }
        idle = false
      } else if (fs === "in") {
        alphaRef.current = Math.min(1, alphaRef.current + 0.06)
        if (alphaRef.current >= 1) fadeStateRef.current = "idle"
        idle = false
      }

      const isIdle = !dragging && Math.abs(vx)<0.05 && Math.abs(vy)<0.05 && alphaRef.current>=1
      if (isIdle && idle) return
      idle = isIdle

      // Background — only redraw when offscreen size changes
      if (!dotGridDrawn) {
        ctx2d.fillStyle = "rgba(22,22,22,1)"
        ctx2d.fillRect(0, 0, offscreen.width, offscreen.height)
        const dotSpacing = 18*dpr
        ctx2d.fillStyle = "rgba(255,255,255,0.06)"
        for (let gx=0; gx<offscreen.width; gx+=dotSpacing) {
          for (let gy=0; gy<offscreen.height; gy+=dotSpacing) {
            ctx2d.beginPath(); ctx2d.arc(gx,gy,0.8*dpr,0,Math.PI*2); ctx2d.fill()
          }
        }
        dotGridDrawn = true
      } else {
        // Just clear cards area without redrawing dots
        ctx2d.fillStyle = "rgba(22,22,22,1)"
        ctx2d.fillRect(0, 0, offscreen.width, offscreen.height)
      }
      ctx2d.save(); ctx2d.scale(dpr,dpr)
      ctx2d.globalAlpha = alphaRef.current
      for (let tx=-1; tx<=Math.ceil(W/TILE_W)+1; tx++) {
        for (let ty=-1; ty<=Math.ceil(H/TILE_H)+1; ty++) {
          for (const card of cards) {
            const sx=card.x+ox-TILE_W+tx*TILE_W, sy=card.y+oy-TILE_H+ty*TILE_H
            const cw=getCardW(card.imgIdx)
            if (sx+cw<-GAP_X||sx>W+GAP_X||sy+CARD_H<-GAP_Y||sy>H+GAP_Y) continue
            drawCard(card, sx+cw/2, sy+CARD_H/2)
          }
        }
      }
      ctx2d.globalAlpha = 1; ctx2d.restore()

      // Don't render until at least a few images are loaded — prevents black flash
      if (loadedCount === 0) return

      // Upload to WebGL and apply barrel distortion
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, offscreen)
      gl.uniform1i(uTex, 0)
      gl.uniform1f(uBarrel, fullPage ? 0.18 : 0.08)
      gl.uniform1f(uVignette, 1.8)
      gl.uniform1f(uOverscan, 0.88)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    raf = requestAnimationFrame(loop)

    function onMouseDown(e: MouseEvent) { dragging=true; lastX=e.clientX; lastY=e.clientY; canvas!.style.cursor="grabbing" }
    function onMouseMove(e: MouseEvent) {
      if (!dragging) return
      const dx=e.clientX-lastX, dy=e.clientY-lastY
      ox+=dx; oy+=dy; vx=dx; vy=dy; lastX=e.clientX; lastY=e.clientY
    }
    function onMouseUp() { dragging=false; canvas!.style.cursor="grab" }
    function onTouchStart(e: TouchEvent) { dragging=true; lastX=e.touches[0].clientX; lastY=e.touches[0].clientY }
    function onTouchMove(e: TouchEvent) {
      if (!dragging) return
      const dx=e.touches[0].clientX-lastX, dy=e.touches[0].clientY-lastY
      ox+=dx; oy+=dy; vx=dx; vy=dy; lastX=e.touches[0].clientX; lastY=e.touches[0].clientY
    }
    function onTouchEnd() { dragging=false }

    canvas.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    canvas.addEventListener("touchstart", onTouchStart, { passive: true })
    canvas.addEventListener("touchmove",  onTouchMove,  { passive: true })
    canvas.addEventListener("touchend",   onTouchEnd)

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      canvas.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      canvas.removeEventListener("touchstart", onTouchStart)
      canvas.removeEventListener("touchmove",  onTouchMove)
      canvas.removeEventListener("touchend",   onTouchEnd)
    }
  }, [])

  const btnStyle: React.CSSProperties = {
    position: "absolute", top: 16, right: 16, zIndex: 10,
    background: "rgba(255,255,255,0.92)", border: "none",
    borderRadius: "50%", width: 32, height: 32, cursor: "pointer",
    backdropFilter: "blur(8px)", color: "#111",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  }

  return (
    <div style={{ position: "relative", borderRadius: fullPage ? 0 : 8, overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: fullPage ? "100dvh" : 600,
          display: "block", cursor: "grab",
        }}
      />

      {showFilters && (
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          zIndex: 10, display: "flex", gap: 4,
          background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
          borderRadius: 999, padding: "4px", border: "1px solid rgba(255,255,255,0.1)",
        }}>
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => { playClick(); setActiveFilter(f.value) }} style={{
              fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500,
              letterSpacing: "-0.01em", textTransform: "none",
              padding: "6px 16px", borderRadius: 999, border: "none",
              cursor: "pointer", position: "relative", background: "transparent",
              color: activeFilter === f.value ? "#111" : "rgba(255,255,255,0.5)",
              transition: "color 0.2s ease", zIndex: 1,
            }}>
              {activeFilter === f.value && (
                <motion.div layoutId="filter-pill" style={{
                  position: "absolute", inset: 0, borderRadius: 999,
                  background: "rgba(255,255,255,0.9)", zIndex: -1,
                }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              {f.label}
            </button>
          ))}
        </div>
      )}

      {showClose ? (
        <Link href="/about" onClick={() => playClick()} style={{ ...btnStyle, textDecoration: "none" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </Link>
      ) : (
        <Link href="/gallery" onClick={() => playClick()} style={{ ...btnStyle, textDecoration: "none" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M1 6V1h5M10 1h5v5M15 10v5h-5M6 15H1v-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      )}
    </div>
  )
}

export default function InfiniteGallery({ fullPage = false }: { fullPage?: boolean }) {
  return <GalleryCanvas fullPage={fullPage} showFilters={fullPage} showClose={fullPage} />
}
