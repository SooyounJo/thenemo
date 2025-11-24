"use client";

import { useMemo } from "react";

// Main landing frame text for desktop.
// QR 카드는 그대로 두고, 화면 테두리만 시적인 문구로 둘러싸는 용도.
// gather / explode API는 기존 FrameTypos와 맞춰 두어 전환 연출은 유지한다.

export default function MainFrameText({ gather = false, explode = false }) {
  const topText = useMemo(
    () =>
      "Dust settles between shadows, simple joy. Shadow whispers over the water, healing. Echo drifts in quiet rooms, soft balance. Space unfolds beside the night, light.",
    []
  );
  const bottomText = useMemo(
    () =>
      "Clouds whisper beside the night, warmth. Echo whispers inside the city, clarity. Time drifts beside the night, simple joy. Lines glow in quiet rooms, ease.",
    []
  );
  const leftText = useMemo(
    () =>
      "Space settles beyond the noise, simple joy. Clouds fall inside the city, healing. Light unfolds beside the night, soft trail.",
    []
  );
  const rightText = useMemo(
    () =>
      "Silence softens over the water, soft balance. Waves glow in quiet rooms, gentle focus. Time wanders across the glass, ease.",
    []
  );

  // helper to build explode transform (same idea as FrameTypos)
  const explodeTx = (ix) => {
    if (!explode) return {};
    const dx = ((ix * 37) % 60) - 30; // -30..30 vw
    const dy = ((ix * 53) % 60) - 30; // -30..30 vh
    const rot = ((ix * 91) % 120) - 60; // -60..60 deg
    const sc = 0.85 + (((ix * 23) % 30) / 100); // 0.85..1.15
    return {
      transform: `translate(${dx}vw, ${dy}vh) rotate(${rot}deg) scale(${sc})`,
      opacity: 0,
      transition: "transform 900ms ease, opacity 900ms ease",
    };
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        left: gather ? "50%" : 0,
        top: gather ? "50%" : 0,
        width: gather ? "70vmin" : "100%",
        height: gather ? "70vmin" : "100%",
        transform: gather ? "translate(-50%,-50%)" : "none",
        transition:
          "left 700ms ease, top 700ms ease, width 700ms ease, height 700ms ease, transform 700ms ease",
        fontFamily:
          'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* typing-like reveal keyframes */}
      <style>{`
        @keyframes frameTextRevealX {
          0% { clip-path: inset(0 100% 0 0); opacity: 0; }
          100% { clip-path: inset(0 0 0 0); opacity: 1; }
        }
        @keyframes frameTextRevealY {
          0% { clip-path: inset(100% 0 0 0); opacity: 0; }
          100% { clip-path: inset(0 0 0 0); opacity: 1; }
        }
      `}</style>
      {/* Top line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 22,
          textAlign: "center",
          fontSize: 12,
          color: "rgba(229,231,235,.9)",
          letterSpacing: 1.4,
          textTransform: "none",
          overflow: "hidden",
          ...explodeTx(1),
        }}
      >
        <div
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            animation: "frameTextRevealX 7s steps(80, end) forwards",
          }}
        >
          {topText}
        </div>
      </div>

      {/* Bottom line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 22,
          textAlign: "center",
          fontSize: 12,
          color: "rgba(229,231,235,.85)",
          letterSpacing: 1.4,
          textTransform: "none",
          overflow: "hidden",
          ...explodeTx(2),
        }}
      >
        <div
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            animation: "frameTextRevealX 7s steps(80, end) forwards",
          }}
        >
          {bottomText}
        </div>
      </div>

      {/* Left vertical text */}
      <div
        style={{
          position: "absolute",
          top: 40,
          bottom: 40,
          left: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...explodeTx(3),
        }}
      >
        <div
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            whiteSpace: "nowrap",
            fontSize: 11,
            color: "rgba(229,231,235,.78)",
            letterSpacing: 2,
            animation: "frameTextRevealY 7s steps(80, end) forwards",
          }}
        >
          {leftText}
        </div>
      </div>

      {/* Right vertical text */}
      <div
        style={{
          position: "absolute",
          top: 40,
          bottom: 40,
          right: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...explodeTx(4),
        }}
      >
        <div
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            whiteSpace: "nowrap",
            fontSize: 11,
            color: "rgba(229,231,235,.78)",
            letterSpacing: 2,
            animation: "frameTextRevealY 7s steps(80, end) forwards",
          }}
        >
          {rightText}
        </div>
      </div>
    </div>
  );
}


