import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/**
 * Deep navy radial-gradient background with a sparse dot-grid overlay.
 * Fades in over the first 20 frames.
 */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Base gradient */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 50%, #0d2a4a 0%, #071526 55%, #030c18 100%)",
        }}
      />

      {/* Subtle dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(100,160,220,0.18) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </AbsoluteFill>
  );
};
