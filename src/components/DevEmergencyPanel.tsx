import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, ShieldAlert, ShieldCheck, Lock, Unlock, Database, 
  Terminal, Activity, Eye, EyeOff, RefreshCw, AlertTriangle, 
  CheckCircle2, Download, Upload, Cpu, Zap, Radio, Globe, 
  Server, Key, X, Sliders, Edit3, Bug
} from 'lucide-react';
import { getStoredTomorrowApiKey, saveCustomTomorrowApiKey } from '../services/tomorrowWeather';

export const DevEmergencyPanel: React.FC = () => {
  const {
    isDevModalOpen,
    setIsDevModalOpen,
    isDarkMode,
    toggleDarkMode,
    isCyberDefenseActive,
    isHoneypotActive,
    cyberDefenseStatus,
    triggerEmergencyLockdown,
    restoreRealDatabase,
    isMaintenanceMode,
    setMaintenanceMode,
    mfyList,
    updateMfyDataLive,
    securityAuditLogs,
    addSecurityLog,
    exportDatabaseJson,
    importDatabaseJson
  } = useApp();

  const [activeTab, setActiveTab] = useState<'cyber_defense' | 'live_editor' | 'security_logs' | 'db_vault' | 'api_keys'>('cyber_defense');
  const [selectedMfyEditId, setSelectedMfyEditId] = useState<number>(1);
  const [editLimon, setEditLimon] = useState<number>(14500);
  const [editChorva, setEditChorva] = useState<number>(2800);
  const [editGa, setEditGa] = useState<number>(520);
  const [editName, setEditName] = useState<string>('');
  const [jsonInput, setJsonInput] = useState<string>('');
  const [tomorrowApiKeyInput, setTomorrowApiKeyInput] = useState<string>(() => getStoredTomorrowApiKey());
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  if (!isDevModalOpen) return null;

  const currentEditMfy = mfyList.find(m => m.id === selectedMfyEditId) || mfyList[0];

  const handleSelectMfyToEdit = (id: number) => {
    setSelectedMfyEditId(id);
    const m = mfyList.find(item => item.id === id);
    if (m) {
      setEditName(m.name);
      setEditLimon(m.limonDaraxtlari);
      setEditChorva(m.chorvaBoshlari);
      setEditGa(m.dehqonchilikGa);
    }
  };

  const handleSaveMfyChanges = (e: React.FormEvent) => {
    e.preventDefault();
    updateMfyDataLive(selectedMfyEditId, {
      name: editName || currentEditMfy.name,
      limonDaraxtlari: Number(editLimon),
      chorvaBoshlari: Number(editChorva),
      dehqonchilikGa: Number(editGa)
    });
    setStatusMsg({
      text: `✅ MFY #${selectedMfyEditId} parametrlari saytda real vaqtda muvaffaqiyatli yangilandi!`,
      type: 'success'
    });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleTriggerLockdown = () => {
    triggerEmergencyLockdown();
    setStatusMsg({
      text: '🚨 DIQQAT: Asl maʼlumotlar bazasi AES-256 shifrlanib, 1:1 soxta Honeypot bazasi oʻrnatildi!',
      type: 'error'
    });
  };

  const handleRestoreDatabase = () => {
    const success = restoreRealDatabase();
    if (success) {
      setStatusMsg({
        text: '✅ Asl maʼlumotlar bazasi shifrdan chiqarilib, toʻliq tiklandi!',
        type: 'success'
      });
      setTimeout(() => setStatusMsg(null), 3500);
    }
  };

  const handleExportJson = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yozyovon_agro_db_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    if (!jsonInput.trim()) {
      setStatusMsg({ text: 'Iltimos, JSON matnini kiriting!', type: 'error' });
      return;
    }
    const res = importDatabaseJson(jsonInput);
    if (res) {
      setStatusMsg({ text: '✅ JSON maʼlumotlar bazasi muvaffaqiyatli import qilindi!', type: 'success' });
      setJsonInput('');
      setTimeout(() => setStatusMsg(null), 3500);
    } else {
      setStatusMsg({ text: '❌ JSON formati xato yoki yaroqsiz!', type: 'error' });
    }
  };

  const simulateAttackTest = (attackType: string) => {
    addSecurityLog({
      event: `SIMULATED TEST: ${attackType}`,
      ip: '198.51.100.23 (Penetration Test Tool)',
      severity: 'warning',
      status: isHoneypotActive ? 'honeypot_trapped' : 'blocked',
      details: isHoneypotActive 
        ? 'Hujumchi soxta tuzoq bazaga yoʻnaltirildi va tahlil qilinmoqda.'
        : 'WAF qoidalari asosida hujum bloklandi va xavfsizlik filtri kuchaytirildi.'
    });
    setStatusMsg({
      text: `⚡ Test xuruji kiber-himoya tomonidan qaytarildi (${attackType})`,
      type: 'info'
    });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40 animate-pulse">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">Developer & Emergency Access Terminal</h2>
                <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-red-900/60 text-red-300 border border-red-500/40 rounded">
                  ROOT / BACKDOOR
                </span>
                {isHoneypotActive && (
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-500 text-black rounded animate-bounce">
                    HONEYPOT ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Yozyovon Agro-AI 2026 Core | SHA-256 Vault | Hot Param Override
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Dark/Light Mode almashtirish"
            >
              {isDarkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
            <button
              onClick={() => setIsDevModalOpen(false)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-300 border border-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMsg && (
          <div className={`px-6 py-2.5 text-sm font-medium border-b flex items-center justify-between ${
            statusMsg.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700' :
            statusMsg.type === 'error' ? 'bg-red-950/80 text-red-300 border-red-700' :
            'bg-blue-950/80 text-blue-300 border-blue-700'
          }`}>
            <span>{statusMsg.text}</span>
            <button onClick={() => setStatusMsg(null)} className="text-xs opacity-75 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-slate-950/50 border-b border-slate-800 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('cyber_defense')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold border-b-2 transition ${
              activeTab === 'cyber_defense'
                ? 'bg-slate-800 text-emerald-400 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Kiber Himoya & Shifrlash
          </button>
          <button
            onClick={() => setActiveTab('live_editor')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold border-b-2 transition ${
              activeTab === 'live_editor'
                ? 'bg-slate-800 text-emerald-400 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Jonli MFY & Sayt Tahrirlovchi
          </button>
          <button
            onClick={() => setActiveTab('security_logs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold border-b-2 transition ${
              activeTab === 'security_logs'
                ? 'bg-slate-800 text-emerald-400 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Activity className="w-4 h-4" />
            Audit Jurnali ({securityAuditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('db_vault')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold border-b-2 transition ${
              activeTab === 'db_vault'
                ? 'bg-slate-800 text-emerald-400 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Database className="w-4 h-4" />
            JSON Baza Export / Import
          </button>
          <button
            onClick={() => setActiveTab('api_keys')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-semibold border-b-2 transition ${
              activeTab === 'api_keys'
                ? 'bg-slate-800 text-emerald-400 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Key className="w-4 h-4" />
            Ob-havo API Kaliti
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: CYBER DEFENSE & HONEYPOT */}
          {activeTab === 'cyber_defense' && (
            <div className="space-y-6">
              
              {/* Defense Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border ${
                  isHoneypotActive 
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                    : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400">BAZA STATUSI</span>
                    {isHoneypotActive ? <Lock className="w-5 h-5 text-amber-400" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                  </div>
                  <div className="text-xl font-bold font-mono">
                    {isHoneypotActive ? '🔒 SHIFRLANGAN (HONEYPOT)' : '🛡️ ASL BAZA XAVFSIZ'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono truncate">
                    {cyberDefenseStatus.dbHash}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400">FIREWALL / WAF DARAJASI</span>
                    <Cpu className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-cyan-400 uppercase">
                    {cyberDefenseStatus.firewallLevel}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Bloklangan hujumlar: <span className="font-bold text-white">{cyberDefenseStatus.attacksBlockedCount} ta</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400">PROFILAKTIKA REJIMI</span>
                    <Server className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-base font-bold font-mono">
                      {isMaintenanceMode ? '🛑 MAINTENANCE FAOL' : '🟢 NORMAL REJIM'}
                    </div>
                    <button
                      onClick={() => setMaintenanceMode(!isMaintenanceMode)}
                      className={`px-3 py-1 text-xs rounded font-bold font-mono transition ${
                        isMaintenanceMode ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isMaintenanceMode ? 'Oʻchirish' : 'Yoqish'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Emergency Action Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950/50 via-slate-900 to-slate-900 border border-red-500/50 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-red-500/20 text-red-400 rounded-xl border border-red-500/40">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Favqulodda Kiber Hujumga Qarshi Himoya Mekanizmi (Instant Hash + Honeypot Decoy)
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Sayt kiber hujumga uchraganda quyidagi tugmani bosish orqali haqiqiy maʼlumotlar bazasi soniyalar ichida 
                      <strong> AES-256 & SHA-256 bilan shifrlanib yashiriladi</strong>. Tizim avtomatik ravishda uning oʻrniga 
                      1:1 oʻxshash <strong>tuzoq (virusli/honeypot) soxta maʼlumotlar bazasini</strong> joylashtiradi va barcha xurujlarni nazorat qiladi.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {!isHoneypotActive ? (
                    <button
                      onClick={handleTriggerLockdown}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold font-mono text-sm shadow-lg shadow-red-900/40 transition active:scale-95"
                    >
                      <Lock className="w-4 h-4" />
                      🚨 BAZANI SHIFRLASH & SOXTA HONEYPOT BAZANI OʻRNATISH
                    </button>
                  ) : (
                    <button
                      onClick={handleRestoreDatabase}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-mono text-sm shadow-lg shadow-emerald-900/40 transition active:scale-95 animate-pulse"
                    >
                      <Unlock className="w-4 h-4" />
                      ✅ ASL BAZANI SHIFRDAN CHIQARIB TIKLASH
                    </button>
                  )}

                  <button
                    onClick={() => simulateAttackTest('SQLi Infiltration on MFY Table')}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition"
                  >
                    <Bug className="w-4 h-4 text-amber-400" />
                    SQLi Test Qilish
                  </button>

                  <button
                    onClick={() => simulateAttackTest('DDoS Syn Flood to /api')}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition"
                  >
                    <Zap className="w-4 h-4 text-cyan-400" />
                    DDoS Test Qilish
                  </button>
                </div>
              </div>

              {/* Honeypot Information */}
              {isHoneypotActive && (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs font-mono space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
                    <Radio className="w-4 h-4 animate-ping" />
                    Honeypot Trap Monitoring Faol:
                  </div>
                  <p>• Asl fermerlar, MFY ekin maydonlari va hisobotlar xavfsiz shifrli konteynerga koʻchirildi.</p>
                  <p>• Tashqi soʻrovlar <code className="bg-black/40 px-1 py-0.5 rounded text-amber-100">[HONEYPOT-DECOY-CHAMBER]</code> soxta tuzoqlariga yoʻnaltirilmoqda.</p>
                  <p>• Hujumchining IP manzili va soʻrov xesh-belgilari doimiy ravishda qayd etilmoqda.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE MFY & SITE HOT EDITOR */}
          {activeTab === 'live_editor' && (
            <div className="space-y-6">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-emerald-400" />
                      33 ta MFY Maʼlumotlarini Real Vaqtda Oʻzgartirish (Hot Site Overwrite)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      MFY parametrlarini (daraxtlar soni, ekin maydoni, chorva) tanlang va toʻgʻridan-toʻgʻri saytda jonli yangilang.
                    </p>
                  </div>
                </div>

                {/* MFY Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-6 max-h-40 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {mfyList.map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleSelectMfyToEdit(m.id)}
                      className={`p-2 text-xs rounded-lg text-left font-mono transition border ${
                        selectedMfyEditId === m.id
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      <div className="font-bold">#{m.id}</div>
                      <div className="truncate text-[10px] opacity-80">{m.name.replace(/MFY.*/, '')}</div>
                    </button>
                  ))}
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSaveMfyChanges} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-slate-400 mb-1">MFY Nomi</label>
                    <input
                      type="text"
                      value={editName || currentEditMfy.name}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-medium focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Limon Daraxtlari (dona)</label>
                    <input
                      type="number"
                      value={editLimon}
                      onChange={e => setEditLimon(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-medium focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Chorva Boshlari (bosh)</label>
                    <input
                      type="number"
                      value={editChorva}
                      onChange={e => setEditChorva(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-medium focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Dehqonchilik Maydoni (Ga)</label>
                    <input
                      type="number"
                      value={editGa}
                      onChange={e => setEditGa(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-medium focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow transition active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Saytda Jonli Qoʻllash
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT & SECURITY LOGS */}
          {activeTab === 'security_logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-mono text-slate-300">
                  Xavfsizlik Jurnali (Real-Vaqt WAF & Honeypot Hodisalari)
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Jami: {securityAuditLogs.length} ta yozuv
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs max-h-96 overflow-y-auto">
                {securityAuditLogs.map(log => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border ${
                      log.severity === 'critical' ? 'bg-red-950/40 border-red-500/40 text-red-200' :
                      log.severity === 'warning' ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' :
                      log.severity === 'shield' ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' :
                      'bg-slate-800/60 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold flex items-center gap-1.5">
                        {log.severity === 'critical' && <ShieldAlert className="w-3.5 h-3.5 text-red-400" />}
                        {log.severity === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        {log.severity === 'shield' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                        {log.event}
                      </span>
                      <span className="opacity-70">{log.timestamp}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">IP: <span className="text-slate-200">{log.ip}</span> | Status: <span className="uppercase text-emerald-400 font-bold">{log.status}</span></div>
                    <p className="mt-1 text-slate-300 text-[11px] bg-black/30 p-1.5 rounded">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: JSON DB VAULT */}
          {activeTab === 'db_vault' && (
            <div className="space-y-6">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  Butun Yozyovon Maʼlumotlar Bazasini JSON Formatida Yuklash yoki Tiklash
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Saytning barcha 33 MFY agro-statistikasi, dehqonlar roʻyxati, arizalar va audit maʼlumotlarini zaxiralang.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleExportJson}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-mono text-xs font-bold transition shadow"
                  >
                    <Download className="w-4 h-4" />
                    Zaxira Faylni Yuklab Olish (.json)
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-700 space-y-2">
                  <label className="block text-xs font-mono text-slate-300">
                    JSON Maʼlumotlar Bazasini Import Qilish / Qayta Tiklash
                  </label>
                  <textarea
                    rows={4}
                    value={jsonInput}
                    onChange={e => setJsonInput(e.target.value)}
                    placeholder='{"mfyList": [...], "crops": [...]}'
                    className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl font-mono text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    onClick={handleImportJson}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-mono font-bold rounded-lg transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    JSON Bazani Saytga Yuklash
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TOMORROW.IO API KEY MANAGEMENT (DEVELOPER EXCLUSIVE) */}
          {activeTab === 'api_keys' && (
            <div className="space-y-6">
              <div className="p-5 bg-slate-900 border border-slate-700 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-950/80 border border-cyan-500/40 rounded-lg text-cyan-400">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                      Tomorrow.io Ob-havo & Sunʼiy Yoʻldosh Radar API Kaliti
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Faqat Dasturchi (developerpro@gamil.com) uchun vakolatli sozlama. Dehqonlar panelida bu ruxsat cheklangan.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Hozirgi saqlangan API kalit:</span>
                  </div>
                  <span className="text-cyan-400 font-bold tracking-wider">
                    {tomorrowApiKeyInput ? `${tomorrowApiKeyInput.slice(0, 8)}...${tomorrowApiKeyInput.slice(-4)}` : 'Standart kalit faol'}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-300 font-semibold">
                    Yangi Tomorrow.io API kalitini kiritish:
                  </label>
                  <input
                    type="text"
                    value={tomorrowApiKeyInput}
                    onChange={(e) => setTomorrowApiKeyInput(e.target.value.trim())}
                    placeholder="Tomorrow.io API kalitini kiriting (masalan, 32 ta belgili kod)"
                    className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl font-mono text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (tomorrowApiKeyInput) {
                        saveCustomTomorrowApiKey(tomorrowApiKeyInput);
                        setStatusMsg({
                          text: '✅ Tomorrow.io API kaliti muvaffaqiyatli saqlandi va butun tizim boʻyicha yangilandi!',
                          type: 'success'
                        });
                        setTimeout(() => setStatusMsg(null), 3500);
                      }
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono font-bold rounded-lg transition shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    API Kalitni Saqlash
                  </button>

                  <button
                    onClick={() => {
                      localStorage.removeItem('yozyovon_tomorrow_api_key');
                      setTomorrowApiKeyInput(getStoredTomorrowApiKey());
                      setStatusMsg({
                        text: '🔄 Standart Tomorrow.io API kaliti tiklandi!',
                        type: 'info'
                      });
                      setTimeout(() => setStatusMsg(null), 3000);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Standart Kalitga Qaytish
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SECURE VAULT ENCLAVE OK</span>
          </div>
          <span>Developer Hotline / Backdoor Active</span>
        </div>

      </div>
    </div>
  );
};
