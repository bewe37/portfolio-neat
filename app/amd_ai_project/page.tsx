import CaseStudyLayout from "@/components/CaseStudyLayout"

export default function AmdAiProject() {
  return (

    <CaseStudyLayout
      title="Rethinking the Overlay as a Control Surface"
      category="AMD"
      year="2025"
      role="Product Design Intern"
      cover="/AMDThumbnailTop.png"
      overview={""}
      specs={[
        { label: "Scope",    value: "Feature Design (AI Integration)" },
        { label: "Duration", value: "May – December 2025" },
      ]}
      sections={[
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
          body: "The overlay had been reduced to a passive metrics display. To change any setting, users had to leave what they were doing and open the full application. There was no fast path for the actions users needed most, and as the research below shows, the full application was no refuge either.",
          image: "/Frustrating.png",
        },
        {
          label: "Highlights",
          title: "An overlay you can finally act on.",
          body:  "AMD Software's overlay sits on top of any game or app, built for quick actions without breaking focus. This is a look at how I redesigned it from a passive metrics display into something users could actually do things with.",
          accordion: true,
          contents: [
            {
              title: "Ask anything, get a fix. Then pin it.",
              body:  "Describe what's wrong. The AI reads your live hardware data, surfaces a one-tap fix, and lets you pin it straight to your panel.",
              videos: ["/ChatDemoTop.mp4"],
            },
            {
              title: "Your controls, your panel.",
              body:  "Everything you've pinned lives in one place, ready every time you open the overlay.",
              videos: ["/CollapsePanel.mp4"],
              objectPosition: "left center",
            },
            {
              title: "Built for mid-session.",
              body:  "Recording, graphics tuning, and your most-used settings, without ever leaving your game.",
              videos: ["/InGameDemoTop.mp4"],
              objectPosition: "left center",
            },
          ],
        },
        {
          label: "Research",
          lineBefore: true,
          title: "From control panel to read-only dashboard.",
          body:  "Two versions ago, the overlay was a control panel. You could adjust settings, toggle features, and act on your system without leaving your game. Update by update, those controls were trimmed away in favor of a cleaner metrics display, until every interactive element was gone. What remained was read-only: it could show your GPU temperature or frame rate, but not let you do anything about them. The overlay had quietly shifted from a tool for doing into a screen for watching.",
          images:      ["/OldOverlay.png", "/MetricsIssue.png"],
          imageLabels: ["Previous overlay with direct controls", "Current version, metrics only"],
        },
        {
          label: "Usability Sessions",
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
          body: "The usability sessions made one thing clear: the overlay wasn't missing features, it was missing its purpose. It's the only part of AMD Software users reach for mid-session, when they need a quick answer or fast adjustment without breaking focus. Fixing the full application wouldn't solve that, so the overlay needed to be rethought on its own terms. Two goals shaped the direction:",
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
          body:  "The first concept introduced a traditional multi-message chatbot within the Overlay View. Users could engage in threaded conversations and refine requests over time. It was the obvious answer, and I built it out before taking it to the team.",
          contents: [
            {
              image:        "/InitialChat.png",
              insightTitle: "The familiar pattern came with a hidden cost.",
              insight:      "Critique surfaced the flaw: enabling anti-lag meant typing a sentence when a toggle would have been one tap. Fast actions shouldn't require a conversation, so I dropped the thread model and started over.",
            },
          ],
        },
        {
          label: "Design Decisions",
          title: "Direct control first, AI second.",
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
              body:   "I built the chat on one principle: don't make users think. Describe what's wrong, and the AI reads live hardware data to find the cause, then either surfaces the relevant metrics in the chat or gives you an action button to fix it on the spot. No navigation, no settings hunting.",
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
              body:   "I made every AI response pinnable as a widget. Instead of repeating the same question next session, the control is already there. The chat stays focused on one-off queries while the panel builds up over time into something personal.",
              videos:      ["/ChatPin.mp4"],
            },
          ],
        },
        {
          label: "Notifications",
          hideToc: true,
          contents: [
            {
              title:  "A home for everything the system wants to tell you.",
              body:   "A dedicated notification page where system messages, driver updates, and performance warnings collect in one place, each one actionable on the spot.",
              videos: ["/DedicatedNotif.mp4"],
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
              videos: ["/AddManual.mp4"],
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
              videos: ["/RecordInGame.mp4"],
            },
          ],
        },
        {
          label: "Final Design",
          hideToc: true,
          title: "Where it all came together.",
          body:  "Two modes, one overlay. Direct controls, pinned widgets, and AMD Chat live together in a single panel, with everything one tap away without leaving the session.",
          chapterVideo: {
            src: "/FinalVid.mp4",
            chapters: [
              { time:  0,  label: "Graphic Optimization" },
              { time:  5,  label: "Screen Recording"     },
              { time: 13,  label: "Chat Interaction"     },
              { time: 22,  label: "Pinning"              },
              { time: 25,  label: "Manually Add Widget"  },
            ],
          },
        },
        {
          label: "Outcome",
          title: "From exploration to direction.",
          body: "The designs earned support to move forward, but the bigger win was changing how the team saw AI: not a differentiator on its own, but something that only works when the basics work first.",
          contents: [
            {
              highlight: true,
              minimal:   true,
              icon:      "stack",
              title:     "AI as a layer, not the foundation.",
              body:      "Early explorations put AI first. The process made a clearer case: direct control comes first, with AI layered on top, not as a replacement.",
            },
            {
              highlight: true,
              minimal:   true,
              icon:      "compass",
              title:     "Navigation became the primary factor.",
              body:      "That thinking carried into the Full View, shifting the question from surfacing everything through AI to helping users always know where they are.",
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
