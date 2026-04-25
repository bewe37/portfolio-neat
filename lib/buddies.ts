export type AnimDef = { row: number; frames: number; fps: number }

export type BuddyDef = {
  id:       string
  name:     string
  tagline:  string
  traits:   [string, string]
  src:      string        // URL-encoded path
  tileW:    number
  tileH:    number
  sheetW:   number        // full sprite sheet pixel width
  sheetH:   number        // full sprite sheet pixel height
  anims:    Record<string, AnimDef>
  idleAnim: string
  hoverAnim: string
  pool:     string[]      // weighted behaviour pool for idle wandering
}

export const BUDDIES: BuddyDef[] = [
  {
    id:        "fox",
    name:      "Fox",
    tagline:   "Judges your taste in fonts.",
    traits:    ["Mischievous", "Curious"],
    src:       "/Fox%20Sprite%20Sheet.png",
    tileW: 32, tileH: 32, sheetW: 448, sheetH: 224,
    anims: {
      idle:  { row: 0, frames: 5, fps: 6  },
      walk:  { row: 1, frames: 8, fps: 10 },
      run:   { row: 2, frames: 4, fps: 12 },
      trot:  { row: 3, frames: 8, fps: 10 },
      jump:  { row: 4, frames: 7, fps: 10 },
      sit:   { row: 5, frames: 3, fps: 5  },
      sleep: { row: 6, frames: 4, fps: 4  },
    },
    idleAnim:  "idle",
    hoverAnim: "trot",
    pool: [
      "idle","idle","idle",
      "sit","sit",
      "sleep","sleep",
      "walk","trot","run","jump",
    ],
  },
  {
    id:        "squirrel",
    name:      "Squirrel",
    tagline:   "Has seventeen side projects.",
    traits:    ["Hyperactive", "Chaotic"],
    src:       "/Squirrel%20Sprite%20Sheet.png",
    tileW: 32, tileH: 32, sheetW: 256, sheetH: 224,
    anims: {
      idle:  { row: 0, frames: 5, fps: 6  },
      walk:  { row: 1, frames: 6, fps: 10 },
      run:   { row: 2, frames: 4, fps: 14 },
      sit:   { row: 3, frames: 3, fps: 5  },
      sleep: { row: 5, frames: 4, fps: 4  },
      jump:  { row: 6, frames: 3, fps: 10 },
    },
    idleAnim:  "idle",
    hoverAnim: "run",
    pool: [
      "idle","idle",
      "walk","walk",
      "run","run",
      "sit",
      "sleep",
      "jump","jump",
    ],
  },
  {
    id:        "cat",
    name:      "Cat",
    tagline:   "Pretends not to care. Always watching.",
    traits:    ["Unbothered", "Mysterious"],
    src:       "/Cat%20Sprite%20Sheet.png",
    tileW: 32, tileH: 32, sheetW: 256, sheetH: 320,
    anims: {
      idle:    { row: 0, frames: 4, fps: 6  },
      walk:    { row: 1, frames: 4, fps: 10 },
      sit:     { row: 2, frames: 4, fps: 5  },
      rest:    { row: 3, frames: 4, fps: 4  },
      run:     { row: 4, frames: 8, fps: 12 },
      jump:    { row: 5, frames: 8, fps: 10 },
      sleep:   { row: 7, frames: 4, fps: 4  },
    },
    idleAnim:  "idle",
    hoverAnim: "jump",
    pool: [
      "idle","idle","idle",
      "sit","sit",
      "rest","rest",
      "sleep",
      "walk","walk",
      "run","jump",
    ],
  },
]

export function getBuddy(id: string): BuddyDef | undefined {
  return BUDDIES.find(b => b.id === id)
}
