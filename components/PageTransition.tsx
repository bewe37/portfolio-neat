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
  const prevPathname = useRef(pathname)

  useEffect(() => {
    const wasCase = isCaseStudyPath(prevPathname.current)
    const isCase  = isCaseStudyPath(pathname)

    if (wasCase && !isCase) {
      // leaving a case study — restore dark mode with transition
      document.body.classList.add("theme-switching")
      document.body.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setTimeout(() => document.body.classList.remove("theme-switching"), 600)
    } else if (!isCase) {
      // non-case-study navigation — ensure dark mode, no transition needed
      document.body.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }

    prevPathname.current = pathname
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
