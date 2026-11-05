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

/* Kicker and title in the lower left, over full-screen footage */
export const LowerCaption: React.FC<{ kicker: string; title: string }> = ({
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
          bottom: 0,
          width: 1920,
          height: 420,
          background:
            "linear-gradient(to top, rgba(9,12,18,0.85), rgba(9,12,18,0))",
        }}
      />
      <Interactive.Div
        name="Kicker"
        style={{
          position: "absolute",
          left: 120,
          bottom: 196,
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
          position: "absolute",
          left: 120,
          bottom: 104,
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 76,
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
    </>
  );
};
