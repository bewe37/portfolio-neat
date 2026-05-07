"use client"

import { usePathname } from "next/navigation"
import HeaderNav from "@/components/HeaderNav"
import ThemeToggle from "@/components/ThemeToggle"
import MobileMenu from "@/components/MobileMenu"

const CASE_STUDY_PATHS = ["/amd_ai_project", "/amd_project", "/fme_annotation_project", "/blueprint"]

export default function SharedNav() {
  const pathname = usePathname()
  const isCaseStudy = CASE_STUDY_PATHS.some(p => pathname.startsWith(p))

  if (isCaseStudy) return null

  return (
    <div
      className="rsp-hero-row rsp-px"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 48px 0",
        position: "static",
      }}
    >
      <span className="rsp-hide-mobile" style={{ display: "inline-flex", alignItems: "center", gap: 20 }}>
        <HeaderNav />
        <ThemeToggle />
      </span>
      <MobileMenu />
    </div>
  )
}
