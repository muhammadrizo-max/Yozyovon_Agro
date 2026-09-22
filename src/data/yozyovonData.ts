import { MFYData, Crop, Livestock, AIScan, WeatherInfo, MarketPrice, AppNotification, User, SubsidyApplication, ExportCertificate } from '../types';
import { YOZYOVON_ALL_33_MFY, YOZYOVON_ALL_32_MFY, YOZYOVON_KADASTR_DISTRICT_BOUNDARY, YOZYOVON_MAP_BOUNDS } from './yozyovonRealKmlData';
import { YOZYOVON_WATER_RESERVOIR, YOZYOVON_NEIGHBORS } from './yozyovon32MfyData';

export { YOZYOVON_ALL_33_MFY, YOZYOVON_ALL_32_MFY, YOZYOVON_KADASTR_DISTRICT_BOUNDARY, YOZYOVON_MAP_BOUNDS, YOZYOVON_WATER_RESERVOIR, YOZYOVON_NEIGHBORS };

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    phone: '+998901234567',
    name: 'Qodirov Rustamjon',
    email: 'rustam.dehqon@yozyovon.uz',
    role: 'dehqon',
    mfyId: 1,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15',
    isVerified: true,
    farmType: 'limon',
    activityField: 'Issiqxona limonchilik xoʻjaligi'
  },
  {
    id: 2,
    phone: '+998901234568',
    name: 'Alimov Baxtiyor (Qishloq xoʻjaligi inspektori)',
    email: 'agro.inspektor@yozyovon.gov.uz',
    role: 'davlat',
    mfyId: 1,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10',
    isVerified: true,
    activityField: 'Tuman Qishloq Xoʻjaligi Boshqarmasi'
  },
  {
    id: 3,
    phone: '+998901234569',
    name: 'Tizim Administratori',
    email: 'admin@yozyovon-agro.uz',
    role: 'admin',
    mfyId: 1,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01',
    isVerified: true
  },
  {
    id: 4,
    phone: '+998900001717',
    name: 'Dasturchi (Developer Pro)',
    email: 'developerpro@gamil.com',
    role: 'admin',
    mfyId: 1,
    createdAt: '2026-01-01',
    isVerified: true,
    activityField: 'Dasturiy Taʼminot Arxitektori va Xavfsizlik'
  }
];

export const INITIAL_SUBSIDIES: SubsidyApplication[] = [];

export const INITIAL_EXPORT_CERTS: ExportCertificate[] = [];


