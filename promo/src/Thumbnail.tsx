import { Video } from "@remotion/media";
import { useMemo } from "react";
import { AbsoluteFill, Interactive, staticFile } from "remotion";
import { sans, serif } from "./theme";

/* YouTube thumbnail, 1280 x 720. Render with: npx remotion still Thumbnail out/thumbnail.png */

const W = 1280;
const H = 720;
/* Where the Lorenz cube's centre lands: right of the middle, a little below the horizon */
const FOCUS = { x: 905, y: 378 };

/* Streamlines of a uniform flow past a cylinder centred on the focus, so the
   lines part around the picture and lead the eye to it. Each line is seeded far
   upstream at height FOCUS.y + c. */
const R = 250;
function streamline(c: number): string {
  const vel = (x: number, y: number) => {
    const dx = x - FOCUS.x;
    const dy = y - FOCUS.y;
    const r2 = dx * dx + dy * dy;
    const k = (R * R) / (r2 * r2);
    return [1 - k * (dx * dx - dy * dy), -2 * k * dx * dy];
  };
  const dir = (px: number, py: number) => {
    const [u, v] = vel(px, py);
    const s = Math.hypot(u, v) || 1;
    return [u / s, v / s];
  };
  let x = -60;
  /* Start on the right height: ψ = y(1 - R²/r²) is constant along the line */
  const dx0 = x - FOCUS.x;
  let y = FOCUS.y + c;
  for (let i = 0; i < 30; i++) {
    const dy = y - FOCUS.y;
    y = FOCUS.y + c / (1 - (R * R) / (dx0 * dx0 + dy * dy));
  }
  const pts: string[] = [`M${x.toFixed(1)} ${y.toFixed(1)}`];
  const h = 4;
  for (let i = 0; i < 4000 && x < W + 60; i++) {
    const [k1x, k1y] = dir(x, y);
    const [k2x, k2y] = dir(x + (h / 2) * k1x, y + (h / 2) * k1y);
    const [k3x, k3y] = dir(x + (h / 2) * k2x, y + (h / 2) * k2y);
    const [k4x, k4y] = dir(x + h * k3x, y + h * k3y);
    x += (h / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    y += (h / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
    if (i % 3 === 0) pts.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join("");
}
function flowLines(): string[] {
  const lines: string[] = [];
  for (let c = -18 - 36 * 14; c <= 400; c += 36) lines.push(streamline(c));
  return lines;
}
/* The gold line runs under the title, standing in for a rule, then hugs the
   bottom of the picture */
const GOLD_C = 53;

export const Thumbnail: React.FC = () => {
  const lines = useMemo(flowLines, []);
  const gold = useMemo(() => streamline(GOLD_C), []);
  return (
    <AbsoluteFill name="Thumbnail" style={{ backgroundColor: "#090c12" }}>
      <Video
        name="Lorenz attractor"
        src={staticFile("clips/lorenz.webm")}
        trimBefore={150}
        muted
        style={{
          position: "absolute",
          left: 430,
          top: 113,
          width: 960,
          height: 540,
          scale: 1.3,
          /* Feather the frame so no edge of the footage shows */
          maskImage: "radial-gradient(ellipse 34% 42% at 50% 50%, #000 62%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 34% 42% at 50% 50%, #000 62%, transparent 100%)",
        }}
      />
      <AbsoluteFill
        name="Fade to the left"
        style={{
          background:
            "linear-gradient(90deg, #090c12 0%, #090c12 40%, rgba(9,12,18,0.5) 54%, rgba(9,12,18,0) 66%)",
        }}
      />
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          {/* Lines fade out behind the title and as they reach the picture */}
          <linearGradient id="flowFade" x1="0" y1="0" x2={W} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ece6d8" stopOpacity="0.10" />
            <stop offset="0.3" stopColor="#ece6d8" stopOpacity="0.045" />
            <stop offset="0.55" stopColor="#ece6d8" stopOpacity="0.075" />
            <stop offset="0.72" stopColor="#ece6d8" stopOpacity="0.03" />
            <stop offset="1" stopColor="#ece6d8" stopOpacity="0.06" />
          </linearGradient>
          {/* Clear the lines away from the picture itself */}
          <radialGradient id="holeG" cx={FOCUS.x} cy={FOCUS.y} r={330} gradientUnits="userSpaceOnUse">
            <stop offset="0.72" stopColor="#000" />
            <stop offset="1" stopColor="#fff" />
          </radialGradient>
          <mask id="hole" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <rect width={W} height={H} fill="url(#holeG)" />
          </mask>
          <linearGradient id="goldFade" x1="0" y1="0" x2={W} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0.056" stopColor="#f3c96f" stopOpacity="0" />
            <stop offset="0.06" stopColor="#f3c96f" stopOpacity="0.95" />
            <stop offset="0.16" stopColor="#f3c96f" stopOpacity="0.5" />
            <stop offset="0.36" stopColor="#f3c96f" stopOpacity="0.1" />
            <stop offset="0.62" stopColor="#f3c96f" stopOpacity="0.1" />
            <stop offset="0.74" stopColor="#f3c96f" stopOpacity="0.42" />
            <stop offset="0.9" stopColor="#f3c96f" stopOpacity="0.2" />
            <stop offset="1" stopColor="#f3c96f" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g name="Flow lines" fill="none" stroke="url(#flowFade)" strokeWidth={1} mask="url(#hole)">
          {lines.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <path name="Gold line" d={gold} fill="none" stroke="url(#goldFade)" strokeWidth={1.6} />
      </svg>
      <Interactive.Div
        name="Title"
        style={{
          position: "absolute",
          left: 72,
          top: 196,
          width: 640,
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 104,
          lineHeight: 1.0,
          color: "#ece6d8",
        }}
      >
        Vector Field Sketchpad
      </Interactive.Div>
      <Interactive.Div
        name="Tagline"
        style={{
          position: "absolute",
          left: 72,
          top: 470,
          padding: "10px 22px",
          borderRadius: 999,
          backgroundColor: "rgba(243,201,111,0.14)",
          border: "2px solid rgba(243,201,111,0.6)",
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 36,
          color: "#f3c96f",
        }}
      >
        Free · in your browser
      </Interactive.Div>
    </AbsoluteFill>
  );
};
