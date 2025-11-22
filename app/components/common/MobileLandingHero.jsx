"use client";

export default function MobileLandingHero() {
	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 9,
				display: "grid",
				placeItems: "center",
				pointerEvents: "none",
			}}
		>
			<div style={{ textAlign: "center", maxWidth: 260, opacity: 0.96 }}>
				<div style={{ marginBottom: 10, display: "flex", justifyContent: "center" }}>
					<img
						src="/mobile/nemo.png"
						onError={(e) => {
							try {
								if (e && e.target) e.target.src = "/nemo.png";
							} catch {}
						}}
						alt="NEMO"
						style={{ width: 96, height: 96, objectFit: "contain", imageRendering: "auto" }}
					/>
				</div>
				<div style={{ fontSize: 28, letterSpacing: 2, marginBottom: 10 }}>NEMO</div>
				<div style={{ fontSize: 12, color: "#cdd2da", lineHeight: 1.6 }}>
					네모나게 갇힌 세상 속,<br />
					나만의 휴식의 틈이 필요하신가요?<br />
					화면을 스크롤 하여 여러분만의 틈의 창을 만들어보세요.
				</div>
			</div>
		</div>
	);
}


