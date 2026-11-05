import { Video } from "@remotion/media";
import { AbsoluteFill, Interactive, staticFile } from "remotion";
import { sans, serif, zh } from "./theme";

/* YouTube thumbnail, 1280 x 720. Render with: npx remotion still Thumbnail out/thumbnail.png */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill name="Thumbnail" style={{ backgroundColor: "#090c12" }}>
    <Video
      name="Lorenz attractor"
      src={staticFile("clips/lorenz.webm")}
      trimBefore={150}
      muted
      style={{
        position: "absolute",
        left: 360,
        top: -40,
        width: 1066,
        height: 600,
        scale: 1.35,
      }}
    />
    <AbsoluteFill
      name="Fade to the left"
      style={{
        background:
          "linear-gradient(90deg, #090c12 0%, #090c12 34%, rgba(9,12,18,0.6) 52%, rgba(9,12,18,0) 70%)",
      }}
    />
    <Interactive.Div
      name="Title"
      style={{
        position: "absolute",
        left: 64,
        top: 168,
        width: 640,
        fontFamily: serif,
        fontWeight: 600,
        fontSize: 104,
        lineHeight: 1.0,
        color: "#ece6d8",
      }}
    >
      Vector Field Sketchpad
    </Interactive.Div>
    <Interactive.Div
      name="Chinese name"
      style={{
        position: "absolute",
        left: 68,
        top: 392,
        fontFamily: zh,
        fontWeight: 500,
        fontSize: 38,
        letterSpacing: "0.3em",
        color: "#b9b2a3",
      }}
    >
      向量场画板
    </Interactive.Div>
    <Interactive.Div
      name="Tagline"
      style={{
        position: "absolute",
        left: 64,
        top: 478,
        padding: "10px 22px",
        borderRadius: 999,
        backgroundColor: "rgba(243,201,111,0.14)",
        border: "2px solid rgba(243,201,111,0.6)",
        fontFamily: sans,
        fontWeight: 600,
        fontSize: 36,
        color: "#f3c96f",
      }}
    >
      Free · in your browser
    </Interactive.Div>
  </AbsoluteFill>
);
