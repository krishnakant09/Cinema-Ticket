import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ScreenCanvasTexture } from './ScreenCanvasTexture.js';
import { soundFX } from '../../utils/soundFX.js';
import { Eye, Check, Sparkles, Navigation, Layers, RotateCcw } from 'lucide-react';

// Camera preset positions
const PRESETS = {
  sweetspot: {
    position: new THREE.Vector3(0, 10.5, 23.5),
    target: new THREE.Vector3(0, 2.5, 4.5),
  },
  vip: {
    position: new THREE.Vector3(0, 7.8, 17.5),
    target: new THREE.Vector3(0, 2.2, 0),
  },
  topdown: {
    position: new THREE.Vector3(0, 26, 9.5),
    target: new THREE.Vector3(0, 0, 9.5),
  },
  screen: {
    position: new THREE.Vector3(0, 3.2, -0.5),
    target: new THREE.Vector3(0, 2.5, 12),
  },
};

// Builder function: Auditorium walls, tiered stepped floor, aisle runner
function buildAuditorium(scene) {
  const rows = 10;
  const riserHeight = 0.42;
  const rowDepth = 1.25;
  const floorWidth = 22;

  const floorGroup = new THREE.Group();

  for (let r = 0; r < rows; r++) {
    const stepWidth = floorWidth;
    const stepDepth = rowDepth + 0.1;
    const stepHeight = (r + 1) * riserHeight;
    const stepZ = 3.5 + r * rowDepth;

    const stepGeo = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth);
    const stepMat = new THREE.MeshStandardMaterial({
      color: '#131722',
      roughness: 0.85,
      metalness: 0.1,
    });

    const stepMesh = new THREE.Mesh(stepGeo, stepMat);
    stepMesh.position.set(0, stepHeight / 2, stepZ);
    stepMesh.receiveShadow = true;
    floorGroup.add(stepMesh);

    // Aisle glowing runner strip on step edge
    const runnerGeo = new THREE.PlaneGeometry(1.6, stepDepth);
    const runnerMat = new THREE.MeshStandardMaterial({
      color: '#1e2638',
      roughness: 0.9,
    });
    const runner = new THREE.Mesh(runnerGeo, runnerMat);
    runner.rotation.x = -Math.PI / 2;
    runner.position.set(0, stepHeight + 0.005, stepZ);
    runner.receiveShadow = true;
    floorGroup.add(runner);

    // Step edge glowing LED marker
    const ledGeo = new THREE.BoxGeometry(1.5, 0.02, 0.04);
    const ledMat = new THREE.MeshBasicMaterial({
      color: '#06b6d4',
    });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0, stepHeight + 0.01, stepZ - stepDepth / 2 + 0.02);
    floorGroup.add(led);
  }

  // Front Stage Area near screen
  const frontStageGeo = new THREE.BoxGeometry(floorWidth, 0.3, 5.0);
  const frontStageMat = new THREE.MeshStandardMaterial({
    color: '#0f121a',
    roughness: 0.9,
  });
  const frontStage = new THREE.Mesh(frontStageGeo, frontStageMat);
  frontStage.position.set(0, 0.15, 0.5);
  frontStage.receiveShadow = true;
  floorGroup.add(frontStage);

  scene.add(floorGroup);

  // Side Acoustic Walls
  const wallHeight = 11;
  const wallLength = 26;
  const wallThickness = 0.6;

  const wallMat = new THREE.MeshStandardMaterial({
    color: '#0b0d14',
    roughness: 0.95,
    metalness: 0.05,
  });

  // Left Wall
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, wallHeight, wallLength),
    wallMat
  );
  leftWall.position.set(-floorWidth / 2 - 0.3, wallHeight / 2, 8.5);
  scene.add(leftWall);

  // Right Wall
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, wallHeight, wallLength),
    wallMat
  );
  rightWall.position.set(floorWidth / 2 + 0.3, wallHeight / 2, 8.5);
  scene.add(rightWall);

  // Rear Wall
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(floorWidth + 1.2, wallHeight, wallThickness),
    wallMat
  );
  backWall.position.set(0, wallHeight / 2, 8.5 + wallLength / 2);
  scene.add(backWall);

  // Wall Sconces
  const sconceMat = new THREE.MeshBasicMaterial({ color: '#f59e0b' });
  const sconceGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8);

  [-floorWidth / 2 + 0.05, floorWidth / 2 - 0.05].forEach((wallX) => {
    [3.0, 7.5, 12.0, 16.5].forEach((sconceZ) => {
      const sconce = new THREE.Mesh(sconceGeo, sconceMat);
      sconce.position.set(wallX, 5.5, sconceZ);
      scene.add(sconce);

      const sconceLight = new THREE.PointLight('#f59e0b', 0.25, 4.5);
      sconceLight.position.set(wallX + (wallX > 0 ? -0.3 : 0.3), 5.5, sconceZ);
      scene.add(sconceLight);
    });
  });

  // Emergency Exit Signs
  const exitGeo = new THREE.PlaneGeometry(0.8, 0.4);
  const exitMat = new THREE.MeshBasicMaterial({
    color: '#10b981',
    side: THREE.DoubleSide,
  });
  const exitLeft = new THREE.Mesh(exitGeo, exitMat);
  exitLeft.position.set(-floorWidth / 2 + 0.1, 2.5, 2.5);
  exitLeft.rotation.y = Math.PI / 2;
  scene.add(exitLeft);

  const exitRight = new THREE.Mesh(exitGeo, exitMat);
  exitRight.position.set(floorWidth / 2 - 0.1, 2.5, 2.5);
  exitRight.rotation.y = -Math.PI / 2;
  scene.add(exitRight);
}

