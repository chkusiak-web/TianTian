# Visual Language (draft v0.1)

Oct 9, 2026 · @Moondog · Working title: **TBD** (see Naming)

Built from Moondog's 7 reference images. Not tied to the 天天 brand.

## Decisions so far

| # | Question | Pick |
| --- | --- | --- |
| 1 | Camera | ¾ oblique, like EarthBound (ref 7) |
| 2 | Flat vector farm scenes (refs 3, 6) | Mood only, not used directly |
| 3 | Density | Lived-in, like the watercolor town (ref 4) |
| 4 | Brand | New identity, ignore 天天 palette, fonts and seals |
| 5 | Map structure | Walkable old town; outer districts reached by bus or boat |
| 6 | Map distortion | Tourist-map style: old town blown up, outskirts pulled in |

## One-line pitch

A sunny, high-angle pixel world where the city is the main character and you are a small figure walking through it, slowly becoming a local.

## What we take from each reference

- **Pixel hill villages (1, 2):** the palette. Grass greens, field golds, soft stone, dotted paths. Clusters of houses stacked on rock become Jinan's hill neighborhoods.
- **EarthBound Onett (7):** the camera and the grid. ¾ oblique, readable chunky buildings, a sidewalk grid, front faces visible.
- **Watercolor town (4):** the density. Shops, a square, a tram, cats and bikes. Something to look at on every screen, but not crowded.
- **Pixel city poster (5):** the life. Small people doing things. We borrow the idea of busy streets, not its loud saturation.
- **Vector farmhouses (3, 6):** the mood only. Quiet, lots of open space, a calm afternoon light, long soft shadows. This is how the game should *feel* between conversations.

## Mockup

One screen of a Jinan street: https://claude.ai/artifact/3rNMbgyZhUYXLYC2q4SgoF

## Camera and scale

- **View:** ¾ oblique (top and front faces of objects visible, no isometric diamond).
- **Native resolution:** 480 × 270, scaled ×4 to 1920 × 1080 (16:9, desktop).
- **Tiles:** 16 × 16 px. A screen shows 30 × 17 tiles.
- **Characters:** 16 × 24 px, about 2.5 heads tall. Small against buildings, like the references.
- **Buildings:** 3 to 6 tiles wide. Landmarks (a temple, the station) can be 8 to 12.
- **Light:** sun from the upper left. Every object casts a short shadow down and to the right, one shade darker than the ground beneath it.

## Palette

One master palette of 24 colors, shared across the game. Each city then gets an 8-color accent set (below).

| Group | Colors (light to dark) | Used for |
| --- | --- | --- |
| Grass | `#A8DC5A` `#7CC23F` `#4E9A33` `#2E6B2C` | Ground, bushes, tree canopies |
| Field gold | `#F6DA5C` `#E8B93A` `#C08A2C` | Crops, autumn trees, lantern glow |
| Earth | `#E2CB98` `#B99367` `#7D5A3C` | Paths, dirt, wood |
| Stone | `#F3EFE6` `#C9C3B6` `#8E8A82` | Walls, rock, pavement |
| Water | `#BDEBF2` `#72CDE0` `#3A95BE` | Springs, lakes, canals |
| Roof | `#5C6A7E` `#C2573F` | Grey tile (north China), red brick |
| Line | `#2A2622` | Outlines and darkest shadow (warm, never pure black) |
| Sky | `#D9F1F7` | Title screens, the world map |

Rules:
- Outlines are the darkest shade of the object's own color, not black. Only characters get the warm line color, so they pop.
- At most 4 shades per material.
- No gradients and no anti-aliasing. Dithering only on water and sky.

### City accents

| City | Mood | Accent colors |
| --- | --- | --- |
| 济南 Jinan | Sunny spring water, willows, grey tile | Spring blue, willow green, lotus pink |
| 成都 Chengdu | Misty, bamboo, chili and tea | Bamboo teal, chili red, teahouse brown, mist grey |
| 上海 Shanghai | Cool, modern, neon at night | Steel blue, plane-tree green, neon magenta and cyan |
| 北京 Beijing | Autumn, brick, imperial red | Hutong grey brick, palace red, gingko gold |

## Time of day

The same tiles, recolored by a palette shift rather than redrawn.

- **Morning:** slightly cool and pale.
- **Afternoon:** the base palette (the "vector farmhouse" calm).
- **Evening:** warm gold, long shadows.
- **Night:** deep blue, with warm lamps and windows as the only bright spots.

## Characters

- **World sprites:** 16 × 24 px, 4 directions, 4-frame walk. One clear silhouette trait each (Grandma Wang's thermos, Old Pan's cap).
- **Dialogue portraits:** new pixel busts at 64 × 64, 3 expressions each (neutral, happy, confused). *Default picked, can change.*
- **Townsfolk:** a set of 12 reusable bodies with palette swaps, to make streets feel lived-in without drawing a new person each time.

## Signs and Chinese text

Chinese is the gameplay, so it must always be readable.

