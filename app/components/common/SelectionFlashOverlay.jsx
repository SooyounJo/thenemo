"use client";

import { useEffect, useState } from "react";

export default function SelectionFlashOverlay() {
	const [flash, setFlash] = useState(false);
	useEffect(() => {
		const id = setInterval(() => setFlash((f) => !f), 2600);
		return () => clearInterval(id);
	}, []);
	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 6,
				pointerEvents: "none",
				background: flash ? "radial-gradient(800px 400px at 50% 50%, rgba(255,255,255,0.06), transparent 60%)" : "transparent",
				transition: "background 700ms ease",
			}}
		/>
	);
}


