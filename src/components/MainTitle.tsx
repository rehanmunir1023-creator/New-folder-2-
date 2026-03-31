import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * "Motion Transfer / Motion Control" headline.
 * Springs up from y=22 starting at frame 60.
 */
export const MainTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - 60,
    fps,
    config: { damping: 16, stiffness: 100, mass: 1 },
    durationInFrames: 40,
  });

  const opacity = interpolate(frame, [60, 82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(progress, [0, 1], [22, 0]);

  return (
    <h1
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontWeight: 300,
        fontSize: 52,
        letterSpacing: "0.01em",
        color: "rgba(235,245,255,0.96)",
        margin: 0,
        marginTop: 12,
        opacity,
        transform: `translateY(${translateY}px)`,
        textShadow: "0 0 60px rgba(80,160,255,0.25)",
        whiteSpace: "nowrap",
      }}
    >
      Motion Transfer&nbsp;/&nbsp;Motion Control
    </h1>
  );
};
