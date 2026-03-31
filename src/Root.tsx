import { Composition } from "remotion";
import { MotionTransferScene } from "./MotionTransferScene";

/**
 * Registers all Remotion compositions.
 * Resolution: 1920×1080 (16:9), 30 fps, 210 frames (7 s).
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MotionTransfer"
        component={MotionTransferScene}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
