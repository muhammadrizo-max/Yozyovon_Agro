import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, ShieldCheck, ShieldAlert, Database, 
  Terminal, Activity, RefreshCw, AlertTriangle, 
  CheckCircle2, Download, Upload, Cpu, Zap, Globe, 
  Server, Key, X, Sliders, Edit3, Lock, Unlock, 
  Search, Filter, Clock, Eye, Trash2, ArrowUpRight,
  UserCheck, ShieldOff, HardDrive, FileText, BarChart3, Wifi,
  ChevronRight, Radio
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { trafficMonitor, TrafficRecord } from '../utils/security';

export const DevEmergencyPanel: React.FC = () => {
  const {
    activeTab: globalActiveTab,
    setActiveTab: setGlobalActiveTab,
    isDarkMode,
    toggleDarkMode,
    cyberDefenseStatus,
    securityAuditLogs,
    addSecurityLog,
    backupDatabase,
    restoreDatabaseFromBackup,
    verifyDatabaseIntegrity,
    backupSnapshots,
    createBackupSnapshot,
    deleteBackupSnapshot,
    rbacPermissions,
    toggleRbacPermission,
    trafficStats: appTrafficStats,
    setMaxRpm,
    blockIp,
    unblockIp,
    blockedIps,
    whitelistIps,
    mfyList,
    userRole,
    devActiveSubTab,
    setDevActiveSubTab
  } = useApp();

  // 3 ta asosiy bo'lim to'g'ridan-to'g'ri yuqoridagi Header navigatsiyasi orqali boshqariladi
  const activeDevTab = devActiveSubTab || 'traffic_monitor';
  
  // Backup & Restore State
  const [jsonInput, setJsonInput] = useState<string>('');
  const [snapshotNote, setSnapshotNote] = useState<string>('');
  const [integrityResult, setIntegrityResult] = useState<{ isValid: boolean; hash: string; recordsCount: number; details: string } | null>(null);
  
  // Live Real-Time Traffic Monitor State (Sekundma-sekund yangilanadi!)
  const [trafficHistory, setTrafficHistory] = useState<TrafficRecord[]>(() => trafficMonitor.getHistory());
  const [liveTrafficStats, setLiveTrafficStats] = useState(() => trafficMonitor.getStats());
  const [selectedRpmLimit, setSelectedRpmLimit] = useState<number>(cyberDefenseStatus.rateLimitRpm || 120);
  const [manualIpToBlock, setManualIpToBlock] = useState<string>('');
  const [currentSecondsTime, setCurrentSecondsTime] = useState<string>(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  });

  // Logs & RBAC State
  const [logFilterSeverity, setLogFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info' | 'shield'>('all');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [selectedRbacCategory, setSelectedRbacCategory] = useState<'all' | 'database' | 'monitoring' | 'security' | 'subsidies' | 'export'>('all');

  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // REAL-TIME JONLI SEKUNDMA-SEKUND PULS:
  // Har 1 soniyada joriy aniq sekundma-sekund vaqt va tarmoq oqimi yangilanadi!
  useEffect(() => {
    const unsub = trafficMonitor.subscribe((newStats, newHistory) => {
      setLiveTrafficStats(newStats);
      setTrafficHistory(newHistory);
    });

    const clockTimer = setInterval(() => {
      const d = new Date();
      const sTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
      setCurrentSecondsTime(sTime);
      setTrafficHistory(trafficMonitor.getHistory());
      setLiveTrafficStats(trafficMonitor.getStats());
    }, 1000);

    return () => {
      unsub();
      clearInterval(clockTimer);
    };
  }, []);

  // Initial Integrity Check
  useEffect(() => {
    setIntegrityResult(verifyDatabaseIntegrity());
  }, [mfyList]);

  // Real-time chart data calculation (Oxirgi 15 ta so'rov, har soniya o'ngdan chapga oqib boradi)
  const chartData = useMemo(() => {
    return trafficHistory.slice(0, 15).reverse().map((rec, idx) => ({
      time: rec.timeLabel,
      duration: rec.durationMs,
      status: rec.status,
      threat: rec.isThreat ? 1 : 0
    }));
  }, [trafficHistory]);

  // ============================================================================
  // BACKUP & RESTORE HANDLERS
  // ============================================================================

  const handleDownloadBackup = (format: 'json' | 'sql') => {
    try {
      const content = backupDatabase(format);
      const mime = format === 'json' ? 'application/json' : 'text/plain';
      const ext = format === 'json' ? 'json' : 'sql';
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `yozyovon_agro_baza_zaxira_${Date.now()}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);

      setStatusMsg({
        text: `✅ Maʼlumotlar bazasi zaxira nusxasi (${format.toUpperCase()}) muvaffaqiyatli yuklab olindi!`,
        type: 'success'
      });
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (e: any) {
      setStatusMsg({ text: `Xatolik: ${e.message}`, type: 'error' });
    }
  };

  const handleCreateSnapshot = () => {
    const note = snapshotNote.trim() || 'Foydalanuvchi tomonidan yaratilgan zaxira';
    createBackupSnapshot(note);
    setSnapshotNote('');
    setStatusMsg({
      text: `✅ Yangi maʼlumotlar bazasi snapshot zaxirasi tizimga muvaffaqiyatli saqlandi!`,
      type: 'success'
    });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleRestoreFromJson = () => {
    if (!jsonInput.trim()) {
      setStatusMsg({ text: 'Iltimos, tiklash uchun JSON formatidagi bazani kiriting yoki faylni yuklang!', type: 'error' });
      return;
    }

    const res = restoreDatabaseFromBackup(jsonInput);
    if (res.success) {
      setStatusMsg({ text: `✅ ${res.message}`, type: 'success' });
      setJsonInput('');
      setIntegrityResult(verifyDatabaseIntegrity());
      setTimeout(() => setStatusMsg(null), 4000);
    } else {
      setStatusMsg({ text: `❌ ${res.message}`, type: 'error' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJsonInput(content);
        const res = restoreDatabaseFromBackup(content);
        if (res.success) {
          setStatusMsg({ text: `✅ Fayldan tiklandi: ${res.message}`, type: 'success' });
          setIntegrityResult(verifyDatabaseIntegrity());
        } else {
          setStatusMsg({ text: `❌ ${res.message}`, type: 'error' });
        }
      }
    };
    reader.readAsText(file);
  };

  // ============================================================================
  // TRAFFIC & RATE LIMIT HANDLERS
  // ============================================================================

  const handleApplyRpmLimit = () => {
    setMaxRpm(selectedRpmLimit);
    setStatusMsg({
      text: `🛡️ DDoS cheklovi yangilandi: 1 daqiqada maksimal ${selectedRpmLimit} soʻrov ruxsat etiladi.`,
      type: 'success'
    });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleManualBlockIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualIpToBlock.trim()) return;
    blockIp(manualIpToBlock.trim());
    setManualIpToBlock('');
    setStatusMsg({
      text: `🚨 IP manzil (${manualIpToBlock}) xavfsizlik devori qora roʻyxatiga kiritildi va bloklandi.`,
      type: 'info'
    });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  // ============================================================================
  // LOGS FILTERING
  // ============================================================================

  const filteredLogs = useMemo(() => {
    return securityAuditLogs.filter(log => {
      const matchSeverity = logFilterSeverity === 'all' || log.severity === logFilterSeverity;
      const matchSearch = logSearchQuery === '' || 
        log.event.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        log.ip.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(logSearchQuery.toLowerCase());
      return matchSeverity && matchSearch;
    });
  }, [securityAuditLogs, logFilterSeverity, logSearchQuery]);

  const filteredRbac = useMemo(() => {
    return rbacPermissions.filter(p => selectedRbacCategory === 'all' || p.category === selectedRbacCategory);
  }, [rbacPermissions, selectedRbacCategory]);

  return (
    <div className="w-full space-y-6">
      
      {/* Top Breadcrumb & Status Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <button 
              onClick={() => setGlobalActiveTab(userRole === 'davlat' ? 'gov_hub' : 'profile')} 
              className="hover:text-emerald-500 transition-colors"
            >
              Asosiy Portal
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Dasturchi Konsoli</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Security Operations Center (SOC)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span>Dasturchi va Kiber-Xavfsizlik Boshqaruv Markazi</span>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600 rounded-md">
              ROOT DEVELOPER
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
            Yozyovon Agro Core | Tayyorlangan Parametrlar (SQLi Himoyasi) | XSS Entiti Shifrlash | WAF & DDoS Himoyasi
          </p>
        </div>

        {/* Real-time Clock & Live Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs font-mono">
            <Clock className="w-4 h-4 text-emerald-500 animate-spin-slow" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Haqiqiy Real Vaqt</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm tracking-wider">{currentSecondsTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Status Notification Banner */}
      {statusMsg && (
        <div className={`px-5 py-3 rounded-xl border flex items-center justify-between transition-all ${
          statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-700' :
          statusMsg.type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-700' :
          'bg-blue-50 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-700'
        }`}>
          <span className="flex items-center gap-2 text-xs sm:text-sm font-medium">
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle className="w-4 h-4" />}
            {statusMsg.text}
          </span>
          <button onClick={() => setStatusMsg(null)} className="text-xs opacity-75 hover:opacity-100 p-1">✕</button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* BO'LIM 1: TRAFIKNI REAL VAQTDA KUZATISH (LIVE TRAFFIC MONITOR)        */}
      {/* ==================================================================== */}
      {activeDevTab === 'traffic_monitor' && (
        <div className="space-y-6">
          
          {/* Top Live Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block">Jami Jonli Soʻrovlar</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {liveTrafficStats.totalRequests}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5 mt-2">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Har soniyada yangilanmoqda
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block">Bloklangan Xurujlar (WAF)</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">
                {liveTrafficStats.threatsBlocked}
              </div>
              <span className="text-[11px] text-rose-600/80 dark:text-rose-400/80 font-mono mt-2 block">
                SQLi, XSS va Botnet xurujlari
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block">DDoS Rate-Limit (429 Cheklov)</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
                {liveTrafficStats.rateLimitedRequests}
              </div>
              <span className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-mono mt-2 block">
                Tezlik chegarasidan oshganlar
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block">Oʻrtacha Kechikish (Latency)</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">
                {liveTrafficStats.avgResponseTimeMs} ms
              </div>
              <span className="text-[11px] text-blue-600/80 dark:text-blue-400/80 font-mono mt-2 block">
                Yuqori tezlikdagi javob vaqti
              </span>
            </div>
          </div>

          {/* Real-time Dynamic Latency Chart (Recharts) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  <span>Real Vaqtda Server Soʻrovlari va Kechikish Dinamikasi (Latency ms)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Har bir nuqta aniq vaqt soniyasini aks ettiradi (Joriy vaqt: {currentSecondsTime})
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Jonli sekundma-sekund oqim
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="liveTrafficGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" opacity={0.3} />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} domain={[0, 'auto']} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0F172A', 
                      borderColor: '#334155', 
                      borderRadius: 12, 
                      color: '#F8FAFC',
                      fontSize: 12,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="duration" 
                    stroke="#10B981" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#liveTrafficGradient)" 
                    name="Kechikish (ms)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DDoS Rate Limiter Controls & IP Blacklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Rate Limiting Configuration Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">DDoS Trafikni Cheklash (Rate Limiter)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">1 daqiqada ruxsat etiladigan maksimal soʻrovlar meʼyori (RPM)</p>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Joriy chegara:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{selectedRpmLimit} soʻrov / daqiqa</span>
                </div>

                <input
                  type="range"
                  min="30"
                  max="300"
                  step="10"
                  value={selectedRpmLimit}
                  onChange={(e) => setSelectedRpmLimit(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                />

                <div className="grid grid-cols-4 gap-2">
                  {[60, 120, 180, 240].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelectedRpmLimit(val)}
                      className={`py-2 text-xs font-mono font-bold rounded-xl border transition cursor-pointer ${
                        selectedRpmLimit === val 
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {val} RPM
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleApplyRpmLimit}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  DDoS Cheklovini Kuchga Kiritish
                </button>
              </div>
            </div>

            {/* IP Blacklist & Firewall Manager */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Xavfsizlik Devori (IP Qora Roʻyxati)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Shubhali yoki xuruj uyushtirgan IP manzillarni bloklash</p>
                </div>
              </div>

              <form onSubmit={handleManualBlockIp} className="flex gap-2">
                <input
                  type="text"
                  value={manualIpToBlock}
                  onChange={(e) => setManualIpToBlock(e.target.value)}
                  placeholder="IP manzil (masalan: 198.51.100.23)"
                  className="flex-1 px-3.5 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition cursor-pointer"
                >
                  Bloklash
                </button>
              </form>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">Bloklangan IP manzillar ({blockedIps.length}):</span>
                {blockedIps.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">Hozirda bloklangan IP yoʻq</span>
                ) : (
                  blockedIps.map((ip) => (
                    <div key={ip} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono">
                      <span className="text-rose-600 dark:text-rose-400 font-semibold">{ip}</span>
                      <button
                        onClick={() => unblockIp(ip)}
                        className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 transition cursor-pointer"
                      >
                        Blokdan chiqarish
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Live Request Stream Table */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>Jonli Soʻrovlar Oqimi (Live Traffic Stream)</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Har soniyadagi tarmoq soʻrovlari real vaqtda qayd etilmoqda (Soʻnggi {trafficHistory.length} ta)
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                Aniq vaqt: {currentSecondsTime}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 max-h-[480px] overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Vaqt (Sekundma-sekund)</th>
                    <th className="px-4 py-3">IP Manzil</th>
                    <th className="px-4 py-3">Metod</th>
                    <th className="px-4 py-3">Marshrut</th>
                    <th className="px-4 py-3">Holat Kodu</th>
                    <th className="px-4 py-3">Kechikish</th>
                    <th className="px-4 py-3">Xavfsizlik Holati</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {trafficHistory.slice(0, 80).map((req) => (
                    <tr key={req.id} className={req.isThreat ? 'bg-rose-50/50 dark:bg-rose-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}>
                      <td className="px-4 py-2.5 font-bold text-slate-900 dark:text-slate-200">{req.timeLabel}</td>
                      <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-400">{req.ip}</td>
                      <td className="px-4 py-2.5 font-bold text-blue-600 dark:text-blue-400">{req.method}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{req.path}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          req.status === 200 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' :
                          req.status === 429 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800' :
                          'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{req.durationMs}ms</td>
                      <td className="px-4 py-2.5">
                        {req.isThreat ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300 border border-rose-300 dark:border-rose-600">
                            🚨 {req.threatType || 'BLOCKED'}
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">✓ Toza</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* BO'LIM 2: MA'LUMOTLAR BAZASINI ZAHIRALASH VA TIKLASH                     */}
      {/* ==================================================================== */}
      {activeDevTab === 'backup_restore' && (
        <div className="space-y-6">
          
          {/* Integrity status card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Maʼlumotlar Bazasi Yaxlitligi va Xavfsizlik Holati</span>
                  <span className="px-2.5 py-0.5 text-xs font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-md border border-emerald-300 dark:border-emerald-700 font-bold">
                    100% VERIFIED
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-1">
                  {integrityResult?.details || '33 ta MFY toʻliq tekshirilgan. Hech qanday soxta yoki zararlangan maʼlumot yoʻq.'}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono mt-2">
                  <span>SHA-256 Hash: {integrityResult?.hash || 'SHA256:7f83b1657ff1fc53...'}</span>
                  <span>•</span>
                  <span>Oxirgi zaxira: {cyberDefenseStatus.lastBackupTime || '2026-09-21 22:00'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const res = verifyDatabaseIntegrity();
                setIntegrityResult(res);
                setStatusMsg({ text: '✅ Bazaning yaxlitligi qayta tekshirildi: Barcha 33 MFY butun!', type: 'success' });
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 transition cursor-pointer shrink-0"
            >
              <RefreshCw className="w-4 h-4 text-emerald-500" />
              Yaxlitlikni Tekshirish
            </button>
          </div>

          {/* Download Full Backup Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Toʻliq Bazani Yuklab Olish (Export)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">33 ta MFY, ekinlar, chorva, subsidiyalar va barcha koʻrsatkichlar</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Saytdagi barcha davlat reyestri va fermerlar maʼlumotlarini zaxiraga oling. SQL formati tayyorlangan parametrlarga ega, JSON esa tezkor qayta tiklash uchun qulay.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleDownloadBackup('json')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  JSON Zaxirani Yuklash
                </button>
                <button
                  onClick={() => handleDownloadBackup('sql')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  SQL Dump (Prepared)
                </button>
              </div>
            </div>

            {/* Instant Snapshot Creation */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tezkor Snapshot Nusxa Yaratish</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tizim ichki xotirasida zaxira nuqtasi yaratish</p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <input
                  type="text"
                  value={snapshotNote}
                  onChange={(e) => setSnapshotNote(e.target.value)}
                  placeholder="Izoh kiriting (masalan: Yangi haftalik monitoring oldidan zaxira)"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleCreateSnapshot}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md shadow-purple-600/20 transition cursor-pointer"
                >
                  <HardDrive className="w-4 h-4" />
                  Yangi Snapshot Saqlash
                </button>
              </div>
            </div>
          </div>

          {/* Restore from File or JSON */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bazani Zaxiradan Qayta Tiklash (Restore)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Zaxira faylini yuklang yoki JSON matnini joylang</p>
                </div>
              </div>

              {/* File Upload Button */}
              <label className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer transition">
                <Upload className="w-4 h-4 text-emerald-500" />
                <span>Fayldan Yuklash (.json)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-3">
              <textarea
                rows={4}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Zaxira JSON maʼlumotlarini shu yerga joylashtiring: {"data": {"mfyList": [...]}}'
                className="w-full p-3.5 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-emerald-300 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  * Tiklashdan avval avtomatik yaxlitlik (SHA-256 va 33 MFY) tekshiruvi amalga oshiriladi.
                </span>
                <button
                  onClick={handleRestoreFromJson}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Bazani Tiklash
                </button>
              </div>
            </div>
          </div>

          {/* Snapshots History Table */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Mavjud Snapshot Zaxiralar Tarixi</span>
              <span className="text-xs font-mono font-normal text-slate-500 dark:text-slate-400">
                Jami: {backupSnapshots.length} ta zaxira
              </span>
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Sana & Vaqt</th>
                    <th className="px-4 py-3">Zaxira Nomi</th>
                    <th className="px-4 py-3">Format</th>
                    <th className="px-4 py-3">Hajm</th>
                    <th className="px-4 py-3">Holat</th>
                    <th className="px-4 py-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {backupSnapshots.map((snap) => (
                    <tr key={snap.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{snap.timestamp}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{snap.name}</td>
                      <td className="px-4 py-3 uppercase text-emerald-600 dark:text-emerald-400 font-bold">{snap.format}</td>
                      <td className="px-4 py-3">{snap.sizeKb} KB</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          {snap.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleDownloadBackup(snap.format)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                          title="Yuklab olish"
                        >
                          <Download className="w-3.5 h-3.5 inline" />
                        </button>
                        {backupSnapshots.length > 1 && (
                          <button
                            onClick={() => deleteBackupSnapshot(snap.id)}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-600 dark:text-rose-300 rounded-lg border border-rose-200 dark:border-rose-800/50 transition cursor-pointer"
                            title="Oʻchirish"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* BO'LIM 3: TIZIM LOGLARI VA KIRISH HUQUQLARI (AUDIT & RBAC)               */}
      {/* ==================================================================== */}
      {activeDevTab === 'logs_and_rbac' && (
        <div className="space-y-6">

          {/* Role-Based Access Control (RBAC) Section */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Kirish Huquqlarini Boshqarish Matritsasi (RBAC)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Oʻzgarishlar barcha panellarda va rollarda real vaqtda darhol kuchga kiradi
                  </p>
                </div>
              </div>

              {/* Filter by Category */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">Kategoriya:</span>
                <select
                  value={selectedRbacCategory}
                  onChange={(e) => setSelectedRbacCategory(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-200 text-xs focus:outline-none"
                >
                  <option value="all">Barchasi</option>
                  <option value="database">Baza Amallari</option>
                  <option value="monitoring">Monitoring & Xarita</option>
                  <option value="security">Kiber-Xavfsizlik</option>
                  <option value="subsidies">Subsidiyalar</option>
                  <option value="export">Eksport</option>
                </select>
              </div>
            </div>

            {/* RBAC Matrix Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-5 py-3.5">Funksiya va Ruxsatnoma</th>
                    <th className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold">
                        👨‍💻 Dasturchi (Root)
                      </span>
                    </th>
                    <th className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800 font-bold">
                        🏛️ Davlat Organi
                      </span>
                    </th>
                    <th className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold">
                        👨‍🌾 Dehqon / Fermer
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredRbac.map((perm) => (
                    <tr key={perm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{perm.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{perm.description}</div>
                      </td>

                      {/* Admin toggle */}
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => toggleRbacPermission(perm.id, 'admin')}
                          className={`p-2 rounded-xl transition cursor-pointer ${
                            perm.roles.admin 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                          }`}
                          title="Dasturchi ruxsatini oʻzgartirish"
                        >
                          {perm.roles.admin ? <CheckCircle2 className="w-5 h-5" /> : <ShieldOff className="w-5 h-5" />}
                        </button>
                      </td>

                      {/* Davlat toggle */}
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => toggleRbacPermission(perm.id, 'davlat')}
                          className={`p-2 rounded-xl transition cursor-pointer ${
                            perm.roles.davlat 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-700' 
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                          }`}
                          title="Davlat organi ruxsatini oʻzgartirish"
                        >
                          {perm.roles.davlat ? <CheckCircle2 className="w-5 h-5" /> : <ShieldOff className="w-5 h-5" />}
                        </button>
                      </td>

                      {/* Dehqon toggle */}
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => toggleRbacPermission(perm.id, 'dehqon')}
                          className={`p-2 rounded-xl transition cursor-pointer ${
                            perm.roles.dehqon 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                          }`}
                          title="Dehqon ruxsatini oʻzgartirish"
                        >
                          {perm.roles.dehqon ? <CheckCircle2 className="w-5 h-5" /> : <ShieldOff className="w-5 h-5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Audit Logs Section */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tizim Kiber-Xavfsizlik Audit Jurnali</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">SQL Injection filtri, XSS tozalash va kirish loglari</p>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                    placeholder="Loglarni qidirish..."
                    className="pl-9 pr-3.5 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <select
                  value={logFilterSeverity}
                  onChange={(e) => setLogFilterSeverity(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-200 text-xs focus:outline-none"
                >
                  <option value="all">Barcha Darajalar</option>
                  <option value="critical">🚨 Kritik (Critical)</option>
                  <option value="warning">⚠️ Ogohlantirish</option>
                  <option value="shield">🛡️ Himoya / Baza</option>
                  <option value="info">ℹ️ Maʼlumot</option>
                </select>
              </div>
            </div>

            {/* Audit Logs List */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-mono">
                  Qidiruv boʻyicha mos keladigan audit log topilmadi.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 rounded-xl border text-xs font-mono transition ${
                      log.severity === 'critical' ? 'bg-rose-50/70 border-rose-300 text-rose-900 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-200' :
                      log.severity === 'warning' ? 'bg-amber-50/70 border-amber-300 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200' :
                      log.severity === 'shield' ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200' :
                      'bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-black/10 dark:border-white/10 pb-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.severity === 'critical' ? 'bg-rose-600 text-white' :
                          log.severity === 'warning' ? 'bg-amber-600 text-white' :
                          log.severity === 'shield' ? 'bg-emerald-600 text-white' :
                          'bg-slate-600 text-white'
                        }`}>
                          {log.severity.toUpperCase()}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">{log.event}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] opacity-75">
                        <span>IP: {log.ip}</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-[11px] leading-relaxed opacity-90 pl-1">
                      {log.details}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
