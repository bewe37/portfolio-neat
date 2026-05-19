"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const CASE_STUDY_PATHS = ["/amd_ai_project", "/amd_project", "/fme_annotation_project", "/blueprint"]

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isCaseStudy = CASE_STUDY_PATHS.some(p => pathname.startsWith(p))

  if (!isCaseStudy) {
    return <div className="page-transition">{children}</div>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
        exit={{    opacity: 0, y: -12, filter: "blur(4px)" }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
