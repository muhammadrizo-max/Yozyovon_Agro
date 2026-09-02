import { MFYData } from '../types';

// Cadastral organic non-rectangular polygon generator for realistic Mahalla boundaries
export const generateOrganicMfyBoundary = (centerLat: number, centerLng: number, mfyId: number, dehqonGa = 600): [number, number][] => {
  const pointsCount = 10;
  const coords: [number, number][] = [];
  const areaScale = Math.sqrt(dehqonGa / 600);
  const baseRadiusLat = 0.0078 * areaScale;
  const baseRadiusLng = 0.0108 * areaScale;

  for (let i = 0; i < pointsCount; i++) {
    const angle = (i / pointsCount) * Math.PI * 2;
    // Harmonic variation to generate natural curved cadastral borders (irrigation ditches, canals, roads)
    const wave1 = 0.32 * Math.sin(angle * 3 + mfyId * 0.95);
    const wave2 = 0.18 * Math.cos(angle * 2 + mfyId * 1.4);
    const wave3 = 0.12 * Math.sin(angle * 5 + mfyId * 2.1);
    const radiusMultiplier = 0.85 + wave1 + wave2 + wave3;

    const lat = centerLat + baseRadiusLat * radiusMultiplier * Math.sin(angle);
    const lng = centerLng + baseRadiusLng * radiusMultiplier * Math.cos(angle);
    coords.push([Math.round(lat * 10000) / 10000, Math.round(lng * 10000) / 10000]);
  }
  coords.push(coords[0]); // Close polygon loop
  return coords;
};

// Helper to generate monthly dynamics
const createDynamics = (baseLimon: number, baseBugdoy: number, baseAnor: number, baseSut: number) => [
  { month: 'Sentabr', limonTonna: Math.round(baseLimon * 0.15), bugdoyTonna: Math.round(baseBugdoy * 0.4), anorTonna: Math.round(baseAnor * 0.3), sutTonna: baseSut },
  { month: 'Oktabr', limonTonna: Math.round(baseLimon * 0.35), bugdoyTonna: Math.round(baseBugdoy * 0.25), anorTonna: Math.round(baseAnor * 0.6), sutTonna: baseSut + 1 },
  { month: 'Noyabr', limonTonna: Math.round(baseLimon * 0.85), bugdoyTonna: Math.round(baseBugdoy * 0.1), anorTonna: Math.round(baseAnor * 0.4), sutTonna: baseSut },
  { month: 'Dekabr', limonTonna: baseLimon, bugdoyTonna: 0, anorTonna: Math.round(baseAnor * 0.15), sutTonna: baseSut - 2 },
  { month: 'Yanvar', limonTonna: Math.round(baseLimon * 1.1), bugdoyTonna: 0, anorTonna: 0, sutTonna: baseSut - 1 },
  { month: 'Fevral', limonTonna: Math.round(baseLimon * 0.9), bugdoyTonna: 0, anorTonna: 0, sutTonna: baseSut },
  { month: 'Mart', limonTonna: Math.round(baseLimon * 0.6), bugdoyTonna: Math.round(baseBugdoy * 0.05), anorTonna: 0, sutTonna: baseSut + 3 },
  { month: 'Aprel', limonTonna: Math.round(baseLimon * 0.3), bugdoyTonna: Math.round(baseBugdoy * 0.2), anorTonna: 0, sutTonna: baseSut + 5 },
  { month: 'May', limonTonna: Math.round(baseLimon * 0.1), bugdoyTonna: Math.round(baseBugdoy * 0.7), anorTonna: 0, sutTonna: baseSut + 7 },
  { month: 'Iyun', limonTonna: Math.round(baseLimon * 0.05), bugdoyTonna: Math.round(baseBugdoy * 1.3), anorTonna: 2, sutTonna: baseSut + 8 },
  { month: 'Iyul', limonTonna: Math.round(baseLimon * 0.02), bugdoyTonna: Math.round(baseBugdoy * 0.8), anorTonna: 10, sutTonna: baseSut + 6 },
  { month: 'Avgust', limonTonna: Math.round(baseLimon * 0.08), bugdoyTonna: Math.round(baseBugdoy * 0.5), anorTonna: 16, sutTonna: baseSut + 3 }
];

