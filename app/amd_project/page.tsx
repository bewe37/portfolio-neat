import CaseStudyLayout from "@/components/CaseStudyLayout"

export default function AmdProject() {
  return (
    <CaseStudyLayout
      title="The Design System That Kept AMD's Team Aligned"
      category="Design System"
      year="2025"
      role="Design System Designer"
      cover="/AMDCaseStudy.png"
      overview={"When I joined AMD's UX team, the product didn't have a shared design foundation. Designers organized files differently, colors were applied inconsistently, and components varied from screen to screen. The team was also preparing for a full software redesign, which meant the inconsistency wasn't just a current problem. It was about to be a much bigger one. I took on building the design system from the ground up, not as a cleanup effort, but as the structural layer the redesign would be built on top of."}
      specs={[
        { label: "Scope",    value: "Design System" },
        { label: "Duration", value: "May – December 2025" },
      ]}
      sections={[
        {
          label: "Goals",
          title: "What the system needed to do.",
          body: "With a clear direction established, I outlined three goals the design system would need to support:",
          contents: [
            {
              highlight: true,
              title: "A consistent design foundation.",
              body: "Standardize components and bring visual consistency across the product.",
            },
            {
              highlight: true,
              title: "Faster design-to-dev handover.",
              body: "Reduce back-and-forth with a shared system both sides can reference.",
            },
            {
              highlight: true,
              title: "Built to scale.",
              body: "Support the upcoming redesign without needing to be rebuilt from scratch.",
            },
          ],
        },
        {
          label: "Audit",
          title: "Identifying the problems",
          images: ["/colorMismatch.png", "/inconsistentStyling.png"],
          body:   "Two problems showed up immediately. Colors were applied inconsistently across teams, creating unclear states and a broken visual hierarchy. Component styling had the same issue. Buttons alone varied across screens in size, corner radius, spacing, and interaction states. The product had grown without any visual governance, and with a full redesign on the horizon, these problems were about to get a lot harder to fix.",
        },
        {
          label: "Design Foundation",
          contents: [
            {
              image: "/primitiveTokens.png",
              title: "A better color foundation.",
              body:  "I defined primitive tokens as the raw color palette and mapped them to semantic tokens applied across components. Components reference intent-driven values instead of hardcoded hex codes, so a single update propagates everywhere it matters.",
            },
            {
              image: "/Tokens1.png",
              body:   "Once the primitives were set, I mapped them to semantic tokens named by purpose or state. Components always reference role-based values, which made global updates straightforward and kept the system from drifting as it grew.",
            },
            {
              image: "/radius_spacingtokens.png",
              title: "A spacing and radius token system.",
              body:  "I introduced numeric tokens for spacing and radius built on a 4-point scale. Layout decisions became consistent across the board, and adjustments no longer required guesswork.",
            },
            {
              image: "/TextStyling.png",
              title: "A unified typography scale.",
              body:  "Text styling was scattered across files with no shared structure. I consolidated everything into a single scale with clear header and body levels, so type decisions were predictable and easy to apply consistently.",
            },
          ],
        },
        {
          label: "Component Library",
          contents: [
            {
              image:  "/ComponentAnatomy.png",
              title:  "Identifying common components.",
              body:   "As we explored different design styles, I started building the foundational components of the design system, beginning with essentials like buttons and the navigation bar.",
            },
            {
              image:  "/CommonComponents.png",
              title:  "Dissecting the designs.",
              body:   "As the project progressed and designs began receiving approval from stakeholders, I gradually expanded the design system to include additional UI patterns and refined them further. Complex UI components often need to be further broken down to improve flexibility and maintainability.",
            },
            {
              image:  "/ApplyFoundationalDesignTokens.png",
              title:  "Applying foundational design tokens.",
              body:   "Foundational design tokens define core properties such as spacing, radius, and typography. As the system matured, I progressively defined the rules behind each token — for example, which radius value belongs to which level of nesting, and how spacing scales across component sizes. By applying these tokens consistently, updates became easier to make at scale without breaking visual harmony across the product.",
            },
            {
              image:  "/ColorStructure.png",
              title:  "Applying proper color structure.",
              body:   "With the help of pre-defined color tokens, I could easily assign colors to components according to their semantic role.",
            },
            {
              image: "/Slots.jpg",
              title: "Supporting multiple variants.",
              body:  "Instead of creating endless variants that would complicate the system, I chose to use the slot method. By treating slots as flexible placeholders, I gave the components room to adapt their content while still maintaining a consistent and polished appearance.",
            },
          ],
        },
        {
          label: "Documentation",
          title: "Closing the gap between design and development.",
          images: ["/guides.png", "/DesignGuides.png"],
          body:   "Wrote usage and behavior guidelines for each component. The goal was simple: designers and developers shouldn't have to chase each other down to figure out how something is supposed to work.",
        },
        {
          label: "Outcome",
          title: "Built it. Then got the team to actually use it.",
          images: ["/DesignSystemImpact.png", "/DesignSpecs.png"],
          body:   "By the end of the internship, the team had a working system they could actually build with. Updates propagated cleanly across mockups, designers stopped guessing at spacing values, and the redesign had a consistent foundation to grow from.\n\nBeyond building the system, I took on getting the team to actually use it. That meant running walkthroughs, answering questions during handoff, and making sure designers felt confident reaching for the system instead of going off on their own. Adoption was the real measure of whether the work landed.",
        },
        {
          label: "Oh, and there's more.",
          title: "Rethinking the Overlay as a Control Surface",
          href: "/amd_ai_project",
          body: "The design system was built to support this major redesign initiative! A full redesign of the AMD Software overlay, turning a read-only metrics display into something users could actually act on.",
          image: "/DSHighlight.png",
        },
      ]}
    />


  )
}
