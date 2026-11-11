import { Composition, Folder, Still } from "remotion";
import { Promo, PROMO_DURATION } from "./Promo";
import { Thumbnail } from "./Thumbnail";
import { Final } from "./scenes/Final";
import { Flash } from "./scenes/Flash";
import { Intro } from "./scenes/Intro";
import { CUTS } from "./timeline";

const len = (name: string) => {
  const c = CUTS.find((x) => x.name === name)!;
  return c.to - c.from;
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Promo"
        component={Promo}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={PROMO_DURATION}
        defaultProps={{ music: "music/lunar-landing.wav" }}
      />
      <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} />
      <Folder name="Scenes">
        <Composition id="Intro" component={Intro} width={1920} height={1080} fps={30} durationInFrames={len("Intro")} />
        <Composition
          id="Flash"
          component={Flash}
          width={1920}
          height={1080}
          fps={30}
          durationInFrames={25}
          defaultProps={{ clip: "f-wave", label: "F = (cos(x + y), sin(x − y))", punch: "A" as const }}
        />
        <Composition id="Final" component={Final} width={1920} height={1080} fps={30} durationInFrames={len("Final")} />
      </Folder>
    </>
  );
};
