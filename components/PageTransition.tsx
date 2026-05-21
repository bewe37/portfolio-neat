"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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

    // skip on mount
    if (prev === null) return

    const wasCase = isCaseStudyPath(prev)
    const isCase  = isCaseStudyPath(pathname)

    if (wasCase && !isCase) {
      // wait for exit fade then restore dark as new page fades in
      setTimeout(() => {
        document.body.classList.add("theme-switching")
        document.body.classList.add("dark")
        localStorage.setItem("theme", "dark")
        setTimeout(() => document.body.classList.remove("theme-switching"), 500)
      }, 350)
    }
    // no-op for all other transitions — dark mode is already set
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{    opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
