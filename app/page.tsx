"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import ProjectCards from "@/components/ProjectCards"
import MarqueeFooter from "@/components/MarqueeFooter"
import FadeUp from "@/components/FadeUp"
import OnboardingLightbox from "@/components/OnboardingLightbox"
import CompanionThumbnail from "@/components/CompanionThumbnail"
import dynamic from "next/dynamic"

const HeroParticles = dynamic(() => import("@/components/HeroParticles"), { ssr: false })

const VIBE_PROJECTS = [
  {
    title: "My Unhealthy Obsession Over Skeuomorphic Design",
    category: "Vibe Coded",
    date: "",
    description: "A skeuomorphic command palette — brushed metal, tactile keys, real physics. Built because flat design took something away.",
    href: "https://github.com/bewe37",
    cover: "/skeuomorphicCommand.mp4",
    carousel: ["/skeuomorphicCommand.mp4", "/SkeuomorphicCalendarShort.mp4"],
    comingSoon: true,
  },
  {
    title: "Subscription Plan Component",
    category: "Vibe Coded",
    date: "",
    description: "A multi-step subscription flow with animated billing toggle, payment form, and success state — built from a static design.",
    href: "/subscription_plan",
    cover: "/PricingComponents.mp4",
    comingSoon: true,
  },
  {
    title: "CRT Portfolio Website",
    category: "Vibe Coded",
    date: "Check em out →",
    description: "This portfolio — designed and built from scratch with Next.js, framer-motion stickers, and a lot of obsessing over details.",
    href: "https://gbryanwt.com/",
    cover: "/PortfolioThumbnail.mp4",
  },
]

const PROJECTS = [
  {
    title: "Rethinking the Overlay as a Control Surface",
    category: "Product Design",
    date: "May - Dec 2025",
    description: "Designing a conversational AI assistant embedded in AMD's Adrenalin software for millions of gamers.",
    href: "/amd_ai_project",
    cover: "/ThumbnailTest.mp4",
    badge: "/amdchip.svg",
  },
  {
    title: "The Design System That Kept AMD's Team Aligned",
    category: "Design System",
    date: "May – Dec 2025",
    description: "Building a scalable component library that unified design and engineering across AMD's product suite.",
    href: "/amd_project",
    cover: "/AMDCaseStudyH2.png",
    badge: "/amdchip.svg",
  },
  {
    title: "Reducing Clutter Without Losing Context",
    category: "Product Design",
    date: "April – August 2024",
    description: "Streamlining FME's annotation workflow so users can focus on insight, not interface noise.",
    href: "/fme_annotation_project",
    cover: "/SafeCaseStudyH2.png",
    badge: "/safechip.svg",
  },
  {
    title: "Simplifying Donation Tracking at Scale",
    category: "Product Design",
    date: "February 2026 – Now",
    description: "Designing a clear, humane dashboard for nonprofits to manage donor relationships at scale.",
    href: "/blueprint",
    cover: "/YUBlueprintThumbnail.png",
    badge: "/bpLogo.svg",
  },
]


