import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SideCaption } from "../components/Caption";

export const LorenzScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Lorenz" style={{ backgroundColor: "#090c12" }}>
      <Video
        name="Lorenz attractor"
        src={staticFile("clips/lorenz.webm")}
        muted
        style={{
          width: 1920,
          height: 1080,
          translate: "300px 0px",
          scale: interpolate(frame, [0, 180], [1, 1.06], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <SideCaption kicker="07 · INTO 3D" title="Fields and strange attractors in 3D" />
    </AbsoluteFill>
  );
};
