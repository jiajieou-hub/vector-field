import { Composition, Folder, Still } from "remotion";
import { Promo, PROMO_DURATION } from "./Promo";
import { Thumbnail } from "./Thumbnail";
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
        defaultProps={{ music: "" }}
      />
      <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} />
      <Folder name="Scenes">
        <Composition id="Intro" component={Intro} width={1920} height={1080} fps={30} durationInFrames={120} />
        <Composition id="Type" component={TypeScene} width={1920} height={1080} fps={30} durationInFrames={128} />
        <Composition id="Styles" component={StylesScene} width={1920} height={1080} fps={30} durationInFrames={214} />
        <Composition id="Probe" component={ProbeScene} width={1920} height={1080} fps={30} durationInFrames={143} />
        <Composition id="Hopf" component={HopfScene} width={1920} height={1080} fps={30} durationInFrames={155} />
        <Composition id="Loop" component={LoopScene} width={1920} height={1080} fps={30} durationInFrames={180} />
        <Composition id="Green" component={GreenScene} width={1920} height={1080} fps={30} durationInFrames={182} />
        <Composition id="Lorenz" component={LorenzScene} width={1920} height={1080} fps={30} durationInFrames={180} />
        <Composition
          id="Showcase3D"
          component={Showcase3D}
          width={1920}
          height={1080}
          fps={30}
          durationInFrames={85}
          defaultProps={{ clip: "halvorsen", name: "Halvorsen", label: "STRANGE ATTRACTOR" }}
        />
        <Composition id="Facts" component={Facts} width={1920} height={1080} fps={30} durationInFrames={110} />
        <Composition id="Outro" component={Outro} width={1920} height={1080} fps={30} durationInFrames={150} />
      </Folder>
    </>
  );
};