- **In the world:** signs show characters at 12 px minimum, drawn as part of the art. Short signs only (1 to 4 characters).
- **On inspect:** walking up to a sign opens a crisp text card with the same characters at large size. Hover shows pinyin, click shows English (as agreed for the trial).
- **Font:** a 12 px pixel CJK font for in-world text (candidate: Fusion Pixel, open license). A clean sans for cards, chosen with the new brand.

## UI

- Frames are pixel panels in stone and earth tones with a 1 px warm line.
- Dialogue box at the bottom third, portrait on the left, like Stardew Valley.
- The notebook (progress) is its own screen: paper texture, hand-drawn pixel sketches, characters written in.
- The city map is the one place that leans on the vector references: a calm, high, flat map with long shadows and open space, before you drop into a pixel district.

## The game map of Jinan

Source: Moondog's OpenStreetMap extract of central Jinan (116.90–117.19 E, 36.59–36.76 N). Rendered with our 10 districts: [jinan-real-map.png](jinan-real-map.png).

### What the real map tells us

- **Jinan is a north–south stack.** From top to bottom: the Yellow River, two lone hills (华不注山, 鹊山), the railway, Daming Lake, the walled old town full of springs, Quancheng Square, then 千佛山 and a ring of southern hills. The old saying fits exactly: 一城山色半城湖 (a city of mountain views, half of it lake).
- **Six of our ten districts sit inside the old moat**, a loop about 2 km across: 趵突泉, 芙蓉街, 大明湖, 泉城广场, 曲水亭街, 宽厚里. 千佛山 is just south. Only 山东大学 (east), 省立医院 (west) and 济南西站 (far west, off the extract) are outside.
- **The springs cluster in the old town.** The data has 175 springs, almost all in a tight band between 趵突泉, 五龙潭, 珍珠泉 and 黑虎泉.
- **The moat is a real boat route.** The data has docks at 趵突泉, 五龙潭 and 超然楼.
- **Roads form a slightly tilted grid** with one long east–west spine (泉城路 / 经十路).

### How to make it playful and still Jinan

1. **Keep the stack, bend everything else.** Mountains always at the bottom of the map, lake at the top, springs in between, the Yellow River as the far edge. If players remember one thing about Jinan's shape, it's this.
2. **Tourist-map distortion.** The old town inside the moat is blown up to fill the center of the map. Outer districts shrink and slide inward to its edges. Like a theme-park map, not a satellite view.
3. **The moat is the main loop.** A ring of water around the center district. Boats at the real docks work as fast travel.
4. **Springs are the signature tile.** Bubbling pools all over the old town, each with a small named stele. Some are hidden and can be discovered, which fits the 73rd spring story.
5. **Oversized landmarks you can see from far away.** 千佛山 with its temple and cable car, 超然楼 over the lake, 解放阁 on the moat, the 泉标 sculpture on Quancheng Square, lotus on Daming Lake.
6. **Straight grid, snapped to tiles.** Real roads become a clean ¾ grid. 泉城路 becomes the main street everyone walks along.
7. **Nature closes the edges.** Southern hills and the river are the world's borders, so it never feels like a city that just stops.
8. **Willows along every canal.** 家家泉水，户户垂杨 (a spring at every home, a willow at every door) becomes a tiling rule.

Decided: walkable old town plus outer districts by bus or boat, tourist-map distortion (see Decisions).

### Detailed map v0.2

Interactive: https://claude.ai/artifact/7dwmbb2EzDGct9iaEJr5SV · image: [jinan-game-map-v0.2.png](jinan-game-map-v0.2.png) · source: [jinan-game-map.html](jinan-game-map.html)

### Layout sketch v0.1

[jinan-game-map-sketch.png](jinan-game-map-sketch.png)

- **Center:** the moat ring is the walkable old town. Daming Lake fills its top third, with 超然楼 on the shore.
- **Inside the ring:** 曲水亭街 (home) sits between the lake and the springs, 芙蓉街 and 趵突泉 to the west, 宽厚里 to the east by 黑虎泉, and 泉城广场 with the 泉标 on the south edge.
- **Canals** run from the spring quarter north into the lake, as they really do.
- **Boat docks** at 趵突泉, 五龙潭 and 超然楼 for fast travel around the moat.
- **Outside, by bus:** 山东大学 (east), 省立医院 (west), 济南西站 (far west, also the train out of the city).
- **South, on foot:** a path from the square up to 千佛山, with a cable car to the temple. The southern hills close the bottom edge.
- **North edge:** the railway, then 鹊山 and 华不注山 as landmarks, then the Yellow River as the end of the world.


## Naming

English name (made-up words are fine), since players are English speakers. Not yet checked against app stores or trademarks.

- **A) Localish**, recommended: a made-up word for "almost a local", which is the whole arc in every city. Playful and easy to remember.
- **B) Wellspring**: ties to the hidden spring and the idea of a source. Strong for Jinan, less so for the later cities.
- **C) Neighborly**: warm, about the people you meet. A real word, so it's harder to own.

## Open questions

- Who draws the art, and the budget (also open in the concept doc).
- The new brand: name, logo and UI font.
- Portrait style: pixel (default) or illustrated.