// Builder function: Curved cinema screen
function buildCurvedScreen(scene, screenTexture) {
  const radius = 22;
  const height = 8.8;
  const arcAngle = 0.72; // ~41 degrees curved wrap
  const radialSegments = 32;

  const thetaStart = -Math.PI / 2 - arcAngle / 2;
  const screenGeo = new THREE.CylinderGeometry(
    radius,
    radius,
    height,
    radialSegments,
    1,
    true,
    thetaStart,
    arcAngle
  );

  // Invert geometry so inside curve faces center
  screenGeo.scale(1, 1, -1);

  const screenMat = new THREE.MeshBasicMaterial({
    map: screenTexture,
    side: THREE.FrontSide,
  });

  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 4.4, -radius + 2.0);
  scene.add(screenMesh);

  // Screen Bezel Border
  const frameGeo = new THREE.CylinderGeometry(
    radius - 0.05,
    radius - 0.05,
    height + 0.3,
    radialSegments,
    1,
    true,
    thetaStart - 0.01,
    arcAngle + 0.02
  );
  frameGeo.scale(1, 1, -1);
  const frameMat = new THREE.MeshStandardMaterial({
    color: '#030407',
    roughness: 0.95,
    metalness: 0.2,
    side: THREE.BackSide,
  });
  const frameMesh = new THREE.Mesh(frameGeo, frameMat);
  frameMesh.position.copy(screenMesh.position);
  scene.add(frameMesh);
}

