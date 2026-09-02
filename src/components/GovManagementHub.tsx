import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Send, 
  FileSpreadsheet, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Plus, 
  FileText, 
  Users, 
  Layers, 
  Download, 
  RefreshCw, 
  Award,
  Globe,
  TrendingUp,
  MapPin,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MFYData, SubsidyApplication, ExportCertificate } from '../types';

export const GovManagementHub: React.FC = () => {
  const { 
    mfyList, 
    subsidies, 
    approveSubsidy, 
    rejectSubsidy, 
    exportCertificates, 
    issueExportCertificate, 
    sendGovBroadcastAlert, 
    resetGovDemoData,
    selectMfy,
    exportToCsv
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'subsidies' | 'broadcast' | 'certs' | 'mfy_matrix'>('overview');

  // Broadcast Alert Form states
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'danger' | 'warning' | 'info'>('warning');
  const [broadcastSentSuccess, setBroadcastSentSuccess] = useState(false);

  // New Export Certificate Form states
  const [showNewCertModal, setShowNewCertModal] = useState(false);
  const [certFarmerName, setCertFarmerName] = useState('');
  const [certMfyName, setCertMfyName] = useState('Yozyovon MFY');
  const [certProduct, setCertProduct] = useState('Yangi Meyeri Limoni');
  const [certQuantity, setCertQuantity] = useState(10);
  const [certCountry, setCertCountry] = useState('Rossiya Federatsiyasi');

  // Search in MFY Matrix
  const [matrixSearch, setMatrixSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Stats calculation
  const totalLimon = mfyList.reduce((acc, m) => acc + m.limonDaraxtlari, 0);
  const totalChorva = mfyList.reduce((acc, m) => acc + m.chorvaBoshlari, 0);
  const totalMaydon = mfyList.reduce((acc, m) => acc + m.dehqonchilikGa, 0);
  const totalFarmers = mfyList.reduce((acc, m) => acc + m.farmersCount, 0);

  const pendingSubsidies = subsidies.filter(s => s.status === 'kutilmoqda');

  // Handle Broadcast Send
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;
    sendGovBroadcastAlert(broadcastTitle, broadcastMsg, broadcastSeverity);
    setBroadcastTitle('');
    setBroadcastMsg('');
    setBroadcastSentSuccess(true);
    setTimeout(() => setBroadcastSentSuccess(false), 4000);
  };

  // Handle New Export Certificate
  const handleCreateCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certFarmerName) return;
    issueExportCertificate({
      regNumber: `UZ-YZ-EXP-2026/${Math.floor(100 + Math.random() * 900)}`,
      farmerName: certFarmerName,
      mfyName: certMfyName,
      productType: certProduct,
      quantityTons: Number(certQuantity),
      destinationCountry: certCountry,
      phytosanitaryStatus: 'sertifikatlangan'
    });
    setShowNewCertModal(false);
    setCertFarmerName('');
  };

  // Filtered MFYs for Matrix
  const filteredMfyMatrix = mfyList.filter(m => {
    const matches = m.name.toLowerCase().includes(matrixSearch.toLowerCase()) ||
                    m.asosiyEkinlar.some(e => e.toLowerCase().includes(matrixSearch.toLowerCase()));
    if (!matches) return false;
    if (statusFilter === 'high') return m.limonDaraxtlari >= 10000;
    if (statusFilter === 'medium') return m.limonDaraxtlari >= 5000 && m.limonDaraxtlari < 10000;
    if (statusFilter === 'low') return m.limonDaraxtlari < 5000;
    return true;
  });

  // Export Matrix to CSV
  const handleExportMatrixCsv = () => {
    const headers = ['ID', 'MFY Nomi', 'Maydon (ga)', 'Limon Daraxtlari (dona)', 'Chorva (bosh)', 'Fermerlar Soni', 'Holat'];
    const rows = mfyList.map(m => [
      m.id,
      m.name,
      m.dehqonchilikGa,
      m.limonDaraxtlari,
      m.chorvaBoshlari,
      m.farmersCount,
      m.limonDaraxtlari >= 10000 ? 'Yetakchi (>10k)' : m.limonDaraxtlari >= 5000 ? 'Oʻrta (5k-10k)' : 'Past (<5k)'
    ]);
    exportToCsv('Yozyovon_32_MFY_Davlat_Monitoring_Hisoboti', headers, rows);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" id="gov-management-hub">
      
      {/* Top Banner & Quick Test Data Button */}
      <div className="bg-[#0F172A] text-white p-5 sm:p-6 rounded-lg border border-[#334155] shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#1E293B] rounded-md border border-[#334155] text-[#3B82F6]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Davlat Agroinspeksiyasi Boshqaruv Markazi
              </h1>
              <span className="bg-[#1E293B] text-[#3B82F6] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#334155]">
                32 MFY Boshqaruvi
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Yozyovon tumani boʻyicha toʻliq nazorat, subsidiyalar, fitosanitariya va tezkor xabarnomalar tizimi
            </p>
          </div>
        </div>

        {/* ⚡ Quick Test Data Button (Requested by User) */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetGovDemoData}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-slate-950 text-xs font-bold rounded-md flex items-center gap-2 shadow-lg transition-all"
            id="quick-gov-test-btn"
            title="Barcha 32 MFY va subsidiya test maʼlumotlarini qayta yuklash"
          >
            <Zap className="w-4 h-4 text-slate-950 fill-current" />
            <span>⚡ Tezkor Test Maʼlumotlarini Yangilash</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Indicator Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-md border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Jami Limon Daraxtlari</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-2">
            {totalLimon.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">tup</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-1">32 ta MFY boʻyicha toʻliq</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-md border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Chorva Boshlari</span>
            <Users className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-2">
            {totalChorva.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">bosh</span>
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">Qoramol, qoʻy va parranda</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-md border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Dehqonchilik Maydoni</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-2">
            {totalMaydon.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">ga</span>
          </div>
          <span className="text-[11px] text-[#64748B] block mt-1">{totalFarmers} ta fermer xoʻjaligi</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-md border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Kutilayotgan Subsidiyalar</span>
            <FileSpreadsheet className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-2">
            {pendingSubsidies.length} <span className="text-xs font-normal text-[#64748B]">ta ariza</span>
          </div>
          <span className="text-[11px] text-amber-700 font-semibold block mt-1">Tasdiqlash talab etiladi</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-lg border border-[#E2E8F0] shadow-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
            activeTab === 'overview' 
              ? 'bg-[#0F172A] text-white shadow-xs' 
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
          }`}
        >
          Umumiy Boshqaruv
        </button>

        <button
          onClick={() => setActiveTab('mfy_matrix')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'mfy_matrix' 
              ? 'bg-[#0F172A] text-white shadow-xs' 
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
          }`}
        >
          <span>32 MFY Toliq Reyestri</span>
          <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-full">32</span>
        </button>

        <button
          onClick={() => setActiveTab('subsidies')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'subsidies' 
              ? 'bg-[#0F172A] text-white shadow-xs' 
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
          }`}
        >
          <span>Subsidiyalar & Grantlar</span>
          {pendingSubsidies.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              {pendingSubsidies.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'broadcast' 
              ? 'bg-[#0F172A] text-white shadow-xs' 
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Fitosanitar Xabarnoma Yuborish</span>
        </button>

        <button
          onClick={() => setActiveTab('certs')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'certs' 
              ? 'bg-[#0F172A] text-white shadow-xs' 
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Eksport & Fitonazorat Sertifikatlari</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Quick Actions & Alerts (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Pending Subsidies List */}
            <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-[#3B82F6]" />
                    <span>Dehqonlardan Kelgan Yangi Subsidiya Arizalari</span>
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Tomchilatib sugʻorish, quyosh panellari va sitrus koʻchatlarini yangilash boʻyicha arizalar
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                  {pendingSubsidies.length} ta kutilmoqda
                </span>
              </div>

              {subsidies.length === 0 ? (
                <p className="text-xs text-[#64748B] py-4 text-center">Hozircha arizalar mavjud emas.</p>
              ) : (
                <div className="space-y-3">
                  {subsidies.map(sub => (
                    <div 
                      key={sub.id} 
                      className={`p-4 rounded-md border text-xs flex flex-wrap items-center justify-between gap-4 transition-all ${
                        sub.status === 'tasdiqlandi' 
                          ? 'bg-emerald-50/40 border-emerald-200' 
                          : sub.status === 'rad_etildi'
                          ? 'bg-rose-50/40 border-rose-200 opacity-60'
                          : 'bg-[#F8FAFC] border-[#CBD5E1]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#0F172A]">{sub.farmerName}</span>
                          <span className="bg-blue-100 text-[#3B82F6] text-[10px] px-2 py-0.2 rounded font-semibold">
                            {sub.mfyName}
                          </span>
                        </div>
                        <p className="text-[#334155] font-semibold">{sub.programTitle}</p>
                        <p className="text-[#64748B] text-[11px] max-w-xl">{sub.purpose}</p>
                        <div className="flex items-center gap-3 pt-1 text-[11px] text-[#64748B]">
                          <span>Soʻralgan mablagʻ: <strong className="text-emerald-700 font-bold">{sub.requestedAmount}</strong></span>
                          <span>•</span>
                          <span>Sana: {sub.submittedDate}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {sub.status === 'kutilmoqda' ? (
                          <>
                            <button
                              onClick={() => approveSubsidy(sub.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Tasdiqlash</span>
                            </button>
                            <button
                              onClick={() => rejectSubsidy(sub.id)}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Rad etish</span>
                            </button>
                          </>
                        ) : (
                          <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                            sub.status === 'tasdiqlandi' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {sub.status === 'tasdiqlandi' ? '✓ Tasdiqlangan' : '✗ Rad etilgan'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Broadcast Section Preview */}
            <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#3B82F6]" />
                  <span>Tezkor Fitosanitar Xabar Yuborish (Barcha 32 MFY)</span>
                </h3>
                <button
                  onClick={() => setActiveTab('broadcast')}
                  className="text-xs text-[#3B82F6] hover:underline font-semibold"
                >
                  Kengaytirilgan panel ➔
                </button>
              </div>
              <p className="text-xs text-[#64748B]">
                Tuman boʻylab sovuq urish, sitrus zararkunandalari yoki agrotexnik qoidalar boʻyicha dehqonlar telefoniga va portaliga shoshilinch ogohlantirish yuboring.
              </p>
            </div>

          </div>

          {/* Right Column: Key Top 5 MFY Leaders (1 Col) */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A] flex items-center justify-between">
                <span>Sitruschilik Boʻyicha Yetakchi MFYlar</span>
                <span className="text-emerald-700 font-bold text-[10px]">Top 5</span>
              </h3>
              <div className="space-y-2 pt-1">
                {[...mfyList]
                  .sort((a, b) => b.limonDaraxtlari - a.limonDaraxtlari)
                  .slice(0, 5)
                  .map((m, idx) => (
                    <div 
                      key={m.id}
                      onClick={() => selectMfy(m.id)}
                      className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3B82F6] cursor-pointer transition-all flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-[#0F172A]">{m.name}</p>
                          <span className="text-[10px] text-[#64748B]">{m.dehqonchilikGa} ga maydon</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-700">{m.limonDaraxtlari.toLocaleString()}</span>
                        <span className="text-[10px] text-[#64748B] block">daraxt</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Export Reports */}
            <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3B82F6]" />
                <span>Hisobotlarni Yuklab Olish</span>
              </h3>
              <p className="text-xs text-[#64748B]">
                Viloyat hokimligi va Qishloq xoʻjaligi vazirligi uchun 32 MFY agrosektori toʻliq statistikasi:
              </p>
              <button
                onClick={handleExportMatrixCsv}
                className="w-full py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>32 MFY Hisobotini Yuklab Olish (Excel)</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: 32 MFY MATRIX */}
      {activeTab === 'mfy_matrix' && (
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-wider">
                Yozyovon Tumani 32 MFY Agrosektor Reestri
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Har bir mahallaning dehqonchilik maydoni, sitrus plantatsiyalari va chorvachilik monitoringi
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="MFY yoki ekin qidirish..."
                  value={matrixSearch}
                  onChange={(e) => setMatrixSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-hidden focus:border-[#3B82F6]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-2.5 py-1.5 font-semibold text-[#0F172A]"
              >
                <option value="all">Barcha Holatlar</option>
                <option value="high">Yetakchi (&gt; 10 000 tup)</option>
                <option value="medium">Oʻrtacha (5k - 10k tup)</option>
                <option value="low">Rivojlantirish Talab (&lt; 5k tup)</option>
              </select>

              <button
                onClick={handleExportMatrixCsv}
                className="px-3 py-1.5 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Excel Eksport</span>
              </button>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-4">MFY Nomi</th>
                  <th className="py-3 px-4">Dehqonchilik Maydoni</th>
                  <th className="py-3 px-4">Limon Daraxtlari</th>
                  <th className="py-3 px-4">Chorva Boshlari</th>
                  <th className="py-3 px-4">Fermerlar Soni</th>
                  <th className="py-3 px-4">Asosiy Ekinlar</th>
                  <th className="py-3 px-4">Holat</th>
                  <th className="py-3 px-3 text-right">Harakat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredMfyMatrix.map((m, idx) => {
                  const isHigh = m.limonDaraxtlari >= 10000;
                  const isMed = m.limonDaraxtlari >= 5000 && m.limonDaraxtlari < 10000;
                  return (
                    <tr key={m.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-3 font-bold text-[#64748B]">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-[#0F172A]">{m.name}</td>
                      <td className="py-3 px-4 font-semibold text-[#334155]">{m.dehqonchilikGa} ga</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">{m.limonDaraxtlari.toLocaleString()} tup</td>
                      <td className="py-3 px-4 font-semibold text-amber-700">{m.chorvaBoshlari.toLocaleString()} bosh</td>
                      <td className="py-3 px-4 text-[#334155]">{m.farmersCount} ta</td>
                      <td className="py-3 px-4 text-[#64748B]">{m.asosiyEkinlar.join(', ')}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isHigh ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : isMed ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isHigh ? 'Yetakchi' : isMed ? 'Oʻrtacha' : 'Past'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => selectMfy(m.id)}
                          className="px-2.5 py-1 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] rounded text-[11px] font-semibold transition-colors"
                        >
                          Batafsil ➔
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BROADCAST */}
      {activeTab === 'broadcast' && (
        <div className="bg-white p-5 sm:p-7 rounded-lg border border-[#E2E8F0] shadow-xs space-y-5 max-w-3xl">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <Send className="w-5 h-5 text-[#3B82F6]" />
              <span>Yozyovon Tumani Dehqonlariga Shoshilinch Xabarnoma Yuborish</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Ushbu xabarnoma tuman dehqonlari profiliga hamda monitoring bildirishnomalariga bir zumda yetkaziladi.
            </p>
          </div>

          {broadcastSentSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Xabarnoma muvaffaqiyatli joʻnatildi va barcha 32 MFY dehqonlariga yetkazildi!</span>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#0F172A] uppercase text-[10px] tracking-wider mb-1">
                Xabarnoma Xavflilik Darajasi
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBroadcastSeverity('danger')}
                  className={`p-2.5 rounded-md font-bold text-xs border flex items-center justify-center gap-2 transition-all ${
                    broadcastSeverity === 'danger' 
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs' 
                      : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Qizil (Favqulodda / Xavf)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastSeverity('warning')}
                  className={`p-2.5 rounded-md font-bold text-xs border flex items-center justify-center gap-2 transition-all ${
                    broadcastSeverity === 'warning' 
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs' 
                      : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sariq (Ogohlantirish)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastSeverity('info')}
                  className={`p-2.5 rounded-md font-bold text-xs border flex items-center justify-center gap-2 transition-all ${
                    broadcastSeverity === 'info' 
                      ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-xs' 
                      : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Koʻk (Axborot / Grant)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#0F172A] uppercase text-[10px] tracking-wider mb-1">
                Xabarnoma Sarlavhasi *
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="Masalan: Tunda kutilayotgan harorat pasayishi: Issiqxonalarni isitish choralarini koʻring"
                className="w-full px-3.5 py-2.5 border border-[#CBD5E1] rounded-md bg-[#F8FAFC] text-[#0F172A] font-semibold focus:outline-hidden focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0F172A] uppercase text-[10px] tracking-wider mb-1">
                Batafsil Agrotexnik Koʻrsatma yoki Matn *
              </label>
              <textarea
                required
                rows={4}
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Agronomik tavsiyalar, dori dozasini koʻrsatish yoki subsidiya shartlarini kiriting..."
                className="w-full px-3.5 py-2.5 border border-[#CBD5E1] rounded-md bg-[#F8FAFC] text-[#0F172A] focus:outline-hidden focus:border-[#3B82F6]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-md shadow-xs transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Xabarnomani Barcha 32 MFYga Yuborish</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: EXPORT CERTS */}
      {activeTab === 'certs' && (
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <Award className="w-5 h-5 text-[#3B82F6]" />
                <span>Fitosanitariya Nazorati & Eksport Sertifikatlari</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Yozyovondan chet elga eksport qilinadigan sitrus mevalar va mahsulotlar uchun xalqaro fitonazorat ruxsatnomalari
              </p>
            </div>

            <button
              onClick={() => setShowNewCertModal(true)}
              className="px-3.5 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Sertifikat Rasmiylashtirish</span>
            </button>
          </div>

          {/* Certs List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Sertifikat Raqami</th>
                  <th className="py-3 px-4">Dehqon / Fermer</th>
                  <th className="py-3 px-4">MFY</th>
                  <th className="py-3 px-4">Mahsulot Turi</th>
                  <th className="py-3 px-4">Hajmi (Tonna)</th>
                  <th className="py-3 px-4">Eksport Qilinuvchi Davlat</th>
                  <th className="py-3 px-4">Sana</th>
                  <th className="py-3 px-4">Fitosanitar Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {exportCertificates.map(cert => (
                  <tr key={cert.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#3B82F6]">{cert.regNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-[#0F172A]">{cert.farmerName}</td>
                    <td className="py-3.5 px-4 text-[#64748B]">{cert.mfyName}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#334155]">{cert.productType}</td>
                    <td className="py-3.5 px-4 font-bold text-[#0F172A]">{cert.quantityTons} tonna</td>
                    <td className="py-3.5 px-4 text-[#334155] flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>{cert.destinationCountry}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">{cert.issueDate}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        cert.phytosanitaryStatus === 'sertifikatlangan'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {cert.phytosanitaryStatus === 'sertifikatlangan' ? '✓ Sertifikatlangan' : '⏳ Tekshiruvda'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Cert Modal */}
      {showNewCertModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-sm text-[#0F172A] uppercase">Yangi Eksport Sertifikati Berish</h3>
              <button onClick={() => setShowNewCertModal(false)} className="text-[#64748B] hover:text-[#0F172A]">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCert} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#64748B] mb-1">Dehqon / Fermer xoʻjaligi nomi *</label>
                <input
                  type="text"
                  required
                  value={certFarmerName}
                  onChange={(e) => setCertFarmerName(e.target.value)}
                  placeholder="Masalan: Qodirov Rustamjon"
                  className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#64748B] mb-1">Mahalla (MFY)</label>
                <select
                  value={certMfyName}
                  onChange={(e) => setCertMfyName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC]"
                >
                  {mfyList.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#64748B] mb-1">Mahsulot turi</label>
                <input
                  type="text"
                  value={certProduct}
                  onChange={(e) => setCertProduct(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#64748B] mb-1">Hajm (Tonna)</label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={certQuantity}
                    onChange={(e) => setCertQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#64748B] mb-1">Eksport davlati</label>
                  <input
                    type="text"
                    value={certCountry}
                    onChange={(e) => setCertCountry(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold rounded-md shadow-xs mt-2"
              >
                Fitonazorat Sertifikatini Tasdiqlash & Berish
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
