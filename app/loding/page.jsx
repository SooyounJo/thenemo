"use client";

import TextCascade from "./components/TextCascade";

export default function LoadingPage() {
	return (
		<main
			style={{
				minHeight: "100vh",
				width: "100%",
				display: "grid",
				placeItems: "center",
				background: "#0b0d12",
				color: "#e5e7eb",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* background video frame */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					zIndex: 0,
					opacity: 0.18,
					pointerEvents: "none",
				}}
			>
				<video
					src="/mobile/nemo.mp4"
					style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
					autoPlay
					loop
					muted
					playsInline
					onError={(e) => {
						try {
							if (e && e.target && e.target.src && e.target.src.includes("/mobile/")) {
								e.target.src = "/nemo.mp4";
							}
						} catch {}
					}}
				/>
			</div>
			<div style={{ position: "relative", zIndex: 2, padding: 20, borderRadius: 12, backdropFilter: "blur(4px)" }}>
				<TextCascade />
			</div>
		</main>
	);
}


