"use client";

import { useState, useMemo } from "react";

export default function DreamcoreTest() {
  const [color, setColor] = useState("pastel blue");
  const [weather, setWeather] = useState("rainy");
  const [timeOfDay, setTimeOfDay] = useState("night");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [squeeze, setSqueeze] = useState(false);
  const [gather, setGather] = useState(false);

  const previewPrompt = useMemo(() => {
    return `Dreamcore outside window • weather: ${weather} • time: ${timeOfDay} • color: ${color}`;
  }, [color, weather, timeOfDay]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResultUrl("");
    setLastPrompt("");
    try {
      const r = await fetch("/api/dreamcore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color, weather, timeOfDay }),
      });
      const data = await r.json();
      if (!r.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to generate");
      }
      const url = data.imageDataUrl || data.imageUrl || "";
      setResultUrl(url);
      setLastPrompt(data.prompt || "");
      // trigger 4-split → gather animation overlay
      setShowOverlay(true);
      setSqueeze(false);
      setGather(false);
      // 1) 먼저 가로축이 줄어드는 단계
      setTimeout(() => setSqueeze(true), 50);
      // 2) 중앙으로 모이며 정사각형 모달로 축소
      setTimeout(() => setGather(true), 550);
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        background: "#0b0d12",
        color: "#e5e7eb",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>Dreamcore Image Test</h1>
      <form
        onSubmit={handleGenerate}
        style={{
          display: "grid",
          gap: 12,
          maxWidth: 520,
          padding: 12,
          border: "1px solid #23262d",
          borderRadius: 12,
          background: "rgba(17,19,24,.6)",
          backdropFilter: "blur(6px)",
          marginBottom: 16,
        }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#bfc3ca" }}>Color</span>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{
              borderRadius: 8,
              padding: "8px 10px",
              background: "#0f1117",
              border: "1px solid #23262d",
              color: "#e5e7eb",
            }}
          >
            <option>pastel blue</option>
            <option>misty rose</option>
            <option>soft lavender</option>
            <option>pale teal</option>
            <option>monotone</option>
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#bfc3ca" }}>Weather</span>
          <select
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            style={{
              borderRadius: 8,
              padding: "8px 10px",
              background: "#0f1117",
              border: "1px solid #23262d",
              color: "#e5e7eb",
            }}
          >
            <option>sunny</option>
            <option>rainy</option>
            <option>foggy</option>
            <option>snowy</option>
            <option>windy</option>
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#bfc3ca" }}>Time</span>
          <select
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            style={{
              borderRadius: 8,
              padding: "8px 10px",
              background: "#0f1117",
              border: "1px solid #23262d",
              color: "#e5e7eb",
            }}
          >
            <option>dawn</option>
            <option>day</option>
            <option>sunset</option>
            <option>night</option>
          </select>
        </label>

        <div style={{ fontSize: 12, color: "#a8b0bd" }}>
          Preview: {previewPrompt}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #6b5bd4",
              background: "#1a1f2e",
              color: "#e5e7eb",
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
          {resultUrl && (
            <a
              href={resultUrl}
              download="dreamcore.png"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #23262d",
                background: "#111318",
                color: "#e5e7eb",
                textDecoration: "none",
              }}
            >
              Download
            </a>
          )}
        </div>
      </form>

      {!!error && (
        <div
          style={{
            color: "#fca5a5",
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      {!!lastPrompt && (
        <div
          style={{
            fontSize: 12,
            color: "#a8b0bd",
            marginBottom: 12,
          }}
        >
          Used prompt: {lastPrompt}
        </div>
      )}

      {resultUrl && (
        <div
          style={{
            width: "min(1024px, 95vw)",
            aspectRatio: "1 / 1",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid #23262d",
          }}
        >
          <img
            src={resultUrl}
            alt="result"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      {/* 4-split → gather to centered square modal */}
      {resultUrl && showOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            pointerEvents: "none",
            background: "transparent",
          }}
        >
          <style>{`
            @keyframes squeezeKF {
              0%   { transform: translateX(-50%) scaleX(1); width: 100%; }
              100% { transform: translateX(-50%) scaleX(0.58); width: 58%; }
            }
          `}</style>
          <div
            style={{
              position: "absolute",
              left: gather ? "50%" : 0,
              top: gather ? "50%" : 0,
              transform: gather ? "translate(-50%,-50%)" : "none",
              width: gather ? "72vmin" : "100vw",
              height: gather ? "72vmin" : "100vh",
              borderRadius: gather ? 14 : 0,
              overflow: "hidden",
              boxShadow: gather ? "0 12px 50px rgba(0,0,0,0.45)" : "none",
              transition: "left 900ms ease, top 900ms ease, width 900ms ease, height 900ms ease 250ms, border-radius 900ms ease, transform 900ms ease, box-shadow 900ms ease",
              backdropFilter: gather ? "blur(2px)" : "none",
              willChange: "left, top, width, height, transform, border-radius, box-shadow",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 1fr",
                gap: gather ? 2 : 0,
                transition: "gap 900ms ease",
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    background: "#0b0d12",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: 0,
                      bottom: 0,
                      transform: "translateX(-50%) scaleX(1)",
                      width: "100%",
                      animation: squeeze ? "squeezeKF 700ms ease forwards" : "none",
                      willChange: "transform, width",
                    }}
                  >
                    <img
                      src={resultUrl}
                      alt={`tile_${i}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        filter: gather ? "none" : "brightness(0.98) contrast(1.02)",
                        transition: "filter 900ms ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


