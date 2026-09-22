/**
 * Yozyovon tumani dehqonchilik va chorvachilik monitoring tizimi
 * Umumiy TypeScript tiplari
 */

export type UserRole = 'dehqon' | 'davlat' | 'admin';

export type FarmType = 
  | 'limon' 
  | 'chorva' 
  | 'chorva_mol'
  | 'chorva_qoy'
  | 'bogdorchilik' 
  | 'paxta_galla' 
  | 'bugdoy'
  | 'paxta'
  | 'sabzavot' 
  | 'tomorqa'
  | 'gidroponika'
  | 'parranda'
  | 'asalarichilik'
  | 'baliqchilik'
  | 'logistika'
  | 'kochatxona'
  | 'boshqa';

export interface User {
  id: number;
  phone: string;
  name: string;
  email?: string;
  role: UserRole;
  mfyId: number;
  avatar?: string;
  createdAt: string;
  isVerified?: boolean;
  verificationToken?: string;
  farmType?: FarmType;
  activityField?: string;
  // Davlat organi tomonidan beriladigan nishon
  hasExperienceBadge?: boolean;
  badgeTitle?: string;
  experienceYears?: number;
  badgeAwardedDate?: string;
}

export interface FarmerAdvice {
  id: string;
  farmerId: number;
  farmerName: string;
  farmerPhone?: string;
  mfyName: string;
  experienceYears: number;
  badgeTitle?: string;
  title: string;
  category: 'ekish' | 'parvarish' | 'zararkunanda' | 'hosil_yigish' | 'tajriba' | 'kasallik' | 'hosildorlik' | 'qishlash' | 'sugorish';
  content: string;
  medicines?: string;
  precautions?: string;
  createdAt: string;
  likes: number;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  telegramBot: string;
  workingHours: string;
}

export interface UploadedGuide {
  id: string;
  title: string;
  category: string;
  format: 'txt' | 'pdf' | 'json';
  content: string;
  fileSize: string;
  uploadedAt: string;
  downloadsCount: number;
}


export interface MFYMonthlyDynamics {
  month: string;
  limonTonna: number;
  bugdoyTonna: number;
  anorTonna: number;
  sutTonna: number;
}

export interface MFYLivestockStat {
  type: string;
  count: number;
  changePercent: number;
}

export interface AnonymousFarmer {
  id: string;
  code: string;
  cropType: string;
  areaGa: number;
  livestockCount: number;
  healthRate: number; // 0-100%
  status: 'yaxshi' | 'ortacha' | 'nazoratda';
}

export interface PestAlert {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  description?: string;
  date?: string;
  affectedCrops?: string[];
  recommendedAction?: string;
  pestType?: string;
  affectedAreaGa?: number;
  detectedDate?: string;
  recommendation?: string;
}

export interface StateProgram {
  id: string;
  title: string;
  budget: string;
  description: string;
  beneficiariesCount: number;
  status: 'faol' | 'yakunlangan' | 'rejalashtirilgan';
  deadline: string;
}

export interface MFYData {
  id: number;
  name: string;
  geojsonId: string;
  referendumNum?: number; // 1-rasmdagi Referendum / Saylov uchastkasi raqami (#551-#583)
  sektorNum?: 1 | 2 | 3 | 4; // 1-rasmdagi 4 ta Sektor (1-ko'k, 2-sariq, 3-qizil, 4-yashil)
  dehqonchilikGa: number;
  limonDaraxtlari: number;
  chorvaBoshlari: number;
  asosiyEkinlar: string[];
  center: [number, number]; // [lat, lng]
  polygonCoordinates: [number, number][]; // [[lat, lng], ...]
  dynamics12Months: MFYMonthlyDynamics[];
  livestockStats: MFYLivestockStat[];
  farmersCount: number;
  anonymousFarmers: AnonymousFarmer[];
  pestAlerts: PestAlert[];
  statePrograms: StateProgram[];
  updatedAt: string;
}

