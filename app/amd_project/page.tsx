import CaseStudyLayout from "@/components/CaseStudyLayout"

export default function AmdProject() {
  return (
    <CaseStudyLayout
      title="The Design System That Kept AMD's Team Aligned"
      category="Design System"
      year="2025"
      role="Design System Designer"
      cover="/AMDCaseStudy.png"
      overview={"When I joined AMD's UX team, the product didn't have a shared design foundation.\n\nDesigners organized files differently, colors were applied inconsistently, and components varied from screen to screen. The team was also preparing for a full software redesign — which meant the inconsistency wasn't just a current problem, it was about to be a much bigger one.\n\nI took on building the design system from the ground up: not as a cleanup effort, but as the structural layer the redesign would be built on top of."}
      specs={[
        { label: "Scope",    value: "Design System" },
        { label: "Duration", value: "May – December 2025" },
      ]}
      sections={[
        {
          label: "High-Level Audit",
          title: "Identifying the problems",
          images: ["/colorMismatch.png", "/inconsistentStyling.png"],
          body:   "Before diving into any design system work, I conducted an audit and found two major issues. Colors were applied inconsistently across teams, leading to unclear states and a broken visual hierarchy. Component styling had the same problem — buttons alone varied across screens in size, corner radius, spacing, and interaction states, revealing a product that had grown without any visual governance.",
        },
        {
          label: "Design Foundation",
          contents: [
            {
              image: "/primitiveTokens.png",
              title: "The push for a better color foundation.",
              body:  "To keep the design system flexible, I defined primitive tokens as the base color palette and used semantic tokens to apply those colors throughout the components. This allowed components to rely on intent-driven values rather than fixed hex codes.",
            },
            {
              images: ["/Tokens1.png", "/ColorStructure.png"],
              body:   "Once the primitives were set, I mapped them to semantic tokens named by purpose or state. This ensured components always referenced meaningful, role-based tokens, which made updates much smoother and more consistent.",
            },
            {
              image: "/radius_spacingtokens.png",
              title: "A proper spacing & radius token system.",
              body:  "To bring consistency to layouts, I introduced numeric tokens for spacing and radius based on a structured 4-point scale. By defining a predictable set of spacing and radius tokens, layout decisions became clearer and adjustments were safer to make.",
            },
            {
              image: "/TextStyling.png",
              title: "Streamlined text styling.",
              body:  "I simplified the text-styling by consolidating everything into a single, structured typography scale with clear header and body levels.",
            },
          ],
        },
        {
          label: "Component Library",
          contents: [
            {
              images: ["/ComponentAnatomy.png", "/CommonComponents.png"],
              title:  "Dissecting the designs.",
              body:   "Before building anything, I went through the approved designs and identified the foundational elements that appeared repeatedly — buttons, inputs, tags, toggles. Recognizing these common components early meant I could establish a shared base layer rather than designing each screen in isolation.",
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
          title: "Reducing communication gaps between designers and developers.",
          images: ["/guides.png", "/DesignGuides.png"],
          body:   "Wrote usage and behavior guidelines for each component. The goal was simple: designers and developers shouldn't have to chase each other down to figure out how something is supposed to work.",
        },
        {
          label: "Outcome",
          title: "Consistent & maintainable mockups.",
          images: ["/DesignSystemImpact.png", "/DesignSpecs.png"],
          body:   "By the end of the internship, the team had a working system they could actually build with. Updates propagated cleanly across mockups, designers stopped guessing at spacing values, and the redesign had a consistent foundation to grow from.",
        },
        {
          label: "How It Comes Together",
          title: "The vibeeee ~",
          images: ["/DSHighlight.png"],
          body:   "Even as the overlay introduces new features, the design system keeps everything consistent and connected. Shared components and patterns make the interface feel cohesive, so the overlay stays lightweight and easy to navigate without adding visual noise.",
        },
      ]}
    />
  )
}
