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
  Filter,
  MessageSquare,
  Droplets,
  Sprout,
  CheckSquare,
  Sliders,
  PhoneCall,
  UserCheck,
  Sun,
  CloudSun,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MFYData, SubsidyApplication, ExportCertificate } from '../types';
import { FarmerGovChatModal } from './FarmerGovChatModal';

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
    exportToCsv,
    registeredFarmers,
    grantFarmerBadge,
    revokeFarmerBadge,
    farmerAdvices,
    weatherProvider,
    setWeatherProvider
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'subsidies' | 'farmers_registry' | 'resource_management' | 'broadcast' | 'certs' | 'mfy_matrix' | 'farmer_badges' | 'weather_control'>('overview');
  const [weatherNotice, setWeatherNotice] = useState<string | null>(null);
  const [selectedChatSubsidy, setSelectedChatSubsidy] = useState<SubsidyApplication | null>(null);

  // Badge Modal states
  const [badgeModalFarmer, setBadgeModalFarmer] = useState<{ id: number; name: string; mfyName: string } | null>(null);
  const [badgeYears, setBadgeYears] = useState<number>(15);
  const [badgeCustomTitle, setBadgeCustomTitle] = useState('Davlat tomonidan tasdiqlangan tajribali dehqon');
  const [farmerSearch, setFarmerSearch] = useState('');

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
    exportToCsv('Yozyovon_33_MFY_Davlat_Monitoring_Hisoboti', headers, rows);
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
                33 MFY Boshqaruvi
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
            title="Barcha 33 MFY va subsidiya test maʼlumotlarini qayta yuklash"
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
          <span className="text-[11px] text-emerald-700 font-semibold block mt-1">33 ta MFY boʻyicha toʻliq</span>
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
          onClick={() => setActiveTab('farmers_registry')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'farmers_registry' 
              ? 'bg-[#0F172A] text-white shadow-xs' 
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
          }`}
          id="tab-farmers-registry-btn"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Dehqonlar Nazorati & Reyestri</span>
          <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {registeredFarmers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('subsidies')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'subsidies' 
              ? 'bg-[#0F172A] text-white shadow-xs' 
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Subsidiyalar & Muloqot</span>
          {pendingSubsidies.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              {pendingSubsidies.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('resource_management')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'resource_management' 
              ? 'bg-[#0F172A] text-white shadow-xs' 
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
          }`}
          id="tab-resource-mgmt-btn"
        >
          <Droplets className="w-3.5 h-3.5 text-blue-500" />
          <span>Resurslar Taqsimoti (Suv/Oʻgʻit)</span>
        </button>

        <button
          onClick={() => setActiveTab('mfy_matrix')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'mfy_matrix' 
              ? 'bg-[#0F172A] text-white shadow-xs' 
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
          }`}
        >
          <span>33 MFY Toʻliq Reyestri</span>
          <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-full">33</span>
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
          <span>Xabarnoma Yuborish</span>
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
          <span>Eksport Sertifikatlari</span>
        </button>

        <button
          onClick={() => setActiveTab('farmer_badges')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'farmer_badges' 
              ? 'bg-amber-600 text-white shadow-xs' 
              : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50'
          }`}
          id="tab-farmer-badges-btn"
        >
          <Award className="w-3.5 h-3.5 text-amber-400 fill-current" />
          <span>🏅 Tasdiq Nishonlari</span>
          <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {registeredFarmers.filter(f => f.hasExperienceBadge).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('weather_control')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'weather_control' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-blue-700 hover:text-blue-900 hover:bg-blue-50'
          }`}
          id="tab-weather-control-btn"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Ob-havo API Boshqaruvi</span>
          <span className="bg-blue-100 text-blue-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {weatherProvider === 'accuweather' ? 'AccuWeather' : 'Tomorrow.io'}
          </span>
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
                        <button
                          onClick={() => setSelectedChatSubsidy(sub)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                          title="Dehqon bilan toʻgʻridan-toʻgʻri chat va hujjat almashish"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Muloqot & Hujjatlar ({sub.messages?.length || 0})</span>
                        </button>

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
                  <span>Tezkor Fitosanitar Xabar Yuborish (Barcha 33 MFY)</span>
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
                Viloyat hokimligi va Qishloq xoʻjaligi vazirligi uchun 33 MFY agrosektori toʻliq statistikasi:
              </p>
              <button
                onClick={handleExportMatrixCsv}
                className="w-full py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>33 MFY Hisobotini Yuklab Olish (Excel)</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: 33 MFY MATRIX */}
      {activeTab === 'mfy_matrix' && (
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-wider">
                Yozyovon Tumani 33 MFY Agrosektor Reestri
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

      {/* TAB: SUBSIDIES & CHAT */}
      {activeTab === 'subsidies' && (
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#3B82F6]" />
                <span>Davlat Subsidiyalari & Dehqonlar Bilan Rasmiy Muloqot Markazi</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Tomchilatib sugʻorish, quyosh panellari va sitrus issiqxonalarini modernizatsiya qilish arizalari, hujjat almashish va smeta tekshiruvi
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
                {pendingSubsidies.length} ta koʻrib chiqilmoqda
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                {subsidies.filter(s => s.status === 'tasdiqlandi').length} ta tasdiqlangan
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {subsidies.map(sub => (
              <div 
                key={sub.id}
                className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#3B82F6] transition-all space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#0F172A]">{sub.farmerName}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        📍 {sub.mfyName}
                      </span>
                      {sub.farmerPhone && (
                        <span className="text-[11px] text-[#64748B] font-mono">
                          📞 {sub.farmerPhone}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-[#334155] mt-1">{sub.programTitle}</p>
                    <p className="text-xs text-[#64748B] mt-0.5 bg-white p-2.5 rounded-md border border-[#E2E8F0]">
                      "{sub.purpose}"
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-emerald-700">{sub.requestedAmount}</div>
                    <span className="text-[10px] text-[#64748B] block">Ariza sanasi: {sub.submittedDate}</span>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      sub.status === 'tasdiqlandi' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : sub.status === 'rad_etildi'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sub.status === 'tasdiqlandi' ? '✓ Tasdiqlangan' : sub.status === 'rad_etildi' ? '✕ Rad etilgan' : '⏳ Kutilmoqda'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-[#64748B] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>Xabarlar tarixi: <strong>{sub.messages?.length || 0} ta</strong></span>
                    {sub.messages && sub.messages.some(m => m.attachments && m.attachments.length > 0) && (
                      <span className="text-emerald-600 font-semibold">• Biriktirilgan hujjatlar mavjud</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedChatSubsidy(sub)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Muloqotni Ochish & Hujjat Almashish</span>
                    </button>

                    {sub.status === 'kutilmoqda' && (
                      <>
                        <button
                          onClick={() => approveSubsidy(sub.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tasdiqlash</span>
                        </button>
                        <button
                          onClick={() => rejectSubsidy(sub.id)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Rad etish</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: FARMERS REGISTRY & DIRECT MONITORING */}
      {activeTab === 'farmers_registry' && (
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <Users className="w-5 h-5 text-[#3B82F6]" />
                <span>Yozyovon Tumani Dehqon va Fermerlari Yagona Nazorat Reyestri</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Tomorqa maydonlari, yetishtirayotgan ekinlari, davlat tekshiruvi holati va agronom monitoringi
              </p>
            </div>

            <div className="text-xs text-[#64748B]">
              Jami roʻyxatda: <strong className="text-[#0F172A]">{registeredFarmers.length} nafar dehqon</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0F172A] text-white uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Dehqon / Fermer</th>
                  <th className="py-3 px-4">MFY</th>
                  <th className="py-3 px-4">Telefon</th>
                  <th className="py-3 px-4">Faoliyat Yoʻnalishi</th>
                  <th className="py-3 px-4">Tajribasi</th>
                  <th className="py-3 px-4">Davlat Tasdiq Nishoni</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {registeredFarmers.map(farmer => {
                  const mfyObj = mfyList.find(m => m.id === farmer.mfyId);
                  return (
                    <tr key={farmer.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-4 font-bold text-[#0F172A]">
                        {farmer.name}
                        {farmer.email && <span className="block text-[10px] text-[#64748B] font-normal">{farmer.email}</span>}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#334155]">
                        {mfyObj ? mfyObj.name : `MFY #${farmer.mfyId}`}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-[#0F172A]">
                        {farmer.phone || '+998 90 123 45 67'}
                      </td>
                      <td className="py-3 px-4 text-[#334155]">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium text-[11px]">
                          {farmer.farmType === 'limon' ? '🍋 Limonchilik' : farmer.farmType === 'chorva' ? '🐄 Chorvachilik' : '🌱 Tomorqa & Bogʻdorchilik'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#0F172A]">
                        {farmer.experienceYears || 5} yil
                      </td>
                      <td className="py-3 px-4">
                        {farmer.hasExperienceBadge ? (
                          <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold flex items-center gap-1 w-fit">
                            <Award className="w-3 h-3 text-amber-600 fill-current" />
                            <span>Tasdiqlangan</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#94A3B8]">Berilmagan</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setBadgeModalFarmer({
                              id: farmer.id,
                              name: farmer.name,
                              mfyName: mfyObj?.name || 'Yozyovon'
                            });
                            setBadgeYears(farmer.experienceYears || 15);
                          }}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-[11px] font-bold transition-colors"
                        >
                          🏅 Nishon Berish
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

      {/* TAB: RESOURCE MANAGEMENT (SUV VA O'G'IT TAQSIMOTI) */}
      {activeTab === 'resource_management' && (
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-600" />
                <span>Yozyovon Tumani Agrotexnik Resurslar Taqsimoti</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Markaziy Fargʻona va Ulugʻnor tizimidan sugʻorish suvi navbati, imtiyozli mineral oʻgʻitlar va issiqxona energiya monitoringi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-blue-900">Sugʻorish Suvi Taʼminoti</span>
                <Droplets className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-blue-950">94.2%</div>
              <p className="text-[11px] text-blue-800">
                Markaziy Fargʻona suv ombori va Katta Fargʻona kanali orqali 33 ta MFYga uzluksiz navbat asosida suv yetkazilmoqda.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-emerald-900">Mineral Oʻgʻitlar Kvotasi</span>
                <Sprout className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-950">1,420 tonna</div>
              <p className="text-[11px] text-emerald-800">
                Azot, fosfor, kaliy va sitrus mevalar uchun temir xelati imtiyozli narxlarda dehqon xoʻjaliklariga taqsimlandi.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-amber-900">Qishki Issiqlik Fondi</span>
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-950">850 kVt / m²</div>
              <p className="text-[11px] text-amber-800">
                Issiqxonalarga quyosh panellari oʻrnatish dasturi doirasida 35 nafar dehqonga texnik shart berildi.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
              33 MFY Boʻyicha Navbatdagi Sugʻorish Jadvali (Suv Taqsimoti)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {mfyList.slice(0, 8).map(m => (
                <div key={m.id} className="p-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-xs space-y-1">
                  <div className="font-bold text-[#0F172A] flex items-center justify-between">
                    <span>{m.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Faol</span>
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Navbat: <strong>Dushanba / Payshanba</strong>
                  </div>
                  <div className="text-[10px] text-blue-600 font-semibold">
                    Suv meʼyori: {Math.round(m.dehqonchilikGa * 1.8)} m³/sutka
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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
              <span>Xabarnoma muvaffaqiyatli joʻnatildi va barcha 33 MFY dehqonlariga yetkazildi!</span>
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
              <span>Xabarnomani Barcha 33 MFYga Yuborish</span>
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

      {/* TAB 5: FARMER BADGES & VERIFICATION (DAVLAT TASDIQ NISHONI BERISH) */}
      {activeTab === 'farmer_badges' && (
        <div className="space-y-6">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-6 rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                <Award className="w-3.5 h-3.5 fill-current" />
                <span>Davlat Qishloq Xoʻjaligi Boshqarmasi Vakolati</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Koʻp Yillik Tajribaga Ega Dehqonlarga Tasdiq Nishoni Berish
              </h2>
              <p className="text-amber-100 text-xs leading-relaxed">
                Ushbu davlat tasdiq nishoni Yozyovon tumanida koʻp yillik fidokorona tajribaga ega, 
                yuqori hosildorlikka erishgan usta sitruschi va mirishkor dehqonlarga beriladi. 
                Nishoni bor dehqonlar <strong>Limonchilik Akademiyasi</strong>da boshqa dehqonlar uchun oʻz amaliy tavsiya va koʻrsatmalarini rasmiy eʼlon qilish huquqiga ega boʻladilar.
              </p>
            </div>

            <div className="bg-black/25 backdrop-blur-xs p-4 rounded-lg border border-white/20 text-center min-w-[200px]">
              <div className="text-3xl font-black text-amber-300">
                {registeredFarmers.filter(f => f.hasExperienceBadge).length}
              </div>
              <div className="text-xs text-amber-100 font-semibold uppercase tracking-wider mt-0.5">
                Nishonli Dehqonlar
              </div>
              <div className="text-[10px] text-amber-200/80 mt-1">
                Jami roʻyxatda: {registeredFarmers.length} ta
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={farmerSearch}
                onChange={(e) => setFarmerSearch(e.target.value)}
                placeholder="Dehqon ismi yoki mahallasi..."
                className="w-full pl-9 pr-3 py-2 border rounded-md text-xs bg-[#F8FAFC]"
                id="search-farmer-input"
              />
            </div>

            <div className="text-xs text-[#64748B] flex items-center gap-2">
              <span>Koʻrsatkich:</span>
              <span className="font-bold text-[#0F172A]">{farmerAdvices.length} ta umumiy tavsiya</span>
            </div>
          </div>

          {/* Farmers Registry Table */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F172A] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-bold">Dehqon / Fermer</th>
                    <th className="py-3 px-4 font-bold">Mahalla (MFY)</th>
                    <th className="py-3 px-4 font-bold">Telefon & Aloqa</th>
                    <th className="py-3 px-4 font-bold">Faoliyat Yoʻnalishi</th>
                    <th className="py-3 px-4 font-bold">Davlat Nishoni Maqomi</th>
                    <th className="py-3 px-4 font-bold">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {registeredFarmers
                    .filter(f => 
                      f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
                      f.phone.includes(farmerSearch)
                    )
                    .map(farmer => {
                      const mfy = mfyList.find(m => m.id === farmer.mfyId);
                      const adviceCount = farmerAdvices.filter(a => a.farmerId === farmer.id).length;

                      return (
                        <tr key={farmer.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#0F172A]">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                                {farmer.name.charAt(0)}
                              </div>
                              <div>
                                <div>{farmer.name}</div>
                                <div className="text-[10px] text-[#64748B] font-normal">ID: #{farmer.id}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-[#334155] font-semibold">
                            {mfy ? mfy.name : 'Yozyovon MFY'}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[#64748B]">
                            {farmer.phone}
                          </td>

                          <td className="py-3.5 px-4 text-[#334155]">
                            {farmer.activityField || 'Sitruschilik va tomorqa'}
                          </td>

                          <td className="py-3.5 px-4">
                            {farmer.hasExperienceBadge ? (
                              <div className="inline-flex flex-col gap-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                  <Award className="w-3.5 h-3.5 text-amber-600 fill-current" />
                                  <span>🏅 {farmer.experienceYears || 15} yillik Tajribali Dehqon</span>
                                </span>
                                <span className="text-[10px] text-emerald-700 font-semibold">
                                  ✓ Qoʻllanmaga tavsiya qoʻyish huquqiga ega ({adviceCount} ta koʻrsatma)
                                </span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                <span>Tasdiqlanmagan</span>
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {farmer.hasExperienceBadge ? (
                              <button
                                onClick={() => revokeFarmerBadge(farmer.id)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded text-xs border border-rose-200 transition-colors"
                                title="Nishonni bekor qilish"
                              >
                                Nishonni Bekor Qilish
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setBadgeModalFarmer({
                                    id: farmer.id,
                                    name: farmer.name,
                                    mfyName: mfy ? mfy.name : 'Yozyovon MFY'
                                  });
                                  setBadgeYears(15);
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded text-xs shadow-xs flex items-center gap-1.5 transition-all"
                              >
                                <Award className="w-3.5 h-3.5 fill-current" />
                                <span>🏅 Tasdiq Nishoni Berish</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Grant Badge Modal */}
      {badgeModalFarmer && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500 fill-current" />
                <h3 className="font-bold text-sm text-[#0F172A] uppercase">
                  Dehqonga Davlat Tasdiq Nishonini Berish
                </h3>
              </div>
              <button onClick={() => setBadgeModalFarmer(null)} className="text-[#64748B] hover:text-[#0F172A]">
                ✕
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-xs space-y-1">
              <div className="text-amber-900 font-bold text-sm">
                {badgeModalFarmer.name}
              </div>
              <div className="text-amber-800">
                Mahallasi: {badgeModalFarmer.mfyName}
              </div>
              <div className="text-[11px] text-amber-700 pt-1 border-t border-amber-200/60 mt-1">
                Ushbu nishon topshirilgandan soʻng, dehqon Yozyovon Limonchilik Akademiyasiga oʻzining ilmiy-amaliy tavsiyalarini kiritish imkoniyatiga ega boʻladi.
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!badgeModalFarmer) return;
                grantFarmerBadge(badgeModalFarmer.id, badgeYears, badgeCustomTitle);
                setBadgeModalFarmer(null);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#334155] mb-1">
                  Koʻp Yillik Tajriba (Yillarda) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="3"
                    max="60"
                    required
                    value={badgeYears}
                    onChange={(e) => setBadgeYears(Number(e.target.value))}
                    className="w-28 px-3 py-2 border rounded-md font-bold text-center text-sm bg-[#F8FAFC]"
                  />
                  <span className="text-[#64748B] font-medium">yil tajribaga ega</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {[10, 15, 20, 25].map(yr => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setBadgeYears(yr)}
                      className={`px-2 py-1 rounded text-[11px] font-bold border transition-colors ${
                        badgeYears === yr 
                          ? 'bg-amber-500 text-white border-amber-600' 
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {yr} yil
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#334155] mb-1">
                  Nishon Unvoni / Maqomi
                </label>
                <input
                  type="text"
                  required
                  value={badgeCustomTitle}
                  onChange={(e) => setBadgeCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC] text-xs font-semibold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBadgeModalFarmer(null)}
                  className="px-4 py-2 border border-[#CBD5E1] text-[#64748B] font-semibold rounded-md hover:bg-[#F8FAFC]"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-md shadow-xs flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4 fill-current" />
                  <span>Nishonni Tasdiqlash & Berish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB: WEATHER API CONTROL (Davlat organi ob-havo manbasini belgilash) */}
      {activeTab === 'weather_control' && (
        <div className="bg-white p-6 sm:p-7 rounded-lg border border-[#E2E8F0] shadow-xs space-y-6" id="gov-weather-api-control-panel">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-[#3B82F6] rounded-md border border-blue-200">
                <Sun className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#0F172A] uppercase tracking-tight flex items-center gap-2">
                  <span>Dehqonlar Uchun Agro-Ob-havo API Meteorologiya Manbasini Belgilash</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Davlat organi tomonidan 33 ta MFY dehqonlari koʻradigan ob-havo va mikroiqlim manbasini tanlash
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#64748B]">Hozirda barcha dehqonlar uchun faol:</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {weatherProvider === 'accuweather' ? 'AccuWeather API (Faol)' : 'Tomorrow.io API (Faol)'}
              </span>
            </div>
          </div>

          {weatherNotice && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-md text-xs font-semibold flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{weatherNotice}</span>
              </div>
              <button onClick={() => setWeatherNotice(null)} className="text-emerald-700 hover:text-emerald-950">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: AccuWeather */}
            <div className={`p-5 rounded-lg border transition-all ${
              weatherProvider === 'accuweather'
                ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-2 ring-amber-400/20'
                : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded">
                    <Sun className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0F172A]">AccuWeather International API</h4>
                    <span className="text-[11px] text-[#64748B]">Global meteorologiya va mikroiqlim</span>
                  </div>
                </div>
                {weatherProvider === 'accuweather' && (
                  <span className="px-2 py-0.5 bg-amber-500 text-white rounded text-[10px] font-black uppercase tracking-wider">
                    Faol Manba
                  </span>
                )}
              </div>

              <div className="py-4 space-y-2.5 text-xs text-[#334155]">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-[#64748B]">Tuman stansiyasi:</span>
                  <span className="font-bold font-mono text-[#0F172A]">Yaz'yavan (ID: 353257)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-[#64748B]">Koordinatalar:</span>
                  <span className="font-semibold text-[#0F172A]">40.6617° N, 71.6444° E</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-[#64748B]">Dehqonlar uchun imkoniyat:</span>
                  <span className="font-semibold text-emerald-700">5 kunlik agro-prognoz, qulay purkash indeksi</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B]">Maʼlumot yangilanishi:</span>
                  <span className="font-semibold text-[#0F172A]">Har 30 daqiqada avtomatik</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setWeatherProvider('accuweather');
                  setWeatherNotice('Barcha dehqonlar uchun asosiy ob-havo manbasi sifatida AccuWeather API belgilandi!');
                  setTimeout(() => setWeatherNotice(null), 4000);
                }}
                disabled={weatherProvider === 'accuweather'}
                className={`w-full py-2.5 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  weatherProvider === 'accuweather'
                    ? 'bg-amber-600 text-white cursor-default'
                    : 'bg-[#0F172A] hover:bg-[#1E293B] text-white active:scale-98 shadow-xs'
                }`}
              >
                {weatherProvider === 'accuweather' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ushbu Manba Dehqonlarga Biriktirilgan</span>
                  </>
                ) : (
                  <>
                    <Radio className="w-4 h-4" />
                    <span>AccuWeather'ni Dehqonlarga Tanlash</span>
                  </>
                )}
              </button>
            </div>

            {/* Card 2: Tomorrow.io */}
            <div className={`p-5 rounded-lg border transition-all ${
              weatherProvider === 'tomorrow'
                ? 'border-blue-500 bg-blue-50/40 shadow-sm ring-2 ring-blue-400/20'
                : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-100 text-blue-800 rounded">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0F172A]">Tomorrow.io Weather API</h4>
                    <span className="text-[11px] text-[#64748B]">Giperlokal stansiyalar & yogʻin radari</span>
                  </div>
                </div>
                {weatherProvider === 'tomorrow' && (
                  <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-black uppercase tracking-wider">
                    Faol Manba
                  </span>
                )}
              </div>

              <div className="py-4 space-y-2.5 text-xs text-[#334155]">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-[#64748B]">API Versiyasi:</span>
                  <span className="font-bold font-mono text-[#0F172A]">v4/weather/realtime</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-[#64748B]">Koordinatalar:</span>
                  <span className="font-semibold text-[#0F172A]">40.6617° N, 71.6444° E</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-[#64748B]">Dehqonlar uchun imkoniyat:</span>
                  <span className="font-semibold text-blue-700">1-soatlik radar, UV indeks, bugʻlanish hisobi</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B]">Maʼlumot yangilanishi:</span>
                  <span className="font-semibold text-[#0F172A]">Har 15 daqiqada real vaqt</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setWeatherProvider('tomorrow');
                  setWeatherNotice('Barcha dehqonlar uchun asosiy ob-havo manbasi sifatida Tomorrow.io API belgilandi!');
                  setTimeout(() => setWeatherNotice(null), 4000);
                }}
                disabled={weatherProvider === 'tomorrow'}
                className={`w-full py-2.5 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  weatherProvider === 'tomorrow'
                    ? 'bg-blue-600 text-white cursor-default'
                    : 'bg-[#0F172A] hover:bg-[#1E293B] text-white active:scale-98 shadow-xs'
                }`}
              >
                {weatherProvider === 'tomorrow' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ushbu Manba Dehqonlarga Biriktirilgan</span>
                  </>
                ) : (
                  <>
                    <Radio className="w-4 h-4" />
                    <span>Tomorrow.io'ni Dehqonlarga Tanlash</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Additional Info Box */}
          <div className="p-4 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#0F172A] block mb-0.5">Davlat Agro-Meteorologiya Qoidasi:</span>
              <p className="leading-relaxed">
                Bu yerdan belgilangan API barcha 33 ta MFYdagi dehqonlarning shaxsiy xoʻjaligi va "Agro-Ob-havo" boʻlimida avtomatik koʻrinadi. Dehqon foydalanuvchilar oʻzlari ob-havo manbasini almashtira olmaydilar, chunki agrotexnik koʻrsatmalar davlat tomonidan tasdiqlangan yagona manbadan olinadi.
              </p>
            </div>
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

      {/* Farmer - Gov Direct Chat & Document Sharing Modal */}
      {selectedChatSubsidy && (
        <FarmerGovChatModal
          subsidy={selectedChatSubsidy}
          onClose={() => setSelectedChatSubsidy(null)}
        />
      )}

    </div>
  );
};