const RAW_32_MFY: MFYData[] = [
  {
    id: 1,
    name: 'Yozyovon MFY (Markaz)',
    geojsonId: 'yozyovon_002',
    dehqonchilikGa: 520,
    limonDaraxtlari: 14500, // > 10000 -> Yashil
    chorvaBoshlari: 2800,
    asosiyEkinlar: ['limon', 'bodom', 'bug\'doy', 'issiqxona pomidor'],
    center: [40.662, 71.652],
    polygonCoordinates: [
      [40.655, 71.642],
      [40.670, 71.643],
      [40.672, 71.662],
      [40.658, 71.664],
      [40.655, 71.642]
    ],
    farmersCount: 135,
    anonymousFarmers: [
      { id: 'f-101', code: 'DEHQON #101', cropType: 'Meyeri Limon Issiqxonasi', areaGa: 1.8, livestockCount: 10, healthRate: 95, status: 'yaxshi' },
      { id: 'f-102', code: 'DEHQON #102', cropType: 'Limon va Bodomzor', areaGa: 2.2, livestockCount: 6, healthRate: 91, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [
      {
        id: 'sp-1',
        title: 'Yozyovon Sitrus Klasteri Dasturi 2026',
        budget: '850 mln so\'m',
        description: 'Tomchilatib sug\'orish va xandaq limonchiligini modernizatsiya qilish subsidiyasi.',
        beneficiariesCount: 68,
        status: 'faol',
        deadline: '2026-11-30'
      }
    ],
    dynamics12Months: createDynamics(110, 80, 18, 48),
    livestockStats: [
      { type: 'Qoramol (Sigir)', count: 1650, changePercent: 4.8 },
      { type: 'Mayda shoxli (Qo\'y/Echki)', count: 950, changePercent: 2.1 },
      { type: 'Parranda', count: 12400, changePercent: 8.5 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 2,
    name: 'Guliston MFY',
    geojsonId: 'yozyovon_001',
    dehqonchilikGa: 680,
    limonDaraxtlari: 11200, // > 10000 -> Yashil
    chorvaBoshlari: 3100,
    asosiyEkinlar: ['limon', 'anor', 'bug\'doy', 'sabzavot'],
    center: [40.655, 71.645],
    polygonCoordinates: [
      [40.648, 71.635],
      [40.662, 71.636],
      [40.661, 71.654],
      [40.647, 71.652],
      [40.648, 71.635]
    ],
    farmersCount: 118,
    anonymousFarmers: [
      { id: 'f-201', code: 'DEHQON #201', cropType: 'Limon va Sabzavot', areaGa: 1.5, livestockCount: 8, healthRate: 92, status: 'yaxshi' }
    ],
    pestAlerts: [
      {
        id: 'pa-21',
        title: 'Sitrus Oqqanoti O\'chog\'i',
        pestType: 'Oqqanot (Whitefly)',
        severity: 'medium',
        affectedAreaGa: 4.2,
        detectedDate: '2026-08-22',
        recommendation: 'Sariq tuzoqlar va Fitoverm purkash.'
      }
    ],
    statePrograms: [],
    dynamics12Months: createDynamics(88, 110, 24, 52),
    livestockStats: [
      { type: 'Qoramol', count: 1820, changePercent: 3.5 },
      { type: 'Qo\'y', count: 1040, changePercent: 1.9 },
      { type: 'Parranda', count: 8900, changePercent: 5.0 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 3,
    name: 'Taraqqiyot MFY',
    geojsonId: 'yozyovon_003',
    dehqonchilikGa: 590,
    limonDaraxtlari: 9400, // 5000-10000 -> Sariq
    chorvaBoshlari: 2350,
    asosiyEkinlar: ['limon', 'paxta', 'bug\'doy'],
    center: [40.672, 71.638],
    polygonCoordinates: [
      [40.663, 71.628],
      [40.678, 71.630],
      [40.677, 71.648],
      [40.662, 71.646],
      [40.663, 71.628]
    ],
    farmersCount: 96,
    anonymousFarmers: [
      { id: 'f-301', code: 'DEHQON #301', cropType: 'Bug\'doyzor va Sitrus', areaGa: 3.0, livestockCount: 12, healthRate: 88, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(72, 130, 10, 42),
    livestockStats: [
      { type: 'Qoramol', count: 1400, changePercent: 2.8 },
      { type: 'Qo\'y', count: 820, changePercent: 1.2 },
      { type: 'Parranda', count: 6700, changePercent: 4.3 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 4,
    name: 'Qorasoy MFY',
    geojsonId: 'yozyovon_004',
    dehqonchilikGa: 740,
    limonDaraxtlari: 4200, // < 5000 -> Qizil
    chorvaBoshlari: 1950,
    asosiyEkinlar: ['bug\'doy', 'makkajo\'xori', 'limon'],
    center: [40.682, 71.650],
    polygonCoordinates: [
      [40.674, 71.640],
      [40.689, 71.642],
      [40.688, 71.660],
      [40.673, 71.658],
      [40.674, 71.640]
    ],
    farmersCount: 84,
    anonymousFarmers: [
      { id: 'f-401', code: 'DEHQON #401', cropType: 'Makkajo\'xori va chorva', areaGa: 4.5, livestockCount: 15, healthRate: 84, status: 'ortacha' }
    ],
    pestAlerts: [
      {
        id: 'pa-41',
        title: 'Ildiz chirishi xavfi',
        pestType: 'Fitofthora (Gummosis)',
        severity: 'high',
        affectedAreaGa: 2.1,
        detectedDate: '2026-08-20',
        recommendation: 'Drenajni tozalash va Bordo suyuqligi bilan ishlov.'
      }
    ],
    statePrograms: [],
    dynamics12Months: createDynamics(36, 175, 5, 38),
    livestockStats: [
      { type: 'Qoramol', count: 1150, changePercent: 1.9 },
      { type: 'Qo\'y', count: 680, changePercent: 0.8 },
      { type: 'Parranda', count: 5400, changePercent: 3.1 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 5,
    name: 'Ishtirxon MFY',
    geojsonId: 'yozyovon_005',
    dehqonchilikGa: 620,
    limonDaraxtlari: 12800, // > 10000 -> Yashil
    chorvaBoshlari: 2600,
    asosiyEkinlar: ['limon', 'uzum', 'sabzavot'],
    center: [40.665, 71.670],
    polygonCoordinates: [
      [40.657, 71.660],
      [40.672, 71.661],
      [40.671, 71.680],
      [40.656, 71.678],
      [40.657, 71.660]
    ],
    farmersCount: 110,
    anonymousFarmers: [
      { id: 'f-501', code: 'DEHQON #501', cropType: 'Limon issiqxonasi', areaGa: 2.0, livestockCount: 7, healthRate: 96, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(105, 75, 30, 46),
    livestockStats: [
      { type: 'Qoramol', count: 1510, changePercent: 4.1 },
      { type: 'Qo\'y', count: 910, changePercent: 2.5 },
      { type: 'Parranda', count: 9100, changePercent: 6.2 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 6,
    name: 'Xonobod MFY',
    geojsonId: 'yozyovon_006',
    dehqonchilikGa: 710,
    limonDaraxtlari: 8900, // Sariq
    chorvaBoshlari: 2400,
    asosiyEkinlar: ['limon', 'anor', 'bug\'doy'],
    center: [40.650, 71.668],
    polygonCoordinates: [
      [40.642, 71.658],
      [40.657, 71.659],
      [40.656, 71.678],
      [40.641, 71.676],
      [40.642, 71.658]
    ],
    farmersCount: 98,
    anonymousFarmers: [
      { id: 'f-601', code: 'DEHQON #601', cropType: 'Anorzor va limon', areaGa: 1.6, livestockCount: 9, healthRate: 90, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(68, 120, 35, 41),
    livestockStats: [
      { type: 'Qoramol', count: 1390, changePercent: 3.2 },
      { type: 'Qo\'y', count: 860, changePercent: 1.8 },
      { type: 'Parranda', count: 7200, changePercent: 4.5 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 7,
    name: 'Choliguliston MFY',
    geojsonId: 'yozyovon_007',
    dehqonchilikGa: 830,
    limonDaraxtlari: 3800, // < 5000 -> Qizil
    chorvaBoshlari: 3400,
    asosiyEkinlar: ['paxta', 'bug\'doy', 'beda', 'qoramol'],
    center: [40.638, 71.650],
    polygonCoordinates: [
      [40.630, 71.640],
      [40.645, 71.642],
      [40.644, 71.660],
      [40.629, 71.658],
      [40.630, 71.640]
    ],
    farmersCount: 104,
    anonymousFarmers: [
      { id: 'f-701', code: 'DEHQON #701', cropType: 'Beda va qoramolchilik', areaGa: 5.0, livestockCount: 22, healthRate: 86, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(28, 190, 8, 62),
    livestockStats: [
      { type: 'Qoramol', count: 2100, changePercent: 5.5 },
      { type: 'Qo\'y', count: 1100, changePercent: 3.2 },
      { type: 'Parranda', count: 6500, changePercent: 2.8 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 8,
    name: 'Yangiboston MFY',
    geojsonId: 'yozyovon_008',
    dehqonchilikGa: 540,
    limonDaraxtlari: 11800, // Yashil
    chorvaBoshlari: 2100,
    asosiyEkinlar: ['limon', 'shaftoli', 'sabzavot'],
    center: [40.644, 71.630],
    polygonCoordinates: [
      [40.636, 71.620],
      [40.651, 71.622],
      [40.650, 71.640],
      [40.635, 71.638],
      [40.636, 71.620]
    ],
    farmersCount: 92,
    anonymousFarmers: [
      { id: 'f-801', code: 'DEHQON #801', cropType: 'Limon va shaftolizor', areaGa: 1.7, livestockCount: 5, healthRate: 94, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(95, 85, 20, 39),
    livestockStats: [
      { type: 'Qoramol', count: 1220, changePercent: 2.9 },
      { type: 'Qo\'y', count: 740, changePercent: 1.4 },
      { type: 'Parranda', count: 8300, changePercent: 5.7 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 9,
    name: 'Yangiobod MFY',
    geojsonId: 'yozyovon_009',
    dehqonchilikGa: 610,
    limonDaraxtlari: 7500, // Sariq
    chorvaBoshlari: 2200,
    asosiyEkinlar: ['limon', 'uzum', 'bug\'doy'],
    center: [40.658, 71.622],
    polygonCoordinates: [
      [40.650, 71.612],
      [40.665, 71.614],
      [40.664, 71.632],
      [40.649, 71.630],
      [40.650, 71.612]
    ],
    farmersCount: 88,
    anonymousFarmers: [
      { id: 'f-901', code: 'DEHQON #901', cropType: 'Uzumzor va limon', areaGa: 2.1, livestockCount: 7, healthRate: 89, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(62, 115, 15, 40),
    livestockStats: [
      { type: 'Qoramol', count: 1310, changePercent: 2.4 },
      { type: 'Qo\'y', count: 780, changePercent: 1.1 },
      { type: 'Parranda', count: 6900, changePercent: 3.9 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 10,
    name: 'Qatortol MFY',
    geojsonId: 'yozyovon_010',
    dehqonchilikGa: 580,
    limonDaraxtlari: 10500, // Yashil
    chorvaBoshlari: 2500,
    asosiyEkinlar: ['limon', 'bodom', 'sabzavot'],
    center: [40.673, 71.618],
    polygonCoordinates: [
      [40.665, 71.608],
      [40.680, 71.610],
      [40.679, 71.628],
      [40.664, 71.626],
      [40.665, 71.608]
    ],
    farmersCount: 102,
    anonymousFarmers: [
      { id: 'f-1001', code: 'DEHQON #1001', cropType: 'Meyeri limonzor', areaGa: 1.9, livestockCount: 8, healthRate: 93, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(85, 95, 12, 45),
    livestockStats: [
      { type: 'Qoramol', count: 1470, changePercent: 3.8 },
      { type: 'Qo\'y', count: 890, changePercent: 2.0 },
      { type: 'Parranda', count: 8100, changePercent: 4.9 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 11,
    name: 'Qorasokol MFY',
    geojsonId: 'yozyovon_011',
    dehqonchilikGa: 690,
    limonDaraxtlari: 6100, // Sariq
    chorvaBoshlari: 2750,
    asosiyEkinlar: ['paxta', 'bug\'doy', 'limon'],
    center: [40.688, 71.632],
    polygonCoordinates: [
      [40.680, 71.622],
      [40.695, 71.624],
      [40.694, 71.642],
      [40.679, 71.640],
      [40.680, 71.622]
    ],
    farmersCount: 94,
    anonymousFarmers: [
      { id: 'f-1101', code: 'DEHQON #1101', cropType: 'Bug\'doy va chorva', areaGa: 3.5, livestockCount: 14, healthRate: 87, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(50, 145, 8, 49),
    livestockStats: [
      { type: 'Qoramol', count: 1620, changePercent: 3.1 },
      { type: 'Qo\'y', count: 990, changePercent: 1.7 },
      { type: 'Parranda', count: 6400, changePercent: 3.4 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 12,
    name: 'Qoratepa MFY',
    geojsonId: 'yozyovon_012',
    dehqonchilikGa: 630,
    limonDaraxtlari: 4900, // Qizil
    chorvaBoshlari: 2300,
    asosiyEkinlar: ['bug\'doy', 'limon', 'anor'],
    center: [40.694, 71.652],
    polygonCoordinates: [
      [40.686, 71.642],
      [40.701, 71.644],
      [40.700, 71.662],
      [40.685, 71.660],
      [40.686, 71.642]
    ],
    farmersCount: 82,
    anonymousFarmers: [
      { id: 'f-1201', code: 'DEHQON #1201', cropType: 'Anor va limon', areaGa: 1.4, livestockCount: 6, healthRate: 85, status: 'ortacha' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(42, 135, 14, 41),
    livestockStats: [
      { type: 'Qoramol', count: 1350, changePercent: 2.2 },
      { type: 'Qo\'y', count: 810, changePercent: 1.0 },
      { type: 'Parranda', count: 5800, changePercent: 2.9 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 13,
    name: 'Toshxovuz MFY',
    geojsonId: 'yozyovon_013',
    dehqonchilikGa: 570,
    limonDaraxtlari: 13400, // Yashil
    chorvaBoshlari: 2050,
    asosiyEkinlar: ['limon', 'issiqxona', 'ko\'chat'],
    center: [40.680, 71.668],
    polygonCoordinates: [
      [40.672, 71.658],
      [40.687, 71.660],
      [40.686, 71.678],
      [40.671, 71.676],
      [40.672, 71.658]
    ],
    farmersCount: 115,
    anonymousFarmers: [
      { id: 'f-1301', code: 'DEHQON #1301', cropType: 'Limon ko\'chatxonasi', areaGa: 2.4, livestockCount: 5, healthRate: 97, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(112, 60, 25, 38),
    livestockStats: [
      { type: 'Qoramol', count: 1200, changePercent: 3.7 },
      { type: 'Qo\'y', count: 720, changePercent: 2.1 },
      { type: 'Parranda', count: 9600, changePercent: 7.0 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 14,
    name: 'Ittifoq MFY',
    geojsonId: 'yozyovon_014',
    dehqonchilikGa: 510,
    limonDaraxtlari: 9800, // Sariq
    chorvaBoshlari: 2150,
    asosiyEkinlar: ['limon', 'sabzavot', 'shaftoli'],
    center: [40.668, 71.688],
    polygonCoordinates: [
      [40.660, 71.678],
      [40.675, 71.680],
      [40.674, 71.698],
      [40.659, 71.696],
      [40.660, 71.678]
    ],
    farmersCount: 95,
    anonymousFarmers: [
      { id: 'f-1401', code: 'DEHQON #1401', cropType: 'Shaftoli va limon', areaGa: 1.8, livestockCount: 7, healthRate: 91, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(78, 85, 18, 42),
    livestockStats: [
      { type: 'Qoramol', count: 1280, changePercent: 3.0 },
      { type: 'Qo\'y', count: 760, changePercent: 1.6 },
      { type: 'Parranda', count: 7800, changePercent: 4.8 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 15,
    name: 'Beruniy MFY',
    geojsonId: 'yozyovon_015',
    dehqonchilikGa: 640,
    limonDaraxtlari: 7100, // Sariq
    chorvaBoshlari: 2600,
    asosiyEkinlar: ['bug\'doy', 'limon', 'beda'],
    center: [40.654, 71.686],
    polygonCoordinates: [
      [40.646, 71.676],
      [40.661, 71.678],
      [40.660, 71.696],
      [40.645, 71.694],
      [40.646, 71.676]
    ],
    farmersCount: 89,
    anonymousFarmers: [
      { id: 'f-1501', code: 'DEHQON #1501', cropType: 'Beda va limon', areaGa: 2.2, livestockCount: 11, healthRate: 88, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(58, 125, 12, 47),
    livestockStats: [
      { type: 'Qoramol', count: 1550, changePercent: 2.7 },
      { type: 'Qo\'y', count: 920, changePercent: 1.5 },
      { type: 'Parranda', count: 6800, changePercent: 3.5 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 16,
    name: 'Bahor MFY',
    geojsonId: 'yozyovon_016',
    dehqonchilikGa: 560,
    limonDaraxtlari: 12200, // Yashil
    chorvaBoshlari: 2250,
    asosiyEkinlar: ['limon', 'anor', 'bodom'],
    center: [40.640, 71.682],
    polygonCoordinates: [
      [40.632, 71.672],
      [40.647, 71.674],
      [40.646, 71.692],
      [40.631, 71.690],
      [40.632, 71.672]
    ],
    farmersCount: 108,
    anonymousFarmers: [
      { id: 'f-1601', code: 'DEHQON #1601', cropType: 'Anor va limon yetishtirish', areaGa: 2.0, livestockCount: 8, healthRate: 94, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(100, 70, 32, 43),
    livestockStats: [
      { type: 'Qoramol', count: 1340, changePercent: 3.9 },
      { type: 'Qo\'y', count: 810, changePercent: 2.2 },
      { type: 'Parranda', count: 8500, changePercent: 5.8 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 17,
    name: 'Istiqlol MFY',
    geojsonId: 'yozyovon_017',
    dehqonchilikGa: 690,
    limonDaraxtlari: 10200, // Yashil
    chorvaBoshlari: 2450,
    asosiyEkinlar: ['limon', 'uzum', 'bug\'doy'],
    center: [40.628, 71.666],
    polygonCoordinates: [
      [40.620, 71.656],
      [40.635, 71.658],
      [40.634, 71.676],
      [40.619, 71.674],
      [40.620, 71.656]
    ],
    farmersCount: 104,
    anonymousFarmers: [
      { id: 'f-1701', code: 'DEHQON #1701', cropType: 'Uzum va limon', areaGa: 1.9, livestockCount: 7, healthRate: 92, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(82, 110, 22, 45),
    livestockStats: [
      { type: 'Qoramol', count: 1450, changePercent: 3.3 },
      { type: 'Qo\'y', count: 870, changePercent: 1.9 },
      { type: 'Parranda', count: 7900, changePercent: 4.7 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 18,
    name: 'Yangihayot MFY',
    geojsonId: 'yozyovon_018',
    dehqonchilikGa: 580,
    limonDaraxtlari: 8600, // Sariq
    chorvaBoshlari: 2100,
    asosiyEkinlar: ['limon', 'sabzavot', 'bug\'doy'],
    center: [40.625, 71.646],
    polygonCoordinates: [
      [40.617, 71.636],
      [40.632, 71.638],
      [40.631, 71.656],
      [40.616, 71.654],
      [40.617, 71.636]
    ],
    farmersCount: 91,
    anonymousFarmers: [
      { id: 'f-1801', code: 'DEHQON #1801', cropType: 'Issiqxona sabzavoti va limon', areaGa: 1.5, livestockCount: 6, healthRate: 90, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(69, 105, 16, 40),
    livestockStats: [
      { type: 'Qoramol', count: 1250, changePercent: 2.8 },
      { type: 'Qo\'y', count: 750, changePercent: 1.4 },
      { type: 'Parranda', count: 7100, changePercent: 4.2 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 19,
    name: 'Vahdat MFY',
    geojsonId: 'yozyovon_019',
    dehqonchilikGa: 530,
    limonDaraxtlari: 11500, // Yashil
    chorvaBoshlari: 2300,
    asosiyEkinlar: ['limon', 'bodom', 'shaftoli'],
    center: [40.630, 71.626],
    polygonCoordinates: [
      [40.622, 71.616],
      [40.637, 71.618],
      [40.636, 71.636],
      [40.621, 71.634],
      [40.622, 71.616]
    ],
    farmersCount: 106,
    anonymousFarmers: [
      { id: 'f-1901', code: 'DEHQON #1901', cropType: 'Bodom va limon', areaGa: 2.3, livestockCount: 9, healthRate: 95, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(92, 75, 26, 44),
    livestockStats: [
      { type: 'Qoramol', count: 1370, changePercent: 3.6 },
      { type: 'Qo\'y', count: 830, changePercent: 2.0 },
      { type: 'Parranda', count: 8600, changePercent: 5.4 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 20,
    name: 'Do\'stlik MFY',
    geojsonId: 'yozyovon_020',
    dehqonchilikGa: 670,
    limonDaraxtlari: 8100, // Sariq
    chorvaBoshlari: 2550,
    asosiyEkinlar: ['limon', 'anor', 'bug\'doy'],
    center: [40.642, 71.612],
    polygonCoordinates: [
      [40.634, 71.602],
      [40.649, 71.604],
      [40.648, 71.622],
      [40.633, 71.620],
      [40.634, 71.602]
    ],
    farmersCount: 97,
    anonymousFarmers: [
      { id: 'f-2001', code: 'DEHQON #2001', cropType: 'Limon va don', areaGa: 2.5, livestockCount: 10, healthRate: 88, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(65, 125, 20, 48),
    livestockStats: [
      { type: 'Qoramol', count: 1520, changePercent: 3.0 },
      { type: 'Qo\'y', count: 910, changePercent: 1.6 },
      { type: 'Parranda', count: 7400, changePercent: 4.0 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 21,
    name: 'Mirishkor MFY',
    geojsonId: 'yozyovon_021',
    dehqonchilikGa: 610,
    limonDaraxtlari: 10900, // Yashil
    chorvaBoshlari: 2400,
    asosiyEkinlar: ['limon', 'uzum', 'bodom'],
    center: [40.655, 71.606],
    polygonCoordinates: [
      [40.647, 71.596],
      [40.662, 71.598],
      [40.661, 71.616],
      [40.646, 71.614],
      [40.647, 71.596]
    ],
    farmersCount: 101,
    anonymousFarmers: [
      { id: 'f-2101', code: 'DEHQON #2101', cropType: 'Uzumzor va limon', areaGa: 1.8, livestockCount: 8, healthRate: 93, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(88, 90, 24, 46),
    livestockStats: [
      { type: 'Qoramol', count: 1420, changePercent: 3.4 },
      { type: 'Qo\'y', count: 850, changePercent: 1.8 },
      { type: 'Parranda', count: 8200, changePercent: 5.1 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 22,
    name: 'Navro\'z MFY',
    geojsonId: 'yozyovon_022',
    dehqonchilikGa: 550,
    limonDaraxtlari: 13100, // Yashil
    chorvaBoshlari: 2200,
    asosiyEkinlar: ['limon', 'issiqxona pomidor', 'ko\'chat'],
    center: [40.670, 71.602],
    polygonCoordinates: [
      [40.662, 71.592],
      [40.677, 71.594],
      [40.676, 71.612],
      [40.661, 71.610],
      [40.662, 71.592]
    ],
    farmersCount: 112,
    anonymousFarmers: [
      { id: 'f-2201', code: 'DEHQON #2201', cropType: 'Limon va pomidor issiqxonasi', areaGa: 2.1, livestockCount: 6, healthRate: 96, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(108, 65, 28, 42),
    livestockStats: [
      { type: 'Qoramol', count: 1300, changePercent: 3.8 },
      { type: 'Qo\'y', count: 780, changePercent: 2.2 },
      { type: 'Parranda', count: 9200, changePercent: 6.5 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 23,
    name: 'Bo\'ston MFY',
    geojsonId: 'yozyovon_023',
    dehqonchilikGa: 720,
    limonDaraxtlari: 4400, // Qizil
    chorvaBoshlari: 2850,
    asosiyEkinlar: ['paxta', 'bug\'doy', 'limon'],
    center: [40.685, 71.616],
    polygonCoordinates: [
      [40.677, 71.606],
      [40.692, 71.608],
      [40.691, 71.626],
      [40.676, 71.624],
      [40.677, 71.606]
    ],
    farmersCount: 86,
    anonymousFarmers: [
      { id: 'f-2301', code: 'DEHQON #2301', cropType: 'G\'alla va limon', areaGa: 3.8, livestockCount: 16, healthRate: 85, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(38, 160, 6, 52),
    livestockStats: [
      { type: 'Qoramol', count: 1700, changePercent: 2.8 },
      { type: 'Qo\'y', count: 1020, changePercent: 1.5 },
      { type: 'Parranda', count: 6200, changePercent: 3.1 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 24,
    name: 'Oqoltin MFY',
    geojsonId: 'yozyovon_024',
    dehqonchilikGa: 780,
    limonDaraxtlari: 3600, // Qizil
    chorvaBoshlari: 3200,
    asosiyEkinlar: ['paxta', 'bug\'doy', 'makkajo\'xori'],
    center: [40.698, 71.636],
    polygonCoordinates: [
      [40.690, 71.626],
      [40.705, 71.628],
      [40.704, 71.646],
      [40.689, 71.644],
      [40.690, 71.626]
    ],
    farmersCount: 92,
    anonymousFarmers: [
      { id: 'f-2401', code: 'DEHQON #2401', cropType: 'Paxta va makkajo\'xori', areaGa: 5.5, livestockCount: 18, healthRate: 87, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(26, 185, 4, 58),
    livestockStats: [
      { type: 'Qoramol', count: 1950, changePercent: 4.2 },
      { type: 'Qo\'y', count: 1150, changePercent: 2.1 },
      { type: 'Parranda', count: 5600, changePercent: 2.5 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 25,
    name: 'Kichik Kengagas MFY',
    geojsonId: 'yozyovon_025',
    dehqonchilikGa: 590,
    limonDaraxtlari: 9200, // Sariq
    chorvaBoshlari: 2300,
    asosiyEkinlar: ['limon', 'anor', 'sabzavot'],
    center: [40.700, 71.666],
    polygonCoordinates: [
      [40.692, 71.656],
      [40.707, 71.658],
      [40.706, 71.676],
      [40.691, 71.674],
      [40.692, 71.656]
    ],
    farmersCount: 98,
    anonymousFarmers: [
      { id: 'f-2501', code: 'DEHQON #2501', cropType: 'Anorzor va limon', areaGa: 1.7, livestockCount: 7, healthRate: 91, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(74, 95, 28, 44),
    livestockStats: [
      { type: 'Qoramol', count: 1380, changePercent: 3.1 },
      { type: 'Qo\'y', count: 820, changePercent: 1.7 },
      { type: 'Parranda', count: 7600, changePercent: 4.6 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 26,
    name: 'Ulug\'bek MFY',
    geojsonId: 'yozyovon_026',
    dehqonchilikGa: 520,
    limonDaraxtlari: 12600, // Yashil
    chorvaBoshlari: 2150,
    asosiyEkinlar: ['limon', 'shaftoli', 'ko\'chat'],
    center: [40.690, 71.684],
    polygonCoordinates: [
      [40.682, 71.674],
      [40.697, 71.676],
      [40.696, 71.694],
      [40.681, 71.692],
      [40.682, 71.674]
    ],
    farmersCount: 110,
    anonymousFarmers: [
      { id: 'f-2601', code: 'DEHQON #2601', cropType: 'Limon ko\'chatlari', areaGa: 2.2, livestockCount: 5, healthRate: 95, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(104, 68, 22, 41),
    livestockStats: [
      { type: 'Qoramol', count: 1270, changePercent: 3.6 },
      { type: 'Qo\'y', count: 760, changePercent: 2.0 },
      { type: 'Parranda', count: 8800, changePercent: 6.0 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 27,
    name: 'Dehqonobod MFY',
    geojsonId: 'yozyovon_027',
    dehqonchilikGa: 640,
    limonDaraxtlari: 10400, // Yashil
    chorvaBoshlari: 2400,
    asosiyEkinlar: ['limon', 'bodom', 'sabzavot'],
    center: [40.678, 71.704],
    polygonCoordinates: [
      [40.670, 71.694],
      [40.685, 71.696],
      [40.684, 71.714],
      [40.669, 71.712],
      [40.670, 71.694]
    ],
    farmersCount: 105,
    anonymousFarmers: [
      { id: 'f-2701', code: 'DEHQON #2701', cropType: 'Bodom va limon', areaGa: 2.0, livestockCount: 8, healthRate: 93, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(85, 88, 25, 45),
    livestockStats: [
      { type: 'Qoramol', count: 1410, changePercent: 3.3 },
      { type: 'Qo\'y', count: 850, changePercent: 1.8 },
      { type: 'Parranda', count: 8100, changePercent: 5.2 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 28,
    name: 'Gulshan MFY',
    geojsonId: 'yozyovon_028',
    dehqonchilikGa: 580,
    limonDaraxtlari: 11900, // Yashil
    chorvaBoshlari: 2200,
    asosiyEkinlar: ['limon', 'uzum', 'anor'],
    center: [40.662, 71.706],
    polygonCoordinates: [
      [40.654, 71.696],
      [40.669, 71.698],
      [40.668, 71.716],
      [40.653, 71.714],
      [40.654, 71.696]
    ],
    farmersCount: 107,
    anonymousFarmers: [
      { id: 'f-2801', code: 'DEHQON #2801', cropType: 'Uzum va limon', areaGa: 1.9, livestockCount: 7, healthRate: 94, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(96, 76, 30, 43),
    livestockStats: [
      { type: 'Qoramol', count: 1320, changePercent: 3.5 },
      { type: 'Qo\'y', count: 790, changePercent: 1.9 },
      { type: 'Parranda', count: 8400, changePercent: 5.6 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 29,
    name: 'Soybo\'yi MFY',
    geojsonId: 'yozyovon_029',
    dehqonchilikGa: 670,
    limonDaraxtlari: 7900, // Sariq
    chorvaBoshlari: 2600,
    asosiyEkinlar: ['limon', 'bug\'doy', 'baliqchilik'],
    center: [40.648, 71.702],
    polygonCoordinates: [
      [40.640, 71.692],
      [40.655, 71.694],
      [40.654, 71.712],
      [40.639, 71.710],
      [40.640, 71.692]
    ],
    farmersCount: 96,
    anonymousFarmers: [
      { id: 'f-2901', code: 'DEHQON #2901', cropType: 'Soy bo\'yi limonchilik', areaGa: 2.1, livestockCount: 10, healthRate: 89, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(64, 118, 18, 49),
    livestockStats: [
      { type: 'Qoramol', count: 1540, changePercent: 3.1 },
      { type: 'Qo\'y', count: 930, changePercent: 1.7 },
      { type: 'Parranda', count: 7300, changePercent: 4.1 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 30,
    name: 'Shifokor MFY',
    geojsonId: 'yozyovon_030',
    dehqonchilikGa: 530,
    limonDaraxtlari: 11100, // Yashil
    chorvaBoshlari: 2050,
    asosiyEkinlar: ['limon', 'shifobaxsh giyohlar', 'bodom'],
    center: [40.635, 71.698],
    polygonCoordinates: [
      [40.627, 71.688],
      [40.642, 71.690],
      [40.641, 71.708],
      [40.626, 71.706],
      [40.627, 71.688]
    ],
    farmersCount: 103,
    anonymousFarmers: [
      { id: 'f-3001', code: 'DEHQON #3001', cropType: 'Limon va dorivor giyoh', areaGa: 1.6, livestockCount: 6, healthRate: 95, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(90, 72, 24, 39),
    livestockStats: [
      { type: 'Qoramol', count: 1210, changePercent: 3.4 },
      { type: 'Qo\'y', count: 730, changePercent: 1.9 },
      { type: 'Parranda', count: 8300, changePercent: 5.4 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 31,
    name: 'Yoshlik MFY',
    geojsonId: 'yozyovon_031',
    dehqonchilikGa: 560,
    limonDaraxtlari: 13800, // Yashil
    chorvaBoshlari: 2200,
    asosiyEkinlar: ['limon', 'innovatsion issiqxona', 'ko\'chat'],
    center: [40.622, 71.684],
    polygonCoordinates: [
      [40.614, 71.674],
      [40.629, 71.676],
      [40.628, 71.694],
      [40.613, 71.692],
      [40.614, 71.674]
    ],
    farmersCount: 114,
    anonymousFarmers: [
      { id: 'f-3101', code: 'DEHQON #3101', cropType: 'Yoshlar tomorqasi limon', areaGa: 2.3, livestockCount: 7, healthRate: 97, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(115, 62, 28, 43),
    livestockStats: [
      { type: 'Qoramol', count: 1310, changePercent: 4.0 },
      { type: 'Qo\'y', count: 780, changePercent: 2.3 },
      { type: 'Parranda', count: 9500, changePercent: 6.8 }
    ],
    updatedAt: '2026-08-28'
  },
  {
    id: 32,
    name: 'Obod MFY',
    geojsonId: 'yozyovon_032',
    dehqonchilikGa: 620,
    limonDaraxtlari: 10800, // Yashil
    chorvaBoshlari: 2350,
    asosiyEkinlar: ['limon', 'anor', 'shaftoli'],
    center: [40.618, 71.662],
    polygonCoordinates: [
      [40.610, 71.652],
      [40.625, 71.654],
      [40.624, 71.672],
      [40.609, 71.670],
      [40.610, 71.652]
    ],
    farmersCount: 106,
    anonymousFarmers: [
      { id: 'f-3201', code: 'DEHQON #3201', cropType: 'Obod bog\'lar limonchilik', areaGa: 1.9, livestockCount: 8, healthRate: 93, status: 'yaxshi' }
    ],
    pestAlerts: [],
    statePrograms: [],
    dynamics12Months: createDynamics(87, 86, 26, 46),
    livestockStats: [
      { type: 'Qoramol', count: 1400, changePercent: 3.4 },
      { type: 'Qo\'y', count: 840, changePercent: 1.8 },
      { type: 'Parranda', count: 8100, changePercent: 5.0 }
    ],
    updatedAt: '2026-08-28'
  }
];

export const YOZYOVON_ALL_32_MFY: MFYData[] = RAW_32_MFY.map(mfy => ({
  ...mfy,
  polygonCoordinates: generateOrganicMfyBoundary(mfy.center[0], mfy.center[1], mfy.id, mfy.dehqonchilikGa)
}));
