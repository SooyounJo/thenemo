"use client";

import { useEffect, useState } from "react";
import TextType from "./TextType";
import DecryptedText from "./DecryptedText";

export default function TextCascade() {
	const [idx, setIdx] = useState(0);
	// 중앙 타이포(타이핑 애니메이션)
	const lines = [
		"네모나게 갇힌 세상 속,",
		"나만의 휴식의 틈이 필요하신가요?",
		"화면을 스크롤 하여 여러분만의 '틈'의 창을 만들어보세요.",
	];
	const speedMs = 28; // 문자당 속도
	useEffect(() => {
		if (idx >= lines.length) return;
		const ms = lines[idx].length * speedMs + 500; // 타이핑 완료 후 약간 대기
		const id = setTimeout(() => setIdx((i) => i + 1), ms);
		return () => clearTimeout(id);
	}, [idx]);
	return (
		<div style={{ display: "grid", gap: 10, textAlign: "center" }}>
			{lines.slice(0, idx + 1).map((s, i) => {
				const isLast = i === lines.length - 1 && idx >= lines.length - 1;
				return (
					<div key={i} style={{ fontSize: i === 0 ? 16 : 14, color: "#e5e7eb", lineHeight: 1.6 }}>
						{isLast ? <TextType text={s} speedMs={speedMs} /> : <TextType text={s} speedMs={speedMs} />}
					</div>
				);
			})}
		</div>
	);
}


