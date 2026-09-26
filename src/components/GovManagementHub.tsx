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
  Radio,
  Phone,
  Mail,
  Save,
  Edit3,
  SlidersHorizontal,
  Eye,
  Cpu,
  Trash2,
  Check,
  Upload,
  FileUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MFYData, SubsidyApplication, ExportCertificate, AgroDiseaseRecord } from '../types';
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
    setWeatherProvider,
    siteSettings,
    updateSiteSettings,
    govAgroDiseases,
    addGovAgroDisease,
    updateGovAgroDisease,
    deleteGovAgroDisease,
    resetGovAgroDiseasesToDefault
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'subsidies' | 'farmers_registry' | 'broadcast' | 'certs' | 'mfy_matrix' | 'farmer_badges' | 'weather_control' | 'site_appearance' | 'ai_knowledge_base'>('overview');
  const [weatherNotice, setWeatherNotice] = useState<string | null>(null);
  const [selectedChatSubsidy, setSelectedChatSubsidy] = useState<SubsidyApplication | null>(null);

  // Site Appearance & Stats Customization Form state
  const [siteForm, setSiteForm] = useState({
    contactPhone: siteSettings?.contactPhone || '+998 (73) 502-12-34',
    contactEmail: siteSettings?.contactEmail || 'info@yozyovon-agro.uz',
    contactAddress: siteSettings?.contactAddress || "Farg'ona viloyati, Yozyovon tumani, Mustaqillik shoh ko'chasi, 1-uy",
    workingHours: siteSettings?.workingHours || 'Dushanba - Juma: 08:00 - 17:00',
    telegramBot: siteSettings?.telegramBot || '@YozyovonAgroBot',
    statsDisplayMode: (siteSettings?.statsDisplayMode || 'real') as 'real' | 'custom',
    customStats: {
      mfyCount: siteSettings?.customStats?.mfyCount || '33',
      mfySub: siteSettings?.customStats?.mfySub || 'Yozyovon tumani (4 ta sektor)',
      farmersCount: siteSettings?.customStats?.farmersCount || '580+',
      farmersSub: siteSettings?.customStats?.farmersSub || 'Faol foydalanuvchi',
      lemonTrees: siteSettings?.customStats?.lemonTrees || '185K+',
      lemonSub: siteSettings?.customStats?.lemonSub || 'Daraxt monitoringi',
      landArea: siteSettings?.customStats?.landArea || '14K+',
      landSub: siteSettings?.customStats?.landSub || "Qishloq xo'jaligi"
    }
  });
  const [siteSavedNotice, setSiteSavedNotice] = useState<string | null>(null);

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      contactPhone: siteForm.contactPhone,
      contactEmail: siteForm.contactEmail,
      contactAddress: siteForm.contactAddress,
      workingHours: siteForm.workingHours,
      telegramBot: siteForm.telegramBot,
      statsDisplayMode: siteForm.statsDisplayMode,
      customStats: siteForm.customStats
    });
    setSiteSavedNotice('Websayt koʻrinishi va aloqa maʼlumotlari muvaffaqiyatli yangilandi!');
    setTimeout(() => setSiteSavedNotice(null), 4000);
  };

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

  // AI Knowledge Base (Kasalliklar & Dorilar Registri) form states
  const [showAddDiseaseModal, setShowAddDiseaseModal] = useState(false);
  const [editingDiseaseId, setEditingDiseaseId] = useState<string | null>(null);
  const [diseaseSearch, setDiseaseSearch] = useState('');
  const [diseaseFilterPart, setDiseaseFilterPart] = useState<'all' | 'leaf' | 'fruit' | 'branch'>('all');
  const [diseaseForm, setDiseaseForm] = useState<{
    plantType: 'limon' | 'mevali_daraxt' | 'sabzavot' | 'uzum' | 'boshqa_kochat';
    diseaseName: string;
    targetPart: 'leaf' | 'fruit' | 'branch' | 'all';
    severityLevel: 'high' | 'medium' | 'low';
    visualSymptoms: string;
    medicines: string;
    dosageAndUsage: string;
    preventiveMeasures: string;
    imageUrl: string;
  }>({
    plantType: 'limon',
    diseaseName: '',
    targetPart: 'leaf',
    severityLevel: 'high',
    visualSymptoms: '',
    medicines: '',
    dosageAndUsage: '',
    preventiveMeasures: '',
    imageUrl: ''
  });
  const [diseaseSuccessMsg, setDiseaseSuccessMsg] = useState<string | null>(null);

  // Fayl orqali ommaviy kiritish (Shablon & AI Saralash) holatlari
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchMode, setBatchMode] = useState<'ai_text' | 'template_json'>('ai_text');
  const [batchRawText, setBatchRawText] = useState('');
  const [isAiParsingBatch, setIsAiParsingBatch] = useState(false);
  const [batchParsedRecords, setBatchParsedRecords] = useState<Array<{
    plantType: 'limon' | 'mevali_daraxt' | 'sabzavot' | 'uzum' | 'boshqa_kochat';
    diseaseName: string;
    targetPart: 'leaf' | 'fruit' | 'branch' | 'all';
    severityLevel: 'high' | 'medium' | 'low';
    visualSymptoms: string[];
    medicines: string;
    dosageAndUsage: string;
    preventiveMeasures: string;
  }>>([]);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [batchFileName, setBatchFileName] = useState<string | null>(null);

  const handleBatchFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBatchFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      setBatchRawText(text);
      if (file.name.endsWith('.json')) {
        setBatchMode('template_json');
        try {
          const json = JSON.parse(text);
          if (Array.isArray(json)) {
            setBatchParsedRecords(json);
            setBatchError(null);
          }
        } catch {
          setBatchError("Yuklangan fayl JSON standarti boʻyicha toʻgʻri formatda emas.");
        }
      }
    };
    reader.readAsText(file);
  };

  const runAiParse = async () => {
    if (!batchRawText.trim()) {
      setBatchError("Iltimos, avval matn kiriting yoki fayl yuklang.");
      return;
    }
    setIsAiParsingBatch(true);
    setBatchError(null);
    try {
      const res = await fetch('/api/ai-parse-diseases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textContent: batchRawText })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.diseases) && data.diseases.length > 0) {
        setBatchParsedRecords(data.diseases);
        setBatchError(null);
      } else {
        setBatchError(data.message || "Fayldan kasallik ma'lumotlari ajratib olinmadi.");
      }
    } catch (err: any) {
      setBatchError("AI tahlilida server bilan aloqa xatosi: " + err.message);
    } finally {
      setIsAiParsingBatch(false);
    }
  };

  const handleDownloadSampleTemplate = () => {
    const sample = [
      {
        plantType: "limon",
        diseaseName: "Limon Xlorozi (Temir tanqisligi)",
        targetPart: "leaf",
        severityLevel: "medium",
        visualSymptoms: ["Yosh barglar sargʻayadi", "Barg tomirlari yashil boʻlib qoladi"],
        medicines: "Ferrovit yoki Temir xelati (Fe-EDDHA)",
        dosageAndUsage: "10 litr suvga 10-15g aralashtirib bargdan purkash",
        preventiveMeasures: "Tuproq pH darajasini 6.5-7.0 atrofida ushlash"
      },
      {
        plantType: "mevali_daraxt",
        diseaseName: "Meva Qoʻtiri (Venturiya)",
        targetPart: "fruit",
        severityLevel: "high",
        visualSymptoms: ["Meva yuzasida qora zaytunrang dogʻlar", "Meva poʻstlogʻi yorilishi"],
        medicines: "Skor yoki Xorus fungitsidi",
        dosageAndUsage: "10 litr suvga 2ml preparat purkaladi",
        preventiveMeasures: "Daraxt tagidagi xazonlarni yoqish va erta bahorda mis kuporosi bilan profilaktika"
      }
    ];
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yozyovon_kasalliklar_shablon.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyBatchImport = () => {
    if (batchParsedRecords.length === 0) return;
    batchParsedRecords.forEach(item => {
      addGovAgroDisease({
        plantType: item.plantType || 'limon',
        diseaseName: item.diseaseName,
        targetPart: item.targetPart || 'leaf',
        severityLevel: item.severityLevel || 'medium',
        visualSymptoms: Array.isArray(item.visualSymptoms) ? item.visualSymptoms : [String(item.visualSymptoms)],
        medicines: item.medicines,
        dosageAndUsage: item.dosageAndUsage || 'Meʼyor boʻyicha purkash',
        preventiveMeasures: item.preventiveMeasures || 'Agrotexnik nazorat',
        verifiedByGov: true
      });
    });
    setDiseaseSuccessMsg(`${batchParsedRecords.length} ta kasallik va rasmiy dori AI Bilimlar Bazasiga muvaffaqiyatli yuklandi!`);
    setShowBatchModal(false);
    setBatchParsedRecords([]);
    setBatchRawText('');
    setBatchFileName(null);
    setTimeout(() => setDiseaseSuccessMsg(null), 5000);
  };

  const handleSaveDisease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diseaseForm.diseaseName.trim() || !diseaseForm.medicines.trim()) return;

    const symptomsArray = diseaseForm.visualSymptoms
      ? diseaseForm.visualSymptoms.split('\n').map(s => s.trim()).filter(Boolean)
      : ['Barg va novdalarda kasallik belgilari'];

    if (editingDiseaseId) {
      updateGovAgroDisease(editingDiseaseId, {
        plantType: diseaseForm.plantType,
        diseaseName: diseaseForm.diseaseName,
        targetPart: diseaseForm.targetPart,
        severityLevel: diseaseForm.severityLevel,
        visualSymptoms: symptomsArray,
        medicines: diseaseForm.medicines,
        dosageAndUsage: diseaseForm.dosageAndUsage,
        preventiveMeasures: diseaseForm.preventiveMeasures,
        imageUrl: diseaseForm.imageUrl || undefined
      });
      setDiseaseSuccessMsg('Kasallik va rasmiy dori maʼlumotlari muvaffaqiyatli yangilandi!');
    } else {
      addGovAgroDisease({
        plantType: diseaseForm.plantType,
        diseaseName: diseaseForm.diseaseName,
        targetPart: diseaseForm.targetPart,
        severityLevel: diseaseForm.severityLevel,
        visualSymptoms: symptomsArray,
        medicines: diseaseForm.medicines,
        dosageAndUsage: diseaseForm.dosageAndUsage,
        preventiveMeasures: diseaseForm.preventiveMeasures,
        imageUrl: diseaseForm.imageUrl || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
        verifiedByGov: true
      });
      setDiseaseSuccessMsg('Yangi kasallik va rasmiy dori vositasi AI Bilimlar Bazasiga kiritildi!');
    }

    setShowAddDiseaseModal(false);
    setEditingDiseaseId(null);
    setDiseaseForm({
      plantType: 'limon',
      diseaseName: '',
      targetPart: 'leaf',
      severityLevel: 'high',
      visualSymptoms: '',
      medicines: '',
      dosageAndUsage: '',
      preventiveMeasures: '',
      imageUrl: ''
    });
    setTimeout(() => setDiseaseSuccessMsg(null), 4000);
  };

  const startEditDisease = (record: AgroDiseaseRecord) => {
    setEditingDiseaseId(record.id);
    setDiseaseForm({
      plantType: record.plantType,
      diseaseName: record.diseaseName,
      targetPart: record.targetPart,
      severityLevel: record.severityLevel,
      visualSymptoms: record.visualSymptoms ? record.visualSymptoms.join('\n') : '',
      medicines: record.medicines,
      dosageAndUsage: record.dosageAndUsage,
      preventiveMeasures: record.preventiveMeasures,
      imageUrl: record.imageUrl || ''
    });
    setShowAddDiseaseModal(true);
  };

  // Stats calculation
  const totalLimon = (mfyList || []).reduce((acc, m) => acc + (m.limonDaraxtlari || 0), 0);
  const totalChorva = (mfyList || []).reduce((acc, m) => acc + (m.chorvaBoshlari || 0), 0);
  const totalMaydon = (mfyList || []).reduce((acc, m) => acc + (m.dehqonchilikGa || 0), 0);
  const totalFarmers = (mfyList || []).reduce((acc, m) => acc + (m.farmersCount || 0), 0);

  const pendingSubsidies = (subsidies || []).filter(s => s.status === 'kutilmoqda');

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

      {/* Haqiqiy Davlat Boshqaruv Markazi Pulti - Katta, Qulay Boshqaruv Tugmalari */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <button
          onClick={() => setActiveTab('farmers_registry')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between shadow-xs group ${
            activeTab === 'farmers_registry'
              ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-blue-500/20'
              : 'bg-white hover:bg-slate-50 border-[#E2E8F0] text-[#0F172A]'
          }`}
          id="cmd-farmers-registry-btn"
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-lg ${activeTab === 'farmers_registry' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
              <Users className="w-5 h-5" />
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'farmers_registry' ? 'bg-slate-800 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
              {registeredFarmers.length} ta
            </span>
          </div>
          <div className="mt-3">
            <div className="font-bold text-sm leading-tight">Dehqonlar Nazorati</div>
            <div className={`text-[11px] mt-0.5 ${activeTab === 'farmers_registry' ? 'text-slate-300' : 'text-[#64748B]'}`}>
              33 MFY fermerlar reyestri
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('subsidies')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between shadow-xs group ${
            activeTab === 'subsidies'
              ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white hover:bg-slate-50 border-[#E2E8F0] text-[#0F172A]'
          }`}
          id="cmd-subsidies-btn"
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-lg ${activeTab === 'subsidies' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            {pendingSubsidies.length > 0 ? (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-rose-500 text-white font-mono animate-pulse">
                {pendingSubsidies.length} yangi
              </span>
            ) : (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'subsidies' ? 'bg-slate-800 text-emerald-300' : 'bg-slate-100 text-slate-600'}`}>
                Faol
              </span>
            )}
          </div>
          <div className="mt-3">
            <div className="font-bold text-sm leading-tight">Subsidiyalar & Muloqot</div>
            <div className={`text-[11px] mt-0.5 ${activeTab === 'subsidies' ? 'text-slate-300' : 'text-[#64748B]'}`}>
              Arizalar va monitoring
            </div>
          </div>
        </button>


        <button
          onClick={() => setActiveTab('broadcast')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between shadow-xs group ${
            activeTab === 'broadcast'
              ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-amber-500/20'
              : 'bg-white hover:bg-slate-50 border-[#E2E8F0] text-[#0F172A]'
          }`}
          id="cmd-broadcast-btn"
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-lg ${activeTab === 'broadcast' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-600'}`}>
              <Send className="w-5 h-5" />
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'broadcast' ? 'bg-slate-800 text-amber-300' : 'bg-amber-100 text-amber-800'}`}>
              SMS / Push
            </span>
          </div>
          <div className="mt-3">
            <div className="font-bold text-sm leading-tight">Xabarnoma Yuborish</div>
            <div className={`text-[11px] mt-0.5 ${activeTab === 'broadcast' ? 'text-slate-300' : 'text-[#64748B]'}`}>
              Ogohlantirish va tavsiyalar
            </div>
          </div>
        </button>
      </div>

      {/* Ikkinchi Qator Katta Boshqaruv Tugmalari */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <button
          onClick={() => setActiveTab('certs')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between shadow-xs group ${
            activeTab === 'certs'
              ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-indigo-500/20'
              : 'bg-white hover:bg-slate-50 border-[#E2E8F0] text-[#0F172A]'
          }`}
          id="cmd-certs-btn"
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-lg ${activeTab === 'certs' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
              <Award className="w-5 h-5" />
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'certs' ? 'bg-slate-800 text-indigo-300' : 'bg-indigo-100 text-indigo-800'}`}>
              QR-kod
            </span>
          </div>
          <div className="mt-3">
            <div className="font-bold text-sm leading-tight">Eksport Sertifikatlari</div>
            <div className={`text-[11px] mt-0.5 ${activeTab === 'certs' ? 'text-slate-300' : 'text-[#64748B]'}`}>
              Fitosanitariya va sifat
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('mfy_matrix')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between shadow-xs group ${
            activeTab === 'mfy_matrix'
              ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-purple-500/20'
              : 'bg-white hover:bg-slate-50 border-[#E2E8F0] text-[#0F172A]'
          }`}
          id="cmd-mfy-matrix-btn"
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-lg ${activeTab === 'mfy_matrix' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600'}`}>
              <Layers className="w-5 h-5" />
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'mfy_matrix' ? 'bg-slate-800 text-purple-300' : 'bg-purple-100 text-purple-800'}`}>
              33 MFY
            </span>
          </div>
          <div className="mt-3">
            <div className="font-bold text-sm leading-tight">MFY Maʻmuriy Reyestri</div>
            <div className={`text-[11px] mt-0.5 ${activeTab === 'mfy_matrix' ? 'text-slate-300' : 'text-[#64748B]'}`}>
              Chegara va profil sozlamalari
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('farmer_badges')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between shadow-xs group ${
            activeTab === 'farmer_badges'
              ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-amber-500/20'
              : 'bg-white hover:bg-slate-50 border-[#E2E8F0] text-[#0F172A]'
          }`}
          id="cmd-farmer-badges-btn"
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-lg ${activeTab === 'farmer_badges' ? 'bg-amber-500 text-slate-950' : 'bg-amber-50 text-amber-600'}`}>
              <Award className="w-5 h-5 fill-current" />
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'farmer_badges' ? 'bg-slate-800 text-amber-300' : 'bg-amber-100 text-amber-900'}`}>
              {registeredFarmers.filter(f => f.hasExperienceBadge).length} ta
            </span>
          </div>
          <div className="mt-3">
            <div className="font-bold text-sm leading-tight">Tasdiq Nishonlari</div>
            <div className={`text-[11px] mt-0.5 ${activeTab === 'farmer_badges' ? 'text-slate-300' : 'text-[#64748B]'}`}>
              Tajribali dehqon maqomi
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('weather_control')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between shadow-xs group ${
            activeTab === 'weather_control'
              ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-blue-500/20'
              : 'bg-white hover:bg-slate-50 border-[#E2E8F0] text-[#0F172A]'
          }`}
          id="cmd-weather-control-btn"
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-lg ${activeTab === 'weather_control' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
              <Sun className="w-5 h-5" />
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'weather_control' ? 'bg-slate-800 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
              API
            </span>
          </div>
          <div className="mt-3">
            <div className="font-bold text-sm leading-tight">Ob-havo API Boshqaruvi</div>
            <div className={`text-[11px] mt-0.5 ${activeTab === 'weather_control' ? 'text-slate-300' : 'text-[#64748B]'}`}>
              {weatherProvider === 'accuweather' ? 'AccuWeather' : 'Tomorrow.io'}
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('site_appearance')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between shadow-xs group ${
            activeTab === 'site_appearance'
              ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white hover:bg-slate-50 border-[#E2E8F0] text-[#0F172A]'
          }`}
          id="cmd-site-appearance-btn"
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-lg ${activeTab === 'site_appearance' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
              <Globe className="w-5 h-5" />
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'site_appearance' ? 'bg-slate-800 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>
              Sayt & Ko'rsatkich
            </span>
          </div>
          <div className="mt-3">
            <div className="font-bold text-sm leading-tight">Websayt Koʻrinishi & Aloqa</div>
            <div className={`text-[11px] mt-0.5 ${activeTab === 'site_appearance' ? 'text-slate-300' : 'text-[#64748B]'}`}>
              Aloqa, joylashuv & 3-rasm kartalari
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('ai_knowledge_base')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between shadow-xs group ${
            activeTab === 'ai_knowledge_base'
              ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-violet-500/20'
              : 'bg-white hover:bg-slate-50 border-[#E2E8F0] text-[#0F172A]'
          }`}
          id="cmd-ai-knowledge-base-btn"
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-lg ${activeTab === 'ai_knowledge_base' ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-600'}`}>
              <Cpu className="w-5 h-5" />
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'ai_knowledge_base' ? 'bg-slate-800 text-violet-300' : 'bg-violet-100 text-violet-800'}`}>
              {govAgroDiseases.length} ta
            </span>
          </div>
          <div className="mt-3">
            <div className="font-bold text-sm leading-tight">AI Skaner Bilimlar Bazasi</div>
            <div className={`text-[11px] mt-0.5 ${activeTab === 'ai_knowledge_base' ? 'text-slate-300' : 'text-[#64748B]'}`}>
              Kasalliklar, belgilar & dorilar
            </div>
          </div>
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

      {/* TAB: SITE APPEARANCE & CONTACTS & 3-IMAGE STATS CUSTOMIZATION */}
      {activeTab === 'site_appearance' && (
        <div className="space-y-6">
          {/* Header info */}
          <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider">
                  Websayt Koʻrinishi, Aloqa Vositalari & Bosh Sahifa Koʻrsatkichlari
                </h3>
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                Davlat organi xodimlari uchun saytdagi rasmiy aloqa rekvizitlari, joylashuv hamda mehmonlar kirganda bosh sahifadagi 4 ta asosiy kartani real yoki qoʻlda boshqarish boʻlimi.
              </p>
            </div>
            {siteSavedNotice && (
              <div className="px-3 py-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{siteSavedNotice}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveSiteSettings} className="space-y-6">
            
            {/* 1. Aloqa vositalari va Joylashuv */}
            <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="pb-3 border-b border-[#E2E8F0] flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-sm text-[#0F172A]">
                  1. Rasmiy Aloqa Vositalari & Joylashuv Manzili
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Rasmiy Aloqa Telefoni *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={siteForm.contactPhone}
                    onChange={(e) => setSiteForm({ ...siteForm, contactPhone: e.target.value })}
                    placeholder="+998 (73) 502-12-34"
                    className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC] text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                    id="site-phone-input"
                  />
                  <p className="text-[11px] text-[#64748B] mt-0.5">Bosh sahifa, footer va maʼlumotnomalarda koʻrsatiladi</p>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Elektron Pochta (Email) *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={siteForm.contactEmail}
                    onChange={(e) => setSiteForm({ ...siteForm, contactEmail: e.target.value })}
                    placeholder="info@yozyovon-agro.uz"
                    className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC] text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                    id="site-email-input"
                  />
                  <p className="text-[11px] text-[#64748B] mt-0.5">Davlat idorasi rasmiy elektron pochta manzili</p>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-sky-600" />
                    <span>Rasmiy Telegram Bot / Kanal</span>
                  </label>
                  <input
                    type="text"
                    value={siteForm.telegramBot}
                    onChange={(e) => setSiteForm({ ...siteForm, telegramBot: e.target.value })}
                    placeholder="@YozyovonAgroBot"
                    className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC] text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                    id="site-telegram-input"
                  />
                  <p className="text-[11px] text-[#64748B] mt-0.5">Dehqonlar bilan tezkor aloqa uchun</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#0F172A] mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Davlat Idorasi Joylashuvi & Pochta Manzili *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={siteForm.contactAddress}
                    onChange={(e) => setSiteForm({ ...siteForm, contactAddress: e.target.value })}
                    placeholder="Farg'ona viloyati, Yozyovon tumani, Mustaqillik shoh ko'chasi, 1-uy"
                    className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC] text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                    id="site-address-input"
                  />
                  <p className="text-[11px] text-[#64748B] mt-0.5">Bosh sahifa footerida dehqonlar va mehmonlarga koʻrinadigan aniq manzil</p>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ish Tartibi & Qabul Vaqti</span>
                  </label>
                  <input
                    type="text"
                    value={siteForm.workingHours}
                    onChange={(e) => setSiteForm({ ...siteForm, workingHours: e.target.value })}
                    placeholder="Dushanba - Juma: 08:00 - 17:00"
                    className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC] text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                    id="site-hours-input"
                  />
                  <p className="text-[11px] text-[#64748B] mt-0.5">Fuqarolarni qabul qilish va ish vaqti</p>
                </div>
              </div>
            </div>

            {/* 2. Bosh Sahifa Ko'rsatkichlari (3-rasm: 33 MFY, 580+ Fermer, 185K+ Limon, 14K+ ga) */}
            <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-5">
              <div className="pb-3 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                  <div>
                    <h4 className="font-bold text-sm text-[#0F172A]">
                      2. Mehmonlar Kirgandagi Bosh Sahifa Koʻrsatkichlari (3-rasm kartalari)
                    </h4>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Bosh sahifadagi 4 ta asosiy kartani haqiqiy real maʼlumotlar asosida avtomatik yoki qoʻlda koʻrsatish
                    </p>
                  </div>
                </div>

                {/* Switcher Mode: Real vs Custom */}
                <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setSiteForm({ ...siteForm, statsDisplayMode: 'real' })}
                    className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                      siteForm.statsDisplayMode === 'real'
                        ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Real Baza Maʼlumotlari</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSiteForm({ ...siteForm, statsDisplayMode: 'custom' })}
                    className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                      siteForm.statsDisplayMode === 'custom'
                        ? 'bg-white text-blue-700 shadow-xs border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Qoʻlda Tahrirlash (Maxsus)</span>
                  </button>
                </div>
              </div>

              {/* Status explanation */}
              {siteForm.statsDisplayMode === 'real' ? (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-900 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Real Vaqtli Baza Rejimi Faol:</span>
                    <p className="mt-0.5 text-emerald-800">
                      Bosh sahifadagi 4 ta karta tuman reyestridagi aniq MFYlar soni ({mfyList.length} ta), roʻyxatdagi fermerlar soni ({580 + registeredFarmers.length}+), barcha 33 MFYdagi limon daraxtlari yigʻindisi ({Math.round(mfyList.reduce((s, m) => s + (m.limonDaraxtlari || 0), 0) / 1000)}K+) va ekin yerlari maydonidan ({Math.round(mfyList.reduce((s, m) => s + (m.dehqonchilikGa || 0), 0) / 1000)}K+ ga) avtomatik hisoblab chiqarilmoqda.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-900 flex items-start gap-2.5">
                  <Edit3 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Qoʻlda Tahrirlash Rejimi Faol:</span>
                    <p className="mt-0.5 text-blue-800">
                      Quyidagi maydonlarga kiritgan istalgan koʻrsatkich va izohlaringiz toʻgʻridan-toʻgʻri vebsayt bosh sahifasiga tashrif buyurgan barcha mehmonlarga koʻrinadi.
                    </p>
                  </div>
                </div>
              )}

              {/* Custom Form Inputs (Shown when custom is selected) */}
              {siteForm.statsDisplayMode === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs">
                  {/* Card 1: MFY */}
                  <div className="bg-white p-3.5 rounded-md border border-[#E2E8F0] space-y-2">
                    <div className="font-bold text-[#0F172A] flex items-center justify-between">
                      <span>1-Karta: MFY</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">MFY</span>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#64748B] mb-0.5">Asosiy Koʻrsatkich:</label>
                      <input
                        type="text"
                        value={siteForm.customStats.mfyCount}
                        onChange={(e) => setSiteForm({
                          ...siteForm,
                          customStats: { ...siteForm.customStats, mfyCount: e.target.value }
                        })}
                        placeholder="33"
                        className="w-full px-2.5 py-1.5 border rounded bg-slate-50 font-black text-blue-600 text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#64748B] mb-0.5">Izoh (Sub matn):</label>
                      <input
                        type="text"
                        value={siteForm.customStats.mfySub}
                        onChange={(e) => setSiteForm({
                          ...siteForm,
                          customStats: { ...siteForm.customStats, mfySub: e.target.value }
                        })}
                        placeholder="Yozyovon tumani (4 ta sektor)"
                        className="w-full px-2.5 py-1.5 border rounded bg-slate-50 text-slate-700 text-xs"
                      />
                    </div>
                  </div>

                  {/* Card 2: Fermer */}
                  <div className="bg-white p-3.5 rounded-md border border-[#E2E8F0] space-y-2">
                    <div className="font-bold text-[#0F172A] flex items-center justify-between">
                      <span>2-Karta: Fermer</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Fermer</span>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#64748B] mb-0.5">Asosiy Koʻrsatkich:</label>
                      <input
                        type="text"
                        value={siteForm.customStats.farmersCount}
                        onChange={(e) => setSiteForm({
                          ...siteForm,
                          customStats: { ...siteForm.customStats, farmersCount: e.target.value }
                        })}
                        placeholder="580+"
                        className="w-full px-2.5 py-1.5 border rounded bg-slate-50 font-black text-blue-600 text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#64748B] mb-0.5">Izoh (Sub matn):</label>
                      <input
                        type="text"
                        value={siteForm.customStats.farmersSub}
                        onChange={(e) => setSiteForm({
                          ...siteForm,
                          customStats: { ...siteForm.customStats, farmersSub: e.target.value }
                        })}
                        placeholder="Faol foydalanuvchi"
                        className="w-full px-2.5 py-1.5 border rounded bg-slate-50 text-slate-700 text-xs"
                      />
                    </div>
                  </div>

                  {/* Card 3: Limon */}
                  <div className="bg-white p-3.5 rounded-md border border-[#E2E8F0] space-y-2">
                    <div className="font-bold text-[#0F172A] flex items-center justify-between">
                      <span>3-Karta: Limon</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Limon</span>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#64748B] mb-0.5">Asosiy Koʻrsatkich:</label>
                      <input
                        type="text"
                        value={siteForm.customStats.lemonTrees}
                        onChange={(e) => setSiteForm({
                          ...siteForm,
                          customStats: { ...siteForm.customStats, lemonTrees: e.target.value }
                        })}
                        placeholder="185K+"
                        className="w-full px-2.5 py-1.5 border rounded bg-slate-50 font-black text-blue-600 text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#64748B] mb-0.5">Izoh (Sub matn):</label>
                      <input
                        type="text"
                        value={siteForm.customStats.lemonSub}
                        onChange={(e) => setSiteForm({
                          ...siteForm,
                          customStats: { ...siteForm.customStats, lemonSub: e.target.value }
                        })}
                        placeholder="Daraxt monitoringi"
                        className="w-full px-2.5 py-1.5 border rounded bg-slate-50 text-slate-700 text-xs"
                      />
                    </div>
                  </div>

                  {/* Card 4: Maydon (ga) */}
                  <div className="bg-white p-3.5 rounded-md border border-[#E2E8F0] space-y-2">
                    <div className="font-bold text-[#0F172A] flex items-center justify-between">
                      <span>4-Karta: Maydon (ga)</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">ga</span>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#64748B] mb-0.5">Asosiy Koʻrsatkich:</label>
                      <input
                        type="text"
                        value={siteForm.customStats.landArea}
                        onChange={(e) => setSiteForm({
                          ...siteForm,
                          customStats: { ...siteForm.customStats, landArea: e.target.value }
                        })}
                        placeholder="14K+"
                        className="w-full px-2.5 py-1.5 border rounded bg-slate-50 font-black text-blue-600 text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#64748B] mb-0.5">Izoh (Sub matn):</label>
                      <input
                        type="text"
                        value={siteForm.customStats.landSub}
                        onChange={(e) => setSiteForm({
                          ...siteForm,
                          customStats: { ...siteForm.customStats, landSub: e.target.value }
                        })}
                        placeholder="Qishloq xo'jaligi"
                        className="w-full px-2.5 py-1.5 border rounded bg-slate-50 text-slate-700 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3-Image Exact Live Preview Section */}
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Jonli Koʻrinish (3-rasmdagi kartalar mehmonlarga quyidagicha koʻrinadi):</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-800 text-emerald-400 rounded border border-slate-700">
                    {siteForm.statsDisplayMode === 'real' ? 'Real Baza Rejimi' : 'Qoʻlda Tahrirlangan Rejim'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                  {/* Card 1 */}
                  <div className="bg-white rounded p-3.5 text-center shadow-md">
                    <p className="text-2xl font-black text-[#3B82F6]">
                      {siteForm.statsDisplayMode === 'real' ? `${mfyList.length}` : (siteForm.customStats.mfyCount || '33')}
                    </p>
                    <p className="text-xs font-bold text-[#0F172A]">MFY</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5 truncate">
                      {siteForm.statsDisplayMode === 'real' ? 'Yozyovon tumani (4 ta sektor)' : siteForm.customStats.mfySub}
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white rounded p-3.5 text-center shadow-md">
                    <p className="text-2xl font-black text-[#3B82F6]">
                      {siteForm.statsDisplayMode === 'real' ? `${580 + registeredFarmers.length}+` : (siteForm.customStats.farmersCount || '580+')}
                    </p>
                    <p className="text-xs font-bold text-[#0F172A]">Fermer</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5 truncate">
                      {siteForm.statsDisplayMode === 'real' ? 'Faol foydalanuvchi' : siteForm.customStats.farmersSub}
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white rounded p-3.5 text-center shadow-md">
                    <p className="text-2xl font-black text-[#3B82F6]">
                      {siteForm.statsDisplayMode === 'real' 
                        ? `${Math.round(mfyList.reduce((s, m) => s + (m.limonDaraxtlari || 0), 0) / 1000)}K+` 
                        : (siteForm.customStats.lemonTrees || '185K+')}
                    </p>
                    <p className="text-xs font-bold text-[#0F172A]">Limon</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5 truncate">
                      {siteForm.statsDisplayMode === 'real' ? 'Daraxt monitoringi' : siteForm.customStats.lemonSub}
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-white rounded p-3.5 text-center shadow-md">
                    <p className="text-2xl font-black text-[#3B82F6]">
                      {siteForm.statsDisplayMode === 'real' 
                        ? `${Math.round(mfyList.reduce((s, m) => s + (m.dehqonchilikGa || 0), 0) / 1000)}K+` 
                        : (siteForm.customStats.landArea || '14K+')}
                    </p>
                    <p className="text-xs font-bold text-[#0F172A]">ga</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5 truncate">
                      {siteForm.statsDisplayMode === 'real' ? "Qishloq xo'jaligi" : siteForm.customStats.landSub}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-md shadow-md flex items-center gap-2 transition-all"
                id="save-site-appearance-btn"
              >
                <Save className="w-4 h-4" />
                <span>Oʻzgarishlarni Saqlash & Saytda Qoʻllash</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 10: AI KNOWLEDGE BASE (KASALLIKLAR, BELGILAR & DORILAR REGISTRI) */}
      {activeTab === 'ai_knowledge_base' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-violet-900 via-slate-900 to-slate-900 rounded-xl p-6 border border-violet-700/40 shadow-lg text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-violet-600 rounded-xl shadow-md">
                  <Cpu className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight">AI Skaner Bilimlar Bazasi & Fitosanitariya Registri</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      Real Vaqt Integratsiyasi
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Ushbu boʻlimda davlat fitosanitariya inspeksiyasi tomonidan kiritilgan barcha oʻsimlik/koʻchat kasalliklari, ularning vizual alomatlari va rasmiy dori vositalari saqlanadi. Dehqonlar skaner qilganda AI aynan shu registrdagi maʼlumotlar bilan solishtiradi va rasmiy retsept beradi. Chorva va hayvonlar esa avtomatik filtrlanadi!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={resetGovAgroDiseasesToDefault}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all"
                  title="Boshlangʻich rasmiy Yozyovon protokollariga qaytarish"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Standart Protokol</span>
                </button>
                <button
                  onClick={() => {
                    setEditingDiseaseId(null);
                    setDiseaseForm({
                      plantType: 'limon',
                      diseaseName: '',
                      targetPart: 'leaf',
                      severityLevel: 'high',
                      visualSymptoms: '',
                      medicines: '',
                      dosageAndUsage: '',
                      preventiveMeasures: '',
                      imageUrl: ''
                    });
                    setShowAddDiseaseModal(true);
                  }}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 transition-all"
                  id="add-new-disease-btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yangi Kasallik & Dori Kiritish</span>
                </button>
              </div>
            </div>

            {diseaseSuccessMsg && (
              <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{diseaseSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Jami Kasalliklar</span>
                <span className="p-2 rounded-lg bg-violet-50 text-violet-600">
                  <Cpu className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{govAgroDiseases.length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">AI tahlilida faol</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Barg Patologiyalari</span>
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Sprout className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">
                {govAgroDiseases.filter(d => d.targetPart === 'leaf' || d.targetPart === 'all').length}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Xloroz, oqqanot, dogʻlar</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Meva Kasalliklari</span>
                <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">
                {govAgroDiseases.filter(d => d.targetPart === 'fruit' || d.targetPart === 'all').length}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Qoʻtir, parsha, chirish</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Shox & Poya Kasalliklari</span>
                <span className="p-2 rounded-lg bg-rose-50 text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">
                {govAgroDiseases.filter(d => d.targetPart === 'branch' || d.targetPart === 'all').length}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Gommoz, poʻstloq yorilishi</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Kasallik, dori yoki belgi boʻyicha qidiruv..."
                value={diseaseSearch}
                onChange={(e) => setDiseaseSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Qism:
              </span>
              {(['all', 'leaf', 'fruit', 'branch'] as const).map(part => (
                <button
                  key={part}
                  onClick={() => setDiseaseFilterPart(part)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    diseaseFilterPart === part
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {part === 'all' && 'Barchasi'}
                  {part === 'leaf' && '🍃 Barglar'}
                  {part === 'fruit' && '🍋 Mevalar'}
                  {part === 'branch' && '🪵 Shox / Poya'}
                </button>
              ))}
            </div>
          </div>

          {/* Disease Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {govAgroDiseases
              .filter(d => {
                if (diseaseFilterPart !== 'all' && d.targetPart !== diseaseFilterPart && d.targetPart !== 'all') {
                  return false;
                }
                if (diseaseSearch.trim()) {
                  const q = diseaseSearch.toLowerCase();
                  return (
                    d.diseaseName.toLowerCase().includes(q) ||
                    d.medicines.toLowerCase().includes(q) ||
                    d.dosageAndUsage.toLowerCase().includes(q) ||
                    (d.visualSymptoms && d.visualSymptoms.some(s => s.toLowerCase().includes(q)))
                  );
                }
                return true;
              })
              .map(record => (
                <div
                  key={record.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5">
                    {/* Top Row: Tag, Severity & Date */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-violet-50 text-violet-700 border border-violet-100">
                          {record.plantType === 'limon' && '🍋 Limon'}
                          {record.plantType === 'mevali_daraxt' && '🍎 Mevali Daraxt'}
                          {record.plantType === 'sabzavot' && '🍅 Sabzavot'}
                          {record.plantType === 'uzum' && '🍇 Tok / Uzum'}
                          {record.plantType === 'boshqa_kochat' && '🌱 Koʻchat'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          record.targetPart === 'leaf' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          record.targetPart === 'fruit' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          record.targetPart === 'branch' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {record.targetPart === 'leaf' && '🍃 Barg patologiyasi'}
                          {record.targetPart === 'fruit' && '🍋 Meva kasalligi'}
                          {record.targetPart === 'branch' && '🪵 Shox va poya'}
                          {record.targetPart === 'all' && '🌿 Umumiy oʻsimlik'}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        record.severityLevel === 'high' ? 'bg-rose-100 text-rose-800' :
                        record.severityLevel === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {record.severityLevel === 'high' ? 'Xavf: Yuqori' : record.severityLevel === 'medium' ? 'Xavf: Oʻrta' : 'Xavf: Past'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm text-slate-900 mt-3 leading-snug">
                      {record.diseaseName}
                    </h3>

                    {/* Image Preview & Symptoms */}
                    <div className="flex gap-3 mt-3">
                      {record.imageUrl && (
                        <img
                          src={record.imageUrl}
                          alt={record.diseaseName}
                          className="w-20 h-20 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      )}
                      <div className="flex-1 space-y-1">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Vizual Belgilari:</p>
                        <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                          {record.visualSymptoms?.map((sym, idx) => (
                            <li key={idx} className="line-clamp-2">{sym}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Medicines & Dosage Box */}
                    <div className="mt-4 p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-blue-900">
                        <Droplets className="w-3.5 h-3.5 text-blue-600" />
                        <span>Davlat Tasdiqlagan Dori Vositalari:</span>
                      </div>
                      <p className="text-blue-950 font-medium">{record.medicines}</p>
                      <div className="text-[11px] text-blue-800 pt-1 border-t border-blue-200/50">
                        <span className="font-semibold">Dozasi & Qoʻllash:</span> {record.dosageAndUsage}
                      </div>
                    </div>

                    {/* Preventive Measures */}
                    {record.preventiveMeasures && (
                      <div className="mt-2 text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-700">Profilaktika:</span> {record.preventiveMeasures}
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Yangilangan: {record.updatedAt}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditDisease(record)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded border border-slate-200 shadow-2xs flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3 text-blue-600" />
                        <span>Tahrirlash</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`"${record.diseaseName}" kasalligini registrdan oʻchirishni tasdiqlaysizmi?`)) {
                            deleteGovAgroDisease(record.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Oʻchirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Modal: Yangi Kasallik Kiritish yoki Tahrirlash */}
          {showAddDiseaseModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4 animate-scaleUp">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-violet-100 text-violet-700 rounded-lg">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        {editingDiseaseId ? 'Kasallik va Dori Maʼlumotlarini Tahrirlash' : 'AI Skaner uchun Yangi Kasallik & Dori Kiritish'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Ushbu maʼlumotlar dehqonlar oʻsimlik/koʻchatni skaner qilganda AI tomonidan tavsiya sifatida ishlatiladi.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddDiseaseModal(false);
                      setEditingDiseaseId(null);
                    }}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveDisease} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Oʻsimlik / Ekin Turi *</label>
                      <select
                        value={diseaseForm.plantType}
                        onChange={(e: any) => setDiseaseForm(p => ({ ...p, plantType: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-medium"
                      >
                        <option value="limon">🍋 Limon (Sitrus)</option>
                        <option value="mevali_daraxt">🍎 Mevali Daraxt</option>
                        <option value="sabzavot">🍅 Sabzavot</option>
                        <option value="uzum">🍇 Tok / Uzum</option>
                        <option value="boshqa_kochat">🌱 Boshqa Koʻchat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Zararlanadigan Qism *</label>
                      <select
                        value={diseaseForm.targetPart}
                        onChange={(e: any) => setDiseaseForm(p => ({ ...p, targetPart: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-medium"
                      >
                        <option value="leaf">🍃 Barglar</option>
                        <option value="fruit">🍋 Mevalar</option>
                        <option value="branch">🪵 Shox va Poya</option>
                        <option value="all">🌿 Barcha qismlar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Xavf Darajasi *</label>
                      <select
                        value={diseaseForm.severityLevel}
                        onChange={(e: any) => setDiseaseForm(p => ({ ...p, severityLevel: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-medium"
                      >
                        <option value="high">🔴 Yuqori (Tez tarqaluvchi)</option>
                        <option value="medium">🟡 Oʻrta darajali</option>
                        <option value="low">🟢 Past / Boshlangʻich</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kasallik yoki Zararkunanda Rasmiy Nomi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: Limon Gommozi va Antraknozi"
                      value={diseaseForm.diseaseName}
                      onChange={(e) => setDiseaseForm(p => ({ ...p, diseaseName: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Vizual Alomatlari (Har bir alomat yangi qatorda) *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Masalan:&#10;Barglarning tomirlar oraligʻining sargʻayishi&#10;Poyaning yorilishi va yelim oqishi&#10;Meva poʻstlogʻida botib kirgan qora dogʻlar"
                      value={diseaseForm.visualSymptoms}
                      onChange={(e) => setDiseaseForm(p => ({ ...p, visualSymptoms: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Rasmiy Dori Vositalari (Preparatlar) *</label>
                      <input
                        type="text"
                        required
                        placeholder="Masalan: Mis kuporosi 1%, Skor 250 EC, Aktara 25 WG"
                        value={diseaseForm.medicines}
                        onChange={(e) => setDiseaseForm(p => ({ ...p, medicines: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Namunaviy Tasvir URL (Etalon rasm)</label>
                      <input
                        type="text"
                        placeholder="https://... rasm havolasi"
                        value={diseaseForm.imageUrl}
                        onChange={(e) => setDiseaseForm(p => ({ ...p, imageUrl: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dozasi va Qoʻllash Tartibi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: 10 litr suvga 100 g mis kuporosi + 100 g ohak. Kechki payt barg va shoxlarga sepiladi."
                      value={diseaseForm.dosageAndUsage}
                      onChange={(e) => setDiseaseForm(p => ({ ...p, dosageAndUsage: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Profilaktika va Agrotexnik Chora-tadbirlar</label>
                    <textarea
                      rows={2}
                      placeholder="Daraxt tanasini oqlash, namlikni meʼyorda ushlash, zararlangan novdalarni kesib yoqish."
                      value={diseaseForm.preventiveMeasures}
                      onChange={(e) => setDiseaseForm(p => ({ ...p, preventiveMeasures: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddDiseaseModal(false);
                        setEditingDiseaseId(null);
                      }}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 font-bold"
                    >
                      Bekor Qilish
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingDiseaseId ? 'Oʻzgarishlarni Saqlash' : 'AI Bazaga Kiritish & Tasdiqlash'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
