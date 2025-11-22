"use client";

export default function SelectButton({ onClick }) {
	return (
		<button
			onClick={onClick}
			style={{
				position: "fixed",
				right: 16,
				bottom: 24,
				zIndex: 12,
				padding: "10px 14px",
				borderRadius: 12,
				border: "1px solid rgba(255,255,255,0.16)",
				background: "rgba(255,255,255,0.08)",
				color: "#f3f4f6",
				backdropFilter: "blur(6px)",
			}}
		>
			선택
		</button>
	);
}


