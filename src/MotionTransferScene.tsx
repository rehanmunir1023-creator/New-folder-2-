import { AbsoluteFill } from "remotion";
import { Background } from "./components/Background";
import { MainTitle } from "./components/MainTitle";
import { MethodBadge } from "./components/MethodBadge";
import { TechGrid } from "./components/TechGrid";

/**
 * Main composition — 210 frames @ 30 fps = 7 seconds.
 *
 * Timeline:
 *  0 – 20   Background fades in
 * 15 – 55   TechGrid draws in (bottom-left)
 * 40 – 75   MethodBadge springs in
 * 60 – 100  MainTitle springs up
 * 100+      Hold with subtle dot pulse
 */
export const MotionTransferScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Background />
      <TechGrid />

      {/* Centred text stack */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <MethodBadge />
        <MainTitle />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
