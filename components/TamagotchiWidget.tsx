"use client"

import { useState, useEffect } from "react"

type Screen = "idle" | "mood" | "location" | "availability"

const LCD = "#c8d8ac"
const PX  = "#2a3d1f"
const EYE = "#b0c494"

function CharNormal({ speed = 2.2 }: { speed?: number }) {
  return (
    <svg viewBox="0 0 22 24" style={{ width: 46, height: 46, animation: `tama-bounce ${speed}s ease-in-out infinite` }} fill={PX} shapeRendering="crispEdges">
      <rect x="7"  y="1"  width="8"  height="2" /><rect x="5"  y="3"  width="12" height="2" />
      <rect x="3"  y="5"  width="16" height="2" /><rect x="2"  y="7"  width="18" height="8" />
      <rect x="3"  y="15" width="16" height="2" /><rect x="5"  y="17" width="12" height="2" />
      <rect x="7"  y="19" width="8"  height="2" />
      <rect x="5"  y="8"  width="4"  height="4" fill={EYE} /><rect x="13" y="8"  width="4" height="4" fill={EYE} />
      <rect x="6"  y="9"  width="2"  height="2" fill={PX}  /><rect x="14" y="9"  width="2" height="2" fill={PX}  />
      <rect x="9"  y="13" width="4"  height="1" fill={EYE} />
      <rect x="6"  y="21" width="3"  height="2" /><rect x="13" y="21" width="3" height="2" />
    </svg>
  )
}

function CharExcited() {
  return (
    <svg viewBox="0 0 22 24" style={{ width: 46, height: 46, animation: "tama-bounce 0.55s ease-in-out infinite" }} fill={PX} shapeRendering="crispEdges">
      <rect x="7"  y="1"  width="8"  height="2" /><rect x="5"  y="3"  width="12" height="2" />
      <rect x="3"  y="5"  width="16" height="2" /><rect x="2"  y="7"  width="18" height="8" />
      <rect x="3"  y="15" width="16" height="2" /><rect x="5"  y="17" width="12" height="2" />
      <rect x="7"  y="19" width="8"  height="2" />
      <rect x="5"  y="8"  width="2"  height="2" fill={PX} /><rect x="8"  y="9"  width="1" height="1" fill={PX} />
      <rect x="6"  y="10" width="2"  height="2" fill={PX} />
      <rect x="13" y="8"  width="2"  height="2" fill={PX} /><rect x="16" y="9"  width="1" height="1" fill={PX} />
      <rect x="14" y="10" width="2"  height="2" fill={PX} />
      <rect x="8"  y="13" width="6"  height="2" fill={PX} />
      <rect x="6"  y="21" width="3"  height="2" /><rect x="13" y="21" width="3" height="2" />
    </svg>
  )
}

function PixelHeart() {
  return (
    <svg viewBox="0 0 11 11" style={{ position: "absolute", top: 0, right: 0, width: 13, height: 11 }} fill={PX} shapeRendering="crispEdges">
      <rect x="1" y="1" width="3" height="1" /><rect x="7" y="1" width="3" height="1" />
      <rect x="0" y="2" width="5" height="3" /><rect x="6" y="2" width="5" height="3" />
      <rect x="1" y="5" width="9" height="2" /><rect x="2" y="7" width="7" height="2" />
      <rect x="3" y="9" width="5" height="1" /><rect x="4" y="10" width="3" height="1" />
    </svg>
  )
}

function CityScene() {
  return (
    <div style={{ width: "50%", position: "relative", display: "flex", alignItems: "flex-end" }}>
      <span style={{ position: "absolute", top: 0, left: 0, fontSize: 7, opacity: 0.55 }}>YZ</span>
      <svg viewBox="0 0 32 30" style={{ width: "100%", height: 56 }} fill={PX} shapeRendering="crispEdges">
        <rect x="10" y="0"  width="1" height="6"  /><rect x="9"  y="6"  width="3" height="2" />
        <rect x="10" y="8"  width="1" height="3"  /><rect x="8"  y="11" width="5" height="3" />
        <rect x="10" y="14" width="1" height="8"  /><rect x="8"  y="22" width="5" height="6" />
        <rect x="7"  y="20" width="7" height="2"  /><rect x="16" y="13" width="5" height="15" />
        <rect x="22" y="17" width="5" height="11" /><rect x="0"  y="20" width="6" height="8" />
        <rect x="0"  y="28" width="32" height="2" />
      </svg>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8 }}>
      <span style={{ opacity: 0.5 }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  )
}

