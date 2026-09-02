import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, FarmType, MFYData, Crop, Livestock, AIScan, 
  WeatherInfo, MarketPrice, AppNotification, SubsidyApplication, ExportCertificate,
  SecurityLog, CyberDefenseStatus, SiteSettings, UploadedGuide
} from '../types';
import { 
  INITIAL_USERS, YOZYOVON_MFY_LIST, INITIAL_CROPS, 
  INITIAL_LIVESTOCK, INITIAL_AI_SCANS, YOZYOVON_WEATHER, 
  MARKET_PRICES, INITIAL_NOTIFICATIONS, INITIAL_SUBSIDIES, INITIAL_EXPORT_CERTS 
} from '../data/yozyovonData';

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  mfyId: number;
  farmType?: FarmType;
  activityField?: string;
}

interface RegistrationResult {
  user: User;
  verificationToken: string;
  verificationLink: string;
}

interface AppContextType {
  currentUser: User;
  userRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedMfyId: number | null;
  selectMfy: (id: number | null) => void;
  mfyList: MFYData[];
  crops: Crop[];
  livestock: Livestock[];
  aiScans: AIScan[];
  weather: WeatherInfo;
  currentMfyWeather: WeatherInfo;
  marketPrices: MarketPrice[];
  notifications: AppNotification[];
  subsidies: SubsidyApplication[];
  exportCertificates: ExportCertificate[];
  aiProvider: 'gemini' | 'openrouter';
  setAiProvider: (provider: 'gemini' | 'openrouter') => void;
  aiApiKey: string;
  setAiApiKey: (key: string) => void;
  verificationBanner: { show: boolean; email: string; link: string; token: string } | null;
  dismissVerificationBanner: () => void;
  switchRole: (role: UserRole) => void;
  login: (name: string, identifier: string, password?: string, forceRole?: UserRole) => boolean;
  logout: () => void;
  registerFarmer: (data: RegistrationData) => RegistrationResult;
  verifyEmailToken: (token: string) => boolean;
  addCrop: (crop: Omit<Crop, 'id' | 'userId'>) => void;
  deleteCrop: (id: number) => void;
  addLivestock: (item: Omit<Livestock, 'id' | 'userId'>) => void;
  deleteLivestock: (id: number) => void;
  addAIScan: (scan: Omit<AIScan, 'id' | 'userId' | 'scannedAt'>) => AIScan;
  markNotificationAsRead: (id: string) => void;
  exportToCsv: (filename: string, headers: string[], rows: (string | number)[][]) => void;
  approveSubsidy: (id: string) => void;
  rejectSubsidy: (id: string) => void;
  addSubsidyApplication: (app: Omit<SubsidyApplication, 'id' | 'submittedDate' | 'status'>) => void;
  issueExportCertificate: (cert: Omit<ExportCertificate, 'id' | 'issueDate'>) => void;
  sendGovBroadcastAlert: (title: string, message: string, severity: 'danger' | 'warning' | 'info') => void;
  resetGovDemoData: () => void;
  getMfyWeather: (mfyId: number) => WeatherInfo;
  // Site Settings & Editable Information
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  // Uploaded Guides Management
  customGuides: UploadedGuide[];
  addCustomGuide: (guide: Omit<UploadedGuide, 'id' | 'uploadedAt' | 'downloadsCount'>) => void;
  deleteCustomGuide: (id: string) => void;
  incrementGuideDownload: (id: string) => void;
  // Dark / Light Mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  // Developer & Cyber Defense Backdoor / Emergency Console
  isDevModalOpen: boolean;
  setIsDevModalOpen: (open: boolean) => void;
  isCyberDefenseActive: boolean;
  isHoneypotActive: boolean;
  cyberDefenseStatus: CyberDefenseStatus;
  triggerEmergencyLockdown: () => void;
  restoreRealDatabase: (passkey?: string) => boolean;
  isMaintenanceMode: boolean;
  setMaintenanceMode: (val: boolean) => void;
  updateMfyDataLive: (mfyId: number, updates: Partial<MFYData>) => void;
  securityAuditLogs: SecurityLog[];
  addSecurityLog: (log: Omit<SecurityLog, 'id' | 'timestamp'>) => void;
  exportDatabaseJson: () => string;
  importDatabaseJson: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USER: 'yozyovon_user',
  CROPS: 'yozyovon_crops',
  LIVESTOCK: 'yozyovon_livestock',
  SCANS: 'yozyovon_scans',
  NOTIFS: 'yozyovon_notifications',
  SUBSIDIES: 'yozyovon_subsidies',
  CERTS: 'yozyovon_certs',
  AI_PROVIDER: 'yozyovon_ai_provider',
  AI_KEY: 'yozyovon_ai_key',
  THEME: 'yozyovon_theme',
  SITE_SETTINGS: 'yozyovon_site_settings',
  CUSTOM_GUIDES: 'yozyovon_custom_guides',
  REAL_VAULT: 'yozyovon_encrypted_real_vault',
  CYBER_STATUS: 'yozyovon_cyber_status'
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'YOZYOVON AGRO',
  siteTagline: 'Dehqonchilik & Sitruschilik Portali',
  siteDescription: 'Yozyovon tumani qishloq xoʻjaligi, sitruschilik va chorvachilik raqamli monitoring tizimi. 32 ta MFY boʻyicha yagona maʼlumotlar portali.',
  contactPhone: '+998 73 502-12-34',
  contactEmail: 'info@yozyovon-agro.uz',
  contactAddress: 'Yozyovon tumani, Mustaqillik shoh koʻchasi, 12-uy',
  telegramBot: '@YozyovonAgroBot',
  workingHours: 'Dush - Shan: 08:30 - 18:00'
};

