import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ORBITRON_B64, RAJDHANI_BOLD_B64, RAJDHANI_REG_B64 } from "./fonts";

// ── Fonts: injected as base64 data URIs — no network requests during render ──
const ORBITRON = "Orbitron";
const RAJDHANI = "Rajdhani";

const FONT_CSS = `
@font-face {
  font-family: '${ORBITRON}';
  src: url('data:font/woff2;base64,${ORBITRON_B64}') format('woff2');
  font-weight: 100 900;
  font-display: block;
}
@font-face {
  font-family: '${RAJDHANI}';
  src: url('data:font/woff2;base64,${RAJDHANI_REG_B64}') format('woff2');
  font-weight: 400;
  font-display: block;
}
@font-face {
  font-family: '${RAJDHANI}';
  src: url('data:font/woff2;base64,${RAJDHANI_BOLD_B64}') format('woff2');
  font-weight: 600 700;
  font-display: block;
}
`;

// Inject @font-face CSS at module load. No delayRender needed:
// base64 fonts have no network round-trip, so font-display:block ensures
// they are available before the browser paints any frame.
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = FONT_CSS;
  document.head.appendChild(styleEl);
}

// ── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#030812",
  cyan: "#00e5ff",
  magenta: "#e040fb",
  orange: "#ff6d00",
  gold: "#ffd740",
  purple: "#7c4dff",
  green: "#00e676",
  text: "#ecf0ff",
  muted: "#4a6080",
  card: "rgba(5, 15, 35, 0.95)",
} as const;

// ── Helpers ──────────────────────────────────────────────────────────────────
const glow = (color: string, size = 20) =>
  `0 0 ${size}px ${color}, 0 0 ${size * 2}px ${color}44`;