const OLD_MFY_LIST: MFYData[] = [
  {
    id: 1,
    name: 'Yozyovon MFY',
    geojsonId: 'yozyovon_center',
    dehqonchilikGa: 840,
    limonDaraxtlari: 14200, // > 10000 -> Yashil
    chorvaBoshlari: 3100,
    asosiyEkinlar: ['limon', 'anor', 'uzum', 'bug\'doy'],
    center: [40.5167, 71.0833],
    polygonCoordinates: [
      [40.525, 71.075],
      [40.526, 71.092],
      [40.518, 71.096],
      [40.509, 71.088],
      [40.511, 71.073],
      [40.525, 71.075]
    ],
    farmersCount: 145,
    anonymousFarmers: [
      { id: 'f-101', code: 'DEHQON #101', cropType: 'Limon (Issiqxona)', areaGa: 1.8, livestockCount: 8, healthRate: 96, status: 'yaxshi' },
      { id: 'f-102', code: 'DEHQON #102', cropType: 'Limon va Anor', areaGa: 2.4, livestockCount: 14, healthRate: 91, status: 'yaxshi' },
      { id: 'f-103', code: 'DEHQON #103', cropType: 'Uzumzor', areaGa: 3.2, livestockCount: 5, healthRate: 84, status: 'ortacha' },
      { id: 'f-104', code: 'DEHQON #104', cropType: 'Limon (intensiv)', areaGa: 1.2, livestockCount: 12, healthRate: 98, status: 'yaxshi' },
      { id: 'f-105', code: 'DEHQON #105', cropType: 'Bugʻdoy va Chorva', areaGa: 5.0, livestockCount: 22, healthRate: 88, status: 'yaxshi' },
      { id: 'f-106', code: 'DEHQON #106', cropType: 'Limonzor', areaGa: 0.9, livestockCount: 4, healthRate: 72, status: 'nazoratda' }
    ],
    pestAlerts: [
      {
        id: 'pa-1',
        title: 'Sitrus oqqanoti xavfi',
        severity: 'medium',
        description: 'Limon issiqxonalarida harorat koʻtarilishi oqibatida sitrus oqqanoti faollashishi kuzatilmoqda.',
        date: '2026-08-25',
        affectedCrops: ['limon'],
        recommendedAction: 'Fitoverm yoki Aktara bilan profilaktik purkash va sariq yopishqoq tuzoqlarni oʻrnatish tavsiya etiladi.'
      }
    ],
    statePrograms: [
      {
        id: 'sp-1',
        title: '"Yashil Makon" umummilliy loyihasi',
        budget: '450 mln soʻm',
        description: 'Koʻchat ekish va suv tejovchi tomchilatib sugʻorish tizimlarini joriy etish uchun subsidiya.',
        beneficiariesCount: 48,
        status: 'faol',
        deadline: '2026-11-30'
      },
      {
        id: 'sp-2',
        title: 'Limonchilikni rivojlantirish dasturi',
        budget: '1.2 mlrd soʻm',
        description: 'Zamonaviy sitrus issiqxonalarini barpo etish uchun 3 yil imtiyozli kredit.',
        beneficiariesCount: 32,
        status: 'faol',
        deadline: '2026-12-31'
      }
    ],
    dynamics12Months: [
      { month: 'Sentabr', limonTonna: 24, bugdoyTonna: 60, anorTonna: 18, sutTonna: 42 },
      { month: 'Oktabr', limonTonna: 52, bugdoyTonna: 40, anorTonna: 35, sutTonna: 40 },
      { month: 'Noyabr', limonTonna: 140, bugdoyTonna: 15, anorTonna: 45, sutTonna: 38 },
      { month: 'Dekabr', limonTonna: 190, bugdoyTonna: 5, anorTonna: 20, sutTonna: 35 },
      { month: 'Yanvar', limonTonna: 210, bugdoyTonna: 0, anorTonna: 8, sutTonna: 36 },
      { month: 'Fevral', limonTonna: 175, bugdoyTonna: 0, anorTonna: 4, sutTonna: 39 },
      { month: 'Mart', limonTonna: 120, bugdoyTonna: 10, anorTonna: 0, sutTonna: 45 },
      { month: 'Aprel', limonTonna: 60, bugdoyTonna: 30, anorTonna: 0, sutTonna: 50 },
      { month: 'May', limonTonna: 15, bugdoyTonna: 90, anorTonna: 0, sutTonna: 54 },
      { month: 'Iyun', limonTonna: 8, bugdoyTonna: 180, anorTonna: 5, sutTonna: 56 },
      { month: 'Iyul', limonTonna: 5, bugdoyTonna: 110, anorTonna: 12, sutTonna: 52 },
      { month: 'Avgust', limonTonna: 12, bugdoyTonna: 75, anorTonna: 16, sutTonna: 48 }
    ],
    livestockStats: [
      { type: 'Qoramol (Sigir)', count: 1840, changePercent: 4.8 },
      { type: 'Mayda shoxli (Qoʻy/Echki)', count: 960, changePercent: 2.1 },
      { type: 'Parranda', count: 12500, changePercent: 8.5 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 2,
    name: 'Navbahor MFY',
    geojsonId: 'navbahor_ne',
    dehqonchilikGa: 780,
    limonDaraxtlari: 12800, // > 10000 -> Yashil
    chorvaBoshlari: 2600,
    asosiyEkinlar: ['limon', 'bug\'doy', 'uzum'],
    center: [40.534, 71.108],
    polygonCoordinates: [
      [40.526, 71.092],
      [40.542, 71.101],
      [40.544, 71.121],
      [40.529, 71.124],
      [40.521, 71.104],
      [40.526, 71.092]
    ],
    farmersCount: 118,
    anonymousFarmers: [
      { id: 'f-201', code: 'DEHQON #201', cropType: 'Limonzor', areaGa: 2.1, livestockCount: 10, healthRate: 94, status: 'yaxshi' },
      { id: 'f-202', code: 'DEHQON #202', cropType: 'Bugʻdoyзор', areaGa: 4.5, livestockCount: 18, healthRate: 89, status: 'yaxshi' },
      { id: 'f-203', code: 'DEHQON #203', cropType: 'Limon (Issiqxona)', areaGa: 1.5, livestockCount: 6, healthRate: 92, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [
      {
        id: 'sp-21',
        title: '"Obod Qishloq" infratuzilma dasturi',
        budget: '600 mln soʻm',
        description: 'Sugʻorish ariqlari va beton kanallarni taʼmirlash.',
        beneficiariesCount: 64,
        status: 'faol',
        deadline: '2026-10-15'
      }
    ],
    dynamics12Months: [
      { month: 'Sentabr', limonTonna: 20, bugdoyTonna: 50, anorTonna: 10, sutTonna: 35 },
      { month: 'Oktabr', limonTonna: 48, bugdoyTonna: 35, anorTonna: 15, sutTonna: 36 },
      { month: 'Noyabr', limonTonna: 125, bugdoyTonna: 10, anorTonna: 20, sutTonna: 33 },
      { month: 'Dekabr', limonTonna: 170, bugdoyTonna: 0, anorTonna: 10, sutTonna: 32 },
      { month: 'Yanvar', limonTonna: 195, bugdoyTonna: 0, anorTonna: 5, sutTonna: 34 },
      { month: 'Fevral', limonTonna: 150, bugdoyTonna: 0, anorTonna: 2, sutTonna: 37 },
      { month: 'Mart', limonTonna: 95, bugdoyTonna: 8, anorTonna: 0, sutTonna: 41 },
      { month: 'Aprel', limonTonna: 45, bugdoyTonna: 25, anorTonna: 0, sutTonna: 46 },
      { month: 'May', limonTonna: 12, bugdoyTonna: 80, anorTonna: 0, sutTonna: 48 },
      { month: 'Iyun', limonTonna: 6, bugdoyTonna: 160, anorTonna: 2, sutTonna: 50 },
      { month: 'Iyul', limonTonna: 4, bugdoyTonna: 95, anorTonna: 8, sutTonna: 47 },
      { month: 'Avgust', limonTonna: 10, bugdoyTonna: 65, anorTonna: 10, sutTonna: 42 }
    ],
    livestockStats: [
      { type: 'Qoramol (Sigir)', count: 1520, changePercent: 3.9 },
      { type: 'Mayda shoxli (Qoʻy/Echki)', count: 880, changePercent: 1.5 },
      { type: 'Parranda', count: 9800, changePercent: 6.2 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 3,
    name: 'Do\'stlik MFY',
    geojsonId: 'dostlik_e',
    dehqonchilikGa: 650,
    limonDaraxtlari: 8300, // > 5000 -> Sariq
    chorvaBoshlari: 2150,
    asosiyEkinlar: ['limon', 'anor', 'bug\'doy'],
    center: [40.514, 71.118],
    polygonCoordinates: [
      [40.518, 71.096],
      [40.529, 71.124],
      [40.519, 71.139],
      [40.505, 71.132],
      [40.507, 71.109],
      [40.518, 71.096]
    ],
    farmersCount: 94,
    anonymousFarmers: [
      { id: 'f-301', code: 'DEHQON #301', cropType: 'Anorzor va Limon', areaGa: 2.0, livestockCount: 9, healthRate: 87, status: 'yaxshi' },
      { id: 'f-302', code: 'DEHQON #302', cropType: 'Limon issiqxonasi', areaGa: 1.1, livestockCount: 4, healthRate: 90, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [
      {
        id: 'sp-31',
        title: '"Yashil Makon" koʻkalamzorlashtirish',
        budget: '280 mln soʻm',
        description: 'Aholiga bepul mevali daraxt koʻchatlari tarqatish.',
        beneficiariesCount: 42,
        status: 'faol',
        deadline: '2026-10-31'
      }
    ],
    dynamics12Months: [
      { month: 'Sentabr', limonTonna: 14, bugdoyTonna: 42, anorTonna: 22, sutTonna: 28 },
      { month: 'Oktabr', limonTonna: 32, bugdoyTonna: 30, anorTonna: 40, sutTonna: 29 },
      { month: 'Noyabr', limonTonna: 85, bugdoyTonna: 8, anorTonna: 30, sutTonna: 27 },
      { month: 'Dekabr', limonTonna: 110, bugdoyTonna: 0, anorTonna: 15, sutTonna: 25 },
      { month: 'Yanvar', limonTonna: 125, bugdoyTonna: 0, anorTonna: 4, sutTonna: 26 },
      { month: 'Fevral', limonTonna: 105, bugdoyTonna: 0, anorTonna: 2, sutTonna: 28 },
      { month: 'Mart', limonTonna: 70, bugdoyTonna: 5, anorTonna: 0, sutTonna: 31 },
      { month: 'Aprel', limonTonna: 35, bugdoyTonna: 20, anorTonna: 0, sutTonna: 34 },
      { month: 'May', limonTonna: 10, bugdoyTonna: 70, anorTonna: 0, sutTonna: 37 },
      { month: 'Iyun', limonTonna: 5, bugdoyTonna: 135, anorTonna: 4, sutTonna: 38 },
      { month: 'Iyul', limonTonna: 3, bugdoyTonna: 80, anorTonna: 14, sutTonna: 35 },
      { month: 'Avgust', limonTonna: 8, bugdoyTonna: 55, anorTonna: 18, sutTonna: 32 }
    ],
    livestockStats: [
      { type: 'Qoramol (Sigir)', count: 1240, changePercent: 2.7 },
      { type: 'Mayda shoxli (Qoʻy/Echki)', count: 750, changePercent: 1.8 },
      { type: 'Parranda', count: 7800, changePercent: 5.1 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 4,
    name: 'Istiqlol MFY',
    geojsonId: 'istiqlol_s',
    dehqonchilikGa: 590,
    limonDaraxtlari: 6900, // > 5000 -> Sariq
    chorvaBoshlari: 1950,
    asosiyEkinlar: ['limon', 'uzum', 'bug\'doy'],
    center: [40.498, 71.092],
    polygonCoordinates: [
      [40.509, 71.088],
      [40.507, 71.109],
      [40.491, 71.105],
      [40.485, 71.083],
      [40.497, 71.077],
      [40.509, 71.088]
    ],
    farmersCount: 82,
    anonymousFarmers: [
      { id: 'f-401', code: 'DEHQON #401', cropType: 'Uzum va Limon', areaGa: 1.9, livestockCount: 7, healthRate: 85, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: [
      { month: 'Sentabr', limonTonna: 12, bugdoyTonna: 35, anorTonna: 12, sutTonna: 24 },
      { month: 'Oktabr', limonTonna: 28, bugdoyTonna: 25, anorTonna: 18, sutTonna: 25 },
      { month: 'Noyabr', limonTonna: 72, bugdoyTonna: 6, anorTonna: 14, sutTonna: 23 },
      { month: 'Dekabr', limonTonna: 94, bugdoyTonna: 0, anorTonna: 6, sutTonna: 22 },
      { month: 'Yanvar', limonTonna: 104, bugdoyTonna: 0, anorTonna: 2, sutTonna: 23 },
      { month: 'Fevral', limonTonna: 85, bugdoyTonna: 0, anorTonna: 0, sutTonna: 25 },
      { month: 'Mart', limonTonna: 55, bugdoyTonna: 4, anorTonna: 0, sutTonna: 27 },
      { month: 'Aprel', limonTonna: 28, bugdoyTonna: 18, anorTonna: 0, sutTonna: 29 },
      { month: 'May', limonTonna: 8, bugdoyTonna: 62, anorTonna: 0, sutTonna: 31 },
      { month: 'Iyun', limonTonna: 4, bugdoyTonna: 118, anorTonna: 2, sutTonna: 33 },
      { month: 'Iyul', limonTonna: 2, bugdoyTonna: 70, anorTonna: 8, sutTonna: 30 },
      { month: 'Avgust', limonTonna: 6, bugdoyTonna: 45, anorTonna: 11, sutTonna: 27 }
    ],
    livestockStats: [
      { type: 'Qoramol (Sigir)', count: 1120, changePercent: 3.1 },
      { type: 'Mayda shoxli (Qoʻy/Echki)', count: 680, changePercent: 2.0 },
      { type: 'Parranda', count: 6200, changePercent: 4.4 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 5,
    name: 'Vahdat MFY',
    geojsonId: 'vahdat_sw',
    dehqonchilikGa: 430,
    limonDaraxtlari: 3800, // < 5000 -> Qizil
    chorvaBoshlari: 2800,
    asosiyEkinlar: ['bug\'doy', 'limon', 'beda'],
    center: [40.495, 71.061],
    polygonCoordinates: [
      [40.511, 71.073],
      [40.497, 71.077],
      [40.485, 71.062],
      [40.489, 71.045],
      [40.505, 71.052],
      [40.511, 71.073]
    ],
    farmersCount: 65,
    anonymousFarmers: [
      { id: 'f-501', code: 'DEHQON #501', cropType: 'Chorvachilik/Beda', areaGa: 3.4, livestockCount: 28, healthRate: 91, status: 'yaxshi' },
      { id: 'f-502', code: 'DEHQON #502', cropType: 'Limonzor (Yosh bogʻ)', areaGa: 0.6, livestockCount: 5, healthRate: 68, status: 'nazoratda' }
    ],
    pestAlerts: [
      {
        id: 'pa-51',
        title: 'Suv taqchilligi va qurgʻoqchilik xavfi',
        severity: 'high',
        description: 'Kanalning quyilish qismida suv bosimi pasayishi qayd etildi.',
        date: '2026-08-26',
        affectedCrops: ['limon', 'bug\'doy'],
        recommendedAction: 'Navbatli sugʻorish jadvaliga rioya qilish va tomchilatib sugʻorishga zudlik bilan oʻtish.'
      }
    ],
    statePrograms: [
      {
        id: 'sp-51',
        title: 'Chorvachilikni qoʻllab-quvvatlash subsidiyasi',
        budget: '350 mln soʻm',
        description: 'Naslli qoramol sotib olish xarajatining 20% qismini qoplash.',
        beneficiariesCount: 22,
        status: 'faol',
        deadline: '2026-12-20'
      }
    ],
    dynamics12Months: [
      { month: 'Sentabr', limonTonna: 6, bugdoyTonna: 48, anorTonna: 4, sutTonna: 38 },
      { month: 'Oktabr', limonTonna: 14, bugdoyTonna: 38, anorTonna: 6, sutTonna: 39 },
      { month: 'Noyabr', limonTonna: 36, bugdoyTonna: 12, anorTonna: 8, sutTonna: 37 },
      { month: 'Dekabr', limonTonna: 48, bugdoyTonna: 0, anorTonna: 3, sutTonna: 35 },
      { month: 'Yanvar', limonTonna: 54, bugdoyTonna: 0, anorTonna: 0, sutTonna: 36 },
      { month: 'Fevral', limonTonna: 42, bugdoyTonna: 0, anorTonna: 0, sutTonna: 38 },
      { month: 'Mart', limonTonna: 26, bugdoyTonna: 6, anorTonna: 0, sutTonna: 42 },
      { month: 'Aprel', limonTonna: 12, bugdoyTonna: 24, anorTonna: 0, sutTonna: 45 },
      { month: 'May', limonTonna: 4, bugdoyTonna: 78, anorTonna: 0, sutTonna: 48 },
      { month: 'Iyun', limonTonna: 2, bugdoyTonna: 140, anorTonna: 0, sutTonna: 51 },
      { month: 'Iyul', limonTonna: 1, bugdoyTonna: 90, anorTonna: 3, sutTonna: 46 },
      { month: 'Avgust', limonTonna: 3, bugdoyTonna: 60, anorTonna: 4, sutTonna: 42 }
    ],
    livestockStats: [
      { type: 'Qoramol (Sigir)', count: 1680, changePercent: 6.2 },
      { type: 'Mayda shoxli (Qoʻy/Echki)', count: 1120, changePercent: 4.5 },
      { type: 'Parranda', count: 8200, changePercent: 5.8 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 6,
    name: 'Yangihayot MFY',
    geojsonId: 'yangihayot_w',
    dehqonchilikGa: 720,
    limonDaraxtlari: 11400, // > 10000 -> Yashil
    chorvaBoshlari: 2300,
    asosiyEkinlar: ['limon', 'uzum', 'anor'],
    center: [40.518, 71.055],
    polygonCoordinates: [
      [40.525, 71.075],
      [40.511, 71.073],
      [40.505, 71.052],
      [40.515, 71.036],
      [40.529, 71.048],
      [40.525, 71.075]
    ],
    farmersCount: 112,
    anonymousFarmers: [
      { id: 'f-601', code: 'DEHQON #601', cropType: 'Limonzor', areaGa: 2.8, livestockCount: 12, healthRate: 95, status: 'yaxshi' },
      { id: 'f-602', code: 'DEHQON #602', cropType: 'Uzumzor', areaGa: 1.8, livestockCount: 6, healthRate: 92, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [
      {
        id: 'sp-61',
        title: 'Zamonaviy issiqxonalar klasteri',
        budget: '850 mln soʻm',
        description: 'Limonchilik kooperatsiyasini kengaytirish va eksport logistikasi markazi.',
        beneficiariesCount: 38,
        status: 'faol',
        deadline: '2026-11-15'
      }
    ],
    dynamics12Months: [
      { month: 'Sentabr', limonTonna: 18, bugdoyTonna: 40, anorTonna: 14, sutTonna: 32 },
      { month: 'Oktabr', limonTonna: 42, bugdoyTonna: 30, anorTonna: 24, sutTonna: 33 },
      { month: 'Noyabr', limonTonna: 110, bugdoyTonna: 10, anorTonna: 28, sutTonna: 31 },
      { month: 'Dekabr', limonTonna: 155, bugdoyTonna: 0, anorTonna: 12, sutTonna: 30 },
      { month: 'Yanvar', limonTonna: 172, bugdoyTonna: 0, anorTonna: 4, sutTonna: 31 },
      { month: 'Fevral', limonTonna: 135, bugdoyTonna: 0, anorTonna: 2, sutTonna: 33 },
      { month: 'Mart', limonTonna: 88, bugdoyTonna: 8, anorTonna: 0, sutTonna: 36 },
      { month: 'Aprel', limonTonna: 42, bugdoyTonna: 22, anorTonna: 0, sutTonna: 40 },
      { month: 'May', limonTonna: 10, bugdoyTonna: 70, anorTonna: 0, sutTonna: 42 },
      { month: 'Iyun', limonTonna: 5, bugdoyTonna: 140, anorTonna: 3, sutTonna: 44 },
      { month: 'Iyul', limonTonna: 3, bugdoyTonna: 85, anorTonna: 9, sutTonna: 41 },
      { month: 'Avgust', limonTonna: 8, bugdoyTonna: 58, anorTonna: 12, sutTonna: 37 }
    ],
    livestockStats: [
      { type: 'Qoramol (Sigir)', count: 1380, changePercent: 4.1 },
      { type: 'Mayda shoxli (Qoʻy/Echki)', count: 820, changePercent: 2.2 },
      { type: 'Parranda', count: 8900, changePercent: 7.0 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 7,
    name: 'O\'zbekiston MFY',
    geojsonId: 'ozbekiston_nw',
    dehqonchilikGa: 680,
    limonDaraxtlari: 7500, // > 5000 -> Sariq
    chorvaBoshlari: 2050,
    asosiyEkinlar: ['bug\'doy', 'limon', 'anor'],
    center: [40.536, 71.058],
    polygonCoordinates: [
      [40.546, 71.066],
      [40.538, 71.082],
      [40.525, 71.075],
      [40.529, 71.048],
      [40.542, 71.046],
      [40.546, 71.066]
    ],
    farmersCount: 88,
    anonymousFarmers: [
      { id: 'f-701', code: 'DEHQON #701', cropType: 'Limon va Poliz', areaGa: 1.4, livestockCount: 8, healthRate: 91, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: [
      { month: 'Sentabr', limonTonna: 12, bugdoyTonna: 45, anorTonna: 15, sutTonna: 28 },
      { month: 'Oktabr', limonTonna: 30, bugdoyTonna: 32, anorTonna: 22, sutTonna: 29 },
      { month: 'Noyabr', limonTonna: 78, bugdoyTonna: 8, anorTonna: 20, sutTonna: 27 },
      { month: 'Dekabr', limonTonna: 102, bugdoyTonna: 0, anorTonna: 8, sutTonna: 26 },
      { month: 'Yanvar', limonTonna: 115, bugdoyTonna: 0, anorTonna: 2, sutTonna: 27 },
      { month: 'Fevral', limonTonna: 92, bugdoyTonna: 0, anorTonna: 0, sutTonna: 29 },
      { month: 'Mart', limonTonna: 60, bugdoyTonna: 6, anorTonna: 0, sutTonna: 32 },
      { month: 'Aprel', limonTonna: 30, bugdoyTonna: 20, anorTonna: 0, sutTonna: 35 },
      { month: 'May', limonTonna: 8, bugdoyTonna: 75, anorTonna: 0, sutTonna: 37 },
      { month: 'Iyun', limonTonna: 4, bugdoyTonna: 145, anorTonna: 3, sutTonna: 39 },
      { month: 'Iyul', limonTonna: 2, bugdoyTonna: 90, anorTonna: 10, sutTonna: 36 },
      { month: 'Avgust', limonTonna: 6, bugdoyTonna: 62, anorTonna: 14, sutTonna: 32 }
    ],
    livestockStats: [
      { type: 'Qoramol (Sigir)', count: 1210, changePercent: 3.2 },
      { type: 'Mayda shoxli (Qoʻy/Echki)', count: 720, changePercent: 1.9 },
      { type: 'Parranda', count: 6800, changePercent: 4.8 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 8,
    name: 'Mustaqillik MFY',
    geojsonId: 'mustaqillik_n',
    dehqonchilikGa: 510,
    limonDaraxtlari: 4100, // < 5000 -> Qizil
    chorvaBoshlari: 1700,
    asosiyEkinlar: ['bug\'doy', 'paxta', 'limon'],
    center: [40.548, 71.085],
    polygonCoordinates: [
      [40.558, 71.082],
      [40.556, 71.102],
      [40.542, 71.101],
      [40.526, 71.092],
      [40.538, 71.082],
      [40.546, 71.066],
      [40.558, 71.082]
    ],
    farmersCount: 58,
    anonymousFarmers: [
      { id: 'f-801', code: 'DEHQON #801', cropType: 'Limonzor', areaGa: 0.8, livestockCount: 5, healthRate: 74, status: 'nazoratda' }
    ],
    pestAlerts: [
      {
        id: 'pa-81',
        title: 'Zang kasalligi xavfi',
        severity: 'medium',
        description: 'Bugʻdoy va ekinzorlarda namgarchilik tufayli sargʻayish va zang tarqalishi mumkin.',
        date: '2026-08-24',
        affectedCrops: ['bug\'doy'],
        recommendedAction: 'Fungitsidlar bilan profilaktik ishlov berish.'
      }
    ],
    statePrograms: [
      {
        id: 'sp-81',
        title: 'Limon koʻchatlarini yetkazib berish dasturi',
        budget: '200 mln soʻm',
        description: 'Kam taʼminlangan xonadonlarga issiqxona barpo etish.',
        beneficiariesCount: 25,
        status: 'rejalashtirilgan',
        deadline: '2026-11-20'
      }
    ],
    dynamics12Months: [
      { month: 'Sentabr', limonTonna: 6, bugdoyTonna: 52, anorTonna: 5, sutTonna: 22 },
      { month: 'Oktabr', limonTonna: 16, bugdoyTonna: 36, anorTonna: 8, sutTonna: 23 },
      { month: 'Noyabr', limonTonna: 42, bugdoyTonna: 10, anorTonna: 10, sutTonna: 22 },
      { month: 'Dekabr', limonTonna: 58, bugdoyTonna: 0, anorTonna: 4, sutTonna: 21 },
      { month: 'Yanvar', limonTonna: 64, bugdoyTonna: 0, anorTonna: 1, sutTonna: 22 },
      { month: 'Fevral', limonTonna: 50, bugdoyTonna: 0, anorTonna: 0, sutTonna: 24 },
      { month: 'Mart', limonTonna: 32, bugdoyTonna: 5, anorTonna: 0, sutTonna: 26 },
      { month: 'Aprel', limonTonna: 16, bugdoyTonna: 20, anorTonna: 0, sutTonna: 28 },
      { month: 'May', limonTonna: 4, bugdoyTonna: 82, anorTonna: 0, sutTonna: 30 },
      { month: 'Iyun', limonTonna: 2, bugdoyTonna: 155, anorTonna: 2, sutTonna: 32 },
      { month: 'Iyul', limonTonna: 1, bugdoyTonna: 98, anorTonna: 5, sutTonna: 29 },
      { month: 'Avgust', limonTonna: 3, bugdoyTonna: 68, anorTonna: 6, sutTonna: 26 }
    ],
    livestockStats: [
      { type: 'Qoramol (Sigir)', count: 980, changePercent: 2.1 },
      { type: 'Mayda shoxli (Qoʻy/Echki)', count: 620, changePercent: 1.4 },
      { type: 'Parranda', count: 5400, changePercent: 3.8 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 9,
    name: 'Bunyodkor MFY',
    geojsonId: 'bunyodkor_se',
    dehqonchilikGa: 580,
    limonDaraxtlari: 5400, // > 5000 -> Sariq
    chorvaBoshlari: 2200,
    asosiyEkinlar: ['limon', 'anor', 'bug\'doy'],
    center: [40.485, 71.122],
    polygonCoordinates: [
      [40.505, 71.132],
      [40.495, 71.144],
      [40.478, 71.135],
      [40.476, 71.112],
      [40.491, 71.105],
      [40.507, 71.109],
      [40.505, 71.132]
    ],
    farmersCount: 76,
    anonymousFarmers: [
      { id: 'f-901', code: 'DEHQON #901', cropType: 'Anorzor va Limon', areaGa: 1.7, livestockCount: 11, healthRate: 88, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: [
      { month: 'Sentabr', limonTonna: 9, bugdoyTonna: 38, anorTonna: 20, sutTonna: 30 },
      { month: 'Oktabr', limonTonna: 22, bugdoyTonna: 28, anorTonna: 32, sutTonna: 31 },
      { month: 'Noyabr', limonTonna: 56, bugdoyTonna: 8, anorTonna: 24, sutTonna: 29 },
      { month: 'Dekabr', limonTonna: 76, bugdoyTonna: 0, anorTonna: 10, sutTonna: 28 },
      { month: 'Yanvar', limonTonna: 85, bugdoyTonna: 0, anorTonna: 3, sutTonna: 29 },
      { month: 'Fevral', limonTonna: 68, bugdoyTonna: 0, anorTonna: 1, sutTonna: 31 },
      { month: 'Mart', limonTonna: 44, bugdoyTonna: 5, anorTonna: 0, sutTonna: 34 },
      { month: 'Aprel', limonTonna: 22, bugdoyTonna: 18, anorTonna: 0, sutTonna: 37 },
      { month: 'May', limonTonna: 6, bugdoyTonna: 68, anorTonna: 0, sutTonna: 39 },
      { month: 'Iyun', limonTonna: 3, bugdoyTonna: 125, anorTonna: 3, sutTonna: 41 },
      { month: 'Iyul', limonTonna: 2, bugdoyTonna: 76, anorTonna: 11, sutTonna: 38 },
      { month: 'Avgust', limonTonna: 5, bugdoyTonna: 52, anorTonna: 15, sutTonna: 34 }
    ],
    livestockStats: [
      { type: 'Qoramol (Sigir)', count: 1290, changePercent: 4.0 },
      { type: 'Mayda shoxli (Qoʻy/Echki)', count: 810, changePercent: 2.3 },
      { type: 'Parranda', count: 7100, changePercent: 5.2 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 10,
    name: 'Ravnaq MFY',
    geojsonId: 'ravnaq_south',
    dehqonchilikGa: 460,
    limonDaraxtlari: 2900, // < 5000 -> Qizil
    chorvaBoshlari: 2950,
    asosiyEkinlar: ['bug\'doy', 'beda', 'limon'],
    center: [40.472, 71.078],
    polygonCoordinates: [
      [40.485, 71.083],
      [40.476, 71.112],
      [40.461, 71.102],
      [40.458, 71.068],
      [40.473, 71.058],
      [40.485, 71.083]
    ],
    farmersCount: 52,
    anonymousFarmers: [
      { id: 'f-1001', code: 'DEHQON #1001', cropType: 'Chorvachilik fermasi', areaGa: 4.2, livestockCount: 42, healthRate: 94, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [
      {
        id: 'sp-101',
        title: 'Chorva naslini yaxshilash va emlash',
        budget: '180 mln soʻm',
        description: 'Chorva mollarini bepul vaksinatsiya qilish va sunʼiy urugʻlantirish.',
        beneficiariesCount: 44,
        status: 'faol',
        deadline: '2026-12-15'
      }
    ],
    dynamics12Months: [
      { month: 'Sentabr', limonTonna: 4, bugdoyTonna: 46, anorTonna: 3, sutTonna: 44 },
      { month: 'Oktabr', limonTonna: 10, bugdoyTonna: 35, anorTonna: 5, sutTonna: 45 },
      { month: 'Noyabr', limonTonna: 28, bugdoyTonna: 10, anorTonna: 6, sutTonna: 42 },
      { month: 'Dekabr', limonTonna: 38, bugdoyTonna: 0, anorTonna: 2, sutTonna: 40 },
      { month: 'Yanvar', limonTonna: 42, bugdoyTonna: 0, anorTonna: 0, sutTonna: 41 },
      { month: 'Fevral', limonTonna: 34, bugdoyTonna: 0, anorTonna: 0, sutTonna: 43 },
      { month: 'Mart', limonTonna: 20, bugdoyTonna: 6, anorTonna: 0, sutTonna: 47 },
      { month: 'Aprel', limonTonna: 10, bugdoyTonna: 22, anorTonna: 0, sutTonna: 50 },
      { month: 'May', limonTonna: 3, bugdoyTonna: 74, anorTonna: 0, sutTonna: 52 },
      { month: 'Iyun', limonTonna: 1, bugdoyTonna: 130, anorTonna: 0, sutTonna: 55 },
      { month: 'Iyul', limonTonna: 1, bugdoyTonna: 85, anorTonna: 2, sutTonna: 50 },
      { month: 'Avgust', limonTonna: 2, bugdoyTonna: 58, anorTonna: 3, sutTonna: 46 }
    ],
    livestockStats: [
      { type: 'Qoramol (Sigir)', count: 1820, changePercent: 7.1 },
      { type: 'Mayda shoxli (Qoʻy/Echki)', count: 1080, changePercent: 5.4 },
      { type: 'Parranda', count: 6500, changePercent: 4.2 }
    ],
    updatedAt: '2026-08-28'
  }
];

// All 33 MFYs of Yozyovon District
export const YOZYOVON_MFY_LIST: MFYData[] = YOZYOVON_ALL_33_MFY;

export const INITIAL_CROPS: Crop[] = [];

export const INITIAL_LIVESTOCK: Livestock[] = [];

export interface DiseaseSample {
  id: string;
  targetType: 'limon' | 'boshqa_ekin' | 'chorva';
  diseaseName: string;
  nameUz: string;
  confidence: number;
  severity: 'high' | 'medium' | 'low';
  imageUrl: string;
  sampleDescription: string;
  recommendations: string;
  medicines: string;
}

export const DISEASE_SAMPLES: DiseaseSample[] = [
  {
    id: 'sample-chlorosis',
    targetType: 'limon',
    diseaseName: 'Limon bargi sargʻayishi (Temir xlorozi)',
    nameUz: 'Limon bargi xlorozi (Temir yetishmovchiligi)',
    confidence: 94.2,
    severity: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=600&auto=format&fit=crop&q=80',
    sampleDescription: 'Barg tomirlari yashilligicha qolib, tomirlar orasi sargʻayishi',
    recommendations: 'Sugʻorish meʼyorini kamaytiring va tuproq aeratsiyasini yaxshilang. Tuproq ishqoriy boʻlsa (pH > 7.5), kislotalilikni muvozanatlang. Bargdan temir xelati bilan oziqlantiring.',
    medicines: 'Temir xelati (Fe-EDDHA 6%) - 10-15 g / 10 litr suv. Bargdan purkash uchun Mikroelementlar majmuasi (Kristalon sariq) - 20 g / 10 litr suv.'
  },
  {
    id: 'sample-whitefly',
    targetType: 'limon',
    diseaseName: 'Sitrus oqqanoti va Qora chirish (Sooty mold)',
    nameUz: 'Sitrus oqqanoti (Dialeurodes citri) zarari',
    confidence: 88.7,
    severity: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    sampleDescription: 'Barg orqasida oq hasharotlar, barg yuzasida yopishqoq qora gʻubor',
    recommendations: 'Issiqxonani shoshilinch shamollating. Sariq yopishqoq tuzoqlarni har 15 m² ga 1 dona osing. Zararlangan barglarni kesib yoʻq qiling. Xavf yuqori boʻlgani uchun davlat monitoringiga belgilandi.',
    medicines: 'Fitoverm 0.2% - 20 ml / 10 litr suv YOKI Aktara 25 WG - 2-3 g / 10 litr suv. Qoʻshimcha yopishqoqlik uchun sovunli eritma qoʻshilsin.'
  },
  {
    id: 'sample-anthracnose',
    targetType: 'limon',
    diseaseName: 'Limon antraknozi (Colletotrichum gloeosporioides)',
    nameUz: 'Sitrus antraknozi (Meva va novdalar qurishi)',
    confidence: 91.5,
    severity: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600&auto=format&fit=crop&q=80',
    sampleDescription: 'Meva va yosh novdalarda qoʻngʻir botiq dogʻlar, uchki qismlarning soʻlishi',
    recommendations: 'Zararlangan barcha qurigan novdalarni 2 sm sogʻlom joyi bilan kesib tashlab, kuydiring. Harorat 24-28°C boʻlganda namlikni 65% dan oshirmang.',
    medicines: 'Oxyhom - 20 g / 10 litr suv YOKI 1% li Bordo suyuqligi (100g mis kuporosi + 100g ohak). 10-12 kundan soʻng qayta ishlov berilsin.'
  },
  {
    id: 'sample-rust',
    targetType: 'boshqa_ekin',
    diseaseName: 'Bugʻdoy sariq zang kasalligi (Puccinia striiformis)',
    nameUz: 'Bugʻdoy barg zangi',
    confidence: 86.4,
    severity: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    sampleDescription: 'Bugʻdoy barglarida sariq-toʻq sariq chiziqli spora toʻplamlari',
    recommendations: 'Ekinzor namligini kamaytirish, fosfor-kaliyli oʻgʻitlar meʼyorini oshirish. Zang tarqalishining oldini olish uchun fungitsid seping.',
    medicines: 'Tilt (Propikonazol) 25% - 5 ml / 10 litr suv YOKI Folicur 250 EW - 10 ml / 10 litr suv.'
  },
  {
    id: 'sample-healthy',
    targetType: 'limon',
    diseaseName: 'Sogʻlom mevali limon daraxti',
    nameUz: 'Sogʻlom holat (Kasallik aniqlanmadi)',
    confidence: 98.1,
    severity: 'low',
    imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&auto=format&fit=crop&q=80',
    sampleDescription: 'Toʻq yashil yaltiroq barglar, rivojlangan mevalar, zararkunanda yoʻq',
    recommendations: 'Agrotexnik parvarish meʼyorida davom ettirilsin. Mavsumiy fosfor-kaliy bilan oziqlantirish hamda tomchilatib sugʻorish jadvaliga rioya qiling.',
    medicines: 'Kimyoviy dori talab etilmaydi. Profilaktika uchun Gumafos biopreparati 15 ml/10L suv.'
  },
  {
    id: 'sample-livestock-footrot',
    targetType: 'chorva',
    diseaseName: 'Qoramol tuyoq chirishi (Nekrobakterioz / Foot Rot)',
    nameUz: 'Qoramol tuyoq yalligʻlanishi',
    confidence: 89.3,
    severity: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80',
    sampleDescription: 'Tuyogʻi oqsoqlanish, tuyoq orasi yiringli shishi va noxush hid',
    recommendations: 'Molxonadagi zax va iflos toʻshama tozalansin va quruq somon solinsin. Tuyogʻini mexanik tozalab, vanna orqali dezinfeksiya qiling. Veterinarga shoshilinch murojaat qiling.',
    medicines: 'Tuyoq vannasi uchun 5-10% li Mis kuporosi (Vitirol) eritmasi. Terramitsin aerozol spreyi va Oksitetratsiklin 200 LA inyeksiya (veterinar koʻrsatmasi bilan).'
  }
];

export const INITIAL_AI_SCANS: AIScan[] = [];

export const YOZYOVON_WEATHER: WeatherInfo = {
  temp: 31,
  feelsLike: 33,
  condition: 'Quyoshli va musaffo',
  humidity: 38,
  windSpeed: 4.2,
  uvIndex: 7,
  soilTemp: 24,
  soilMoisturePercent: 68,
  leafWetnessHours: 2.5,
  solarRadiationWm2: 810,
  frostRisk: 'none',
  dewPoint: 14,
  pressureHpa: 1012,
  hourlyForecast: [
    { time: '06:00', temp: 20, humidity: 65, pop: 0, condition: 'Quyosh chiqishi' },
    { time: '09:00', temp: 25, humidity: 48, pop: 0, condition: 'Quyoshli' },
    { time: '12:00', temp: 30, humidity: 39, pop: 0, condition: 'Qaynoq quyosh' },
    { time: '15:00', temp: 32, humidity: 34, pop: 5, condition: 'Ochiq havo' },
    { time: '18:00', temp: 29, humidity: 40, pop: 5, condition: 'Yorqin' },
    { time: '21:00', temp: 24, humidity: 52, pop: 0, condition: 'Tiniq kecha' }
  ],
  forecast: [
    { day: 'Bugun (Juma)', tempDay: 31, tempNight: 19, condition: 'Quyoshli', icon: 'Sun' },
    { day: 'Shanba', tempDay: 32, tempNight: 20, condition: 'Quyoshli', icon: 'Sun' },
    { day: 'Yakshanba', tempDay: 33, tempNight: 21, condition: 'Ochiq havo', icon: 'Sun' },
    { day: 'Dushanba', tempDay: 30, tempNight: 18, condition: 'Biroz bulutli', icon: 'CloudSun' },
    { day: 'Seshanba', tempDay: 28, tempNight: 17, condition: 'Shamolli', icon: 'Wind' },
    { day: 'Chorshanba', tempDay: 29, tempNight: 18, condition: 'Quyoshli', icon: 'Sun' },
    { day: 'Payshanba', tempDay: 31, tempNight: 19, condition: 'Quyoshli', icon: 'Sun' }
  ],
  agroAdvice: 'Yozyovon iqlimida limon issiqxonalarini 11:00 dan 16:30 gacha quyoshdan toʻr bilan soyalash va tomchilatib sugʻorishni kechki soat 19:00 dan keyin amalga oshirish tavsiya etiladi. Tuproq namligi 68% - meʼyorida.'
};

export const MARKET_PRICES: MarketPrice[] = [
  {
    id: 'mp-1',
    product: 'Limon (Meyeri, 1-nav)',
    category: 'meva',
    ferganaPrice: 11000,
    qoqonPrice: 11500,
    yozyovonPrice: 9500,
    unit: 'soʻm/kg',
    changePercent: 4.5,
    trend: 'up'
  },
  {
    id: 'mp-2',
    product: 'Limon (Eksportbop, qadoqlangan)',
    category: 'meva',
    ferganaPrice: 14500,
    qoqonPrice: 15000,
    yozyovonPrice: 13000,
    unit: 'soʻm/kg',
    changePercent: 7.2,
    trend: 'up'
  },
  {
    id: 'mp-3',
    product: 'Mol goʻshti (Lahm, toza)',
    category: 'chorva',
    ferganaPrice: 92000,
    qoqonPrice: 94000,
    yozyovonPrice: 88000,
    unit: 'soʻm/kg',
    changePercent: 1.2,
    trend: 'up'
  },
  {
    id: 'mp-4',
    product: 'Qoʻy goʻshti (Yangi soʻyilgan)',
    category: 'chorva',
    ferganaPrice: 96000,
    qoqonPrice: 98000,
    yozyovonPrice: 92000,
    unit: 'soʻm/kg',
    changePercent: -0.5,
    trend: 'stable'
  },
  {
    id: 'mp-5',
    product: 'Xom sut (Yogʻliligi 3.8%)',
    category: 'chorva',
    ferganaPrice: 7500,
    qoqonPrice: 8000,
    yozyovonPrice: 6500,
    unit: 'soʻm/litr',
    changePercent: 2.5,
    trend: 'up'
  },
  {
    id: 'mp-6',
    product: 'Anor (Qayum, shirin)',
    category: 'meva',
    ferganaPrice: 18000,
    qoqonPrice: 19500,
    yozyovonPrice: 15000,
    unit: 'soʻm/kg',
    changePercent: -3.4,
    trend: 'down'
  },
  {
    id: 'mp-7',
    product: 'Bugʻdoy (3-sinf, urugʻlik)',
    category: 'don',
    ferganaPrice: 3800,
    qoqonPrice: 3900,
    yozyovonPrice: 3400,
    unit: 'soʻm/kg',
    changePercent: 0.0,
    trend: 'stable'
  },
  {
    id: 'mp-8',
    product: 'Uzum (Rizamat / Husayni)',
    category: 'meva',
    ferganaPrice: 22000,
    qoqonPrice: 24000,
    yozyovonPrice: 19000,
    unit: 'soʻm/kg',
    changePercent: 5.8,
    trend: 'up'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
