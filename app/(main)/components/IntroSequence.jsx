"use client";

import { useEffect, useState } from "react";

export default function IntroSequence() {
	const [show, setShow] = useState(true);
	useEffect(() => {
		const id = setTimeout(() => setShow(false), 1200);
		return () => clearTimeout(id);
	}, []);
	if (!show) return null;
	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 10,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "rgba(10,12,16,0.8)",
				color: "#e5e7eb",
				animation: "introFade 1000ms ease forwards",
			}}
		>
			시작합니다...
			<style>{`@keyframes introFade{0%{opacity:1}100%{opacity:0}}`}</style>
		</div>
	);
}


