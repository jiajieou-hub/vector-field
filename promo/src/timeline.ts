import BEATS from "./beats.json";

/* Everything in the video is cut to the soundtrack. Times are seconds into the song
   (see beats.json); f() turns them into frames. */
export const FPS = 30;
export const f = (sec: number) => Math.round(sec * FPS);
export const BAR = BEATS.bar;
export const Q = BAR / 4;
/* Time of beat `beat` (1-4, fractions allowed) of bar n */
export const bar = (n: number, beat = 1) => BEATS.bar0 + (n - 1) * BAR + (beat - 1) * Q;
export const HIT = BEATS.hit;
export const DURATION = f(BEATS.duration);

export type Shot =
  | { kind: "intro" }
  | { kind: "window"; clip: string; kicker: string; title: string; zoom?: "type" | "loop" }
  | { kind: "lorenz" }
  | { kind: "flash"; clip: string; label: string; scale?: number; punch?: "A" | "B" }
  | { kind: "final" };

export type Cut = { from: number; to: number; name: string; shot: Shot };

const M = BEATS.motifs;

/* The four notes of each motif: the first three cut to flash shots, the long last note
   lands on the chapter and its caption. Motifs 1 and 3 start on the drum accent before them. */
const motif = (
  i: number,
  flashes: [string, string, number?][],
  chapter: Shot,
  chapterName: string,
  end: number,
): [number, number, string, Shot][] => {
  const t = M[i];
  const start = i === 0 ? BEATS.pickups[0] : i === 2 ? BEATS.pickups[1] : t[0];
  const bounds = [start, t[1], t[2], t[3]];
  return [
    ...flashes.map(([clip, label, scale], k): [number, number, string, Shot] => [
      bounds[k],
      bounds[k + 1],
      clip,
      { kind: "flash", clip, label, scale, punch: k === 0 ? "A" : "B" },
    ]),
    [t[3], end, chapterName, chapter],
  ];
};

/* Build-up: a 3D gallery cut on every beat of bars 31-32, then three eighth-note cuts
   through the drum fill into the final hit */
const gallery: [string, string][] = [
  ["g-halvorsen", "Halvorsen attractor"],
  ["g-dipole3d", "Magnetic dipole"],
  ["g-wire", "Current in a straight wire"],
  ["g-helix", "Rising helix"],
  ["g-sink", "Sink"],
  ["g-rotz", "Rotation about z · curl"],
  ["g-lorenz", "Lorenz attractor"],
];
const fill: [string, string][] = [
  ["f-wave", "F = (cos(x + y), sin(x − y))"],
  ["f-cells", "F = (sin y, sin x)"],
  ["f-dipole", "Dipole"],
];
const B31 = bar(31);
const buildup: [number, number, string, Shot][] = [
  ...gallery.map(([clip, label], k): [number, number, string, Shot] => [
    k === 0 ? BEATS.buildup : B31 + k * Q,
    B31 + (k + 1) * Q,
    clip,
    { kind: "flash", clip, label, punch: "B" },
  ]),
  ...fill.map(([clip, label], k): [number, number, string, Shot] => [
    bar(32, 3.5) + k * (Q / 2),
    k === 2 ? HIT : bar(32, 3.5) + (k + 1) * (Q / 2),
    clip,
    { kind: "flash", clip, label, punch: "B" },
  ]),
];
/* the gallery's last shot runs up to the fill */
buildup[gallery.length - 1][1] = bar(32, 3.5);

const raw: [number, number, string, Shot][] = [
  [0, bar(3), "Intro", { kind: "intro" }],
  [bar(3), bar(6), "Type a field", { kind: "window", clip: "type", kicker: "01 · ANY FIELD", title: "Type a formula, in plain math or LaTeX", zoom: "type" }],
  [bar(6), BEATS.pickups[0], "Display styles", { kind: "window", clip: "styles", kicker: "02 · SEE IT YOUR WAY", title: "Arrows, streamlines, particles and heat-maps" }],
  ...motif(0, [["f-dipole", "Dipole"], ["f-wave", "F = (cos(x + y), sin(x − y))"], ["f-cells", "F = (sin y, sin x)"]],
    { kind: "window", clip: "probe", kicker: "03 · PROBE ANY POINT", title: "Read F, div F and curl F as you drag" }, "Probe", M[1][0]),
  ...motif(1, [["f-vdp", "Van der Pol · div F"], ["f-pendulum", "Pendulum"], ["f-predator", "Predator–prey · div F"]],
    { kind: "window", clip: "hopf", kicker: "04 · DYNAMICAL SYSTEMS", title: "Drag a parameter, watch a limit cycle appear" }, "Hopf", BEATS.pickups[1]),
  ...motif(2, [["f-cylinder", "Flow past a cylinder"], ["f-saddle", "F = (x + 0.4 sin 2y, −y + 0.4 sin 2x)"], ["f-spiral", "Spiral sink"]],
    { kind: "window", clip: "loop", kicker: "05 · LINE INTEGRALS", title: "Draw a loop to get circulation and flux", zoom: "loop" }, "Loop", M[3][0]),
  ...motif(3, [["f-path", "Path independence", 1.3], ["f-flux", "Flux, cell by cell", 1.3], ["f-circ", "Circulation, 16 × 16", 1.3]],
    { kind: "window", clip: "green", kicker: "06 · THEOREMS, STEP BY STEP", title: "See why Green's theorem works" }, "Green", M[4][0]),
  ...motif(4, [["f-charge", "Point charge"], ["f-gradxyz", "∇(xyz)"], ["f-radial", "Radial field · div F"]],
    { kind: "lorenz" }, "Lorenz", M[5][0]),
  ...motif(5, [["f-disk", "Flat disk"], ["f-dome", "Hemisphere"], ["f-tall", "Tall dome"]],
    { kind: "window", clip: "gauss", kicker: "08 · AND IN 3D", title: "The divergence and Stokes' theorems" }, "Gauss", BEATS.buildup),
  ...buildup,
  [HIT, BEATS.duration, "Final", { kind: "final" }],
];

export const CUTS: Cut[] = raw.map(([a, b, name, shot]) => ({ from: f(a), to: f(b), name, shot }));
