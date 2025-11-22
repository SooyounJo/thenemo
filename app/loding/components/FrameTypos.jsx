"use client";

import { useMemo } from "react";

export default function FrameTypos() {
	// Long repeated string to ensure continuous marquee
	const phrase = "NEMO — THINKING — BREATHE — FIND YOUR WINDOW — REST — ";
	const rowText = useMemo(() => new Array(40).fill(phrase).join(""), []);
	const colText = useMemo(() => new Array(80).fill("NEMO • THINK • REST • ").join(""), []);

	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				zIndex: 1,
				pointerEvents: "none",
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
					}}
				>
					{colText}
				</div>
			</div>
		</div>
	);
}


