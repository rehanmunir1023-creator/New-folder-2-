import { interpolate, useCurrentFrame } from "remotion";

const COLS = 5;
const ROWS = 4;
const CELL_W = 130;
const CELL_H = 90;

/**
 * The bottom-left circuit-board grid: grid lines draw in progressively,
 * then small dots pulse at each intersection.
 *
 * Draw-in starts at frame 15, completes at frame 55.
 */
export const TechGrid: React.FC = () => {
  const frame = useCurrentFrame();

  const gridOpacity = interpolate(frame, [15, 55], [0, 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Clip-path reveals lines left-to-right
  const clipX = interpolate(frame, [20, 60], [0, COLS * CELL_W], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dotPulse = interpolate(
    Math.sin((frame / 30) * Math.PI * 2),
    [-1, 1],
    [0.4, 1]
  );

  const totalW = COLS * CELL_W;
  const totalH = ROWS * CELL_H;

  return (
    <div
      style={{
        position: "absolute",
        bottom: -20,
        left: -20,
        width: totalW,
        height: totalH,
        opacity: gridOpacity,
        // clip reveals from left
        clipPath: `inset(0 ${totalW - clipX}px 0 0)`,
      }}
    >
      <svg
        width={totalW}
        height={totalH}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Horizontal lines */}
        {Array.from({ length: ROWS + 1 }).map((_, r) => (
          <line
            key={`h${r}`}
            x1={0}
            y1={r * CELL_H}
            x2={totalW}
            y2={r * CELL_H}
            stroke="rgba(100,180,255,0.5)"
            strokeWidth={0.8}
          />
        ))}

        {/* Vertical lines */}
        {Array.from({ length: COLS + 1 }).map((_, c) => (
          <line
            key={`v${c}`}
            x1={c * CELL_W}
            y1={0}
            x2={c * CELL_W}
            y2={totalH}
            stroke="rgba(100,180,255,0.5)"
            strokeWidth={0.8}
          />
        ))}

        {/* Intersection dots */}
        {Array.from({ length: ROWS + 1 }).map((_, r) =>
          Array.from({ length: COLS + 1 }).map((_, c) => (
            <circle
              key={`d${r}-${c}`}
              cx={c * CELL_W}
              cy={r * CELL_H}
              r={3}
              fill={`rgba(120,200,255,${dotPulse})`}
            />
          ))
        )}
      </svg>
    </div>
  );
};