// Builder function: Cinema seats
function buildSeats(scene, seatList, selectedIds, seatMap, beaconsMap) {
  seatMap.clear();
  beaconsMap.clear();

  const cushionGeoStandard = new THREE.BoxGeometry(0.68, 0.12, 0.62);
  const cushionGeoVip = new THREE.BoxGeometry(0.82, 0.16, 0.74);
  const backrestGeoStandard = new THREE.BoxGeometry(0.68, 0.68, 0.12);
  const backrestGeoVip = new THREE.BoxGeometry(0.82, 0.82, 0.16);
  const armrestGeo = new THREE.BoxGeometry(0.1, 0.32, 0.54);
  const baseLegGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.32, 8);
  const cupHolderGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12);
  const cupHolderRingMat = new THREE.MeshBasicMaterial({ color: '#38bdf8' });

  const beaconGeo = new THREE.CylinderGeometry(0.35, 0.02, 1.4, 16, 1, true);
  const beaconMat = new THREE.MeshBasicMaterial({
    color: '#f59e0b',
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
  });

  const armrestMat = new THREE.MeshStandardMaterial({
    color: '#1a1d26',
    roughness: 0.7,
    metalness: 0.3,
  });
  const baseLegMat = new THREE.MeshStandardMaterial({
    color: '#0d0f14',
    roughness: 0.5,
    metalness: 0.8,
  });

  seatList.forEach((seat) => {
    const isVip = seat.tierKey === 'VIP';
    const isPremium = seat.tierKey === 'PREMIUM';
    const isSelected = selectedIds.includes(seat.id);
    const isBooked = seat.status === 'booked';

    const seatGroup = new THREE.Group();
    seatGroup.position.set(seat.x, seat.y + 0.02, seat.z);

    const angleToCenter = Math.atan2(seat.x, 18);
    seatGroup.rotation.y = -angleToCenter * 0.4;

    let seatColor = '#3b4252';
    let seatEmissive = '#000000';
    let emissiveInt = 0;

    if (isSelected) {
      seatColor = '#f59e0b';
      seatEmissive = '#f59e0b';
      emissiveInt = 0.65;
    } else if (isBooked) {
      seatColor = '#272b38';
    } else {
      if (isVip) {
        seatColor = '#603813';
        seatEmissive = '#b45309';
        emissiveInt = 0.08;
      } else if (isPremium) {
        seatColor = '#1e293b';
        seatEmissive = '#0284c7';
        emissiveInt = 0.08;
      }
    }

    const cushionMat = new THREE.MeshStandardMaterial({
      color: seatColor,
      roughness: isVip ? 0.35 : 0.7,
      metalness: isVip ? 0.2 : 0.05,
      emissive: seatEmissive,
      emissiveIntensity: emissiveInt,
    });

    const backrestMat = new THREE.MeshStandardMaterial({
      color: seatColor,
      roughness: isVip ? 0.35 : 0.7,
      metalness: isVip ? 0.2 : 0.05,
      emissive: seatEmissive,
      emissiveIntensity: emissiveInt,
    });

    // Cushion
    const cushionMesh = new THREE.Mesh(
      isVip ? cushionGeoVip : cushionGeoStandard,
      cushionMat
    );
    cushionMesh.position.set(0, 0.35, 0.05);
    cushionMesh.castShadow = true;
    cushionMesh.receiveShadow = true;
    cushionMesh.userData = { seatId: seat.id };
    seatGroup.add(cushionMesh);

    // Backrest
    const backrestMesh = new THREE.Mesh(
      isVip ? backrestGeoVip : backrestGeoStandard,
      backrestMat
    );
    backrestMesh.position.set(0, 0.72, -0.22);
    backrestMesh.rotation.x = THREE.MathUtils.degToRad(-10);
    backrestMesh.castShadow = true;
    backrestMesh.receiveShadow = true;
    backrestMesh.userData = { seatId: seat.id };
    seatGroup.add(backrestMesh);

    // Base support legs
    const leftLeg = new THREE.Mesh(baseLegGeo, baseLegMat);
    leftLeg.position.set(-0.25, 0.16, 0.05);
    seatGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(baseLegGeo, baseLegMat);
    rightLeg.position.set(0.25, 0.16, 0.05);
    seatGroup.add(rightLeg);

    // Armrests
    const armrestOffset = isVip ? 0.44 : 0.36;

    const leftArm = new THREE.Mesh(armrestGeo, armrestMat);
    leftArm.position.set(-armrestOffset, 0.44, 0.04);
    seatGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armrestGeo, armrestMat);
    rightArm.position.set(armrestOffset, 0.44, 0.04);
    seatGroup.add(rightArm);

    // Cup Holder Ring
    const cupHolder = new THREE.Mesh(cupHolderGeo, cupHolderRingMat);
    cupHolder.position.set(armrestOffset, 0.61, 0.22);
    seatGroup.add(cupHolder);

    // Beacon Light Cone
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat.clone());
    beaconMesh.position.set(0, 1.4, 0);
    beaconMesh.visible = isSelected;
    seatGroup.add(beaconMesh);
    beaconsMap.set(seat.id, beaconMesh);

    seatMap.set(seat.id, {
      group: seatGroup,
      cushionMesh,
      backrestMesh,
      seatData: seat,
    });

    scene.add(seatGroup);
  });
}

