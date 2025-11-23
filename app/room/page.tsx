"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { io } from "socket.io-client";
import Room from "@/components/desktop/room/room";

export default function FixedRoomPage() {
  // 페이지 스크롤 잠금
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevBodyHeight = body.style.height;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.height = "100%";
    body.style.height = "100%";
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.height = prevHtmlHeight;
      body.style.height = prevBodyHeight;
    };
  }, []);
  // page-level HTML screen controls (left panel)
  const [pHtmlDist, setPHtmlDist] = useState(-10.0);
  const [pHtmlOffX, setPHtmlOffX] = useState(-40.0);
  const [pHtmlOffY, setPHtmlOffY] = useState(-32.050);
  const [pHtmlOffZ, setPHtmlOffZ] = useState(-30.644);
  const [pHtmlScale, setPHtmlScale] = useState(3.787);
  // Dramatic landing (very close), then pull back step-by-step
  // Push in even further for a “fully zoomed-in” landing shot
  const camVeryClose = useMemo(() => ({ x: 1.10, y: 1.00, z: 2.00 }), []);
  // Start slightly higher on Z, then settle down to camVeryClose
  const camVeryCloseUp = useMemo(() => ({ x: 1.10, y: 1.00, z: 2.30 }), []);
  const camClose = useMemo(() => ({ x: 3.2, y: 2.2, z: 4.2 }), []);
  const camFar = useMemo(() => ({ x: 6.0, y: 4.0, z: 12.0 }), []);
  // Slightly left-shifted variant of camFar for final turn
  const camFarLeft = useMemo(() => ({ x: 4.0, y: 4.0, z: 12.0 }), []);
  // 이미지 각도에 더 근접하도록 오른쪽/뒤/약간 위로
  const camAngle = useMemo(() => ({ x: -3.9, y: -2, z: 6.8 }), []);
  // 정면 보기 타겟 (창문 방향을 정면으로 바라보는 느낌)
  const lookWindow = useMemo(() => ({ x: -3.9, y: -1.6, z: -4.8 }), []);
  // Step 0 -> camClose, Step 1 -> camFar (zoom-out), Step 2 -> camFarLeft + yaw
  const steps = [camClose, camFar, camFarLeft] as { x: number; y: number; z: number }[];
  const [step, setStep] = useState(0);
  const socketRef = useRef<any>(null);
  const [remoteProgress, setRemoteProgress] = useState<number | null>(null);
  const [remoteOverlay, setRemoteOverlay] = useState<number | null>(null);
  const [remoteOverlayIndex, setRemoteOverlayIndex] = useState<number | null>(null);
  const [lookMsg, setLookMsg] = useState(false);
  // step 0로 돌아오면 랜딩 최종 구도(camVeryClose)로 복귀
  const stepTarget = step === 0 ? camVeryClose : steps[step];
  // Intro settle animation (once on mount: camVeryCloseUp -> camVeryClose)
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setIntro(false), 900);
    return () => clearTimeout(id);
  }, []);
  const combinedTarget = intro ? camVeryClose : stepTarget;
  // Socket.IO client for remote control (next / prev / progress / setStep)
  useEffect(() => {
    const socket = io("/desktop", { path: "/api/socketio" });
    socketRef.current = socket;
    const onNext = () => {
      setStep((prev) => {
        if (prev === 2) {
          // Finalize weather selection: fade out and ask to look at the window.
          setLookMsg(true);
          // Emit previously selected gen image to TV/SBM
          try {
            const last = typeof window !== "undefined" ? (localStorage.getItem("nemo_last_image") || "") : "";
            const s = io({ path: "/api/socketio" });
            if (last) s.emit("imageSelected", last);
            setTimeout(() => s.disconnect(), 600);
          } catch {}
          return 3;
        }
        return Math.min(steps.length - 1, prev + 1);
      });
    };
    const onPrev = () => setStep((s) => Math.max(0, s - 1));
    const onSetStep = (v: number) => {
      const nv = Math.max(0, Math.min(steps.length - 1, Math.floor(v)));
      setStep(nv);
    };
    const onProgress = (v: number) => {
      if (typeof v === "number") {
        const clamped = Math.max(0, Math.min(1, v));
        setRemoteProgress(clamped);
        // In room, progress should not change steps. Navigation via next/prev only.
      }
    };
    const onOverlay = (v: number) => {
      if (typeof v === "number") setRemoteOverlay(Math.max(0, Math.min(1, v)));
    };
    socket.on("next", onNext);
    socket.on("prev", onPrev);
    socket.on("setStep", onSetStep);
    socket.on("progress", onProgress);
    socket.on("overlayOpacity", onOverlay);
    socket.on("overlayIndex", (v: number) => {
      if (typeof v === "number") setRemoteOverlayIndex(Math.max(0, Math.min(13, Math.floor(v))));
    });
    return () => {
      socket.off("next", onNext);
      socket.off("prev", onPrev);
      socket.off("setStep", onSetStep);
      socket.off("progress", onProgress);
      socket.off("overlayOpacity", onOverlay);
      socket.off("overlayIndex");
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length]);
  // On entering room: auto-advance once, then enable mobile scroll after the motion
  useEffect(() => {
    const t1 = setTimeout(() => {
      setStep((s) => Math.min(steps.length - 1, s + 1));
      const t2 = setTimeout(() => {
        try {
          const s = io("/mobile", { path: "/api/socketio" });
          s.emit("enableScroll");
          setTimeout(() => s.disconnect(), 500);
        } catch {}
      }, 1400);
      return () => clearTimeout(t2);
    }, 1000);
    return () => clearTimeout(t1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // Apply the same placement through step 0, 1, and 2
    if (step === 0 || step === 1 || step === 2) {
      setPHtmlDist(-10.0);
      setPHtmlOffX(-40.0);
      setPHtmlOffY(-32.050);
      setPHtmlOffZ(-30.644);
      setPHtmlScale(3.787);
    }
  }, [step]);

  // Light presets aligned with index: 1 -> (-0.9,12.8,-24.0), 2 -> (-14.7,10.7,-18.9)
  const lightPreset1 = useMemo(() => ({ x: -0.9, y: 12.8, z: -24.0 }), []);
  const lightPreset2 = useMemo(() => ({ x: -14.7, y: 10.7, z: -18.9 }), []);
  // 첫 “다음”에 조명을 파라미터 첫 화면 상태(프리셋1)로 부드럽게 복귀
  const lightSteps = [null, lightPreset1, lightPreset1] as (null | { x: number; y: number; z: number })[];
  const lightTarget = lightSteps[step] || undefined;
  // 진행 슬라이더: 랜딩(0)에서는 0.538, 첫 다음(1)에서는 0.0(아침)으로 이동
  // 그 이후 스텝에서는 사용자가 조정한 값을 보존하도록 별도 타깃을 주지 않음
  const defaultProgress: number | any = step === 0 ? 0.538 : (step === 1 ? 0.0 : (undefined as any));
  const progressTarget = (remoteProgress !== null ? (remoteProgress as any) : defaultProgress);
  const dynamicProgressLerp = remoteProgress !== null ? 180 : 900;
  const overlayTarget = (remoteOverlay !== null ? remoteOverlay : (step === 3 ? 0 : 1));
  const dynamicOverlayLerp = remoteOverlay !== null ? 180 : 1200;

  // Top question modal (glassmorphism)
  const [bannerText, setBannerText] = useState<string>("");
  const [bannerVisible, setBannerVisible] = useState<boolean>(false);
  const bannerTimerRef = useRef<any>(null);
  // html2: white by default on step >= 2, and can switch to random genimg on user action
  const [html2Url, setHtml2Url] = useState<string | undefined>(undefined);
  // Picker overlay (HTML, translucent) - appears after two Next
  const pickerPool = useMemo(
    () => [
      { name: "SUNNY", url: "/weather/sunny.png" },
      { name: "CLOUDY", url: "/weather/cloudy.png" },
      { name: "RAINY", url: "/weather/rainy.png" },
      { name: "SNOWY", url: "/weather/snowy.png" },
      { name: "NIGHT", url: "/weather/night.png" },
    ],
    []
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerIndex, setPickerIndex] = useState(0);
  const pickerStopTimer = useRef<any>(null);
  // Build a static list of public/weather/** candidates
  const weatherPool = useMemo(
    () => [
      "/weather/sunny.png",
      "/weather/rain.png",
      "/weather/snow.png",
      "/weather/rainbow.png",
      "/weather/smog.png",
    ],
    []
  );
  useEffect(() => {
    if (step >= 2) {
      if (!html2Url) setHtml2Url(weatherPool[0] || "/2d/nemo.png");
      // keep picker closed for 3D-anchored HTML (CSS3D) mode
      setPickerOpen(false);
    } else {
      if (html2Url) setHtml2Url(undefined);
      setPickerOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  useEffect(() => {
    if (bannerTimerRef.current) {
      clearTimeout(bannerTimerRef.current);
      bannerTimerRef.current = null;
    }
    // debug: step change
    try { console.log("[room] step ->", step); } catch {}
    // step 1: first Next
    if (step === 1) {
      setBannerText("당신이 좋아하는 시간대를 선택해주세요");
      setBannerVisible(true);
      bannerTimerRef.current = setTimeout(() => setBannerVisible(false), 3000);
    }
    // step 2: second Next
    if (step === 2) {
      setBannerText("창문 밖의 날씨가 어떨 것 같나요?");
      setBannerVisible(true);
      bannerTimerRef.current = setTimeout(() => setBannerVisible(false), 3000);
    }
    return () => {
      if (bannerTimerRef.current) {
        clearTimeout(bannerTimerRef.current);
        bannerTimerRef.current = null;
      }
    };
  }, [step]);
  // During step 2 (weather question), map mobile scroll progress to a weather image (HTML screen)
  useEffect(() => {
    if (step !== 2) return;
    const pool = weatherPool;
    if (!pool || pool.length === 0) return;
    const p = typeof remoteProgress === "number" ? remoteProgress : 0;
    const idx = Math.max(0, Math.min(pool.length - 1, Math.floor(p * pool.length)));
    const url = pool[idx];
    if (url && url !== html2Url) setHtml2Url(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, remoteProgress]);

  // Derive desktop screen 2x2 images from mobile scroll when step === 1 (mood question)
  const moodFolderIndex = useMemo(() => {
    if (step !== 1) return null;
    const p = typeof remoteProgress === "number" ? remoteProgress : 0;
    const idx = Math.max(1, Math.min(9, Math.floor(p * 9) + 1));
    return idx;
  }, [step, remoteProgress]);
  const screenGridImages = useMemo(() => {
    if (!moodFolderIndex) return undefined;
    const base = moodFolderIndex;
    return [1, 2, 3, 4].map((i) => `/2d/${base}/${base}-${i}.png`);
  }, [moodFolderIndex]);

  return (
    <>
      <Room
        initialCamera={camVeryCloseUp}
        cameraTarget={combinedTarget}
        cameraLerp={1200}
        controlsTarget={step >= 2 ? lookWindow : { x: 0, y: 0, z: 0 }}
        controlsLerp={1200}
        initialLight={lightPreset1}
        lightTarget={lightTarget}
        lightLerp={1200}
        pinIntensityTarget={step === 2 ? 6 : 20}
        pinIntensityLerp={900}
        // After two Next presses (step === 2), apply a stronger yaw around Y (reverse direction)
        yawDegTarget={step >= 2 ? -48 : 0}
        yawLerp={1200}
        yawDelayMs={300}
        yawTrigger={step}
        initialHtmlDist={pHtmlDist}
        initialHtmlOffX={pHtmlOffX}
        initialHtmlOffY={pHtmlOffY}
        initialHtmlOffZ={pHtmlOffZ}
        initialHtmlScaleMul={pHtmlScale}
        htmlVisible={step < 2}
        /* remove legacy planes - use HTML picker instead */
        overlayVisible={false}
        overlayPos={{ x: -3.9, y: -1.8, z: -18.6 }}
        overlayScale={1.2}
        overlayOpacityTarget={overlayTarget}
        overlayOpacityLerp={dynamicOverlayLerp}
        enableImg2dPlane={false}
        enableCssWindow={step >= 2}
        img2dUrl={html2Url || "/weather/sunny.png"}
        img2dPos={{ x: -4.9, y: -7.20, z: -30.0 }}
        img2dScale={0.013}
        img2dOpacity={0.32}
        /* html2: starts white; can switch to random genimg via button */
        overlayImageUrl={html2Url}
        overlaySeqList={[]}
        overlayIndex={step >= 2 && remoteOverlayIndex !== null ? remoteOverlayIndex : undefined}
        overlaySlideLerp={500}
        progressTarget={progressTarget as any}
        progressLerp={dynamicProgressLerp}
        progressTrigger={step}
        initialProgress={0.538}
        disableColorMapping={step === 0}
        initialFov={28}
        hideUI={true}
        showPathSlider={step > 0}
        showHtmlSliders={false}
        staticView={true}
        screenGridImages={screenGridImages}
      />
      {/* Picker Overlay */}
      {pickerOpen && step >= 2 && (
        <div
          onWheel={(e) => {
            const dir = e.deltaY > 0 ? 1 : -1;
            setPickerIndex((idx) => {
              const next = (idx + dir + pickerPool.length) % pickerPool.length;
              return next;
            });
            if (pickerStopTimer.current) clearTimeout(pickerStopTimer.current);
            pickerStopTimer.current = setTimeout(() => {
              const chosen = pickerPool[pickerIndex]?.url;
              if (chosen && chosen !== html2Url) setHtml2Url(chosen);
            }, 500);
          }}
          style={{
            position: "fixed",
            inset: 0,
            display: "grid",
            placeItems: "center",
            zIndex: 80,
            pointerEvents: "auto",
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            style={{
              width: "72vw",
              height: "54vh",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(20,22,28,0.35)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 20px 80px rgba(0,0,0,0.45)",
            }}
          >
            {/* Carousel-like layout */}
            <div
              style={{
                display: "flex",
                gap: 24,
                transform: "translateZ(0)",
                willChange: "transform",
              }}
            >
              {pickerPool.map((item, i) => {
                const d = Math.min(
                  Math.abs(i - pickerIndex),
                  pickerPool.length - Math.abs(i - pickerIndex)
                );
                const scale = i === pickerIndex ? 1.0 : d === 1 ? 0.85 : 0.72;
                const opacity = i === pickerIndex ? 1 : d === 1 ? 0.8 : 0.55;
                return (
                  <div
                    key={item.url}
                    onClick={() => {
                      setPickerIndex(i);
                      const chosen = item.url;
                      if (chosen && chosen !== html2Url) setHtml2Url(chosen);
                      // keep picker open for subsequent changes
                    }}
                    style={{
                      width: "28vw",
                      height: "40vh",
                      borderRadius: 12,
                      overflow: "hidden",
                      cursor: "pointer",
                      transform: `scale(${scale})`,
                      transition: "transform 220ms ease, opacity 220ms ease",
                      opacity,
                      border: i === pickerIndex ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.18)",
                      background: "rgba(255,255,255,0.04)",
                      boxShadow: i === pickerIndex ? "0 12px 40px rgba(0,0,0,0.5)" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        filter: "contrast(1.05) saturate(1.02)",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* Top glassy banner modal */}
      {bannerVisible && bannerText && (
        <div
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 70,
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(0,0,0,0.62)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "#e5e7eb",
            backdropFilter: "blur(8px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            fontSize: 13.5,
            letterSpacing: 0.2,
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          {bannerText}
        </div>
      )}
      <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 12, zIndex: 40 }}>
        {step > 0 && (
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #23262d",
              background: "#111318",
              color: "#e5e7eb",
              cursor: "pointer",
            }}
          >
            이전
          </button>
        )}
        {step < steps.length - 1 && (
          <button
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #23262d",
              background: "#111318",
              color: "#e5e7eb",
              cursor: "pointer",
            }}
          >
            다음
          </button>
        )}
        {step >= 2 && (
          <button
            onClick={() => {
              const pool = weatherPool.length ? weatherPool : ["/2d/nemo.png"];
              const i = Math.floor(Math.random() * pool.length);
              const url = pool[i];
              try { console.log("[room] look outside click ->", url); } catch {}
              if (url !== html2Url) setHtml2Url(url);
            }}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #6b5bd4",
              background: "#1a1f2e",
              color: "#e5e7eb",
              cursor: "pointer",
            }}
          >
            밖을 보기
          </button>
        )}
      </div>
      {/* Fade to black at step 3 */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          opacity: step === 3 ? 1 : 0,
          transition: "opacity 1.2s ease",
          pointerEvents: "none",
          zIndex: 60,
        }}
      />
      {/* step 3: fade-out and instruction to look at the window */}
      {step === 3 && lookMsg && (
        <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70 }}>
          <div
            style={{
              pointerEvents: "none",
              padding: "12px 18px",
              borderRadius: 12,
              border: "1px solid #23262d",
              background: "rgba(17,19,24,0.85)",
              color: "#e5e7eb",
              fontSize: 16,
            }}
          >
            이제 창문을 바라봐 주세요
          </div>
        </div>
      )}
    </>
  );
}

