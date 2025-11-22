"use client";

export default function RootLayout({ children }) {
	return (
		<html lang="ko">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
				<title>nemo mobile</title>
			</head>
			<body style={{ margin: 0, background: "#0b0d12", color: "#e5e7eb" }}>{children}</body>
		</html>
	);
}


