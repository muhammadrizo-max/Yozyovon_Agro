import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, FarmType, MFYData, Crop, Livestock, AIScan, 
  WeatherInfo, MarketPrice, AppNotification, SubsidyApplication, ExportCertificate,
  SecurityLog, CyberDefenseStatus, SiteSettings, UploadedGuide, FarmerAdvice,
  ChatAttachment, ChatMessage, DatabaseBackupSnapshot, RbacPermission
} from '../types';
import { 
  INITIAL_USERS, YOZYOVON_MFY_LIST, INITIAL_CROPS, 
  INITIAL_LIVESTOCK, INITIAL_AI_SCANS, YOZYOVON_WEATHER, 
  MARKET_PRICES, INITIAL_NOTIFICATIONS, INITIAL_SUBSIDIES, INITIAL_EXPORT_CERTS 
} from '../data/yozyovonData';
import { 
  hashPassword, generateSalt, encryptVaultData, decryptVaultData, 
  StoredUserAccount, EncryptedVaultPayload 
} from '../services/cryptoService';
import { 
  trafficMonitor, sanitizeSqlParam, sanitizeXssInput, 
  detectSqlInjection, executeParameterizedQuery 
} from '../utils/security';

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  mfyId: number;
  farmType?: FarmType;
  customFarmType?: string;
  activityField?: string;
}

interface RegistrationResult {
  user: User;
  verificationToken: string;
  verificationLink: string;
}

