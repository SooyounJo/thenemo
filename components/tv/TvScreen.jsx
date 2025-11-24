import React, { useEffect, useState } from "react";
import { useTvSocket } from "../../utils/socket/client";

export default function TvScreen() {
  const [url, setUrl] = useState("");
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fully black; do not restore any previous image
    setUrl("");
  }, []);

  useEffect(() => {
    const s = useTvSocket((u) => {
      if (typeof u === "string" && u) {
        let path = u;
        // tolerate bare "5-3.png"
        if (!path.startsWith("/genimg/") && /^[1-9]-\d+\.png$/i.test(path)) {
          path = `/genimg/${path}`;
        }
        // tolerate folder style "/genimg/3/3-2.png" -> "/genimg/3-2.png"
        const m = path.match(/^\/genimg\/([1-5])\/(\d+)-(\d+)\.png$/);
        if (m && m[1] === m[2]) {
          path = `/genimg/${m[1]}-${m[3]}.png`;
        }
        // allow only flat style under /genimg
        if (!/^\/genimg\/[1-5]-\d+\.png$/.test(path)) return;
        try { console.log("[tv] tvShow/imageSelected ->", path); } catch {}
        setFade(false);
        setUrl(path);
        setTimeout(() => setFade(true), 30);
      }
    });
    try {
      s.emit("tvHello", { ts: Date.now() });
    } catch {}
    // Fallback: also accept imageSelected only if it points to /genimg/*
    try {
      s.on("imageSelected", (u) => {
        if (typeof u !== "string" || !u.startsWith("/genimg/")) return;
        setFade(false);
        setUrl(u);
        setTimeout(() => setFade(true), 30);
      });
    } catch {}
    return () => {
      try {
        s.disconnect();
      } catch {}
    };
  }, []);

  const display = url || "";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {display ? (
        <img
          src={display}
          alt="selected"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "contrast(1.05)",
            opacity: fade ? 1 : 0,
            transition: "opacity 900ms ease",
          }}
        />
      ) : null}
    </div>
  );
}


