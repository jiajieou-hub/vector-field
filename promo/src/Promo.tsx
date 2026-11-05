import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Facts, Outro } from "./scenes/Closing";
import {
  GreenScene,
  HopfScene,
  LoopScene,
  ProbeScene,
  StylesScene,
  TypeScene,
} from "./scenes/Features2D";
import { Intro } from "./scenes/Intro";
import { LorenzScene, Showcase3D } from "./scenes/Scenes3D";

export type PromoProps = {
  /* A file in public/, e.g. "music.mp3". Leave empty for a silent video. */
  music: string;
};

/* Every cut is a 12-frame cross-fade, so the total is the sum of the 14 scenes minus 12 for each of the 13 cuts. */
export const PROMO_DURATION =
  120 + 128 + 214 + 143 + 155 + 180 + 182 + 180 + 4 * 85 + 110 + 150 - 12 * 13;

export const Promo: React.FC<PromoProps> = ({ music }) => {
  const { durationInFrames, fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#090c12" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Intro" durationInFrames={120}>
          <Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Type a field" durationInFrames={128}>
          <TypeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Display styles" durationInFrames={214}>
          <StylesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Probe" durationInFrames={143}>
          <ProbeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Hopf" durationInFrames={155}>
          <HopfScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Loop" durationInFrames={180}>
          <LoopScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Green" durationInFrames={182}>
          <GreenScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Lorenz" durationInFrames={180}>
          <LorenzScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Halvorsen" durationInFrames={85}>
          <Showcase3D clip="halvorsen" name="Halvorsen" label="STRANGE ATTRACTOR" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Magnetic dipole" durationInFrames={85}>
          <Showcase3D clip="dipole3d" name="Magnetic dipole" label="MAGNETIC FIELD" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Straight wire" durationInFrames={85}>
          <Showcase3D clip="wire" name="Current in a straight wire" label="MAGNETIC FIELD" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Rising helix" durationInFrames={85}>
          <Showcase3D clip="helix" name="Rising helix" label="STREAMLINES" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Facts" durationInFrames={110}>
          <Facts />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Outro" durationInFrames={150}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {music ? (
        <Audio
          name="Music"
          src={staticFile(music)}
          volume={(f) =>
            interpolate(
              f,
              [0, 1 * fps, durationInFrames - 2 * fps, durationInFrames],
              [0, 0.8, 0.8, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
