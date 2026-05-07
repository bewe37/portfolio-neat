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
  images?: string[]
  comingSoon?: boolean
}

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={project.href}
      onClick={() => playClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 10 }}
    >
      <div style={{
        width: "100%",
        aspectRatio: "4/3",
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "var(--surface)",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.cover}
          alt={project.title}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.02)" : "scale(1)",
            transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          fontWeight: 500,
          color: hovered ? "var(--c-mid)" : "var(--c-faint)",
          letterSpacing: "-0.01em",
          margin: 0,
          transition: "color 0.2s ease",
        }}>
          {project.title}
        </p>
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fontWeight: 400,
          color: "var(--c-faint)",
          letterSpacing: "-0.01em",
          flexShrink: 0,
        }}>
          {project.date}
        </span>
      </div>
    </Link>
  )
}

export default function ProjectCards({ projects }: { projects: Project[] }) {
  return (
    <div className="rsp-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {projects.map((p) => (
        <ProjectCard key={p.href} project={p} />
      ))}
    </div>
  )
}
