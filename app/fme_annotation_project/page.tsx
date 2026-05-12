import CaseStudyLayout from "@/components/CaseStudyLayout"

export default function FmeProject() {
  return (

    <CaseStudyLayout
      title="Reducing Clutter Without Losing Context"
      category="Product Design"
      year="2024"
      role="Product Design Intern"
      cover="/SafeCaseStudyH.png"
      overview={"During my internship at Safe Software, I led the end-to-end redesign of the annotation experience in FME Form, a data integration platform used to build complex spatial workflows.\n\nAnnotations play a key role in helping users document logic, explain decisions, and maintain clarity across workflows. However, as workflows grew in complexity, annotations began to introduce more problems than they solved — cluttering the canvas, reducing readability, and making navigation more difficult."}
      specs={[
        { label: "Team",     value: "4 Members" },
        { label: "Duration", value: "April — September 2025" },
      ]}
      sections={[
        {
          label: "Problem Space",
          contents: [
            {
              title: "No visibility controls.",
              body:  "Annotations were essential for adding context, but created significant visual clutter and reduced workflow readability. Users had no way to control visibility, leading to overloaded canvases.",
              image: "/ProblemSpace2.png",
            },
            {
              title: "Lack of customizability & details.",
              body:  "Summary annotations don't go deep enough. They describe what an object does, but not why it's configured a certain way. Users end up writing their own custom annotations just to fill in the gaps, adding friction to an already complex workflow.",
              image: "/ProblemSpace1.png",
            },
          ],
        },
        {
          label: "User Research",
          title: "Understanding what users actually want.",
          body:  "To validate our hypothesis, we pulled feedback from the FME Community platform and conducted user interviews. A recurring theme emerged: users wanted annotations to be collapsible and available directly inside the parameter dialog, so context stays visible exactly where configuration decisions are made.\n\nWe also found users tucking annotations into bookmarks just to collapse and hide them; a workaround that kept things tidier but added friction and stripped away context.",
          image: "/WhatUserSaid.png",
          videos: ["/Workaround.mp4"],
        },
        {
          label: "Project Direction",
          title: "Creating a more comprehensive annotations.",
          body:  "Following our hypothesis on the problem space, the team identified two potential solutions.",
          contents: [
            {
              highlight: true,
              title: "01",
              body: "Dynamic Visibility — allow users to toggle annotations between expanded and minimized states directly on the canvas.",
            },
            {
              highlight: true,
              title: "02",
              body: "Annotation in Parameter Dialog — embed notes within parameter editor dialogs where configuration decisions are made.",
            },
          ],
        },
        {
          label: "Solution — Annotation Visibility",
          contents: [
            {
              title:  "Right click menu as access point.",
              body:   "We introduced collapsible annotations to reduce visual clutter while preserving access to context. Annotations can be minimized into an icon on the object header, with controls available via right-click and the toolbar for flexible interaction.",
              videos: ["/visibilityannotation.mp4"],
            },
            {
              title: "Side window as annotation container.",
              body:  "When annotations are hidden, they needed somewhere logical to go. I grouped them under a single container, keeping the canvas clean while making sure users could still navigate between them quickly without losing context.",
              image: "/AnnotationContainer.png",
            },
          ],
        },
        {
          label: "Solution — Parameter Dialog",
          contents: [
            {
              title:  "Adding in-line annotation.",
              body:   "Users were constantly switching between the canvas and parameter dialogs to reference their notes. To solve this, I brought annotations directly into the dialog, so context lives right where decisions are being made.",
              videos: ["/safedialogannotation.mp4"],
            },
            {
              title: "Multi-level visibility.",
              body:  "Annotations are accessible across the canvas, and navigator levels, so users can always find context no matter where they're working in a complex workflow.",
              images: ["/AnnotationCanvas.png", "/AnnotationNavigator.png"],
            },
          ],
        },
        {
          label: "Shipping",
          title: "What made it to release and what didn't.",
          body:  "The annotation in the parameter dialog has been released and is now available to users. However, the annotation visibility feature is on hold due to capacity constraints, though it has been prioritized for future development and remains on the Product Planning page.\n\nThe enhanced annotation feature reduced visible canvas clutter by 57%, improving how users navigated and read complex workflows. More importantly, users gained meaningful control — for the first time, they could collapse and show annotations on demand, rather than managing a canvas that worked against them.",
          image: "/linkedInComments.png",
        },
      ]}
    />


  )
}
