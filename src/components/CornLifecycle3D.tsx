import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Sprout, 
  Sun, 
  Droplets, 
  Thermometer, 
  Layers, 
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface StageData {
  stage: number;
  name: string;
  subname: string;
  dayRange: string;
  progressRange: [number, number]; // [min, max]
  temp: string;
  waterNeed: string;
  fertilizer: string;
  description: string;
  agroAdvice: string;
}

const STAGES: StageData[] = [
  {
    stage: 1,
    name: "1. Urugʻ Ekish va Boʻrtish",
    subname: "Dastlabki namlanish va ildiz nish urishi",
    dayRange: "1 — 7 kun",
    progressRange: [0, 15],
    temp: "+12°C dan +18°C gacha",
    waterNeed: "Tuproq toʻliq namlangan (65-70%)",
    fertilizer: "Fosforli boshlangʻich oʻgʻit (Ammofos 100 kg/ga)",
    description: "Urugʻ tuproqdan 4-6 sm chuqurlikda namlikni yutib, 48 soat ichida boʻrtadi va birlamchi embrional ildizcha (radicle) pastga qarab yoʻnaladi.",
    agroAdvice: "Yozyovon sharoitida urugʻni aprel oyining ikkinchi oʻn kunligida, tuproq harorati kamida +10°C ga yetganda ekish tavsiya etiladi."
  },
  {
    stage: 2,
    name: "2. Nihol Unib Chiqishi (VE - V1)",
    subname: "Koleoptil tuproq yuzasini yorib chiqishi",
    dayRange: "8 — 15 kun",
    progressRange: [15, 35],
    temp: "+18°C dan +22°C gacha",
    waterNeed: "Har 6-8 kunda yengil sugʻorish",
    fertilizer: "Boshlangʻich azot (Karbamid 50 kg/ga)",
    description: "Koleoptil (maysa qobigʻi) yorugʻlikka intilib tuproqni teshib chiqadi. Birinchi yumaloq barg paydo boʻladi va ikkilamchi tugun ildizlar rivojlana boshlaydi.",
    agroAdvice: "Unib chiqishdan soʻng qatqaloq hosil boʻlsa, qator oralarini 4-5 sm chuqurlikda kultivatsiya qilib havo kirishini taʼminlash lozim."
  },
  {
    stage: 3,
    name: "3. Jadal Vegetativ Oʻsish (V3 - V8)",
    subname: "Poya qalinlashishi va barg massasi shakllanishi",
    dayRange: "16 — 45 kun",
    progressRange: [35, 65],
    temp: "+24°C dan +28°C gacha",
    waterNeed: "Muntazam chuqur sugʻorish (600-700 m³/ga)",
    fertilizer: "Azotli oziqlantirish (Selitra 150 kg/ga + Kaliy)",
    description: "Poya boʻyi 1.5 - 2 metrgacha oʻsadi. Boʻgʻinlar soni ortadi, yirik kuraksimon yaproqlar quyosh nurini toʻliq ushlaydi. Asosiy ildiz tizimi 1 metrgacha chuqurlashadi.",
    agroAdvice: "Bu davrda begona oʻtlarga qarshi kultivatsiya oʻtkazish va ekin qatorlarini oziqlantirish eng yuqori hosil poydevorini yaratadi."
  },
  {
    stage: 4,
    name: "4. Gullash va Changlanish (VT - R1)",
    subname: "Roʻvak yozilishi va ipakchalar (soʻta) chiqishi",
    dayRange: "46 — 65 kun",
    progressRange: [65, 85],
    temp: "+25°C dan +30°C gacha (optimal)",
    waterNeed: "Eng muhim davr: tuproq namligi 75-80%",
    fertilizer: "Bargdan mikroelementlar (Rux, Bor, Magniy)",
    description: "Poya uchida changchi gullar toʻplami — roʻvak (tassel) paydo boʻladi. Barg qoʻltiqlarida ipakdek oʻsma sochlar (soʻta ipakchalari) chiqib, shamol yordamida changlanadi.",
    agroAdvice: "Gullash paytida harorat +35°C dan oshsa, changning unuvchanligi pasayadi. Shu sababli kechki yoki tungi sugʻorish orqali mikroiqlimni yumshatish shart."
  },
  {
    stage: 5,
    name: "5. Don Yetilishi va Toʻliq Hosil (R2 - R6)",
    subname: "Sut-mum pishishdan to toʻliq biologik yetilishgacha",
    dayRange: "66 — 90 kun",
    progressRange: [85, 100],
    temp: "+22°C dan +28°C gacha",
    waterNeed: "Pishish oldidan sugʻorish toʻxtatiladi",
    fertilizer: "Kaliy-Fosfor (yakuniy toʻliqlik uchun)",
    description: "Soʻtadagi donlar qattiqlashadi, sariq oltin rang oladi va don namligi 15-20% gacha pasayadi. Oʻsimlik pishib, yigʻim-terimga tayyor boʻladi.",
    agroAdvice: "Don namligi 18% dan tushganda kombaynlar bilan yigʻib olinadi va Yozyovon don qabul qilish punktlariga saralab yetkaziladi."
  }
];

