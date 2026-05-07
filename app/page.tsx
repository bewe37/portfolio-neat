import { InlineLogoChip, NameFlipChip } from "@/components/HeroTextWithPen"
import ProjectCards from "@/components/ProjectCards"
import MarqueeFooter from "@/components/MarqueeFooter"
import WrenchWord from "@/components/WrenchWord"
import { EasyWord } from "@/components/HeroInteractions"
import FuzzyStickers from "@/components/FuzzyStickers"
import FadeUp from "@/components/FadeUp"

const PROJECTS = [
  {
    title: "Rethinking the Overlay as a Control Surface",
    category: "Product Design",
    date: "2025",
    description: "Designing a conversational AI assistant embedded in AMD's Adrenalin software for millions of gamers.",
    href: "/amd_ai_project",
    cover: "/AMDThumbnail2.png",
    images: ["/amdMainImage.png", "/InGameWidget.png"],
  },
  {
    title: "The Design System That Kept AMD's Team Aligned",
    category: "Design System",
    date: "May 2025 – Dec 2025",
    description: "Building a scalable component library that unified design and engineering across AMD's product suite.",
    href: "/amd_project",
    cover: "/AMDCaseStudyH2.png",
    images: ["/DSHighlight.png", "/comp 1.png"],
  },
  {
    title: "Reducing Clutter Without Losing Context",
    category: "Product Design",
    date: "April – August 2024",
    description: "Streamlining FME's annotation workflow so users can focus on insight, not interface noise.",
    href: "/fme_annotation_project",
    cover: "/SafeCaseStudyH2.png",
    images: ["/AnnotationCanvas.png", "/AnnotationNavigator.png"],
  },
  {
    title: "Simplifying Donation Tracking at Scale",
    category: "Product Design",
    date: "February 2026 – Now",
    description: "Designing a clear, humane dashboard for nonprofits to manage donor relationships at scale.",
    href: "/blueprint",
    cover: "/YUBlueprintThumbnail.png",
    images: ["/blueprintpeak.png", "/CardPeak.png"],
  },
]


export default function HomePage() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <main
        style={{ width: "100%", padding: "0 48px", display: "flex", flexDirection: "column" }}
        className="rsp-px"
      >
        {/* ── Grid texture: nav + hero + selected work label ──────────── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <div className="hero-grid" style={{ position: "relative" }}>
          <FuzzyStickers />

          {/* ── Hero ──────────────────────────────────────────────────── */}
          <section style={{ padding: "24px 0 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <FadeUp delay={0} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "72px 0 0 0", textAlign: "center" }}>
              <NameFlipChip label="Georgius" tileH={28} />
              <p style={{
                fontFamily:    "var(--font-sans)",
                fontSize:      17,
                fontWeight:    400,
                letterSpacing: "-0.01em",
                lineHeight:    1.9,
                color:         "var(--c-primary)",
                margin:        0,
                maxWidth: 560,
              }}>
                I&apos;m a product designer based in Toronto. Passionate about turning why is this so confusing into wait, that was <EasyWord /> Mostly through obsessive <WrenchWord />
              </p>
              <p style={{
                fontFamily:    "var(--font-sans)",
                fontSize:      15,
                fontWeight:    400,
                letterSpacing: "-0.01em",
                lineHeight:    1.9,
                color:         "var(--c-dim)",
                margin:        0,
              }}>
                Previously taking care of pixels at<InlineLogoChip src="/amdchip.svg" alt="AMD" link="https://www.amd.com" size={48} />&amp;<InlineLogoChip src="/safechip.svg" alt="Safe Software" link="https://www.safe.com" size={60} />
              </p>
            </FadeUp>
          </section>

          {/* ── Selected Work label (inside grid) ─────────────────────── */}
          <FadeUp delay={0.1}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingTop: 100 }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.01em", margin: 0 }}>
                Selected work
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, color: "var(--c-faint)", letterSpacing: "-0.01em", margin: 0 }}>
                2023–2026
              </p>
            </div>
          </FadeUp>

        </div>{/* end hero-grid */}

        {/* ── Project cards (outside grid) ────────────────────────────── */}
        <FadeUp delay={0.18}>
          <section style={{ padding: "16px 0 96px", display: "flex", flexDirection: "column", gap: 24 }}>
            <ProjectCards projects={PROJECTS} />
          </section>
        </FadeUp>

        </div>{/* end maxWidth wrapper */}

      </main>

      <MarqueeFooter />
    </div>
  )
}
