import ContactList from "@/components/ContactList"
import ThemeToggle from "@/components/ThemeToggle"
import HeroTextWithPen, { NameFlipChip } from "@/components/HeroTextWithPen"
import HeaderNav from "@/components/HeaderNav"
import MobileMenu from "@/components/MobileMenu"
import ProjectFolders, { AMD_PAPERS, AMD_AI_PAPERS, FME_PAPERS } from "@/components/ProjectFolders"
import MarqueeFooter from "@/components/MarqueeFooter"
import AboutSection from "@/components/AboutSection"
import PhotoGallery from "@/components/PhotoGallery"

const PROJECTS = [
  {
    title: "Rethinking the Overlay as a Control Surface",
    category: "Product Design",
    date: "2025",
    description: "Designing a conversational AI assistant embedded in AMD's Adrenalin software for millions of gamers.",
    href: "/amd_ai_project",
    folder: "/redFur.svg",
    folderTransform: "none",
    chip: "/amdchip.svg",
    papers: ["/amdMainImage.png", "/Pinned Widgets Container.svg", "/Now Playing In-Game Widget.svg"],
    paperCfg: AMD_AI_PAPERS,
  },
  {
    title: "The Design System That Kept AMD's Team Aligned",
    category: "Design System",
    date: "May 2025 – Dec 2025",
    description: "Building a scalable component library that unified design and engineering across AMD's product suite.",
    href: "/amd_project",
    folder: "/metal.svg",
    chip: "/amdchip.svg",
    papers: ["/DSHighlight.png", "/comp 1.png", "/comp 3.png"],
    paperCfg: AMD_PAPERS,
  },
  {
    title: "Reducing Clutter Without Losing Context",
    category: "Product Design",
    date: "April – August 2024",
    description: "Streamlining FME's annotation workflow so users can focus on insight, not interface noise.",
    href: "/fme_annotation_project",
    folder: "/chequereds.svg",
    chip: "/safechip.svg",
    chipSize: 100,
    papers: ["/Annotation WindowD.png", "/AnnotationsExample.svg"],
    paperCfg: FME_PAPERS,
  },
  {
    title: "Simplifying Donation Tracking at Scale",
    category: "Product Design",
    date: "February 2026 – Now",
    description: "Designing a clear, humane dashboard for nonprofits to manage donor relationships at scale.",
    href: "/blueprint",
    folder: "/plastic.svg",
    chip: "/bpLogo.svg",
    chipSize: 52,
    papers: ["/blueprintpeak.png", "/CardPeak.png", "/CardPeak2.png"],
    peekPapers: true,
  },
  {
    title: "Playground",
    category: "Experiments",
    date: "2026",
    description: "Coming soon.",
    href: "/",
    folder: "/avocado.svg",
    comingSoon: true,
    hideMobile: true,
  },
]


