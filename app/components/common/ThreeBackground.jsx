"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
	const containerRef = useRef(null);
	const rendererRef = useRef(null);
	const rafRef = useRef(null);
	const meshRef = useRef(null);
	const uniformsRef = useRef(null);
	// smooth scrolling-driven targets (approximate original mobile behavior)
	const targetARef = useRef(new THREE.Color("#10131a"));
	const targetBRef = useRef(new THREE.Color("#2a3350"));
	const targetCRef = useRef(new THREE.Color("#9fbaff"));

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: "high-performance",
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
		renderer.setSize(window.innerWidth, window.innerHeight, false);
		rendererRef.current = renderer;
		container.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

		const geometry = new THREE.PlaneGeometry(2, 2);

		const uniforms = {
			uTime: { value: 0 },
			uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
			uA: { value: new THREE.Color("#10131a") },
			uB: { value: new THREE.Color("#2a3350") },
			uC: { value: new THREE.Color("#9fbaff") },
		};
		uniformsRef.current = uniforms;

		const material = new THREE.ShaderMaterial({
			uniforms,
			vertexShader: `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				precision highp float;
				varying vec2 vUv;
				uniform vec2 uResolution;
				uniform float uTime;
				uniform vec3 uA;
				uniform vec3 uB;
				uniform vec3 uC;

				float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
				float noise(vec2 p){
					vec2 i=floor(p), f=fract(p);
					float a=hash(i), b=hash(i+vec2(1.,0.));
					float c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
					vec2 u=f*f*(3.-2.*f);
					return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
				}
				float fbm(vec2 p){
					float v=0., a=.5;
					for(int i=0; i<5; i++){ v+=a*noise(p); p*=2.; a*=.5; }
					return v;
				}
				void main() {
					vec2 uv = vUv;
					float t = uTime*0.05;
					float n = fbm(uv*vec2(3.,2.) + vec2(t,-t));
					vec3 col = mix(uA, uB, smoothstep(0.3,0.7,n));
					// highlight
					vec2 c = uv-0.5;
					float h = exp(-dot(c-vec2(0., -0.18), c-vec2(0., -0.18))*7.0);
					col = mix(col, uC, h*0.18);
					// vignette
					float r = length(c);
					col *= mix(0.85, 1.0, smoothstep(0.9, 0.2, r));
					gl_FragColor = vec4(col, 1.0);
				}
			`,
			depthTest: false,
			depthWrite: false,
		});

		const mesh = new THREE.Mesh(geometry, material);
		meshRef.current = mesh;
		scene.add(mesh);

		const onResize = () => {
			if (!rendererRef.current) return;
			const w = window.innerWidth, h = window.innerHeight;
			rendererRef.current.setSize(w, h, false);
			uniforms.uResolution.value.set(w, h);
		};
		window.addEventListener("resize", onResize);
		const onGradient = (e) => {
			try {
				const { a, b, c } = e.detail || {};
				if (a) uniforms.uA.value = new THREE.Color(a);
				if (b) uniforms.uB.value = new THREE.Color(b);
				if (c) uniforms.uC.value = new THREE.Color(c);
			} catch {}
		};
		window.addEventListener("mobile-gradient", onGradient);
		// scroll-driven palette (match original feeling: warm top, dark bottom)
		const onMobileScroll = (e) => {
			try {
				const y = e?.detail?.y ?? window.scrollY ?? 0;
				// normalize and wrap
				const t = Math.max(0, Math.min(1, (y % 1400) / 1400));
				// base dark
				const dark = new THREE.Color("#0b0d12");
				// mid cool
				const cool = new THREE.Color("#2a3350");
				// warm beige for top highlight
				const warm = new THREE.Color("#dbcba0");
				// compute targets by lerping cool<->warm as t moves, keep dark as base
				targetARef.current.copy(dark);
				targetBRef.current.copy(cool).lerp(warm, 0.55 + 0.45 * Math.sin(t * Math.PI * 2.0));
				targetCRef.current.copy(warm).lerp(cool, 0.25 * Math.cos(t * Math.PI * 2.0));
			} catch {}
		};
		window.addEventListener("mobile-scroll", onMobileScroll, { passive: true });

		const tick = (now) => {
			uniforms.uTime.value = now * 0.001;
			// gentle color lerp toward targets for smoothness
			if (uniforms.uA && uniforms.uB && uniforms.uC) {
				const lerp = (cur, tar, k = 0.06) => cur.lerp(tar, k);
				lerp(uniforms.uA.value, targetARef.current);
				lerp(uniforms.uB.value, targetBRef.current);
				lerp(uniforms.uC.value, targetCRef.current);
			}
			renderer.render(scene, camera);
			rafRef.current = requestAnimationFrame(tick);
		};
		rafRef.current = requestAnimationFrame(tick);

		return () => {
			window.removeEventListener("resize", onResize);
			window.removeEventListener("mobile-gradient", onGradient);
			window.removeEventListener("mobile-scroll", onMobileScroll);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			if (rendererRef.current) {
				const el = rendererRef.current.domElement;
				rendererRef.current.dispose();
				if (el && el.parentNode) el.parentNode.removeChild(el);
			}
			if (meshRef.current) {
				meshRef.current.geometry?.dispose?.();
				meshRef.current.material?.dispose?.();
			}
		};
	}, []);

	return (
		<div
			ref={containerRef}
			style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "#0b0d12" }}
		/>
	);
}


