"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import TamagotchiWidget from "@/components/TamagotchiWidget"
import { getBuddy } from "@/lib/buddies"
import { SpriteView } from "@/components/SpriteBuddy"

function torontoTime() {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: "America/Toronto",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function WeatherIcon({ code }: { code: number }) {
  if (code === 0) return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
      <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
    </svg>
  )
  if (code <= 2) return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M17 12a5 5 0 0 0-9.9-1A4 4 0 1 0 9 19h8a4 4 0 0 0 0-8z"/>
    </svg>
  )
  if (code <= 82) return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
      <line x1="8" y1="19" x2="8" y2="21"/><line x1="12" y1="19" x2="12" y2="21"/><line x1="16" y1="19" x2="16" y2="21"/>
    </svg>
  )
  if (code <= 77) return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
      <line x1="8" y1="19" x2="8" y2="23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="16" y1="19" x2="16" y2="23"/>
    </svg>
  )
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>
  )
}

function FooterClock() {
  const [time, setTime] = useState(torontoTime())
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null)

  useEffect(() => {
    const tick = setInterval(() => setTime(torontoTime()), 1000)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=43.6532&longitude=-79.3832&current=temperature_2m,weathercode&timezone=America%2FToronto")
      .then(r => r.json())
      .then(d => setWeather({ temp: Math.round(d.current.temperature_2m), code: d.current.weathercode }))
      .catch(() => {})
  }, [])

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400,
      color: "rgba(255,255,255,0.75)", letterSpacing: "-0.01em",
    }}>
      {weather && <WeatherIcon code={weather.code} />}
      {time}, Toronto
      {weather && <span style={{ color: "rgba(255,255,255,0.55)" }}>· {weather.temp}°C</span>}
    </span>
  )
}

function FooterLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500,
        letterSpacing: "-0.01em", textDecoration: "none",
        color: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.72)",
        transition: "color 0.15s ease",
      }}
    >
      {label}
    </a>
  )
}

function FooterCompanion() {
  const [buddyId, setBuddyId] = useState<string | null>(null)

  useEffect(() => {
    setBuddyId(localStorage.getItem("buddyId"))
    const sync = () => setBuddyId(localStorage.getItem("buddyId"))
    window.addEventListener("buddySelected", sync)
    return () => window.removeEventListener("buddySelected", sync)
  }, [])

  if (!buddyId || buddyId === "none" || buddyId === "custom") return null
  const buddy = getBuddy(buddyId)
  if (!buddy) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ lineHeight: 0, flexShrink: 0, alignSelf: "flex-start" }}
    >
      <SpriteView buddy={buddy} animKey={buddy.idleAnim} scale={2.5} />
    </motion.div>
  )
}

function BackToTop() {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      animate={{ y: hovered ? -2 : 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "none", border: "none", cursor: "pointer", padding: 0,
        display: "inline-flex", alignItems: "center", gap: 5,
        color: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.72)",
        fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500,
        letterSpacing: "-0.01em", transition: "color 0.15s ease",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6"
          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back to top
    </motion.button>
  )
}

export default function MarqueeFooter() {
  const year = new Date().getFullYear()

  return (
    <div style={{ position: "relative", minHeight: 260, overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Scene.jpg" alt="" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center", pointerEvents: "none",
      }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)" }} />

      <div className="rsp-footer-inner" style={{
        position: "relative", zIndex: 1,
        minHeight: 260, margin: "0 auto",
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "40px 48px", gap: 0,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(18px, 3vw, 28px)",
            fontWeight: 500, color: "#fff",
            letterSpacing: "-0.03em", lineHeight: 1.25,
            margin: 0, maxWidth: 560, opacity: 0.92,
          }}>
            Sleep is a design constraint. Available for hire if you catch me awake.
          </p>
          <div style={{ flexShrink: 0, width: 186 * 0.7 + 40, height: 214 * 0.7, overflow: "visible" }}>
            <div style={{ transform: "scale(0.7)", transformOrigin: "top left" }}>
              <TamagotchiWidget />
            </div>
          </div>
        </div>

        <div className="rsp-footer-bottom" style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", gap: 24,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FooterCompanion />
            <FooterClock />
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400,
              color: "rgba(255,255,255,0.55)", letterSpacing: "-0.01em",
            }}>
              © {year} Georgius. All rights reserved.
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
            {[
              { label: "Email",    href: "mailto:bryanwinata112@gmail.com" },
              { label: "LinkedIn", href: "https://linkedin.com/in/gbryanw" },
              { label: "Twitter",  href: "https://x.com/gbryanwt" },
            ].map(l => <FooterLink key={l.href} {...l} />)}
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
            <BackToTop />
          </div>
        </div>
      </div>
    </div>
  )
}
