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
    title: "An Archive of Toronto's Painted Utility Boxes",
    category: "Photography",
    date: "Check em out →",
    description: "A self-initiated archive of every painted utility box found across Toronto — documenting the street artists turning infrastructure into canvas.",
    href: "https://outside-the-box-tau.vercel.app/gallery",
    cover: "/OTBPortfolio.mp4",
    coverFit: "contain" as const,
    coverBg: "#ffffff",
    coverPadding: 20,
    coverBorder: "1px solid rgba(0,0,0,0.08)",
  },
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
    cover: "/ThumbnailAMDAI.mp4",
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
    cover: "/AnnotationVid.mp4",
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
    <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}>

      {/* ── Hero — full bleed ──────────────────────────────────────────── */}
      <section style={{
        position:  "relative",
        width:     "100%",
        height:    "100svh",
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
          <FadeUp delay={0.15} style={{ width: "auto", display: "flex", justifyContent: "center" }}>
            <p
              onMouseEnter={() => setHeroHovered(true)}
              onMouseLeave={() => setHeroHovered(false)}
              onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                fontFamily:    "var(--font-sans)",
                fontSize:      "clamp(15px, 1.45vw, 20px)",
                fontWeight:    400,
                letterSpacing: "-0.02em",
                lineHeight:    1.5,
                color:         "var(--c-mid)",
                margin:        0,
                textAlign:     "center",
                pointerEvents: "auto",
                cursor:        "pointer",
              }}
            >
              <span style={{ transition: "opacity 0.5s ease", opacity: heroHovered ? 0 : 1 }}>
                Giving complicated tools<br />
                a reason to feel{" "}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-gabriela)",
                  fontStyle:  "italic",
                  fontWeight: 400,
                  color:      "var(--c-primary)",
                  transition: "opacity 0.5s ease",
                  opacity:    heroHovered ? 0 : 1,
                }}
              >
                beautiful.
              </span>
              {" "}
              <button
                onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
                aria-label="Scroll to work"
                style={{
                  display:        "inline-flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  verticalAlign:  "middle",
                  background:     "none",
                  border:         "none",
                  padding:        4,
                  cursor:         "pointer",
                  color:          "var(--c-mid)",
                  transition:     "opacity 0.5s ease",
                  opacity:        heroHovered ? 0 : 1,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ display: "block", transform: "scaleX(-1)" }}>
                  <path d="M13 4H8a1 1 0 0 0-1 1v7M7 12l-3-3M7 12l3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </p>
          </FadeUp>
        </div>

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
          <div style={{ maxWidth: 1340, margin: "0 auto", paddingLeft: 17 }}>
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
        <div style={{ maxWidth: 1340, margin: "0 auto", width: "100%" }}>

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
