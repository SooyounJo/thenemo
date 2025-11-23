"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function TestPlane() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f1115);

    // camera
    const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 4);

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    container.appendChild(renderer.domElement);

    // plane (settings from the good version)
    const geo = new THREE.PlaneGeometry(1.6, 0.9); // ~16:9
    const mat = new THREE.MeshBasicMaterial({
      map: null,
      color: 0xffffff,
      transparent: false,
      depthTest: true,
      depthWrite: true,
      toneMapped: false,
      side: THREE.DoubleSide,
      opacity: 1.0,
    });
    // z-fighting guard like before
    mat.polygonOffset = true;
    mat.polygonOffsetFactor = -1;
    mat.polygonOffsetUnits = -1;
    const plane = new THREE.Mesh(geo, mat);
    plane.frustumCulled = false;
    plane.position.set(0, 0, 0);
    plane.scale.setScalar(1.2);
    plane.renderOrder = 0;
    scene.add(plane);

    // texture
    const loader = new THREE.TextureLoader();
    const url = "/genimg/3/3-7.png"; // put any public image here
    let disposed = false;
    loader.load(
      url,
      (tex) => {
        if (disposed) {
          tex.dispose && tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.flipY = false;
        tex.needsUpdate = true;
        mat.map = tex;
        mat.needsUpdate = true;
      },
      undefined,
      () => {
        // fallback
        const fallback = new THREE.TextureLoader().load("/2d/nemo.png", (t2) => {
          t2.colorSpace = THREE.SRGBColorSpace;
          t2.flipY = false;
          t2.needsUpdate = true;
          mat.map = t2;
          mat.needsUpdate = true;
        });
      }
    );

    let raf = null;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      if (renderer) {
        renderer.dispose();
        const el = renderer.domElement;
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }
      geo.dispose();
      mat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}


