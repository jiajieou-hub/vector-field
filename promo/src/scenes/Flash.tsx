import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { mono } from "../theme";

/* A short full-screen shot for the fast cuts. It lands with a small push back and a
   flash of light: "A" (the first note of a motif) harder than "B" (the quick notes). */
export const Flash: React.FC<{
  clip: string;
  label: string;
  scale?: number;
  punch?: "A" | "B";
}> = ({ clip, label, scale = 1, punch = "B" }) => {
  const frame = useCurrentFrame();
  const hard = punch === "A";
  return (
    <AbsoluteFill name="Flash" style={{ backgroundColor: "#090c12" }}>
      <Video
        name="Footage"
        src={staticFile(`clips/${clip}.webm`)}
        muted
        style={{
          width: 1920,
          height: 1080,
          scale: interpolate(frame, [0, hard ? 14 : 7], [scale * (hard ? 1.14 : 1.07), scale], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      />
      <AbsoluteFill
        name="Vignette"
        style={{
          background:
            "radial-gradient(1300px 760px at 50% 50%, rgba(9,12,18,0) 55%, rgba(9,12,18,0.55))",
        }}
      />
      <Interactive.Div
        name="Label"
        style={{
          position: "absolute",
          left: 72,
          bottom: 60,
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: mono,
          fontSize: 28,
          color: "rgba(236,230,216,0.86)",
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
        }}
      >
        <Interactive.Div
          name="Tick"
          style={{ width: 28, height: 2, backgroundColor: "#f3c96f" }}
        />
        {label}
      </Interactive.Div>
      <AbsoluteFill
        name="Light"
        style={{
          backgroundColor: "#fff8e8",
          opacity: interpolate(frame, [0, hard ? 6 : 3], [hard ? 0.32 : 0.16, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
