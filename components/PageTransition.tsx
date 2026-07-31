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

  // /v2 opens/closes case studies as a sheet on top of one persistent
  // layout, updating the URL via window.history.pushState instead of a
  // real navigation (see V2Layout) specifically so nothing above it
  // re-renders. usePathname() still picks up that URL change, though — so
  // without this carve-out, every open/close changed `pathname`, which
  // changed this component's `key={pathname}` below, which made
  // AnimatePresence unmount and remount this entire subtree (all of
  // V2Layout, every project card, every <video>) on every single
  // open/close. That's what was showing up as the whole right column
  // flickering and videos restarting from 0 instead of resuming.
  //
  // Only bypassed when BOTH sides of the change are under /v2 — moving
  // between /v2 and the rest of the site (e.g. from "/") still gets the
  // normal fade, since that's a real page boundary, not a sheet toggle.
  const wasV2 = prevPathname.current?.startsWith("/v2") ?? false
  const isV2 = pathname.startsWith("/v2")
  if (wasV2 && isV2) return <>{children}</>

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
