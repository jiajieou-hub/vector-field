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
  | { kind: "flash"; clip: string; label: string; scale?: number; punch?: "A" | "B"; light?: boolean }
  | { kind: "final" };

/* tail: frames the shot keeps playing over the next one while it fades away (a transition);
   enter: the shot settles from slightly smaller as it comes in */
export type Cut = { from: number; to: number; name: string; shot: Shot; tail?: number; enter?: boolean };

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

/* The answering phrase in bars 27-28 (F#, E, D#, E, C#): five more attractors, the last
   held until the sixth motif */
const P = BEATS.phrase;
const phrase: [number, number, string, Shot][] = (
  [
    ["a-aizawa", "Aizawa attractor"],
    ["a-thomas", "Thomas attractor"],
    ["a-rossler", "Rössler attractor"],
    ["a-lorenz-top", "Lorenz, from above"],
    ["g-halvorsen", "Halvorsen attractor"],
  ] as [string, string][]
).map(([clip, label], k) => [P[k], k < 4 ? P[k + 1] : M[5][0], clip, { kind: "flash", clip, label, punch: k === 0 ? "A" : "B" }]);

/* Build-up: a 3D gallery cut on every beat of bars 31-32 up to the strong hit before the
   fill, then one cut on each of the fill's seven quick hits into the final drum */
const gallery: [string, string][] = [
  ["g-dipole3d", "Magnetic dipole"],
  ["g-wire", "Current in a straight wire"],
  ["g-helix", "Rising helix"],
  ["g-sink", "Sink"],
  ["g-rotz", "Rotation about z · curl"],
  ["g-lorenz", "Lorenz attractor"],
];
const fill: [string, string][] = [
  ["f-charge", "Point charge"],
  ["f-wave", "F = (cos(x + y), sin(x − y))"],
  ["f-cells", "F = (sin y, sin x)"],
  ["f-predator", "Predator–prey · div F"],
  ["f-circ", "Circulation, 16 × 16"],
  ["f-dome", "Hemisphere"],
  ["f-vdp", "Van der Pol · div F"],
  ["f-dipole", "Dipole"],
];
const F = BEATS.fill;
const B31 = bar(31);
const buildup: [number, number, string, Shot][] = [
  ...gallery.map(([clip, label], k): [number, number, string, Shot] => [
    k === 0 ? BEATS.buildup : B31 + k * Q,
    B31 + (k + 1) * Q,
    clip,
    { kind: "flash", clip, label, punch: "B" },
  ]),
  /* the strong hit just before the fill, then the seven quick hits */
  ...fill.map(([clip, label], k): [number, number, string, Shot] => [
    k === 0 ? BEATS.fillStart : F[k - 1],
    k === fill.length - 1 ? HIT : F[k],
    clip,
    { kind: "flash", clip, label, punch: "B" },
  ]),
];
/* the gallery's last shot runs up to the strong hit */
buildup[gallery.length - 1][1] = BEATS.fillStart;

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
    { kind: "lorenz" }, "Lorenz", P[0]),
  ...phrase,
  ...motif(5, [["f-disk", "Flat disk"], ["f-dome", "Hemisphere"], ["f-tall", "Tall dome"]],
    { kind: "window", clip: "gauss", kicker: "08 · AND IN 3D", title: "The divergence and Stokes' theorems" }, "Gauss", BEATS.buildup),
  ...buildup,
  [HIT, BEATS.duration, "Final", { kind: "final" }],
];

export const CUTS: Cut[] = raw.map(([a, b, name, shot]) => ({ from: f(a), to: f(b), name, shot }));

/* From the fifth motif until the drum fill, only the first cut of each motif (into the
   point charge, into the flat disk) flashes; the other cuts are plain */
for (const c of CUTS) {
  if (c.shot.kind !== "flash" || c.from < f(M[4][0]) || c.from >= f(BEATS.fillStart)) continue;
  if (c.from === f(M[4][0]) || c.from === f(M[5][0])) continue;
  c.shot.light = false;
}

/* A short transition from typing to the display styles (bar 6): the typing scene zooms
   through and fades out over a third of a second while the next one settles in */
CUTS.find((c) => c.name === "Type a field")!.tail = 9;
CUTS.find((c) => c.name === "Display styles")!.enter = true;