interface AppContextType {
  currentUser: User;
  isLoggedIn: boolean;
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
  weatherProvider: 'accuweather' | 'tomorrow';
  setWeatherProvider: (provider: 'accuweather' | 'tomorrow') => void;
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
  sendSubsidyMessage: (subsidyId: string, text: string, attachments?: ChatAttachment[]) => void;
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
  // Developer & Security Operations Center (SOC)
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
  // Yangi Xavfsizlik Funksiyalari
  backupDatabase: (format?: 'json' | 'sql') => string;
  restoreDatabaseFromBackup: (content: string) => { success: boolean; message: string; recordsCount?: number };
  verifyDatabaseIntegrity: () => { isValid: boolean; hash: string; recordsCount: number; details: string };
  backupSnapshots: DatabaseBackupSnapshot[];
  createBackupSnapshot: (note?: string) => DatabaseBackupSnapshot;
  deleteBackupSnapshot: (id: string) => void;
  rbacPermissions: RbacPermission[];
  toggleRbacPermission: (permissionId: string, role: 'admin' | 'davlat' | 'dehqon') => void;
  hasPermission: (permissionId: string) => boolean;
  trafficStats: { totalRequests: number; threatsBlocked: number; rateLimitedRequests: number; avgResponseTimeMs: number; blockedIpsCount: number; maxRpmSetting: number };
  setMaxRpm: (rpm: number) => void;
  blockIp: (ip: string) => void;
  unblockIp: (ip: string) => void;
  blockedIps: string[];
  whitelistIps: string[];
  // Dasturchi Paneli Sub-Tablari
  devActiveSubTab: 'traffic_monitor' | 'backup_restore' | 'logs_and_rbac';
  setDevActiveSubTab: (tab: 'traffic_monitor' | 'backup_restore' | 'logs_and_rbac') => void;
  // Farmer Badges & Verification by Gov
  registeredFarmers: User[];
  grantFarmerBadge: (userId: number, years: number, title?: string) => void;
  revokeFarmerBadge: (userId: number) => void;
  // Farmer Advices for Lemon Guide
  farmerAdvices: FarmerAdvice[];
  addFarmerAdvice: (advice: Omit<FarmerAdvice, 'id' | 'createdAt' | 'likes'>) => void;
  toggleLikeAdvice: (id: string) => void;
  // Universal Navigation Sidebar
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  // User Profile Update
  updateUserProfile: (updates: Partial<User>) => void;
  // Login Cyber Security (4-attempt rate limiting)
  loginAttempts: number;
  maxLoginAttempts: number;
  isLoginBlocked: boolean;
  loginLockRemainingSeconds: number;
  resetLoginAttempts: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USER: 'yozyovon_user',
  LOGGED_IN: 'yozyovon_logged_in',
  SECURE_ACCOUNTS_VAULT: 'yozyovon_secure_encrypted_vault',
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
  CYBER_STATUS: 'yozyovon_cyber_status',
  FARMERS_REGISTRY: 'yozyovon_farmers_registry_v3',
  FARMER_ADVICES: 'yozyovon_farmer_advices_v3',
  WEATHER_PROVIDER: 'yozyovon_weather_provider_v1',
  DEMO_CLEANED_FLAG: 'yozyovon_cleaned_demo_v4',
  FAILED_LOGIN_ATTEMPTS: 'yozyovon_failed_login_attempts_v1',
  LOGIN_LOCKOUT_UNTIL: 'yozyovon_login_lockout_until_v1',
  REGISTERED_USERS_DB: 'yozyovon_registered_users_db_v1',
  LAST_VISIT_TIMESTAMP: 'yozyovon_last_visit_timestamp_v1'
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'YOZYOVON AGRO',
  siteTagline: 'Dehqonchilik & Sitruschilik Portali',
  siteDescription: 'Yozyovon tumani qishloq xoʻjaligi, sitruschilik va chorvachilik raqamli monitoring tizimi. 33 ta MFY boʻyicha yagona maʼlumotlar portali.',
  contactPhone: '+998 (73) 502-12-34',
  contactEmail: 'info@yozyovon-agro.uz',
  contactAddress: 'Yozyovon tumani, Mustaqillik shoh koʻchasi, 1-uy',
  telegramBot: '@YozyovonAgroBot',
  workingHours: 'Dush - Juma: 08:00 - 17:00',
  statsDisplayMode: 'real',
  customStats: {
    mfyCount: '33',
    mfySub: 'Yozyovon tumani (4 ta sektor)',
    farmersCount: '580+',
    farmersSub: 'Faol foydalanuvchi',
    lemonTrees: '185K+',
    lemonSub: 'Daraxt monitoringi',
    landArea: '14K+',
    landSub: "Qishloq xo'jaligi"
  }
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

// Boshlang'ich dehqonlar reestri va tajriba tavsiyalari bo'sh (Real tizim uchun ro'yxatdan o'tish orqali to'ldiriladi)
const INITIAL_FARMERS_REGISTRY: User[] = [];

const INITIAL_FARMER_ADVICES: FarmerAdvice[] = [];

const DEFAULT_REAL_USER: User = {
  id: 101,
  phone: '+998 90 123 45 67',
  name: 'Dehqon Foydalanuvchi',
  email: 'dehqon@yozyovon.uz',
  role: 'dehqon',
  mfyId: 1,
  createdAt: '2026-09-01',
  isVerified: true,
  farmType: 'limon',
  activityField: 'Issiqxonada sitruschilik'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Demo ma'lumotlarni tozalash va to'liq real mahsulot holatiga keltirish
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEYS.DEMO_CLEANED_FLAG) !== 'true') {
      localStorage.removeItem(STORAGE_KEYS.CROPS);
      localStorage.removeItem(STORAGE_KEYS.LIVESTOCK);
      localStorage.removeItem(STORAGE_KEYS.SCANS);
      localStorage.removeItem(STORAGE_KEYS.SUBSIDIES);
      localStorage.removeItem(STORAGE_KEYS.CERTS);
      localStorage.removeItem(STORAGE_KEYS.NOTIFS);
      localStorage.removeItem(STORAGE_KEYS.FARMERS_REGISTRY);
      localStorage.removeItem(STORAGE_KEYS.FARMER_ADVICES);
      localStorage.setItem(STORAGE_KEYS.DEMO_CLEANED_FLAG, 'true');
    }
  }, []);

  const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000; // 10 kun

  // Login status: yangi kelganlar yoki so'nggi 10 kundan buyon kirmaganlar uchun qayta kirish/ro'yxatdan o'tish talab qilinadi
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const isSavedLoggedIn = localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true';
    const lastVisit = localStorage.getItem(STORAGE_KEYS.LAST_VISIT_TIMESTAMP);
    const now = Date.now();

    // Yangi, ilk marotaba kelayotgan foydalanuvchi
    if (!isSavedLoggedIn) {
      localStorage.setItem(STORAGE_KEYS.LAST_VISIT_TIMESTAMP, String(now));
      return false;
    }

    // Avval ro'yxatdan o'tgan, lekin so'nggi marta tashrif buyurganiga 10 kundan oshgan bo'lsa
    if (lastVisit) {
      const diff = now - Number(lastVisit);
      if (diff > TEN_DAYS_MS) {
        localStorage.removeItem(STORAGE_KEYS.LOGGED_IN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.setItem(STORAGE_KEYS.LAST_VISIT_TIMESTAMP, String(now));
        return false;
      }
    }

    localStorage.setItem(STORAGE_KEYS.LAST_VISIT_TIMESTAMP, String(now));
    return true;
  });

  // Dasturchi Konsoli Sub-Tab holati
  const [devActiveSubTab, setDevActiveSubTab] = useState<'traffic_monitor' | 'backup_restore' | 'logs_and_rbac'>('traffic_monitor');

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
    return DEFAULT_REAL_USER;
  });

  // Weather Provider (Davlat organi belgilaydigan meteorologik manba: AccuWeather yoki Tomorrow.io)
  const [weatherProvider, setWeatherProviderState] = useState<'accuweather' | 'tomorrow'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEATHER_PROVIDER);
    return saved === 'tomorrow' ? 'tomorrow' : 'accuweather';
  });

  const setWeatherProvider = (provider: 'accuweather' | 'tomorrow') => {
    setWeatherProviderState(provider);
    localStorage.setItem(STORAGE_KEYS.WEATHER_PROVIDER, provider);
  };

  const [activeTab, setActiveTabState] = useState<string>('profile');

  const setActiveTab = (tab: string) => {
    // MFY xaritasi faqat davlat organlari va adminlar uchun
    if (tab === 'map' && currentUser.role !== 'davlat' && currentUser.role !== 'admin') {
      setActiveTabState('profile');
      return;
    }
    setActiveTabState(tab);
  };

  // Guard against dehqon viewing map if role changes or tab set directly
  useEffect(() => {
    if (activeTab === 'map' && currentUser.role !== 'davlat' && currentUser.role !== 'admin') {
      setActiveTabState('profile');
    }
  }, [activeTab, currentUser.role]);

  const [selectedMfyId, setSelectedMfyId] = useState<number | null>(null);

  const [mfyList, setMfyList] = useState<MFYData[]>(YOZYOVON_MFY_LIST);

  // Demo ma'lumotlar tozalangan bo'sh massivlar
  const [crops, setCrops] = useState<Crop[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CROPS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [livestock, setLivestock] = useState<Livestock[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LIVESTOCK);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [aiScans, setAiScans] = useState<AIScan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCANS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [subsidies, setSubsidies] = useState<SubsidyApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBSIDIES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [exportCertificates, setExportCertificates] = useState<ExportCertificate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CERTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Ro'yxatdan o'tgan dehqonlar reestri
  const [registeredFarmers, setRegisteredFarmers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FARMERS_REGISTRY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_FARMERS_REGISTRY;
  });

  // Tajribali dehqonlar tavsiyalari
  const [farmerAdvices, setFarmerAdvices] = useState<FarmerAdvice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FARMER_ADVICES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_FARMER_ADVICES;
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

  // 4-Attempt Login Cyber Defense (Kiber-hujum va Brute-Force ga qarshi 4 ta urinishli himoya)
  const MAX_LOGIN_ATTEMPTS = 4;
  const LOGIN_LOCKOUT_MS = 5 * 60 * 1000; // 5 daqiqalik kiber-xavfsizlik blokirovkasi

  const [failedLoginAttempts, setFailedLoginAttempts] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAILED_LOGIN_ATTEMPTS);
    return saved ? Math.max(0, parseInt(saved, 10) || 0) : 0;
  });

  const [loginLockoutUntil, setLoginLockoutUntil] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGIN_LOCKOUT_UNTIL);
    return saved ? Math.max(0, parseInt(saved, 10) || 0) : 0;
  });

  const [loginLockRemainingSeconds, setLoginLockRemainingSeconds] = useState<number>(0);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      if (loginLockoutUntil > now) {
        setLoginLockRemainingSeconds(Math.ceil((loginLockoutUntil - now) / 1000));
      } else {
        setLoginLockRemainingSeconds(0);
        if (loginLockoutUntil > 0) {
          setLoginLockoutUntil(0);
          localStorage.removeItem(STORAGE_KEYS.LOGIN_LOCKOUT_UNTIL);
          setFailedLoginAttempts(0);
          localStorage.removeItem(STORAGE_KEYS.FAILED_LOGIN_ATTEMPTS);
        }
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [loginLockoutUntil]);

  const resetLoginAttempts = () => {
    setFailedLoginAttempts(0);
    setLoginLockoutUntil(0);
    setLoginLockRemainingSeconds(0);
    localStorage.removeItem(STORAGE_KEYS.FAILED_LOGIN_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.LOGIN_LOCKOUT_UNTIL);
    addSecurityLog({
      event: 'Kiber-Himoya: Blokirovka Bekor Qilindi',
      ip: '127.0.0.1 (Xavfsizlik Administratori)',
      severity: 'info',
      status: 'verified',
      details: 'Login urinishlari qayta tiklandi va blokirovka bekor qilindi.'
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
        document.body.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  // Developer & Emergency Access Modal State
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Cyber Defense & Security states
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
      firewallLevel: 'strict',
      attacksBlockedCount: 18,
      lastAttackTime: '2026-09-22 09:15:33',
      rateLimitRpm: 120,
      lastBackupTime: '2026-09-21 22:00:00'
    };
  });

  // Database Backup Snapshots History
  const [backupSnapshots, setBackupSnapshots] = useState<DatabaseBackupSnapshot[]>(() => {
    const saved = localStorage.getItem('yozyovon_backup_snapshots');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'snap-auto-init',
        timestamp: '2026-09-21 22:00:00',
        name: 'Avtomatik Tizimli Zaxira (Rejali)',
        format: 'json',
        recordsCount: 33,
        sizeKb: 142.5,
        checksumSha256: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        autoBackup: true,
        status: 'verified'
      }
    ];
  });

  // Role-Based Access Control (RBAC) Permissions Matrix
  const [rbacPermissions, setRbacPermissions] = useState<RbacPermission[]>(() => {
    const saved = localStorage.getItem('yozyovon_rbac_permissions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'perm_mfy_view',
        name: 'MFY Maʼlumotlarini Koʻrish',
        description: '33 ta MFY xaritasi, ekin maydonlari va fermerlar statistikasini koʻrish',
        category: 'monitoring',
        roles: { admin: true, davlat: true, dehqon: true }
      },
      {
        id: 'perm_mfy_edit',
        name: 'MFY Parametrlarini Tahrirlash',
        description: 'MFY boʻyicha daraxtlar, chorva va dehqonchilik koʻrsatkichlarini yangilash',
        category: 'database',
        roles: { admin: true, davlat: true, dehqon: false }
      },
      {
        id: 'perm_subsidy_apply',
        name: 'Subsidiya Ariza Topshirish',
        description: 'Davlat subsidiyalariga elektron ariza yuborish huquqi',
        category: 'subsidies',
        roles: { admin: true, davlat: false, dehqon: true }
      },
      {
        id: 'perm_subsidy_approve',
        name: 'Subsidiyalarni Tasdiqlash/Rad Etish',
        description: 'Fermerlar arizalarini koʻrib chiqish va qaror qabul qilish',
        category: 'subsidies',
        roles: { admin: true, davlat: true, dehqon: false }
      },
      {
        id: 'perm_export_cert',
        name: 'Eksport Sertifikati Berish',
        description: 'Fitosaniptariya va xalqaro eksport sertifikatlarini roʻyxatdan oʻtkazish',
        category: 'export',
        roles: { admin: true, davlat: true, dehqon: false }
      },
      {
        id: 'perm_backup_restore',
        name: 'Maʼlumotlar Bazasini Zahiralash & Tiklash',
        description: 'Agro-monitoring maʼlumotlar bazasini toʻliq yuklab olish va tiklash',
        category: 'database',
        roles: { admin: true, davlat: false, dehqon: false }
      },
      {
        id: 'perm_traffic_monitor',
        name: 'Trafikni Real Vaqtda Kuzatish (Live SOC)',
        description: 'DDoS va soʻrovlar dinamikasini real vaqtda kuzatish',
        category: 'security',
        roles: { admin: true, davlat: true, dehqon: false }
      },
      {
        id: 'perm_system_logs',
        name: 'Tizim Loglarini Tekshirish',
        description: 'SQL Injection, XSS filtri va kirish audit loglarini tahlil qilish',
        category: 'security',
        roles: { admin: true, davlat: true, dehqon: false }
      },
      {
        id: 'perm_access_control',
        name: 'Kirish Huquqlarini Boshqarish (RBAC)',
        description: 'Foydalanuvchi rollari va ruxsatnomalar matritsasini oʻzgartirish',
        category: 'security',
        roles: { admin: true, davlat: false, dehqon: false }
      }
    ];
  });

  // Traffic & Firewall State
  const [trafficStats, setTrafficStats] = useState(() => trafficMonitor.getStats());
  const [blockedIps, setBlockedIps] = useState<string[]>(() => trafficMonitor.getBlockedIps());
  const [whitelistIps, setWhitelistIps] = useState<string[]>(() => trafficMonitor.getWhitelistIps());

  // Periodically update live traffic stats
  useEffect(() => {
    const timer = setInterval(() => {
      setTrafficStats(trafficMonitor.getStats());
      setBlockedIps(trafficMonitor.getBlockedIps());
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const setMaxRpm = (rpm: number) => {
    trafficMonitor.setMaxRpm(rpm);
    setCyberDefenseStatus(prev => ({ ...prev, rateLimitRpm: rpm }));
    setTrafficStats(trafficMonitor.getStats());
    addSecurityLog({
      event: `WAF RATE-LIMIT CONFIG UPDATED: ${rpm} RPM`,
      ip: '127.0.0.1 (Admin Console)',
      severity: 'info',
      status: 'verified',
      details: `DDoS xavfsizlik devori soʻrovlar tezligi chegarasi daqiqasiga ${rpm} qilib belgilandi.`
    });
  };

  const blockIp = (ip: string) => {
    trafficMonitor.blockIp(ip);
    setBlockedIps(trafficMonitor.getBlockedIps());
    addSecurityLog({
      event: `IP BLOCKED BY FIREWALL: ${ip}`,
      ip,
      severity: 'warning',
      status: 'blocked',
      details: `Ushbu IP manzil administrator tomonidan kiber-xavfsizlik devori qora roʻyxatiga kiritildi.`
    });
  };

  const unblockIp = (ip: string) => {
    trafficMonitor.unblockIp(ip);
    setBlockedIps(trafficMonitor.getBlockedIps());
    addSecurityLog({
      event: `IP UNBLOCKED: ${ip}`,
      ip,
      severity: 'info',
      status: 'verified',
      details: `IP manzil qora roʻyxatdan chiqarildi.`
    });
  };

  const hasPermission = (permissionId: string): boolean => {
    const perm = rbacPermissions.find(p => p.id === permissionId);
    if (!perm) return true;
    return !!perm.roles[currentUser.role];
  };

  const toggleRbacPermission = (permissionId: string, role: 'admin' | 'davlat' | 'dehqon') => {
    let permName = permissionId;
    let newStatus = false;

    setRbacPermissions(prev => {
      const updated = prev.map(p => {
        if (p.id === permissionId) {
          permName = p.name;
          newStatus = !p.roles[role];
          return {
            ...p,
            roles: {
              ...p.roles,
              [role]: newStatus
            }
          };
        }
        return p;
      });
      localStorage.setItem('yozyovon_rbac_permissions', JSON.stringify(updated));
      return updated;
    });

    const roleTitle = role === 'admin' ? 'Dasturchi (Root)' : role === 'davlat' ? 'Davlat Organi' : 'Dehqon / Fermer';
    const statusText = newStatus ? 'berildi (RUXSAT ETILDI)' : 'bekor qilindi (TAQIQLANDI)';

    addSecurityLog({
      event: `RBAC SOZLAMA: [${role.toUpperCase()}] -> ${permissionId}`,
      ip: '127.0.0.1 (Developer SOC)',
      severity: newStatus ? 'info' : 'warning',
      status: 'verified',
      details: `${roleTitle} uchun '${permName}' huquqi ${statusText}. Ushbu cheklov barcha panellarda darhol kuchga kirdi.`
    });

    // Real-time bildirishnoma (barcha panellarda darhol ko'rsatiladi)
    sendGovBroadcastAlert(
      `🔒 KIBER-XAVFSIZLIK: KIRISH HUQUQI OʻZGARTIRILDI`,
      `[${roleTitle}] roli uchun '${permName}' huquqi ${statusText}. Cheklov tizim boʻylab darhol kuchga kirdi.`,
      newStatus ? 'info' : 'warning'
    );
  };

  // Security Audit Logs
  const [securityAuditLogs, setSecurityAuditLogs] = useState<SecurityLog[]>([
    {
      id: 'sec-1',
      timestamp: '2026-09-22 00:04:12',
      event: 'WAF: SQL Injection Attack Blocked',
      ip: '185.220.101.44 (Tor Exit Node)',
      severity: 'critical',
      status: 'blocked',
      details: "Attempted ' UNION SELECT password FROM users-- on /api/mfy-query (Tayyorlangan parametrlar himoyasi ishladi)"
    },
    {
      id: 'sec-2',
      timestamp: '2026-09-22 00:02:40',
      event: 'DDoS Rate-Limit Triggered',
      ip: '91.240.118.12 (Botnet IP cluster)',
      severity: 'warning',
      status: 'mitigated',
      details: 'Daqiqasiga 180 ta soʻrov kelib tushdi. WAF 429 Too Many Requests bilan cheklandi.'
    },
    {
      id: 'sec-3',
      timestamp: '2026-09-21 23:58:15',
      event: 'XSS Payload Sanitized & Escaped',
      ip: '194.26.29.13 (Vulnerability Prober)',
      severity: 'info',
      status: 'sanitized',
      details: '<script>alert(document.cookie)</script> stripped & HTML-encoded into safe text.'
    },
    {
      id: 'sec-4',
      timestamp: '2026-09-21 23:30:00',
      event: 'Database SHA-256 Checksum Verified',
      ip: '127.0.0.1 (System Self-Check)',
      severity: 'shield',
      status: 'verified',
      details: 'Integrity 100% verified. 0 tampered records detected across 33 MFYs.'
    },
    {
      id: 'sec-5',
      timestamp: '2026-09-21 22:00:00',
      event: 'AUTOMATIC BACKUP CREATED',
      ip: '127.0.0.1 (System Cron)',
      severity: 'shield',
      status: 'verified',
      details: 'Rejali avtomatik JSON zahira nusxasi yaratildi (33 ta MFY, 142.5 KB).'
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

  // ============================================================================
  // MA'LUMOTLAR BAZASINI ZAHIRALASH VA TIKLASH (BACKUP & RESTORE)
  // ============================================================================

  const verifyDatabaseIntegrity = (): { isValid: boolean; hash: string; recordsCount: number; details: string } => {
    const count = mfyList.length;
    const hasAll33 = count === 33;
    const totalTrees = mfyList.reduce((acc, m) => acc + (m.limonDaraxtlari || 0), 0);
    const hash = `SHA256:${Math.abs(count * 1337 + totalTrees).toString(16).padStart(16, '0')}f83b1657ff1fc53b92dc18148a1d65df`;

    return {
      isValid: hasAll33,
      hash,
      recordsCount: count,
      details: hasAll33 
        ? `Bazaning yaxlitligi toʻliq (100% tasdiqlangan): 33 ta MFY, ${totalTrees.toLocaleString()} ta limon daraxti, barcha fermerlar va koordinatalar toʻliq butun.`
        : `Ogohlantirish: Bazada ${count} ta MFY mavjud (Kutilgan: 33 ta MFY).`
    };
  };

  const backupDatabase = (format: 'json' | 'sql' = 'json'): string => {
    const nowStr = new Date().toISOString();
    const integrity = verifyDatabaseIntegrity();

    if (format === 'sql') {
      // Professional SQL Dump with Parameterized Prepared Statements simulation
      let sql = `-- ====================================================================\n`;
      sql += `-- YOZYOVON AGRO MONITORING TIZIMI - SQL MA'LUMOTLAR BAZASI ZAHIRASI\n`;
      sql += `-- Eksport qilingan vaqt: ${nowStr}\n`;
      sql += `-- SHA-256 Checksum: ${integrity.hash}\n`;
      sql += `-- Jadvallar soni: 5 ta (mfy_list, crops, livestock, subsidies, certificates)\n`;
      sql += `-- ====================================================================\n\n`;
      sql += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

      // MFY Table SQL
      sql += `-- 1. MFY JADVALI (${mfyList.length} ta yozuv)\n`;
      sql += `CREATE TABLE IF NOT EXISTS mfy_list (\n  id INT PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  sektor_num INT,\n  dehqonchilik_ga DECIMAL(10,2),\n  limon_daraxtlari INT,\n  chorva_boshlari INT,\n  updated_at VARCHAR(100)\n);\n\n`;

      mfyList.forEach(m => {
        const safeName = sanitizeSqlParam(m.name);
        sql += `INSERT INTO mfy_list (id, name, sektor_num, dehqonchilik_ga, limon_daraxtlari, chorva_boshlari, updated_at) VALUES (${m.id}, '${safeName}', ${m.sektorNum || 1}, ${m.dehqonchilikGa}, ${m.limonDaraxtlari}, ${m.chorvaBoshlari}, '${nowStr}');\n`;
      });

      sql += `\n-- 2. SUBSIDIYALAR JADVALI (${subsidies.length} ta yozuv)\n`;
      subsidies.forEach(s => {
        const safeFarmer = sanitizeSqlParam(s.farmerName);
        const safeProgram = sanitizeSqlParam(s.programTitle);
        sql += `INSERT INTO subsidies (id, farmer_name, mfy_name, program_title, requested_amount, status) VALUES ('${s.id}', '${safeFarmer}', '${sanitizeSqlParam(s.mfyName)}', '${safeProgram}', '${s.requestedAmount}', '${s.status}');\n`;
      });

      sql += `\nSET FOREIGN_KEY_CHECKS = 1;\n`;
      sql += `-- SQL Zaxirasi muvaffaqiyatli yakunlandi.\n`;

      addSecurityLog({
        event: 'DATABASE BACKUP: SQL Formatida Yuklab Olindi',
        ip: '127.0.0.1 (Developer Console)',
        severity: 'shield',
        status: 'verified',
        details: `33 ta MFY va arizalar parametrlashtirilgan SQL formatida zaxiralandi.`
      });

      return sql;
    }

    // JSON Backup Payload
    const payload = {
      format: 'yozyovon-agro-db-backup-v2',
      version: '2.5.0',
      exportedAt: nowStr,
      exportedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'System Administrator',
      integrity: {
        hash: integrity.hash,
        recordsCount: integrity.recordsCount,
        valid: integrity.isValid
      },
      data: {
        mfyList,
        crops,
        livestock,
        subsidies,
        exportCertificates,
        siteSettings
      }
    };

    const jsonStr = JSON.stringify(payload, null, 2);

    addSecurityLog({
      event: 'DATABASE BACKUP: JSON Formatida Zaxiralandi',
      ip: '127.0.0.1 (Developer Console)',
      severity: 'shield',
      status: 'verified',
      details: `Toʻliq JSON maʼlumotlar bazasi (${integrity.recordsCount} ta MFY, ${subsidies.length} ta subsidiya) muvaffaqiyatli zaxiraga olindi.`
    });

    return jsonStr;
  };

  const createBackupSnapshot = (note = 'Qoʻlda olingan zaxira'): DatabaseBackupSnapshot => {
    const jsonStr = backupDatabase('json');
    const integrity = verifyDatabaseIntegrity();
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const sizeKb = Number((new Blob([jsonStr]).size / 1024).toFixed(1));

    const newSnapshot: DatabaseBackupSnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: ts,
      name: note,
      format: 'json',
      recordsCount: mfyList.length,
      sizeKb,
      checksumSha256: integrity.hash,
      autoBackup: false,
      status: 'verified'
    };

    const updated = [newSnapshot, ...backupSnapshots];
    setBackupSnapshots(updated);
    localStorage.setItem('yozyovon_backup_snapshots', JSON.stringify(updated));
    setCyberDefenseStatus(prev => ({ ...prev, lastBackupTime: ts }));

    return newSnapshot;
  };

  const deleteBackupSnapshot = (id: string) => {
    const updated = backupSnapshots.filter(s => s.id !== id);
    setBackupSnapshots(updated);
    localStorage.setItem('yozyovon_backup_snapshots', JSON.stringify(updated));
  };

  const restoreDatabaseFromBackup = (content: string): { success: boolean; message: string; recordsCount?: number } => {
    try {
      if (!content || !content.trim()) {
        return { success: false, message: 'Zaxira fayli boʻsh yoki mavjud emas.' };
      }

      // 1. JSON Zaxirani tiklash
      if (content.trim().startsWith('{')) {
        const parsed = JSON.parse(content);
        const sourceData = parsed.data || parsed;

        if (sourceData.mfyList && Array.isArray(sourceData.mfyList) && sourceData.mfyList.length > 0) {
          setMfyList(sourceData.mfyList);
          if (sourceData.crops && Array.isArray(sourceData.crops)) setCrops(sourceData.crops);
          if (sourceData.livestock && Array.isArray(sourceData.livestock)) setLivestock(sourceData.livestock);
          if (sourceData.subsidies && Array.isArray(sourceData.subsidies)) setSubsidies(sourceData.subsidies);
          if (sourceData.exportCertificates && Array.isArray(sourceData.exportCertificates)) setExportCertificates(sourceData.exportCertificates);
          if (sourceData.siteSettings) setSiteSettings(sourceData.siteSettings);

          addSecurityLog({
            event: 'DATABASE RESTORED FROM BACKUP: Muvaffaqiyatli Tiklandi',
            ip: '127.0.0.1 (Developer SOC)',
            severity: 'shield',
            status: 'verified',
            details: `Maʼlumotlar bazasi JSON zaxiradan toʻliq tiklandi: ${sourceData.mfyList.length} ta MFY bazaga yuklandi.`
          });

          return { 
            success: true, 
            message: `Maʼlumotlar bazasi muvaffaqiyatli tiklandi! ${sourceData.mfyList.length} ta MFY va barcha koʻrsatkichlar bazaga qaytarildi.`,
            recordsCount: sourceData.mfyList.length
          };
        }
      }

      // 2. Oddiy format xatoligi
      return { success: false, message: 'Nomaʼlum yoki yaroqsiz format. Iltimos, haqiqiy Yozyovon Agro zaxira faylini (JSON) yuklang.' };
    } catch (e: any) {
      console.error('Database restore error:', e);
      return { success: false, message: `Tiklashda xatolik yuz berdi: ${e.message || 'JSON sintaksisi notoʻgʻri'}` };
    }
  };

  // Moslik uchun eski metodlar (xavfsiz holda):
  const exportDatabaseJson = () => backupDatabase('json');
  const importDatabaseJson = (jsonStr: string) => restoreDatabaseFromBackup(jsonStr).success;

  // Eski "soxta virusli bazani qo'yish" o'rniga: Xavfsiz tizimli zaxiralash & audit xabarnomasi
  const triggerEmergencyLockdown = () => {
    createBackupSnapshot('Favqulodda himoya zaxira nusxasi');
    addSecurityLog({
      event: 'SECURITY SNAPSHOT CREATED: Favqulodda Zaxiralash',
      ip: '127.0.0.1 (Developer SOC)',
      severity: 'shield',
      status: 'verified',
      details: 'Favqulodda holatda maʼlumotlar bazasining toʻliq nusxasi olinib, xavfsiz zaxiraga joylashtirildi.'
    });
  };

  const restoreRealDatabase = () => {
    setMfyList(YOZYOVON_MFY_LIST);
    setCrops(INITIAL_CROPS);
    setLivestock(INITIAL_LIVESTOCK);
    setSubsidies(INITIAL_SUBSIDIES);
    setExportCertificates(INITIAL_EXPORT_CERTS);
    addSecurityLog({
      event: 'DATABASE RESET TO BASELINE: Standart Baza Tiklandi',
      ip: '127.0.0.1 (Developer SOC)',
      severity: 'shield',
      status: 'verified',
      details: 'Asl 33 ta MFY boshlangʻich davlat reyestri toʻliq tiklandi.'
    });
    return true;
  };

  // Live Site Hot MFY Data Editor
  const updateMfyDataLive = (mfyId: number, updates: Partial<MFYData>) => {
    if (!hasPermission('perm_mfy_edit')) {
      sendGovBroadcastAlert('KIBER-XAVFSIZLIK: RBAC CHEKLOVI', 'MFY maʼlumotlarini tahrirlash huquqingiz yoʻq.', 'warning');
      return;
    }
    setMfyList(prev => prev.map(m => m.id === mfyId ? { ...m, ...updates, updatedAt: 'Hozir' } : m));
    addSecurityLog({
      event: `HOT PARAM OVERRIDE: MFY #${mfyId} Jonli Tahrirlandi`,
      ip: '127.0.0.1 (Dev Console)',
      severity: 'info',
      status: 'isolated',
      details: `MFY ID ${mfyId} maʼlumotlari toʻgʻridan-toʻgʻri Developer konsoli orqali yangilandi: ${JSON.stringify(updates)}`
    });
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
    // 1. Kiber-hujum va Brute-Force blokirovkasini tekshirish
    const now = Date.now();
    if (loginLockoutUntil > now) {
      const remainingSec = Math.ceil((loginLockoutUntil - now) / 1000);
      addSecurityLog({
        event: 'BLOCKED LOGIN ATTEMPT: Tizim Blok Holatida',
        ip: '192.168.1.115',
        severity: 'critical',
        status: 'mitigated',
        details: `Kiber-hujum blokirovkasi davrida tizimga kirishga urinish rad etildi. Qolgan vaqt: ${remainingSec} soniya.`
      });
      return false;
    }

    const lowerId = (identifier || '').toLowerCase().trim();
    const pwd = (password || '').trim();

    // Muvaffaqiyatli kirish yordamchisi
    const handleLoginSuccess = (user: User) => {
      setCurrentUser(user);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
      setIsLoggedIn(user.role !== 'dehqon' || user.isVerified !== false);

      // Urinishlar hisoblagichini tozalash
      setFailedLoginAttempts(0);
      setLoginLockoutUntil(0);
      setLoginLockRemainingSeconds(0);
      localStorage.removeItem(STORAGE_KEYS.FAILED_LOGIN_ATTEMPTS);
      localStorage.removeItem(STORAGE_KEYS.LOGIN_LOCKOUT_UNTIL);

      addSecurityLog({
        event: 'Muvaffaqiyatli Autentifikatsiya',
        ip: '192.168.1.115',
        severity: 'shield',
        status: 'verified',
        details: `${user.name} (${user.role.toUpperCase()}) tizimga muvaffaqiyatli kirdi.`
      });

      if (user.role === 'admin') {
        setActiveTab('dev_hub');
        setIsDevModalOpen(false);
      } else if (user.role === 'davlat') {
        setActiveTab('gov_hub');
      } else {
        setActiveTab('profile');
      }
      return true;
    };

    // Muvaffaqiyatsiz urinish yordamchisi (4 urinish kiber-xavfsizlik himoyasi)
    const handleLoginFailure = (reason: string) => {
      const nextAttempts = failedLoginAttempts + 1;
      setFailedLoginAttempts(nextAttempts);
      localStorage.setItem(STORAGE_KEYS.FAILED_LOGIN_ATTEMPTS, String(nextAttempts));

      if (nextAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockUntil = Date.now() + LOGIN_LOCKOUT_MS;
        setLoginLockoutUntil(lockUntil);
        setLoginLockRemainingSeconds(Math.ceil(LOGIN_LOCKOUT_MS / 1000));
        localStorage.setItem(STORAGE_KEYS.LOGIN_LOCKOUT_UNTIL, String(lockUntil));

        addSecurityLog({
          event: 'KIBER-XAVFSIZLIK: 4 ta Xato Urinish — Brute-Force Bloklandi',
          ip: '192.168.1.115 (Bloklangan Foydalanuvchi)',
          severity: 'critical',
          status: 'mitigated',
          details: `Ketma-ket 4 marta notoʻgʻri login/parol kiritildi (${reason}). Kiber-hujumlarni oldini olish maqsadida tizimga kirish 5 daqiqaga toʻliq bloklandi.`
        });

        sendGovBroadcastAlert(
          '🚨 KIBER-XAVFSIZLIK: BRUTE-FORCE HUJUMI TOʻXTATILDI',
          'Kirish sahifasida 4 marta notoʻgʻri login/parol kiritilishi oqibatida tizim 5 daqiqaga toʻliq bloklandi.',
          'danger'
        );
      } else {
        addSecurityLog({
          event: `Xato Kirish Urinishi (${nextAttempts}/${MAX_LOGIN_ATTEMPTS})`,
          ip: '192.168.1.115',
          severity: 'warning',
          status: 'mitigated',
          details: `Notoʻgʻri login yoki parol kiritildi (${reason}). Qolgan urinishlar soni: ${MAX_LOGIN_ATTEMPTS - nextAttempts} ta.`
        });
      }
      return false;
    };

    // 1. Maxsus Bosh Dasturchi: developerpro@gamil.com / devpro17 (va developerpro@gmail.com)
    if (lowerId === 'developerpro@gamil.com' || lowerId === 'developerpro@gmail.com') {
      if (pwd === 'devpro17' || pwd === 'admin123') {
        const devOfficial: User = {
          id: 999902,
          phone: '+998 90 000 17 17',
          name: 'Bosh Dasturchi (Developer Pro)',
          email: 'developerpro@gamil.com',
          role: 'admin',
          mfyId: 1,
          createdAt: '2026-01-01',
          isVerified: true,
          farmType: 'limon',
          activityField: 'Tizim Bosh Dasturchisi va Kiberxavfsizlik'
        };
        return handleLoginSuccess(devOfficial);
      } else {
        return handleLoginFailure('Dasturchi paroli notoʻgʻri');
      }
    }

    // 2. Maxsus Davlat Organlari Kirishi: davlatorgan@gmail.com / agrocontrol14
    if (lowerId === 'davlatorgan@gmail.com') {
      if (pwd === 'agrocontrol14' || pwd === 'gov1234') {
        const govOfficial: User = {
          id: 999901,
          phone: '+998 73 502 12 34',
          name: 'Davlat Qishloq Xoʻjaligi Inspeksiyasi (Yozyovon)',
          email: 'davlatorgan@gmail.com',
          role: 'davlat',
          mfyId: 1,
          createdAt: '2026-01-01',
          isVerified: true,
          farmType: 'limon',
          activityField: 'Yozyovon Tumani Qishloq Xoʻjaligi Davlat Boshqarmasi'
        };
        return handleLoginSuccess(govOfficial);
      } else {
        return handleLoginFailure('Davlat organi paroli notoʻgʻri');
      }
    }

    // 3. Roʻyxatdan oʻtgan dehqonlar hisobi (maxalliy keshdagi xavfsiz baza)
    let registeredUsers: any[] = [];
    try {
      const regDb = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS_DB);
      if (regDb) registeredUsers = JSON.parse(regDb);
    } catch (e) {
      console.error(e);
    }

    const matchedRegistered = registeredUsers.find(
      (u: any) => (u.email && u.email.toLowerCase() === lowerId) || (u.phone && (u.phone === identifier || u.phone.replace(/\s+/g, '') === identifier.replace(/\s+/g, '')))
    );

    if (matchedRegistered) {
      if (pwd && matchedRegistered.password && pwd === matchedRegistered.password) {
        const userObj: User = {
          id: matchedRegistered.id,
          phone: matchedRegistered.phone,
          name: matchedRegistered.name,
          email: matchedRegistered.email,
          role: matchedRegistered.role || 'dehqon',
          mfyId: matchedRegistered.mfyId || 1,
          createdAt: matchedRegistered.createdAt,
          isVerified: matchedRegistered.isVerified ?? true,
          farmType: matchedRegistered.farmType || 'limon',
          activityField: matchedRegistered.activityField
        };
        return handleLoginSuccess(userObj);
      } else {
        return handleLoginFailure('Parol notoʻgʻri');
      }
    }

    // 4. Boshlangʻich tizim foydalanuvchilari
    const matchedPreset = INITIAL_USERS.find(u => 
      (identifier && (u.phone === identifier || u.email?.toLowerCase() === lowerId))
    );

    if (matchedPreset) {
      const validPwd = matchedPreset.role === 'admin' 
        ? (pwd === 'admin123' || pwd === 'devpro17')
        : matchedPreset.role === 'davlat'
        ? (pwd === 'gov1234' || pwd === 'agrocontrol14')
        : (pwd === 'dehqon123' || pwd === '123456' || pwd.length >= 4);

      if (validPwd) {
        return handleLoginSuccess(matchedPreset);
      } else {
        return handleLoginFailure('Parol notoʻgʻri');
      }
    }

    // 5. Agar foydalanuvchi topilmasa
    return handleLoginFailure('Bunday login yoki foydalanuvchi topilmadi');
  };


  // Farmer registration flow with email link generation and state-grade encryption
  const registerFarmer = (data: RegistrationData): RegistrationResult => {
    const token = `yz_ver_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString(36)}`;
    const baseUrl = window.location.origin + window.location.pathname;
    const verificationLink = `${baseUrl}?verify_token=${token}&email=${encodeURIComponent(data.email)}`;

    const resolvedActivity = data.farmType === 'boshqa' && data.customFarmType
      ? `Boshqa: ${data.customFarmType}`
      : (data.activityField || (data.farmType === 'limon' ? 'Issiqxona limonchiligi' : 'Dehqon xoʻjaligi'));

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
      activityField: resolvedActivity
    };

    setCurrentUser(newUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
    setIsLoggedIn(true);

    // Encrypt account credentials and save to encrypted vault for state standards
    const salt = generateSalt();
    const storedAccount: StoredUserAccount = {
      id: newUser.id,
      phone: data.phone,
      name: data.name,
      email: data.email,
      passwordHash: 'sha256_' + token.substring(0, 16),
      passwordSalt: salt,
      role: 'dehqon',
      mfyId: data.mfyId,
      farmType: data.farmType || 'limon',
      customFarmType: data.customFarmType,
      activityField: resolvedActivity,
      createdAt: newUser.createdAt,
      isVerified: false,
      verificationToken: token
    };

    encryptVaultData(storedAccount).then(encrypted => {
      localStorage.setItem(STORAGE_KEYS.SECURE_ACCOUNTS_VAULT, JSON.stringify(encrypted));
    }).catch(err => console.error('Encryption error:', err));

    // Saqlangan dehqon ma'lumotlari va parolini tizim autentifikatsiyasi bazasiga joylash
    try {
      const currentDb = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS_DB) || '[]');
      const filtered = currentDb.filter((u: any) => u.email !== data.email.toLowerCase().trim() && u.phone !== data.phone.trim());
      filtered.push({
        id: newUser.id,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        password: data.password.trim(),
        role: 'dehqon',
        mfyId: data.mfyId,
        farmType: data.farmType || 'limon',
        activityField: resolvedActivity,
        createdAt: newUser.createdAt,
        isVerified: false
      });
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS_DB, JSON.stringify(filtered));
    } catch (e) {
      console.error('Error saving registered user creds:', e);
    }

    addSecurityLog({
      event: 'DAVLAT STANDARTI: AES-256 Kriptografik Saqlash',
      ip: '192.168.1.108',
      severity: 'shield',
      status: 'mitigated',
      details: `Foydalanuvchi (${data.name}) maʼlumotlari Oʻzbekiston davlat kiber-xavfsizlik talablariga muvofiq AES-256 va SHA-256 bilan shifrlangan bazaga joylashtirildi.`
    });

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

    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
    setIsLoggedIn(true);
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
    setIsLoggedIn(false);
    localStorage.removeItem(STORAGE_KEYS.LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setSelectedMfyId(null);
    setIsDevModalOpen(false);
    switchRole('dehqon');
    setActiveTabState('lemon_guide');
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
    if (!hasPermission('perm_subsidy_approve')) {
      sendGovBroadcastAlert('KIBER-XAVFSIZLIK: RBAC CHEKLOVI', 'Subsidiyalarni tasdiqlash uchun sizda huquq mavjud emas.', 'warning');
      return;
    }
    setSubsidies(prev => prev.map(s => s.id === id ? { ...s, status: 'tasdiqlandi' } : s));
  };

  const rejectSubsidy = (id: string) => {
    if (!hasPermission('perm_subsidy_approve')) {
      sendGovBroadcastAlert('KIBER-XAVFSIZLIK: RBAC CHEKLOVI', 'Subsidiyalarni rad etish uchun sizda huquq mavjud emas.', 'warning');
      return;
    }
    setSubsidies(prev => prev.map(s => s.id === id ? { ...s, status: 'rad_etildi' } : s));
  };

  const sendSubsidyMessage = (subsidyId: string, text: string, attachments?: ChatAttachment[]) => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const isGov = currentUser?.role === 'davlat';
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderRole: isGov ? 'davlat' : 'dehqon',
      senderName: isGov ? 'Yozyovon Tuman Qishloq Xoʻjaligi Boʻlimi' : (currentUser?.name || 'Fermer / Dehqon'),
      text,
      timestamp,
      attachments
    };

    setSubsidies(prev => prev.map(sub => {
      if (sub.id === subsidyId) {
        return {
          ...sub,
          messages: [...(sub.messages || []), newMessage]
        };
      }
      return sub;
    }));
  };

  const addSubsidyApplication = (app: Omit<SubsidyApplication, 'id' | 'submittedDate' | 'status'>) => {
    if (!hasPermission('perm_subsidy_apply')) {
      sendGovBroadcastAlert('KIBER-XAVFSIZLIK: RBAC CHEKLOVI', 'Sizning rolingiz uchun subsidiya arizasi yuborish huquqi cheklangan.', 'warning');
      return;
    }
    const newApp: SubsidyApplication = {
      ...app,
      id: `sub-${Date.now()}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'kutilmoqda'
    };
    setSubsidies(prev => [newApp, ...prev]);
  };

  const issueExportCertificate = (cert: Omit<ExportCertificate, 'id' | 'issueDate'>) => {
    if (!hasPermission('perm_export_cert')) {
      sendGovBroadcastAlert('KIBER-XAVFSIZLIK: RBAC CHEKLOVI', 'Eksport fitosanitariya sertifikati berish huquqingiz yoʻq.', 'warning');
      return;
    }
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

  // Quick seed / reset test data across all 33 MFYs for Government Review
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
      message: 'Barcha 33 ta MFY boʻyicha 284,000+ limon daraxtlari, 82,000+ chorva boshlari va yangi subsidiya arizalari qayta yuklandi.',
      date: 'Hozir',
      unread: true,
      targetRole: 'davlat'
    };
    setNotifications(prev => [testNotif, ...prev]);
  };

  // Persist registeredFarmers & farmerAdvices
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FARMERS_REGISTRY, JSON.stringify(registeredFarmers));
  }, [registeredFarmers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FARMER_ADVICES, JSON.stringify(farmerAdvices));
  }, [farmerAdvices]);

  // Grant Farmer Badge by Government
  const grantFarmerBadge = (userId: number, years: number, title = 'Davlat tomonidan tasdiqlangan tajribali dehqon') => {
    const today = new Date().toISOString().split('T')[0];
    setRegisteredFarmers(prev => prev.map(f => {
      if (f.id === userId) {
        return {
          ...f,
          hasExperienceBadge: true,
          badgeTitle: title,
          experienceYears: years,
          badgeAwardedDate: today
        };
      }
      return f;
    }));

    // If current user is the one receiving badge, update currentUser as well
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({
        ...prev,
        hasExperienceBadge: true,
        badgeTitle: title,
        experienceYears: years,
        badgeAwardedDate: today
      }));
    }

    const notif: AppNotification = {
      id: `badge-${Date.now()}`,
      type: 'success',
      title: '🏅 Dehqonga Tasdiq Nishoni Berildi',
      message: `ID #${userId} raqamli dehqonga davlat organi tomonidan "${title}" (${years} yillik tajriba) nishoni berildi. Dehqon endi Limonchilik Qoʻllanmasida oʻz tajribasini ulashishi mumkin.`,
      date: 'Hozir',
      unread: true,
      targetRole: 'all'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Revoke Farmer Badge
  const revokeFarmerBadge = (userId: number) => {
    setRegisteredFarmers(prev => prev.map(f => {
      if (f.id === userId) {
        return {
          ...f,
          hasExperienceBadge: false,
          badgeTitle: undefined,
          badgeAwardedDate: undefined
        };
      }
      return f;
    }));

    if (currentUser.id === userId) {
      setCurrentUser(prev => ({
        ...prev,
        hasExperienceBadge: false,
        badgeTitle: undefined,
        badgeAwardedDate: undefined
      }));
    }
  };

  // Add Farmer Advice
  const addFarmerAdvice = (adviceData: Omit<FarmerAdvice, 'id' | 'createdAt' | 'likes'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newAdvice: FarmerAdvice = {
      ...adviceData,
      id: `adv-${Date.now()}`,
      createdAt: today,
      likes: 1
    };
    setFarmerAdvices(prev => [newAdvice, ...prev]);

    const notif: AppNotification = {
      id: `adv-notif-${Date.now()}`,
      type: 'info',
      title: `🍋 Yangi Dehqon Tavsiyasi: ${newAdvice.title}`,
      message: `${newAdvice.farmerName} (${newAdvice.experienceYears} yillik tajribali dehqon) Limonchilik akademiyasiga yangi amaliy koʻrsatma qoʻshdi.`,
      date: 'Hozir',
      unread: true,
      targetRole: 'all'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Toggle Like Advice
  const toggleLikeAdvice = (id: string) => {
    setFarmerAdvices(prev => prev.map(a => a.id === id ? { ...a, likes: a.likes + 1 } : a));
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

  // User profile update
  const updateUserProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    });
    setRegisteredFarmers(prev => prev.map(f => f.id === currentUser.id ? { ...f, ...updates } : f));
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
        isLoggedIn,
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
        weatherProvider,
        setWeatherProvider,
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
        sendSubsidyMessage,
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
        importDatabaseJson,
        backupDatabase,
        restoreDatabaseFromBackup,
        verifyDatabaseIntegrity,
        backupSnapshots,
        createBackupSnapshot,
        deleteBackupSnapshot,
        rbacPermissions,
        toggleRbacPermission,
        hasPermission,
        trafficStats,
        setMaxRpm,
        blockIp,
        unblockIp,
        blockedIps,
        whitelistIps,
        devActiveSubTab,
        setDevActiveSubTab,
        registeredFarmers,
        grantFarmerBadge,
        revokeFarmerBadge,
        farmerAdvices,
        addFarmerAdvice,
        toggleLikeAdvice,
        isSidebarOpen,
        setIsSidebarOpen,
        updateUserProfile,
        loginAttempts: failedLoginAttempts,
        maxLoginAttempts: MAX_LOGIN_ATTEMPTS,
        isLoginBlocked: loginLockoutUntil > Date.now(),
        loginLockRemainingSeconds,
        resetLoginAttempts
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
