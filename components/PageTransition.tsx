"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const CASE_STUDY_PATHS = ["/amd_ai_project", "/amd_project", "/fme_annotation_project", "/blueprint", "/gallery"]

function isCaseStudyPath(p: string) {
  return CASE_STUDY_PATHS.some(cs => p.startsWith(cs))
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prevPathname = useRef<string | null>(null)
  const [prevState, setPrevState] = useState<string | null>(null)

  useEffect(() => {
    const prev = prevPathname.current
    prevPathname.current = pathname
    setPrevState(prev)

    if (prev === null) return
    // Clear gallery bg when leaving (overflow/class handled by gallery page cleanup)
    if (prev === "/gallery") document.body.style.background = ""
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

  // No animation when going to or coming from gallery
  const isGalleryTransition = pathname === "/gallery" || prevState === "/gallery" || prevPathname.current === "/gallery"
  if (isGalleryTransition) return <>{children}</>

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
