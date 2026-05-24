import CaseStudyLayout from "@/components/CaseStudyLayout"

export default function AmdAiProject() {
  return (

    <CaseStudyLayout
      title="Rethinking the Overlay as a Control Surface"
      category="AMD"
      year="2025"
      role="Product Design Intern"
      cover="/AMDThumbnailTop.png"
      overview={"In the summer of 2025, I joined AMD as a Product Design Intern contributing to one of the largest redesigns AMD Software had undertaken in recent years. My focus was reworking the Overlay View, a lightweight interface that sits on top of any application, designed for quick, in-session control. At the time, the overlay was limited to displaying system metrics. My role was to evolve it into something users could actually interact with and act on, without ever leaving what they were doing."}
      specs={[
        { label: "Scope",    value: "Feature Design (AI Integration)" },
        { label: "Duration", value: "May – December 2025" },
      ]}
      sections={[
        {
          label: "Context",
          title: "What is the Overlay?",
          body: "AMD Software ships with every Radeon GPU and gives users control over their system performance, graphics settings, and recording tools. The Overlay is a core part of AMD Software — a lightweight layer that floats on top of any game or application, designed for quick access without ever leaving what you're doing.\n\nOver a few product updates, the overlay had been stripped back to a passive metrics display. Users could see data, but couldn't act on it. My role was to rethink it as an interactive control surface, and to explore how AI could make that experience more accessible without replacing the direct controls users needed most.\n\nThis case study is password protected under NDA. Reach out if you'd like access.",
          image: "/FullOverlayView.png",
        },
      ]}
      password="amdx"
      passwordDesc="This case study is protected under NDA. If you'd like to learn more about the work, feel free to reach out directly and I'd be happy to walk you through it."
      lockedSections={[
        {
          label: "Context",
          title: "A new direction for AMD Software.",
          body:  "In the summer of 2025, I joined AMD as a Product Design Intern contributing to one of the largest redesigns AMD Software had undertaken in recent years. My focus was reworking the Overlay View, a lightweight interface that sits on top of any application, designed for quick, in-session control.",
          image: "/FullOverlayView.png",
          footnote: "This case study covers the In-Session Overlay. The Full Application was developed in parallel by a separate workstream.",
        },
        {
          label: "The Problem",
          title: "A passive display in a product that needed action.",
          body: "The overlay had been reduced to a passive metrics display. To change any setting, users had to leave what they were doing and open the full application, which had its own navigation complexity and usability issues. The result was a product that felt frustrating to use at every level, with no fast path for the actions users needed most.",
          image: "/Frustrating.png",
        },
        {
          label: "Highlights",
          title: "A conversational overlay built for real-time control.",
          body:  "AMD Software's overlay sits on top of any game or app, built for quick actions without breaking focus. This is a look at how I redesigned it from a passive metrics display into something users could actually do things with.",
          accordion: true,
          contents: [
            {
              title: "Ask anything, get a fix. Then pin it.",
              body:  "Describe what's wrong. The AI reads your live hardware data, surfaces a one-tap fix, and lets you pin it straight to your panel.",
              videos: ["/ChatPin.mp4"],
            },
            {
              title: "Your controls, your panel.",
              body:  "Everything you've pinned lives in one place, ready every time you open the overlay.",
              videos: ["/PinnedPanel.mp4"],
              objectPosition: "left center",
            },
            {
              title: "Built for mid-session.",
              body:  "Recording, graphics tuning, and your most-used settings, without ever leaving your game.",
              videos: ["/InGameIntegration.mp4"],
              objectPosition: "left center",
            },
          ],
        },
        {
          label: "Research",
          lineBefore: true,
          title: "The overlay then and now.",
          body:  "Two versions ago, the overlay put controls within reach. Over successive updates, they were stripped out in favor of a cleaner metrics display. By the current version, it had become a read-only dashboard. Useful for monitoring, but no longer a tool for doing.",
          images:      ["/OldOverlay.png", "/MetricsIssue.png"],
          imageLabels: ["Previous overlay with direct controls", "Current version, metrics only"],
        },
        {
          label: "Research",
          hideToc: true,
          title: "Why not just use the full view?",
          body:  "The full application had its own problems. We ran moderated usability sessions with 6 users to understand the scope, and two friction points surfaced consistently.",
          contents: [
            {
              title: "Complex navigation.",
              body:  "Users moved through multiple panels before reaching common settings, adding unnecessary steps to actions that should be immediate.",
              image: "/NavigationIssues.png",
            },
            {
              title: "Settings only experts could parse.",
              body:  "As more features moved into the full application, settings became more numerous and granular. Users struggled to know what each option did or how it would affect their system without prior technical knowledge.",
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
              minimal:   true,
              icon:      "target",
              title:     "Restore direct control.",
              body:      "Bring back the quick controls users lost so they can act without ever leaving the session.",
            },
            {
              highlight: true,
              minimal:   true,
              icon:      "spark",
              title:     "Make settings accessible.",
              body:      "Use AI to surface the right fix in plain language, no technical knowledge required.",
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
              insight:      "Fast actions shouldn't require a conversation. With AI as the only entry point, users had to describe things they could've just tapped.",
            },
          ],
        },
        {
          label: "Design Decision",
          title: "Time to rethink.",
          body:  "The overlay needed more than a chatbot. Direct controls had to come back, not as a replacement for AI, but as the foundation that makes it actually useful.",
          contents: [
            {
              highlight: true,
              minimal:   true,
              title:     "Contextual Chat",
              body:      "Ask a question, get a direct answer or a one-tap fix. No thread, no history.",
              images:    ["/CardChat.png"],
            },
            {
              highlight: true,
              minimal:   true,
              title:     "Pinned Widgets",
              body:      "Controls you care about stay pinned and instantly accessible every session.",
              images:    ["/CardPin.png"],
            },
            {
              highlight: true,
              minimal:   true,
              title:     "Manual Discovery",
              body:      "Browse and add controls yourself, no assistant required to get started.",
              images:    ["/CardManual.png"],
            },
          ],
        },
        {
          label: "Contextual Chat",
          hideToc: true,
          contents: [
            {
              title:  "Not just text. A response built around what you need.",
              body:   "The chat is built around one principle: don't make users think. Describe what's wrong and the AI reads live hardware data to figure out the cause. Depending on what it finds, the response takes one of two forms. If the issue is performance-related, it surfaces the relevant metrics directly in the chat so users can see what's actually happening. If there's a feature that addresses it, the response includes an action button to enable it on the spot. No navigation, no settings hunting.",
              images:      ["/Metrics.png", "/Features.png"],
              imageLabels: ["Hardware metrics response", "Feature suggestion with action"],
            },
          ],
        },
        {
          label: "Pinning",
          hideToc: true,
          contents: [
            {
              title:  "Save the answer, not just the moment.",
              body:   "Every AI response can be pinned directly as a widget. Instead of repeating the same question next session, the control is already there. The chat stays focused on one-off queries while the panel builds up over time into something personal.",
              videos:      ["/ChatPin.mp4"],
              images:      ["/Pinned Widgets.png"],
              imageLabels: ["Pin directly from the chat", "Lives in your panel every session"],
            },
          ],
        },
        {
          label: "Manual Discovery",
          hideToc: true,
          contents: [
            {
              title:  "For users who know what they want.",
              body:   "Not everyone needs the AI to get started. Power users can skip the chat entirely, browse the widget library by category, find the control, and add it directly to their panel.",
              videos: ["/ManuallyAddedWidget.mp4"],
            },
          ],
        },
        {
          label: "In-Game Mode",
          hideToc: true,
          title: "Designed for the pace of play.",
          body: "Gaming sessions move fast. Mid-game, you need the most common controls immediately accessible, not buried behind a panel. So I designed a dedicated in-game mode with a modal exclusive to this context. One click surfaces the most-reached-for controls and features without breaking focus.",
          contents: [
            {
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
          label: "Final Design",
          hideToc: true,
          title: "The full picture.",
          body:  "Two modes, one overlay. The default view gives users a persistent panel of pinned controls and AMD Chat as the primary entry point. The in-game mode builds on that with an additional modal, surfacing the most-reached-for controls one tap away without interrupting the session.",
          tabs: [
            { label: "Default View",  image: "/DefaultView.png" },
            { label: "In-Game View",  image: "/InGameView.png" },
          ],
        },
        {
          label: "Outcome",
          title: "From exploration to direction.",
          body: "The overlay designs were presented to stakeholders and received their support, but the real impact was in how the work reframed the team's thinking.",
          contents: [
            {
              highlight: true,
              minimal:   true,
              icon:      "stack",
              title:     "AI as a layer, not the foundation.",
              body:      "Early explorations positioned AI as the primary interface. The design process made a clearer argument: direct control had to come first, and AI worked best on top of it, not as a replacement.",
            },
            {
              highlight: true,
              minimal:   true,
              icon:      "compass",
              title:     "Navigation became the primary factor.",
              body:      "The thinking carried into the Full View. The question shifted from how do we surface everything through AI to how do we design a system where users always know where they are and can get there without friction.",
            },
          ],
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
