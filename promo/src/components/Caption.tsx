import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { sans, serif } from "../theme";

/* Kicker and title above the app window */
export const Caption: React.FC<{ kicker: string; title: string }> = ({
  kicker,
  title,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Interactive.Div
        name="Kicker"
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          width: 1920,
          textAlign: "center",
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 24,
          letterSpacing: "0.24em",
          color: "#f3c96f",
          opacity: interpolate(frame, [4, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [4, 20], ["0px 12px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {kicker}
      </Interactive.Div>
      <Interactive.Div
        name="Title"
        style={{
          position: "absolute",
          top: 86,
          left: 0,
          width: 1920,
          textAlign: "center",
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 64,
          lineHeight: 1.1,
          color: "#ece6d8",
          opacity: interpolate(frame, [8, 26], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [8, 26], ["0px 16px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {title}
      </Interactive.Div>
    </>
  );
};

/* Kicker and a two-line title on the left, over full-screen footage that sits to the right */
export const SideCaption: React.FC<{ kicker: string; title: string }> = ({
  kicker,
  title,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Interactive.Div
        name="Scrim"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1100,
          height: 1080,
          background:
            "linear-gradient(to right, rgba(9,12,18,0.9), rgba(9,12,18,0.6) 45%, rgba(9,12,18,0))",
        }}
      />
      <Interactive.Div
        name="Caption"
        style={{
          position: "absolute",
          left: 120,
          bottom: 140,
          width: 780,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <Interactive.Div
          name="Kicker"
          style={{
            fontFamily: sans,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: "0.24em",
            color: "#f3c96f",
            opacity: interpolate(frame, [6, 22], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [6, 22], ["0px 12px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {kicker}
        </Interactive.Div>
        <Interactive.Div
          name="Title"
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 80,
            lineHeight: 1.08,
            color: "#ece6d8",
            opacity: interpolate(frame, [10, 28], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [10, 28], ["0px 16px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {title}
        </Interactive.Div>
      </Interactive.Div>
    </>
  );
};