export default function TheaterCanvas({
  seats,
  selectedSeatIds,
  onSeatToggle,
  currentMovie,
  povSeatId,
  onExitPov,
  onAutoSelectBest,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Hover state
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false });

  // Camera presets state
  const [activePreset, setActivePreset] = useState('sweetspot');

  // References to three objects
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const screenTextureRef = useRef(null);
  const screenMeshTextureRef = useRef(null);
  const screenLightRef = useRef(null);
  const seatMeshesRef = useRef(new Map());
  const seatBeaconsRef = useRef(new Map());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2(-1000, -1000));
  const hoveredSeatRef = useRef(null);
  const isPointerDownRef = useRef(false);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });

  // Camera animation lerp state
  const cameraAnimRef = useRef({
    animating: false,
    startPos: new THREE.Vector3(),
    targetPos: new THREE.Vector3(),
    startLookAt: new THREE.Vector3(),
    targetLookAt: new THREE.Vector3(),
    progress: 0,
    duration: 1.2, // seconds
  });

  // Track latest props in refs for animation loop
  const seatsRef = useRef(seats);
  const selectedSeatIdsRef = useRef(selectedSeatIds);
  const povSeatIdRef = useRef(povSeatId);
  const currentMovieRef = useRef(currentMovie);

  useEffect(() => {
    seatsRef.current = seats;
    selectedSeatIdsRef.current = selectedSeatIds;
    povSeatIdRef.current = povSeatId;
    currentMovieRef.current = currentMovie;
  }, [seats, selectedSeatIds, povSeatId, currentMovie]);

  // Move camera with smooth lerp
  const animateCameraTo = useCallback((targetPos, targetLookAt, duration = 1.0) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const anim = cameraAnimRef.current;
    anim.animating = true;
    anim.progress = 0;
    anim.duration = duration;
    anim.startPos.copy(cameraRef.current.position);
    anim.targetPos.copy(targetPos);
    anim.startLookAt.copy(controlsRef.current.target);
    anim.targetLookAt.copy(targetLookAt);
  }, []);

  const handleApplyPreset = useCallback((presetKey) => {
    if (povSeatIdRef.current) {
      if (onExitPov) onExitPov();
    }
    setActivePreset(presetKey);
    const preset = PRESETS[presetKey];
    if (preset) {
      soundFX.playWhoosh();
      animateCameraTo(preset.position, preset.target, 0.9);
    }
  }, [animateCameraTo, onExitPov]);

  // Sync POV mode transitions
  useEffect(() => {
    if (povSeatId) {
      const seat = seats.find((s) => s.id === povSeatId);
      if (seat) {
        soundFX.playWhoosh();
        const povPos = new THREE.Vector3(seat.x, seat.y + 0.92, seat.z + 0.05);
        const screenTarget = new THREE.Vector3(0, 3.4, -0.8);
        animateCameraTo(povPos, screenTarget, 1.2);
      }
    }
  }, [povSeatId, seats, animateCameraTo]);

  // Sync Movie change on screen texture
  useEffect(() => {
    if (screenTextureRef.current && currentMovie) {
      screenTextureRef.current.setMovie(currentMovie);
      if (screenLightRef.current && currentMovie.accentColor) {
        screenLightRef.current.color.set(currentMovie.accentColor);
      }
    }
  }, [currentMovie]);

  // Update materials when selectedSeatIds changes
  useEffect(() => {
    const seatMap = seatMeshesRef.current;
    const beaconsMap = seatBeaconsRef.current;

    seats.forEach((seat) => {
      const seatData = seatMap.get(seat.id);
      if (!seatData) return;

      const isSelected = selectedSeatIds.includes(seat.id);
      const isBooked = seat.status === 'booked';
      const isVip = seat.tierKey === 'VIP';
      const isPremium = seat.tierKey === 'PREMIUM';

      const { cushionMesh, backrestMesh } = seatData;

      if (isSelected) {
        cushionMesh.material.color.set('#f59e0b');
        cushionMesh.material.emissive.set('#f59e0b');
        cushionMesh.material.emissiveIntensity = 0.65;
        backrestMesh.material.color.set('#f59e0b');
        backrestMesh.material.emissive.set('#f59e0b');
        backrestMesh.material.emissiveIntensity = 0.5;
      } else if (isBooked) {
        cushionMesh.material.color.set('#272b38');
        cushionMesh.material.emissive.set('#000000');
        cushionMesh.material.emissiveIntensity = 0;
        backrestMesh.material.color.set('#222530');
        backrestMesh.material.emissive.set('#000000');
        backrestMesh.material.emissiveIntensity = 0;
      } else {
        let tierColor = '#3b4252';
        let emissiveColor = '#000000';
        let emissiveInt = 0;

        if (isVip) {
          tierColor = '#603813';
          emissiveColor = '#b45309';
          emissiveInt = 0.08;
        } else if (isPremium) {
          tierColor = '#1e293b';
          emissiveColor = '#0284c7';
          emissiveInt = 0.08;
        }

        cushionMesh.material.color.set(tierColor);
        cushionMesh.material.emissive.set(emissiveColor);
        cushionMesh.material.emissiveIntensity = emissiveInt;
        backrestMesh.material.color.set(tierColor);
        backrestMesh.material.emissive.set(emissiveColor);
        backrestMesh.material.emissiveIntensity = emissiveInt;
      }

      const beacon = beaconsMap.get(seat.id);
      if (beacon) {
        beacon.visible = isSelected;
      }
    });
  }, [selectedSeatIds, seats]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#07090e');
    scene.fog = new THREE.FogExp2('#07090e', 0.024);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 120);
    const initialPreset = PRESETS.sweetspot;
    camera.position.copy(initialPreset.position);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.copy(initialPreset.target);
    controls.minDistance = 2.0;
    controls.maxDistance = 38.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.45);
    scene.add(ambientLight);

    const movieColor = currentMovieRef.current?.accentColor || '#f59e0b';
    const screenLight = new THREE.SpotLight(movieColor, 3.8);
    screenLight.position.set(0, 4.0, 0);
    screenLight.target.position.set(0, 1.5, 9.5);
    screenLight.angle = Math.PI / 2.6;
    screenLight.penumbra = 0.8;
    screenLight.decay = 1.2;
    screenLight.distance = 28;
    screenLight.castShadow = true;
    screenLight.shadow.mapSize.width = 1024;
    screenLight.shadow.mapSize.height = 1024;
    screenLight.shadow.bias = -0.001;
    scene.add(screenLight);
    scene.add(screenLight.target);
    screenLightRef.current = screenLight;

    const ceilingLight1 = new THREE.PointLight('#38bdf8', 0.8, 25);
    ceilingLight1.position.set(-8, 9, 8);
    scene.add(ceilingLight1);

    const ceilingLight2 = new THREE.PointLight('#f59e0b', 0.8, 25);
    ceilingLight2.position.set(8, 9, 8);
    scene.add(ceilingLight2);

    const projectorLight = new THREE.SpotLight('#ffffff', 2.0);
    projectorLight.position.set(0, 8.5, 20.5);
    projectorLight.target.position.set(0, 3.2, -1.0);
    projectorLight.angle = 0.28;
    projectorLight.penumbra = 0.5;
    projectorLight.decay = 1.5;
    projectorLight.distance = 28;
    scene.add(projectorLight);
    scene.add(projectorLight.target);

    // 6. Auditorium Architecture
    buildAuditorium(scene);

    // 7. Curved IMAX Cinema Screen with Live Canvas Texture
    const screenTextureGen = new ScreenCanvasTexture(1024, 512);
    if (currentMovieRef.current) screenTextureGen.setMovie(currentMovieRef.current);
    screenTextureRef.current = screenTextureGen;

    const screenMeshTexture = new THREE.CanvasTexture(screenTextureGen.canvas);
    screenMeshTexture.colorSpace = THREE.SRGBColorSpace;
    screenMeshTextureRef.current = screenMeshTexture;

    buildCurvedScreen(scene, screenMeshTexture);

    // 8. Build Seats
    buildSeats(
      scene,
      seatsRef.current,
      selectedSeatIdsRef.current,
      seatMeshesRef.current,
      seatBeaconsRef.current
    );

    // Window Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation & Render Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Update Screen Canvas Texture
      if (screenTextureRef.current && screenMeshTextureRef.current) {
        const updated = screenTextureRef.current.update(delta);
        if (updated) {
          screenMeshTextureRef.current.needsUpdate = true;
        }
      }

      // Handle Camera Lerp Animation
      const anim = cameraAnimRef.current;
      if (anim.animating) {
        anim.progress += delta / anim.duration;
        const t = Math.min(anim.progress, 1.0);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        cameraRef.current.position.lerpVectors(anim.startPos, anim.targetPos, ease);
        controlsRef.current.target.lerpVectors(anim.startLookAt, anim.targetLookAt, ease);

        if (t >= 1.0) {
          anim.animating = false;
        }
      }

      // Animate beacons on selected seats
      seatBeaconsRef.current.forEach((beaconMesh) => {
        if (beaconMesh.visible) {
          beaconMesh.rotation.y += delta * 2.5;
          const scale = 1.0 + Math.sin(elapsedTime * 4.0) * 0.15;
          beaconMesh.scale.set(scale, 1.0, scale);
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Raycasting helper
  const getIntersectedSeat = (event) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return null;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouse = mouseRef.current;
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouse, cameraRef.current);

    const interactiveMeshes = [];
    seatMeshesRef.current.forEach((val) => {
      interactiveMeshes.push(val.cushionMesh);
      interactiveMeshes.push(val.backrestMesh);
    });

    const intersects = raycasterRef.current.intersectObjects(interactiveMeshes, false);
    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const seatId = hitMesh.userData?.seatId;
      if (seatId) {
        return seatsRef.current.find((s) => s.id === seatId) || null;
      }
    }
    return null;
  };

  // Pointer Move
  const handlePointerMove = (e) => {
    if (povSeatIdRef.current) {
      if (hoveredSeat) setHoveredSeat(null);
      return;
    }

    const seat = getIntersectedSeat(e);

    if (seat) {
      document.body.style.cursor = seat.status === 'booked' ? 'not-allowed' : 'pointer';
      setHoveredSeat(seat);
      hoveredSeatRef.current = seat;

      const rect = canvasRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        visible: true,
      });
    } else {
      document.body.style.cursor = 'default';
      setHoveredSeat(null);
      hoveredSeatRef.current = null;
      setTooltipPos((prev) => ({ ...prev, visible: false }));
    }
  };

  const handlePointerDown = (e) => {
    isPointerDownRef.current = true;
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
    const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);

    if (dx < 6 && dy < 6) {
      const seat = getIntersectedSeat(e);
      if (seat) {
        if (seat.status === 'booked') return;

        const isCurrentlySelected = selectedSeatIdsRef.current.includes(seat.id);
        if (isCurrentlySelected) {
          soundFX.playSeatDeselect();
        } else {
          soundFX.playSeatSelect();
        }

        if (onSeatToggle) {
          onSeatToggle(seat);
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[620px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#090b12] to-[#04060a] border border-white/10 select-none shadow-2xl"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block focus:outline-none"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      />

      {/* Screen Arc Overhead Header Indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wider uppercase shadow-lg shadow-cyan-500/10">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          IMAX Laser 4K Curved Screen
        </div>
        <div className="w-48 h-2 mt-1 border-t-2 border-cyan-400/40 rounded-t-[100%] shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
      </div>

      {/* Camera View Presets Bar (Top Right) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 shadow-xl">
        <button
          onClick={() => handleApplyPreset('sweetspot')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            activePreset === 'sweetspot'
              ? 'bg-amber-500 text-black shadow-md font-semibold'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          title="Optimal center auditorium view"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Sweet Spot
        </button>

        <button
          onClick={() => handleApplyPreset('vip')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            activePreset === 'vip'
              ? 'bg-amber-500 text-black shadow-md font-semibold'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          title="VIP Balcony overview"
        >
          <Layers className="w-3.5 h-3.5" />
          VIP Balcony
        </button>

        <button
          onClick={() => handleApplyPreset('topdown')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            activePreset === 'topdown'
              ? 'bg-amber-500 text-black shadow-md font-semibold'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          title="Top-down 2.5D seating map"
        >
          <Navigation className="w-3.5 h-3.5 rotate-45" />
          Top Down
        </button>

        <button
          onClick={() => handleApplyPreset('screen')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            activePreset === 'screen'
              ? 'bg-amber-500 text-black shadow-md font-semibold'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          title="View from screen facing audience"
        >
          <Eye className="w-3.5 h-3.5" />
          Front View
        </button>
      </div>

      {/* Quick Action: Auto Select Best Seats */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={onAutoSelectBest}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 hover:border-amber-400 text-xs font-semibold backdrop-blur-md transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Auto-Pick Best 2
        </button>
      </div>

      {/* POV Mode Banner Overlay */}
      {povSeatId && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 px-6 py-3 rounded-2xl bg-black/85 backdrop-blur-xl border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-sm">
              <Eye className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="text-white text-sm font-semibold flex items-center gap-2">
                <span>View from Seat {povSeatId}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {seats.find((s) => s.id === povSeatId)?.tierName}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                True eye-level perspective of the curved IMAX screen
              </p>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10" />

          <button
            onClick={() => {
              const seat = seats.find((s) => s.id === povSeatId);
              if (seat) onSeatToggle(seat);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedSeatIds.includes(povSeatId)
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            {selectedSeatIds.includes(povSeatId) ? (
              <>
                <Check className="w-3.5 h-3.5" /> Booked Seat
              </>
            ) : (
              <>Select this Seat</>
            )}
          </button>

          <button
            onClick={onExitPov}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer"
            title="Exit first person seat view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating 3D Hover Tooltip Card */}
      {tooltipPos.visible && hoveredSeat && !povSeatId && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full pb-3 animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          <div className="p-3.5 rounded-xl bg-slate-950/90 backdrop-blur-xl border border-white/15 shadow-2xl min-w-[200px] text-left">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="font-bold text-white text-sm flex items-center gap-1.5">
                Row {hoveredSeat.row} • Seat {hoveredSeat.number}
              </span>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                  hoveredSeat.tierKey === 'VIP'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : hoveredSeat.tierKey === 'PREMIUM'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}
              >
                {hoveredSeat.tierName}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
              <span className="text-gray-400">Price:</span>
              <span className="font-bold text-amber-400 text-sm">
                ${hoveredSeat.price.toFixed(2)}
              </span>
            </div>

            <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[11px]">
              {hoveredSeat.status === 'booked' ? (
                <span className="text-red-400 font-medium">
                  ✕ Already Occupied
                </span>
              ) : selectedSeatIds.includes(hoveredSeat.id) ? (
                <span className="text-amber-400 flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Selected (Click to remove)
                </span>
              ) : (
                <div className="flex items-center justify-between w-full text-gray-300">
                  <span className="text-cyan-400">Click to Select</span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                    <Eye className="w-3 h-3 text-cyan-400" /> POV Ready
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="w-3 h-3 bg-slate-950 border-r border-b border-white/15 rotate-45 mx-auto -mt-1.5" />
        </div>
      )}

      {/* 3D Navigation Instructions Helper Pill */}
      {!povSeatId && (
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 px-3.5 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-gray-300">
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
              Drag
            </span>
            Rotate
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
              Scroll
            </span>
            Zoom
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
              Click Seat
            </span>
            Select
          </div>
        </div>
      )}

      {/* Legend Bar (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3.5 px-4 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#3b4252] border border-white/20" />
          <span className="text-gray-300">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          <span className="text-amber-300 font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#272b38] opacity-60" />
          <span className="text-gray-500">Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#603813] border border-amber-600/50" />
          <span className="text-amber-400">VIP</span>
        </div>
      </div>
    </div>
  );
}
