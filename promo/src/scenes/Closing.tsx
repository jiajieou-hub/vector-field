import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { mono, sans, serif, zh } from "../theme";

const Shade: React.FC = () => (
  <AbsoluteFill
    name="Shade"
    style={{
      background:
        "radial-gradient(1100px 650px at 50% 50%, rgba(9,12,18,0.7), rgba(9,12,18,0.92))",
    }}
  />
);

/* Four short facts, one after another */
export const Facts: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Facts" style={{ backgroundColor: "#090c12" }}>
      <Video
        name="Flowing particles"
        src={staticFile("clips/bg.webm")}
        trimBefore={120}
        muted
        style={{ width: 1920, height: 1080, scale: 1.2 }}
      />
      <Shade />
      <AbsoluteFill
        name="List"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 34,
          fontFamily: sans,
          fontSize: 54,
          color: "#ece6d8",
        }}
      >
        <Interactive.Div
          name="Fact 1"
          style={{
            opacity: interpolate(frame, [6, 22], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [6, 26], ["0px 16px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          Runs in your browser. Nothing to install.
        </Interactive.Div>
        <Interactive.Div
          name="Fact 2"
          style={{
            opacity: interpolate(frame, [18, 34], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [18, 38], ["0px 16px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          Share any view as a link.
        </Interactive.Div>
        <Interactive.Div
          name="Fact 3"
          style={{
            opacity: interpolate(frame, [30, 46], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [30, 50], ["0px 16px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          In English and <span style={{ fontFamily: zh }}>中文</span>.
        </Interactive.Div>
        <Interactive.Div
          name="Fact 4"
          style={{
            color: "#f3c96f",
            opacity: interpolate(frame, [42, 58], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [42, 62], ["0px 16px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          Free and open source.
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Outro" style={{ backgroundColor: "#090c12" }}>
      <Video
        name="Flowing particles"
        src={staticFile("clips/bg.webm")}
        muted
        style={{ width: 1920, height: 1080, scale: 1.2 }}
      />
      <Shade />
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
          name="Call to action"
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 104,
            color: "#ece6d8",
            opacity: interpolate(frame, [6, 26], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [6, 32], ["0px 24px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          Try it now
        </Interactive.Div>
        <Interactive.Div
          name="Address"
          style={{
            marginTop: 40,
            padding: "18px 40px",
            borderRadius: 999,
            border: "1px solid rgba(243,201,111,0.45)",
            backgroundColor: "rgba(243,201,111,0.08)",
            fontFamily: mono,
            fontSize: 56,
            color: "#f3c96f",
            opacity: interpolate(frame, [20, 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [20, 44], [0.94, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: "perceptual-scale",
            }),
          }}
        >
          jiajieou-hub.github.io/vector-field
        </Interactive.Div>
        <Interactive.Div
          name="Source"
          style={{
            marginTop: 40,
            fontFamily: sans,
            fontSize: 34,
            color: "#9aa3b2",
            opacity: interpolate(frame, [36, 56], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Source code: github.com/jiajieou-hub/vector-field
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
