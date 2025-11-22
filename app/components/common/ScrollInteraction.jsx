"use client";

import { useEffect } from "react";

export default function ScrollInteraction() {
	useEffect(() => {
		const onScroll = () => {
			const y = window.scrollY || 0;
			window.dispatchEvent(new CustomEvent("mobile-scroll", { detail: { y } }));
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return null;
}


