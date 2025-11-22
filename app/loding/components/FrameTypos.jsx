"use client";

import { useMemo } from "react";

export default function FrameTypos({ gather = false, explode = false }) {
	// Long repeated string to ensure continuous marquee
	const phrase = "NEMO — THINKING — BREATHE — FIND YOUR WINDOW — REST — ";
	const rowText = useMemo(() => new Array(40).fill(phrase).join(""), []);
	const colText = useMemo(() => new Array(80).fill("NEMO • THINK • REST • ").join(""), []);

	// helper to build explode transform
	const explodeTx = (ix) => {
		if (!explode) return {};
		const dx = ((ix * 37) % 60) - 30; // -30..30 vw
		const dy = ((ix * 53) % 60) - 30; // -30..30 vh
		const rot = ((ix * 91) % 120) - 60; // -60..60 deg
		const sc = 0.8 + (((ix * 23) % 40) / 100); // 0.8..1.2
		return {
			transform: `translate(${dx}vw, ${dy}vh) rotate(${rot}deg) scale(${sc})`,
			opacity: 0,
			transition: "transform 900ms ease, opacity 900ms ease",
		};
	};

	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				zIndex: 1,
				pointerEvents: "none",
				left: gather ? "50%" : 0,
				top: gather ? "50%" : 0,
				width: gather ? "70vmin" : "100%",
				height: gather ? "70vmin" : "100%",
				transform: gather ? "translate(-50%,-50%)" : "none",
				transition: "left 700ms ease, top 700ms ease, width 700ms ease, height 700ms ease, transform 700ms ease",
			}}
		>
			<style>{`
        @keyframes marqueeX {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeXRev {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes marqueeY {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marqueeYRev {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
      `}</style>

			{/* Top row */}
			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					top: 10,
					height: 28,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						whiteSpace: "nowrap",
						fontSize: 12,
						color: "rgba(229,231,235,.9)",
						letterSpacing: 2,
						textTransform: "uppercase",
						animation: "marqueeX 32s linear infinite",
						...(explodeTx(1)),
					}}
				>
					{rowText}
				</div>
			</div>

			{/* Bottom row */}
			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 10,
					height: 28,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						whiteSpace: "nowrap",
						fontSize: 12,
						color: "rgba(229,231,235,.75)",
						letterSpacing: 2,
						textTransform: "uppercase",
						animation: "marqueeXRev 36s linear infinite",
						...(explodeTx(2)),
					}}
				>
					{rowText}
				</div>
			</div>

			{/* Center horizontal row */}
			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					top: "50%",
					transform: "translateY(-50%)",
					height: 26,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						whiteSpace: "nowrap",
						fontSize: 12,
						color: "rgba(229,231,235,.82)",
						letterSpacing: 2,
						textTransform: "uppercase",
						animation: "marqueeX 34s linear infinite",
						...(explodeTx(3)),
					}}
				>
					{rowText}
				</div>
			</div>

			{/* Left column */}
			<div
				style={{
					position: "absolute",
					top: 0,
					bottom: 0,
					left: 8,
					width: 24,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						writingMode: "vertical-rl",
						textOrientation: "mixed",
						whiteSpace: "nowrap",
						fontSize: 11,
						color: "rgba(229,231,235,.7)",
						letterSpacing: 2,
						textTransform: "uppercase",
						animation: "marqueeY 56s linear infinite",
						...(explodeTx(4)),
					}}
				>
					{colText}
				</div>
			</div>

			{/* Right column */}
			<div
				style={{
					position: "absolute",
					top: 0,
					bottom: 0,
					right: 8,
					width: 24,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						writingMode: "vertical-rl",
						textOrientation: "mixed",
						whiteSpace: "nowrap",
						fontSize: 11,
						color: "rgba(229,231,235,.7)",
						letterSpacing: 2,
						textTransform: "uppercase",
						animation: "marqueeYRev 60s linear infinite",
						...(explodeTx(5)),
					}}
				>
					{colText}
				</div>
			</div>

			{/* Center vertical column */}
			<div
				style={{
					position: "absolute",
					top: 0,
					bottom: 0,
					left: "50%",
					transform: "translateX(-50%)",
					width: 22,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						writingMode: "vertical-rl",
						textOrientation: "mixed",
						whiteSpace: "nowrap",
						fontSize: 11,
						color: "rgba(229,231,235,.8)",
						letterSpacing: 2,
						textTransform: "uppercase",
						animation: "marqueeY 58s linear infinite",
						...(explodeTx(6)),
					}}
				>
					{colText}
				</div>
			</div>
		</div>
	);
}