export default function TamagotchiWidget() {
  const [time,    setTime]    = useState("")
  const [screen,  setScreen]  = useState<Screen>("idle")
  const [btnDown, setBtnDown] = useState<string | null>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      let h = now.getHours()
      const m = now.getMinutes()
      const ampm = h >= 12 ? "PM" : "AM"
      h = h % 12 || 12
      setTime(`${h}:${m.toString().padStart(2, "0")} ${ampm}`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const toggle = (s: Screen) => setScreen(prev => prev === s ? "idle" : s)

  function btnStyle(name: string): React.CSSProperties {
    const active  = screen === (name === "a" ? "mood" : name === "b" ? "location" : "availability")
    const pressed = btnDown === name
    const down    = pressed || active
    return {
      width: 36, height: 36, borderRadius: "50%",
      cursor: "pointer", outline: "none", border: "none",
      background: down
        ? "radial-gradient(circle at 45% 42%, #b8a860, #968644)"
        : "radial-gradient(circle at 33% 27%, #f0e8a8 0%, #d4c060 50%, #b09a3a 100%)",
      boxShadow: down
        ? "inset 0 3px 7px rgba(0,0,0,0.45)"
        : "0 4px 0 #7a6a20, 0 5px 12px rgba(0,0,0,0.28), inset 0 1px 3px rgba(255,248,200,0.45)",
      transform: down ? "translateY(4px)" : "translateY(0)",
      transition: "transform 0.07s ease, box-shadow 0.07s ease, background 0.07s ease",
    }
  }

  return (
    <div style={{ position: "relative", width: 266, height: 306 }}>

      {/* Hanger loop */}
      <div style={{
        position: "absolute", top: -20, left: "50%",
        transform: "translateX(-50%)",
        width: 28, height: 22,
        borderRadius: "14px 14px 0 0",
        border: "4px solid #b4b4be",
        borderBottom: "none",
        background: "transparent",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.18), -1px 0 2px rgba(0,0,0,0.12), 1px 0 2px rgba(255,255,255,0.3)",
        zIndex: 15,
      }} />

      {/* Egg body */}
      <div style={{
        position: "relative", width: "100%", height: "100%", zIndex: 10,
        borderRadius: "50% 50% 46% 54% / 56% 56% 44% 44%",
        background: "linear-gradient(158deg, #d8d8de 0%, #acacb6 44%, #c4c4cc 100%)",
        boxShadow: [
          "0 18px 46px rgba(0,0,0,0.20)",
          "0 5px 14px rgba(0,0,0,0.16)",
          "inset 14px 14px 28px rgba(255,255,255,0.48)",
          "inset -8px -14px 26px rgba(0,0,0,0.20)",
        ].join(", "),
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", paddingBottom: 16,
        overflow: "hidden",
      }}>

        {/* Gloss specular */}
        <div style={{
          position: "absolute", top: "5%", left: "9%",
          width: "50%", height: "36%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 40% 38%, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0) 66%)",
          transform: "rotate(-14deg)",
          pointerEvents: "none",
        }} />

        {/* Screen bezel — 152px keeps it safely inside the egg curves */}
        <div style={{
          position: "relative", zIndex: 1,
          width: 152, marginTop: 8,
          background: "linear-gradient(150deg, #2e2a30, #1a161a)",
          borderRadius: 11,
          padding: 5,
          boxShadow: [
            "inset 0 3px 8px rgba(0,0,0,0.92)",
            "inset 0 -1px 2px rgba(255,255,255,0.04)",
            "0 3px 9px rgba(0,0,0,0.44)",
          ].join(", "),
        }}>
          {/* Chrome inner ring */}
          <div style={{
            borderRadius: 7, overflow: "hidden",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07), inset 0 2px 4px rgba(0,0,0,0.65)",
          }}>
            <div className="tama-lcd-grid" style={{
              background: LCD, borderRadius: 6,
              fontFamily: "'DotGothic16', monospace", color: PX,
              overflow: "hidden",
            }}>

              {/* IDLE */}
              {screen === "idle" && (
                <div style={{ display: "flex", height: 96, padding: "4px 7px 2px" }}>
                  <CityScene />
                  <div style={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end", position: "relative" }}>
                    <PixelHeart />
                    <CharNormal />
                  </div>
                </div>
              )}

              {/* MOOD (A) */}
              {screen === "mood" && (
                <div style={{ display: "flex", height: 96, padding: "6px 7px 2px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "56%" }}>
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", opacity: 0.55 }}>MOOD //</span>
                    <div style={{ height: 1, background: `${PX}28` }} />
                    <Row label="state"  value="focused"  />
                    <Row label="energy" value="high"     />
                    <Row label="vibe"   value="creative" />
                    <div style={{ height: 1, background: `${PX}28` }} />
                    <span style={{ fontSize: 6, opacity: 0.38 }}>press A again to close</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
                    <CharNormal />
                  </div>
                </div>
              )}

              {/* LOCATION (B) */}
              {screen === "location" && (
                <div style={{ display: "flex", height: 96, padding: "4px 7px 2px" }}>
                  <CityScene />
                  <div style={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end", paddingBottom: 3, gap: 3 }}>
                    <span style={{ fontSize: 9, fontWeight: 700 }}>Toronto</span>
                    <span style={{ fontSize: 7, opacity: 0.6 }}>Ontario, CA</span>
                    <span style={{ fontSize: 7, opacity: 0.45 }}>YYZ · GMT-5</span>
                    <span style={{ fontSize: 6, opacity: 0.35, marginTop: 3 }}>press B to close</span>
                  </div>
                </div>
              )}

              {/* AVAILABILITY (C) */}
              {screen === "availability" && (
                <div style={{ display: "flex", height: 96, padding: "6px 7px 2px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "58%" }}>
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", opacity: 0.55 }}>AVAIL //</span>
                    <div style={{ height: 1, background: `${PX}28` }} />
                    <Row label="status" value="open >"   />
                    <Row label="type"   value="FT"       />
                    <Row label="start"  value="ASAP"     />
                    <div style={{ height: 1, background: `${PX}28` }} />
                    <span style={{ fontSize: 6, opacity: 0.38 }}>press C again to close</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
                    <CharExcited />
                  </div>
                </div>
              )}

              {/* Clock */}
              <div style={{
                borderTop: `1px solid rgba(42,61,31,0.16)`,
                display: "flex", justifyContent: "center", alignItems: "center",
                padding: "3px 7px", background: "rgba(0,0,0,0.04)",
                fontSize: 9, letterSpacing: "0.07em",
              }}>
                {time}
              </div>
            </div>
          </div>
        </div>

        {/* 3 buttons — middle sits lower */}
        <div style={{
          position: "relative", zIndex: 1,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          width: 138, marginTop: 16,
        }}>
          <button
            style={btnStyle("a")}
            onClick={() => toggle("mood")}
            onMouseDown={() => setBtnDown("a")}
            onMouseUp={() => setBtnDown(null)}
            onMouseLeave={() => setBtnDown(null)}
          />
          <button
            style={{ ...btnStyle("b"), marginTop: 12 }}
            onClick={() => toggle("location")}
            onMouseDown={() => setBtnDown("b")}
            onMouseUp={() => setBtnDown(null)}
            onMouseLeave={() => setBtnDown(null)}
          />
          <button
            style={btnStyle("c")}
            onClick={() => toggle("availability")}
            onMouseDown={() => setBtnDown("c")}
            onMouseUp={() => setBtnDown(null)}
            onMouseLeave={() => setBtnDown(null)}
          />
        </div>

      </div>
    </div>
  )
}
