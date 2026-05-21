"use client"

import Link from "next/link"
import { useState } from "react"
import { playClick } from "@/lib/click-sound"

interface Project {
  title: string
  category: string
  date: string
  description: string
  href: string
  cover: string
  comingSoon?: boolean
  lightbox?: boolean
  coverNode?: React.ReactNode
  carousel?: string[]
  badge?: string
}

const coverStyle = (hovered: boolean): React.CSSProperties => ({
  width: "100%", height: "100%", objectFit: "cover", display: "block",
  transform: hovered ? "scale(1.02)" : "scale(1)",
  transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
})

const carouselBtnStyle: React.CSSProperties = {
  position: "absolute", top: "50%", transform: "translateY(-50%)",
  width: 28, height: 28, borderRadius: "50%",
  background: "rgba(0,0,0,0.45)", border: "none",
  color: "#fff", cursor: "pointer", zIndex: 2,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 12, backdropFilter: "blur(4px)",
  transition: "background 0.15s ease",
}

function CarouselCover({ videos, hovered }: { videos: string[]; hovered: boolean }) {
  const [active, setActive] = useState(0)

  const prev = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setActive(i => (i - 1 + videos.length) % videos.length) }
  const next = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setActive(i => (i + 1) % videos.length) }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {videos.map((src, i) => (
        <video
          key={src}
          src={src}
          autoPlay={active === i}
          loop
          muted
          playsInline
          preload="metadata"
          style={{
            ...coverStyle(hovered),
            position: i === 0 ? "relative" : "absolute",
            inset: 0,
            opacity: active === i ? 1 : 0,
            transition: "opacity 0.35s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)",
            pointerEvents: active === i ? "auto" : "none",
          }}
        />
      ))}
      <button onClick={prev} className="carousel-btn" style={{ ...carouselBtnStyle, left: 10 }}>‹</button>
      <button onClick={next} className="carousel-btn" style={{ ...carouselBtnStyle, right: 10 }}>›</button>
    </div>
  )
}

function ProjectCard({ project, onLightbox }: { project: Project; onLightbox?: () => void }) {
  const [hovered, setHovered] = useState(false)
  const isVideo = project.cover.endsWith(".mp4") || project.cover.endsWith(".webm")

  const inner = (
    <>
      <div style={{ width: "100%", aspectRatio: "4/3", borderRadius: 10, overflow: "hidden", backgroundColor: "var(--surface)", position: "relative" }}>
        {project.carousel ? (
          <CarouselCover videos={project.carousel} hovered={hovered} />
        ) : project.coverNode ? project.coverNode : isVideo ? (
          <video src={project.cover} autoPlay loop muted playsInline preload="metadata" style={coverStyle(hovered)} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.cover} alt={project.title} draggable={false} style={coverStyle(hovered)} />
        )}
        {project.badge && (
          <div style={{
            position:   "absolute",
            bottom:     12,
            right:      12,
            opacity:    hovered ? 1 : 0,
            transform:  hovered ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
            pointerEvents: "none",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.badge} alt="" style={{ height: 22, width: "auto", display: "block" }} />
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500,
          color: hovered ? "var(--c-mid)" : "var(--c-faint)",
          letterSpacing: "-0.01em", margin: 0, transition: "color 0.2s ease",
        }}>
          {project.title}
        </p>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 400, color: "var(--c-faint)", letterSpacing: "-0.01em", flexShrink: 0 }}>
          {project.date}
        </span>
      </div>
    </>
  )

  if (project.comingSoon) {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: "flex", flexDirection: "column", gap: 10, cursor: "default" }}
      >
        {inner}
      </div>
    )
  }

  if (project.lightbox && onLightbox) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => { playClick(); onLightbox() }}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { playClick(); onLightbox() } }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 10, cursor: "pointer" }}
      >
        {inner}
      </div>
    )
  }

  const isExternal = project.href.startsWith("http")

  return (
    <Link
      href={project.href}
      onClick={() => playClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 10 }}
    >
      {inner}
    </Link>
  )
}

export default function ProjectCards({ projects, onLightbox }: { projects: Project[]; onLightbox?: () => void }) {
  return (
    <div className="rsp-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {projects.map((p, i) => (
        <ProjectCard key={p.href || p.title || i} project={p} onLightbox={p.lightbox ? onLightbox : undefined} />
      ))}
    </div>
  )
}
