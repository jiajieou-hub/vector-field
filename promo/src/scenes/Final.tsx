import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Q, f } from "../timeline";
import { mono, sans, serif } from "../theme";

/* The closing card lands on the last drum hit: a flash, a ring of light, the name
   settling into place; the address and one line follow on the next two beats, and the
   picture fades out with the drum's ring. */
export const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b1 = f(Q), b2 = f(2 * Q);
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const out = Easing.bezier(0.16, 1, 0.3, 1);
  return (
    <AbsoluteFill name="Final" style={{ backgroundColor: "#090c12" }}>
      <AbsoluteFill
        name="Picture"
        style={{
          opacity: interpolate(frame, [durationInFrames - 34, durationInFrames - 2], [1, 0], clamp),
        }}
      >
        <Video
          name="Flowing particles"
          src={staticFile("clips/bg.webm")}
          trimBefore={60}
          muted
          style={{
            width: 1920,
            height: 1080,
            scale: interpolate(frame, [0, durationInFrames], [1.12, 1.24], clamp),
          }}
        />
        <AbsoluteFill
          name="Shade"
          style={{
            background:
              "radial-gradient(1100px 650px at 50% 50%, rgba(9,12,18,0.62), rgba(9,12,18,0.93))",
          }}
        />
        <AbsoluteFill
          name="Ring"
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Interactive.Div
            name="Ring of light"
            style={{
              width: 900,
              height: 900,
              borderRadius: "50%",
              border: "3px solid #f3c96f",
              boxShadow: "0 0 60px rgba(243,201,111,0.5), inset 0 0 60px rgba(243,201,111,0.3)",
              scale: interpolate(frame, [0, 26], [0.18, 2.3], { ...clamp, easing: Easing.bezier(0.1, 0.7, 0.3, 1) }),
              opacity: interpolate(frame, [0, 4, 26], [0, 0.9, 0], clamp),
            }}
          />
        </AbsoluteFill>
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
              fontSize: 128,
              color: "#ece6d8",
              textShadow: "0 0 40px rgba(243,201,111,0.25)",
              scale: interpolate(frame, [0, 12], [1.18, 1], { ...clamp, easing: out, output: "perceptual-scale" }),
              opacity: interpolate(frame, [0, 2], [0, 1], clamp),
            }}
          >
            Vector Field Sketchpad
          </Interactive.Div>
          <Interactive.Div
            name="Address"
            style={{
              marginTop: 44,
              padding: "18px 40px",
              borderRadius: 999,
              border: "1px solid rgba(243,201,111,0.5)",
              backgroundColor: "rgba(243,201,111,0.09)",
              fontFamily: mono,
              fontSize: 52,
              color: "#f3c96f",
              opacity: interpolate(frame, [b1, b1 + 4], [0, 1], clamp),
              translate: interpolate(frame, [b1, b1 + 12], ["0px 18px", "0px 0px"], { ...clamp, easing: out }),
            }}
          >
            jiajieou-hub.github.io/vector-field
          </Interactive.Div>
          <Interactive.Div
            name="Facts"
            style={{
              marginTop: 40,
              fontFamily: sans,
              fontSize: 34,
              letterSpacing: "0.04em",
              color: "#b9b2a3",
              opacity: interpolate(frame, [b2, b2 + 6], [0, 1], clamp),
            }}
          >
            Free and open source · Runs in your browser
          </Interactive.Div>
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill
        name="Hit flash"
        style={{
          backgroundColor: "#fff8e8",
          opacity: interpolate(frame, [0, 8], [0.55, 0], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
