"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  EnvelopeSimple,
  XLogo,
  LinkedinLogo,
} from "@phosphor-icons/react"

type PhosphorIconComponent = React.ComponentType<{
  size?: number
  color?: string
  weight?: "regular" | "bold" | "fill" | "thin" | "light" | "duotone"
}>

interface ContactItem {
  Icon: PhosphorIconComponent
  label: string
  link: string
  newTab: boolean
}

const DEFAULT_ITEMS: ContactItem[] = [
  { Icon: EnvelopeSimple, label: "Email",       link: "mailto:bryanwinata112@gmail.com",       newTab: false },
  { Icon: XLogo,          label: "X / Twitter", link: "https://x.com/gbryanwt",               newTab: true  },
  { Icon: LinkedinLogo,   label: "LinkedIn",    link: "https://www.linkedin.com/in/gbryanw/", newTab: true  },
]

function MenuItem({ item }: { item: ContactItem }) {
  const [hov, setHov] = useState(false)
  const { Icon, label, link, newTab } = item
  const isExternal = !link.startsWith("mailto:")

  return (
    <a
      href={link}
      target={isExternal && newTab ? "_blank" : undefined}
      rel={isExternal && newTab ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 8,
        textDecoration: "none",
        cursor: "pointer",
        backgroundColor: hov ? "var(--hover-bg)" : "transparent",
        transition: "background-color 0.12s ease",
      }}
    >
      <Icon
        size={15}
        weight="regular"
        color={hov ? "rgb(255,107,48)" : "var(--c-dim)"}
      />
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontWeight: 400,
          letterSpacing: "-0.01em",
          color: hov ? "rgb(255,107,48)" : "var(--c-body)",
          transition: "color 0.12s ease",
        }}
      >
        {label}
      </span>
    </a>
  )
}

function CompanionNavBtn() {
  const [hov, setHov] = useState(false)
  const router = useRouter()
  return (
    <button
      onClick={() => router.push("/onboarding?edit=1")}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
        letterSpacing: "-0.01em", color: hov ? "rgb(255,107,48)" : "var(--c-dim)",
        transition: "color 0.15s ease", background: "none", border: "none",
        cursor: "pointer", padding: "4px 0", whiteSpace: "nowrap",
      }}
    >
      My Companion
    </button>
  )
}

export default function HeaderNav({
  aboutLabel = "Resume",
  aboutLink = "https://drive.google.com/file/d/183_FgYoQBjhv5QLawsPr_fUt_K5gf6hi/view",
  contactLabel = "Contact",
  items = DEFAULT_ITEMS,
}: {
  aboutLabel?: string
  aboutLink?: string
  contactLabel?: string
  items?: ContactItem[]
}) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [aboutHov, setAboutHov] = useState(false)
  const [btnHov, setBtnHov]     = useState(false)

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 180)
  }, [])
  const cancelClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null }
  }, [])
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])

  const navTextStyle = (hov: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-sans)",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    color: hov ? "rgb(255,107,48)" : "var(--c-dim)",
    transition: "color 0.15s ease",
    lineHeight: 1.4,
    whiteSpace: "nowrap",
  })

  return (
    <nav style={{ display: "inline-flex", alignItems: "center", gap: 20, position: "relative" }}>
      {/* About */}
      <a
        href={aboutLink}
        onMouseEnter={() => setAboutHov(true)}
        onMouseLeave={() => setAboutHov(false)}
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...navTextStyle(aboutHov), textDecoration: "none", padding: "4px 0" }}
      >
        {aboutLabel}
      </a>

      {/* Contact trigger + dropdown */}
      <span
        style={{ position: "relative", display: "inline-flex" }}
        onMouseEnter={() => { cancelClose(); setOpen(true) }}
        onMouseLeave={scheduleClose}
      >
        <button
          aria-haspopup="menu"
          aria-expanded={open}
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            ...navTextStyle(open || btnHov),
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 0",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {contactLabel}
          <motion.svg
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <path
              d="M2 3.5 L5 6.5 L8 3.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </button>

        <motion.div
          initial={false}
          animate={{ opacity: open ? 1 : 0, y: open ? 0 : -6 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position:      "absolute",
            top:           "calc(100% + 8px)",
            right:         0,
            width:         190,
            zIndex:        99999,
            pointerEvents: open ? "auto" : "none",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--bg)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 5,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {items.map((item, i) => <MenuItem key={i} item={item} />)}
          </div>
        </motion.div>
      </span>

      {/* Companion — desktop only */}
      <span className="rsp-hide-mobile">
        <CompanionNavBtn />
      </span>
    </nav>
  )
}
