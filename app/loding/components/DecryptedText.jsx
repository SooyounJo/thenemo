"use client";

import { useEffect, useState } from "react";

const ALPH = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default function DecryptedText({ text = "", durationMs = 900 }) {
	const [out, setOut] = useState("");
	useEffect(() => {
		let t0 = performance.now();
		let id = null;
		const step = (now) => {
			const u = Math.min(1, (now - t0) / durationMs);
			const n = Math.floor(text.length * u);
			let s = text.slice(0, n);
			for (let i = n; i < text.length; i++) {
				s += ALPH[Math.floor(Math.random() * ALPH.length)];
			}
			setOut(s);
			if (u < 1) id = requestAnimationFrame(step);
		};
		id = requestAnimationFrame(step);
		return () => id && cancelAnimationFrame(id);
	}, [text, durationMs]);
	return <span>{out}</span>;
}


