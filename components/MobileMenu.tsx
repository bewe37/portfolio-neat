"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ArrowUpRight } from "@phosphor-icons/react"
import ThemeToggle from "@/components/ThemeToggle"

const RESUME_LINK = "https://drive.google.com/file/d/183_FgYoQBjhv5QLawsPr_fUt_K5gf6hi/view"

const NAV_ITEMS = [
  { label: "Resume",      href: RESUME_LINK,                             newTab: true  },
  { label: "Email",       href: "mailto:bryanwinata112@gmail.com",       newTab: false },
  { label: "X / Twitter", href: "https://x.com/gbryanwt",               newTab: true  },
  { label: "LinkedIn",    href: "https://www.linkedin.com/in/gbryanw/",  newTab: true  },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const bar1  = useRef<HTMLSpanElement>(null)
  const bar2  = useRef<HTMLSpanElement>(null)
  const bar3  = useRef<HTMLSpanElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  // GSAP hamburger → X animation
  useEffect(() => {
    tlRef.current?.kill()
    const tl = gsap.timeline()
    tlRef.current = tl

    if (open) {
      tl.to(bar2.current, { opacity: 0, scaleX: 0.4, duration: 0.14, ease: "power2.out" }, 0)
        .to(bar1.current, { y: 6.5, rotation: 45,  duration: 0.28, ease: "power3.out" }, 0)
        .to(bar3.current, { y: -6.5, rotation: -45, duration: 0.28, ease: "power3.out" }, 0)
    } else {
      tl.to(bar1.current, { y: 0, rotation: 0,  duration: 0.26, ease: "power3.out" }, 0)
        .to(bar3.current, { y: 0, rotation: 0,  duration: 0.26, ease: "power3.out" }, 0)
        .to(bar2.current, { opacity: 1, scaleX: 1, duration: 0.18, ease: "power2.out" }, 0.1)
    }
  }, [open])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  useEffect(() => () => { tlRef.current?.kill() }, [])

  const barStyle: React.CSSProperties = {
    display: "block",
    width: 22,
    height: 1.5,
    background: "var(--c-primary)",
    borderRadius: 2,
    transformOrigin: "center",
    willChange: "transform, opacity",
  }

  return (
    <>
      {/* Hamburger / X button — inline flex item in header row, shown on mobile only via .rsp-hamburger */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="rsp-hamburger"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px",
          flexDirection: "column",
          gap: 5,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span ref={bar1} style={barStyle} />
        <span ref={bar2} style={barStyle} />
        <span ref={bar3} style={barStyle} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mob-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 999,
                background: "rgba(0,0,0,0.22)",
                backdropFilter: "blur(3px)",
                WebkitBackdropFilter: "blur(3px)",
              }}
            />

            {/* Slide-down panel */}
            <motion.div
              key="mob-panel"
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: "var(--bg)",
                borderBottom: "1px solid var(--border)",
                paddingTop: 80,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 36,
              }}
            >
              {NAV_ITEMS.map(({ label, href, newTab }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={newTab ? "_blank" : undefined}
                  rel={newTab ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1], delay: 0.06 + i * 0.05 }}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "15px 0",
                    borderBottom: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--c-primary)",
                    fontFamily: "var(--font-sans)",
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {label}
                  <ArrowUpRight size={16} weight="regular" style={{ color: "var(--c-dim)", flexShrink: 0 }} />
                </motion.a>
              ))}

              {/* Theme toggle row */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1], delay: 0.06 + NAV_ITEMS.length * 0.05 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 18,
                }}
              >
                <span style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 20,
                  fontWeight: 500,
                  color: "var(--c-dim)",
                  letterSpacing: "-0.02em",
                }}>
                  Theme
                </span>
                <ThemeToggle />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