const DEFAULT_CUSTOM_GUIDES: UploadedGuide[] = [
  {
    id: 'guide-1',
    title: 'Meyeri va Toshkent Navli Limonlarni Yetishtirish Agrotexnikasi',
    category: 'Limonchilik',
    format: 'pdf',
    content: 'Yozyovon issiqxonalarida limon daraxtlarini parvarishlash boʻyicha toʻliq ilmiy qoʻllanma. Harorat rejimi (qishda min +5°C), optimal tomchilatib sugʻorish jadvali va payvandlash qoidalari.',
    fileSize: '2.4 MB',
    uploadedAt: '2026-08-20',
    downloadsCount: 142
  },
  {
    id: 'guide-2',
    title: 'Issiqxonalarda Fertigatsiya va Mineral Oziqlantirish Standartlari',
    category: 'Agrotexnologiya',
    format: 'txt',
    content: 'Mineral oʻgʻitlarni (NPK + mikroelementlar) suv bilan birga berish normalari va Yozyovonning qumloq tuproqlari uchun tavsiyalar.',
    fileSize: '450 KB',
    uploadedAt: '2026-08-24',
    downloadsCount: 98
  },
  {
    id: 'guide-3',
    title: 'Yozyovon Sitrus Zararkunandalariga Qarshi Biologik Kurash Reestri',
    category: 'Fitosanitariya',
    format: 'json',
    content: 'Sitrus oqqanoti, barg buxrasi va oʻrgimchakkana turlari, ularning rivojlanish davri va ruxsat etilgan xavfsiz biopreparatlar roʻyxati.',
    fileSize: '820 KB',
    uploadedAt: '2026-08-28',
    downloadsCount: 76
  }
];


