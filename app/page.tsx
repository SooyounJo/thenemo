/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Leva, folder, useControls } from "leva";

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const floorRef = useRef<THREE.Mesh | null>(null);

  const {
    camX,
    camY,
    camZ,
    floorSize,
    houseScale,
    houseX,
    houseY,
    houseZ,
    lockDistance,
    lockTilt,
    enableZoom,
    enablePan,
  } = useControls({
    Camera: folder({
      camX: { value: -3.2, min: -50, max: 50, step: 0.1 },
      camY: { value: 1.7, min: -50, max: 50, step: 0.1 },
      camZ: { value: 8.6, min: -50, max: 50, step: 0.1 },
      lockDistance: { value: true },
      lockTilt: { value: true },
      enableZoom: { value: false },
      enablePan: { value: false },
    }),
    Floor: folder({
      floorSize: { value: 20, min: 0.1, max: 20, step: 0.1 },
    }),
    House: folder({
      houseScale: { value: 1.01, min: 0.1, max: 10, step: 0.01 },
      houseX: { value: 0, min: -10, max: 10, step: 0.01 },
      houseY: { value: 0.02, min: -10, max: 10, step: 0.01 },
      houseZ: { value: 0, min: -10, max: 10, step: 0.01 },
    }),
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f1115);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(2.5, 2, 3);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = enableZoom;
    controls.enablePan = enablePan;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    const loader = new GLTFLoader();
    loader.load(
      "/house.glb",
      (gltf) => {
        const modelRoot = gltf.scene || gltf.scenes?.[0];
        if (!modelRoot) return;
        scene.add(modelRoot);
        modelRef.current = modelRoot;

        const box = new THREE.Box3().setFromObject(modelRoot);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        modelRoot.position.x += -center.x;
        modelRoot.position.y += -center.y;
        modelRoot.position.z += -center.z;
        // Apply initial house transforms from Leva defaults
        modelRoot.scale.setScalar(houseScale);
        modelRoot.position.x += houseX;
        modelRoot.position.y += houseY;
        modelRoot.position.z += houseZ;

        const maxDim = Math.max(size.x, size.y, size.z);
        const fitOffset = 1.35;
        const fov = THREE.MathUtils.degToRad(camera.fov);
        const distance = (maxDim * fitOffset) / (2 * Math.tan(fov / 2));

        // Use fixed camera from controls (Leva) instead of fit distance
        camera.position.set(camX, camY, camZ);
        const camDist = camera.position.length();
        camera.near = camDist / 100;
        camera.far = camDist * 100;
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();

        controls.target.set(0, 0, 0);
        // Apply locking rules based on current toggles
        if (lockDistance) {
          controls.minDistance = camDist;
          controls.maxDistance = camDist;
        } else {
          controls.minDistance = 0.1;
          controls.maxDistance = Infinity;
        }
        const currentPolar = new THREE.Spherical().setFromVector3(camera.position).phi;
        if (lockTilt) {
          controls.minPolarAngle = currentPolar;
          controls.maxPolarAngle = currentPolar;
        } else {
          controls.minPolarAngle = 0.01;
          controls.maxPolarAngle = Math.PI - 0.01;
        }
        controls.update();

        // Add a floor under the centered model
        const floorY = -size.y / 2;
        const floorSize = Math.max(size.x, size.z) * 10;
        const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
        const floorMaterial = new THREE.MeshStandardMaterial({
          color: 0x16181d,
          roughness: 1,
          metalness: 0,
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = floorY;
        scene.add(floor);
        floorRef.current = floor;
        // Apply initial Leva floor scale
        floor.scale.set(floorSize, 1, floorSize);
      },
      undefined,
      (error) => {
        // eslint-disable-next-line no-console
        console.error("Failed to load /house.glb", error);
      }
    );

    let animationFrameId: number | null = null;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    if ("ResizeObserver" in window) {
      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(container);
    } else {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      } else {
        window.removeEventListener("resize", handleResize);
      }
      controls.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
        const el = rendererRef.current.domElement;
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }
      scene.traverse((obj: THREE.Object3D) => {
        const mesh = obj as THREE.Mesh;
        if (!("isMesh" in mesh) || !(mesh as any).isMesh) return;
        if (mesh.geometry) mesh.geometry.dispose();
        const material: any = (mesh as any).material;
        if (!material) return;
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose && m.dispose());
        } else if (material.dispose) {
          material.dispose();
        }
      });
    };
  }, []);

  // React to Leva - camera position updates
  useEffect(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    camera.position.set(camX, camY, camZ);
    const distance = camera.position.length();
    // Keep clipping planes appropriate to the new distance
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();
    const spherical = new THREE.Spherical().setFromVector3(camera.position);
    if (lockDistance) {
      controls.minDistance = distance;
      controls.maxDistance = distance;
    } else {
      controls.minDistance = 0.1;
      controls.maxDistance = Infinity;
    }
    if (lockTilt) {
      controls.minPolarAngle = spherical.phi;
      controls.maxPolarAngle = spherical.phi;
    } else {
      controls.minPolarAngle = 0.01;
      controls.maxPolarAngle = Math.PI - 0.01;
    }
    controls.enableZoom = enableZoom;
    controls.enablePan = enablePan;
    controls.update();
  }, [camX, camY, camZ, lockDistance, lockTilt, enableZoom, enablePan]);

  // React to Leva - floor size update
  useEffect(() => {
    const floor = floorRef.current;
    if (!floor) return;
    floor.scale.set(floorSize, 1, floorSize);
  }, [floorSize]);

  // React to Leva - house transform updates
  useEffect(() => {
    const model = modelRef.current;
    if (!model) return;
    model.scale.setScalar(houseScale);
    model.position.set(houseX, houseY, houseZ);
  }, [houseScale, houseX, houseY, houseZ]);

  return (
    <>
      <Leva collapsed={false} />
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
    </>
  );
}
