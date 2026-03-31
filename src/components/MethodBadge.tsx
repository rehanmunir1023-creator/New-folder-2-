import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * "Method #1" pill badge.
 * Springs in from y=-12 at frame 40, settles by ~frame 75.
 */
export const MethodBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
    durationInFrames: 35,
  });

  const opacity = interpolate(frame, [40, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(progress, [0, 1], [-14, 0]);

  return (
    <div
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${translateY}px)`,
        background: "linear-gradient(135deg, #1a4a7a 0%, #1e5a9a 100%)",
        border: "1px solid rgba(100,180,255,0.35)",
        borderRadius: 999,
        padding: "6px 22px",
        backdropFilter: "blur(8px)",
        boxShadow:
          "0 2px 20px rgba(30,90,160,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <span
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 300,
          fontSize: 15,
          letterSpacing: "0.06em",
          color: "rgba(210,230,255,0.9)",
        }}
      >
        Method #1
      </span>
    </div>
  );
};