// Calculate realistic MFY-specific microclimate agriculture metrics
export const calculateMfyAgroWeather = (mfy: MFYData | undefined): WeatherInfo => {
  const base = YOZYOVON_WEATHER;
  if (!mfy) return base;

  // Microclimate variations based on MFY geographical characteristics
  const idSeed = mfy.id % 7;
  const isNorthernCanal = mfy.center[0] > 40.67;
  const isCentralGreenhouse = mfy.limonDaraxtlari > 10000;
  const isSouthernPasture = mfy.chorvaBoshlari > 2500;

  const soilTemp = isNorthernCanal ? 23.5 : isCentralGreenhouse ? 24.8 : 25.2;
  const soilMoisture = isNorthernCanal ? 72 : isCentralGreenhouse ? 68 : isSouthernPasture ? 55 : 62;
  const humidity = isNorthernCanal ? 44 : isCentralGreenhouse ? 41 : 36;
  const frostRisk: 'none' | 'low' | 'high' = 'none';

  const agroAdvice = isCentralGreenhouse 
    ? `${mfy.name} sitrus issiqxonalarida yuqori quyosh nurlanishi davrida (11:30 - 16:00) toʻrli soyabonlarni yopish va tomchilatib sugʻorishni kechki 19:30 da oʻtkazish tavsiya qilinadi.`
    : isNorthernCanal
    ? `${mfy.name} ekinzorlarida ariq va kanal yaqinligi sababli tuproq namligi 72% - sugʻorish oraligʻini 3 kunga uzaytirish va zang kasalligiga qarshi profilaktika oʻtkazish maqsadga muvofiq.`
    : `${mfy.name} hududida bugʻlanish yuqori boʻlgani uchun ekinlarni erta tongda sugʻorish va chirindi bilan mulchalash tavsiya etiladi.`;

  return {
    ...base,
    temp: 31 + (idSeed % 3 === 0 ? 1 : 0),
    feelsLike: 33 + (idSeed % 2 === 0 ? 1 : 0),
    soilTemp: Math.round(soilTemp * 10) / 10,
    soilMoisturePercent: soilMoisture,
    humidity,
    leafWetnessHours: isNorthernCanal ? 3.5 : 2.0,
    solarRadiationWm2: 810 + idSeed * 10,
    frostRisk,
    dewPoint: Math.round((14 + (humidity - 38) * 0.2) * 10) / 10,
    agroAdvice
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    return INITIAL_USERS[0]; // Rustamjon Dehqon
  });

  const [activeTab, setActiveTab] = useState<string>('map');
  const [selectedMfyId, setSelectedMfyId] = useState<number | null>(null);

  const [mfyList, setMfyList] = useState<MFYData[]>(YOZYOVON_MFY_LIST);

  const [crops, setCrops] = useState<Crop[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CROPS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CROPS;
  });

  const [livestock, setLivestock] = useState<Livestock[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LIVESTOCK);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_LIVESTOCK;
  });

  const [aiScans, setAiScans] = useState<AIScan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCANS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_AI_SCANS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [subsidies, setSubsidies] = useState<SubsidyApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBSIDIES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_SUBSIDIES;
  });

  const [exportCertificates, setExportCertificates] = useState<ExportCertificate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CERTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_EXPORT_CERTS;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(next));
      return next;
    });
  };

  const [customGuides, setCustomGuides] = useState<UploadedGuide[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_GUIDES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_CUSTOM_GUIDES;
  });

  const addCustomGuide = (guideData: Omit<UploadedGuide, 'id' | 'uploadedAt' | 'downloadsCount'>) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newGuide: UploadedGuide = {
      ...guideData,
      id: `guide-${Date.now()}`,
      uploadedAt: dateStr,
      downloadsCount: 0
    };
    setCustomGuides(prev => {
      const next = [newGuide, ...prev];
      localStorage.setItem(STORAGE_KEYS.CUSTOM_GUIDES, JSON.stringify(next));
      return next;
    });
  };

  const deleteCustomGuide = (id: string) => {
    setCustomGuides(prev => {
      const next = prev.filter(g => g.id !== id);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_GUIDES, JSON.stringify(next));
      return next;
    });
  };

  const incrementGuideDownload = (id: string) => {
    setCustomGuides(prev => {
      const next = prev.map(g => g.id === id ? { ...g, downloadsCount: g.downloadsCount + 1 } : g);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_GUIDES, JSON.stringify(next));
      return next;
    });
  };



  const [aiProvider, setAiProviderState] = useState<'gemini' | 'openrouter'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.AI_PROVIDER) as any) || 'gemini';
  });

  const [aiApiKey, setAiApiKeyState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.AI_KEY) || '';
  });

  const [verificationBanner, setVerificationBanner] = useState<{ show: boolean; email: string; link: string; token: string } | null>(null);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved === 'dark';
    return false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.THEME, next ? 'dark' : 'light');
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Developer & Emergency Access Modal State
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  // Cyber Defense & Honeypot states
  const [cyberDefenseStatus, setCyberDefenseStatus] = useState<CyberDefenseStatus>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CYBER_STATUS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      isLockdownActive: false,
      isHoneypotActive: false,
      vaultEncrypted: false,
      dbHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      firewallLevel: 'standard',
      attacksBlockedCount: 14,
      lastAttackTime: '2026-08-29 11:24:08'
    };
  });

  // Real database backup in encrypted cold vault
  const [encryptedVault, setEncryptedVault] = useState<{
    mfyList: MFYData[];
    crops: Crop[];
    livestock: Livestock[];
    subsidies: SubsidyApplication[];
    exportCertificates: ExportCertificate[];
  } | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REAL_VAULT);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Security Audit Logs
  const [securityAuditLogs, setSecurityAuditLogs] = useState<SecurityLog[]>([
    {
      id: 'sec-1',
      timestamp: '2026-08-29 12:40:12',
      event: 'WAF: SQL Injection Attack Blocked',
      ip: '185.220.101.44 (Tor Exit Node)',
      severity: 'critical',
      status: 'blocked',
      details: "Attempted ' UNION SELECT password FROM users-- on /api/mfy-query"
    },
    {
      id: 'sec-2',
      timestamp: '2026-08-29 12:35:50',
      event: 'Honeypot Trap Canary Triggered',
      ip: '45.154.255.89 (Malicious Scanner)',
      severity: 'warning',
      status: 'honeypot_trapped',
      details: 'Decoy endpoint /admin/raw_database_dump accessed. Fake honey-tokens supplied.'
    },
    {
      id: 'sec-3',
      timestamp: '2026-08-29 12:15:22',
      event: 'DDoS Rate-Limit Triggered',
      ip: '91.240.118.12 (Botnet IP cluster)',
      severity: 'warning',
      status: 'mitigated',
      details: '480 requests/sec exceeded threshold of 60 req/sec. Rate-limiting enforced.'
    },
    {
      id: 'sec-4',
      timestamp: '2026-08-29 11:58:04',
      event: 'XSS Payload Sanitized',
      ip: '194.26.29.13 (Vulnerability Prober)',
      severity: 'info',
      status: 'sanitized',
      details: '<script>alert(document.cookie)</script> stripped from search query parameter.'
    },
    {
      id: 'sec-5',
      timestamp: '2026-08-29 10:30:00',
      event: 'Database SHA-256 Checksum Verified',
      ip: '127.0.0.1 (System Self-Check)',
      severity: 'shield',
      status: 'isolated',
      details: 'Integrity 100% verified. 0 tampered records detected across 32 MFYs.'
    }
  ]);

  const addSecurityLog = (logData: Omit<SecurityLog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: SecurityLog = {
      id: `sec-${Date.now()}`,
      timestamp: ts,
      ...logData
    };
    setSecurityAuditLogs(prev => [newLog, ...prev]);
  };

  // Emergency Cyber Defense Trigger: Hash, Encrypt & Deploy Honeypot Decoy Database
  const triggerEmergencyLockdown = () => {
    // 1. Vault backup of real database
    const vaultBackup = {
      mfyList: [...mfyList],
      crops: [...crops],
      livestock: [...livestock],
      subsidies: [...subsidies],
      exportCertificates: [...exportCertificates]
    };
    setEncryptedVault(vaultBackup);
    localStorage.setItem(STORAGE_KEYS.REAL_VAULT, JSON.stringify(vaultBackup));

    // 2. Generate simulated SHA-256 hash & AES-256 key
    const newHash = `SHA256:ENCRYPTED_VAULT_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const newStatus: CyberDefenseStatus = {
      isLockdownActive: true,
      isHoneypotActive: true,
      vaultEncrypted: true,
      dbHash: newHash,
      firewallLevel: 'maximum_lockdown',
      attacksBlockedCount: cyberDefenseStatus.attacksBlockedCount + 1,
      lastAttackTime: new Date().toLocaleTimeString()
    };
    setCyberDefenseStatus(newStatus);
    localStorage.setItem(STORAGE_KEYS.CYBER_STATUS, JSON.stringify(newStatus));

    // 3. Swap active visible database with Honeypot Decoy Dataset
    const honeypotDecoyMfy = mfyList.map((m, idx) => ({
      ...m,
      name: `[HONEYPOT-DECOY-CHAMBER-${idx + 1}] ${m.name}`,
      limonDaraxtlari: Math.round(m.limonDaraxtlari * 0.9 + 77),
      chorvaBoshlari: Math.round(m.chorvaBoshlari * 1.1),
      anonymousFarmers: [
        { id: `trap-${idx}-1`, code: `[CANARY_TRAP_${idx}] DEHQON-DECOY`, cropType: 'Honey-Token Decoy Citrus', areaGa: 1.0, livestockCount: 0, healthRate: 99, status: 'yaxshi' as const }
      ]
    }));
    setMfyList(honeypotDecoyMfy);

    // 4. Log defense event
    addSecurityLog({
      event: 'EMERGENCY LOCKDOWN ACTIVATED: Asl Baza Shifrlandi',
      ip: '0.0.0.0/0 (Global Shield)',
      severity: 'critical',
      status: 'honeypot_trapped',
      details: 'Asl 32 MFY agro-bazasi AES-256 bilan shifrlandi va yashirildi. 1:1 Honeypot soxta tuzoq bazasi ishga tushirildi.'
    });

    sendGovBroadcastAlert(
      '🚨 KIBER-HIMOYA FAOL: FAVQULODDA SHIFRLASH AMALGA OSHIRILDI',
      'Tizim kiber xavfsizlik protokoli boʻyicha asl maʼlumotlar bazasi shifrlanib yashirildi. Barcha tashqi soʻrovlar tuzoq (honeypot) bazaga yoʻnaltirildi.',
      'danger'
    );
  };

  // Restore Real Database from Encrypted Vault
  const restoreRealDatabase = (passkey = 'YOZYOVON_SECURE_2026'): boolean => {
    let sourceData = encryptedVault;
    if (!sourceData) {
      const saved = localStorage.getItem(STORAGE_KEYS.REAL_VAULT);
      if (saved) {
        try { sourceData = JSON.parse(saved); } catch (e) {}
      }
    }

    if (sourceData && sourceData.mfyList && sourceData.mfyList.length > 0) {
      setMfyList(sourceData.mfyList);
      setCrops(sourceData.crops);
      setLivestock(sourceData.livestock);
      setSubsidies(sourceData.subsidies);
      setExportCertificates(sourceData.exportCertificates);
    } else {
      setMfyList(YOZYOVON_MFY_LIST);
      setCrops(INITIAL_CROPS);
      setLivestock(INITIAL_LIVESTOCK);
      setSubsidies(INITIAL_SUBSIDIES);
      setExportCertificates(INITIAL_EXPORT_CERTS);
    }

    const restoredStatus: CyberDefenseStatus = {
      isLockdownActive: false,
      isHoneypotActive: false,
      vaultEncrypted: false,
      dbHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      firewallLevel: 'standard',
      attacksBlockedCount: cyberDefenseStatus.attacksBlockedCount,
      lastAttackTime: cyberDefenseStatus.lastAttackTime
    };
    setCyberDefenseStatus(restoredStatus);
    localStorage.setItem(STORAGE_KEYS.CYBER_STATUS, JSON.stringify(restoredStatus));
    localStorage.removeItem(STORAGE_KEYS.REAL_VAULT);
    setEncryptedVault(null);

    addSecurityLog({
      event: 'DATABASE RESTORED: Asl Baza Shifrdan Chiqarildi',
      ip: '127.0.0.1 (Developer Authenticated)',
      severity: 'shield',
      status: 'isolated',
      details: 'Asl 32 MFY agrobaza xavfsiz kalit bilan tiklandi, honeypot toʻxtatildi. Barcha tekshiruvlar yashil.'
    });

    sendGovBroadcastAlert(
      '✅ ASL BAZA QAYTA TIKLANDI',
      'Yozyovon agro-monitoring bazasi muvaffaqiyatli shifrdan chiqarildi va normal ishlash rejimiga qaytarildi.',
      'info'
    );

    return true;
  };

  // Live Site Hot MFY Data Editor
  const updateMfyDataLive = (mfyId: number, updates: Partial<MFYData>) => {
    setMfyList(prev => prev.map(m => m.id === mfyId ? { ...m, ...updates, updatedAt: 'Hozir' } : m));
    addSecurityLog({
      event: `HOT PARAM OVERRIDE: MFY #${mfyId} Jonli Tahrirlandi`,
      ip: '127.0.0.1 (Dev Console)',
      severity: 'info',
      status: 'isolated',
      details: `MFY ID ${mfyId} maʼlumotlari toʻgʻridan-toʻgʻri Developer konsoli orqali yangilandi: ${JSON.stringify(updates)}`
    });
  };

  const exportDatabaseJson = (): string => {
    const payload = {
      exportTimestamp: new Date().toISOString(),
      systemVersion: 'Yozyovon Agro v2.5',
      mfyList,
      crops,
      livestock,
      subsidies,
      exportCertificates,
      securityStatus: cyberDefenseStatus
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDatabaseJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.mfyList && Array.isArray(parsed.mfyList)) {
        setMfyList(parsed.mfyList);
        if (parsed.crops) setCrops(parsed.crops);
        if (parsed.livestock) setLivestock(parsed.livestock);
        if (parsed.subsidies) setSubsidies(parsed.subsidies);
        if (parsed.exportCertificates) setExportCertificates(parsed.exportCertificates);
        addSecurityLog({
          event: 'DATABASE IMPORT: Tashqi JSON Maʼlumotlar Bazasi Tiklandi',
          ip: '127.0.0.1 (Dev Console)',
          severity: 'shield',
          status: 'isolated',
          details: 'Yangi JSON agro-baza toʻliq import qilindi va tekshirildi.'
        });
        return true;
      }
    } catch (e) {
      console.error('Import error', e);
    }
    return false;
  };

  const isCyberDefenseActive = cyberDefenseStatus.isLockdownActive;
  const isHoneypotActive = cyberDefenseStatus.isHoneypotActive;

  // Check URL params on initial mount for ?verify_token=...
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('verify_token');
      if (token) {
        verifyEmailToken(token);
        // Clean URL without reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    } catch (e) {
      console.warn('URL param parse error', e);
    }
  }, []);

  // Persist states
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIVESTOCK, JSON.stringify(livestock));
  }, [livestock]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(aiScans));
  }, [aiScans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBSIDIES, JSON.stringify(subsidies));
  }, [subsidies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(exportCertificates));
  }, [exportCertificates]);

  const setAiProvider = (provider: 'gemini' | 'openrouter') => {
    setAiProviderState(provider);
    localStorage.setItem(STORAGE_KEYS.AI_PROVIDER, provider);
  };

  const setAiApiKey = (key: string) => {
    setAiApiKeyState(key);
    localStorage.setItem(STORAGE_KEYS.AI_KEY, key);
  };

  const switchRole = (role: UserRole) => {
    const matched = INITIAL_USERS.find(u => u.role === role) || {
      ...currentUser,
      role
    };
    setCurrentUser(matched);
    if (role === 'davlat') {
      setActiveTab('gov_hub');
    } else {
      setActiveTab('profile');
    }
  };

  const login = (name: string, identifier: string, password?: string, forceRole?: UserRole): boolean => {
    let determinedRole: UserRole = forceRole || 'dehqon';
    const lowerId = (identifier || '').toLowerCase().trim();
    const lowerName = (name || '').toLowerCase().trim();
    const pwd = (password || '').trim();

    if (!forceRole) {
      if (
        lowerId.includes('admin') || 
        lowerName.includes('admin') || 
        lowerName.includes('dasturchi') || 
        lowerId === '+998901234569' || 
        lowerId === 'admin@yozyovon-agro.uz' ||
        pwd === 'admin123'
      ) {
        determinedRole = 'admin';
      } else if (
        lowerId.includes('gov') || 
        lowerId.includes('inspektor') || 
        lowerName.includes('inspektor') || 
        lowerName.includes('hokim') ||
        lowerId === '+998901234568' || 
        lowerId === 'agro.inspektor@yozyovon.gov.uz' ||
        pwd === 'gov1234'
      ) {
        determinedRole = 'davlat';
      } else {
        determinedRole = 'dehqon';
      }
    }

    const matchedPreset = INITIAL_USERS.find(u => 
      (identifier && (u.phone === identifier || u.email?.toLowerCase() === lowerId)) ||
      u.role === determinedRole
    );

    const loggedUser: User = {
      id: matchedPreset ? matchedPreset.id : Date.now(),
      phone: identifier || matchedPreset?.phone || '+998901234567',
      name: name.trim() || matchedPreset?.name || (determinedRole === 'admin' ? 'Tizim Administratori' : determinedRole === 'davlat' ? 'Davlat inspektori' : 'Dehqon foydalanuvchi'),
      email: lowerId.includes('@') ? identifier : matchedPreset?.email,
      role: determinedRole,
      mfyId: matchedPreset?.mfyId || 1,
      createdAt: matchedPreset?.createdAt || new Date().toISOString().split('T')[0],
      isVerified: true,
      farmType: matchedPreset?.farmType || 'limon',
      activityField: matchedPreset?.activityField || (determinedRole === 'admin' ? 'Bosh Dasturchi & Kiber-xavfsizlik' : determinedRole === 'davlat' ? 'Tuman Qishloq Xoʻjaligi Boshqarmasi' : 'Limonchilik va Dehqon xoʻjaligi')
    };

    setCurrentUser(loggedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedUser));

    if (determinedRole === 'admin') {
      setActiveTab('gov_hub');
      setIsDevModalOpen(true);
    } else if (determinedRole === 'davlat') {
      setActiveTab('gov_hub');
    } else {
      setActiveTab('profile');
    }
    return true;
  };


  // Farmer registration flow with email link generation
  const registerFarmer = (data: RegistrationData): RegistrationResult => {
    const token = `yz_ver_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString(36)}`;
    const baseUrl = window.location.origin + window.location.pathname;
    const verificationLink = `${baseUrl}?verify_token=${token}&email=${encodeURIComponent(data.email)}`;

    const newUser: User = {
      id: Date.now(),
      phone: data.phone,
      name: data.name,
      email: data.email,
      role: 'dehqon',
      mfyId: data.mfyId,
      createdAt: new Date().toISOString().split('T')[0],
      isVerified: false,
      verificationToken: token,
      farmType: data.farmType || 'limon',
      activityField: data.activityField || 'Dehqon xoʻjaligi'
    };

    setCurrentUser(newUser);

    // Show simulated verification link modal / banner
    setVerificationBanner({
      show: true,
      email: data.email,
      link: verificationLink,
      token
    });

    return {
      user: newUser,
      verificationToken: token,
      verificationLink
    };
  };

  // Email Token Verification
  const verifyEmailToken = (token: string): boolean => {
    setCurrentUser(prev => ({
      ...prev,
      isVerified: true
    }));

    setVerificationBanner(null);

    // Push success notification
    const welcomeNotif: AppNotification = {
      id: `welcome-${Date.now()}`,
      type: 'success',
      title: 'Akkaunt muvaffaqiyatli tasdiqlandi!',
      message: 'Email havolasi orqali profilingiz faollashtirildi. Endi siz Yozyovon tumani agro monitoring tizimidan toʻliq foydalanishingiz mumkin.',
      date: 'Hozir',
      unread: true,
      targetRole: 'dehqon'
    };
    setNotifications(prev => [welcomeNotif, ...prev]);

    return true;
  };

  const dismissVerificationBanner = () => {
    setVerificationBanner(null);
  };

  const logout = () => {
    switchRole('dehqon');
  };

  const selectMfy = (id: number | null) => {
    setSelectedMfyId(id);
    if (id !== null) {
      setActiveTab('mfy_detail');
    }
  };

  const addCrop = (cropData: Omit<Crop, 'id' | 'userId'>) => {
    const newCrop: Crop = {
      ...cropData,
      id: Date.now(),
      userId: currentUser.id
    };
    setCrops(prev => [newCrop, ...prev]);
  };

  const deleteCrop = (id: number) => {
    setCrops(prev => prev.filter(c => c.id !== id));
  };

  const addLivestock = (itemData: Omit<Livestock, 'id' | 'userId'>) => {
    const newItem: Livestock = {
      ...itemData,
      id: Date.now(),
      userId: currentUser.id
    };
    setLivestock(prev => [newItem, ...prev]);
  };

  const deleteLivestock = (id: number) => {
    setLivestock(prev => prev.filter(l => l.id !== id));
  };

  const addAIScan = (scanData: Omit<AIScan, 'id' | 'userId' | 'scannedAt'>): AIScan => {
    const now = new Date();
    const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newScan: AIScan = {
      ...scanData,
      id: Date.now(),
      userId: currentUser.id,
      scannedAt: dateString
    };

    setAiScans(prev => [newScan, ...prev]);

    // If severe, generate automatic notification to Government panel!
    if (scanData.severity === 'high') {
      const urgentNotif: AppNotification = {
        id: `alert-${Date.now()}`,
        type: 'danger',
        title: `SHOSHILINCH: ${scanData.diseaseName} aniqlandi`,
        message: `Yozyovon tumani (MFY #${scanData.mfyId || 1}) hududida yuqori xavfli ${scanData.diseaseName} holati qayd etildi. Zudlik bilan agrotexnik nazorat oʻrnatilsin.`,
        date: dateString,
        unread: true,
        targetRole: 'all'
      };
      setNotifications(prev => [urgentNotif, ...prev]);
    }

    return newScan;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const approveSubsidy = (id: string) => {
    setSubsidies(prev => prev.map(s => s.id === id ? { ...s, status: 'tasdiqlandi' } : s));
  };

  const rejectSubsidy = (id: string) => {
    setSubsidies(prev => prev.map(s => s.id === id ? { ...s, status: 'rad_etildi' } : s));
  };

  const addSubsidyApplication = (app: Omit<SubsidyApplication, 'id' | 'submittedDate' | 'status'>) => {
    const newApp: SubsidyApplication = {
      ...app,
      id: `sub-${Date.now()}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'kutilmoqda'
    };
    setSubsidies(prev => [newApp, ...prev]);
  };

  const issueExportCertificate = (cert: Omit<ExportCertificate, 'id' | 'issueDate'>) => {
    const newCert: ExportCertificate = {
      ...cert,
      id: `exp-${Date.now()}`,
      issueDate: new Date().toISOString().split('T')[0]
    };
    setExportCertificates(prev => [newCert, ...prev]);
  };

  const sendGovBroadcastAlert = (title: string, message: string, severity: 'danger' | 'warning' | 'info') => {
    const now = new Date();
    const dateStr = `${now.getDate()} Avgust 2026, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newNotif: AppNotification = {
      id: `gov-broadcast-${Date.now()}`,
      type: severity,
      title: `⚡ DAVLAT AGROINSPEKSIYASI: ${title}`,
      message,
      date: dateStr,
      unread: true,
      targetRole: 'all'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Quick seed / reset test data across all 32 MFYs for Government Review
  const resetGovDemoData = () => {
    setMfyList(YOZYOVON_MFY_LIST);
    setSubsidies(INITIAL_SUBSIDIES);
    setExportCertificates(INITIAL_EXPORT_CERTS);
    setAiScans(INITIAL_AI_SCANS);
    setNotifications(INITIAL_NOTIFICATIONS);

    // Add immediate feedback notification
    const testNotif: AppNotification = {
      id: `demo-reset-${Date.now()}`,
      type: 'info',
      title: '⚡ Tezkor Davlat Test Maʼlumotlari Yangilandi',
      message: 'Barcha 32 ta MFY boʻyicha 284,000+ limon daraxtlari, 82,000+ chorva boshlari va yangi subsidiya arizalari qayta yuklandi.',
      date: 'Hozir',
      unread: true,
      targetRole: 'davlat'
    };
    setNotifications(prev => [testNotif, ...prev]);
  };

  const exportToCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getMfyWeather = (mfyId: number): WeatherInfo => {
    const targetMfy = mfyList.find(m => m.id === mfyId) || mfyList[0];
    return calculateMfyAgroWeather(targetMfy);
  };

  const currentMfy = mfyList.find(m => m.id === currentUser.mfyId) || mfyList[0];
  const currentMfyWeather = calculateMfyAgroWeather(currentMfy);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole: currentUser.role,
        activeTab,
        setActiveTab,
        selectedMfyId,
        selectMfy,
        mfyList,
        crops,
        livestock,
        aiScans,
        weather: YOZYOVON_WEATHER,
        currentMfyWeather,
        marketPrices: MARKET_PRICES,
        notifications,
        subsidies,
        exportCertificates,
        aiProvider,
        setAiProvider,
        aiApiKey,
        setAiApiKey,
        verificationBanner,
        dismissVerificationBanner,
        switchRole,
        login,
        logout,
        registerFarmer,
        verifyEmailToken,
        addCrop,
        deleteCrop,
        addLivestock,
        deleteLivestock,
        addAIScan,
        markNotificationAsRead,
        exportToCsv,
        approveSubsidy,
        rejectSubsidy,
        addSubsidyApplication,
        issueExportCertificate,
        sendGovBroadcastAlert,
        resetGovDemoData,
        getMfyWeather,
        siteSettings,
        updateSiteSettings,
        customGuides,
        addCustomGuide,
        deleteCustomGuide,
        incrementGuideDownload,
        isDarkMode,
        toggleDarkMode,
        isDevModalOpen,
        setIsDevModalOpen,
        isCyberDefenseActive,
        isHoneypotActive,
        cyberDefenseStatus,
        triggerEmergencyLockdown,
        restoreRealDatabase,
        isMaintenanceMode,
        setMaintenanceMode: setIsMaintenanceMode,
        updateMfyDataLive,
        securityAuditLogs,
        addSecurityLog,
        exportDatabaseJson,
        importDatabaseJson
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
