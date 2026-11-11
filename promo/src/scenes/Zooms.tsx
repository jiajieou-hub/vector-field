import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";

const ease = Easing.bezier(0.65, 0, 0.35, 1);

/* Push in on the components panel while the formulas are typed; pull back just as the
   second one takes effect on the bar line (frame 111), to show the new field */
export const TypeZoom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Push in"
      style={{
        width: 1440,
        height: 810,
        transformOrigin: "97% 20%",
        scale: interpolate(frame, [6, 20, 99, 113], [1, 1.6, 1.6, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease,
          output: "perceptual-scale",
        }),
      }}
    >
      {children}
    </Interactive.Div>
  );
};

/* Push in on the result card once the loop closes on the bar line (frame 117) */
export const LoopZoom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Push in"
      style={{
        width: 1440,
        height: 810,
        transformOrigin: "98% 3%",
        scale: interpolate(frame, [119, 137], [1, 1.4], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease,
          output: "perceptual-scale",
        }),
      }}
    >
      {children}
    </Interactive.Div>
  );
};
