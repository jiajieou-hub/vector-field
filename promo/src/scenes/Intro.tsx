import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { sans, serif, zh } from "../theme";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Intro" style={{ backgroundColor: "#090c12" }}>
      <Video
        name="Flowing particles"
        src={staticFile("clips/bg.webm")}
        muted
        style={{
          width: 1920,
          height: 1080,
          scale: interpolate(frame, [0, 150], [1.3, 1.2], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <AbsoluteFill
        name="Shade"
        style={{
          background:
            "radial-gradient(1100px 600px at 50% 50%, rgba(9,12,18,0.42), rgba(9,12,18,0.85))",
        }}
      />
      <AbsoluteFill
        name="Text"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Interactive.Div
          name="Name"
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 136,
            letterSpacing: "-0.01em",
            color: "#ece6d8",
            opacity: interpolate(frame, [8, 34], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [8, 40], ["0px 30px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          Vector Field Sketchpad
        </Interactive.Div>
        <Interactive.Div
          name="Chinese name"
          style={{
            marginTop: 18,
            fontFamily: zh,
            fontWeight: 500,
            fontSize: 46,
            letterSpacing: "0.3em",
            color: "#b9b2a3",
            opacity: interpolate(frame, [22, 46], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          向量场画板
        </Interactive.Div>
        <Interactive.Div
          name="Tagline"
          style={{
            marginTop: 54,
            fontFamily: sans,
            fontSize: 50,
            color: "#f3c96f",
            opacity: interpolate(frame, [44, 68], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [44, 72], ["0px 18px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          Type a field. Watch it flow.
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
