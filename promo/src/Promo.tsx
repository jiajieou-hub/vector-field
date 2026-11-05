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
import { AttractorScene, LorenzScene } from "./scenes/Scenes3D";

export type PromoProps = {
  /* A file in public/, e.g. "music.mp3". Leave empty for a silent video. */
  music: string;
};

/* Every cut is a 15-frame cross-fade, so the total is the sum of the scenes minus 15 per cut. */
export const PROMO_DURATION =
  150 + 190 + 240 + 220 + 215 + 255 + 265 + 230 + 4 * 100 + 140 + 170 - 15 * 14;

export const Promo: React.FC<PromoProps> = ({ music }) => {
  const { durationInFrames, fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#090c12" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Intro" durationInFrames={150}>
          <Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="Type a field" durationInFrames={190}>
          <TypeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="Display styles" durationInFrames={240}>
          <StylesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="Probe" durationInFrames={220}>
          <ProbeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="Hopf" durationInFrames={215}>
          <HopfScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="Loop" durationInFrames={255}>
          <LoopScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="Green" durationInFrames={265}>
          <GreenScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="Lorenz" durationInFrames={230}>
          <LorenzScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="Aizawa" durationInFrames={100}>
          <AttractorScene clip="aizawa" name="Aizawa" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="Thomas" durationInFrames={100}>
          <AttractorScene clip="thomas" name="Thomas" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="Halvorsen" durationInFrames={100}>
          <AttractorScene clip="halvorsen" name="Halvorsen" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="Rössler" durationInFrames={100}>
          <AttractorScene clip="rossler" name="Rössler" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="Facts" durationInFrames={140}>
          <Facts />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="Outro" durationInFrames={170}>
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
