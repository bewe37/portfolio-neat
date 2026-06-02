"use client"

import MarqueeFooter from "@/components/MarqueeFooter"
import FadeUp from "@/components/FadeUp"
import InfiniteGallery from "@/components/InfiniteGallery"

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
      <main style={{ width: "100%", padding: "0 48px", display: "flex", flexDirection: "column" }} className="rsp-px">
        <FadeUp delay={0}>
          <section style={{ padding: "140px 0 64px", maxWidth: 1340, margin: "0 auto", width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>

              {/* Hero text */}
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: "clamp(22px, 3vw, 38px)",
                fontWeight: 300, color: "var(--c-primary)", letterSpacing: "-0.03em",
                lineHeight: 1.2, margin: "0 0 48px",
              }}>
                Good design comes from observing the world.<br /><span style={{ fontFamily: "var(--font-gabriela)", fontStyle: "italic", fontWeight: 400 }}>I take that part pretty literally.</span>
              </p>

              {/* Bio + Principles — three column */}
              <div style={{ padding: "32px 0", borderBottom: "1px solid var(--divider)", display: "grid", gridTemplateColumns: "clamp(120px, 14vw, 200px) 1fr 1fr", gap: "0 clamp(24px, 5vw, 72px)", alignItems: "start" }} className="rsp-stack">
                <p style={LABEL}>Hi there!</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <p style={{ ...LABEL, color: "var(--c-primary)", fontSize: 15, fontWeight: 600 }}>How I got into design</p>
                  <p style={BODY}>
                    Growing up, I was always making things. Drawing, painting, shooting video on whatever camera I could get my hands on. I wasn&apos;t thinking about design. I was just obsessed with how things made people feel.
                  </p>
                  <p style={BODY}>
                    I never touched product design until university, and my entry point was honestly just frustration with products that felt like they were built for the person who made them, not the person using them. But the more I learned, the more I realized it was psychology. Understanding how people think, what they notice, where they hesitate. That&apos;s when I felt the real connection to everything I&apos;d been doing since I was a kid. Shaping something that lands differently in someone else&apos;s chest than it does in your own.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <p style={{ ...LABEL, color: "var(--c-primary)", fontSize: 15, fontWeight: 600 }}>What I believe</p>
                  <p style={BODY}>
                    Good design doesn&apos;t announce itself. The best interfaces I&apos;ve ever used felt inevitable, like someone had already thought through every edge case before I got there.
                  </p>
                  <p style={BODY}>
                    I believe complexity is real and you can&apos;t design it away, only through it. I believe the details are where trust is built or lost. And I believe taste is everything. Not as decoration, but as the thing that tells you when something is right before you can fully explain why.
                  </p>
                </div>

              </div>

              {/* Experience */}
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


              {/* Outside of design */}
              <div style={{ ...ROW, borderBottom: "none" }} className="rsp-stack">
                <p style={LABEL}>I still touch grass</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <p style={BODY}>
                    Beyond the screen, you&apos;ll find me somewhere between a new city and a full plate. I travel whenever I can, and food is usually the whole point. There&apos;s something about being somewhere unfamiliar that resets my brain, clears out the noise and makes room for ideas that wouldn&apos;t have surfaced otherwise. What you&apos;ll find below is a mix of goofy photos of me, places that actually stuck, and meals I still think about. The living part of the portfolio, less about the work, more about the person behind it.
                  </p>
                  <InfiniteGallery />
                </div>
              </div>

            </div>
          </section>
        </FadeUp>
      </main>
      <MarqueeFooter />
    </div>
  )
}
