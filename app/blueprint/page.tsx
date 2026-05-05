import CaseStudyLayout from "@/components/CaseStudyLayout"

export default function BlueprintProject() {
  return (

    <CaseStudyLayout
      title="Simplifying Donation Tracking at Scale"
      category="Product Design"
      year="2026"
      role="Lead Designer"
      cover="/YUBlueprintHighlight.jpg"
      overview={"Fix the 6ix is a Toronto-based non-profit community that distributes gift cards to people who need them most. But keeping track of those cards has always been a manual process: volunteers submit spreadsheets, coordinators piece together the data, and figuring out what's been used, donated, or sitting idle takes more effort than it should.\n\nReGiftCard is the dashboard built to fix that. It gives the Fix the 6ix team a single place to monitor unused gift cards, follow how each one moves through spending or donation, and spot the gaps before they become problems. Less time wrestling with files, more time focused on the people they're actually trying to help."}
      specs={[
        { label: "Scope",    value: "End-to-end Product Development" },
        { label: "Duration", value: "February 2026 – Now" },
      ]}
      sections={[
        {
          label: "Sneak Peek",
          images: ["/HighlightBlueprint.png", "/HighlightV2.png"],
          videos: ["/VibeAnimationTest.mp4"],
          body: "ReGiftCard is still in development. Here are some sneak peeks at where things are heading.",
        },
      ]}
    />


  )
}
