import { useEffect, RefObject } from "react"

// Videos are marked autoPlay in JSX for no-JS/SSR correctness, but real playback
// is gated here: only videos within (or near) the viewport actually fetch and
// play. Keeps declarative autoPlay markup while avoiding N simultaneous
// full-quality video downloads on pages with many below-the-fold clips.
export function useLazyVideo(ref: RefObject<HTMLVideoElement | null>, rootMargin = "200px") {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Start paused; the observer takes over as soon as it reports a position.
    el.pause()

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      { rootMargin, threshold: 0.01 }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
}
