import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Camera, Mail, Gift, ArrowRight, Trash2, Eye, Languages } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/audioSynth';
import { boxContentsData } from '../../data/boxContents';
import { memoriesData } from '../../data/memories';
import { MemoryIllustration } from '../Scrapbook/MemoryIllustrations';
import { CloseButton } from '../Common/CloseButton';
import { useEscapeKey } from '../../utils/useEscapeKey';
import { StarsUniverse } from './StarsUniverse';
import { PocketWatchKeepsake } from './PocketWatchKeepsake';
import { SurpriseCardsModal } from './SurpriseCardsModal';
import { specialNoteLetterContent } from '../../data/specialNoteLetter';
import {
  getInitialScrapbookPhotos,
  loadAllScrapbookPhotos,
  saveScrapbookPhoto,
  deleteScrapbookPhoto,
  compressImage
} from '../../utils/photoStorage';

// --- Procedural Studio Texture Generators ---

function createPaperTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep royal lavender / luxury purple base
  ctx.fillStyle = '#654484';
  ctx.fillRect(0, 0, 512, 512);

  // Micro-fiber luxury paper grain
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 16;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain * 0.9));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain * 1.15));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function createSatinTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Champagne gold satin gradient
  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, '#FFE89E');
  grad.addColorStop(0.3, '#E6C15E');
  grad.addColorStop(0.6, '#F8DC88');
  grad.addColorStop(1, '#CAA03A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Fine longitudinal weave lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let x = 0; x < 256; x += 3) {
    ctx.fillRect(x, 0, 1.5, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 4);
  return texture;
}

function createLetterCoverTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');

  // Cream parchment
  ctx.fillStyle = '#FFFDF7';
  ctx.fillRect(0, 0, 512, 360);

  // Golden foil border
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 6;
  ctx.strokeRect(16, 16, 480, 328);

  ctx.lineWidth = 1.5;
  ctx.strokeRect(24, 24, 464, 312);

  // Elegant heading
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 22px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ A LITTLE SOMETHING FOR YOU ✦', 256, 80);

  ctx.fillStyle = '#4E3A66';
  ctx.font = 'italic 18px serif';
  ctx.fillText('For Commander Estelle • Day 100', 256, 115);

  // Subtle handwritten lines
  ctx.fillStyle = 'rgba(100, 80, 130, 0.25)';
  for (let y = 160; y < 310; y += 22) {
    ctx.fillRect(70, y, 372, 3);
  }

  return new THREE.CanvasTexture(canvas);
}

function createPolaroidTexture(caption = 'Hello', color = '#8B6FA9') {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 380;
  const ctx = canvas.getContext('2d');

  // Heavyweight white cardstock
  ctx.fillStyle = '#FFFEFC';
  ctx.fillRect(0, 0, 320, 380);

  // Photo Inset
  ctx.fillStyle = color;
  ctx.fillRect(24, 24, 272, 260);

  // Inner decorative art
  const grad = ctx.createLinearGradient(24, 24, 296, 284);
  grad.addColorStop(0, color);
  grad.addColorStop(1, '#FFF5EA');
  ctx.fillStyle = grad;
  ctx.fillRect(32, 32, 256, 244);

  // Sparkle star in center
  ctx.fillStyle = '#FFFDF7';
  ctx.font = '32px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨', 160, 165);

  // Handwritten caption
  ctx.fillStyle = '#5A4670';
  ctx.font = 'italic 18px cursive, serif';
  ctx.fillText(caption, 160, 335);

  return new THREE.CanvasTexture(canvas);
}

function createEnvelopeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 380;
  canvas.height = 260;
  const ctx = canvas.getContext('2d');

  // Soft ivory stationery
  ctx.fillStyle = '#FDF9F0';
  ctx.fillRect(0, 0, 380, 260);

  // Fold shadow
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(190, 130);
  ctx.lineTo(380, 0);
  ctx.stroke();

  // Bottom folds
  ctx.beginPath();
  ctx.moveTo(0, 260);
  ctx.lineTo(190, 130);
  ctx.lineTo(380, 260);
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

function createStudioFloorShadow() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  grad.addColorStop(0, 'rgba(25, 14, 38, 0.7)');
  grad.addColorStop(0.35, 'rgba(35, 20, 50, 0.35)');
  grad.addColorStop(0.7, 'rgba(40, 25, 55, 0.12)');
  grad.addColorStop(1, 'rgba(40, 25, 55, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  return new THREE.CanvasTexture(canvas);
}

// --- Main 3D Gift Box Component ---