export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 1,
      }}
    >

      <main
        style={{
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 48px",
          display: "flex",
          flexDirection: "column",
        }}
        className="rsp-px"
      >
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            padding: "48px 0 80px",
            display: "flex",
            flexDirection: "column",
            gap: 80,
            overflow: "visible",
          }}
        >
          {/* Nav row */}
          <div
            className="rsp-hero-row"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 20,
              position: "relative",
              zIndex: 20,
            }}
          >
            <NameFlipChip label="Georgius" tileH={24} />
            <span className="rsp-hide-mobile" style={{ display: "inline-flex", alignItems: "center", gap: 8, paddingTop: 4 }}>
              <HeaderNav aboutLink="/projects" />
              <ThemeToggle />
            </span>
            <MobileMenu />
          </div>

          {/* Bio */}
          <div style={{ position: "relative", zIndex: 1, maxWidth: 810, display: "flex", flexDirection: "column", gap: 20 }}>
            <HeroTextWithPen
              before="Hey, I'm Georgius — "
              balloonName="Georgius"
              name="Georgius"
              middle=" a Toronto-based product designer, previously at"
              company="AMD"
              companyLink="https://www.amd.com"
              companyLogoSrc="/amdchip.svg"
              companyLogoSize={56}
              afterCompany="&"
              secondCompany="Safe Software"
              secondCompanyLink="https://www.safe.com"
              secondCompanyLogoSrc="/safechip.svg"
              secondCompanyLogoSize={72}
              after=". I do the invisible work — turning &ldquo;why is this so confusing&rdquo; into &ldquo;wait, that was easy?&rdquo; Mostly through obsessive detail-tweaking and too much coffee."
              fontSize={20}
              fontWeight={400}
              fontFamily="var(--font-sans)"
              textColor="var(--c-primary)"
              dimmedColor="var(--c-dim)"
            />
            <p style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              fontWeight: 400,
              color: "var(--c-mid)",
              opacity: 0.75,
              letterSpacing: "-0.01em",
              lineHeight: 1.6,
            }}>
              Also into: architecture, film, painting, and finding the best meal in every city I visit.
            </p>
          </div>
        </section>

        {/* ── Selected Work ───────────────────────────────────────────── */}
        <section style={{ padding: "48px 0 72px", display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0 }}>
              Selected projects
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 400, color: "var(--c-dim)", letterSpacing: "-0.01em", lineHeight: 1.5, margin: 0 }}>
              Curated projects of past work experience &amp; experiments.
            </p>
          </div>

          {/* Textured panel */}
          <div style={{
            position:        "relative",
            borderRadius:    20,
            padding:         "0 40px 48px",
            backgroundColor: "var(--surface)",
            backgroundImage: "radial-gradient(circle, var(--dot-color) 1px, transparent 1px)",
            backgroundSize:  "18px 18px",
            overflow:        "visible",
          }}>
            <ProjectFolders projects={PROJECTS} />
          </div>
        </section>

        {/* ── About ───────────────────────────────────────────────────── */}
        <AboutSection />

        {/* ── Through the lens ───────────────────────────────────────── */}
        <section style={{ padding: "48px 0 72px", display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0 }}>
              Through the lens
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 400, color: "var(--c-dim)", letterSpacing: "-0.01em", lineHeight: 1.5, margin: 0 }}>
              Places, moments, and things I've pointed a camera at.
            </p>
          </div>
          <PhotoGallery />
        </section>

        {/* ── Experience ──────────────────────────────────────────────── */}
        <section style={{ padding: "48px 0 72px", display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0 }}>
              Experience
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--divider)" }}>
            {[
              { company: "YU Blueprint",    role: "Design Lead",       period: "Feb 2026 – Present",       desc: "Building software to help nonprofit organization track and manage donation programs." },
              { company: "AMD",              role: "Product Design Intern",        period: "May 2025 – Dec 2025",       desc: "Designing and building software experiences for AMD's Adrenalin platform, used by millions of gamers worldwide." },
              { company: "Safe Software",    role: "Product Design Intern",       period: "Jan 2024 – Aug 2024",      desc: "Shipped enhance annotation features, redesigned icons, and overhauled the FME Form design system." },
              { company: "Vosyn",            role: "Product Design Intern (Design Lead)",  period: "Sep – Dec 2023",           desc: "Led a team of 6 designers as primary design lead for an LLM-powered streaming platform." },
            ].map((exp, i, arr) => (
              <div key={i} className="rsp-exp-item" style={{
                display:             "grid",
                gridTemplateAreas:   '"company role" "period desc"',
                gridTemplateColumns: "180px 1fr",
                columnGap:           32,
                rowGap:              6,
                padding:             "24px 0",
                borderBottom:        i < arr.length - 1 ? "1px solid var(--divider)" : "none",
              }}>
                <span className="rsp-exp-company" style={{ gridArea: "company", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--c-high)", letterSpacing: "-0.01em", alignSelf: "baseline" }}>{exp.company}</span>
                <span className="rsp-exp-role"    style={{ gridArea: "role",    fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--c-mid)",  letterSpacing: "-0.01em", alignSelf: "baseline" }}>{exp.role}</span>
                <span className="rsp-exp-period"  style={{ gridArea: "period",  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, color: "var(--c-secondary)", letterSpacing: "-0.01em" }}>{exp.period}</span>
                <span className="rsp-exp-desc"    style={{ gridArea: "desc",    fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 400, color: "var(--c-secondary)", letterSpacing: "-0.01em", lineHeight: 1.7 }}>{exp.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Contact ─────────────────────────────────────────────────── */}
        <section style={{ padding: "48px 0 72px", display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0 }}>
              Find me at
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 400, color: "var(--c-dim)", letterSpacing: "-0.01em", lineHeight: 1.5, margin: 0 }}>
              Open to new opportunities and collaborations.
            </p>
          </div>
          <ContactList />
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <MarqueeFooter />
    </div>
  )
}
