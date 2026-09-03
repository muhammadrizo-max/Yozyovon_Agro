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
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeAgroImage } from '../utils/aiVisionAnalyzer';
import { AIScan } from '../types';

export const AIScanner: React.FC = () => {
  const { addAIScan, aiScans, currentUser } = useApp();

  // Active Modes: 'camera' (Live Camera) | 'upload' (File upload) - Samples removed per user request
  const [inputMode, setInputMode] = useState<'camera' | 'upload'>('camera');
  const [activeSubTab, setActiveSubTab] = useState<'scanner' | 'history'>('scanner');

  // Fullscreen state: auto-enabled on mobile / phone
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Facing mode: 'environment' (orqaga qaragan asosiy kamera) | 'user' (old kamera)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Camera States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermissionState, setCameraPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('checking');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Current analysis & image
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedTargetType, setSelectedTargetType] = useState<'limon' | 'boshqa_ekin' | 'chorva'>('limon');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<AIScan | null>(null);
  const [justSavedNotification, setJustSavedNotification] = useState(false);

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

    // Stop any previously existing stream
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
          // Fallback if device doesn't support specific facingMode
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        }

        // Check if session became stale while waiting for getUserMedia
        if (!isMountedRef.current || startCameraSessionIdRef.current !== currentSessionId) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        mediaStreamRef.current = stream;
        setIsCameraActive(true);
        setCameraPermissionState('granted');

        // Immediately attach to video element if ready
        attachStreamToVideos(stream);
      } else {
        setCameraPermissionState('denied');
        setCameraError("Kamera qurilmasi ushbu brauzerda qoʻllab-quvvatlanmadi yoki ruxsat yoʻq.");
      }
    } catch (err: any) {
      if (startCameraSessionIdRef.current === currentSessionId) {
        console.warn("Camera access note:", err?.message || err);
        setCameraPermissionState('denied');
        setCameraError("Kameraga ruxsat berilmadi yoki kamera band. Iltimos, brauzeringizda kameraga ruxsat bering yoki 'Fayl Yuklash' orqali rasm yuboring.");
        setIsCameraActive(false);
      }
    }
  };

  // Toggle Camera Facing Mode (old / orqa kamera)
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Stop Camera Stream
  const stopCamera = () => {
    startCameraSessionIdRef.current++;
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    [videoRef.current, fullscreenVideoRef.current].forEach(vEl => {
      if (vEl) {
        try {
          vEl.pause();
        } catch (e) {}
        vEl.srcObject = null;
      }
    });
    setIsCameraActive(false);
  };

  // Re-attach video stream if camera active state or fullscreen mode changes
  useEffect(() => {
    if (isCameraActive && mediaStreamRef.current) {
      attachStreamToVideos(mediaStreamRef.current);
    }
  }, [isCameraActive, isFullscreen]);

  // Initialize camera when entering camera mode
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

    let snapshotUrl = '';

    // If real video is playing, capture actual frame from active video
    const activeVideo = (isFullscreen && fullscreenVideoRef.current) ? fullscreenVideoRef.current : videoRef.current;

    if (activeVideo && isCameraActive && canvasRef.current) {
      const video = activeVideo;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        snapshotUrl = canvas.toDataURL('image/jpeg', 0.88);
      }
    }

    if (!snapshotUrl) {
      setIsScanning(false);
      setCameraError("Kameradan tasvir olinmadi. Iltimos, kameraga ruxsat bering yoki fayl yuklash rejimidan foydalaning.");
      return;
    }

    setCurrentImage(snapshotUrl);

    // Real-time AI Analysis process
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

      // Perform real pixel & spectral vision analysis
      const analysis = await analyzeAgroImage(snapshotUrl, selectedTargetType);

      const newScan = addAIScan({
        mfyId: currentUser.mfyId,
        imageUrl: snapshotUrl,
        targetType: selectedTargetType,
        diseaseName: analysis.diseaseName,
        confidence: analysis.confidence,
        severity: analysis.severity,
        recommendations: analysis.recommendations,
        medicines: analysis.medicines,
        reportedToGov: analysis.severity === 'high'
      });

      setScanResult(newScan);
      setLiveCapturedList(prev => [newScan, ...prev]);
      setIsScanning(false);
      setJustSavedNotification(true);
    }, 900);
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
  const runScan = (imageUrl: string, targetType: 'limon' | 'boshqa_ekin' | 'chorva') => {
    setIsScanning(true);
    setScanProgress(15);
    setScanResult(null);
    setJustSavedNotification(false);

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

      // Real dynamic image analysis
      const analysis = await analyzeAgroImage(imageUrl, targetType);

      const newScan = addAIScan({
        mfyId: currentUser.mfyId,
        imageUrl: imageUrl,
        targetType: targetType,
        diseaseName: analysis.diseaseName,
        confidence: analysis.confidence,
        severity: analysis.severity,
        recommendations: analysis.recommendations,
        medicines: analysis.medicines,
        reportedToGov: analysis.severity === 'high'
      });

      setScanResult(newScan);
      setLiveCapturedList(prev => [newScan, ...prev]);
      setIsScanning(false);
      setJustSavedNotification(true);
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
            <span>Skaner Tarixi ({aiScans.length})</span>
          </button>
        </div>

        {/* Input Mode Selector: Camera vs Upload only */}
        {activeSubTab === 'scanner' && (
          <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 p-1 rounded-md text-xs">
            <button
              onClick={() => setInputMode('camera')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                inputMode === 'camera' 
                  ? 'bg-[#3B82F6] text-white shadow-xs font-bold' 
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Jonli Skaner</span>
            </button>

            <button
              onClick={() => setInputMode('upload')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                inputMode === 'upload' 
                  ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs font-bold' 
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Fayl Yuklash</span>
            </button>
          </div>
        )}
      </div>

      {activeSubTab === 'scanner' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Real-Time Camera / File Viewport (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isCameraActive ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#0F172A] dark:text-white">
                  {inputMode === 'camera' ? "Jonli Kamera Skaneri" : "Rasm Yuklab Tahlil Qilish"}
                </h3>
              </div>

              {/* Target Type selector and Fullscreen toggle */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 p-0.5 rounded text-xs">
                  <button
                    onClick={() => setSelectedTargetType('limon')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${selectedTargetType === 'limon' ? 'bg-[#0F172A] dark:bg-blue-600 text-white' : 'text-[#64748B] dark:text-slate-400'}`}
                  >
                    🍋 Limon
                  </button>
                  <button
                    onClick={() => setSelectedTargetType('boshqa_ekin')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${selectedTargetType === 'boshqa_ekin' ? 'bg-[#0F172A] dark:bg-blue-600 text-white' : 'text-[#64748B] dark:text-slate-400'}`}
                  >
                    🌾 Boshqa Ekin
                  </button>
                  <button
                    onClick={() => setSelectedTargetType('chorva')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${selectedTargetType === 'chorva' ? 'bg-[#0F172A] dark:bg-blue-600 text-white' : 'text-[#64748B] dark:text-slate-400'}`}
                  >
                    🐄 Chorva
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
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-dashed border-emerald-400/70 rounded-lg flex items-center justify-center">
                          <Crosshair className="w-6 h-6 text-emerald-400 animate-pulse" />
                        </div>
                      </div>

                      {/* Bottom Camera Action Bar */}
                      <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-30 pointer-events-auto">
                        <div className="bg-black/70 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>Jonli Kamera Faol</span>
                        </div>

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
                    /* Clean No-Permission UI state (No fake simulation photos) */
                    <div className="text-center p-6 space-y-4 max-w-md mx-auto">
                      <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center mx-auto">
                        <VideoOff className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">
                          Kameraga Ruxsat Berilmagan yoki Kamera Faol Emas
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Haqiqiy jonli skanerlash uchun brauzeringizda kameraga ruxsat bering yoki "Fayl Yuklash" orqali rasmni tahlil qiling.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={startCamera}
                          className="px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-md text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Kamerani Qayta Ulash</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputMode('upload')}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Fayl Yuklashga Oʻtish</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {cameraError && (
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded border border-amber-200 dark:border-amber-800">
                    ℹ️ {cameraError}
                  </p>
                )}
              </div>
            )}

            {/* 2. FILE UPLOAD MODE VIEWPORT */}
            {inputMode === 'upload' && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full h-80 rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4 group ${
                    currentImage 
                      ? 'border-[#3B82F6] bg-slate-950' 
                      : 'border-[#CBD5E1] dark:border-slate-700 hover:border-[#3B82F6] bg-[#F8FAFC] dark:bg-slate-800/60 hover:bg-blue-50/20'
                  }`}
                >
                  {currentImage ? (
                    <img 
                      src={currentImage} 
                      alt="Tanlangan rasm" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="w-14 h-14 rounded-md bg-[#F1F5F9] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#3B82F6] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#0F172A] dark:text-white">
                          Dala, koʻchat yoki kasallangan barg rasmini yuklang
                        </p>
                        <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
                          PNG, JPG yoki WEBP fayllarni tanlang yoki sudrab olib keling
                        </p>
                      </div>
                      <span className="inline-block px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white rounded-md text-xs font-semibold shadow-xs">
                        Faylni tanlash
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Scanning Progress Bar */}
            {isScanning && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold text-[#0F172A] dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#3B82F6]" />
                    <span>Gemini Agro Vision neyron tarmogʻi tahlil qilmoqda...</span>
                  </span>
                  <span className="text-[#3B82F6]">{scanProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#3B82F6] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

          </div>

          {/* Right Column: AI Diagnosis Results & Sequential Snapshots Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Active Diagnosis Card */}
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-4">
              <div className="pb-3 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Diagnostika Natijasi</span>
                </span>
                {scanResult && (
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    scanResult.severity === 'high' 
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900' 
                      : scanResult.severity === 'medium'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                  }`}>
                    {scanResult.severity === 'high' ? 'Xavf Yuqori' : scanResult.severity === 'medium' ? 'Nazoratda' : 'Sogʻlom'}
                  </span>
                )}
              </div>

              {scanResult ? (
                <div className="space-y-4">
                  {/* Diagnosis Header */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-slate-400 tracking-wider block">
                      Aniqlangan Holat / Kasallik:
                    </span>
                    <h4 className="text-lg font-bold text-[#0F172A] dark:text-white mt-0.5">
                      {scanResult.diseaseName}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-[#64748B] dark:text-slate-400">
                      <span>Ishonchlilik: <strong className="text-[#0F172A] dark:text-white">{scanResult.confidence.toFixed(1)}%</strong></span>
                      <span>•</span>
                      <span>Toifa: <strong className="text-[#0F172A] dark:text-white capitalize">{scanResult.targetType}</strong></span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-3.5 bg-[#F8FAFC] dark:bg-slate-800/80 rounded-md border border-[#E2E8F0] dark:border-slate-700 space-y-1.5">
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Agrotexnik Tavsiya:</span>
                    </span>
                    <p className="text-xs text-[#334155] dark:text-slate-300 leading-relaxed">
                      {scanResult.recommendations}
                    </p>
                  </div>

                  {/* Medicines Prescription */}
                  <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-900 space-y-1.5">
                    <span className="text-xs font-bold text-blue-950 dark:text-blue-300 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>Tavsiya Etilgan Dori & Doza:</span>
                    </span>
                    <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed font-medium">
                      {scanResult.medicines}
                    </p>
                  </div>

                  {justSavedNotification && (
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Natija shaxsiy profilingiz va skaner tarixiga avtomatik saqlandi!</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 space-y-2 text-[#64748B] dark:text-slate-400">
                  <ScanLine className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-xs font-medium">
                    Kamerani ekin yoki chorvaga qarating va <br />
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
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">AI Tahlillar Tarixi</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400">Oldin oʻtkazilgan barcha skanerlashlar va berilgan tavsiyalar</p>
            </div>
            <span className="text-xs font-semibold text-[#0F172A] dark:text-white bg-[#F1F5F9] dark:bg-slate-800 px-3 py-1 rounded">
              Jami: {aiScans.length} ta skaner
            </span>
          </div>

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
                    <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">{scan.diseaseName}</h4>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                      Ishonchlilik: {scan.confidence}% • Sana: {scan.scannedAt}
                    </p>
                    <p className="text-xs text-[#334155] dark:text-slate-300 mt-1 line-clamp-1">{scan.medicines}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
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
                </div>
              </div>
            ))}
          </div>
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

            {/* Target Mode Selector in Fullscreen */}
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/20 p-0.5 rounded-full text-[11px]">
              <button
                onClick={() => setSelectedTargetType('limon')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                  selectedTargetType === 'limon' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-white/80'
                }`}
              >
                🍋 Limon
              </button>
              <button
                onClick={() => setSelectedTargetType('boshqa_ekin')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                  selectedTargetType === 'boshqa_ekin' ? 'bg-blue-500 text-white shadow-xs' : 'text-white/80'
                }`}
              >
                🌾 Ekin
              </button>
              <button
                onClick={() => setSelectedTargetType('chorva')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                  selectedTargetType === 'chorva' ? 'bg-emerald-500 text-white shadow-xs' : 'text-white/80'
                }`}
              >
                🐄 Chorva
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
                    <span className="absolute -bottom-7 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-emerald-300 font-medium tracking-wide border border-emerald-400/30">
                      Kamerani kasallangan barg yoki ekinga qarating
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

              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Aniqlangan holat:</span>
                  <h3 className="text-base font-bold text-emerald-400">{scanResult.diseaseName}</h3>
                  <p className="text-[11px] text-slate-300">Ishonchlilik: {scanResult.confidence.toFixed(1)}%</p>
                </div>

                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 space-y-1">
                  <strong className="text-emerald-300 block">Agrotexnik Tavsiya:</strong>
                  <p className="text-slate-200 leading-relaxed">{scanResult.recommendations}</p>
                </div>

                <div className="p-3 bg-blue-950/60 rounded-lg border border-blue-800 space-y-1">
                  <strong className="text-blue-300 block">Tavsiya Etilgan Dori & Doza:</strong>
                  <p className="text-blue-100 leading-relaxed font-semibold">{scanResult.medicines}</p>
                </div>

                <button
                  onClick={() => setScanResult(null)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold text-xs"
                >
                  ✓ Tushunarli, Davom Etish
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
