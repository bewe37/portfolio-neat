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
          body:  "In the summer of 2025, I joined AMD as a Product Design Intern on one of the largest redesigns the software had seen in years. My focus was reworking the Overlay View, a lightweight panel that floats above any game or app, designed for quick, in-session control.",
          image: "/FullOverlayView.png",
          footnote: "This case study covers the In-Session Overlay. The Full Application was developed in parallel by a separate workstream.",
        },
        {
          label: "The Problem",
          title: "A passive display in a product that needed action.",
          body:  "The overlay had been reduced to a metrics dashboard. It could show your GPU temperature or frame rate, but it couldn't act on any of it. To change a setting, users had to leave their session entirely and open the full application.",
          images:      ["/MetricsIssue.png"],
          imageLabels: ["Current version, metrics only"],
        },
        {
          label: "Highlights",
          title: "An overlay you can finally act on.",
          body:  "I redesigned the overlay from a passive metrics display into a surface users could actually control, with an AI chat that reads live hardware data, a pinnable widget panel, and a dedicated in-game mode built for the pace of play.",
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
          label: "Usability Sessions",
          tocLabel: "Research",
          dividerBefore: true,
          dividerText: "Research",
          title: "The full application wasn't the answer either.",
          body:  "The overlay alone didn't tell the full story. To understand the depth of the problems the team was dealing with, I ran moderated usability sessions with 6 users, not just to evaluate the overlay, but to map out where the entire software experience was breaking down. Two friction points came up in almost every session.",
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
          label: "Research",
          hideToc: true,
          title: "What this pointed to.",
          body:  "Across almost every session, the same two things kept surfacing: getting to the right control took too long, and once users got there, they didn't have the knowledge to act on it. Those two problems became the focus.",
          hmw:   "How might we give users direct access to the controls they need, and help them understand settings they don't?",
        },
        {
          label: "Design Direction",
          title: "Direct control first, AI second.",
          body:  "The overlay opens over a running game. Attention is already split, and there's no headspace to navigate or parse options. You want to act and get back. That constraint shaped the whole direction: direct controls had to be first-class, something you tap once and you're done, with AI alongside for the moments you don't know what to change. Based on the findings and studying how people actually moved around the software, I proposed three components to the team.",
          contents: [
            {
              highlight: true,
              minimal:   true,
              title:     "Contextual Chat",
              body:      "Describe what's wrong. The AI reads live hardware data and surfaces a plain-language fix or a one-tap action.",
              images:    ["/CardChat.png"],
            },
            {
              highlight: true,
              minimal:   true,
              title:     "Pinned Widgets",
              body:      "Controls you care about stay pinned. No navigation, no hunting, just the things you reach for every session.",
              images:    ["/CardPin.png"],
            },
            {
              highlight: true,
              minimal:   true,
              title:     "Manual Discovery",
              body:      "For users who already know what they want: browse the widget library by category and add controls directly.",
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
              body:   "I built the chat around one principle: don't make users think. Describe what's wrong, and the AI reads live hardware data to find the cause, then surfaces the relevant metrics in the chat or gives you a one-tap action to fix it on the spot. No navigation, no settings hunting.",
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
              body:   "I made every AI response pinnable as a widget. Instead of asking the same question next session, the control is already waiting. The chat stays focused on one-off queries while the panel builds up over time into something personal.",
              videos:      ["/ChatPinVid.mp4"],
            },
          ],
        },
        {
          label: "Manual Discovery",
          hideToc: true,
          contents: [
            {
              title:  "For users who know what they want.",
              body:   "Not everyone needs the AI to get started. I designed a browse path for power users who'd rather skip the chat entirely and search the widget library by category, find the control, and add it directly to the panel.",
              videos: ["/ManuallyPin.mp4"],
            },
          ],
        },
        {
          label: "Notifications",
          hideToc: true,
          contents: [
            {
              title:  "A home for everything the system wants to tell you.",
              body:   "I added a dedicated notification page where system messages, driver updates, and performance warnings collect in one place, each one actionable on the spot, without digging through settings.",
              videos: ["/DedicatedNotif.mp4"],
            },
          ],
        },
        {
          label: "In-Game Mode",
          hideToc: true,
          title: "Designed for the pace of play.",
          body: "Gaming sessions move fast. Mid-game, you need the most common controls immediately, not buried in a panel. I designed a dedicated in-game mode with its own modal, purpose-built for this context. One click surfaces the controls and features users reach for most, without breaking focus.",
          contents: [
            {
              image: "/In-Game Widgets.png",
            },
            {
              title:  "Tune performance without touching settings.",
              body:   "Every system is different, and figuring out which settings actually help takes time most people don't want to spend mid-game. I designed a simplified slider that lets users tune between performance and quality on the fly, without touching a single advanced setting.",
              videos: ["/GraphicOptimization.mp4"],
            },
            {
              title:  "Start recording without leaving the game.",
              body:   "Screen recording is one of AMD Software's most-used features, but getting to it meant leaving the game entirely. I brought it directly into the in-game mode so users can start capturing with a single tap, right from the overlay.",
              videos: ["/RecordInGame.mp4"],
            },
          ],
        },
        {
          label: "Final Design",
          hideToc: true,
          title: "Where it all came together.",
          body:  "Two modes, one overlay. Direct controls, pinned widgets, and AMD Chat live together in a single panel, everything one tap away, without leaving the session.",
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
          body: "The designs earned support to move forward. But the bigger shift wasn't in the product. It was in how the team thought about AI. The process kept coming back to the same point: AI only works when the basics work first. By the end, that framing had stuck.",
          contents: [
            {
              highlight: true,
              minimal:   true,
              icon:      "stack",
              title:     "AI as a layer, not the foundation.",
              body:      "The process made one thing clear: direct control has to come first. AI works best when it sits on top of that, not as a replacement for it.",
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
