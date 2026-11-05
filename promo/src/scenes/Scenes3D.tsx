import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SideCaption } from "../components/Caption";
import { sans, serif } from "../theme";

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
          scale: interpolate(frame, [0, 240], [1, 1.06], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <SideCaption kicker="07 · INTO 3D" title="Fields and strange attractors in 3D" />
    </AbsoluteFill>
  );
};

/* One short 3D shot, full screen, with its name and a small label in the corner */
export const Showcase3D: React.FC<{ clip: string; name: string; label: string }> = ({
  clip,
  name,
  label,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="3D shot" style={{ backgroundColor: "#090c12" }}>
      <Video
        name="Footage"
        src={staticFile(`clips/${clip}.webm`)}
        muted
        style={{
          width: 1920,
          height: 1080,
          scale: interpolate(frame, [0, 110], [1.02, 1.08], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Interactive.Div
        name="Scrim"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 1920,
          height: 300,
          background:
            "linear-gradient(to top, rgba(9,12,18,0.8), rgba(9,12,18,0))",
        }}
      />
      <Interactive.Div
        name="Name"
        style={{
          position: "absolute",
          left: 120,
          bottom: 100,
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 72,
          color: "#ece6d8",
          opacity: interpolate(frame, [6, 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [6, 26], ["0px 14px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {name}
      </Interactive.Div>
      <Interactive.Div
        name="Label"
        style={{
          position: "absolute",
          left: 124,
          bottom: 196,
          fontFamily: sans,
          fontSize: 26,
          letterSpacing: "0.2em",
          color: "#f3c96f",
          opacity: interpolate(frame, [10, 26], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {label}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
