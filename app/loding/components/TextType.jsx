"use client";

import { useEffect, useState } from "react";

export default function TextType({ text = "", speedMs = 24 }) {
	const [out, setOut] = useState("");
	useEffect(() => {
		let i = 0;
		let id = null;
		const step = () => {
			setOut(text.slice(0, i));
			i++;
			if (i <= text.length) id = setTimeout(step, speedMs);
		};
		id = setTimeout(step, speedMs);
		return () => id && clearTimeout(id);
	}, [text, speedMs]);
	return (
		<span style={{ display: "inline-flex", alignItems: "center" }}>
			<span>{out}</span>
			<span
				aria-hidden="true"
				style={{
					marginLeft: 2,
					opacity: 1,
					animation: "caretBlink 1s step-end infinite",
				}}
			>
				│
			</span>
			<style>{`@keyframes caretBlink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
		</span>
	);
}


