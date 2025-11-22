"use client";

import { useEffect, useState } from "react";

export default function LevaGradientModal() {
	const [open, setOpen] = useState(false);
	const [a, setA] = useState("#10131a");
	const [b, setB] = useState("#2a3350");
	const [c, setC] = useState("#9fbaff");

	useEffect(() => {
		if (!open) return;
		try {
			window.dispatchEvent(new CustomEvent("mobile-gradient", { detail: { a, b, c } }));
		} catch {}
	}, [open, a, b, c]);

	return (
		<>
			<button
				onClick={() => setOpen((v) => !v)}
				style={{
					position: "fixed",
					right: 12,
					bottom: 14,
					zIndex: 20,
					padding: "10px 14px",
					borderRadius: 12,
					border: "1px solid rgba(255,255,255,0.18)",
					background: "rgba(255,255,255,0.08)",
					color: "#e5e7eb",
					backdropFilter: "blur(6px)",
				}}
			>
				Open gradient controls
			</button>
			{open && (
				<div
					style={{
						position: "fixed",
						right: 12,
						bottom: 64,
						zIndex: 22,
						padding: 12,
						borderRadius: 12,
						border: "1px solid rgba(255,255,255,0.18)",
						background: "rgba(15,17,23,0.92)",
						backdropFilter: "blur(8px)",
						color: "#e5e7eb",
						width: 240,
						boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
					}}
				>
					<div style={{ fontSize: 13, marginBottom: 8, color: "#bfc3ca" }}>Gradient Colors</div>
					<label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 8, fontSize: 12 }}>
						<span>A</span>
						<input type="color" value={a} onChange={(e) => setA(e.target.value)} style={{ width: 42, height: 24, border: "none", background: "transparent" }} />
					</label>
					<label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 8, fontSize: 12 }}>
						<span>B</span>
						<input type="color" value={b} onChange={(e) => setB(e.target.value)} style={{ width: 42, height: 24, border: "none", background: "transparent" }} />
					</label>
					<label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: 12 }}>
						<span>Accent</span>
						<input type="color" value={c} onChange={(e) => setC(e.target.value)} style={{ width: 42, height: 24, border: "none", background: "transparent" }} />
					</label>
				</div>
			)}
		</>
	);
}



