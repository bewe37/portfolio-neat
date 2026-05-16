import CaseStudyLayout from "@/components/CaseStudyLayout"

export default function AmdAiProject() {
  return (

    <CaseStudyLayout
      title="Rethinking the Overlay as a Control Surface"
      category="Product Design"
      year="2025"
      role="Product Design Intern"
      cover="/AMDThumbnailTop.png"
      overview={"In the summer of 2025, I joined AMD as a Product Design Intern contributing to one of the largest redesigns AMD Software had undertaken in recent years. My focus was reworking the Overlay View, a lightweight interface that sits on top of any application, designed for quick, in-session control. At the time, the overlay was limited to displaying system metrics. My role was to evolve it into something users could actually interact with and act on, without ever leaving what they were doing."}
      specs={[
        { label: "Scope",    value: "Feature Design (AI Integration)" },
        { label: "Duration", value: "May – December 2025" },
      ]}
      sections={[]}
      password="amdx"
      passwordDesc="This case study is protected under NDA. If you'd like to learn more about the work, feel free to reach out directly and I'd be happy to walk you through it."
      lockedSections={[
        {
          label: "Highlights",
          title: "A conversational overlay built for real-time control.",
          body:  "AMD Software's overlay sits on top of any game or app, built for quick actions without breaking focus. This is a look at how I redesigned it from a passive metrics display into something users could actually do things with.",
          accordion: true,
          contents: [
            {
              title: "Ask anything, get a fix.",
              body:  "Describe what's wrong in plain language. The AI reads your live hardware data and surfaces a one-tap solution on the spot.",
              videos: ["/DemoAmdChat1.mp4"],
            },
            {
              title: "Your controls, always within reach.",
              body:  "Pin any setting or information directly from the overlay. It stays accessible every session, no navigation required.",
              videos: ["/Pinning.mp4"],
              objectPosition: "left center",
            },
            {
              title: "Built for mid-session.",
              body:  "Recording, graphics tuning, and your most-used settings surface the moment you need them, without ever leaving your game.",
              videos: ["/InGameHighlight.mp4"],
              objectPosition: "left center",
            },
          ],
        },
        {
          label: "Context",
          title: "A new direction for AMD Software.",
          body:  "For a product used by millions of gamers and creators, AMD Software had a problem: it was hard to use. Years of incremental updates had left behind a dense, technically overwhelming interface that frustrated casual and advanced users alike. Rather than patching issues one by one, the team committed to a full-scale redesign, rebuilding the experience around how users actually work. The redesign split the experience into two layers:",
contents: [
            {
              highlight: true,
              title: "Full View",
              body: "The complete configuration layer for deeper settings and context.",
              image: "/full-view-viz.svg",
            },
            {
              highlight: true,
              title: "Overlay View",
              body: "Stays on top of any application for quick, in-session control.",
              image: "/overlay-view-viz.svg",
            },
          ],
          footnote: "This case study covers the In-Session Overlay. The Full Application was developed in parallel by a separate workstream.",
        },
        {
          label: "Problem Space",
          title: "The overlay then and now.",
          body:  "Two versions ago, the overlay gave users direct access to the controls they needed most. Compact, fast, and built around the reality that users don't stop mid-session to dig through a settings panel. Over successive updates, controls were gradually removed in favor of a cleaner, metrics-focused display. By the current version, it had been reduced to a read-only dashboard, useful for monitoring, but no longer a tool for doing.",
          images: ["/OldOverlay.png", "/MetricsIssue.png"],
        },
        {
          label: "Problem Space",
          hideToc: true,
          body:  "To understand the full scope, the team ran moderated usability sessions with 6 users. Two friction points surfaced consistently.",
          contents: [
            {
              title: "Complex navigation.",
              body:  "Users moved through multiple panels before reaching common settings, adding unnecessary steps to actions that should be immediate.",
              image: "/NavigationIssues.png",
            },
            {
              title: "Settings only experts could parse.",
              body:  "This wasn't a new problem. Even the original overlay used terminology that casual users struggled to parse. But as more features moved into the full application, settings became more numerous and granular, making it harder to know what each option did or how it would affect your system without prior technical knowledge.",
              image: "/TechnicalTerms.png",
            },
          ],
        },
        {
          label: "The Goals",
          title: "The overlay needed a new job.",
          body: "The usability sessions made one thing clear: the overlay wasn't just missing features, it was missing its purpose. It's the only part of AMD Software users reach for mid-session, when they need a quick answer or a fast adjustment without breaking focus. Fixing the full application wouldn't solve that. The overlay needed to be rethought on its own terms and two goals shaped the direction:",
          contents: [
            {
              highlight: true,
              body: "Restore the quick controls users lost so they can act without ever leaving the session.",
            },
            {
              highlight: true,
              body: "Use AI to make technical settings accessible, with no prior knowledge required.",
            },
          ],
        },
        {
          label: "Initial Exploration",
          title: "Starting with a familiar pattern.",
          body:  "The first concept introduced a traditional multi-message chatbot within the Overlay View. Users could engage in threaded conversations and refine requests over time. While familiar, the interface quickly became visually dense and required users to manage chat history in a space meant for quick interactions.",
          contents: [
            {
              image:        "/InitialChat.png",
              insightTitle: "The familiar pattern came with a hidden cost.",
              insight:      "The overlay is built for fast, in-session actions. But with AI as the only entry point, every interaction required a conversation as users had to describe actions they could've just tapped.",
            },
          ],
        },
        {
          label: "The Solution",
          title: "Time to rethink.",
          body:  "The overlay needed more than a chatbot. Direct controls had to come back, not as a replacement for AI, but as the foundation that makes it actually useful.",
          contents: [
            {
              highlight: true,
              title: "Contextual Chat",
              body:  "Ask a question, get a direct answer or a one-tap fix. No thread, no history.",
              images: ["/chat.svg"],
            },
            {
              highlight: true,
              title: "Pinned Widgets",
              body:  "Controls you care about stay pinned and instantly accessible every session.",
              images: ["/pinned.svg"],
            },
            {
              highlight: true,
              title: "Manual Discovery",
              body:  "Browse and add controls yourself, no assistant required to get started.",
              images: ["/discover.svg"],
            },
          ],
        },
        {
          label: "Contextual Chat",
          hideToc: true,
          contents: [
            {
              title:  "Describe the problem, get a fix.",
              body:   "Instead of a back-and-forth thread, a single message gets you a direct answer. Just say what you're experiencing and the AI reads your live hardware data, figures out what's actually wrong, and hands you a one-tap fix on the spot.",
              videos: ["/DemoAmdChat1.mp4"],
            },
            {
              title: "Responses you can keep.",
              body:  "Any response from the AI can be pinned directly as a widget. It shows up every time you open the overlay, no need to ask again.",
              videos: ["/Pinning.mp4"],
              objectPosition: "left center",
            },
          ],
        },
        {
          label: "Widgets Panel",
          hideToc: true,
          contents: [
            {
              title: "Pinned controls, always accessible.",
              body:  "I introduced a dedicated widgets panel so pinned controls stay accessible every time the overlay opens. No digging required.",
              image: "/Pinned Widgets.png",
            },
            {
              title:  "Manual widget customization.",
              body:   "Users can also add widgets manually, without going through AI at all. Browse, pick what you need, pin it.",
              videos: ["/ManuallyAddedWidget.mp4"],
            },
          ],
        },
        {
          label: "Overall Structure",
          hideToc: true,
          title: "Layout built around how users scan.",
          body:  "Key system information lives on the right as persistent widgets. The center is reserved for contextual actions, with AMD Chat as the primary entry point. This keeps the layout familiar while making room for everything new.",
          beforeAfter: ["/StructureBefore.png", "/StructureAfter.png"],
        },
        {
          label: "In-Game Mode",
          hideToc: true,
          body: "Gaming sessions move fast. The regular overlay works when you have a moment, but mid-game you need the most common controls immediately accessible, not buried behind a panel. So I designed a dedicated in-game mode built around that reality.",
          contents: [
            {
              title: "Most-used controls, one click away.",
              body:  "Instead of asking the AI to do something or having to navigate the panel, I added a modal that puts the most-reached-for controls and features one click away.",
              image: "/In-Game Widgets.png",
            },
            {
              title:  "Tune performance without touching settings.",
              body:   "Every system is different, and figuring out which settings actually improve your experience takes time most people don't want to spend mid-game. I designed a simplified slider that lets users tune between performance and quality on the fly, without touching a single advanced setting.",
              videos: ["/GraphicOptimization.mp4"],
            },
            {
              title:  "Start recording without leaving the game.",
              body:   "Screen recording is one of the most-used features in AMD Software, but getting to it meant leaving the game entirely. I brought it directly into the in-game mode so users can start capturing with a single tap, right from the overlay.",
              videos: ["/ScreenRecording.mp4"],
            },
          ],
        },
        {
          label: "What's Next",
          title: "Building toward the Full View.",
          body: "With the overlay designs presented to stakeholders and receiving their support, the work didn't stop there. While the engineering team prepared the foundation for the overlay, the design team shifted focus to the Full View, the deeper configuration layer where users manage more complex settings and long-term control. Redesigning it is the natural next step, ensuring the two layers of AMD Software work together as a cohesive experience.",
        },
        {
          label: "Oh, and there's more.",
          hideToc: true,
          title: "The Design System That Kept AMD's Team Aligned",
          href: "/amd_project",
          body: "Another big part of this internship was building the design system from the ground up, the foundation that made the entire redesign possible.",
          image: "/DSHighlight.png",
        },
      ]}
    />
  )
}
