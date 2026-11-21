import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ZoomIn, ZoomOut, RotateCcw, Compass } from 'lucide-react';
import { soundManager } from '../../utils/audioSynth';

export const Trophy3DCanvas = () => {
  const containerRef = useRef(null);
  const [isGlowActive, setIsGlowActive] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomLevelPercent, setZoomLevelPercent] = useState(100);
  const lastZoomPercentRef = useRef(100);

  // References for external controls and state
  const orbitControlsRef = useRef(null);
  const cameraRef = useRef(null);
  const glowTimerRef = useRef(null);

  // Zoom Handler for UI buttons
  const handleZoomIn = useCallback(() => {
    const controls = orbitControlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;

    const dir = new THREE.Vector3().subVectors(camera.position, controls.target);
    const newDist = Math.max(controls.minDistance, dir.length() - 0.35);
    dir.setLength(newDist);
    camera.position.copy(controls.target).add(dir);
    controls.update();
    soundManager.playButtonClick();
  }, []);

  const handleZoomOut = useCallback(() => {
    const controls = orbitControlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;

    const dir = new THREE.Vector3().subVectors(camera.position, controls.target);
    const newDist = Math.min(controls.maxDistance, dir.length() + 0.35);
    dir.setLength(newDist);
    camera.position.copy(controls.target).add(dir);
    controls.update();
    soundManager.playButtonClick();
  }, []);

  const handleResetView = useCallback(() => {
    const controls = orbitControlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;

    camera.position.set(0, 0.02, 3.25);
    controls.target.set(0, 0.02, 0);
    controls.update();
    soundManager.playButtonClick();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 450;

    // --- 1. Scene & Camera ---
    const scene = new THREE.Scene();
    // 38-degree FOV at distance 3.25 provides ~2.25 vertical units, perfectly framing the 1.88 unit trophy with 40px margin top and bottom
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.02, 3.25);
    camera.lookAt(0, 0.02, 0);
    cameraRef.current = camera;

    // --- 2. WebGL Renderer ---
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Ensure touch events on mobile are not intercepted by the browser for page scrolling
    renderer.domElement.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    // --- 3. OrbitControls for Real 360-Degree Interactive Inspection ---
    const controls = new OrbitControls(camera, renderer.domElement);
    orbitControlsRef.current = controls;

    controls.target.set(0, 0.02, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false; // Keep trophy centered in view
    controls.minDistance = 2.4;
    controls.maxDistance = 4.2;

    // Allow vertical rotation to inspect top of cup and lower base
    controls.minPolarAngle = Math.PI * 0.22; // ~40° (inspect down into cup)
    controls.maxPolarAngle = Math.PI * 0.62; // ~112° (inspect up at bottom plinth without clipping)

    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.1;

    let isUserDragging = false;
    let lastInteractionTime = performance.now();

    controls.addEventListener('start', () => {
      isUserDragging = true;
      setIsInteracting(true);
      controls.autoRotate = false;
    });

    controls.addEventListener('end', () => {
      isUserDragging = false;
      setIsInteracting(false);
      lastInteractionTime = performance.now();
    });

    // --- 4. Procedural Studio Reflection Map (Equirectangular) ---
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const eCtx = envCanvas.getContext('2d');
    if (eCtx) {
      const bg = eCtx.createLinearGradient(0, 0, 0, 256);
      bg.addColorStop(0, '#10071C');
      bg.addColorStop(0.48, '#321948');
      bg.addColorStop(0.52, '#28143C');
      bg.addColorStop(1, '#0A0410');
      eCtx.fillStyle = bg;
      eCtx.fillRect(0, 0, 512, 256);

      // Overhead Softbox: Warm Brilliant Champagne-Gold
      const gradTop = eCtx.createRadialGradient(256, 50, 5, 256, 50, 130);
      gradTop.addColorStop(0, '#FFFDF0');
      gradTop.addColorStop(0.3, '#FFE699');
      gradTop.addColorStop(0.7, '#D4A030');
      gradTop.addColorStop(1, 'transparent');
      eCtx.fillStyle = gradTop;
      eCtx.fillRect(0, 0, 512, 140);

      // Left Horizon Key Softbox
      const gradLeft = eCtx.createRadialGradient(70, 128, 5, 70, 128, 80);
      gradLeft.addColorStop(0, '#FFF3C4');
      gradLeft.addColorStop(0.4, '#E5B242');
      gradLeft.addColorStop(1, 'transparent');
      eCtx.fillStyle = gradLeft;
      eCtx.fillRect(0, 50, 160, 160);

      // Right Lavender Fill Softbox
      const gradRight = eCtx.createRadialGradient(440, 128, 5, 440, 128, 85);
      gradRight.addColorStop(0, '#F0E2FF');
      gradRight.addColorStop(0.4, '#A775E0');
      gradRight.addColorStop(1, 'transparent');
      eCtx.fillStyle = gradRight;
      eCtx.fillRect(350, 50, 162, 160);

      // Floor Warm Amber Bounce
      const gradFloor = eCtx.createRadialGradient(256, 220, 5, 256, 220, 110);
      gradFloor.addColorStop(0, '#5C3810');
      gradFloor.addColorStop(0.8, '#1A0C04');
      gradFloor.addColorStop(1, 'transparent');
      eCtx.fillStyle = gradFloor;
      eCtx.fillRect(100, 165, 312, 91);
    }
    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    envTexture.colorSpace = THREE.SRGBColorSpace;
    scene.environment = envTexture;

    // --- 5. Front Nameplate Texture (Prestigious Personalized 100-Day Award) ---
    // Single Nameplate on Lower Front: "100 DAYS CELEBRATION REWARD / PRESENTED TO / COMMANDER ESTELLE"
    const plaqueCanvas = document.createElement('canvas');
    plaqueCanvas.width = 1024;
    plaqueCanvas.height = 420;
    const pCtx = plaqueCanvas.getContext('2d');
    if (pCtx) {
      // Premium Dark Metallic Plaque Background (Deep Obsidian Bronze)
      const bgGrad = pCtx.createLinearGradient(0, 0, 1024, 420);
      bgGrad.addColorStop(0, '#130C1C');
      bgGrad.addColorStop(0.3, '#261733');
      bgGrad.addColorStop(0.5, '#1E1229');
      bgGrad.addColorStop(0.8, '#261733');
      bgGrad.addColorStop(1, '#110A18');
      pCtx.fillStyle = bgGrad;
      pCtx.fillRect(0, 0, 1024, 420);

      // Outer Refined Champagne-Gold Beveled Border
      pCtx.strokeStyle = '#E5B84B';
      pCtx.lineWidth = 10;
      pCtx.strokeRect(8, 8, 1008, 404);

      // Inner Delicate Gold Pinstripe
      pCtx.strokeStyle = '#FFE899';
      pCtx.lineWidth = 3;
      pCtx.strokeRect(20, 20, 984, 380);

      // 4 Corner Gold Screws / Rivets
      const drawScrew = (x, y) => {
        pCtx.fillStyle = '#6E450E';
        pCtx.beginPath();
        pCtx.arc(x, y, 9, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.fillStyle = '#FFF8D0';
        pCtx.beginPath();
        pCtx.arc(x - 2, y - 2, 4, 0, Math.PI * 2);
        pCtx.fill();
      };
      drawScrew(38, 38);
      drawScrew(986, 38);
      drawScrew(38, 382);
      drawScrew(986, 382);

      // Helper function to create shining champagne-gold text gradient
      const createGoldTextGradient = (yTop, yBot) => {
        const g = pCtx.createLinearGradient(0, yTop, 0, yBot);
        g.addColorStop(0, '#FFFDF5');
        g.addColorStop(0.28, '#FFE696');
        g.addColorStop(0.65, '#E5B438');
        g.addColorStop(1, '#C2881C');
        return g;
      };

      pCtx.textAlign = 'center';

      // Line 1: Strongest Visual Emphasis - "100 DAYS CELEBRATION REWARD"
      pCtx.font = 'bold 42px "Cinzel", "Times New Roman", Georgia, serif';
      pCtx.letterSpacing = '4px';
      pCtx.fillStyle = createGoldTextGradient(70, 125);
      pCtx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      pCtx.shadowBlur = 6;
      pCtx.shadowOffsetY = 2;
      pCtx.fillText('100 DAYS CELEBRATION REWARD', 512, 118);

      // Line 2: "PRESENTED TO"
      pCtx.font = 'bold 24px "Cinzel", Georgia, sans-serif';
      pCtx.letterSpacing = '6px';
      pCtx.fillStyle = '#DFBA68';
      pCtx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      pCtx.shadowBlur = 4;
      pCtx.shadowOffsetY = 1;
      pCtx.fillText('PRESENTED TO', 512, 202);

      // Line 3: "COMMANDER ESTELLE" - Prominently Centered, Bold & Beautifully Emphasized
      pCtx.font = 'bold 56px "Cinzel", "Times New Roman", Georgia, serif';
      pCtx.letterSpacing = '5px';
      pCtx.fillStyle = createGoldTextGradient(245, 310);
      pCtx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      pCtx.shadowBlur = 8;
      pCtx.shadowOffsetY = 3;
      pCtx.fillText('COMMANDER ESTELLE', 512, 302);

      // Reset shadows
      pCtx.shadowColor = 'transparent';
      pCtx.shadowBlur = 0;
      pCtx.shadowOffsetY = 0;
    }
    const plaqueTexture = new THREE.CanvasTexture(plaqueCanvas);
    plaqueTexture.colorSpace = THREE.SRGBColorSpace;

    // --- 6. Realistic Metallic Materials ---
    const champagneGoldMaterial = new THREE.MeshStandardMaterial({
      color: 0xFDE78B,
      metalness: 0.95,
      roughness: 0.14,
      emissive: 0x2A1C06,
      emissiveIntensity: 0.22,
      envMapIntensity: 1.4
    });

    const deepGoldTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0xE8B838,
      metalness: 0.92,
      roughness: 0.20,
      emissive: 0x261704,
      emissiveIntensity: 0.20,
      envMapIntensity: 1.3
    });

    const ebonyMarbleMaterial = new THREE.MeshStandardMaterial({
      color: 0x14101A,
      metalness: 0.38,
      roughness: 0.22,
      emissive: 0x08060E,
      emissiveIntensity: 0.10,
      envMapIntensity: 0.9
    });

    const plaqueMaterial = new THREE.MeshStandardMaterial({
      map: plaqueTexture,
      metalness: 0.88,
      roughness: 0.22,
      emissive: 0x241604,
      emissiveIntensity: 0.16,
      envMapIntensity: 1.2
    });

    // --- 7. Rebuilt, Clean, Symmetrical 3D Trophy Geometry ---
    const trophyGroup = new THREE.Group();
    scene.add(trophyGroup);

    const interactiveMeshes = [];

    // [A] BASE CONSTRUCTION (From y = -0.92 to y = -0.18, Total Height = 0.74)
    // 1. Bottommost Heavy Gold Plinth Foot (y = -0.92 to y = -0.84)
    const plinthFootGeo = new THREE.CylinderGeometry(0.56, 0.58, 0.08, 48);
    plinthFootGeo.translate(0, -0.88, 0);
    const plinthFootMesh = new THREE.Mesh(plinthFootGeo, deepGoldTrimMaterial);
    trophyGroup.add(plinthFootMesh);
    interactiveMeshes.push(plinthFootMesh);

    // 2. Stepped Bevel Gold Collar (y = -0.84 to y = -0.76)
    const bevelStepGeo = new THREE.CylinderGeometry(0.50, 0.54, 0.08, 48);
    bevelStepGeo.translate(0, -0.80, 0);
    const bevelStepMesh = new THREE.Mesh(bevelStepGeo, champagneGoldMaterial);
    trophyGroup.add(bevelStepMesh);
    interactiveMeshes.push(bevelStepMesh);

    // 3. Solid Dark Ebony Marble Pedestal Block (y = -0.76 to y = -0.28)
    const blockGeo = new THREE.CylinderGeometry(0.42, 0.48, 0.48, 48);
    blockGeo.translate(0, -0.52, 0);
    const blockMesh = new THREE.Mesh(blockGeo, ebonyMarbleMaterial);
    trophyGroup.add(blockMesh);
    interactiveMeshes.push(blockMesh);

    // Molded Gold Trims (Lower and Upper Edges of Pedestal Block)
    const trimLowerGeo = new THREE.TorusGeometry(0.482, 0.016, 16, 48);
    trimLowerGeo.rotateX(Math.PI / 2);
    trimLowerGeo.translate(0, -0.75, 0);
    const trimLowerMesh = new THREE.Mesh(trimLowerGeo, deepGoldTrimMaterial);
    trophyGroup.add(trimLowerMesh);

    const trimUpperGeo = new THREE.TorusGeometry(0.422, 0.016, 16, 48);
    trimUpperGeo.rotateX(Math.PI / 2);
    trimUpperGeo.translate(0, -0.29, 0);
    const trimUpperMesh = new THREE.Mesh(trimUpperGeo, deepGoldTrimMaterial);
    trophyGroup.add(trimUpperMesh);

    // 4. Front Nameplate (Centered facing +Z axis, perfectly shaped to the pedestal taper)
    const plaqueArc = Math.PI * 0.44;
    const plaqueGeo = new THREE.CylinderGeometry(0.448, 0.482, 0.26, 36, 1, true, -plaqueArc / 2, plaqueArc);
    plaqueGeo.translate(0, -0.52, 0);
    const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMaterial);
    trophyGroup.add(plaqueMesh);
    interactiveMeshes.push(plaqueMesh);

    // 5. Base Top Gold Cap Collar (y = -0.28 to y = -0.18)
    const capGeo = new THREE.CylinderGeometry(0.24, 0.38, 0.10, 48);
    capGeo.translate(0, -0.23, 0);
    const capMesh = new THREE.Mesh(capGeo, deepGoldTrimMaterial);
    trophyGroup.add(capMesh);
    interactiveMeshes.push(capMesh);

    const capRingGeo = new THREE.TorusGeometry(0.245, 0.016, 16, 48);
    capRingGeo.rotateX(Math.PI / 2);
    capRingGeo.translate(0, -0.18, 0);
    const capRingMesh = new THREE.Mesh(capRingGeo, deepGoldTrimMaterial);
    trophyGroup.add(capRingMesh);

    // [B] STEM CONSTRUCTION (From y = -0.18 to y = 0.20, Total Height = 0.38)
    const stemPoints = [
      new THREE.Vector2(0, -0.18),
      new THREE.Vector2(0.14, -0.18),
      new THREE.Vector2(0.09, -0.10),
      new THREE.Vector2(0.08, -0.04),
      new THREE.Vector2(0.14, 0.01), // Central knop bead
      new THREE.Vector2(0.08, 0.06),
      new THREE.Vector2(0.09, 0.12),
      new THREE.Vector2(0.16, 0.20), // Flare meeting cup base
      new THREE.Vector2(0, 0.20)
    ];
    const stemGeo = new THREE.LatheGeometry(stemPoints, 48);
    const stemMesh = new THREE.Mesh(stemGeo, champagneGoldMaterial);
    trophyGroup.add(stemMesh);
    interactiveMeshes.push(stemMesh);

    // [C] CUP / CHALICE CONSTRUCTION (From y = 0.20 to y = 0.96, Total Height = 0.76)
    const cupPoints = [
      new THREE.Vector2(0, 0.20),
      new THREE.Vector2(0.16, 0.20),
      new THREE.Vector2(0.24, 0.25),
      new THREE.Vector2(0.36, 0.35),
      new THREE.Vector2(0.44, 0.50),
      new THREE.Vector2(0.48, 0.68),
      new THREE.Vector2(0.46, 0.82),
      new THREE.Vector2(0.50, 0.95),
      new THREE.Vector2(0.48, 0.96),
      new THREE.Vector2(0.44, 0.93),
      new THREE.Vector2(0.40, 0.78),
      new THREE.Vector2(0.30, 0.50),
      new THREE.Vector2(0.18, 0.30),
      new THREE.Vector2(0, 0.24)
    ];
    const cupGeo = new THREE.LatheGeometry(cupPoints, 56);
    const cupMesh = new THREE.Mesh(cupGeo, champagneGoldMaterial);
    trophyGroup.add(cupMesh);
    interactiveMeshes.push(cupMesh);

    // Rolled Gold Lip Bead
    const rimGeo = new THREE.TorusGeometry(0.495, 0.022, 16, 56);
    rimGeo.rotateX(Math.PI / 2);
    rimGeo.translate(0, 0.95, 0);
    const rimMesh = new THREE.Mesh(rimGeo, deepGoldTrimMaterial);
    trophyGroup.add(rimMesh);
    interactiveMeshes.push(rimMesh);

    // [D] WINGED SCROLLED HANDLES (Left & Right)
    const handleCurvePoints = [
      new THREE.Vector3(0.44, 0.90, 0),
      new THREE.Vector3(0.66, 0.96, 0),
      new THREE.Vector3(0.78, 0.78, 0),
      new THREE.Vector3(0.76, 0.55, 0),
      new THREE.Vector3(0.62, 0.40, 0),
      new THREE.Vector3(0.44, 0.36, 0),
      new THREE.Vector3(0.36, 0.38, 0)
    ];
    const handleCurve = new THREE.CatmullRomCurve3(handleCurvePoints);
    const handleGeo = new THREE.TubeGeometry(handleCurve, 40, 0.034, 14, false);

    const leftHandle = new THREE.Mesh(handleGeo, champagneGoldMaterial);
    trophyGroup.add(leftHandle);
    interactiveMeshes.push(leftHandle);

    const rightHandleGeo = handleGeo.clone();
    rightHandleGeo.scale(-1, 1, 1);
    const rightHandle = new THREE.Mesh(rightHandleGeo, champagneGoldMaterial);
    trophyGroup.add(rightHandle);
    interactiveMeshes.push(rightHandle);

    // Decorative Bosses at Handle Connections
    const bossGeo = new THREE.SphereGeometry(0.046, 16, 16);
    const createBoss = (x, y, z) => {
      const m = new THREE.Mesh(bossGeo, deepGoldTrimMaterial);
      m.position.set(x, y, z);
      trophyGroup.add(m);
      interactiveMeshes.push(m);
    };
    createBoss(0.44, 0.90, 0);
    createBoss(-0.44, 0.90, 0);
    createBoss(0.36, 0.38, 0);
    createBoss(-0.36, 0.38, 0);

    // Trophy Center alignment: Trophy bounds are -0.92 to +0.96 (Midpoint = 0.02)
    // Trophy sits naturally centered in the viewport
    trophyGroup.position.set(0, 0, 0);

    // --- 8. Floating Golden Particles ---
    const particleCount = 55;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 4.0;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.4;
      particleSpeeds[i] = 0.002 + Math.random() * 0.004;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xFFE599,
      size: 0.046,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- 9. Cinematic Studio Lighting ---
    // Warm Key Spotlight focused on trophy
    const keySpot = new THREE.SpotLight(0xFFF6DE, 2.8, 12, Math.PI / 4, 0.5, 1.2);
    keySpot.position.set(2.4, 3.8, 3.2);
    keySpot.target = trophyGroup;
    scene.add(keySpot);

    // Lavender / Violet Rim Backlight
    const rimBacklight = new THREE.DirectionalLight(0xB880FF, 2.6);
    rimBacklight.position.set(0, 3.0, -3.2);
    scene.add(rimBacklight);

    // Left Warm Fill Light
    const fillLight = new THREE.DirectionalLight(0xFFE5B8, 1.1);
    fillLight.position.set(-3.0, 1.4, 2.2);
    scene.add(fillLight);

    // Warm Under-glow (Illuminates bottom of bowl & base)
    const underLight = new THREE.PointLight(0xFFAA33, 1.3, 6);
    underLight.position.set(0, -1.2, 1.8);
    scene.add(underLight);

    // Soft Ambient Light
    const ambientLight = new THREE.AmbientLight(0x2C183D, 0.8);
    scene.add(ambientLight);

    // --- 10. Click & Hover Highlights ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let targetEmissiveIntensity = 0.22;
    let currentEmissiveIntensity = 0.22;
    let glowLerpFactor = 0.08;

    const triggerTrophyGlow = () => {
      targetEmissiveIntensity = 0.92;
      glowLerpFactor = 0.16;

      setIsGlowActive(true);
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
      glowTimerRef.current = setTimeout(() => {
        setIsGlowActive(false);
      }, 900);

      soundManager.playStarChime(1.18);

      setTimeout(() => {
        targetEmissiveIntensity = 0.22;
        glowLerpFactor = 0.06;
      }, 260);
    };

    const domElement = renderer.domElement;

    // Hover raycasting
    const onPointerMove = (e) => {
      const rect = domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, false);
      const hovered = intersects.length > 0;

      setIsHovered(hovered);
      if (!isUserDragging) {
        domElement.style.cursor = hovered ? 'grab' : 'default';
        if (!isGlowActive) {
          targetEmissiveIntensity = hovered ? 0.38 : 0.22;
        }
      }
    };

    // Click on trophy to trigger golden glow wave
    let pointerDownTime = 0;
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      pointerDownTime = performance.now();
      pointerDownPos = { x: e.clientX, y: e.clientY };
      domElement.style.cursor = 'grabbing';
    };

    const onPointerUp = (e) => {
      domElement.style.cursor = 'default';
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      const elapsed = performance.now() - pointerDownTime;

      // If it was a click/tap (not a drag)
      if (dist < 6 && elapsed < 350) {
        const rect = domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshes, false);
        if (intersects.length > 0) {
          triggerTrophyGlow();
        }
      }
    };

    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointerup', onPointerUp);

    // --- 11. Animation Loop & Entrance Sequence ---
    let animationFrameId;
    const startTime = performance.now();
    const ENTRANCE_DURATION = 1300; // ms

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const elapsed = now - startTime;

      // Smooth Entrance Animation
      if (elapsed < ENTRANCE_DURATION) {
        const progress = Math.min(1, elapsed / ENTRANCE_DURATION);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const yOffset = (1 - easeOut) * -2.2;
        trophyGroup.position.y = yOffset;
      } else {
        trophyGroup.position.y = 0;
      }

      // Resume gentle auto-rotation after 2.4s of no manual interaction
      if (!isUserDragging && now - lastInteractionTime > 2400) {
        controls.autoRotate = true;
      } else {
        controls.autoRotate = false;
      }

      // Update OrbitControls
      controls.update();

      // Update Zoom percentage state for UI only when value changes
      const camDist = camera.position.distanceTo(controls.target);
      const zNorm = 1 - (camDist - controls.minDistance) / (controls.maxDistance - controls.minDistance);
      const calculatedPercent = Math.round(75 + zNorm * 75);
      if (lastZoomPercentRef.current !== calculatedPercent) {
        lastZoomPercentRef.current = calculatedPercent;
        setZoomLevelPercent(calculatedPercent);
      }

      // Smooth Emissive Glow Pulse
      currentEmissiveIntensity += (targetEmissiveIntensity - currentEmissiveIntensity) * glowLerpFactor;
      champagneGoldMaterial.emissiveIntensity = currentEmissiveIntensity;
      deepGoldTrimMaterial.emissiveIntensity = currentEmissiveIntensity * 0.92;
      plaqueMaterial.emissiveIntensity = 0.16 + (currentEmissiveIntensity - 0.22) * 0.5;

      // Animate Floating Particles
      const posAttr = particleGeo.attributes.position;
      const positions = posAttr.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i];
        if (positions[i * 3 + 1] > 1.8) {
          positions[i * 3 + 1] = -1.8;
          positions[i * 3] = (Math.random() - 0.5) * 4.0;
        }
      }
      posAttr.needsUpdate = true;
      particles.rotation.y += 0.0006;

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // --- 12. Cleanup on Unmount ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);

      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      controls.dispose();

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }

      // Dispose Geometries
      plinthFootGeo.dispose();
      bevelStepGeo.dispose();
      blockGeo.dispose();
      trimLowerGeo.dispose();
      trimUpperGeo.dispose();
      plaqueGeo.dispose();
      capGeo.dispose();
      capRingGeo.dispose();
      stemGeo.dispose();
      cupGeo.dispose();
      rimGeo.dispose();
      handleGeo.dispose();
      rightHandleGeo.dispose();
      bossGeo.dispose();
      particleGeo.dispose();

      // Dispose Materials & Textures
      champagneGoldMaterial.dispose();
      deepGoldTrimMaterial.dispose();
      ebonyMarbleMaterial.dispose();
      plaqueMaterial.dispose();
      particleMat.dispose();

      envTexture.dispose();
      plaqueTexture.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      {/* 1. Rotating Soft Golden Light Rays (Godray Effect) */}
      <div
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, rgba(255,225,120,0.18) 0deg, transparent 20deg, rgba(255,225,120,0.15) 45deg, transparent 70deg, rgba(200,160,255,0.12) 90deg, transparent 115deg, rgba(255,225,120,0.18) 135deg, transparent 160deg, rgba(255,225,120,0.15) 180deg, transparent 205deg, rgba(200,160,255,0.12) 225deg, transparent 250deg, rgba(255,225,120,0.18) 270deg, transparent 295deg, rgba(255,225,120,0.15) 315deg, transparent 340deg, rgba(255,225,120,0.18) 360deg)',
          animation: 'rayRotate 35s linear infinite',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.65
        }}
      />

      {/* 2. Soft Warm Golden & Lavender Spotlight Stage Glow */}
      <div
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: isGlowActive
            ? 'radial-gradient(circle, rgba(255, 230, 140, 0.55) 0%, rgba(212, 175, 55, 0.32) 42%, rgba(139, 92, 180, 0.18) 65%, transparent 75%)'
            : isHovered
            ? 'radial-gradient(circle, rgba(255, 225, 120, 0.42) 0%, rgba(212, 175, 55, 0.24) 45%, rgba(139, 92, 180, 0.14) 65%, transparent 75%)'
            : 'radial-gradient(circle, rgba(255, 218, 105, 0.34) 0%, rgba(212, 175, 55, 0.16) 45%, rgba(139, 92, 180, 0.10) 65%, transparent 75%)',
          transition: 'all 0.45s ease',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* 3. Interactive Golden Glow Pulse Ripple Wave */}
      <AnimatePresence>
        {isGlowActive && (
          <motion.div
            initial={{ scale: 0.55, opacity: 0.85 }}
            animate={{ scale: 1.45, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '42%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              border: '2px solid rgba(255, 235, 145, 0.85)',
              boxShadow: '0 0 45px rgba(255, 220, 90, 0.55)',
              pointerEvents: 'none',
              zIndex: 2
            }}
          />
        )}
      </AnimatePresence>

      {/* 4. 3D WebGL Canvas Container (Height 450px ensures entire trophy & base are fully framed) */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: 'clamp(320px, 48vh, 450px)',
          position: 'relative',
          zIndex: 3,
          touchAction: 'none'
        }}
        title="Drag to rotate 360° horizontally & vertically • Scroll/Pinch to zoom • Click to inspect"
      />

      {/* 5. Interactive Cinematic Toolbar (Zoom In, Zoom Out, Reset View) */}
      <div
        style={{
          position: 'relative',
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          marginTop: '4px'
        }}
      >
        {/* Controls Pill Bar */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '30px',
            padding: '5px 14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
          }}
        >
          {/* Zoom Out Button */}
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F5D061',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '50%',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <ZoomOut size={16} />
          </button>

          {/* Current Zoom Indicator */}
          <span
            style={{
              fontSize: '11px',
              fontFamily: "'Cinzel', monospace",
              fontWeight: 700,
              color: '#FFF2C6',
              minWidth: '42px',
              textAlign: 'center'
            }}
          >
            {zoomLevelPercent}%
          </span>

          {/* Zoom In Button */}
          <button
            onClick={handleZoomIn}
            title="Zoom In (Close-up)"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F5D061',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '50%',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <ZoomIn size={16} />
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '14px', background: 'rgba(212, 175, 55, 0.35)' }} />

          {/* Reset View Button */}
          <button
            onClick={handleResetView}
            title="Reset to Front-Facing View"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#D8C7E8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '12px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFF2C6';
              e.currentTarget.style.background = 'rgba(212,175,55,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#D8C7E8';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <RotateCcw size={13} />
            <span>Reset View</span>
          </button>
        </div>

        {/* Prominent Elegant Instruction: DRAG TO EXPLORE 360° */}
        <div
          style={{
            fontSize: '11.5px',
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            color: isInteracting ? '#FFE48A' : isHovered ? '#FFF2C6' : '#D4AF37',
            letterSpacing: '0.12em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.3s ease',
            textShadow: '0 2px 8px rgba(0,0,0,0.6)'
          }}
        >
          <Compass size={13} color="#D4AF37" />
          <span>DRAG TO EXPLORE 360°</span>
          <Sparkles size={12} color="#D4AF37" />
        </div>
      </div>
    </div>
  );
};