// ── CyberGrid background ──────────────────────────────────────────────────────
const CyberGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  const gridOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scanY = (frame * 3) % height;

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* Grid lines */}
      <AbsoluteFill
        style={{
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(rgba(0,229,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 140% 100% at 50% 50%, transparent 35%, rgba(3,8,18,0.75) 100%)",
        }}
      />
      {/* Scanline */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: 2,
          top: scanY,
          background: `linear-gradient(90deg, transparent, ${C.cyan}55, transparent)`,
          filter: "blur(1px)",
        }}
      />
      {/* Corner brackets */}
      {(
        [
          { top: 18, left: 18, borderTop: true, borderLeft: true },
          { top: 18, right: 18, borderTop: true, borderRight: true },
          { bottom: 18, left: 18, borderBottom: true, borderLeft: true },
          { bottom: 18, right: 18, borderBottom: true, borderRight: true },
        ] as Array<Record<string, unknown>>
      ).map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...(pos.top !== undefined ? { top: pos.top as number } : {}),
            ...(pos.bottom !== undefined
              ? { bottom: pos.bottom as number }
              : {}),
            ...(pos.left !== undefined ? { left: pos.left as number } : {}),
            ...(pos.right !== undefined ? { right: pos.right as number } : {}),
            width: 48,
            height: 48,
            borderTop: pos.borderTop ? `2px solid ${C.cyan}aa` : undefined,
            borderBottom: pos.borderBottom
              ? `2px solid ${C.cyan}aa`
              : undefined,
            borderLeft: pos.borderLeft ? `2px solid ${C.cyan}aa` : undefined,
            borderRight: pos.borderRight ? `2px solid ${C.cyan}aa` : undefined,
            opacity: gridOpacity,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ── Title section ─────────────────────────────────────────────────────────────
const TitleSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 18, stiffness: 180 } });
  const subtitleOpacity = interpolate(frame, [45, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(frame, [70, 120], [0, 100], {
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(titleSpring, [0, 1], [50, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "28px 80px 16px",
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: ORBITRON,
          fontSize: 50,
          fontWeight: 900,
          color: C.text,
          lineHeight: 1.2,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          letterSpacing: "0.04em",
        }}
      >
        The{" "}
        <span
          style={{
            color: C.gold,
            textShadow: glow(C.gold, 16),
          }}
        >
          Nano Banana Pro
        </span>{" "}
        <span
          style={{
            color: C.cyan,
            textShadow: glow(C.cyan, 16),
          }}
        >
          Prompting Blueprint
        </span>
      </div>

      <div
        style={{
          fontFamily: RAJDHANI,
          fontSize: 18,
          color: C.muted,
          marginTop: 10,
          opacity: subtitleOpacity,
          lineHeight: 1.5,
          maxWidth: 1200,
          margin: "10px auto 0",
        }}
      >
        Nano Banana is a streamlined AI image generator. Replace vague
        descriptions with a specific{" "}
        <span style={{ color: C.cyan }}>6-part structural formula</span> that
        emphasises technical camera settings and environmental lighting.
      </div>

      {/* Divider line */}
      <div
        style={{
          width: `${lineWidth}%`,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.cyan}, ${C.magenta}, ${C.cyan}, transparent)`,
          margin: "14px auto 0",
          boxShadow: `0 0 8px ${C.cyan}66`,
        }}
      />
    </div>
  );
};

// ── Six-Part Wheel ────────────────────────────────────────────────────────────
const WHEEL_ITEMS = [
  {
    label: "SUBJECT",
    desc: "Combine Subject",
    angle: 28,
    color: C.gold,
    delay: 30,
  },
  {
    label: "ACTION",
    desc: "Action",
    angle: 100,
    color: C.orange,
    delay: 50,
  },
  {
    label: "ENVIRONMENT",
    desc: "Environment",
    angle: 162,
    color: C.cyan,
    delay: 70,
  },
  {
    label: "ART STYLE",
    desc: 'Use camera models\nlike "Canon SD Mark IV"\nto define image quality.',
    angle: 218,
    color: C.magenta,
    delay: 90,
  },
  {
    label: "LIGHTING",
    desc: 'Replace "nice lighting" with\n"dramatic window lighting\ncreating a rim light effect."',
    angle: 272,
    color: C.purple,
    delay: 110,
  },
  {
    label: "DETAILS",
    desc: "Details for\nconsistency.",
    angle: 332,
    color: C.green,
    delay: 130,
  },
];

const WheelSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 290;
  const CY = 310;
  const RING_R = 155;
  const LABEL_R = 240;

  const headerSpring = spring({ frame, fps, config: { damping: 200 } });
  const centerScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const centerOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Animated ring rotation
  const ringRotation = interpolate(frame, [0, 600], [0, 30]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        padding: "14px 10px 14px 40px",
        boxSizing: "border-box",
      }}
    >
      {/* Section header */}
      <div
        style={{
          fontFamily: ORBITRON,
          fontSize: 26,
          fontWeight: 700,
          color: C.text,
          opacity: headerSpring,
          transform: `translateX(${interpolate(headerSpring, [0, 1], [-20, 0])}px)`,
          marginBottom: 8,
          letterSpacing: "0.07em",
        }}
      >
        <span style={{ color: C.cyan, textShadow: glow(C.cyan, 12) }}>
          The Six-Part Framework
        </span>
      </div>

      {/* SVG circle + connection lines */}
      <svg
        style={{ position: "absolute", top: 60, left: 30, overflow: "visible" }}
        width={600}
        height={640}
        viewBox="0 0 600 640"
      >
        <defs>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a1a40" />
            <stop offset="100%" stopColor="#030812" />
          </radialGradient>
        </defs>

        {/* Outer rotating dashed ring */}
        <circle
          cx={CX}
          cy={CY}
          r={RING_R + 28}
          fill="none"
          stroke={C.cyan}
          strokeWidth={1}
          strokeOpacity={centerOpacity * 0.3}
          strokeDasharray="8 12"
          transform={`rotate(${ringRotation}, ${CX}, ${CY})`}
        />

        {/* Main ring */}
        <circle
          cx={CX}
          cy={CY}
          r={RING_R * centerScale}
          fill="url(#center-grad)"
          stroke={C.cyan}
          strokeWidth={2.5}
          strokeOpacity={0.85}
          filter="url(#glow-filter)"
        />

        {/* Inner accent ring */}
        <circle
          cx={CX}
          cy={CY}
          r={(RING_R - 22) * centerScale}
          fill="none"
          stroke={C.magenta}
          strokeWidth={1}
          strokeOpacity={centerOpacity * 0.35}
          strokeDasharray="4 8"
        />

        {/* Connection lines to each item */}
        {WHEEL_ITEMS.map((item) => {
          const rad = ((item.angle - 90) * Math.PI) / 180;
          const x1 = CX + Math.cos(rad) * (RING_R + 5);
          const y1 = CY + Math.sin(rad) * (RING_R + 5);
          const x2 = CX + Math.cos(rad) * (LABEL_R - 10);
          const y2 = CY + Math.sin(rad) * (LABEL_R - 10);

          const lp = interpolate(frame - item.delay - 5, [0, 18], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });

          return (
            <line
              key={item.label}
              x1={x1}
              y1={y1}
              x2={x1 + (x2 - x1) * lp}
              y2={y1 + (y2 - y1) * lp}
              stroke={item.color}
              strokeWidth={1.5}
              strokeOpacity={0.75}
            />
          );
        })}

        {/* Center dot */}
        <circle
          cx={CX}
          cy={CY}
          r={6 * centerScale}
          fill={C.cyan}
          opacity={centerOpacity}
          filter="url(#glow-filter)"
        />
      </svg>

      {/* Center label (overlaid on SVG) */}
      <div
        style={{
          position: "absolute",
          top: 60 + CY - 55,
          left: 30 + CX - 120,
          width: 240,
          textAlign: "center",
          opacity: centerOpacity,
          transform: `scale(${centerScale})`,
          transformOrigin: "center center",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: 34, lineHeight: 1 }}>🔭</div>
        <div
          style={{
            fontFamily: ORBITRON,
            fontSize: 14,
            fontWeight: 700,
            color: C.text,
            lineHeight: 1.35,
            marginTop: 6,
          }}
        >
          Precision Over
          <br />
          <span style={{ color: C.cyan, textShadow: glow(C.cyan, 8) }}>
            Vague Adjectives
          </span>
        </div>
      </div>

      {/* Wheel item labels */}
      {WHEEL_ITEMS.map((item) => {
        const rad = ((item.angle - 90) * Math.PI) / 180;
        const lx = 30 + CX + Math.cos(rad) * LABEL_R;
        const ly = 60 + CY + Math.sin(rad) * LABEL_R;

        const itemSpring = spring({
          frame: frame - item.delay,
          fps,
          config: { damping: 14, stiffness: 180 },
        });
        const itemOpacity = interpolate(frame - item.delay, [0, 14], [0, 1], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
        });

        // Determine text anchor based on angle
        const isRight = item.angle > 10 && item.angle < 170;
        const isLeft = item.angle > 190 && item.angle < 350;
        const anchor: "left" | "right" | "center" = isRight
          ? "left"
          : isLeft
          ? "right"
          : "center";
        const offsetX = isRight ? 0 : isLeft ? -170 : -85;

        return (
          <div
            key={item.label}
            style={{
              position: "absolute",
              left: lx + offsetX,
              top: ly - 32,
              width: 172,
              textAlign: anchor,
              opacity: itemOpacity,
              transform: `scale(${itemSpring})`,
              transformOrigin:
                anchor === "left"
                  ? "left center"
                  : anchor === "right"
                  ? "right center"
                  : "center center",
            }}
          >
            <div
              style={{
                fontFamily: ORBITRON,
                fontSize: 13,
                fontWeight: 700,
                color: item.color,
                textShadow: glow(item.color, 6),
                letterSpacing: "0.1em",
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontFamily: RAJDHANI,
                fontSize: 12,
                color: C.muted,
                lineHeight: 1.45,
                marginTop: 2,
                whiteSpace: "pre-line",
              }}
            >
              {item.desc}
            </div>
          </div>
        );
      })}

      {/* Right-pointing chevron */}
      <div
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          marginTop: -28,
          fontFamily: ORBITRON,
          fontSize: 48,
          color: C.cyan,
          textShadow: glow(C.cyan, 20),
          opacity: interpolate(frame, [140, 180], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        ›
      </div>
    </div>
  );
};

// ── Beginner vs Pro Comparison ────────────────────────────────────────────────
const COMPARISON_ROWS = [
  {
    type: "Lifestyle",
    icon: "☕",
    beginner: "Woman in cafe",
    pro: "Woman, smiling, cozy cafe, Canon 5D, natural window light.",
    delay: 30,
  },
  {
    type: "Portrait",
    icon: "👤",
    beginner: "Professional man",
    pro: "Executive, 85mm lens, medium format film, dramatic rim lighting.",
    delay: 60,
  },
  {
    type: "Product",
    icon: "⌚",
    beginner: "High-end watch",
    pro: "Watch face, macro lens, sharp craftsmanship details, controlled studio lighting.",
    delay: 90,
  },
];

const ComparisonSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ frame, fps, config: { damping: 200 } });
  const colHeaderOpacity = interpolate(frame, [12, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        padding: "16px 24px 12px 18px",
        boxSizing: "border-box",
        height: "100%",
      }}
    >
      <div
        style={{
          fontFamily: ORBITRON,
          fontSize: 20,
          fontWeight: 700,
          color: C.text,
          opacity: headerSpring,
          transform: `translateX(${interpolate(headerSpring, [0, 1], [20, 0])}px)`,
          marginBottom: 12,
          letterSpacing: "0.05em",
        }}
      >
        Beginner vs.{" "}
        <span style={{ color: C.orange, textShadow: glow(C.orange, 10) }}>
          Pro Formula
        </span>{" "}
        Prompts
      </div>

      {/* Column headers */}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 74 }} />
        <div
          style={{
            flex: 1,
            background: "rgba(0,229,255,0.08)",
            border: `1px solid ${C.cyan}55`,
            borderRadius: 6,
            padding: "5px 10px",
            fontFamily: ORBITRON,
            fontSize: 12,
            color: C.cyan,
            textAlign: "center",
            opacity: colHeaderOpacity,
            textShadow: glow(C.cyan, 6),
          }}
        >
          Beginner Prompt
        </div>
        <div
          style={{
            flex: 1.55,
            background: "rgba(224,64,251,0.08)",
            border: `1px solid ${C.magenta}55`,
            borderRadius: 6,
            padding: "5px 10px",
            fontFamily: ORBITRON,
            fontSize: 12,
            color: C.magenta,
            textAlign: "center",
            opacity: colHeaderOpacity,
            textShadow: glow(C.magenta, 6),
          }}
        >
          Pro Formula Prompt
        </div>
      </div>

      {COMPARISON_ROWS.map((row) => {
        const rowSpring = spring({
          frame: frame - row.delay,
          fps,
          config: { damping: 18, stiffness: 160 },
        });
        const rowOpacity = interpolate(frame - row.delay, [0, 14], [0, 1], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
        });

        return (
          <div
            key={row.type}
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 9,
              opacity: rowOpacity,
              transform: `translateY(${interpolate(rowSpring, [0, 1], [18, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 74,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
              }}
            >
              <div style={{ fontSize: 18 }}>{row.icon}</div>
              <div
                style={{
                  fontFamily: RAJDHANI,
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.gold,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {row.type}:
              </div>
            </div>

            <div
              style={{
                flex: 1,
                background: "rgba(0,229,255,0.04)",
                border: `1px solid ${C.cyan}25`,
                borderRadius: 6,
                padding: "8px 10px",
                fontFamily: RAJDHANI,
                fontSize: 13,
                color: C.text,
                display: "flex",
                alignItems: "center",
              }}
            >
              {row.beginner}
            </div>

            <div
              style={{
                flex: 1.55,
                background: "rgba(224,64,251,0.04)",
                border: `1px solid ${C.magenta}25`,
                borderRadius: 6,
                padding: "8px 10px",
                fontFamily: RAJDHANI,
                fontSize: 12,
                color: C.text,
                lineHeight: 1.45,
                display: "flex",
                alignItems: "center",
              }}
            >
              {row.pro}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Expert Techniques ─────────────────────────────────────────────────────────
const EXPERT_ITEMS = [
  {
    title: "Portraiture &\nLens Compression",
    desc: "Specifying an 85mm lens on medium format film ensures professional background bokeh.",
    icon: "📸",
    color: C.cyan,
    delay: 8,
  },
  {
    title: 'Architectural\n"Golden Hour"',
    desc: "Use timing specifications to dictate how light interacts with form and materials.",
    icon: "🏛️",
    color: C.gold,
    delay: 30,
  },
  {
    title: "The Authenticity\nRule",
    desc: 'In street photography, specify "candid moments" to avoid a staged, artificial look.',
    icon: "🎭",
    color: C.orange,
    delay: 52,
  },
];

const ExpertSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ frame, fps, config: { damping: 200 } });

  return (
    <div
      style={{
        padding: "10px 24px 14px 18px",
        boxSizing: "border-box",
        borderTop: `1px solid ${C.cyan}22`,
        height: "100%",
      }}
    >
      <div
        style={{
          fontFamily: ORBITRON,
          fontSize: 18,
          fontWeight: 700,
          color: C.text,
          opacity: headerSpring,
          marginBottom: 10,
          letterSpacing: "0.05em",
        }}
      >
        Expert Techniques for{" "}
        <span style={{ color: C.green, textShadow: glow(C.green, 10) }}>
          Pro Results
        </span>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        {EXPERT_ITEMS.map((item) => {
          const cardSpring = spring({
            frame: frame - item.delay,
            fps,
            config: { damping: 18, stiffness: 160 },
          });
          const cardOpacity = interpolate(
            frame - item.delay,
            [0, 14],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
          );

          return (
            <div
              key={item.title}
              style={{
                flex: 1,
                background: C.card,
                border: `1px solid ${item.color}44`,
                borderRadius: 10,
                padding: "12px 13px",
                boxShadow: `0 0 24px ${item.color}18, inset 0 0 30px rgba(0,0,0,0.5)`,
                opacity: cardOpacity,
                transform: `translateY(${interpolate(
                  cardSpring,
                  [0, 1],
                  [28, 0]
                )}px)`,
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 6 }}>{item.icon}</div>
              <div
                style={{
                  fontFamily: ORBITRON,
                  fontSize: 12,
                  fontWeight: 700,
                  color: item.color,
                  textShadow: glow(item.color, 6),
                  lineHeight: 1.35,
                  marginBottom: 7,
                  whiteSpace: "pre-line",
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontFamily: RAJDHANI,
                  fontSize: 13,
                  color: C.muted,
                  lineHeight: 1.5,
                }}
              >
                {item.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Sound effects ─────────────────────────────────────────────────────────────
const SoundEffects: React.FC = () => {
  const { fps } = useVideoConfig();

  // [absoluteFrame, url, volume]
  const sfxCues: Array<[number, string, number]> = [
    [0, "https://remotion.media/whoosh.wav", 0.55],       // intro
    [92, "https://remotion.media/whoosh.wav", 0.4],        // wheel section
    [112, "https://remotion.media/ding.wav", 0.5],         // center circle
    [120, "https://remotion.media/switch.wav", 0.3],       // SUBJECT
    [140, "https://remotion.media/switch.wav", 0.3],       // ACTION
    [160, "https://remotion.media/switch.wav", 0.3],       // ENVIRONMENT
    [180, "https://remotion.media/switch.wav", 0.3],       // ART STYLE
    [200, "https://remotion.media/switch.wav", 0.3],       // LIGHTING
    [220, "https://remotion.media/switch.wav", 0.3],       // DETAILS
    [240, "https://remotion.media/whoosh.wav", 0.38],      // comparison section
    [270, "https://remotion.media/switch.wav", 0.25],      // row 1
    [300, "https://remotion.media/switch.wav", 0.25],      // row 2
    [330, "https://remotion.media/switch.wav", 0.25],      // row 3
    [390, "https://remotion.media/whoosh.wav", 0.4],       // expert section
    [398, "https://remotion.media/ding.wav", 0.35],        // card 1
    [420, "https://remotion.media/ding.wav", 0.35],        // card 2
    [442, "https://remotion.media/ding.wav", 0.35],        // card 3
  ];

  return (
    <>
      {sfxCues.map(([frame, url, volume], i) => (
        <Sequence key={i} from={frame} durationInFrames={fps}>
          <Audio src={url} volume={volume} />
        </Sequence>
      ))}
    </>
  );
};

// ── Root composition ──────────────────────────────────────────────────────────
export const NanaBananaBlueprintVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: RAJDHANI, overflow: "hidden" }}>
      {/* Background */}
      <CyberGrid />

      {/* Sound effects */}
      <SoundEffects />

      {/* Layout */}
      <AbsoluteFill
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* ── Title (full width) */}
        <Sequence from={0} layout="none">
          <TitleSection />
        </Sequence>

        {/* ── Main content row */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left — Six-Part Wheel (55%) */}
          <div
            style={{
              width: "55%",
              position: "relative",
              borderRight: `1px solid ${C.cyan}18`,
            }}
          >
            <Sequence from={90} layout="none">
              <WheelSection />
            </Sequence>
          </div>

          {/* Right — Comparison + Expert (45%) */}
          <div
            style={{
              width: "45%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                flex: 1,
                borderBottom: `1px solid ${C.cyan}18`,
              }}
            >
              <Sequence from={240} layout="none">
                <ComparisonSection />
              </Sequence>
            </div>
            <div style={{ flex: 1 }}>
              <Sequence from={390} layout="none">
                <ExpertSection />
              </Sequence>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
