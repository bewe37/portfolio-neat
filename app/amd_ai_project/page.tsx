import CaseStudyLayout from "@/components/CaseStudyLayout"

export default function AmdAiProject() {
  return (
    <CaseStudyLayout
      title="Conversational AI for AMD Adrenalin"
      category="Product Design"
      year="2025"
      role="Product Design Intern"
      cover="/AMDThumbnail.png"
      overview={"In the summer of 2025, I joined AMD as a Product Design Intern contributing to one of the largest redesigns AMD Software had undertaken in recent years. My focus was reworking the Overlay View, a lightweight interface that sits on top of any application, designed for quick, in-session control. At the time, the overlay was limited to displaying system metrics. My role was to evolve it into something users could interact with and act through, without leaving whatever they were doing."}
      specs={[
        { label: "Scope",    value: "Feature Design — Conversational AI" },
        { label: "Duration", value: "May – December 2025" },
      ]}
      sections={[]}
      password="amdx"
      passwordDesc="This case study is protected under NDA. If you'd like to learn more about the work, feel free to reach out directly and I'd be happy to walk you through it."
      lockedSections={[
        {
          label: "Highlights",
          title: "A conversational overlay built for real-time control.",
          accordion: true,
          contents: [
            {
              title: "AMD Chat",
              body:  "Describe what's wrong in plain language — \"my game is stuttering,\" \"fan is too loud\" — and the AI surfaces a one-tap fix backed by your live hardware data.",
              videos: ["/Convai.mp4"],
            },
            {
              title: "In-Game Mode",
              body:  "Most-used controls surface immediately when you enter a game. No navigation, no hunting — the overlay adapts to what you need mid-session.",
              videos: ["/Recording.mp4"],
              objectPosition: "left center",
            },
            {
              title: "Visual Components",
              body:  "A shared component system built to keep the overlay consistent and extensible as new features ship across the AMD Software redesign.",
              image: "/DSHighlight.png",
            },
          ],
        },
        {
          label: "Context",
          title: "The overlay used to do more.",
          body:  "Two versions ago, the overlay let users act without leaving their session — compact, fast, and built for mid-game use. Over major updates, it got stripped back to metrics only. Everything else moved into the full application.",
          image: "/OldOverlay.png",
        },
        {
          label: "Problem Space",
          contents: [
            {
              title: "Read-only metrics, no controls.",
              body:  "The overlay became a dashboard you could only look at. Any change meant exiting, opening the full app, and navigating to the right panel — enough friction that most users just didn't bother.",
              image: "/MetricsIssues.png",
            },
            {
              title: "Settings only experts could parse.",
              body:  "As more features moved into the full application, the terminology got increasingly technical. Casual users had no way to know what a setting did or how it'd affect their system.",
              image: "/Technical.png",
            },
          ],
        },
        {
          label: "The Goals",
          title: "Redefining what the overlay should do.",
          body: "The overlay had lost its purpose as an action surface. Two goals shaped the redesign direction.",
          contents: [
            {
              highlight: true,
              title: "01",
              body: "Restore the quick controls users lost — let them act on their system without ever leaving the session.",
            },
            {
              highlight: true,
              title: "02",
              body: "Use AI to make technical settings approachable through plain language, no prior knowledge required.",
            },
          ],
        },
        {
          label: "Initial Exploration",
          title: "Starting with a familiar pattern.",
          body:  "The first concept was a traditional multi-message chatbot inside the overlay. Familiar, but it quickly became visually dense — chat history management in a space built for quick, in-session interactions.",
          image: "/InitialChat.png",
          contents: [
            {
              highlight: true,
              title: "Key Insight",
              body:  "A threaded chat adds cognitive load and slows the path from question to action. The overlay needed something faster.",
            },
          ],
        },
        {
          label: "Rethinking the Interaction Model",
          contents: [
            {
              title:  "Describe the problem, get a fix.",
              body:   "Type or say what's wrong — \"my game is stuttering,\" \"fan is too loud\" — and the AI reads your live hardware data and hands you a one-tap fix on the spot.",
              videos: ["/Convai.mp4"],
            },
            {
              title:  "Responses that become controls.",
              body:   "Instead of just text, the assistant can generate a pinnable widget — turning a recommendation into a persistent, actionable control right inside the overlay.",
              videos: ["/Conversational.mp4"],
            },
          ],
        },
        {
          label: "Widgets Panel",
          contents: [
            {
              title: "Pinned controls, always accessible.",
              body:  "Pinned widgets persist across overlay sessions — key controls stay visible without interrupting what you're doing.",
              image: "/PinnedWidgets.png",
            },
            {
              title:  "Manual widget customization.",
              body:   "Users can also add widgets themselves, tailoring the overlay to their needs beyond what the AI suggests.",
              videos: ["/AddWidget.mp4"],
            },
          ],
        },
        {
          label: "Overall Structure",
          title: "Layout built around how users scan.",
          body:  "System info stays right, consistent with the existing overlay. The center is the action space — AMD Chat at the core, widgets panel alongside it.",
          images: ["/StructureDiagram.png", "/StructureAfter.png"],
        },
        {
          label: "In-Game Mode",
          contents: [
            {
              title: "Most-used controls, one click away.",
              body:  "Gamers act, they don't browse. The in-game modal surfaces the most-reached-for controls immediately — no navigation needed.",
              image: "/InGameModal.png",
            },
            {
              title:  "Tune performance without touching settings.",
              body:   "A single slider adjusts the right combination of graphics settings for your system — no manual parameter tweaking.",
              videos: ["/InGame.mp4"],
            },
            {
              title:  "Start recording without leaving the game.",
              body:   "Screen recording triggers directly from AMD Chat or a keyboard shortcut — no need to open the full application.",
              videos: ["/Recording.mp4"],
            },
          ],
        },
        {
          label: "The Bigger Picture",
          title: "Building toward the Full View.",
          body:  "While engineering built the overlay foundation, the design team extended the work into the Full View — the space for deeper configuration. The goal: make complex settings understandable and explorable, not just accessible.",
        },
      ]}
    />
  )
}
