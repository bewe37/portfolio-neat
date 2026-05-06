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

function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={project.href}
      onClick={() => playClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 12 }}
    >
      {/* Main cover */}
      <div style={{
        aspectRatio:     featured ? "21/9" : "3/2",
        borderRadius:    10,
        overflow:        "hidden",
        backgroundColor: "var(--surface)",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.cover}
          alt={project.title}
          draggable={false}
          style={{
            width:      "100%",
            height:     "100%",
            objectFit:  "cover",
            display:    "block",
            transform:  hovered ? "scale(1.025)" : "scale(1)",
            transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>

      {/* Secondary image strip */}
      {project.images && project.images.length > 0 && (
        <div style={{
          display:             "grid",
          gridTemplateColumns: `repeat(${project.images.length}, 1fr)`,
          gap:                 6,
        }}>
          {project.images.map((src, i) => (
            <div key={i} style={{
              aspectRatio:     "16/9",
              borderRadius:    6,
              overflow:        "hidden",
              backgroundColor: "var(--surface)",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                draggable={false}
                style={{
                  width:      "100%",
                  height:     "100%",
                  objectFit:  "cover",
                  display:    "block",
                  transform:  hovered ? "scale(1.04)" : "scale(1)",
                  transition: `transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 40}ms`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Meta */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingTop: 2 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <span style={{
            fontFamily:    "var(--font-sans)",
            fontSize:      11,
            fontWeight:    500,
            letterSpacing: "0.07em",
            textTransform: "uppercase" as const,
            color:         "var(--c-faint)",
          }}>
            {project.category}
          </span>
          <span style={{
            fontFamily:    "var(--font-sans)",
            fontSize:      11,
            fontWeight:    400,
            color:         "var(--c-faint)",
            flexShrink:    0,
          }}>
            {project.date}
          </span>
        </div>
        <p style={{
          fontFamily:    "var(--font-sans)",
          fontSize:      featured ? 20 : 15,
          fontWeight:    500,
          color:         hovered ? "var(--c-primary)" : "var(--c-mid)",
          letterSpacing: "-0.025em",
          lineHeight:    1.3,
          margin:        0,
          transition:    "color 0.2s ease",
        }}>
          {project.title}
        </p>
      </div>
    </Link>
  )
}

export default function ProjectCards({ projects }: { projects: Project[] }) {
  const [featured, ...rest] = projects

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
      <ProjectCard project={featured} featured />
      <div className="rsp-stack" style={{
        display:             "grid",
        gridTemplateColumns: "1fr 1fr",
        gap:                 "40px 32px",
      }}>
        {rest.map((p) => (
          <ProjectCard key={p.href} project={p} />
        ))}
      </div>
    </div>
  )
}
