# Promo video

A short promo video for [Vector Field Sketchpad](https://jiajieou-hub.github.io/vector-field/), made with [Remotion](https://www.remotion.dev/).

It is built in two steps:

1. **Record footage** of the app itself (`record/`). A headless browser opens `../index.html` and records each clip frame by frame into `public/clips/*.webm`.
2. **Edit** the clips into the video with Remotion (`src/`): titles, captions, push-ins and an end card, every cut timed to the soundtrack.

The clips and the rendered video are not committed (they are large). Record them once, then edit and render as often as you like.

## Setup

```bash
npm install
```

Recording also needs Playwright with Chromium, and ffmpeg on your PATH:

```bash
npm install --no-save playwright
```

```bash
npx playwright install chromium
```

## 1. Record the footage

```bash
node record/record.cjs
```

This records every clip (about 30 to 40 minutes). To redo only some of them, name them:

```bash
node record/record.cjs hopf loop
```

Clips: `bg`, `type` (also writes `styles`), `probe`, `hopf`, `loop`, `green`, `gauss`, `lorenz`, and the short full-screen shots for the fast cuts (`f-…` and the `g-…` gallery). Each is described in `record/record.cjs`.

The interactive clips are timed to the music: clicks, typed letters and drags land on beats taken from `src/beats.json`. If you change the soundtrack, update that file and record again.

To check a framing quickly, `STILL=some/folder node record/record.cjs f-wave g-wire` saves one small picture per clip instead of recording it.

How the recorder works:

- **Smooth at any speed.** `record/clock.js` replaces the page clock (`performance.now`, `requestAnimationFrame`, `setTimeout`, `setInterval`). The recorder advances it exactly 1/30 s and takes a screenshot, so the footage plays at a steady 30 fps however slowly the machine renders.
- **The app is not changed.** `index.html` on disk is never edited. A few patches are applied only to the copy served to the recording browser: they expose the camera and screen coordinates, and let the 3D axis gizmo and toolbars be hidden for the full-screen shots.
- **A drawn cursor.** Headless screenshots have no mouse pointer, so the recorder draws one and moves it with every scripted click and drag.
- Frames are 1920 × 1080 (a 1440 × 810 page at a device scale of 4/3, so the interface reads well on video).

## 2. Preview and edit

```bash
npm run dev
```

This opens Remotion Studio. The main video is **Promo**; the intro, a flash shot and the end card can also be opened on their own under **Scenes**.

The cut list is `src/timeline.ts`: which clip plays when, its caption or label, all computed from the beat map in `src/beats.json` (bar lines, the four notes of the recurring melody, the drum accents and the final hit). Captions and labels are plain text there.

## 3. Render

```bash
npx remotion render Promo out/promo.mp4
```

The result is a 1920 × 1080, 30 fps H.264 MP4, ready to upload to YouTube.

### The soundtrack

The video is cut to "Lunar Landing" from the YouTube Audio Library, trimmed to 67 s with an extra drum hit at the end. The audio file is not in the repository: put your copy at `public/music/lunar-landing.wav`. To render without sound, pass `--props='{"music":""}'`.

## Fonts

`public/fonts/` holds the typefaces the app uses (Source Serif 4, IBM Plex Sans, JetBrains Mono, and a tiny subset of Noto Serif SC with just 向量场画板中文, now unused), so rendering needs no network. All are under the SIL Open Font License.

## License

Remotion is free for individuals and companies of up to 3 people; larger companies need a [company license](https://www.remotion.pro/license).
