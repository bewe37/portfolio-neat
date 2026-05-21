"use client"

import { usePathname } from "next/navigation"
import { useState, useCallback } from "react"
import HeaderNav from "@/components/HeaderNav"
import MobileMenu from "@/components/MobileMenu"
import Link from "next/link"

function Sparkle({ spinning }: { spinning: boolean }) {
  return (
    <svg
      width="11" height="11" viewBox="0 0 11 11" fill="none"
      style={{
        flexShrink: 0,
        animation: spinning
          ? "sparkle-click 0.6s ease-out, sparkle-spin 6s linear infinite 0.6s"
          : "sparkle-spin 6s linear infinite",
      }}
    >
      <style>{`
        @keyframes sparkle-spin {
          0%   { transform: rotate(0deg)   scale(1);    opacity: 0.5; }
          25%  { transform: rotate(90deg)  scale(1.15); opacity: 1;   }
          50%  { transform: rotate(180deg) scale(1);    opacity: 0.5; }
          75%  { transform: rotate(270deg) scale(1.15); opacity: 1;   }
          100% { transform: rotate(360deg) scale(1);    opacity: 0.5; }
        }
        @keyframes sparkle-click {
          0%   { transform: rotate(0deg)   scale(1);   opacity: 0.5; }
          30%  { transform: rotate(180deg) scale(1.4); opacity: 1;   }
          60%  { transform: rotate(320deg) scale(1.2); opacity: 1;   }
          100% { transform: rotate(360deg) scale(1);   opacity: 0.5; }
        }
      `}</style>
      <path
        d="M5.5 0 L6.1 4.9 L11 5.5 L6.1 6.1 L5.5 11 L4.9 6.1 L0 5.5 L4.9 4.9 Z"
        fill="currentColor"
      />
    </svg>
  )
}

const CASE_STUDY_PATHS = ["/amd_ai_project", "/amd_project", "/fme_annotation_project", "/blueprint"]

export default function SharedNav() {
  const pathname = usePathname()
  const isCaseStudy = CASE_STUDY_PATHS.some(p => pathname.startsWith(p))
  const [spinning, setSpinning] = useState(false)

  const handleClick = useCallback(() => {
    setSpinning(true)
    setTimeout(() => setSpinning(false), 700)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  if (isCaseStudy) return null

  return (
    <div
      style={{
        position:      "absolute",
        top:           0,
        left:          0,
        right:         0,
        zIndex:        100,
        pointerEvents: "none",
        padding:       "0 clamp(20px, 4vw, 48px)",
      }}
      className="rsp-px"
    >
      <div style={{
        maxWidth:       1200,
        margin:         "0 auto",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        paddingTop:     24,
        paddingBottom:  24,
      }}>
        {/* Name — left */}
        <Link
          href="/"
          onClick={handleClick}
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            6,
            fontFamily:     "var(--font-sans)",
            fontSize:       14,
            fontWeight:     500,
            letterSpacing:  "-0.01em",
            color:          "var(--c-primary)",
            textDecoration: "none",
            pointerEvents:  "auto",
          }}
        >
          <Sparkle spinning={spinning} />
          Georgius Bryan
        </Link>

        {/* Nav + theme — right */}
        <span className="rsp-hide-mobile" style={{ display: "inline-flex", alignItems: "center", gap: 4, pointerEvents: "auto" }}>
          <HeaderNav />
        </span>
        <MobileMenu />
      </div>
    </div>
  )
}
