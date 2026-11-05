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
import { AttractorScene, LorenzScene } from "./scenes/Scenes3D";

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
        <Composition id="Intro" component={Intro} width={1920} height={1080} fps={30} durationInFrames={150} />
        <Composition id="Type" component={TypeScene} width={1920} height={1080} fps={30} durationInFrames={190} />
        <Composition id="Styles" component={StylesScene} width={1920} height={1080} fps={30} durationInFrames={240} />
        <Composition id="Probe" component={ProbeScene} width={1920} height={1080} fps={30} durationInFrames={220} />
        <Composition id="Hopf" component={HopfScene} width={1920} height={1080} fps={30} durationInFrames={215} />
        <Composition id="Loop" component={LoopScene} width={1920} height={1080} fps={30} durationInFrames={255} />
        <Composition id="Green" component={GreenScene} width={1920} height={1080} fps={30} durationInFrames={235} />
        <Composition id="Lorenz" component={LorenzScene} width={1920} height={1080} fps={30} durationInFrames={230} />
        <Composition
          id="Attractor"
          component={AttractorScene}
          width={1920}
          height={1080}
          fps={30}
          durationInFrames={100}
          defaultProps={{ clip: "aizawa", name: "Aizawa" }}
        />
        <Composition id="Facts" component={Facts} width={1920} height={1080} fps={30} durationInFrames={140} />
        <Composition id="Outro" component={Outro} width={1920} height={1080} fps={30} durationInFrames={170} />
      </Folder>
    </>
  );
};
