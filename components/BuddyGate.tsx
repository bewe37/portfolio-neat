"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import SpriteBuddy from "@/components/SpriteBuddy"

export default function BuddyGate() {
  const router   = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (pathname === "/onboarding") {
      setReady(true)
      return
    }
    const saved = localStorage.getItem("buddyId")
    if (!saved) {
      router.replace("/onboarding")
      // keep overlay blocking until onboarding mounts
    } else {
      setReady(true)
    }
  }, [pathname, router])

  return (
    <>
      {!ready && (
        <div style={{
          position:   "fixed",
          inset:      0,
          background: "#18181b",
          zIndex:     9999,
          pointerEvents: "none",
        }} />
      )}
      <div className="rsp-hide-mobile">
        <SpriteBuddy />
      </div>
    </>
  )
}
