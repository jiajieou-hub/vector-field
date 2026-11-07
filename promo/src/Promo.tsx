import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
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

/* Every shot is a hard cut on the music; the times live in src/timeline.ts */
export const Promo: React.FC<PromoProps> = ({ music }) => (
  <AbsoluteFill style={{ backgroundColor: "#090c12" }}>
    {CUTS.map((c, i) => (
      <Sequence key={i} name={c.name} from={c.from} durationInFrames={c.to - c.from} premountFor={30}>
        <ShotView shot={c.shot} />
      </Sequence>
    ))}
    {music ? <Audio name="Music" src={staticFile(music)} /> : null}
  </AbsoluteFill>
);
