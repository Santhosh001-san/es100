import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Mail, Languages, X, RotateCcw } from 'lucide-react';
import { CloseButton } from '../Common/CloseButton';
import { useEscapeKey } from '../../utils/useEscapeKey';
import { soundManager } from '../../utils/audioSynth';
import { keepsakeLetterContent } from '../../data/keepsakeLetter';
import confetti from 'canvas-confetti';

// ============================================================================
// Procedural Canvas Textures for The 100-Day Time Capsule Pocket Watch
// ============================================================================

/**
 * 1. Soft Lavender Velvet Presentation Surface Texture
 */
function createPedestalVelvetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep royal lavender velvet gradient
  const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
  grad.addColorStop(0, '#8664A6');
  grad.addColorStop(0.5, '#6C488C');
  grad.addColorStop(0.85, '#543472');
  grad.addColorStop(1.0, '#3A1E54');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Soft stippled velvet fiber texture
  ctx.fillStyle = 'rgba(235, 210, 255, 0.05)';
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Subtle concentric velvet sheen rings
  for (let r = 240; r > 40; r -= 24) {
    ctx.strokeStyle = 'rgba(215, 185, 245, 0.06)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(256, 256, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

/**
 * 2. Antique Champagne-Gold Outer Watch Cover Texture with Engraved "100"
 */
function createWatchCoverTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Champagne-Gold radial satin base
  const grad = ctx.createRadialGradient(512, 512, 60, 512, 512, 512);
  grad.addColorStop(0, '#FFF6D6');
  grad.addColorStop(0.3, '#F2D379');
  grad.addColorStop(0.65, '#D5AA42');
  grad.addColorStop(1.0, '#946E1E');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Guilloche Sunray rays
  ctx.lineWidth = 2;
  for (let a = 0; a < 72; a++) {
    const angle = (a * Math.PI * 2) / 72;
    ctx.strokeStyle = a % 2 === 0 ? 'rgba(255, 248, 220, 0.35)' : 'rgba(105, 75, 16, 0.18)';
    ctx.beginPath();
    ctx.moveTo(512 + Math.cos(angle) * 220, 512 + Math.sin(angle) * 220);
    ctx.lineTo(512 + Math.cos(angle) * 480, 512 + Math.sin(angle) * 480);
    ctx.stroke();
  }

  // Concentric Relief Ribs
  for (let r = 480; r > 200; r -= 24) {
    ctx.strokeStyle = 'rgba(255, 248, 220, 0.28)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(512, 512, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Outer Beaded Ring
  for (let b = 0; b < 48; b++) {
    const angle = (b * Math.PI * 2) / 48;
    const bx = 512 + Math.cos(angle) * 465;
    const by = 512 + Math.sin(angle) * 465;
    ctx.fillStyle = '#FFEAA8';
    ctx.beginPath();
    ctx.arc(bx, by, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Central Pure Champagne Gold Engraved Medallion
  const medGrad = ctx.createRadialGradient(512, 512, 20, 512, 512, 220);
  medGrad.addColorStop(0, '#FFF9E2');
  medGrad.addColorStop(0.5, '#F6DC8A');
  medGrad.addColorStop(1.0, '#CE9F34');
  ctx.fillStyle = medGrad;
  ctx.beginPath();
  ctx.arc(512, 512, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#946E1E';
  ctx.lineWidth = 7;
  ctx.stroke();

  // Intricate Inner Gold Beaded Ring
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(512, 512, 195, 0, Math.PI * 2);
  ctx.stroke();

  // Grand Engraved "100" in Deep Antique Gold Relief
  ctx.fillStyle = '#6E4E0D';
  ctx.font = 'bold 118px "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
  ctx.shadowOffsetY = 2;
  ctx.fillText('100', 512, 465);
  ctx.shadowColor = 'transparent';

  // TIME CAPSULE ribbon
  ctx.font = 'bold 22px "Cinzel", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = '#8C6718';
  ctx.fillText('✦ TIME CAPSULE ✦', 512, 560);

  ctx.font = 'italic 16px "Playfair Display", Georgia, serif';
  ctx.letterSpacing = '2px';
  ctx.fillStyle = '#644810';
  ctx.fillText('Commander Estelle', 512, 600);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

/**
 * 3. Enamel Watch Dial Texture with:
 * - All 12 Roman Numerals (I through XII)
 * - THE EXACT TEXT "100 DAYS WITH COMMANDER" IN THE 11-TO-1 O'CLOCK REGION
 * - Railroad tracks & minute markings
 */
function createWatchDialTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // 1. Warm Antique Ivory Enamel Dial with soft radial vignette
  const grad = ctx.createRadialGradient(512, 512, 60, 512, 512, 500);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.65, '#FFFDF8');
  grad.addColorStop(0.88, '#F6ECD8');
  grad.addColorStop(1.0, '#E6D7B6');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(512, 512, 500, 0, Math.PI * 2);
  ctx.fill();

  // 2. Outer Beveled Brass Rim inside dial
  ctx.strokeStyle = '#B88B2A';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(512, 512, 492, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Subtle Guilloche concentric engine-turned waves
  for (let r = 460; r > 100; r -= 20) {
    ctx.strokeStyle = r % 40 === 0 ? 'rgba(212, 175, 55, 0.20)' : 'rgba(120, 90, 40, 0.05)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(512, 512, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 4. Double Railroad Outer Minute Track
  ctx.strokeStyle = '#5E4214';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(512, 512, 472, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(512, 512, 446, 0, Math.PI * 2);
  ctx.stroke();

  // 5. 60 Minute Ticks with 12 Major Hour Markers
  for (let i = 0; i < 60; i++) {
    const angle = (i * Math.PI) / 30;
    const isMajor = i % 5 === 0;
    const r1 = 446;
    const r2 = isMajor ? 472 : 458;
    ctx.lineWidth = isMajor ? 5 : 2;
    ctx.strokeStyle = isMajor ? '#3D2808' : '#7C6026';
    ctx.beginPath();
    ctx.moveTo(512 + Math.cos(angle) * r1, 512 + Math.sin(angle) * r1);
    ctx.lineTo(512 + Math.cos(angle) * r2, 512 + Math.sin(angle) * r2);
    ctx.stroke();

    // Small Gold Pips outside the railroad track for each hour
    if (isMajor) {
      const pipR = 482;
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(512 + Math.cos(angle) * pipR, 512 + Math.sin(angle) * pipR, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 6. ALL 12 ROMAN NUMERALS (I through XII) - Perfectly Positioned and Fully Visible
  const numerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#1C1226';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < 12; i++) {
    const angle = ((i - 3) * Math.PI) / 6;
    const r = 368;
    const x = 512 + Math.cos(angle) * r;
    const y = 512 + Math.sin(angle) * r;

    // Subtle gold drop shadow for embossed depth
    ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.fillText(numerals[i], x + 1, y + 1);

    ctx.fillStyle = '#1C1226';
    ctx.fillText(numerals[i], x, y);
  }

  // 7. CRITICAL REQUIREMENT: "100 DAYS WITH COMMANDER" ON THE MAIN CLOCK DIAL
  // Positioned elegantly along the upper inner arc of the dial, spanning the 11-to-1 o'clock region
  ctx.save();
  const dialTitle = '100 DAYS WITH COMMANDER';
  const arcSpan = (56 * Math.PI) / 180; // 56 degree arc span across 11 to 1 o'clock
  const startAngle = -Math.PI / 2 - arcSpan / 2;
  const charStep = arcSpan / (dialTitle.length - 1);
  const textRadius = 268;

  ctx.font = 'bold 20px "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < dialTitle.length; i++) {
    const char = dialTitle[i];
    const angle = startAngle + i * charStep;
    const cx = 512 + Math.cos(angle) * textRadius;
    const cy = 512 + Math.sin(angle) * textRadius;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle + Math.PI / 2);

    // Subtle engraved depth shadow
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText(char, 0, 1);

    // Rich antique champagne-gold engraved text
    ctx.fillStyle = '#7C5716';
    ctx.fillText(char, 0, 0);

    ctx.restore();
  }
  ctx.restore();

  // Subtle engraved gold flourish bar beneath the 100 DAYS text
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(512, 512, 244, -Math.PI / 2 - 0.35, -Math.PI / 2 + 0.35);
  ctx.stroke();

  // Central diamond pip on the flourish
  ctx.fillStyle = '#B38B29';
  ctx.beginPath();
  ctx.arc(512, 512 - 244, 3, 0, Math.PI * 2);
  ctx.fill();

  // Subtitle below the flourish: CHRONOMÈTRE
  ctx.font = 'bold 11px "Cinzel", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillStyle = '#8C6718';
  ctx.fillText('CHRONOMÈTRE', 512, 290);

  // 8. Lower dial inscription above VI
  ctx.font = 'italic 16px "Playfair Display", Georgia, serif';
  ctx.letterSpacing = '1px';
  ctx.fillStyle = '#7A648C';
  ctx.fillText('Commander Estelle', 512, 712);

  ctx.font = 'bold 11px "Cinzel", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillStyle = '#9C7A28';
  ctx.fillText('✦ TIME CAPSULE ✦', 512, 736);

  // 9. Center Decorative Ring
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(512, 512, 85, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

/**
 * 4. Inner Lid Miniature Polaroid Keepsake Photograph Texture
 */
function createInnerPhotoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Outer brass bezel ring
  ctx.fillStyle = '#CFA63C';
  ctx.fillRect(0, 0, 1024, 1024);

  // Circular inner photo frame
  ctx.save();
  ctx.beginPath();
  ctx.arc(512, 512, 460, 0, Math.PI * 2);
  ctx.clip();

  // Twilight sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  skyGrad.addColorStop(0, '#15082A');
  skyGrad.addColorStop(0.35, '#351658');
  skyGrad.addColorStop(0.68, '#703B75');
  skyGrad.addColorStop(1.0, '#CF8866');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft cosmic nebula glow
  const nebGrad = ctx.createRadialGradient(512, 400, 20, 512, 400, 320);
  nebGrad.addColorStop(0, 'rgba(235, 185, 255, 0.45)');
  nebGrad.addColorStop(0.5, 'rgba(180, 120, 230, 0.2)');
  nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = nebGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Delicate twinkling stars
  ctx.fillStyle = '#FFF8E6';
  for (let i = 0; i < 65; i++) {
    const sx = Math.sin(i * 123) * 400 + 512;
    const sy = Math.cos(i * 79) * 320 + 400;
    const r = (i % 3) * 1.5 + 1.2;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Radiant Compass Star
  ctx.fillStyle = '#FFE89E';
  ctx.font = '76px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦', 512, 380);

  // Mountain horizon silhouette
  ctx.fillStyle = '#10051E';
  ctx.beginPath();
  ctx.moveTo(0, 820);
  ctx.quadraticCurveTo(280, 720, 512, 770);
  ctx.quadraticCurveTo(760, 830, 1024, 740);
  ctx.lineTo(1024, 1024);
  ctx.lineTo(0, 1024);
  ctx.closePath();
  ctx.fill();

  // Photo Inscription
  ctx.fillStyle = '#FFFDF7';
  ctx.font = 'italic 34px "Playfair Display", Georgia, serif';
  ctx.fillText('Day 100 • Commander Estelle', 512, 920);

  ctx.restore();

  // Gold Inner Rim Bevel
  ctx.strokeStyle = '#FFE89E';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(512, 512, 460, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

// ============================================================================
// MAIN COMPONENT: PocketWatchKeepsake (The 100-Day Time Capsule)
// ============================================================================

export const PocketWatchKeepsake = ({ onClose }) => {
  const mountRef = useRef(null);

  // Watch state:
  // - Starts fully closed (isOpen = false)
  // - Smooth mechanical hinge animation toggled by clicking watch or buttons
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(false);

  // Bilingual Letter Modal State
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const isLetterOpenRef = useRef(false);
  isLetterOpenRef.current = isLetterOpen;

  // Bilingual Language State: 'en' (default) | 'vi'
  const [language, setLanguage] = useState('en');

  const currentContent = useMemo(() => {
    return keepsakeLetterContent[language] || keepsakeLetterContent.en;
  }, [language]);

  const sceneRefs = useRef({
    scene: null,
    camera: null,
    renderer: null,
    watchGroup: null,
    hingePivotGroup: null,
    hourHandGroup: null,
    minuteHandGroup: null,
    secondHandGroup: null,
    targetCamPos: new THREE.Vector3(0, 0.10, 3.80),
    targetLookAt: new THREE.Vector3(0, 0.08, 0),
    openProgress: 0,
    targetOpenProgress: 0,
    animFrameId: null
  });

  useEscapeKey(() => {
    if (isLetterOpen) {
      setIsLetterOpen(false);
    } else if (isOpenRef.current) {
      toggleWatchLid();
    } else if (onClose) {
      onClose();
    }
  }, true);

  // Initialize 3D Scene on mount
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 740;
    const height = container.clientHeight || 420;

    // 1. Scene & Camera (Framed face-on with 32° FOV, guaranteeing TRUE CIRCULAR FORM & FULL VIEW)
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 40);
    camera.position.set(0, 0.10, 3.80);
    camera.lookAt(0, 0.08, 0);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 3. Cinematic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x523672, 1.8);
    scene.add(ambientLight);

    const keySpot = new THREE.SpotLight(0xfff5dd, 6.4, 18, Math.PI / 4, 0.45, 1.2);
    keySpot.position.set(1.6, 3.8, 3.6);
    scene.add(keySpot);

    const rimLight = new THREE.DirectionalLight(0xbca4dc, 2.2);
    rimLight.position.set(-3.2, 2.4, -1.8);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xf0c860, 2.4, 8);
    fillLight.position.set(0, 0.4, 2.6);
    scene.add(fillLight);

    // Direct Front Light illuminating the dial and hands brilliantly
    const frontDialLight = new THREE.DirectionalLight(0xfffaed, 2.6);
    frontDialLight.position.set(0, 1.0, 4.0);
    scene.add(frontDialLight);

    // 4. Antique Champagne-Gold PBR Materials
    const champagneGoldPBR = new THREE.MeshStandardMaterial({
      color: 0xedc878,
      metalness: 0.92,
      roughness: 0.22,
      side: THREE.DoubleSide
    });

    const polishedChampagneGoldPBR = new THREE.MeshStandardMaterial({
      color: 0xf5df9b,
      metalness: 0.95,
      roughness: 0.12
    });

    const bluedSteelPBR = new THREE.MeshStandardMaterial({
      color: 0x182438,
      metalness: 0.92,
      roughness: 0.18
    });

    // 5. Soft Lavender Velvet Presentation Surface (Display Pedestal)
    // Placed at z = -0.32 (safely behind watch at z = 0, giving a full 0.24 clearance - ZERO clipping!)
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -0.15, -0.32);
    scene.add(pedestalGroup);

    const velvetMat = new THREE.MeshStandardMaterial({
      map: createPedestalVelvetTexture(),
      roughness: 0.82,
      metalness: 0.05
    });

    // Velvet display cushion plinth
    const plinthMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.95, 2.15, 0.20, 64),
      velvetMat
    );
    plinthMesh.rotation.x = Math.PI / 2;
    pedestalGroup.add(plinthMesh);

    // Champagne gold decorative rim rings around pedestal
    const plinthRimFront = new THREE.Mesh(
      new THREE.TorusGeometry(1.95, 0.024, 16, 64),
      champagneGoldPBR
    );
    plinthRimFront.position.z = 0.10;
    pedestalGroup.add(plinthRimFront);

    // Ambient Contact Shadow Mesh resting on the velvet surface
    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    const sCanvas = document.createElement('canvas');
    sCanvas.width = sCanvas.height = 256;
    const sCtx = sCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 128);
    sGrad.addColorStop(0, 'rgba(8, 3, 16, 0.55)');
    sGrad.addColorStop(0.5, 'rgba(8, 3, 16, 0.18)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowMat = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(sCanvas),
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.z = 0.102;
    pedestalGroup.add(shadowMesh);

    // 6. Complete Antique Champagne-Gold Pocket Watch Assembly (True Circular Proportions)
    const watchGroup = new THREE.Group();
    watchGroup.position.set(0, 0.02, 0);
    scene.add(watchGroup);

    // A. Main Watch Case Body (Open-ended cylinder outer wall - NO solid front cap blocking the dial!)
    const caseGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.08, 64, 1, true);
    const caseMesh = new THREE.Mesh(caseGeo, champagneGoldPBR);
    caseMesh.rotation.x = Math.PI / 2;
    caseMesh.position.z = -0.04;
    watchGroup.add(caseMesh);

    // Solid Case Back Plate at z = -0.08 (behind the watch)
    const caseBack = new THREE.Mesh(
      new THREE.CircleGeometry(0.85, 64),
      champagneGoldPBR
    );
    caseBack.rotation.y = Math.PI;
    caseBack.position.z = -0.08;
    watchGroup.add(caseBack);

    // Stepped Beveled Outer Bezel Rim framing the dial
    const rimMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.038, 16, 64),
      champagneGoldPBR
    );
    rimMesh.position.z = 0.005;
    watchGroup.add(rimMesh);

    // B. Complete Winding Crown, Stem & Bow Ring at 12 o'clock (+Y axis)
    const crownGroup = new THREE.Group();
    crownGroup.position.set(0, 0.85, -0.02);
    watchGroup.add(crownGroup);

    // Stem Neck
    const stemMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.09, 20),
      champagneGoldPBR
    );
    stemMesh.position.y = 0.045;
    crownGroup.add(stemMesh);

    // Knurled Winding Crown Knob
    const crownKnob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.085, 0.13, 24),
      champagneGoldPBR
    );
    crownKnob.position.y = 0.14;
    crownGroup.add(crownKnob);

    // Top Pusher Button
    const crownPusher = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16),
      polishedChampagneGoldPBR
    );
    crownPusher.position.y = 0.22;
    crownGroup.add(crownPusher);

    // Suspension Bow Loop Ring
    const bowRingMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.15, 0.026, 16, 32),
      champagneGoldPBR
    );
    bowRingMesh.position.y = 0.15;
    crownGroup.add(bowRingMesh);

    // Gracefully Draped Antique Champagne Gold Chain attached to bow
    const chainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.08, 1.05, -0.02),
      new THREE.Vector3(0.45, 0.98, -0.08),
      new THREE.Vector3(0.88, 0.70, -0.12),
      new THREE.Vector3(1.10, 0.25, -0.14),
      new THREE.Vector3(1.15, -0.25, -0.15),
      new THREE.Vector3(0.98, -0.72, -0.16),
      new THREE.Vector3(0.60, -1.02, -0.15),
      new THREE.Vector3(0.15, -1.15, -0.14)
    ]);
    const chainGeo = new THREE.TubeGeometry(chainCurve, 48, 0.016, 10, false);
    const chainMesh = new THREE.Mesh(chainGeo, champagneGoldPBR);
    watchGroup.add(chainMesh);

    // C. Internal Clock Dial Plate (100% UNBURIED and VISIBLE at z = 0.00)
    const dialTex = createWatchDialTexture();
    const dialMat = new THREE.MeshStandardMaterial({
      map: dialTex,
      roughness: 0.35,
      metalness: 0.08,
      side: THREE.DoubleSide
    });
    const dialMesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.81, 64),
      dialMat
    );
    dialMesh.position.z = 0.00;
    watchGroup.add(dialMesh);

    // D. REAL MECHANICAL CLOCK MOVEMENT (All 3 Hands on Shared Center Pivot)
    const handsPivotGroup = new THREE.Group();
    handsPivotGroup.position.set(0, 0, 0.001);
    watchGroup.add(handsPivotGroup);

    // 1. HOUR HAND (Deep Blued Steel, Classic Breguet Spade Tip pointing +Y)
    const hourHandGroup = new THREE.Group();
    hourHandGroup.position.set(0, 0, 0.004);
    handsPivotGroup.add(hourHandGroup);

    const hourBlade = new THREE.Mesh(
      new THREE.BoxGeometry(0.026, 0.28, 0.005),
      bluedSteelPBR
    );
    hourBlade.position.set(0, 0.14, 0);
    hourHandGroup.add(hourBlade);

    const hourRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.042, 0.010, 8, 20),
      bluedSteelPBR
    );
    hourRing.position.set(0, 0.22, 0);
    hourHandGroup.add(hourRing);

    const hourTip = new THREE.Mesh(
      new THREE.ConeGeometry(0.018, 0.09, 8),
      bluedSteelPBR
    );
    hourTip.position.set(0, 0.285, 0);
    hourHandGroup.add(hourTip);

    const hourTail = new THREE.Mesh(
      new THREE.BoxGeometry(0.020, 0.08, 0.005),
      bluedSteelPBR
    );
    hourTail.position.set(0, -0.04, 0);
    hourHandGroup.add(hourTail);

    // 2. MINUTE HAND (Longer, Sleek Breguet Pointer pointing +Y)
    const minuteHandGroup = new THREE.Group();
    minuteHandGroup.position.set(0, 0, 0.010);
    handsPivotGroup.add(minuteHandGroup);

    const minuteBlade = new THREE.Mesh(
      new THREE.BoxGeometry(0.020, 0.42, 0.005),
      bluedSteelPBR
    );
    minuteBlade.position.set(0, 0.21, 0);
    minuteHandGroup.add(minuteBlade);

    const minuteRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.036, 0.008, 8, 20),
      bluedSteelPBR
    );
    minuteRing.position.set(0, 0.36, 0);
    minuteHandGroup.add(minuteRing);

    const minuteTip = new THREE.Mesh(
      new THREE.ConeGeometry(0.014, 0.12, 8),
      bluedSteelPBR
    );
    minuteTip.position.set(0, 0.44, 0);
    minuteHandGroup.add(minuteTip);

    const minuteTail = new THREE.Mesh(
      new THREE.BoxGeometry(0.016, 0.10, 0.005),
      bluedSteelPBR
    );
    minuteTail.position.set(0, -0.05, 0);
    minuteHandGroup.add(minuteTail);

    // 3. SECOND HAND (Thin Polished Golden Needle with Counterweight Disc)
    const secondHandGroup = new THREE.Group();
    secondHandGroup.position.set(0, 0, 0.016);
    handsPivotGroup.add(secondHandGroup);

    const secondNeedle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.005, 0.56, 8),
      polishedChampagneGoldPBR
    );
    secondNeedle.position.set(0, 0.28, 0);
    secondHandGroup.add(secondNeedle);

    const secondDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 0.004, 16),
      polishedChampagneGoldPBR
    );
    secondDisc.rotation.x = Math.PI / 2;
    secondDisc.position.set(0, -0.12, 0);
    secondHandGroup.add(secondDisc);

    const secondTail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.07, 8),
      polishedChampagneGoldPBR
    );
    secondTail.position.set(0, -0.155, 0);
    secondHandGroup.add(secondTail);

    // 4. Central Mechanical Cannon Pinion & Domed Cap
    const centerBoss = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.038, 0.025, 20),
      polishedChampagneGoldPBR
    );
    centerBoss.rotation.x = Math.PI / 2;
    centerBoss.position.set(0, 0, 0.012);
    handsPivotGroup.add(centerBoss);

    const centerDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      polishedChampagneGoldPBR
    );
    centerDome.rotation.x = -Math.PI / 2;
    centerDome.position.set(0, 0, 0.025);
    handsPivotGroup.add(centerDome);

    // E. Protective Glass Crystal (Safely above hands at z = 0.026)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 0.25,
      transparent: true,
      roughness: 0.05,
      ior: 1.50,
      depthWrite: false
    });
    const glassMesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.81, 64),
      glassMat
    );
    glassMesh.position.z = 0.026;
    watchGroup.add(glassMesh);

    // F. Hinged Front Lid (Pivot at 9 o'clock: x = -0.85, y = 0, z = 0.020)
    const hingePivotGroup = new THREE.Group();
    hingePivotGroup.position.set(-0.85, 0, 0.020);
    watchGroup.add(hingePivotGroup);

    // Cylindrical Hinge Pin Barrel along Y axis
    const hingeBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 0.16, 16),
      champagneGoldPBR
    );
    hingeBarrel.position.set(0, 0, 0);
    hingePivotGroup.add(hingeBarrel);

    const lidGroup = new THREE.Group();
    lidGroup.position.set(0.85, 0, 0);
    hingePivotGroup.add(lidGroup);

    // Outer Engraved Cover Lid (Circle facing +Z with engraved "100" medallion)
    const coverTex = createWatchCoverTexture();
    const coverMat = new THREE.MeshStandardMaterial({
      map: coverTex,
      roughness: 0.22,
      metalness: 0.88,
      side: THREE.DoubleSide
    });
    const lidOuter = new THREE.Mesh(
      new THREE.CircleGeometry(0.83, 64),
      coverMat
    );
    lidOuter.position.z = 0.015;
    lidGroup.add(lidOuter);

    const lidRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.030, 16, 64),
      champagneGoldPBR
    );
    lidRim.position.z = 0.015;
    lidGroup.add(lidRim);

    // Inner Lid Face: Miniature Polaroid Keepsake Photograph
    // Facing -Z when closed; faces user when rotated open by ~123 degrees around Y
    const innerPhotoTex = createInnerPhotoTexture();
    const innerPhotoMat = new THREE.MeshStandardMaterial({
      map: innerPhotoTex,
      roughness: 0.32,
      metalness: 0.15,
      side: THREE.DoubleSide
    });
    const innerPhotoMesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.81, 64),
      innerPhotoMat
    );
    innerPhotoMesh.rotation.y = Math.PI; // Inverted so it faces forward when lid is opened
    innerPhotoMesh.position.z = -0.005;
    lidGroup.add(innerPhotoMesh);

    // Initial State: Strictly CLOSED (rotation.y = 0)
    hingePivotGroup.rotation.y = 0;

    // Save refs for animation loop
    sceneRefs.current = {
      ...sceneRefs.current,
      scene,
      camera,
      renderer,
      watchGroup,
      hingePivotGroup,
      hourHandGroup,
      minuteHandGroup,
      secondHandGroup,
      openProgress: 0,
      targetOpenProgress: 0
    };

    // 7. Raycaster: Clicking the Watch Toggles Open/Closed Smoothly
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return; // Ignore drag motions

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([watchGroup, hingePivotGroup], true);

      if (intersects.length > 0) {
        toggleWatchLid();
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointerup', handlePointerUp);

    // 8. Dynamic Responsive Resize with ResizeObserver (Guarantees full view and zero oval stretching)
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 740;
      const h = container.clientHeight || 420;
      const aspect = w / h;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      // Dynamically ensure full view framing on any screen aspect ratio
      const isWatchOpen = isOpenRef.current;
      const baseCamZ = isWatchOpen ? 4.15 : 3.80;
      const baseCamX = isWatchOpen ? -0.38 : 0;
      const zoomFactor = aspect < 1.25 ? Math.min(1.45, 1.25 / Math.max(0.72, aspect)) : 1.0;
      sceneRefs.current.targetCamPos.set(baseCamX, 0.10, baseCamZ * zoomFactor);
      sceneRefs.current.targetLookAt.set(baseCamX, 0.08, 0);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    // 9. Render & Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      sceneRefs.current.animFrameId = requestAnimationFrame(animate);

      // Skip heavy WebGL render pass while reading handwritten letter or when tab is hidden
      if (isLetterOpenRef.current || document.hidden) {
        return;
      }
      const delta = Math.min(clock.getDelta(), 0.1);

      // Smooth camera interpolation
      camera.position.lerp(sceneRefs.current.targetCamPos, 3.5 * delta);
      camera.lookAt(sceneRefs.current.targetLookAt);

      // REAL MECHANICAL CLOCK HANDS MOVEMENT (Real-time Clock Driven)
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds() + ms / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;

      // Clockwise rotation around +Z axis (negative Z rotation in Three.js)
      if (sceneRefs.current.secondHandGroup) {
        sceneRefs.current.secondHandGroup.rotation.z = -(s / 60) * Math.PI * 2;
      }
      if (sceneRefs.current.minuteHandGroup) {
        sceneRefs.current.minuteHandGroup.rotation.z = -(m / 60) * Math.PI * 2;
      }
      if (sceneRefs.current.hourHandGroup) {
        sceneRefs.current.hourHandGroup.rotation.z = -(h / 12) * Math.PI * 2;
      }

      // Smooth mechanical hinge rotation (0 to 123.2 degrees around Y)
      sceneRefs.current.openProgress = THREE.MathUtils.damp(
        sceneRefs.current.openProgress,
        sceneRefs.current.targetOpenProgress,
        5.2,
        delta
      );

      const p = sceneRefs.current.openProgress;
      hingePivotGroup.rotation.y = -p * 2.15; // Swings open cleanly to the left around 9 o'clock hinge

      renderer.render(scene, camera);
    };

    animate();

    // 10. Thorough Cleanup on Unmount
    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();

      if (sceneRefs.current.animFrameId) {
        cancelAnimationFrame(sceneRefs.current.animFrameId);
      }

      scene.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((mat) => {
                if (mat.map) mat.map.dispose();
                mat.dispose();
              });
            } else {
              if (obj.material.map) obj.material.map.dispose();
              obj.material.dispose();
            }
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Toggle Watch Lid Open / Closed
  const toggleWatchLid = () => {
    const nextState = !isOpenRef.current;
    isOpenRef.current = nextState;
    setIsOpen(nextState);

    sceneRefs.current.targetOpenProgress = nextState ? 1.0 : 0.0;

    if (nextState) {
      try { soundManager.playStarChime(1.15); } catch {}
      // When opened, frame both the open lid on left and dial on right comfortably in full view
      const w = mountRef.current?.clientWidth || 740;
      const h = mountRef.current?.clientHeight || 420;
      const aspect = w / h;
      const zoomFactor = aspect < 1.25 ? Math.min(1.45, 1.25 / Math.max(0.72, aspect)) : 1.0;
      sceneRefs.current.targetCamPos.set(-0.38, 0.10, 4.15 * zoomFactor);
      sceneRefs.current.targetLookAt.set(-0.38, 0.08, 0);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFE89E', '#9275B2', '#FFFDF9']
      });
    } else {
      soundManager.playButtonClick();
      // When closed, re-center squarely on closed pocket watch in full view
      const w = mountRef.current?.clientWidth || 740;
      const h = mountRef.current?.clientHeight || 420;
      const aspect = w / h;
      const zoomFactor = aspect < 1.25 ? Math.min(1.45, 1.25 / Math.max(0.72, aspect)) : 1.0;
      sceneRefs.current.targetCamPos.set(0, 0.10, 3.80 * zoomFactor);
      sceneRefs.current.targetLookAt.set(0, 0.08, 0);
    }
  };

  const triggerOpenLetter = () => {
    soundManager.playEnvelopeOpen();
    setIsLetterOpen(true);
  };

  const toggleLanguage = () => {
    soundManager.playButtonClick();
    setLanguage((prev) => (prev === 'en' ? 'vi' : 'en'));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1450,
        backgroundColor: '#070210',
        backgroundImage: `
          radial-gradient(circle at 50% 28%, rgba(76, 38, 115, 0.82) 0%, rgba(22, 9, 40, 0.94) 52%, #06020D 100%),
          radial-gradient(circle at 85% 75%, rgba(212, 175, 55, 0.12) 0%, transparent 45%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        overflowX: 'hidden',
        userSelect: 'none',
        padding: '16px'
      }}
    >
      {/* Universal Close Button returning to gift box (pinned fixed to top right, hidden when sub-letter modal is open) */}
      {!isLetterOpen && (
        <CloseButton
          onClose={onClose}
          variant="gold"
          isFixed={true}
          top="clamp(14px, 3vw, 20px)"
          right="clamp(14px, 3vw, 24px)"
          ariaLabel="Close time capsule and return to gift box"
        />
      )}

      {/* Top Left Return to Gift Box Button (hidden when sub-letter modal is open) */}
      {!isLetterOpen && (
        <div style={{ position: 'fixed', top: 'clamp(14px, 3vw, 20px)', left: 'clamp(14px, 3vw, 24px)', zIndex: 40 }}>
          <button
            onClick={() => {
              soundManager.playButtonClick();
              if (onClose) onClose();
            }}
            className="btn-glass"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#E8DAF5',
              background: 'rgba(67, 46, 93, 0.65)',
              border: '1px solid rgba(212, 175, 55, 0.40)',
              borderRadius: '999px',
              cursor: 'pointer'
            }}
            aria-label="Back to gift box"
          >
            <ArrowLeft size={14} color="#D4AF37" />
            <span>BACK TO GIFT BOX</span>
          </button>
        </div>
      )}

      {/* Main Experience Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '920px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: 'auto 0',
          paddingTop: '20px',
          paddingBottom: '20px'
        }}
      >
        {/* SECTION 1: ELEGANT 100 DAYS WITH COMMANDER HEADING */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span
            className="font-cinzel"
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.24em',
              color: '#D4AF37',
              display: 'block',
              marginBottom: '4px'
            }}
          >
            ✦ THE 100-DAY TIME CAPSULE ✦
          </span>

          <h2
            className="font-cinzel"
            style={{
              fontSize: 'clamp(24px, 3.8vw, 36px)',
              fontWeight: 800,
              letterSpacing: '0.14em',
              background: 'linear-gradient(135deg, #FFFDF8 0%, #F5DE88 50%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 4px',
              textShadow: '0 2px 20px rgba(212, 175, 55, 0.25)'
            }}
          >
            100 DAYS WITH COMMANDER
          </h2>

          <p
            className="font-serif-luxury"
            style={{
              fontSize: '14px',
              color: '#D5C4E8',
              fontStyle: 'italic',
              margin: 0,
              letterSpacing: '0.05em'
            }}
          >
            A LITTLE SOMETHING TO REMEMBER
          </p>
        </div>

        {/* SECTION 2 & 3: 3D WEBGL VIEWPORT FOR ANTIQUE POCKET WATCH (FULL VIEW) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(420px, 54vh, 520px)',
            cursor: 'pointer'
          }}
          title={isOpen ? 'Click watch to close lid' : 'Click watch to open lid'}
        >
          <div ref={mountRef} style={{ width: '100%', height: '100%', outline: 'none' }} />
        </div>

        {/* SECTION 6 & 7: TIME CAPSULE SURPRISE & CONTROLS */}
        <div
          style={{
            marginTop: '12px',
            textAlign: 'center',
            zIndex: 30,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* INITIAL STATE: Watch Closed -> Tap to Open Time Capsule Button */}
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleWatchLid}
                className="btn-gold-luxury"
                style={{
                  padding: '13px 36px',
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  boxShadow: '0 0 25px rgba(212, 175, 55, 0.40)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles size={16} />
                <span>TAP TO OPEN THE TIME CAPSULE</span>
              </motion.button>

              <span style={{ fontSize: '12px', color: '#BBA8D4', fontStyle: 'italic' }}>
                Click the button or tap the pocket watch directly
              </span>
            </motion.div>
          )}

          {/* OPENED STATE: Memory Elements, Handwritten Note Card & Controls */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', maxWidth: '620px' }}
            >
              {/* Golden Reveal Banner */}
              <div
                className="font-cinzel"
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.22em',
                  color: '#D4AF37',
                  textAlign: 'center',
                  marginBottom: '10px',
                  textShadow: '0 0 16px rgba(212, 175, 55, 0.5)'
                }}
              >
                ✦ 100 DAYS. COUNTLESS LITTLE MOMENTS. ✦
              </div>

              {/* Folded Handwritten Note Card (Ivory Stationery with Deckle Gold Trim) */}
              <div
                style={{
                  background: 'linear-gradient(165deg, #FFFDF9 0%, #F8F2E4 60%, #F5ECDB 100%)',
                  borderRadius: '16px',
                  padding: '18px 24px',
                  border: '1.5px solid rgba(212, 175, 55, 0.5)',
                  boxShadow: '0 14px 40px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(212, 175, 55, 0.12)',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.18em',
                    color: '#B38B29',
                    marginBottom: '6px',
                    fontFamily: "'Cinzel', Georgia, serif"
                  }}
                >
                  ✦ A LITTLE SOMETHING TO REMEMBER ✦
                </div>

                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: 'italic',
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: '#2A1B38',
                    margin: '0 0 14px'
                  }}
                >
                  “100 days of random conversations, unexpected laughs and little moments worth keeping.<br />
                  Some memories don't need a grand occasion to become special.<br />
                  Here's a little keepsake for the journey so far.”
                </p>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={triggerOpenLetter}
                    className="btn-gold-luxury"
                    style={{
                      padding: '8px 22px',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35)'
                    }}
                  >
                    <Mail size={14} />
                    <span>READ FULL HANDWRITTEN LETTER (BILINGUAL)</span>
                  </motion.button>
                </div>
              </div>

              {/* Action Controls Bar */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleWatchLid}
                  className="btn-glass"
                  style={{
                    padding: '10px 22px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#E8DAF5',
                    background: 'rgba(67, 46, 93, 0.75)',
                    border: '1px solid rgba(212, 175, 55, 0.45)',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  title="Close pocket watch lid"
                >
                  <RotateCcw size={14} color="#D4AF37" />
                  <span>CLOSE LID</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    soundManager.playButtonClick();
                    if (onClose) onClose();
                  }}
                  className="btn-glass"
                  style={{
                    padding: '10px 22px',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: '#F4ECFD',
                    background: 'rgba(58, 30, 80, 0.85)',
                    border: '1.5px solid rgba(212, 175, 55, 0.50)',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)'
                  }}
                  aria-label="Close time capsule and return to gift box"
                >
                  <X size={14} color="#D4AF37" />
                  <span>CLOSE TIME CAPSULE</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bilingual Physical Stationery Letter Modal */}
      <AnimatePresence>
        {isLetterOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1600,
              background: 'rgba(9, 4, 18, 0.88)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              overflowY: 'auto'
            }}
            onClick={() => setIsLetterOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.84, y: 30, rotateX: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.86, y: 20, rotateX: 12 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '680px',
                width: '95%',
                maxHeight: '92vh',
                overflowY: 'auto',
                background: 'linear-gradient(175deg, #FFFDF8 0%, #FAF5EA 50%, #FFFDF9 100%)',
                borderRadius: '20px',
                padding: 'clamp(28px, 5vw, 44px) clamp(24px, 5vw, 42px)',
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
              {/* Universal Close Button (stays visible when scrolling on mobile) */}
              <CloseButton
                onClose={() => setIsLetterOpen(false)}
                variant="gold"
                isSticky={true}
                top="14px"
                right="14px"
                ariaLabel="Close handwritten letter"
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
                  paddingRight: '54px',
                  flexWrap: 'wrap',
                  gap: '10px'
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
                      display: 'block'
                    }}
                  >
                    {currentContent.headerBadge}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#7A6291',
                      fontStyle: 'italic'
                    }}
                  >
                    {currentContent.milestoneTag} • {currentContent.coordinatesTag}
                  </span>
                </div>

                {/* Language Toggle Button */}
                <button
                  onClick={toggleLanguage}
                  className="btn-glass"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#382052',
                    background: 'rgba(212, 175, 55, 0.18)',
                    border: '1px solid rgba(212, 175, 55, 0.55)',
                    borderRadius: '999px',
                    cursor: 'pointer'
                  }}
                  title="Switch between English and Vietnamese"
                >
                  <Languages size={14} color="#9C782F" />
                  <span>{currentContent.toggleButtonText}</span>
                </button>
              </div>

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
                {currentContent.salutation}
              </h3>

              {/* Letter Paragraphs in Original Handwritten / Italic Cursive Style */}
              <div
                style={{
                  fontFamily: '"Caveat", cursive, "Playfair Display", serif',
                  fontSize: 'clamp(20px, 2.4vw, 23px)',
                  lineHeight: '1.8',
                  color: '#341F48',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {currentContent.paragraphs.map((p, idx) => (
                  <p key={idx} style={{ margin: 0 }}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Sign-off & Signature */}
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
                    {currentContent.signaturePrefix}
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
                    {currentContent.signatureName}
                  </span>
                </div>

                <button
                  onClick={() => setIsLetterOpen(false)}
                  className="btn-gold-luxury"
                  style={{
                    padding: '8px 20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.08em'
                  }}
                >
                  {currentContent.foldButtonText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
