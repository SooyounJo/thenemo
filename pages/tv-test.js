"use client";

import React, { useMemo, useState } from "react";
import { io } from "socket.io-client";

const MAX = { 1: 16, 2: 13, 3: 18, 4: 10, 5: 27 };

export default function TvTester() {
  const [setIdx, setSetIdx] = useState(3);
  const [imgIdx, setImgIdx] = useState(2);
  const [custom, setCustom] = useState("");
  const url = useMemo(() => {
    if (custom.trim()) return normalize(custom.trim());
    const k = clamp(imgIdx, 1, MAX[setIdx] || 10);
    return `/genimg/${setIdx}-${k}.png`;
  }, [setIdx, imgIdx, custom]);

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, Number(n) || a));
  }
  function normalize(u) {
    // accept bare "3-2.png"
    const bare = u.match(/^([1-5])-(\d+)\.png$/);
    if (bare) {
      const n = Number(bare[1]); const k = clamp(bare[2], 1, MAX[n] || 10);
      return `/genimg/${n}-${k}.png`;
    }
    // accept folder "/genimg/3/3-2.png"
    const folder = u.match(/^\/genimg\/([1-5])\/\1-(\d+)\.png$/);
    if (folder) {
      const n = Number(folder[1]); const k = clamp(folder[2], 1, MAX[n] || 10);
      return `/genimg/${n}-${k}.png`;
    }
    // accept flat "/genimg/3-2.png"
    const flat = u.match(/^\/genimg\/([1-5])-(\d+)\.png$/);
    if (flat) {
      const n = Number(flat[1]); const k = clamp(flat[2], 1, MAX[n] || 10);
      return `/genimg/${n}-${k}.png`;
    }
    return u;
  }
  function sendTv(u) {
    try {
      const s = io("/desktop", { path: "/api/socketio" });
      s.emit("tvShow", normalize(u));
      setTimeout(() => s.disconnect(), 500);
    } catch {}
  }
  function sendRandom() {
    const k = 1 + Math.floor(Math.random() * (MAX[setIdx] || 10));
    setImgIdx(k);
    sendTv(`/genimg/${setIdx}-${k}.png`);
  }

  const width = 120;

  return (
    <div style={{ padding: 16, display: "grid", gap: 12, color: "#e5e7eb", background: "#0b0d12", minHeight: "100vh" }}>
      <div style={{ fontWeight: 800, fontSize: 18 }}>TV Tester</div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <label>Set (time):</label>
        {[1,2,3,4,5].map((n) => (
          <button
            key={n}
            onClick={() => setSetIdx(n)}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #2a2f3a",
              background: n === setIdx ? "#1a1f2e" : "#111318",
              color: "#e5e7eb",
              cursor: "pointer",
            }}
          >
            {n}
          </button>
        ))}
        <label style={{ marginLeft: 12 }}>Index (1..{MAX[setIdx]})</label>
        <input
          type="number"
          value={imgIdx}
          onChange={(e) => setImgIdx(Number(e.target.value || 1))}
          min={1}
          max={MAX[setIdx]}
          style={{ width: 80, padding: 6, borderRadius: 6, border: "1px solid #2a2f3a", background: "#0e1117", color: "#e5e7eb" }}
        />
        <button
          onClick={() => sendTv(`/genimg/${setIdx}-${clamp(imgIdx,1,MAX[setIdx])}.png`)}
          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #6b5bd4", background: "#1a1f2e", color: "#e5e7eb", cursor: "pointer" }}
        >
          Send TV
        </button>
        <button
          onClick={sendRandom}
          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #2a2f3a", background: "#111318", color: "#e5e7eb", cursor: "pointer" }}
        >
          Random in Set
        </button>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <label>Custom:</label>
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="/genimg/3-2.png or 3-2.png or /genimg/3/3-2.png"
          style={{ width: 420, padding: 6, borderRadius: 6, border: "1px solid #2a2f3a", background: "#0e1117", color: "#e5e7eb" }}
        />
        <button
          onClick={() => sendTv(custom)}
          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #2a2f3a", background: "#111318", color: "#e5e7eb", cursor: "pointer" }}
        >
          Send Custom
        </button>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div>Preview:</div>
        <img src={url} alt="preview" width={width} height={width} style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #2a2f3a" }} />
        <div style={{ fontSize: 12, opacity: 0.85 }}>{url}</div>
      </div>
    </div>
  );
}