export interface Crop {
  id: number;
  userId: number;
  mfyId: number;
  cropType: 'limon' | 'anor' | 'uzum' | 'bugdoy';
  areaGa: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  healthStatus: 'yaxshi' | 'ortacha' | 'yomon';
  plantedDate: string;
  expectedHarvest: string;
  expectedYieldTons: number;
  actualYieldTons?: number;
  notes?: string;
}

export interface Livestock {
  id: number;
  userId: number;
  animalType: 'sigir' | 'qoy' | 'tovuq' | 'ot';
  count: number;
  ageMonths: number;
  healthStatus: 'soglom' | 'kasal' | 'homilador' | 'emlangan';
  lastCheckup: string;
  tagNumber?: string;
  notes?: string;
}

export interface AIScan {
  id: number;
  userId: number;
  mfyId: number;
  imageUrl: string;
  targetType: 'limon' | 'boshqa_ekin' | 'chorva';
  diseaseName: string;
  confidence: number; // 0-100%
  severity: 'high' | 'medium' | 'low';
  recommendations: string;
  medicines: string;
  scannedAt: string;
  reportedToGov: boolean;
}

export interface WeatherInfo {
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  soilTemp: number;
  soilMoisturePercent?: number;
  leafWetnessHours?: number;
  solarRadiationWm2?: number;
  frostRisk?: 'none' | 'low' | 'high';
  dewPoint?: number;
  pressureHpa?: number;
  hourlyForecast?: {
    time: string;
    temp: number;
    humidity: number;
    pop: number;
    condition: string;
  }[];
  forecast: {
    day: string;
    tempDay: number;
    tempNight: number;
    condition: string;
    icon: string;
  }[];
  agroAdvice: string;
}

export interface MarketPrice {
  id: string;
  product: string;
  category: 'meva' | 'chorva' | 'don' | 'sabzavot';
  ferganaPrice: number;
  qoqonPrice: number;
  yozyovonPrice: number;
  unit: string;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface AppNotification {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  date: string;
  unread: boolean;
  targetRole: 'dehqon' | 'davlat' | 'all';
}

export interface ChatAttachment {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf' | 'doc' | 'archive' | 'file';
  url?: string;
  dataUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderRole: 'davlat' | 'dehqon';
  senderName: string;
  text: string;
  timestamp: string;
  attachments?: ChatAttachment[];
}

export interface SubsidyApplication {
  id: string;
  farmerId?: number;
  farmerName: string;
  farmerPhone?: string;
  mfyName: string;
  programTitle: string;
  requestedAmount: string;
  purpose: string;
  submittedDate: string;
  status: 'kutilmoqda' | 'tasdiqlandi' | 'rad_etildi';
  messages?: ChatMessage[];
}

export interface ExportCertificate {
  id: string;
  regNumber: string;
  farmerName: string;
  mfyName: string;
  productType: string;
  quantityTons: number;
  destinationCountry: string;
  issueDate: string;
  phytosanitaryStatus: 'xavfsiz' | 'tekshiruvda' | 'sertifikatlangan';
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  ip: string;
  severity: 'critical' | 'warning' | 'info' | 'shield';
  status: 'blocked' | 'isolated' | 'mitigated' | 'honeypot_trapped' | 'sanitized' | 'verified' | 'success';
  details: string;
}

export interface DatabaseBackupSnapshot {
  id: string;
  timestamp: string;
  name: string;
  format: 'json' | 'sql';
  recordsCount: number;
  sizeKb: number;
  checksumSha256: string;
  autoBackup: boolean;
  status: 'valid' | 'verified';
}

export interface RbacPermission {
  id: string;
  name: string;
  description: string;
  category: 'database' | 'monitoring' | 'security' | 'subsidies' | 'export';
  roles: {
    admin: boolean;
    davlat: boolean;
    dehqon: boolean;
  };
}

export interface CyberDefenseStatus {
  isLockdownActive: boolean;
  isHoneypotActive?: boolean;
  vaultEncrypted?: boolean;
  dbHash: string;
  firewallLevel: 'standard' | 'strict' | 'maximum_lockdown';
  attacksBlockedCount: number;
  lastAttackTime: string | null;
  rateLimitRpm: number;
  lastBackupTime: string | null;
}