export const CornLifecycle3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // 3D Meshes group references
  const plantGroupRef = useRef<THREE.Group | null>(null);
  const rootsGroupRef = useRef<THREE.Group | null>(null);
  const stemMeshRef = useRef<THREE.Mesh | null>(null);
  const leavesGroupRef = useRef<THREE.Group | null>(null);
  const tasselGroupRef = useRef<THREE.Group | null>(null);
  const earGroupRef = useRef<THREE.Group | null>(null);
  const seedMeshRef = useRef<THREE.Mesh | null>(null);

  // State
  const [progress, setProgress] = useState<number>(30); // 0% to 100%
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1); // 0.5x, 1x, 2x, 5x
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(1);

  // Drag interaction for rotation
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const rotationTarget = useRef({ x: 0.2, y: -0.4 });

  // Update current stage based on progress
  useEffect(() => {
    const stageIdx = STAGES.findIndex(s => progress >= s.progressRange[0] && progress <= s.progressRange[1]);
    if (stageIdx !== -1) {
      setCurrentStageIdx(stageIdx);
    } else if (progress >= 100) {
      setCurrentStageIdx(4);
    }
  }, [progress]);

  // Animation Loop for automated growth
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0; // loop back to seed
        }
        return Math.min(100, Math.round((prev + 0.3 * speed) * 10) / 10);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Setup Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF1F5F9);
    scene.fog = new THREE.FogExp2(0xF1F5F9, 0.02);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 11);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    sunLight.position.set(10, 18, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xa5c4e8, 0.5);
    fillLight.position.set(-10, 5, -8);
    scene.add(fillLight);

    // 5. Environment: Soil Slice / Ground
    const groundGeo = new THREE.CylinderGeometry(4.5, 4.5, 2.5, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x4a3728, // Rich dark soil
      roughness: 0.9,
      metalness: 0.1
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -1.25;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Grass Top ring
    const grassTopGeo = new THREE.CylinderGeometry(4.55, 4.55, 0.1, 32);
    const grassTopMat = new THREE.MeshStandardMaterial({
      color: 0x5a8f3d, // Agro green grass
      roughness: 0.8
    });
    const grassTop = new THREE.Mesh(grassTopGeo, grassTopMat);
    grassTop.position.y = 0.05;
    grassTop.receiveShadow = true;
    scene.add(grassTop);

    // Coordinate Grid subtle ring
    const gridHelper = new THREE.GridHelper(9, 18, 0x94A3B8, 0xCBD5E1);
    gridHelper.position.y = 0.11;
    scene.add(gridHelper);

    // 6. Corn Plant Master Group
    const plantGroup = new THREE.Group();
    scene.add(plantGroup);
    plantGroupRef.current = plantGroup;

    // 6a. Corn Seed
    const seedGeo = new THREE.SphereGeometry(0.22, 16, 16);
    seedGeo.scale(1.2, 0.8, 0.7);
    const seedMat = new THREE.MeshStandardMaterial({
      color: 0xeab308, // Golden yellow corn kernel
      roughness: 0.4,
      metalness: 0.2
    });
    const seedMesh = new THREE.Mesh(seedGeo, seedMat);
    seedMesh.position.set(0, -0.4, 0);
    seedMesh.castShadow = true;
    plantGroup.add(seedMesh);
    seedMeshRef.current = seedMesh;

    // 6b. Roots Group (Growing downward)
    const rootsGroup = new THREE.Group();
    plantGroup.add(rootsGroup);
    rootsGroupRef.current = rootsGroup;

    // Create 8 procedural root strands
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2 + (Math.random() * 0.4);
      const radius = 0.2 + Math.random() * 0.4;
      const depth = 0.8 + Math.random() * 0.9;
      
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.4, 0),
        new THREE.Vector3(Math.cos(angle) * radius * 0.5, -0.4 - depth * 0.4, Math.sin(angle) * radius * 0.5),
        new THREE.Vector3(Math.cos(angle) * radius, -0.4 - depth, Math.sin(angle) * radius)
      ]);

      const rootGeo = new THREE.TubeGeometry(curve, 16, 0.035, 8, false);
      const rootMat = new THREE.MeshStandardMaterial({
        color: 0xf5eedc, // Off-white root color
        roughness: 0.7
      });
      const rootMesh = new THREE.Mesh(rootGeo, rootMat);
      rootsGroup.add(rootMesh);
    }

    // 6c. Corn Stem / Stalk
    const stemGeo = new THREE.CylinderGeometry(0.14, 0.22, 5.2, 16);
    stemGeo.translate(0, 2.6, 0);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x4d8b31, // Deep healthy corn stalk green
      roughness: 0.6
    });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    stemMesh.castShadow = true;
    plantGroup.add(stemMesh);
    stemMeshRef.current = stemMesh;

    // 6d. Leaves Group (Curved blades)
    const leavesGroup = new THREE.Group();
    plantGroup.add(leavesGroup);
    leavesGroupRef.current = leavesGroup;

    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x5fa836,
      roughness: 0.5,
      side: THREE.DoubleSide
    });

    // Generate 8 alternating leaf blades
    for (let i = 0; i < 8; i++) {
      const heightLevel = 0.6 + i * 0.55;
      const angle = i * 2.2; // Spiral alternating distribution
      const leafLength = 1.4 + (i > 2 && i < 6 ? 1.0 : 0.4);

      // Curved spline for arching leaf blade
      const leafCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, heightLevel, 0),
        new THREE.Vector3(Math.cos(angle) * (leafLength * 0.45), heightLevel + 0.35, Math.sin(angle) * (leafLength * 0.45)),
        new THREE.Vector3(Math.cos(angle) * leafLength, heightLevel - 0.2, Math.sin(angle) * leafLength)
      ]);

      const leafTube = new THREE.TubeGeometry(leafCurve, 20, 0.16, 6, false);
      leafTube.scale(1, 0.2, 1); // Flatten into ribbon/leaf shape
      const leafMesh = new THREE.Mesh(leafTube, leafMat);
      leafMesh.castShadow = true;
      leavesGroup.add(leafMesh);
    }

    // 6e. Tassel (Ro'vak - male inflorescence at top)
    const tasselGroup = new THREE.Group();
    tasselGroup.position.set(0, 5.2, 0);
    plantGroup.add(tasselGroup);
    tasselGroupRef.current = tasselGroup;

    const tasselMat = new THREE.MeshStandardMaterial({
      color: 0xd4a329, // Yellow-gold pollen tassel
      roughness: 0.7
    });

    for (let t = 0; t < 9; t++) {
      const tAngle = (t / 9) * Math.PI * 2;
      const tCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(tAngle) * 0.3, 0.5, Math.sin(tAngle) * 0.3),
        new THREE.Vector3(Math.cos(tAngle) * 0.6, 0.9, Math.sin(tAngle) * 0.6)
      ]);
      const tMesh = new THREE.Mesh(new THREE.TubeGeometry(tCurve, 12, 0.02, 6, false), tasselMat);
      tasselGroup.add(tMesh);
    }

    // 6f. Corn Ear (So'ta - cob with silk)
    const earGroup = new THREE.Group();
    earGroup.position.set(0.22, 2.6, 0.1);
    earGroup.rotation.z = -0.35;
    plantGroup.add(earGroup);
    earGroupRef.current = earGroup;

    // Green Husk
    const huskGeo = new THREE.ConeGeometry(0.22, 1.2, 12);
    huskGeo.translate(0, 0.6, 0);
    const huskMat = new THREE.MeshStandardMaterial({ color: 0x6bb83c, roughness: 0.6 });
    const huskMesh = new THREE.Mesh(huskGeo, huskMat);
    earGroup.add(huskMesh);

    // Yellow Maize Cob peak
    const cobGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.9, 16);
    cobGeo.translate(0, 0.5, 0);
    const cobMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.1 });
    const cobMesh = new THREE.Mesh(cobGeo, cobMat);
    earGroup.add(cobMesh);

    // Golden Silk hair threads
    const silkMat = new THREE.MeshStandardMaterial({ color: 0xe2ba62, roughness: 0.9 });
    for (let s = 0; s < 6; s++) {
      const sCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.1, 0),
        new THREE.Vector3(0.08 * (s - 3), 1.35, (Math.random() - 0.5) * 0.15),
        new THREE.Vector3(0.15 * (s - 3), 1.1, (Math.random() - 0.5) * 0.2)
      ]);
      const sMesh = new THREE.Mesh(new THREE.TubeGeometry(sCurve, 8, 0.012, 4, false), silkMat);
      earGroup.add(sMesh);
    }

    // Mouse Drag Interactions
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMousePos.current.x;
      const deltaY = e.clientY - prevMousePos.current.y;
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      rotationTarget.current.y += deltaX * 0.008;
      rotationTarget.current.x = Math.max(-0.4, Math.min(0.8, rotationTarget.current.x + deltaY * 0.008));
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z = Math.max(5, Math.min(18, cameraRef.current.position.z + e.deltaY * 0.01));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Touch Support for Mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.current.x;
      const deltaY = e.touches[0].clientY - prevMousePos.current.y;
      prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      rotationTarget.current.y += deltaX * 0.01;
      rotationTarget.current.x = Math.max(-0.4, Math.min(0.8, rotationTarget.current.x + deltaY * 0.01));
    };
    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Responsive Window Resize
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 500;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let animFrameId: number;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      // Smooth rotate towards target
      if (plantGroupRef.current) {
        plantGroupRef.current.rotation.y += (rotationTarget.current.y - plantGroupRef.current.rotation.y) * 0.1;
        groundMesh.rotation.y = plantGroupRef.current.rotation.y;
        grassTop.rotation.y = plantGroupRef.current.rotation.y;
      }
      if (cameraRef.current) {
        cameraRef.current.position.y += (4 + rotationTarget.current.x * 4 - cameraRef.current.position.y) * 0.1;
        cameraRef.current.lookAt(0, 2, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, []);

  // Update 3D Model Scales & Visibility based on progress percentage
  useEffect(() => {
    const p = progress / 100; // 0.0 to 1.0

    // 1. Seed
    if (seedMeshRef.current) {
      if (p < 0.15) {
        seedMeshRef.current.visible = true;
        const seedScale = 1.0 + (p / 0.15) * 0.4; // Swelling seed
        seedMeshRef.current.scale.set(seedScale, seedScale, seedScale);
      } else {
        seedMeshRef.current.visible = p < 0.4;
      }
    }

    // 2. Roots (grow downward from 5% to 80%)
    if (rootsGroupRef.current) {
      const rootScaleY = Math.min(1.0, Math.max(0.01, (p - 0.04) / 0.7));
      const rootScaleXZ = Math.min(1.0, Math.max(0.01, (p - 0.04) / 0.5));
      rootsGroupRef.current.scale.set(rootScaleXZ, rootScaleY, rootScaleXZ);
      rootsGroupRef.current.visible = p >= 0.04;
    }

    // 3. Stem (grow upward from 10% to 100%)
    if (stemMeshRef.current) {
      const stemScaleY = Math.min(1.0, Math.max(0.01, (p - 0.1) / 0.75));
      const stemScaleXZ = Math.min(1.0, Math.max(0.05, (p - 0.1) / 0.65));
      stemMeshRef.current.scale.set(stemScaleXZ, stemScaleY, stemScaleXZ);
      stemMeshRef.current.visible = p >= 0.08;
    }

    // 4. Leaves (unfold from 15% to 100%)
    if (leavesGroupRef.current) {
      const leafScale = Math.min(1.0, Math.max(0.01, (p - 0.14) / 0.65));
      leavesGroupRef.current.scale.set(leafScale, leafScale, leafScale);
      leavesGroupRef.current.visible = p >= 0.14;
    }

    // 5. Tassel (male inflorescence appears from 60% to 100%)
    if (tasselGroupRef.current) {
      const tasselScale = Math.min(1.0, Math.max(0.01, (p - 0.6) / 0.25));
      tasselGroupRef.current.scale.set(tasselScale, tasselScale, tasselScale);
      tasselGroupRef.current.visible = p >= 0.6;
    }

    // 6. Corn Ear (female cob appears from 65% to 100%)
    if (earGroupRef.current) {
      const earScale = Math.min(1.0, Math.max(0.01, (p - 0.65) / 0.25));
      earGroupRef.current.scale.set(earScale, earScale, earScale);
      earGroupRef.current.visible = p >= 0.65;
    }
  }, [progress]);

  const activeStage = STAGES[currentStageIdx];

  const jumpToStage = (idx: number) => {
    setCurrentStageIdx(idx);
    setProgress(STAGES[idx].progressRange[0] + 5);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" id="corn-lifecycle-3d-section">
      
      {/* Header Banner */}
      <div className="bg-[#0F172A] text-white p-6 rounded-lg border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <Sprout className="w-3.5 h-3.5" />
            <span>Three.js Interaktiv 3D Simulyatsiya</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Makkajoʻxori Oʻsimligining 3D Hayot Tsikli
          </h2>
          <p className="text-slate-300 text-xs mt-1">
            Urugʻ boʻrtishidan boshlab to toʻla yetilgan hosil soʻtasigacha boʻlgan 90 kunlik biologik rivojlanish
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isPlaying ? 'bg-[#3B82F6] text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Toʻxtatish" : "Oʻynash"}</span>
          </button>

          <button
            onClick={() => setProgress(0)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
            title="Boshiga qaytarish"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed selector */}
          <div className="flex items-center text-[10px] font-bold text-slate-400 border-l border-slate-700 pl-2 gap-1">
            {[1, 2, 5].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded transition-colors ${
                  speed === s ? 'bg-amber-400 text-[#0F172A]' : 'hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 3D Canvas & Info Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 3D Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col">
          
          {/* Canvas Subheader with Hint */}
          <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-[#0F172A]">Real-Time WebGL 3D Kamera</span>
            </div>
            <span className="text-[11px] hidden sm:inline">
              💡 Sichqoncha / barmogʻingiz bilan burang va kattalashtiring
            </span>
          </div>

          {/* 3D WebGL Canvas Container */}
          <div 
            ref={containerRef} 
            className="w-full h-[400px] sm:h-[480px] cursor-grab active:cursor-grabbing relative bg-gradient-to-b from-slate-100 to-slate-200"
          >
            {/* Overlay stage badge on canvas */}
            <div className="absolute top-4 left-4 z-10 bg-[#0F172A]/85 backdrop-blur-xs text-white px-3.5 py-2 rounded-lg border border-slate-700 shadow-md">
              <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                Hozirgi Bosqich
              </span>
              <p className="font-bold text-sm text-white">{activeStage.name}</p>
              <span className="text-[11px] text-slate-300">{activeStage.dayRange} ({Math.round(progress)}% oʻsish)</span>
            </div>

            {/* Quick Camera Reset icon */}
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs p-1 rounded-md border border-[#CBD5E1] shadow-xs">
              <button
                onClick={() => {
                  rotationTarget.current = { x: 0.2, y: -0.4 };
                  if (cameraRef.current) cameraRef.current.position.z = 11;
                }}
                className="p-1.5 text-[#0F172A] hover:bg-slate-100 rounded text-xs font-semibold flex items-center gap-1"
                title="Kamerani dastlabki holatga qaytarish"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[10px]">360° Koʻrinish</span>
              </button>
            </div>
          </div>

          {/* Interactive Timeline Slider */}
          <div className="p-4 bg-white border-t border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#0F172A]">
              <span>Rivojlanish vaqti (Kunlar & Foiz)</span>
              <span className="text-[#3B82F6] font-bold">{Math.round(progress)}% ({Math.round((progress / 100) * 90)} kun)</span>
            </div>

            <input 
              type="range" 
              min="0" 
              max="100" 
              step="0.5" 
              value={progress}
              onChange={(e) => {
                setProgress(parseFloat(e.target.value));
                setIsPlaying(false); // pause on user scrub
              }}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
            />

            {/* Stage Quick Jump Buttons */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {STAGES.map((stg, i) => (
                <button
                  key={stg.stage}
                  onClick={() => jumpToStage(i)}
                  className={`p-2 rounded text-left transition-all ${
                    currentStageIdx === i 
                      ? 'bg-[#0F172A] text-white shadow-xs font-bold' 
                      : 'bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100 border border-[#E2E8F0]'
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-wider truncate">{stg.dayRange}</span>
                  <span className="block text-xs truncate">{stg.name.split('.')[1]}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Agronomical Stage Guide (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#E2E8F0]">
              <span className="text-[10px] uppercase font-bold text-[#3B82F6] tracking-wider block">
                Agro-Tahlil & Tavsiya
              </span>
              <h3 className="font-bold text-base text-[#0F172A] mt-0.5">{activeStage.name}</h3>
              <p className="text-xs text-[#64748B]">{activeStage.subname}</p>
            </div>

            <p className="text-xs text-[#334155] leading-relaxed">
              {activeStage.description}
            </p>

            {/* Parameter Cards */}
            <div className="space-y-2.5 pt-1">
              <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex items-start gap-3">
                <Thermometer className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Optimal Harorat</span>
                  <p className="text-xs font-semibold text-[#0F172A]">{activeStage.temp}</p>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex items-start gap-3">
                <Droplets className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Suv va Sugʻorish</span>
                  <p className="text-xs font-semibold text-[#0F172A]">{activeStage.waterNeed}</p>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex items-start gap-3">
                <Layers className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Oʻgʻitlash Meʼyori</span>
                  <p className="text-xs font-semibold text-[#0F172A]">{activeStage.fertilizer}</p>
                </div>
              </div>
            </div>

            {/* Yozyovon Local Agro Advice Box */}
            <div className="p-3.5 bg-amber-50 rounded-md border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Yozyovon Agro-Tavsiyasi:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {activeStage.agroAdvice}
              </p>
            </div>

          </div>

          {/* Quick Stats Summary */}
          <div className="bg-[#0F172A] text-white p-5 rounded-lg border border-slate-800 shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
              Yozyovon Tumani Makka Statistika
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-800/80 rounded border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Oʻrtacha Hosildorlik</span>
                <strong className="text-amber-400 text-sm">75-90 s/ga</strong>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Sugʻorish Usuli</span>
                <strong className="text-blue-400 text-sm">Egatlab / Tomchilatib</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
