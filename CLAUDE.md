# CLAUDE.md

Notes for Claude Code sessions in this repository. The owner writes in Chinese; reply in Chinese.

## What this is

**Vector Field Sketchpad / 向量场画板**: an interactive 2D/3D vector-field plotter. The whole app is one self-contained file, `index.html` (~6900 lines: CSS at lines 40–928, then HTML, then one script wrapped in an IIFE). Live at https://jiajieou-hub.github.io/vector-field/ (GitHub Pages serves the repo root). MIT licensed.

- `README.md` (English) and `README.zh-CN.md` (Chinese): user docs; example links use `#<preset-id>` hashes.
- `docs/screenshots/`, `docs/social-preview.jpg`: README images and the repo's social preview (uploaded by hand in Settings → General).
- `docs/ui-styles.md`: catalogue of every button, toggle, segmented control, slider, input and card, grouped by shared look, with CSS line numbers. A reference list only: when restyling one group, check each listed element; do not merge rules.
- `promo/`: Remotion project for the YouTube promo video (see below).

## Working rules the owner has set

- **Do not change `index.html` unless explicitly asked.** The UI defaults to English (some code comments still assume Chinese; ignore that).
- Work on branch `claude/festive-gauss-75vpm7`; commit and push there. The owner opens and merges PRs. After a merge, restart the branch from `origin/main`.
- Screenshots for docs/previews: same-size panels, content centred, whole 3D cube visible, no formula box or |F| legend in shot.
- Prefer shorter, brisker pacing in videos.

## App internals worth knowing

- 3D camera: `cam={yaw,pitch,zoom}`; projection in `setPJ()`/`proj()`. Pitch is unlimited (full tumbling, added in PR #4): left-right drag direction flips when upside down (`yawSign()`), preset-view animation wraps pitch the short way, box lift is `0.2*cos(pitch)`.
- Real full screen uses the Fullscreen API with a fallback class `max` (fill window). In full screen the left drawer `#drL` holds the same Display/Analysis/Demo sections (moved, not copied).
- Green, Gauss and Stokes demos have a play bar: each demo's timeline `tl` runs 0→1 and is advanced in `LV.tick`; `keyT` is the gold mark just before the arrows cancel; rate, loop and hold live in the shared `DPB`. Space plays or pauses these demos. The canvas pause button is gone (`setPaused` is a no-op and `S.paused` stays false). In the 3D demos, arrows far from the cube faces or the surface fade (`arrowFocus`, `FOC`).
- Adaptive quality lowers particle counts when frames exceed ~20 ms, but not when the frame rate is locked at a steady 30 fps.
- Formula inputs apply after a 350 ms debounce; presets load from the URL hash; KaTeX 0.16.11 comes from jsDelivr (SRI pinned).
- Visits are counted with GoatCounter only on `*.github.io`; `#stats-off` / `#stats-on` opt out and back in.

## Promo video (`promo/`)

- `node record/record.cjs [clip…]` records footage of `../index.html` into `public/clips/*.webm` (git-ignored). `record/clock.js` replaces `performance.now`, `requestAnimationFrame`, `setTimeout` and `setInterval` with a virtual clock stepped 1/30 s per screenshot, so footage is smooth however slow the machine is. Patches are applied only to the served copy (exposing `window.__vf` = camera, coordinates, probe; hiding the gizmo; centring 3D when the UI is hidden). The Fullscreen API is disabled there so the page uses its fill-window mode. The browser starts with `--force-device-scale-factor=4/3` at 1440×810 for fast 1920×1080 captures. A drawn cursor shows scripted clicks.
- Clips: `bg`, `type` (also writes `styles`), `probe`, `hopf`, `loop`, `green`, `lorenz`, `halvorsen`, `dipole3d`, `wire`, `helix`. Green, loop, probe and styles are recorded in full screen with the UI visible; type and Hopf stay in the window.
- Remotion 4.0.540. `src/Promo.tsx` holds the timeline (14 scenes, 12-frame fades, about 58 s); `src/Root.tsx` registers the scenes and a `Thumbnail` still. Fonts are local in `public/fonts`. Render with `npx remotion render Promo out/promo.mp4` (CRF 18 set in `remotion.config.ts`); optional music via `--props='{"music":"music.mp3"}'`. `YOUTUBE.md` holds the upload title, description and tags.
- In the cloud container: jsDelivr is blocked (serve a local `katex` copy, as the recorder does), and Remotion's browser cannot verify the proxy CA, so fonts must stay local. Never disable TLS checks. Pass `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell` to Remotion. Playwright is preinstalled; do not install another version.

## Open ideas (not started)

- Background music for the video (YouTube Audio Library), and a Chinese version of the video.
- `<meta>` description and Open Graph tags in `index.html` would give shared page links a preview card. The owner has not asked for page changes, so this has not been done.
- Promotion plan already suggested: course staff (e.g. Math 53), 知乎, B站, 小红书, V2EX, Show HN, Reddit (r/InternetIsBeautiful, r/learnmath…), Mastodon; track channels with GoatCounter referrers.
