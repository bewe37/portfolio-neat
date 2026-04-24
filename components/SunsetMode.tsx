"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { SunHorizon } from "@phosphor-icons/react"

const W = 640
const H = 360

export default function SunsetMode() {
  const [active, setActive] = useState(false)
  const videoRef            = useRef<HTMLVideoElement>(null)
  const canvasRef           = useRef<HTMLCanvasElement>(null)
  const rafRef              = useRef<number>()

  useEffect(() => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    if (!active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      video.pause()
      return
    }

    canvas.width  = W
    canvas.height = H

    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return

    function draw() {
      if (!video || !ctx) return

      ctx.drawImage(video, 0, 0, W, H)
      const img = ctx.getImageData(0, 0, W, H)
      const d   = img.data

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2]
        // Only knock out pixels where green is clearly dominant over BOTH r and b
        // Preserves dark shadows (r≈g≈b) and only removes saturated green
        if (g > r + 25 && g > b + 25 && g > 60) {
          d[i + 3] = 0
        }
      }

      ctx.putImageData(img, 0, 0)
      rafRef.current = requestAnimationFrame(draw)
    }

    function startPlay() {
      video.play().then(() => {
        rafRef.current = requestAnimationFrame(draw)
      }).catch(console.error)
    }

    if (video.readyState >= 3) {
      startPlay()
    } else {
      video.addEventListener("canplay", startPlay, { once: true })
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      video.removeEventListener("canplay", startPlay)
    }
  }, [active])

  return (
    <>
      <video
        ref={videoRef}
        src="/shadow_green.mp4"
        muted
        loop
        playsInline
        preload="auto"
        style={{ display: "none" }}
      />

      <motion.canvas
        ref={canvasRef}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          width:         "100vw",
          height:        "100vh",
          zIndex:        150,
          pointerEvents: "none",
          mixBlendMode:  "multiply",
        }}
      />

      <button
        onClick={() => setActive(v => !v)}
        aria-label="Toggle shadow mode"
        style={{
          position:        "fixed",
          bottom:          28,
          right:           28,
          zIndex:          200,
          width:           34,
          height:          34,
          borderRadius:    "50%",
          backgroundColor: active ? "rgba(255,100,30,0.15)" : "rgba(0,0,0,0.06)",
          border:          active ? "1px solid rgba(255,100,30,0.3)" : "1px solid rgba(0,0,0,0.09)",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          cursor:          "pointer",
          backdropFilter:  "blur(8px)",
          transition:      "background-color 0.2s ease, border-color 0.2s ease",
        }}
      >
        <SunHorizon
          size={14}
          weight="regular"
          color={active ? "rgba(255,100,30,0.8)" : "rgba(0,0,0,0.55)"}
        />
      </button>
    </>
  )
}
