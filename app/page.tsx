import ThemeToggle from "@/components/ThemeToggle"
import { HoverCyclingFlipBoard } from "@/components/HeroTextWithPen"
import HeaderNav from "@/components/HeaderNav"
import MobileMenu from "@/components/MobileMenu"
import ProjectCards from "@/components/ProjectCards"
import MarqueeFooter from "@/components/MarqueeFooter"

const PROJECTS = [
  {
    title: "Rethinking the Overlay as a Control Surface",
    category: "Product Design",
    date: "2025",
    description: "Designing a conversational AI assistant embedded in AMD's Adrenalin software for millions of gamers.",
    href: "/amd_ai_project",
    cover: "/AMDThumbnail.png",
    images: ["/amdMainImage.png", "/InGameWidget.png"],
  },
  {
    title: "The Design System That Kept AMD's Team Aligned",
    category: "Design System",
    date: "May 2025 – Dec 2025",
    description: "Building a scalable component library that unified design and engineering across AMD's product suite.",
    href: "/amd_project",
    cover: "/AMDCaseStudy.png",
    images: ["/DSHighlight.png", "/comp 1.png"],
  },
  {
    title: "Reducing Clutter Without Losing Context",
    category: "Product Design",
    date: "April – August 2024",
    description: "Streamlining FME's annotation workflow so users can focus on insight, not interface noise.",
    href: "/fme_annotation_project",
    cover: "/SafeCaseStudyH.png",
    images: ["/AnnotationCanvas.png", "/AnnotationNavigator.png"],
  },
  {
    title: "Simplifying Donation Tracking at Scale",
    category: "Product Design",
    date: "February 2026 – Now",
    description: "Designing a clear, humane dashboard for nonprofits to manage donor relationships at scale.",
    href: "/blueprint",
    cover: "/YUBlueprintHighlight.jpg",
    images: ["/blueprintpeak.png", "/CardPeak.png"],
  },
]


export default function HomePage() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <main
        style={{ width: "100%", maxWidth: 1400, margin: "0 auto", padding: "0 48px", display: "flex", flexDirection: "column" }}
        className="rsp-px"
      >
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section style={{ padding: "48px 0 8px", display: "flex", flexDirection: "column", gap: 40 }}>

          {/* Nav row */}
          <div className="rsp-hero-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <span style={{ fontFamily:    "var(--font-sans)", fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--c-dim)" }}>
              Georgius
            </span>
            <span className="rsp-hide-mobile" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <HeaderNav />
              <ThemeToggle />
            </span>
            <MobileMenu />
          </div>


          {/* Hero — single inline sentence */}
          <div style={{ display: "flex", flexDirection: "column", padding: "96px 0 0 0" }}>
            <p style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      16,
              fontWeight:    500,
              letterSpacing: "-0.01em",
              lineHeight:    1.9,
              color:         "var(--c-primary)",
              margin:        0,
              maxWidth: 820, 
            }}>
              <span style={{ color: "var(--c-primary)", fontWeight: 500 }}>Bryan Winata</span>
              {" "}is a product designer based in {" "}
              <span style={{ color: "var(--c-primary)", fontWeight: 500 }}>Toronto, Canada</span>
              {". "}I&apos;m passionate about turning &ldquo;why is this so confusing&rdquo; into &ldquo;wait, that was easy?&rdquo; Mostly through obsessive detail-tweaking and too much coffee.
            </p>
            <p style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      16,
              fontWeight:    500,
              letterSpacing: "-0.01em",
              lineHeight:    1.9,
              color:         "var(--c-dim)",
              margin:        0,
              width: "720px",
            }}>
              Previously taking care pixels at @ AMD & Safe Software.
            </p>
          </div>

        </section>

        {/* ── Selected Work ───────────────────────────────────────────── */}
        <section style={{ padding: "48px 0 0px", display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingTop: 16 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.01em", margin: 0 }}>
              Selected work
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, color: "var(--c-faint)", letterSpacing: "-0.01em", margin: 0 }}>
              2023–2026
            </p>
          </div>

          <ProjectCards projects={PROJECTS} />
        </section>

      </main>

      <MarqueeFooter />
    </div>
  )
}
