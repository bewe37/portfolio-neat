import AboutSection from "@/components/AboutSection"
import ContactList from "@/components/ContactList"
import PhotoGallery from "@/components/PhotoGallery"
import MarqueeFooter from "@/components/MarqueeFooter"
import HeaderNav from "@/components/HeaderNav"
import { NameFlipChip } from "@/components/HeroTextWithPen"
import ThemeToggle from "@/components/ThemeToggle"
import MobileMenu from "@/components/MobileMenu"

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <main
        style={{
          width:    "100%",
          maxWidth: 1280,
          margin:   "0 auto",
          padding:  "0 48px",
          display:  "flex",
          flexDirection: "column",
          flex: 1,
        }}
        className="rsp-px"
      >
        {/* Nav row */}
        <div
          className="rsp-hero-row"
          style={{
            display:         "flex",
            alignItems:      "flex-start",
            justifyContent:  "space-between",
            gap:             20,
            padding:         "48px 0 0",
          }}
        >
          <NameFlipChip label="Georgius" tileH={24} />
          <span className="rsp-hide-mobile" style={{ display: "inline-flex", alignItems: "center", gap: 8, paddingTop: 4 }}>
            <HeaderNav />
            <ThemeToggle />
          </span>
          <MobileMenu />
        </div>

        {/* ── About ─────────────────────────────────────────────────── */}
        <AboutSection />

        {/* ── Experience ────────────────────────────────────────────── */}
        <section style={{ padding: "48px 0 72px", display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0 }}>
              Experience
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--divider)" }}>
            {[
              { company: "YU Blueprint",  role: "Design Lead",                          period: "Feb 2026 – Present",  desc: "Building software to help nonprofit organization track and manage donation programs." },
              { company: "AMD",           role: "Product Design Intern",                period: "May 2025 – Dec 2025", desc: "Designing and building software experiences for AMD's Adrenalin platform, used by millions of gamers worldwide." },
              { company: "Safe Software", role: "Product Design Intern",                period: "Jan 2024 – Aug 2024", desc: "Shipped enhanced annotation features, redesigned icons, and overhauled the FME Form design system." },
              { company: "Vosyn",         role: "Product Design Intern (Design Lead)",  period: "Sep – Dec 2023",      desc: "Led a team of 6 designers as primary design lead for an LLM-powered streaming platform." },
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
                <span className="rsp-exp-company" style={{ gridArea: "company", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--c-high)",      letterSpacing: "-0.01em", alignSelf: "baseline" }}>{exp.company}</span>
                <span className="rsp-exp-role"    style={{ gridArea: "role",    fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--c-mid)",       letterSpacing: "-0.01em", alignSelf: "baseline" }}>{exp.role}</span>
                <span className="rsp-exp-period"  style={{ gridArea: "period",  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, color: "var(--c-secondary)", letterSpacing: "-0.01em" }}>{exp.period}</span>
                <span className="rsp-exp-desc"    style={{ gridArea: "desc",    fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 400, color: "var(--c-secondary)", letterSpacing: "-0.01em", lineHeight: 1.7 }}>{exp.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Through the lens ──────────────────────────────────────── */}
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

        {/* ── Contact ───────────────────────────────────────────────── */}
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

      <MarqueeFooter />
    </div>
  )
}
