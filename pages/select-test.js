"use client";

import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { buildUrlForSelection } from "../lib/mood-select";

const TIMES = ["night", "dawn", "day", "afternoon", "sunset"];
const MOODS = ["deep_blue","blue_green","navy_purple","warm_orange","gold","purple_pink","cold_white","mixed_cool_warm","dark_neutral","light_blue","green_pastel"];
const WEATHERS = ["clear","cloudy","rainy","snowy","foggy","stormy"];

export default function SelectTester() {
  const [time, setTime] = useState("day");
  const [mood, setMood] = useState("blue_green");
  const [weather, setWeather] = useState("clear");
  const [sent, setSent] = useState("");
  const preview = useMemo(() => buildUrlForSelection(time, mood, weather), [time, mood, weather]);

  useEffect(() => {
    // reset server-side selection
    try { const s = io("/desktop", { path: "/api/socketio" }); s.emit("sel:reset"); setTimeout(() => s.disconnect(), 400); } catch {}
  }, []);

  const send = () => {
    try {
      const s = io("/desktop", { path: "/api/socketio" });
      s.emit("sel:time", time);
      s.emit("sel:mood", mood);
      s.emit("sel:weather", weather);
      setSent(preview);
      setTimeout(() => s.disconnect(), 600);
    } catch {}
  };

  return (
    <div style={{ padding: 16, display: "grid", gap: 12, color: "#e5e7eb", background: "#0b0d12", minHeight: "100vh" }}>
      <div style={{ fontWeight: 800, fontSize: 18 }}>Selection Tester (time + mood + weather → TV)</div>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "auto 1fr" }}>
        <label>Time</label>
        <select value={time} onChange={(e) => setTime(e.target.value)} style={{ padding: 6, borderRadius: 6, border: "1px solid #2a2f3a", background: "#0e1117", color: "#e5e7eb" }}>
          {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <label>Mood</label>
        <select value={mood} onChange={(e) => setMood(e.target.value)} style={{ padding: 6, borderRadius: 6, border: "1px solid #2a2f3a", background: "#0e1117", color: "#e5e7eb" }}>
          {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <label>Weather</label>
        <select value={weather} onChange={(e) => setWeather(e.target.value)} style={{ padding: 6, borderRadius: 6, border: "1px solid #2a2f3a", background: "#0e1117", color: "#e5e7eb" }}>
          {WEATHERS.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={send} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #6b5bd4", background: "#1a1f2e", color: "#e5e7eb", cursor: "pointer" }}>
          Recommend → TV
        </button>
        {sent ? <div style={{ fontSize: 12, opacity: 0.85 }}>sent: {sent}</div> : null}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div>Preview:</div>
        <img src={preview} alt="preview" width={120} height={120} style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #2a2f3a" }} />
        <div style={{ fontSize: 12, opacity: 0.85 }}>{preview}</div>
      </div>
    </div>
  );
}


