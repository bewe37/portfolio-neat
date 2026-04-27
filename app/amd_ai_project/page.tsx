import CaseStudyLayout from "@/components/CaseStudyLayout"

export default function AmdAiProject() {
  return (
    <CaseStudyLayout
      title="Rethinking the Overlay as a Control Surface"
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
              videos: ["/DemoAmdNew.mp4"],
            },
            {
              title: "In-Game Mode",
              body:  "Most-used controls surface immediately when you enter a game. No navigation, no hunting — the overlay adapts to what you need mid-session.",
              videos: ["/DemoRecording.mp4"],
              objectPosition: "left center",
            },
            {
              title: "One-Click Tuning",
              body:  "A single slider adjusts the right combination of graphics settings for your system — no manual parameter tweaking required.",
              videos: ["/DemoOneClick.mp4"],
              objectPosition: "left center",
            },
          ],
        },
        {
          label: "Context",
          title: "The overlay used to do more.",
          body:  "Two versions ago, the AMD Software overlay gave users direct access to the controls they needed most, all without leaving their session. It was compact and fast, built around the reality that users don't stop mid-game to dig through a settings panel. Over major updates, that got stripped back to metrics only, and everything else moved into the full application.",
          image: "/OldOverlay.png",
        },
        {
          label: "Problem Space",
          contents: [
            {
              title: "Read-only metrics, no controls.",
              body:  "What replaced it was an overlay stripped down to just displaying system information. Useful to glance at, but nothing more. Any actual change still meant closing the overlay, opening the full application, and navigating through panels to find the right setting. For users mid-session, that's enough friction to just not bother.",
              image: "/MetricsIssue.png",
            },
            {
              title: "Settings only experts could parse.",
              body:  "This wasn't a new problem. Even the original overlay used terminology that casual users struggled to parse. But as more features moved into the full application, settings became more numerous and granular, making it harder to know what each option did or how it would affect your system without prior technical knowledge.",
              image: "/Problem Space 4.png",
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
          body:  "The first concept introduced a traditional multi-message chatbot within the Overlay View. Users could engage in threaded conversations and refine requests over time. While familiar, the interface quickly became visually dense and required users to manage chat history in a space meant for quick interactions.",
          contents: [
            {
              image: "/InitialChat.png",
              title: "Key Insight",
              note:  "A threaded chat adds cognitive load and slows the path from question to action. The overlay needed something faster.",
            },
          ],
        },
        {
          label: "Rethinking the Interaction Model",
          contents: [
            {
              title:  "Describe the problem, get a fix.",
              body:   "Instead of continuing a thread, responses can transform into pinnable widgets, allowing users to take immediate action. Just type or say what you're experiencing, like \"my game is stuttering\" or \"my fan is too loud,\" and the AI reads your live hardware data, figures out what's actually wrong, and hands you a one-tap fix on the spot. ",
              videos: ["/DemoAmdChat.mp4"],
            },
            {
              title:  "Responses that become controls.",
              body:   "I designed the assistant to adapt its responses based on user intent. For explanations or recommendations, it provides concise text outputs. When a user requests a specific feature, the assistant generates a pinnable widget instead, turning guidance into an actionable and persistent control within the Overlay View.",
              videos: ["/DemoPinning.mp4"],
            },
          ],
        },
        {
          label: "Widgets Panel",
          contents: [
            {
              title: "Pinned controls, always accessible.",
              body:  "To support the pinning interaction, I introduced a dedicated widgets panel within the overlay. This panel allows pinned controls to remain persistently accessible each time the overlay is opened, ensuring important information and actions are available without interrupting the overall experience.",
              image: "/Pinned Widgets.png",
            },
            {
              title:  "Manual widget customization.",
              body:   "Beyond pinning chat outputs, I designed the overlay to let users add widgets manually, giving them the flexibility to tailor the experience to their own needs rather than relying only on AI suggestions.",
              videos: ["/ManualAddition.mp4"],
            },
          ],
        },
        {
          label: "Overall Structure",
          title: "Layout built around how users scan.",
          body:  "To preserve familiar scanning patterns and maintain consistency with the current overlay layout, I kept key system information on the right, where pinnable widgets live as persistent controls. The center becomes the space for contextual actions, with AMD Chat serving as the primary interaction point.",
          images: ["/StructureBefore.png", "/StructureAfter.png"],
        },
        {
          label: "In-Game Mode",
          contents: [
            {
              title: "Most-used controls, one click away.",
              body:  "Most gamers don't stop to think mid-session, they act. So instead of asking the AI to do something, we added  a modal that puts the most-reached-for controls & features one click away.",
              image: "/InGameWidget.png",
            },
            {
              title:  "Tune performance without touching settings.",
              body:   "While the software offers powerful configuration options, users often struggle to determine which settings actually improve performance for their specific system during gameplay. To address this, I initiated the idea of an in game widget with simplified slider controls, enabling quick performance adjustments without manually tweaking multiple parameters.",
              videos: ["/DemoOneClick.mp4"],
            },
            {
              title:  "Start recording without leaving the game.",
              body:   "The in-game mode prioritizes high-usage features like screen recording, allowing users to start capturing directly through AMD Chat or a keyboard shortcut without navigating the full application.",
              videos: ["/DemoRecording.mp4"],
            },
          ],
        },
        {
          label: "The Bigger Picture",
          title: "Building toward the Full View.",
          body:  "While the engineering team prepared the back-end foundation for the overlay view, the design team continued developing concepts for the Full View. The Full View remains essential for deeper configuration and long-term control. Redesigning it ensures users can clearly understand, explore, and manage more complex settings, making it a critical foundation for the overall AMD Software experience.",
          image: "/In-Progress.png",
        },
      ]}
    />
  )
}
