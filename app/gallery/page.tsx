import dynamic from "next/dynamic"

const GalleryCanvas = dynamic(
  () => import("@/components/InfiniteGallery").then(m => m.GalleryCanvas),
  { ssr: false }
)

export default function GalleryPage() {
  return (
    <>
      {/* Set bg instantly before hydration to prevent white flash */}
      <script dangerouslySetInnerHTML={{ __html: `document.body.style.background='rgb(22,22,22)';document.body.style.overflow='hidden'` }} />
      <div style={{ width: "100vw", height: "100dvh", overflow: "hidden", background: "rgb(22,22,22)" }}>
        <GalleryCanvas fullPage showFilters showClose />
      </div>
    </>
  )
}
