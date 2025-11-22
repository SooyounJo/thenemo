"use client";

export default function TopQuestion() {
	return (
		<div
			style={{
				position: "fixed",
				top: 18,
				left: "50%",
				transform: "translateX(-50%)",
				zIndex: 8,
				padding: "8px 12px",
				borderRadius: 12,
				background: "rgba(255,255,255,0.06)",
				border: "1px solid rgba(255,255,255,0.12)",
				backdropFilter: "blur(6px)",
				color: "#e5e7eb",
				fontSize: 14,
			}}
		>
			당신이 원하는 휴식은 무엇인가요?
		</div>
	);
}


