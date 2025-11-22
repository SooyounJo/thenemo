"use client";

import ThreeBackground from "../components/common/ThreeBackground";
import ScrollInteraction from "../components/common/ScrollInteraction";
import IntroSequence from "../(main)/components/IntroSequence";
import TopQuestion from "../components/common/TopQuestion";
import SelectButton from "../components/common/SelectButton";
import SelectionFlashOverlay from "../components/common/SelectionFlashOverlay";
import FinalScreen from "../components/FinalScreen";
import LevaGradientModal from "../components/common/LevaGradientModal";
import MobileLandingHero from "../components/common/MobileLandingHero";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function MobileHome() {
	const sockRef = useRef(null);
	useEffect(() => {
		const s = io("/mobile", { path: "/api/socketio" });
		sockRef.current = s;
		return () => {
			s.disconnect();
			sockRef.current = null;
		};
	}, []);
	return (
		<main className="min-h-screen w-full" style={{ position: "relative" }}>
			<ThreeBackground />
			<IntroSequence />
			<MobileLandingHero />
			<SelectButton />
			<ScrollInteraction />
			<TopQuestion />
			<SelectionFlashOverlay />
			<FinalScreen />
			<LevaGradientModal />
		</main>
	);
}