export const ThreeGiftBox = ({ onExploreMore }) => {
  const mountRef = useRef(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [hovered3DItem, setHovered3DItem] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(memoriesData[0]);
  const [customPhotos, setCustomPhotos] = useState(getInitialScrapbookPhotos);
  const [showStarUniverse, setShowStarUniverse] = useState(false);
  const [letterLang, setLetterLang] = useState('en');

  // Sync with persistent IndexedDB & Scrapbook storage on mount
  useEffect(() => {
    loadAllScrapbookPhotos().then((stored) => {
      if (stored && Object.keys(stored).length > 0) {
        setCustomPhotos((prev) => ({ ...prev, ...stored }));
      }
    });
  }, []);

  // Enable Escape key to close active modal
  useEscapeKey(() => setActiveModal(null), activeModal !== null);

  const sceneRefs = useRef({
    scene: null,
    camera: null,
    renderer: null,
    lidHingeGroup: null,
    lidMesh: null,
    bowGroup: null,
    lidRibbonX: null,
    lidRibbonZ: null,
    baseRibbons: null,
    interiorGroup: null,
    boxGroup: null,
    interiorLight: null,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    clickableObjects: [],
    targetCamPos: new THREE.Vector3(0, 1.45, 5.6),
    targetLookAt: new THREE.Vector3(0, 0.1, 0),
    isOpenedRef: false,
    openProgress: 0,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    rotationTarget: { x: -0.05, y: 0.35 },
    animFrameId: null
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRefs.current.scene = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 1.45, 5.6);
    camera.lookAt(0, 0.1, 0);
    sceneRefs.current.camera = camera;

    // 3. Renderer with Physically Based Lighting & Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    sceneRefs.current.renderer = renderer;

    // 4. Cinematic Studio Lighting
    // Warm Ambient Light
    const ambientLight = new THREE.AmbientLight(0xF8EEFC, 1.3);
    scene.add(ambientLight);

    // High Key Spotlight (casts soft studio shadow)
    const keySpot = new THREE.SpotLight(0xFFF8EA, 3.2, 25, 0.65, 0.8, 1.5);
    keySpot.position.set(4, 7, 5.5);
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 1024;
    keySpot.shadow.mapSize.height = 1024;
    keySpot.shadow.bias = -0.0001;
    keySpot.shadow.radius = 4;
    scene.add(keySpot);

    // Soft Lavender Fill Light
    const fillLight = new THREE.DirectionalLight(0xD6B8F6, 1.4);
    fillLight.position.set(-5, 3.5, -2);
    scene.add(fillLight);

    // Back / Rim Light for Satin Highlights
    const rimLight = new THREE.DirectionalLight(0xFFE2F0, 1.3);
    rimLight.position.set(0, 4, -5.5);
    scene.add(rimLight);

    // Warm Interior Point Light (revealed when opened)
    const interiorLight = new THREE.PointLight(0xFFDF88, 0, 7);
    interiorLight.position.set(0, 0.6, 0);
    scene.add(interiorLight);
    sceneRefs.current.interiorLight = interiorLight;

    // Soft Multi-Layered Floor Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(4.2, 4.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createStudioFloorShadow(),
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.88;
    scene.add(shadowMesh);

    // 5. Materials (Physical PBR)
    const paperTexture = createPaperTexture();
    const satinTexture = createSatinTexture();

    // Deep Luxury Lavender Wrapping Paper
    const boxMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x6E4C8E,
      roughness: 0.52,
      metalness: 0.08,
      clearcoat: 0.28,
      clearcoatRoughness: 0.42,
      sheen: 0.85,
      sheenColor: 0x9D7EC4,
      map: paperTexture
    });

    // Royal Deep Purple Velvet Interior Lining
    const velvetMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2A173E,
      roughness: 0.88,
      metalness: 0.04,
      sheen: 0.95,
      sheenColor: 0x5C387A
    });

    // Champagne-Gold Satin Ribbon
    const satinGoldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xF3CF6E,
      emissive: 0x362706,
      roughness: 0.22,
      metalness: 0.76,
      clearcoat: 0.7,
      clearcoatRoughness: 0.16,
      sheen: 1.0,
      sheenColor: 0xFFF2C2,
      map: satinTexture
    });

    // 6. Box Base Group
    const boxGroup = new THREE.Group();
    boxGroup.position.set(0, -0.15, 0);
    scene.add(boxGroup);
    sceneRefs.current.boxGroup = boxGroup;

    const boxW = 2.3;
    const boxH = 1.35;
    const boxD = 2.3;
    const wallT = 0.075;

    // Seamless Beveled Outer Box Shell
    const outerBoxGeo = new THREE.BoxGeometry(boxW, boxH, boxD);
    // Outer shell mesh
    const outerBoxMesh = new THREE.Mesh(outerBoxGeo, boxMaterial);
    outerBoxMesh.castShadow = true;
    outerBoxMesh.receiveShadow = true;
    boxGroup.add(outerBoxMesh);

    // Velvet Inner Cavity Bedding (recessed inside top of the box)
    const innerCavity = new THREE.Mesh(
      new THREE.BoxGeometry(boxW - wallT * 2, 0.45, boxD - wallT * 2),
      velvetMaterial
    );
    innerCavity.position.set(0, boxH / 2 - 0.22, 0);
    boxGroup.add(innerCavity);

    // Base Ribbons (Wide Satin Bands wrapping both axes)
    const ribbonW = 0.36;
    const ribbonT = 0.016;
    const baseRibbons = new THREE.Group();
    boxGroup.add(baseRibbons);
    sceneRefs.current.baseRibbons = baseRibbons;

    // Vertical Ribbon (Front, Bottom, Back)
    const baseRibbonZ = new THREE.Mesh(
      new THREE.BoxGeometry(ribbonW, boxH + 0.02, boxD + ribbonT * 2),
      satinGoldMaterial
    );
    baseRibbons.add(baseRibbonZ);

    // Horizontal Ribbon (Left, Bottom, Right)
    const baseRibbonX = new THREE.Mesh(
      new THREE.BoxGeometry(boxW + ribbonT * 2, boxH + 0.02, ribbonW),
      satinGoldMaterial
    );
    baseRibbons.add(baseRibbonX);

    // 7. Hinged Luxury Lid Assembly
    // Pivot is located at rear top edge of box: (0, boxH/2, -boxD/2)
    const lidHingeGroup = new THREE.Group();
    lidHingeGroup.position.set(0, boxH / 2, -boxD / 2);
    boxGroup.add(lidHingeGroup);
    sceneRefs.current.lidHingeGroup = lidHingeGroup;

    const lidW = boxW + 0.09;
    const lidD = boxD + 0.09;
    const lidThickness = 0.08;
    const lidLipH = 0.28;

    // Solid Beveled Lid Top Cover
    const lidMesh = new THREE.Mesh(
      new THREE.BoxGeometry(lidW, lidThickness, lidD),
      boxMaterial
    );
    lidMesh.position.set(0, lidThickness / 2, boxD / 2);
    lidMesh.castShadow = true;
    lidHingeGroup.add(lidMesh);
    sceneRefs.current.lidMesh = lidMesh;

    // 4-Sided Fitted Rim Lip extending downward
    const rimFront = new THREE.Mesh(new THREE.BoxGeometry(lidW, lidLipH, wallT), boxMaterial);
    rimFront.position.set(0, -lidLipH / 2 + lidThickness, boxD);
    rimFront.castShadow = true;
    lidHingeGroup.add(rimFront);

    const rimLeft = new THREE.Mesh(new THREE.BoxGeometry(wallT, lidLipH, lidD), boxMaterial);
    rimLeft.position.set(-lidW / 2 + wallT / 2, -lidLipH / 2 + lidThickness, boxD / 2);
    rimLeft.castShadow = true;
    lidHingeGroup.add(rimLeft);

    const rimRight = new THREE.Mesh(new THREE.BoxGeometry(wallT, lidLipH, lidD), boxMaterial);
    rimRight.position.set(lidW / 2 - wallT / 2, -lidLipH / 2 + lidThickness, boxD / 2);
    rimRight.castShadow = true;
    lidHingeGroup.add(rimRight);

    // Lid Satin Crossing Ribbons
    const lidRibbonX = new THREE.Mesh(
      new THREE.BoxGeometry(lidW + 0.02, ribbonT, ribbonW),
      satinGoldMaterial
    );
    lidRibbonX.position.set(0, lidThickness + ribbonT / 2, boxD / 2);
    lidHingeGroup.add(lidRibbonX);
    sceneRefs.current.lidRibbonX = lidRibbonX;

    const lidRibbonZ = new THREE.Mesh(
      new THREE.BoxGeometry(ribbonW, ribbonT, lidD + 0.02),
      satinGoldMaterial
    );
    lidRibbonZ.position.set(0, lidThickness + ribbonT / 2, boxD / 2);
    lidHingeGroup.add(lidRibbonZ);
    sceneRefs.current.lidRibbonZ = lidRibbonZ;

    // 8. Physically Convincing 3D Satin Bow
    const bowGroup = new THREE.Group();
    bowGroup.position.set(0, lidThickness + 0.09, boxD / 2);
    lidHingeGroup.add(bowGroup);
    sceneRefs.current.bowGroup = bowGroup;

    // Central Knot: Rounded folded satin band
    const knotMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.18, 20), satinGoldMaterial);
    knotMesh.rotation.z = Math.PI / 2;
    knotMesh.scale.set(1.1, 1.0, 0.85);
    knotMesh.castShadow = true;
    bowGroup.add(knotMesh);

    // 4 Puffy Satin Loops
    // Primary Left Loop
    const loopGeo = new THREE.TorusGeometry(0.32, 0.075, 16, 30, Math.PI * 1.8);
    const loopLeft = new THREE.Mesh(loopGeo, satinGoldMaterial);
    loopLeft.rotation.set(Math.PI / 2, 0, -Math.PI / 4.2);
    loopLeft.position.set(-0.28, 0.09, 0);
    loopLeft.scale.set(1.25, 0.45, 1.1);
    loopLeft.castShadow = true;
    bowGroup.add(loopLeft);

    // Primary Right Loop
    const loopRight = new THREE.Mesh(loopGeo, satinGoldMaterial);
    loopRight.rotation.set(Math.PI / 2, 0, Math.PI / 4.2 + Math.PI);
    loopRight.position.set(0.28, 0.09, 0);
    loopRight.scale.set(1.25, 0.45, 1.1);
    loopRight.castShadow = true;
    bowGroup.add(loopRight);

    // Accent Upper Loop (Left-Angled)
    const loopAccentLeft = new THREE.Mesh(loopGeo, satinGoldMaterial);
    loopAccentLeft.rotation.set(Math.PI / 2.3, 0.25, -Math.PI / 6);
    loopAccentLeft.position.set(-0.18, 0.16, -0.1);
    loopAccentLeft.scale.set(1.0, 0.4, 0.95);
    loopAccentLeft.castShadow = true;
    bowGroup.add(loopAccentLeft);

    // Accent Upper Loop (Right-Angled)
    const loopAccentRight = new THREE.Mesh(loopGeo, satinGoldMaterial);
    loopAccentRight.rotation.set(Math.PI / 2.3, -0.25, Math.PI / 6 + Math.PI);
    loopAccentRight.position.set(0.18, 0.16, -0.1);
    loopAccentRight.scale.set(1.0, 0.4, 0.95);
    loopAccentRight.castShadow = true;
    bowGroup.add(loopAccentRight);

    // 2 Flowing Draped Satin Tails (Curved Splines with Swallowtail ends)
    const tailPointsLeft = [
      new THREE.Vector3(-0.08, 0.02, 0.08),
      new THREE.Vector3(-0.35, -0.04, 0.35),
      new THREE.Vector3(-0.62, -0.07, 0.68),
      new THREE.Vector3(-0.85, -0.15, 0.95)
    ];
    const tailCurveLeft = new THREE.CatmullRomCurve3(tailPointsLeft);
    const tailGeoLeft = new THREE.TubeGeometry(tailCurveLeft, 18, 0.065, 8, false);
    const tailLeft = new THREE.Mesh(tailGeoLeft, satinGoldMaterial);
    tailLeft.scale.set(1.8, 0.28, 1.0);
    tailLeft.castShadow = true;
    bowGroup.add(tailLeft);

    const tailPointsRight = [
      new THREE.Vector3(0.08, 0.02, 0.08),
      new THREE.Vector3(0.32, -0.04, 0.38),
      new THREE.Vector3(0.58, -0.07, 0.72),
      new THREE.Vector3(0.82, -0.15, 1.02)
    ];
    const tailCurveRight = new THREE.CatmullRomCurve3(tailPointsRight);
    const tailGeoRight = new THREE.TubeGeometry(tailCurveRight, 18, 0.065, 8, false);
    const tailRight = new THREE.Mesh(tailGeoRight, satinGoldMaterial);
    tailRight.scale.set(1.8, 0.28, 1.0);
    tailRight.castShadow = true;
    bowGroup.add(tailRight);

    // 9. Actual Physical 3D Contents Nested Inside the Cavity
    const interiorGroup = new THREE.Group();
    interiorGroup.position.set(0, boxH / 2 - 0.15, 0);
    boxGroup.add(interiorGroup);
    sceneRefs.current.interiorGroup = interiorGroup;

    const clickableList = [];

    // --- ITEM 1: Beautiful Folded Letter with Gold Foil Heading & Wax Seal ---
    const letterGroup = new THREE.Group();
    letterGroup.position.set(-0.52, 0.08, 0.18);
    letterGroup.rotation.set(-0.08, 0.18, 0.04);
    letterGroup.userData = {
      type: 'letter',
      title: 'The Special Note',
      desc: '“Just for you” • Private reflection'
    };
    interiorGroup.add(letterGroup);
    clickableList.push(letterGroup);

    const letterPaperMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.78, 0.045, 0.58),
      new THREE.MeshStandardMaterial({
        map: createLetterCoverTexture(),
        roughness: 0.8
      })
    );
    letterPaperMesh.castShadow = true;
    letterGroup.add(letterPaperMesh);

    // Golden Wax Seal with "E" Monogram
    const waxSeal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.04, 18),
      satinGoldMaterial
    );
    waxSeal.position.set(0.18, 0.03, 0.12);
    waxSeal.castShadow = true;
    letterGroup.add(waxSeal);

    // --- ITEM 2: Stack of 3 Polaroid Photo Prints ---
    const polaroidGroup = new THREE.Group();
    polaroidGroup.position.set(0.18, 0.12, -0.28);
    polaroidGroup.rotation.set(-0.12, -0.15, 0.06);
    polaroidGroup.userData = {
      type: 'photo',
      title: 'Memory Scrapbook',
      desc: '5 Keepsake Moments • Photo Upload & Stories'
    };
    interiorGroup.add(polaroidGroup);
    clickableList.push(polaroidGroup);

    // 3 Fanned-out Photo Prints
    const photoConfigs = [
      { x: -0.16, z: -0.06, rot: 0.14, color: '#6E4F8E', caption: 'First Hello' },
      { x: 0.05, z: 0.02, rot: -0.08, color: '#C97A8F', caption: 'Laughter' },
      { x: 0.22, z: 0.08, rot: 0.18, color: '#D4AF37', caption: 'Day 100' }
    ];
    photoConfigs.forEach((cfg) => {
      const polMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.56, 0.025, 0.68),
        new THREE.MeshStandardMaterial({
          map: createPolaroidTexture(cfg.caption, cfg.color),
          roughness: 0.4
        })
      );
      polMesh.position.set(cfg.x, 0, cfg.z);
      polMesh.rotation.y = cfg.rot;
      polMesh.castShadow = true;
      polaroidGroup.add(polMesh);
    });

    // --- ITEM 3: Miniature Surprise Envelopes ---
    const envelopeGroup = new THREE.Group();
    envelopeGroup.position.set(0.42, 0.06, 0.32);
    envelopeGroup.rotation.set(-0.06, -0.22, -0.02);
    envelopeGroup.userData = {
      type: 'card',
      title: '5 Surprise Cards',
      desc: 'Short reflections & little secrets'
    };
    interiorGroup.add(envelopeGroup);
    clickableList.push(envelopeGroup);

    const envMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.04, 0.48),
      new THREE.MeshStandardMaterial({
        map: createEnvelopeTexture(),
        roughness: 0.65
      })
    );
    envMesh.castShadow = true;
    envelopeGroup.add(envMesh);

    const envSeal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16),
      satinGoldMaterial
    );
    envSeal.position.set(0, 0.025, 0);
    envelopeGroup.add(envSeal);

    // --- ITEM 4: Miniature Luxury Mystery Gift Box (The 100-Day Time Capsule) ---
    const mysteryBoxGroup = new THREE.Group();
    mysteryBoxGroup.position.set(-0.54, 0.14, -0.42);
    mysteryBoxGroup.rotation.set(0, 0.32, 0);
    mysteryBoxGroup.userData = {
      type: 'mystery',
      title: 'The 100-Day Time Capsule',
      desc: 'Antique Pocket Watch • Tap to inspect'
    };
    interiorGroup.add(mysteryBoxGroup);
    clickableList.push(mysteryBoxGroup);

    // Elegant miniature rigid mystery box (zero pocket watch geometry here)
    const miniBoxMat = new THREE.MeshStandardMaterial({
      color: 0x48296a,
      roughness: 0.55,
      metalness: 0.15
    });
    const miniBoxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.22, 0.42),
      miniBoxMat
    );
    miniBoxMesh.position.y = 0.11;
    miniBoxMesh.castShadow = true;
    mysteryBoxGroup.add(miniBoxMesh);

    // Cross satin gold ribbons
    const miniRibbonX = new THREE.Mesh(
      new THREE.BoxGeometry(0.43, 0.225, 0.08),
      satinGoldMaterial
    );
    miniRibbonX.position.y = 0.11;
    mysteryBoxGroup.add(miniRibbonX);

    const miniRibbonZ = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.225, 0.43),
      satinGoldMaterial
    );
    miniRibbonZ.position.y = 0.11;
    mysteryBoxGroup.add(miniRibbonZ);

    const miniSeal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16),
      satinGoldMaterial
    );
    miniSeal.position.set(0, 0.225, 0);
    mysteryBoxGroup.add(miniSeal);

    sceneRefs.current.clickableObjects = clickableList;

    // 10. Interactive Raycasting & Mouse Drag Handling
    const raycaster = sceneRefs.current.raycaster;
    const mouse = sceneRefs.current.mouse;

    const handlePointerDown = (e) => {
      sceneRefs.current.isDragging = true;
      sceneRefs.current.dragStart.x = e.clientX;
      sceneRefs.current.dragStart.y = e.clientY;
    };

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Handle drag rotation
      if (sceneRefs.current.isDragging) {
        const deltaX = (e.clientX - sceneRefs.current.dragStart.x) * 0.006;
        const deltaY = (e.clientY - sceneRefs.current.dragStart.y) * 0.006;
        sceneRefs.current.rotationTarget.y += deltaX;
        sceneRefs.current.rotationTarget.x = Math.max(
          -0.35,
          Math.min(0.55, sceneRefs.current.rotationTarget.x + deltaY)
        );
        sceneRefs.current.dragStart.x = e.clientX;
        sceneRefs.current.dragStart.y = e.clientY;
      }

      // Check 3D item hover when opened
      if (sceneRefs.current.isOpenedRef) {
        raycaster.setFromCamera(mouse, camera);
        let foundHover = null;

        for (const grp of sceneRefs.current.clickableObjects) {
          const intersects = raycaster.intersectObjects(grp.children, true);
          if (intersects.length > 0) {
            foundHover = grp.userData;
            break;
          }
        }

        if (foundHover) {
          setHovered3DItem(foundHover);
          container.style.cursor = 'pointer';
        } else {
          setHovered3DItem(null);
          container.style.cursor = sceneRefs.current.isDragging ? 'grabbing' : 'grab';
        }
      }
    };

    const handlePointerUp = (e) => {
      const wasDraggingFar =
        Math.abs(e.clientX - sceneRefs.current.dragStart.x) > 5 ||
        Math.abs(e.clientY - sceneRefs.current.dragStart.y) > 5;
      sceneRefs.current.isDragging = false;

      // If clicked without dragging
      if (!wasDraggingFar) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        if (sceneRefs.current.isOpenedRef) {
          raycaster.setFromCamera(mouse, camera);
          for (const grp of sceneRefs.current.clickableObjects) {
            const intersects = raycaster.intersectObjects(grp.children, true);
            if (intersects.length > 0) {
              soundManager.playButtonClick();
              if (grp.userData.type === 'letter') {
                setLetterLang('en');
              }
              setActiveModal(grp.userData.type);
              return;
            }
          }
        } else {
          // Click box to unwrap
          handleOpenBox();
        }
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 11. Render Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      sceneRefs.current.animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth camera orbit & rotation interpolation
      const targetRotY = sceneRefs.current.rotationTarget.y + Math.sin(time * 0.6) * 0.035;
      const targetRotX = sceneRefs.current.rotationTarget.x;
      boxGroup.rotation.y = THREE.MathUtils.damp(boxGroup.rotation.y, targetRotY, 4.5, delta);
      boxGroup.rotation.x = THREE.MathUtils.damp(boxGroup.rotation.x, targetRotX, 4.5, delta);

      camera.position.lerp(sceneRefs.current.targetCamPos, 3.2 * delta);
      camera.lookAt(sceneRefs.current.targetLookAt);

      // Box Opening Sequence
      if (sceneRefs.current.isOpenedRef) {
        sceneRefs.current.openProgress = THREE.MathUtils.damp(
          sceneRefs.current.openProgress,
          1.0,
          2.6,
          delta
        );
        const p = sceneRefs.current.openProgress;

        // Lid lifts upwards then tilts smoothly backward
        lidHingeGroup.rotation.x = -p * 1.55; // tilts back to ~89 degrees
        lidHingeGroup.position.y = (boxH / 2) + Math.sin(p * Math.PI) * 0.22;

        // Interior light blooms warmly
        if (interiorLight) {
          interiorLight.intensity = p * 4.6;
        }

        // Satin bow gently loosens and fades scale
        if (bowGroup) {
          const s = Math.max(0.65, 1 - p * 0.35);
          bowGroup.scale.set(s, s, s);
        }

        // Hovered 3D Item gentle float
        clickableList.forEach((item) => {
          if (hovered3DItem && hovered3DItem.type === item.userData.type) {
            item.position.y = THREE.MathUtils.damp(item.position.y, 0.26, 6, delta);
          } else {
            item.position.y = THREE.MathUtils.damp(item.position.y, 0.1, 4, delta);
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (sceneRefs.current.animFrameId) {
        cancelAnimationFrame(sceneRefs.current.animFrameId);
      }
      renderer.dispose();
    };
  }, []);

  const handleOpenBox = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);
    soundManager.playRibbonUntie();

    // Camera smoothly glides closer into a high-angle studio view
    sceneRefs.current.targetCamPos.set(0, 2.3, 4.7);
    sceneRefs.current.targetLookAt.set(0, 0.05, 0);

    setTimeout(() => {
      soundManager.playGiftOpen();
      setIsOpened(true);
      sceneRefs.current.isOpenedRef = true;

      confetti({
        particleCount: 95,
        spread: 85,
        origin: { y: 0.52 },
        colors: ['#D4AF37', '#8B6FA9', '#F8D7E3', '#FFFDF9', '#E6DCF5']
      });
    }, 550);
  };

  const closeModal = () => {
    soundManager.playButtonClick();
    setActiveModal(null);
    setLetterLang('en');
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '840px', margin: '0 auto' }}>
      {/* 3D WebGL Canvas Viewport in Cinematic Studio Setting */}
      <div
        style={{
          position: 'relative',
          borderRadius: '26px',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 42%, rgba(65, 42, 88, 0.95) 0%, rgba(35, 20, 50, 0.98) 60%, rgba(20, 10, 30, 1) 100%)',
          boxShadow: '0 25px 65px rgba(25, 12, 38, 0.45)',
          border: '1px solid rgba(212, 175, 55, 0.4)'
        }}
      >
        <div
          ref={mountRef}
          style={{
            width: '100%',
            height: 'clamp(320px, 48vh, 420px)',
            position: 'relative',
            cursor: isOpened ? 'grab' : 'pointer',
            touchAction: 'none'
          }}
        />

        {/* 3D Item Hover Tooltip HUD */}
        <AnimatePresence>
          {isOpened && hovered3DItem && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5 }}
              style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255, 253, 249, 0.96)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(212, 175, 55, 0.6)',
                borderRadius: '30px',
                padding: '7px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                pointerEvents: 'none',
                zIndex: 40
              }}
            >
              <Sparkles size={15} color="#D4AF37" />
              <div>
                <span className="font-cinzel" style={{ fontSize: '11px', fontWeight: 800, color: '#38254E', display: 'block' }}>
                  {hovered3DItem.title}
                </span>
                <span style={{ fontSize: '11px', color: '#7E6E92' }}>
                  {hovered3DItem.desc}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Studio Lighting & Controls Overlay Hints */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            fontSize: '11px',
            color: 'rgba(230, 215, 250, 0.7)',
            pointerEvents: 'none',
            fontStyle: 'italic',
            letterSpacing: '0.04em'
          }}
        >
          {isOpened ? '✦ Tap any 3D item inside to open • Drag to orbit' : '✦ Tap gift box to unwrap • Drag to inspect'}
        </div>
      </div>

      {/* Primary Interaction CTA before open */}
      {!isOpened && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginTop: '14px', position: 'relative', zIndex: 20 }}
        >
          <motion.button
            onClick={handleOpenBox}
            disabled={isOpening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="btn-gold-luxury"
            style={{ fontSize: '15px', padding: '16px 44px' }}
          >
            <Sparkles size={18} color="#7A5600" />
            <span>{isOpening ? 'OPENING THE PACKAGE...' : 'OPEN YOUR PACKAGE'}</span>
          </motion.button>
          <p style={{ fontSize: '12.5px', color: '#7E6E92', marginTop: '10px', fontStyle: 'italic' }}>
            Click button or tap the 3D gift box to unwrap
          </p>
        </motion.div>
      )}

      {/* Interactive Controls Revealed INSIDE the Opened Box */}
      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              position: 'relative',
              zIndex: 30,
              background: 'rgba(255, 253, 249, 0.96)',
              backdropFilter: 'blur(12px)',
              borderRadius: '24px',
              padding: '24px 26px',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              boxShadow: '0 16px 45px rgba(67, 46, 93, 0.14)',
              marginTop: '16px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <span
                className="font-cinzel"
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  color: '#D4AF37',
                  display: 'block',
                  marginBottom: '4px'
                }}
              >
                INSIDE THE PACKAGE • 4 PHYSICAL SURPRISES
              </span>
              <h3 className="font-serif-luxury" style={{ fontSize: '20px', color: '#34224C', margin: 0 }}>
                Explore the Little World Inside
              </h3>
              <p style={{ fontSize: '12px', color: '#8A7A9E', margin: '4px 0 0', fontStyle: 'italic' }}>
                Tap items directly inside the 3D box above, or choose below:
              </p>
            </div>

            {/* 4 Interactive Category Buttons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '12px'
              }}
            >
              {/* Item A: The Special Note, Just for You */}
              <button
                onClick={() => {
                  soundManager.playSealBreak();
                  setLetterLang('en');
                  setActiveModal('letter');
                }}
                className="parchment-card"
                style={{
                  padding: '14px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #FFF1B0 0%, #D4AF37 60%, #99741B 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFDF9',
                    flexShrink: 0
                  }}
                >
                  <Mail size={17} />
                </div>
                <div>
                  <strong style={{ fontSize: '13px', color: '#38254E', display: 'block' }}>The Special Note, Just for You</strong>
                  <span style={{ fontSize: '11px', color: '#8A7A9E' }}>“Just for you” • Emotional letter</span>
                </div>
              </button>

              {/* Item B: Memory Photographs */}
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setActiveModal('photo');
                }}
                className="parchment-card"
                style={{
                  padding: '14px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid rgba(139, 111, 169, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #967BB6 0%, #6E4F8E 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFDF9',
                    flexShrink: 0
                  }}
                >
                  <Camera size={17} />
                </div>
                <div>
                  <strong style={{ fontSize: '13px', color: '#38254E', display: 'block' }}>Memory Scrapbook</strong>
                  <span style={{ fontSize: '11px', color: '#8A7A9E' }}>5 Keepsake Moments & Photos</span>
                </div>
              </button>

              {/* Item C: The Little Surprise Cards */}
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setActiveModal('card');
                }}
                className="parchment-card"
                style={{
                  padding: '14px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid rgba(217, 125, 149, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F8D7E3 0%, #D97D95 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFDF9',
                    flexShrink: 0
                  }}
                >
                  <Sparkles size={17} />
                </div>
                <div>
                  <strong style={{ fontSize: '13px', color: '#38254E', display: 'block' }}>5 Surprise Cards</strong>
                  <span style={{ fontSize: '11px', color: '#8A7A9E' }}>Short reflections</span>
                </div>
              </button>

              {/* Item D: Mystery Gift */}
              <button
                onClick={() => {
                  soundManager.playFanfare();
                  confetti({ particleCount: 65, spread: 65, origin: { y: 0.6 } });
                  setActiveModal('mystery');
                }}
                className="parchment-card"
                style={{
                  padding: '14px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid rgba(212, 175, 55, 0.55)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #FFF1B0 0%, #D4AF37 60%, #99741B 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFDF9',
                    flexShrink: 0
                  }}
                >
                  <Gift size={17} />
                </div>
                <div>
                  <strong style={{ fontSize: '13px', color: '#38254E', display: 'block' }}>The 100-Day Time Capsule</strong>
                  <span style={{ fontSize: '11px', color: '#B38B29', fontWeight: 600 }}>Antique Pocket Watch Keepsake</span>
                </div>
              </button>
            </div>

            {/* Transition CTA to explore full site */}
            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px dashed rgba(212, 175, 55, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <span style={{ fontSize: '13px', color: '#68587C', fontStyle: 'italic' }}>
                “There is still more waiting in the journey below...”
              </span>
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  try { soundManager.playStarChime(); } catch {}
                  setShowStarUniverse(true);
                }}
                className="btn-gold-luxury"
                style={{ padding: '10px 24px', fontSize: '13px' }}
              >
                <span>EXPLORE YOUR SURPRISE</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MODALS WITH UNIVERSAL CLOSE BUTTON ================= */}

      {/* MODAL A: The Special Note, Just for You (Premium Handwritten Bilingual Experience) */}
      <AnimatePresence>
        {activeModal === 'letter' && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(16, 8, 28, 0.82)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              zIndex: 1400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(12px, 3vw, 24px)',
              overflowY: 'auto'
            }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 16 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '680px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'linear-gradient(175deg, #FFFDF8 0%, #FAF5EA 50%, #FFFDF9 100%)',
                borderRadius: '22px',
                padding: 'clamp(28px, 5vw, 44px) clamp(22px, 5vw, 40px)',
                border: '1.5px solid rgba(212, 175, 55, 0.55)',
                boxShadow: `
                  0 30px 80px rgba(0, 0, 0, 0.65),
                  0 0 0 6px rgba(212, 175, 55, 0.12),
                  inset 0 0 60px rgba(212, 175, 55, 0.08)
                `,
                color: '#2E1E3D',
                textAlign: 'left'
              }}
            >
              {/* Universal Gold Close Button (sticky so it stays visible on mobile scroll) */}
              <CloseButton
                onClose={closeModal}
                variant="gold"
                isSticky={true}
                top="14px"
                right="14px"
                ariaLabel="Close Special Note"
              />

              {/* Letter Header Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(212, 175, 55, 0.4)',
                  paddingBottom: '14px',
                  marginBottom: '20px',
                  paddingRight: '56px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <span
                    className="font-cinzel"
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.18em',
                      color: '#9C782F',
                      display: 'block',
                      marginBottom: '2px'
                    }}
                  >
                    {specialNoteLetterContent[letterLang].headerBadge}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#7A6291',
                      fontStyle: 'italic',
                      fontFamily: "'Playfair Display', Georgia, serif"
                    }}
                  >
                    Day 100 • For Commander Estelle
                  </span>
                </div>

                {/* Elegant Language Toggle Button */}
                <button
                  onClick={() => {
                    soundManager.playButtonClick();
                    setLetterLang((prev) => (prev === 'en' ? 'vi' : 'en'));
                  }}
                  className="btn-glass"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 16px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#382052',
                    background: 'rgba(212, 175, 55, 0.18)',
                    border: '1px solid rgba(212, 175, 55, 0.55)',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title="Switch between English and Vietnamese"
                >
                  <Languages size={14} color="#9C782F" />
                  <span>{specialNoteLetterContent[letterLang].toggleButtonText}</span>
                </button>
              </div>

              {/* Letter Title */}
              <h2
                style={{
                  fontFamily: '"Cinzel", "Playfair Display", Georgia, serif',
                  fontSize: 'clamp(18px, 2.6vw, 24px)',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  color: '#34224C',
                  margin: '0 0 16px',
                  lineHeight: 1.3
                }}
              >
                {specialNoteLetterContent[letterLang].title}
              </h2>

              {/* Salutation */}
              <h3
                style={{
                  fontFamily: '"Caveat", cursive, "Playfair Display", serif',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#281738',
                  marginBottom: '16px',
                  letterSpacing: '0.02em'
                }}
              >
                {specialNoteLetterContent[letterLang].salutation}
              </h3>

              {/* Letter Paragraphs in Original Handwritten / Italic Cursive Style */}
              <div
                style={{
                  fontFamily: '"Caveat", cursive, "Playfair Display", serif',
                  fontSize: 'clamp(20px, 2.3vw, 23px)',
                  lineHeight: '1.8',
                  color: '#341F48',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {specialNoteLetterContent[letterLang].paragraphs.map((p, idx) => (
                  <p key={idx} style={{ margin: 0 }}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Sign-off & Signature Block */}
              <div
                style={{
                  marginTop: '28px',
                  paddingTop: '18px',
                  borderTop: '1px dashed rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: '"Caveat", cursive',
                      fontSize: '24px',
                      color: '#4B3460',
                      display: 'block',
                      lineHeight: 1.3
                    }}
                  >
                    {specialNoteLetterContent[letterLang].signaturePrefix}
                  </span>
                  <span
                    style={{
                      fontFamily: '"Caveat", cursive',
                      fontSize: '34px',
                      fontWeight: 700,
                      color: '#281738',
                      display: 'block',
                      letterSpacing: '0.02em',
                      lineHeight: 1.2
                    }}
                  >
                    {specialNoteLetterContent[letterLang].signatureName}
                  </span>
                </div>

                <button
                  onClick={closeModal}
                  className="btn-gold-luxury"
                  style={{
                    padding: '8px 22px',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{specialNoteLetterContent[letterLang].foldButtonText}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL B: Floating Photographs (Synchronized with Scrapbook Memories) */}
      <AnimatePresence>
        {activeModal === 'photo' && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(38, 25, 52, 0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 1400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFDF9',
                borderRadius: '24px',
                maxWidth: '740px',
                width: '95%',
                maxHeight: '92vh',
                overflowY: 'auto',
                padding: '32px 28px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                border: '1.5px solid rgba(212, 175, 55, 0.55)',
                position: 'relative'
              }}
            >
              <CloseButton onClose={closeModal} variant="gold" isSticky={true} top="14px" right="14px" ariaLabel="Close Photographs Window" />

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', paddingRight: '56px' }}>
                <span className="font-cinzel" style={{ fontSize: '11px', color: '#D4AF37', fontWeight: 800, letterSpacing: '0.12em' }}>
                  COMMANDER ESTELLE • MEMORY SCRAPBOOK
                </span>
                <span style={{ fontSize: '11px', color: '#8A7A9E' }}>
                  • {selectedMemory.badge}
                </span>
              </div>

              <h3 className="font-serif-luxury" style={{ fontSize: '23px', color: '#34224C', marginBottom: '14px', paddingRight: '56px' }}>
                {selectedMemory.title}
              </h3>

              {/* 5 Memory Navigation Tabs */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {memoriesData.map((mem) => {
                  const isSelected = selectedMemory.id === mem.id;
                  return (
                    <button
                      key={mem.id}
                      onClick={() => setSelectedMemory(mem)}
                      style={{
                        flex: '1 1 95px',
                        padding: '8px 6px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #7B5E99' : '1px solid rgba(123, 94, 153, 0.2)',
                        background: isSelected ? '#F2EAF9' : '#FFFDF9',
                        fontWeight: 700,
                        fontSize: '11.5px',
                        cursor: 'pointer',
                        color: isSelected ? '#543670' : '#706085',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>0{mem.id}</span>
                      <span style={{ fontSize: '10px', opacity: 0.85 }}>{mem.badge}</span>
                    </button>
                  );
                })}
              </div>

              {/* Polaroid Frame with Memory Illustration or Custom Photo */}
              <div
                style={{
                  background: '#FFF',
                  padding: '16px 16px 20px',
                  borderRadius: '14px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    height: '260px',
                    borderRadius: '10px',
                    background: '#F5EFFB',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '14px',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)'
                  }}
                >
                  {customPhotos[selectedMemory.id] ? (
                    <img
                      src={customPhotos[selectedMemory.id]}
                      alt={selectedMemory.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <MemoryIllustration type={selectedMemory.svgIllustration} color={selectedMemory.themeColor} />
                  )}

                  {/* Photo Controls: Delete + Change / Upload */}
                  <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 10 }}>
                    {customPhotos[selectedMemory.id] && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (window.confirm('Delete this photo and restore original memory illustration?')) {
                            soundManager.playButtonClick();
                            await deleteScrapbookPhoto(selectedMemory.id);
                            setCustomPhotos((prev) => {
                              const updated = { ...prev };
                              delete updated[selectedMemory.id];
                              return updated;
                            });
                          }
                        }}
                        style={{
                          background: 'rgba(168, 50, 78, 0.92)',
                          backdropFilter: 'blur(8px)',
                          color: '#FFF',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          border: '1px solid rgba(255, 180, 200, 0.55)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                        title="Delete photo and restore memory artwork"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    )}

                    <label
                      style={{
                        background: 'rgba(43, 31, 58, 0.88)',
                        backdropFilter: 'blur(8px)',
                        color: '#FFF',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: '1px solid rgba(212, 175, 55, 0.5)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                    >
                      <Camera size={12} color="#D4AF37" />
                      <span>{customPhotos[selectedMemory.id] ? 'Change Photo' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            soundManager.playButtonClick();
                            try {
                              const compressed = await saveScrapbookPhoto(selectedMemory.id, file);
                              setCustomPhotos((prev) => ({ ...prev, [selectedMemory.id]: compressed }));
                            } catch (err) {
                              console.warn(err);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <p className="font-handwriting" style={{ fontSize: '20px', color: '#543670', margin: '4px 0 6px' }}>
                  “{selectedMemory.tagline}”
                </p>
                <p style={{ fontSize: '13px', color: '#7E6E92', margin: 0, lineHeight: 1.5 }}>
                  {selectedMemory.reflection}
                </p>
              </div>

              <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={closeModal} className="btn-lavender-luxury" style={{ fontSize: '12px', padding: '8px 22px' }}>
                  Back to Box
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL C: 5 Surprise Cards */}
      <AnimatePresence>
        {activeModal === 'card' && (
          <SurpriseCardsModal onClose={closeModal} />
        )}
      </AnimatePresence>

      {/* MODAL D: The 100-Day Time Capsule (Interactive 3D Antique Pocket Watch Reveal) */}
      <AnimatePresence>
        {activeModal === 'mystery' && (
          <PocketWatchKeepsake onClose={closeModal} />
        )}
      </AnimatePresence>

      {/* 100 Little Stars Universe - accessible ONLY through EXPLORE YOUR SURPRISE */}
      <AnimatePresence>
        {showStarUniverse && (
          <StarsUniverse
            onBackToGift={() => setShowStarUniverse(false)}
            onContinueToScrapbook={onExploreMore}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
