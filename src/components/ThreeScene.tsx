import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useMemo} from 'react';

const seededRng = (seed: number) => {
  let s = seed;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0xffffffff; };
};

const Particles: React.FC<{frame: number}> = ({frame}) => {
  const COUNT = 200;
  const pts = useMemo(() => {
    const rng = seededRng(0xdeadbeef);
    return Array.from({length: COUNT}, () => ({
      x: rng() * 100, y: rng() * 100,
      z: rng(), size: rng() * 1.8 + 0.4, phase: rng() * Math.PI * 2,
    }));
  }, []);
  const fadeIn = interpolate(frame, [0, 45], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
      viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {pts.map((p, i) => (
        <circle key={i}
          cx={p.x}
          cy={p.y + Math.sin(frame * 0.015 + p.phase) * 1.4}
          r={p.size * p.z * 0.28}
          fill={`rgba(74,158,255,${p.z * 0.55 * fadeIn})`}
        />
      ))}
    </svg>
  );
};

const CircuitGrid: React.FC<{frame: number}> = ({frame}) => {
  const fadeIn = interpolate(frame, [15, 65], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rotX   = interpolate(frame, [0, 210], [62, 58]);
  const rotY   = interpolate(frame, [0, 210], [-10, -8]);
  const pulse  = 0.3 + Math.sin(frame * 0.05) * 0.15;
  const COLS = 8, ROWS = 6, CW = 60, CH = 50;
  const W = COLS * CW, H = ROWS * CH;
  return (
    <div style={{
      position: 'absolute', bottom: -60, left: -80, width: W, height: H,
      opacity: fadeIn * 0.5,
      transform: `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
      transformOrigin: 'bottom left',
    }}>
      <svg width={W} height={H}>
        {Array.from({length: ROWS + 1}).map((_, r) => (
          <line key={`h${r}`} x1={0} y1={r * CH} x2={W} y2={r * CH} stroke="rgba(100,180,255,0.55)" strokeWidth={1}/>
        ))}
        {Array.from({length: COLS + 1}).map((_, c) => (
          <line key={`v${c}`} x1={c * CW} y1={0} x2={c * CW} y2={H} stroke="rgba(100,180,255,0.55)" strokeWidth={1}/>
        ))}
        {Array.from({length: ROWS + 1}).map((_, r) =>
          Array.from({length: COLS + 1}).map((_, c) => (
            <circle key={`d${r}-${c}`} cx={c * CW} cy={r * CH} r={4}
              fill={`rgba(120,200,255,${pulse + Math.sin(frame * 0.04 + r + c) * 0.2})`}/>
          ))
        )}
      </svg>
    </div>
  );
};

const OrbitalRing: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const progress = spring({
    frame: frame - 15, fps,
    config: {damping: 18, stiffness: 55, mass: 1.4},
    durationInFrames: 55,
  });
  const scale   = interpolate(progress, [0, 1], [0.05, 1]);
  const opacity = interpolate(frame, [25, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rotY = frame * 0.4;
  const rotZ = frame * 0.15;
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity}}>
      <div style={{
        position: 'absolute', width: 600, height: 600,
        border: '2px solid rgba(26,96,255,0.4)', borderRadius: '50%',
        transform: `perspective(800px) rotateX(50deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
        boxShadow: '0 0 24px rgba(26,96,255,0.35), inset 0 0 24px rgba(26,96,255,0.12)',
      }}/>
      <div style={{
        position: 'absolute', width: 420, height: 420,
        border: '1px solid rgba(74,158,255,0.3)', borderRadius: '50%',
        transform: `perspective(800px) rotateX(50deg) rotateY(${-rotY * 0.7}deg) rotateZ(${rotZ}deg) scale(${scale})`,
        boxShadow: '0 0 14px rgba(74,158,255,0.25)',
      }}/>
    </div>
  );
};

export const ThreeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <Particles   frame={frame} />
      <CircuitGrid frame={frame} />
      <OrbitalRing frame={frame} fps={fps} />
    </div>
  );
};
