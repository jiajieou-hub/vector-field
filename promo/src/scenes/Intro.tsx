import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { bar, f } from "../timeline";
import { sans, serif } from "../theme";

/* The music fades in over the first bars; the field fades in with it. The three words of
   the name land on the first three beats of bar 1, the tagline on bar 2. */
const WORDS = ["Vector", "Field", "Sketchpad"];

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const tag = f(bar(2));
  return (
    <AbsoluteFill name="Intro" style={{ backgroundColor: "#090c12" }}>
      <Video
        name="Flowing particles"
        src={staticFile("clips/bg.webm")}
        muted
        style={{
          width: 1920,
          height: 1080,
          opacity: interpolate(frame, [0, f(bar(1))], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.4, 0, 0.6, 1),
          }),
          scale: interpolate(frame, [0, f(bar(3))], [1.36, 1.2], {
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
            display: "flex",
            gap: "0.26em",
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 136,
            letterSpacing: "-0.01em",
            color: "#ece6d8",
          }}
        >
          {WORDS.map((w, i) => {
            const t = f(bar(1, 1 + i));
            return (
              <Interactive.Div
                key={w}
                name={w}
                style={{
                  opacity: interpolate(frame, [t, t + 4], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  translate: interpolate(frame, [t, t + 10], ["0px 34px", "0px 0px"], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  }),
                }}
              >
                {w}
              </Interactive.Div>
            );
          })}
        </Interactive.Div>
        <Interactive.Div
          name="Tagline"
          style={{
            marginTop: 54,
            fontFamily: sans,
            fontSize: 50,
            color: "#f3c96f",
            opacity: interpolate(frame, [tag, tag + 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [tag, tag + 14], ["0px 18px", "0px 0px"], {
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
