import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  ScanLine, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Pill, 
  History, 
  ArrowRight, 
  RefreshCw, 
  Share2, 
  ShieldAlert, 
  Check, 
  Leaf,
  Clock,
  ExternalLink,
  Video,
  VideoOff,
  Crosshair,
  Layers,
  FileSpreadsheet,
  Trash2,
  Maximize2,
  Minimize2,
  RotateCw,
  X,
  Sprout,
  ShieldCheck,
  Info,
  ShieldX,
  AlertOctagon,
  Globe,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeAgroImage, AnalysisResult } from '../utils/aiVisionAnalyzer';
import { AIScan, DetectedPlantPart } from '../types';

export const AIScanner: React.FC = () => {
  const { addAIScan, deleteAIScan, clearAIScans, aiScans, currentUser, govAgroDiseases } = useApp();

  // Active Modes: 'camera' (Live Camera) | 'upload' (File upload)
  const [inputMode, setInputMode] = useState<'camera' | 'upload'>('camera');
  const [activeSubTab, setActiveSubTab] = useState<'scanner' | 'history'>('scanner');

  // Fullscreen state: auto-enabled on mobile / phone
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Facing mode: 'environment' (orqa kamera) | 'user' (old kamera)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Camera States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermissionState, setCameraPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('checking');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Current analysis & image (FAQAT O'SIMLIK VA KO'CHATLAR)
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedTargetType, setSelectedTargetType] = useState<'limon' | 'sabzavot' | 'meva' | 'osimlik'>('limon');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<AIScan | null>(null);
  const [justSavedNotification, setJustSavedNotification] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  // Sequenced captured results from real-time scanning
  const [liveCapturedList, setLiveCapturedList] = useState<AIScan[]>([]);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMountedRef = useRef(true);
  const startCameraSessionIdRef = useRef(0);

  // Helper to attach stream to both video elements safely
  const attachStreamToVideos = (stream: MediaStream) => {
    [videoRef.current, fullscreenVideoRef.current].forEach(vEl => {
      if (vEl) {
        if (vEl.srcObject !== stream) {
          vEl.srcObject = stream;
        }
        vEl.play().catch(() => {});
      }
    });
  };

  // Auto-detect mobile screen on mount for full screen mode
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsFullscreen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Robust Start Camera Stream
  const startCamera = async (overrideFacing?: 'environment' | 'user') => {
    setCameraError(null);
    setCameraPermissionState('checking');
    const currentSessionId = ++startCameraSessionIdRef.current;
    const targetMode = overrideFacing || facingMode;

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: targetMode },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          });
        } catch (constraintErr) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        }

        if (!isMountedRef.current || startCameraSessionIdRef.current !== currentSessionId) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        mediaStreamRef.current = stream;
        setIsCameraActive(true);
        setCameraPermissionState('granted');
        attachStreamToVideos(stream);
      } else {
        setCameraPermissionState('denied');
        setCameraError("Kamera qurilmasi ushbu brauzerda qoʻllab-quvvatlanmadi yoki ruxsat yoʻq.");
      }
    } catch (err: any) {
      if (!isMountedRef.current || startCameraSessionIdRef.current !== currentSessionId) return;
      setIsCameraActive(false);
      setCameraPermissionState('denied');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError("Kameradan foydalanish ruxsati berilmadi. Iltimos, brauzer sozlamalarida kameraga ruxsat bering.");
      } else {
        setCameraError("Kamera ochilmadi: " + (err.message || "nomaʼlum xatolik"));
      }
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    startCameraSessionIdRef.current++;
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Toggle Front/Back camera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (inputMode === 'camera' && activeSubTab === 'scanner') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      isMountedRef.current = false;
      stopCamera();
    };
  }, [inputMode, activeSubTab]);

  // Capture Snapshot from Live Video
  const captureSnapshot = () => {
    setIsScanning(true);
    setScanProgress(20);
    setJustSavedNotification(false);
    setSelectedPartId(null);

    let snapshotUrl = '';
    const activeVideo = (isFullscreen && fullscreenVideoRef.current) ? fullscreenVideoRef.current : videoRef.current;

    if (activeVideo && isCameraActive && canvasRef.current) {
      const video = activeVideo;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        snapshotUrl = canvas.toDataURL('image/jpeg', 0.90);
      }
    }

    if (!snapshotUrl) {
      setIsScanning(false);
      setCameraError("Kameradan tasvir olinmadi. Iltimos, kameraga ruxsat bering yoki fayl yuklash rejimidan foydalaning.");
      return;
    }

    setCurrentImage(snapshotUrl);

    // AI Analysis process
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(async () => {
      clearInterval(interval);
      setScanProgress(100);

      // 1. O'simlik/ko'chat tahlili, hayvonlarni filtrlash va davlat bazasi bilan solishtirish
      const analysis: AnalysisResult = await analyzeAgroImage(snapshotUrl, selectedTargetType, govAgroDiseases);

      // Tahlil muvaffaqiyatli yakunlanganda tebranish (Haptic feedback)
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([30, 40, 30]);
        } catch {
          // ignore
        }
      }

      const newScan: AIScan = addAIScan({
        mfyId: currentUser.mfyId,
        imageUrl: snapshotUrl,
        targetType: selectedTargetType,
        detectedCategory: analysis.detectedCategory,
        detectedPlantName: analysis.detectedPlantName,
        isAutoCorrected: analysis.isAutoCorrected,
        autoCorrectionNote: analysis.autoCorrectionNote,
        internetGroundingUsed: analysis.internetGroundingUsed,
        internetSources: analysis.internetSources,
        diseaseName: analysis.diseaseName,
        confidence: analysis.confidence,
        severity: analysis.severity,
        recommendations: analysis.recommendations,
        medicines: analysis.medicines,
        reportedToGov: analysis.severity === 'high' && !analysis.isAnimalOrNonPlant,
        isAnimalOrNonPlant: analysis.isAnimalOrNonPlant,
        animalWarningMessage: analysis.animalWarningMessage,
        detectedParts: analysis.detectedParts,
        matchedGovDisease: analysis.matchedGovDisease,
        officialGovNotice: analysis.officialGovNotice,
        analysisSummary: analysis.analysisSummary,
        source: analysis.source
      });

      setScanResult(newScan);
      if (!analysis.isAnimalOrNonPlant) {
        setLiveCapturedList(prev => [newScan, ...prev]);
        setJustSavedNotification(true);
      }
      setIsScanning(false);
    }, 800);
  };

  // Trigger file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        setCurrentImage(resultUrl);
        runScan(resultUrl, selectedTargetType);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Scan with interactive animation for uploaded file
  const runScan = (imageUrl: string, targetType: 'limon' | 'sabzavot' | 'meva' | 'osimlik') => {
    setIsScanning(true);
    setScanProgress(15);
    setScanResult(null);
    setJustSavedNotification(false);
    setSelectedPartId(null);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 20;
      });
    }, 150);

    setTimeout(async () => {
      clearInterval(interval);
      setScanProgress(100);

      const analysis: AnalysisResult = await analyzeAgroImage(imageUrl, targetType, govAgroDiseases);

      // Tahlil yakunlanganda tebranish
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([30, 40, 30]);
        } catch {
          // ignore
        }
      }

      const newScan: AIScan = addAIScan({
        mfyId: currentUser.mfyId,
        imageUrl: imageUrl,
        targetType: targetType,
        detectedCategory: analysis.detectedCategory,
        detectedPlantName: analysis.detectedPlantName,
        isAutoCorrected: analysis.isAutoCorrected,
        autoCorrectionNote: analysis.autoCorrectionNote,
        internetGroundingUsed: analysis.internetGroundingUsed,
        internetSources: analysis.internetSources,
        diseaseName: analysis.diseaseName,
        confidence: analysis.confidence,
        severity: analysis.severity,
        recommendations: analysis.recommendations,
        medicines: analysis.medicines,
        reportedToGov: analysis.severity === 'high' && !analysis.isAnimalOrNonPlant,
        isAnimalOrNonPlant: analysis.isAnimalOrNonPlant,
        animalWarningMessage: analysis.animalWarningMessage,
        detectedParts: analysis.detectedParts,
        matchedGovDisease: analysis.matchedGovDisease,
        officialGovNotice: analysis.officialGovNotice,
        analysisSummary: analysis.analysisSummary,
        source: analysis.source
      });

      setScanResult(newScan);
      if (!analysis.isAnimalOrNonPlant) {
        setLiveCapturedList(prev => [newScan, ...prev]);
        setJustSavedNotification(true);
      }
      setIsScanning(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" id="ai-scanner-section">
      
      {/* Hidden off-screen canvas for capturing frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Sub Tabs: Skaner vs Tarix */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('scanner')}
            className={`px-3.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'scanner' 
                ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs' 
                : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-slate-800'
            }`}
          >
            <ScanLine className="w-4 h-4 text-[#3B82F6] dark:text-blue-300" />
            <span>AI Diagnostika Skaneri</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'history' 
                ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs' 
                : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Tahlillar Tarixi ({aiScans.length})</span>
          </button>
        </div>

        {/* Plant Only Policy Badge */}
        <div className="flex items-center gap-2 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">Faqat Oʻsimlik & Koʻchatlar (Chorva taqiqlangan)</span>
        </div>
      </div>

      {activeSubTab === 'scanner' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Camera / Upload Control (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Mode Selector Tabs (Live Camera vs Upload) */}
            <div className="flex rounded-lg p-1 bg-[#F1F5F9] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700">
              <button
                onClick={() => {
                  setInputMode('camera');
                  setCurrentImage(null);
                  setScanResult(null);
                }}
                className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  inputMode === 'camera' 
                    ? 'bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white shadow-xs' 
                    : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A]'
                }`}
              >
                <Camera className="w-4 h-4 text-[#3B82F6]" />
                <span>Jonli Kamera</span>
              </button>

              <button
                onClick={() => {
                  setInputMode('upload');
                  stopCamera();
                }}
                className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  inputMode === 'upload' 
                    ? 'bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white shadow-xs' 
                    : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A]'
                }`}
              >
                <Upload className="w-4 h-4 text-[#3B82F6]" />
                <span>Rasm Yuklash</span>
              </button>
            </div>

            {/* Viewport Frame */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isCameraActive ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-[#0F172A] dark:text-white">
                    {inputMode === 'camera' ? "Jonli Kamera Skaneri" : "Rasm Yuklab Tahlil Qilish"}
                  </h3>
                </div>

                {/* Target Type selector: FAQAT LIMON, SABZAVOT, MEVA, OSIMLIK (KO'CHAT VA BARGLAR UCHUN) */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 p-0.5 rounded text-xs flex-wrap">
                    <button
                      onClick={() => setSelectedTargetType('limon')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${selectedTargetType === 'limon' ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs' : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A]'}`}
                      id="target-type-limon"
                    >
                      🍋 Limon
                    </button>
                    <button
                      onClick={() => setSelectedTargetType('sabzavot')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${selectedTargetType === 'sabzavot' ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs' : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A]'}`}
                      id="target-type-sabzavot"
                    >
                      🥦 Sabzavot
                    </button>
                    <button
                      onClick={() => setSelectedTargetType('meva')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${selectedTargetType === 'meva' ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs' : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A]'}`}
                      id="target-type-meva"
                    >
                      🍎 Meva
                    </button>
                    <button
                      onClick={() => setSelectedTargetType('osimlik')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${selectedTargetType === 'osimlik' ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs' : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A]'}`}
                      id="target-type-osimlik"
                    >
                      🌿 Oʻsimlik (koʻchat & barg)
                    </button>
                  </div>

                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="px-2.5 py-1.5 rounded bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-white hover:bg-blue-50 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    title="Toʻliq ekranga oʻtish"
                    id="fullscreen-toggle-btn"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span className="hidden sm:inline">Toʻliq ekran</span>
                  </button>
                </div>
              </div>

              {/* 1. LIVE CAMERA MODE VIEWPORT */}
              {inputMode === 'camera' && (
                <div className="space-y-3">
                  <div className="relative w-full h-80 sm:h-96 rounded-lg bg-slate-950 overflow-hidden border-2 border-slate-700 shadow-inner flex items-center justify-center">
                    
                    {/* Real Live Video Feed */}
                    {isCameraActive ? (
                      <>
                        <video
                          ref={(el) => {
                            videoRef.current = el;
                            if (el && mediaStreamRef.current && el.srcObject !== mediaStreamRef.current) {
                              el.srcObject = mediaStreamRef.current;
                              el.play().catch(() => {});
                            }
                          }}
                          autoPlay
                          playsInline
                          muted
                          onLoadedMetadata={() => {
                            videoRef.current?.play().catch(() => {});
                          }}
                          className="w-full h-full object-cover"
                        />

                        {/* Laser HUD Frame */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="w-full h-0.5 bg-[#3B82F6] shadow-lg shadow-blue-500/80 animate-bounce duration-1000 opacity-90"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-emerald-400/80 rounded-xl flex items-center justify-center">
                            <Crosshair className="w-8 h-8 text-emerald-400 animate-pulse" />
                            <span className="absolute -bottom-6 bg-black/70 px-2.5 py-0.5 rounded-full text-[10px] text-emerald-300 font-semibold whitespace-nowrap">
                              🍃 Barg, meva yoki shoxni toʻgʻrilang
                            </span>
                          </div>
                        </div>

                        {/* Bottom Camera Action Bar */}
                        <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-30 pointer-events-auto">
                          <button
                            onClick={toggleFacingMode}
                            className="bg-black/70 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5"
                            title="Kamerani almashtirish"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Almashtirish</span>
                          </button>

                          {/* Big Shutter Button */}
                          <button
                            onClick={captureSnapshot}
                            disabled={isScanning}
                            className="px-5 py-2.5 bg-[#3B82F6] hover:bg-blue-600 active:scale-95 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xl flex items-center gap-2 border-2 border-white/80 transition-all"
                          >
                            <Camera className="w-4 h-4" />
                            <span>{isScanning ? "Tahlil qilinmoqda..." : "Suratga Olish & Tahlil"}</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-4 max-w-md mx-auto">
                        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center mx-auto">
                          <VideoOff className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-white">Kamera Ulanmadi</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {cameraError || "Jonli diagnostika qilish uchun qurilma kamerasiga ruxsat bering."}
                          </p>
                        </div>
                        <button
                          onClick={() => startCamera()}
                          className="px-5 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-xs rounded-md shadow-md flex items-center gap-2 mx-auto transition-all"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Kamerani Yoqish</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. FILE UPLOAD MODE */}
              {inputMode === 'upload' && (
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#CBD5E1] dark:border-slate-700 hover:border-[#3B82F6] bg-[#F8FAFC] dark:bg-slate-800/60 rounded-lg p-8 text-center cursor-pointer transition-all group"
                  >
                    <Upload className="w-10 h-10 text-[#64748B] dark:text-slate-400 group-hover:text-[#3B82F6] mx-auto transition-colors" />
                    <p className="font-bold text-xs text-[#0F172A] dark:text-white mt-2">
                      Oʻsimlik yoki koʻchat suratini yuklang
                    </p>
                    <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1">
                      PNG, JPG, JPEG (Kasal barg, meva yoki shox surati)
                    </p>
                  </div>
                </div>
              )}

              {/* Policy Note on Non-Plant Objects */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Eslatma:</strong> AI Skaner faqat koʻchat, nihol, daraxt, meva va barglarni tekshiradi. Chorva mollari (sigir, qoʻy va b.) tasvirlansa, tizim tahlilni toʻxtatadi va ogohlantiradi.
                </span>
              </div>
            </div>

            {/* SCANNING PROGRESS BAR */}
            {isScanning && (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-2 animate-pulse">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F172A] dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#3B82F6] animate-spin" />
                    AI Vision koʻchat patologiyasini tahlil qilmoqda...
                  </span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#F1F5F9] dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-200"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Snapshot Image Preview with Plant Pathology Bounding Boxes Overlay */}
            {currentImage && !isScanning && (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Tahlil Qilingan Tasvir va Patologiya Hududlari:</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {scanResult?.detectedParts?.length || 0} ta kasallangan qism ajratildi
                  </span>
                </div>

                <div className="relative w-full h-72 sm:h-80 rounded-lg overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-700">
                  <img
                    src={currentImage}
                    alt="Agro scan analysis"
                    className="w-full h-full object-contain"
                  />

                  {/* ── Bounding Boxes (Kasallangan Barg, Meva va Shoxlarni Alohida Belgilash) ── */}
                  {!scanResult?.isAnimalOrNonPlant && scanResult?.detectedParts?.map(part => {
                    const isSelected = selectedPartId === part.id;
                    const borderColor = 
                      part.partType === 'leaf' ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' :
                      part.partType === 'fruit' ? 'border-amber-400 bg-amber-500/20 text-amber-300' :
                      'border-rose-500 bg-rose-500/20 text-rose-300';

                    return (
                      <div
                        key={part.id}
                        onClick={() => setSelectedPartId(part.id)}
                        style={{
                          top: `${part.box.top}%`,
                          left: `${part.box.left}%`,
                          width: `${part.box.width}%`,
                          height: `${part.box.height}%`
                        }}
                        className={`absolute border-2 rounded-lg cursor-pointer transition-all ${borderColor} ${
                          isSelected ? 'ring-4 ring-white shadow-xl scale-[1.02] z-30' : 'hover:opacity-100 opacity-90'
                        }`}
                      >
                        <span className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-md ${
                          part.partType === 'leaf' ? 'bg-emerald-600 text-white' :
                          part.partType === 'fruit' ? 'bg-amber-600 text-white' :
                          'bg-rose-600 text-white'
                        }`}>
                          {part.partType === 'leaf' && '🍃 Barg'}
                          {part.partType === 'fruit' && '🍋 Meva'}
                          {part.partType === 'branch' && '🪵 Shox/Poya'}
                          {' • '}{Math.round(part.confidence)}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Part Filter Tags below image */}
                {scanResult?.detectedParts && scanResult.detectedParts.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-500">Ajratilgan aʼzolar:</span>
                    {scanResult.detectedParts.map(part => (
                      <button
                        key={part.id}
                        onClick={() => setSelectedPartId(part.id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedPartId === part.id
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {part.partName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Detailed Diagnosis & Prescriptions (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Diagnosis Result Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                  <h3 className="font-bold text-sm uppercase tracking-wider text-[#0F172A] dark:text-white">
                    Tahlil Natijasi
                  </h3>
                </div>
                {scanResult && (
                  <span className="text-[11px] font-mono text-[#64748B] dark:text-slate-400">
                    {scanResult.scannedAt}
                  </span>
                )}
              </div>

              {/* ── AGAR CHORVA / HAYVON ANIQLANSA: QAT'IY XAVFSIZLIK OGOHLANTIRISHI ── */}
              {scanResult?.isAnimalOrNonPlant ? (
                <div className="p-5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 space-y-4 animate-scaleUp">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-rose-600 text-white rounded-xl shadow-lg shrink-0">
                      <AlertOctagon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-black text-base text-rose-900 dark:text-rose-200 leading-tight">
                        SKANER QILISH CHEKLANGAN!
                      </h4>
                      <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 font-semibold">
                        Tasvirda chorva mollari yoki hayvon aniqlandi.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-rose-200 dark:border-rose-900 text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
                    <p className="font-bold text-rose-800 dark:text-rose-300">
                      {scanResult.animalWarningMessage || "Ushbu tizim faqat oʻsimliklar, koʻchatlar, limon novdalari va ekinlarni skaner qilishga moʻljallangan!"}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Chorva va hayvonlarni parvarishlash yoki davolash uchun tuman Veterinariya xizmatiga murojaat qiling.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setScanResult(null);
                      setCurrentImage(null);
                    }}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Qayta Oʻsimlikni Skaner Qilish</span>
                  </button>
                </div>
              ) : scanResult ? (
                /* ── O'SIMLIK TASHXISI & RASMIY KO'RSATMALAR (TALAB QILINGAN KETMA-KETLIKDA) ── */
                <div className="space-y-3.5">
                  {/* 1. KICHIK BOSHLASH (Sana, Aniqlangan tur, AI Aniqlik & Gemini AI belgisi) */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          AI Tahlil Natijasi
                        </span>
                        {scanResult.source === 'gemini_vision' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            Real Gemini AI Vision
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            Yozyovon Agro Vision
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {scanResult.scannedAt}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <div className="flex items-center gap-2">
                        <Sprout className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">
                            Aniqlangan Tur:
                          </span>
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                            {scanResult.detectedPlantName || scanResult.detectedCategory?.toUpperCase() || 'Oʻsimlik'}
                          </h5>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">
                          AI Aniqlik:
                        </span>
                        <span className="text-base font-black text-blue-600 dark:text-blue-400">
                          {scanResult.confidence.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {scanResult.isAutoCorrected && (
                      <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Kategoriya toʻgʻrilandi: {scanResult.autoCorrectionNote || `AI tasvirda ${scanResult.detectedPlantName} aniqladi.`}</span>
                      </div>
                    )}
                  </div>

                  {/* 2. TAHLIL NATIJASI (Vizual Xulosa & AI Koʻrgan Belgilar) */}
                  <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950 dark:text-blue-200">
                      <Search className="w-4 h-4 text-blue-600" />
                      <span>Tahlil Natijasi (Vizual Xulosa):</span>
                    </div>
                    <p className="text-xs text-blue-900 dark:text-blue-100 leading-relaxed font-medium">
                      {scanResult.analysisSummary || "Tasvirdagi barg toʻqimalarining holati, pigmentatsiya va fotosintez faolligi sinchkovlik bilan tahlil qilindi."}
                    </p>
                  </div>

                  {/* 3. XAVFLAR VA ZARARLANGAN QISMLAR */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>Xavf Darajasi & Zararlangan Aʼzolar:</span>
                      </span>
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                        scanResult.severity === 'high' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800' :
                        scanResult.severity === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800' :
                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      }`}>
                        {scanResult.severity === 'high' ? 'Xavf: Yuqori' : scanResult.severity === 'medium' ? 'Xavf: Oʻrta' : 'Holat: Sogʻlom / Xavfsiz'}
                      </span>
                    </div>

                    {scanResult.detectedParts && scanResult.detectedParts.length > 0 && (
                      <div className="space-y-1.5">
                        {scanResult.detectedParts.map(part => {
                          const isSelected = selectedPartId === part.id;
                          return (
                            <div
                              key={part.id}
                              onClick={() => setSelectedPartId(part.id)}
                              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                                isSelected 
                                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs' 
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span>{part.partType === 'leaf' ? '🍃' : part.partType === 'fruit' ? '🍎' : '🪵'}</span>
                                  <span>{part.partName}</span>
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  part.severity === 'high' ? 'bg-rose-100 text-rose-800' :
                                  part.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                                  'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {part.severity === 'high' ? 'Zararlangan' : part.severity === 'medium' ? 'Nazoratda' : 'Sogʻlom'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                {part.symptom}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 4. KASALLIK VA PATOLOGIYA TASHXISI */}
                  <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/20 rounded-lg border border-rose-200 dark:border-rose-900/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400 block tracking-wider">
                      Tashxis Qoʻyilgan Kasallik / Patologiya:
                    </span>
                    <h4 className="font-bold text-base text-rose-950 dark:text-rose-200 leading-tight">
                      {scanResult.diseaseName}
                    </h4>
                  </div>

                  {/* 5. DORI VOSITALARI VA DOZASI */}
                  <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900 space-y-1.5">
                    <span className="text-xs font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-blue-600" />
                      <span>Tavsiya Etilgan Dori Vositalari & Dozasi:</span>
                    </span>
                    <p className="text-xs text-blue-900 dark:text-blue-100 leading-relaxed font-semibold">
                      {scanResult.medicines}
                    </p>
                  </div>

                  {/* 6. PARVARISHLASH VA AGROTEXNIK KO'RSATMALAR */}
                  <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Parvarishlash va Agrotexnik Profilaktika Koʻrsatmalari:</span>
                    </span>
                    <p className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
                      {scanResult.recommendations}
                    </p>
                  </div>

                  {justSavedNotification && (
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Natija shaxsiy profilingiz va tahlillar tarixiga saqlandi!</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 space-y-2 text-[#64748B] dark:text-slate-400">
                  <ScanLine className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-xs font-medium">
                    Kamerani oʻsimlik bargi, mevasi yoki niholiga qarating va <br />
                    <strong className="text-[#0F172A] dark:text-white">"Suratga Olish & Tahlil"</strong> tugmasini bosing
                  </p>
                </div>
              )}
            </div>

            {/* Sequential Captured Stream (Birin-ketin tahlillar paneli) */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-slate-800">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A] dark:text-white flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Kameradan Olingan Tahlillar Roʻyxati ({liveCapturedList.length})</span>
                </h4>
                {liveCapturedList.length > 0 && (
                  <button 
                    onClick={() => setLiveCapturedList([])}
                    className="text-[10px] text-[#64748B] hover:text-rose-600"
                  >
                    Tozalash
                  </button>
                )}
              </div>

              {liveCapturedList.length === 0 ? (
                <p className="text-xs text-[#94A3B8] text-center py-4">
                  Hozircha olingan suratlar yoʻq. Suratga olish bilan birin-ketin bu yerga qoʻshiladi.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {liveCapturedList.map((item, idx) => (
                    <div 
                      key={item.id || idx}
                      onClick={() => setScanResult(item)}
                      className="p-2.5 bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-md flex items-center gap-3 cursor-pointer hover:border-[#3B82F6] transition-all"
                    >
                      <div className="w-12 h-12 rounded overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                        <img 
                          src={item.imageUrl} 
                          alt="Snapshot" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-[#0F172A] dark:text-white truncate">{item.diseaseName}</p>
                        <span className="text-[10px] text-[#64748B] dark:text-slate-400 block truncate">{item.scannedAt} • {Math.round(item.confidence)}%</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                        item.severity === 'high' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        {item.severity === 'high' ? 'Xavf' : 'Sogʻlom'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* History Sub Tab */
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">AI Tahlillar Tarixi</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400">Oldin oʻtkazilgan barcha skanerlashlar va berilgan tavsiyalar</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#0F172A] dark:text-white bg-[#F1F5F9] dark:bg-slate-800 px-3 py-1 rounded">
                Jami: {aiScans.length} ta skaner
              </span>
              {aiScans.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm("Barcha tahlillar tarixini tozalamoqchimisiz?")) {
                      clearAIScans();
                      setLiveCapturedList([]);
                    }
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded border border-rose-200 dark:border-rose-900 transition-all flex items-center gap-1"
                  title="Eski tahlillar tarixini tozalash"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Tarixni tozalash</span>
                </button>
              )}
            </div>
          </div>

          {aiScans.length === 0 ? (
            <div className="text-center py-12 text-[#94A3B8]">
              <History className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs font-medium">Hozircha tahlillar tarixi mavjud emas.</p>
              <button
                onClick={() => setActiveSubTab('scanner')}
                className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
              >
                Yangi Tahlilni Boshlash
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
              {aiScans.map((scan) => (
                <div key={scan.id} className="py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-[#E2E8F0] dark:border-slate-700">
                      <img 
                        src={scan.imageUrl} 
                        alt={scan.diseaseName} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">{scan.diseaseName}</h4>
                        {scan.source === 'gemini_vision' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            Gemini AI
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                        {scan.detectedPlantName ? `${scan.detectedPlantName} • ` : ''}Ishonchlilik: {scan.confidence}% • Sana: {scan.scannedAt}
                      </p>
                      <p className="text-xs text-[#334155] dark:text-slate-300 mt-1 line-clamp-1">{scan.medicines}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      scan.severity === 'high' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                    }`}>
                      {scan.severity === 'high' ? 'Yuqori Xavf' : 'Sogʻlom / Yaxshi'}
                    </span>
                    <button
                      onClick={() => {
                        setScanResult(scan);
                        setActiveSubTab('scanner');
                      }}
                      className="px-3 py-1.5 bg-[#F8FAFC] dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white text-xs font-semibold rounded transition-colors"
                    >
                      Koʻrish
                    </button>
                    <button
                      onClick={() => deleteAIScan(scan.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-all"
                      title="Oʻchirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📱 FULL-SCREEN MOBILE / IMMERSIVE CAMERA SCANNER VIEW                      */}
      {/* ========================================================================= */}
      {isFullscreen && inputMode === 'camera' && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden" id="fullscreen-camera-scanner">
          {/* Top Bar */}
          <div className="relative z-30 p-3 pt-4 sm:p-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-wider">
                Yozyovon AI Skaner
              </span>
            </div>

            {/* Target Mode Selector in Fullscreen: FAQAT LIMON, SABZAVOT, MEVA, OSIMLIK */}
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/20 p-0.5 rounded-full text-[11px] overflow-x-auto max-w-[280px] sm:max-w-none">
              <button
                onClick={() => setSelectedTargetType('limon')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap ${
                  selectedTargetType === 'limon' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-white/80'
                }`}
              >
                🍋 Limon
              </button>
              <button
                onClick={() => setSelectedTargetType('sabzavot')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap ${
                  selectedTargetType === 'sabzavot' ? 'bg-emerald-500 text-white shadow-xs' : 'text-white/80'
                }`}
              >
                🥦 Sabzavot
              </button>
              <button
                onClick={() => setSelectedTargetType('meva')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap ${
                  selectedTargetType === 'meva' ? 'bg-rose-500 text-white shadow-xs' : 'text-white/80'
                }`}
              >
                🍎 Meva
              </button>
              <button
                onClick={() => setSelectedTargetType('osimlik')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap ${
                  selectedTargetType === 'osimlik' ? 'bg-blue-500 text-white shadow-xs' : 'text-white/80'
                }`}
              >
                🌿 Oʻsimlik
              </button>
            </div>

            {/* Exit Fullscreen button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
              title="Kichik ekranga qaytish"
              id="exit-fullscreen-btn"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Live Video Center */}
          <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
            {isCameraActive ? (
              <>
                <video
                  ref={(el) => {
                    fullscreenVideoRef.current = el;
                    if (el && mediaStreamRef.current && el.srcObject !== mediaStreamRef.current) {
                      el.srcObject = mediaStreamRef.current;
                      el.play().catch(() => {});
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={() => {
                    fullscreenVideoRef.current?.play().catch(() => {});
                  }}
                  className="w-full h-full object-cover"
                />

                {/* Laser HUD Scan Line & Target Frame */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-lg shadow-blue-500 animate-bounce duration-1000 opacity-90"></div>
                  
                  <div className="my-auto mx-auto w-64 h-64 sm:w-80 sm:h-80 border-2 border-dashed border-emerald-400/80 rounded-2xl flex items-center justify-center relative">
                    <Crosshair className="w-10 h-10 text-emerald-400 animate-pulse" />
                    <span className="absolute -bottom-7 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-emerald-300 font-medium tracking-wide border border-emerald-400/30">
                      🍃 Oʻsimlik bargi, meva yoki shoxini toʻgʻrilang
                    </span>
                  </div>

                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50"></div>
                </div>
              </>
            ) : (
              <div className="text-center p-6 space-y-4 max-w-sm mx-auto text-white">
                <VideoOff className="w-12 h-12 text-amber-400 mx-auto" />
                <h4 className="font-bold text-base">Kamera faollashtirilmoqda...</h4>
                <p className="text-xs text-white/70">
                  Kameraga ruxsat bering yoki qayta ishga tushirish tugmasini bosing.
                </p>
                <button
                  onClick={() => startCamera()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-xs flex items-center justify-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Kamerani Yoqish</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Floating Bar */}
          <div className="relative z-30 p-4 pb-8 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-center justify-around text-white">
            {/* Switch Camera (Front/Back) */}
            <button
              onClick={toggleFacingMode}
              className="p-3.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all active:scale-90"
              title="Kamerani almashtirish (Oldi / Orqasi)"
              id="switch-camera-facing-btn"
            >
              <RotateCw className="w-5 h-5 text-white" />
            </button>

            {/* Big Shutter Button */}
            <button
              onClick={captureSnapshot}
              disabled={isScanning}
              className="w-20 h-20 rounded-full border-4 border-white bg-white/30 active:scale-90 flex items-center justify-center shadow-2xl transition-all disabled:opacity-50"
              title="Suratga olish va AI tahlili"
              id="fullscreen-shutter-btn"
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-inner">
                {isScanning ? (
                  <RefreshCw className="w-7 h-7 animate-spin text-blue-600" />
                ) : (
                  <Camera className="w-7 h-7 text-blue-600" />
                )}
              </div>
            </button>

            {/* Switch to File Upload */}
            <button
              onClick={() => {
                setIsFullscreen(false);
                setInputMode('upload');
              }}
              className="p-3.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all active:scale-90"
              title="Fayl yuklashga oʻtish"
              id="fullscreen-upload-switch-btn"
            >
              <Upload className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Fullscreen Diagnosis Drawer if scanResult exists */}
          {scanResult && (
            <div className="absolute inset-x-0 bottom-0 z-40 bg-slate-900 border-t-2 border-emerald-500 rounded-t-2xl p-4 sm:p-6 text-white max-h-[75vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-sm">AI Diagnostika Natijasi</h4>
                </div>
                <button
                  onClick={() => setScanResult(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {scanResult.isAnimalOrNonPlant ? (
                <div className="mt-3 p-4 bg-rose-950/80 border-2 border-rose-500 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <AlertOctagon className="w-5 h-5" />
                    <span>SKANER QILISH CHEKLANGAN!</span>
                  </div>
                  <p className="text-xs text-rose-200">
                    {scanResult.animalWarningMessage || "Tasvirda chorva yoki hayvon aniqlandi. AI faqat oʻsimliklarni skaner qiladi."}
                  </p>
                  <button
                    onClick={() => setScanResult(null)}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs"
                  >
                    Oʻsimlikni Skaner Qilishga Qaytish
                  </button>
                </div>
              ) : (
                <div className="mt-3 space-y-3 text-xs">
                  {/* 1. KICHIK BOSHLASH */}
                  <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-700">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">AI Tahlil Natijasi</span>
                        {scanResult.source === 'gemini_vision' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/80 text-blue-200 border border-blue-700 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-blue-400" />
                            Real Gemini AI Vision
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/80 text-emerald-200 border border-emerald-700">
                            Yozyovon Agro Vision
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{scanResult.scannedAt}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <Sprout className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Aniqlangan Tur:</span>
                          <span className="font-bold text-xs text-white">
                            {scanResult.detectedPlantName || scanResult.detectedCategory?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">AI Aniqlik:</span>
                        <span className="text-sm font-black text-blue-400">{scanResult.confidence.toFixed(1)}%</span>
                      </div>
                    </div>

                    {scanResult.isAutoCorrected && (
                      <div className="pt-1 border-t border-slate-700 text-[10px] text-amber-300 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>Kategoriya toʻgʻrilandi: {scanResult.autoCorrectionNote || `AI tasvirda ${scanResult.detectedPlantName} aniqladi.`}</span>
                      </div>
                    )}
                  </div>

                  {/* 2. TAHLIL NATIJASI (Vizual Xulosa) */}
                  <div className="p-3 bg-blue-950/50 rounded-xl border border-blue-800 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-200">
                      <Search className="w-3.5 h-3.5 text-blue-400" />
                      <span>Tahlil Natijasi (Vizual Xulosa):</span>
                    </div>
                    <p className="text-[11px] text-blue-100 leading-relaxed font-medium">
                      {scanResult.analysisSummary || "Tasvirdagi oʻsimlik bargi toʻqimalari va zararlanish oʻchoqlari sinchkovlik bilan tekshirildi."}
                    </p>
                  </div>

                  {/* 3. XAVFLAR VA A'ZOLAR */}
                  <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Xavf Darajasi:</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        scanResult.severity === 'high' ? 'bg-rose-950 text-rose-300 border border-rose-700' :
                        scanResult.severity === 'medium' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      }`}>
                        {scanResult.severity === 'high' ? 'Xavf: Yuqori' : scanResult.severity === 'medium' ? 'Xavf: Oʻrta' : 'Holat: Sogʻlom'}
                      </span>
                    </div>

                    {scanResult.detectedParts && scanResult.detectedParts.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {scanResult.detectedParts.map(p => (
                          <span key={p.id} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-emerald-300">
                            {p.partName}: {p.symptom}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. KASALLIK TASHXISI */}
                  <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-800 space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-rose-400 block tracking-wider">
                      Tashxis Qoʻyilgan Kasallik / Patologiya:
                    </span>
                    <h4 className="text-sm font-bold text-rose-200">{scanResult.diseaseName}</h4>
                  </div>

                  {/* 5. DORI VOSITALARI VA DOZASI */}
                  <div className="p-3 bg-blue-950/60 rounded-xl border border-blue-800 space-y-1">
                    <span className="text-[11px] font-bold text-blue-300 flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5 text-blue-400" />
                      <span>Tavsiya Etilgan Dori & Dozasi:</span>
                    </span>
                    <p className="text-[11px] text-blue-100 leading-relaxed font-semibold">{scanResult.medicines}</p>
                  </div>

                  {/* 6. PARVARISHLASH KO'RSATMASI */}
                  <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Parvarishlash va Profilaktika:</span>
                    </span>
                    <p className="text-[11px] text-slate-200 leading-relaxed">{scanResult.recommendations}</p>
                  </div>

                  <button
                    onClick={() => setScanResult(null)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold text-xs"
                  >
                    ✓ Tushunarli, Davom Etish
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
