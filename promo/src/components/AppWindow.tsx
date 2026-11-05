import { AbsoluteFill, Interactive } from "remotion";
import { mono } from "../theme";

/* A plain browser window that holds the screen recording (1440 x 810 inside) */
export const AppWindow: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Interactive.Div
      name="Window"
      style={{
        position: "absolute",
        left: 240,
        top: 196,
        width: 1440,
        height: 850,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: "#0b0e14",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
      }}
    >
      <Interactive.Div
        name="Title bar"
        style={{
          position: "relative",
          height: 40,
          backgroundColor: "#131722",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Interactive.Div
          name="Window buttons"
          style={{
            position: "absolute",
            left: 18,
            top: 14,
            display: "flex",
            gap: 8,
          }}
        >
          <Interactive.Div
            name="Close"
            style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#ff5f57" }}
          />
          <Interactive.Div
            name="Minimise"
            style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#febc2e" }}
          />
          <Interactive.Div
            name="Zoom"
            style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#28c840" }}
          />
        </Interactive.Div>
        <Interactive.Div
          name="Address"
          style={{
            position: "absolute",
            left: 520,
            top: 7,
            width: 400,
            height: 26,
            borderRadius: 8,
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "#9aa3b2",
            fontFamily: mono,
            fontSize: 14,
            lineHeight: "26px",
            textAlign: "center",
          }}
        >
          jiajieou-hub.github.io/vector-field
        </Interactive.Div>
      </Interactive.Div>
      <AbsoluteFill
        name="Screen"
        style={{ top: 40, width: 1440, height: 810, overflow: "hidden" }}
      >
        {children}
      </AbsoluteFill>
    </Interactive.Div>
  );
};

/* Dark backdrop with a faint glow, shared by the window scenes */
export const Backdrop: React.FC = () => (
  <AbsoluteFill
    name="Backdrop"
    style={{
      background:
        "radial-gradient(1400px 800px at 50% 70%, rgba(80,110,160,0.16), rgba(9,12,18,0) 70%), #090c12",
    }}
  />
);
