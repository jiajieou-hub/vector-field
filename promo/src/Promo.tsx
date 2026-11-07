import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Final } from "./scenes/Final";
import { Flash } from "./scenes/Flash";
import { Intro } from "./scenes/Intro";
import { LorenzScene } from "./scenes/Scenes3D";
import { WindowScene } from "./scenes/WindowScene";
import { LoopZoom, TypeZoom } from "./scenes/Zooms";
import { CUTS, DURATION, type Shot } from "./timeline";

export const PROMO_DURATION = DURATION;

export type PromoProps = {
  /* A file in public/. The cut is timed to this track (see src/beats.json). */
  music: string;
};

const ShotView: React.FC<{ shot: Shot }> = ({ shot }) => {
  switch (shot.kind) {
    case "intro":
      return <Intro />;
    case "window":
      return (
        <WindowScene
          clip={shot.clip}
          kicker={shot.kicker}
          title={shot.title}
          zoom={shot.zoom === "type" ? TypeZoom : shot.zoom === "loop" ? LoopZoom : undefined}
        />
      );
    case "lorenz":
      return <LorenzScene />;
    case "flash":
      return <Flash clip={shot.clip} label={shot.label} scale={shot.scale} punch={shot.punch} />;
    case "final":
      return <Final />;
  }
};

/* Wraps a shot for a transition: `enter` settles it from slightly smaller; `tail` keeps it
   playing over the start of the next shot while it zooms through, blurs and fades */
const Transition: React.FC<{ len: number; tail: number; enter: boolean; children: React.ReactNode }> = ({ len, tail, enter, children }) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const out = tail ? Math.max(0, Math.min(1, (frame - len) / tail)) : 0;
  const e = Easing.bezier(0.4, 0, 0.2, 1)(out);
  const inS = enter ? interpolate(frame, [0, 12], [0.955, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }) : 1;
  return (
    <AbsoluteFill
      style={{
        opacity: 1 - e,
        scale: String(inS * (1 + 0.07 * e)),
        filter: e > 0 ? `blur(${(8 * e).toFixed(2)}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* Every shot is cut on the music (one short transition aside); the times live in src/timeline.ts */
export const Promo: React.FC<PromoProps> = ({ music }) => (
  <AbsoluteFill style={{ backgroundColor: "#090c12" }}>
    {CUTS.map((c, i) => (
      <Sequence
        key={i}
        name={c.name}
        from={c.from}
        durationInFrames={c.to - c.from + (c.tail ?? 0)}
        premountFor={30}
        style={c.tail ? { zIndex: 1 } : undefined}
      >
        {c.tail || c.enter ? (
          <Transition len={c.to - c.from} tail={c.tail ?? 0} enter={!!c.enter}>
            <ShotView shot={c.shot} />
          </Transition>
        ) : (
          <ShotView shot={c.shot} />
        )}
      </Sequence>
    ))}
    {music ? <Audio name="Music" src={staticFile(music)} /> : null}
  </AbsoluteFill>
);
