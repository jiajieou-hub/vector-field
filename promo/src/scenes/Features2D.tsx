import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { WindowScene } from "./WindowScene";

/* Push in on the components panel while the formula is typed, then pull back to see the field change */
const TypeZoom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Push in"
      style={{
        width: 1440,
        height: 810,
        transformOrigin: "97% 20%",
        scale: interpolate(frame, [16, 40, 128, 152], [1, 1.6, 1.6, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.65, 0, 0.35, 1),
          output: "perceptual-scale",
        }),
      }}
    >
      {children}
    </Interactive.Div>
  );
};

export const TypeScene: React.FC = () => (
  <WindowScene
    clip="type"
    kicker="01 · ANY FIELD"
    title="Type a formula, in plain math or LaTeX"
    zoom={TypeZoom}
  />
);

export const StylesScene: React.FC = () => (
  <WindowScene
    clip="styles"
    kicker="02 · SEE IT YOUR WAY"
    title="Arrows, streamlines, particles and heat-maps"
  />
);

export const ProbeScene: React.FC = () => (
  <WindowScene
    clip="probe"
    kicker="03 · PROBE ANY POINT"
    title="Read F, div F and curl F as you drag"
  />
);

export const HopfScene: React.FC = () => (
  <WindowScene
    clip="hopf"
    kicker="04 · DYNAMICAL SYSTEMS"
    title="Drag a parameter, watch a limit cycle appear"
  />
);

/* Pull in on the result card once the loop is closed */
const LoopZoom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Push in"
      style={{
        width: 1440,
        height: 810,
        transformOrigin: "65% 4%",
        scale: interpolate(frame, [168, 196], [1, 1.35], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.65, 0, 0.35, 1),
          output: "perceptual-scale",
        }),
      }}
    >
      {children}
    </Interactive.Div>
  );
};

export const LoopScene: React.FC = () => (
  <WindowScene
    clip="loop"
    kicker="05 · LINE INTEGRALS"
    title="Draw a loop to get circulation and flux"
    zoom={LoopZoom}
  />
);

export const GreenScene: React.FC = () => (
  <WindowScene
    clip="green"
    kicker="06 · THEOREMS, STEP BY STEP"
    title="See why Green's theorem works"
  />
);
