import ContactList from "@/components/ContactList"
import PhotoGallery from "@/components/PhotoGallery"
import MarqueeFooter from "@/components/MarqueeFooter"
import FadeUp from "@/components/FadeUp"

const EXPERIENCE = [
  { company: "YU Blueprint",  role: "Design Lead",           period: "Feb 2026 – Present" },
  { company: "AMD",           role: "Product Design Intern", period: "May – Dec 2025"     },
  { company: "Safe Software", role: "Product Design Intern", period: "Jan – Aug 2024"     },
  { company: "Vosyn",         role: "Product Design Intern", period: "Sep – Dec 2023"     },
]

const ROW: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "clamp(120px, 14vw, 200px) minmax(0, 1fr)",
  gap: "0 clamp(24px, 5vw, 72px)",
  padding: "32px 0",
  borderBottom: "1px solid var(--divider)",
}

const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
  color: "var(--c-primary)", letterSpacing: "-0.01em", margin: 0, paddingTop: 2,
}

const BODY: React.CSSProperties = {
  fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 400,
  color: "var(--c-secondary)", letterSpacing: "-0.01em", lineHeight: 1.75, margin: 0,
}

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <main
        style={{ width: "100%", padding: "0 48px", display: "flex", flexDirection: "column" }}
        className="rsp-px"
      >
        <FadeUp delay={0}>
          <section style={{ padding: "48px 0 64px", maxWidth: 900, margin: "0 auto", width: "100%" }}>

            {/* ── Gallery ──────────────────────────────────────────── */}
            <div style={{ marginBottom: 48 }}>
              <PhotoGallery />
            </div>

            {/* ── Content rows ─────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--divider)" }}>

              <div style={{ ...ROW }} className="rsp-stack">
                <p style={LABEL}>Hi there!</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={BODY}>
                    I&apos;m Georgius Bryan Winata, but Bryan works. And yes, Georgius… gorgeous. I&apos;ve heard it enough times, I&apos;ll save you the effort.
                  </p>
                  <p style={BODY}>
                    I&apos;m a product designer based in Toronto. At the core, I love art, people, and technology, and design is where all three tend to meet. I care about making things feel obvious. Not by simplifying everything, but by structuring complexity so people don&apos;t have to think about it. The decisions behind the interface matter as much as the interface itself, and the details are usually where it falls apart.
                  </p>
                </div>
              </div>

              <div style={{ ...ROW }} className="rsp-stack">
                <p style={LABEL}>Outside of design</p>
                <p style={BODY}>
                  Beyond work, you&apos;ll find me lingering in front of interesting buildings, shooting film, nursing a drink at a good bar, or chasing a proper meal from a Chinese aunty who definitely doesn&apos;t speak English but absolutely knows what she&apos;s doing.
                </p>
              </div>

              <div style={{ ...ROW }} className="rsp-stack">
                <p style={LABEL}>Education</p>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.01em" }}>York University</span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, color: "var(--c-dim)", letterSpacing: "-0.01em" }}>B.A. Digital Media</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, color: "var(--c-faint)", letterSpacing: "-0.01em", whiteSpace: "nowrap", flexShrink: 0 }}>2020 – 2025</span>
                </div>
              </div>

              <div style={{ ...ROW }} className="rsp-stack">
                <p style={LABEL}>Experience</p>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {EXPERIENCE.map((exp, i, arr) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "baseline", justifyContent: "space-between",
                      padding: "8px 0", gap: 12,
                      borderBottom: i < arr.length - 1 ? "1px solid var(--divider)" : "none",
                    }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, minWidth: 0 }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "var(--c-primary)", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{exp.company}</span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 400, color: "var(--c-dim)", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{exp.role}</span>
                      </div>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, color: "var(--c-faint)", letterSpacing: "-0.01em", whiteSpace: "nowrap", flexShrink: 0 }}>{exp.period}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...ROW, borderBottom: "none" }} className="rsp-stack">
                <p style={LABEL}>Find me at</p>
                <ContactList />
              </div>

            </div>
          </section>
        </FadeUp>

      </main>

      <MarqueeFooter />
    </div>
  )
}