export default function HomePage() {
  const [companionOpen, setCompanionOpen] = useState(false)
  const [heroHovered, setHeroHovered] = useState(false)

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* ── Hero — full bleed ──────────────────────────────────────────── */}
      <section style={{
        position:  "relative",
        width:     "100%",
        height:    "100dvh",
        minHeight: 560,
        overflow:  "hidden",
      }}>
        {/* Particles fill the whole hero */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <HeroParticles hovered={heroHovered} />
        </div>

        {/* Center — tagline */}
        <div style={{
          position:       "absolute",
          inset:          0,
          zIndex:         2,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          pointerEvents:  "none",
          userSelect:     "none",
        }}>
          <FadeUp delay={0.15} style={{ width: "auto" }}>
            <p style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      "clamp(15px, 1.6vw, 22px)",
              fontWeight:    400,
              letterSpacing: "-0.02em",
              lineHeight:    1.4,
              color:         "var(--c-mid)",
              margin:        0,
              pointerEvents: "none",
              transition:    "opacity 0.5s ease",
              opacity:       heroHovered ? 0 : 1,
            }}>
              Making complex things{" "}
              <style>{`
                @keyframes beautifulPulse {
                  0%, 100% { opacity: 1; }
                  50%       { opacity: 0.45; }
                }
              `}</style>
              <span
                style={{
                  fontStyle:     "italic",
                  fontWeight:    300,
                  pointerEvents: "auto",
                  cursor:        "default",
                  animation:     heroHovered ? "none" : "beautifulPulse 3s ease-in-out infinite",
                }}
                onMouseEnter={() => setHeroHovered(true)}
                onMouseLeave={() => setHeroHovered(false)}
              >
                beautiful
              </span>
            </p>
          </FadeUp>
        </div>

        {/* Scroll indicator — bottom center */}
        <style>{`
          @keyframes scrollBounce {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(5px); }
          }
        `}</style>

        {/* Mobile: bio + arrow stacked center */}
        <div className="rsp-hero-bottom-mobile" style={{
          display:        "none",
          position:       "absolute",
          bottom:         36,
          left:           0,
          right:          0,
          zIndex:         3,
          flexDirection:  "column",
          alignItems:     "center",
          gap:            16,
          pointerEvents:  "none",
          userSelect:     "none",
        }}>
          <svg width="22" height="22" viewBox="0 0 16 16" fill="none"
            style={{ animation: "scrollBounce 2s ease-in-out infinite", display: "block", color: "rgba(255,255,255,0.55)" }}>
            <path d="M8 3v10M8 13l-4-4M8 13l4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Desktop: arrow center + bio bottom-left */}
        <button
          className="rsp-hero-arrow-desktop"
          onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
          style={{
            position:      "absolute",
            bottom:        48,
            left:          "50%",
            transform:     "translateX(-50%)",
            zIndex:        3,
            background:    "none",
            border:        "none",
            padding:       0,
            cursor:        "pointer",
            color:         "rgba(255,255,255,0.55)",
            transition:    "color 0.15s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
        >
          <svg width="22" height="22" viewBox="0 0 16 16" fill="none"
            style={{ animation: "scrollBounce 2s ease-in-out infinite", display: "block" }}>
            <path d="M8 3v10M8 13l-4-4M8 13l4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Bottom left — desc (desktop only) */}
        <div className="rsp-hero-bio-desktop" style={{
          position:      "absolute",
          bottom:        "clamp(24px, 3vw, 40px)",
          left:          0,
          right:         0,
          zIndex:        3,
          pointerEvents: "none",
          userSelect:    "none",
          padding:       "0 clamp(20px, 4vw, 48px)",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", paddingLeft: 17 }}>
            <p style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      12,
              fontWeight:    400,
              lineHeight:    1.7,
              letterSpacing: "-0.01em",
              color:         "var(--c-dim)",
              margin:        0,
            }}>
              Designing for the love of craft.<br />
              Previously at AMD.
            </p>
          </div>
        </div>

      </section>

      <main
        style={{ width: "100%", padding: "0 48px", display: "flex", flexDirection: "column" }}
        className="rsp-px"
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>

        {/* ── Work container ───────────────────────────────────────────── */}
        <div id="work" style={{ position: "relative" }}>
          <FadeUp delay={0.5}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingTop: 120, paddingBottom: 16 }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.01em", margin: 0 }}>
                Selected work
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, color: "var(--c-faint)", letterSpacing: "-0.01em", margin: 0 }}>
                End-to-end Design & Design System
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.6}>
            <section style={{ paddingBottom: 64, display: "flex", flexDirection: "column", gap: 24 }}>
              <ProjectCards projects={PROJECTS} />
            </section>
          </FadeUp>

          <FadeUp delay={0.7}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingBottom: 16 }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.01em", margin: 0 }}>
                Built on Vibes ~
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, color: "var(--c-faint)", letterSpacing: "-0.01em", margin: 0 }}>
                Claude, Paper, Motion & React
              </p>
            </div>
            <section style={{ paddingBottom: 96, display: "flex", flexDirection: "column", gap: 24 }}>
              <ProjectCards projects={VIBE_PROJECTS} onLightbox={() => setCompanionOpen(true)} />
            </section>
          </FadeUp>
        </div>

        </div>{/* end maxWidth wrapper */}

      </main>

      <AnimatePresence>
        {companionOpen && <OnboardingLightbox onClose={() => setCompanionOpen(false)} />}
      </AnimatePresence>

      <MarqueeFooter />
    </div>
  )
}
