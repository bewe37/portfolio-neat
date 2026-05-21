"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

const CASE_STUDY_PATHS = ["/amd_ai_project", "/amd_project", "/fme_annotation_project", "/blueprint"]

function isCaseStudyPath(p: string) {
  return CASE_STUDY_PATHS.some(cs => p.startsWith(cs))
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prevPathname = useRef<string | null>(null)

  useEffect(() => {
    const prev = prevPathname.current
    prevPathname.current = pathname

    if (prev === null) return

    const wasCase = isCaseStudyPath(prev)
    const isCase  = isCaseStudyPath(pathname)

    if (wasCase && !isCase) {
      setTimeout(() => {
        document.body.classList.add("theme-switching")
        document.body.classList.add("dark")
        localStorage.setItem("theme", "dark")
        setTimeout(() => document.body.classList.remove("theme-switching"), 500)
      }, 200)
    }
  }, [pathname])

  return <>{children}</>
}
