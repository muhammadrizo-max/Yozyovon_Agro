import { AgroDiseaseRecord } from '../types';

/**
 * Yozyovon Tumani Qishloq Xo'jaligi va Fitosanitariya Davlat Inspeksiyasi
 * Rasmiy tasdiqlangan o'simlik va ko'chat kasalliklari, alomatlari hamda dori vositalari registri.
 * Bu ma'lumotlar AI Skaner tahlilida cross-reference (solishtirish) uchun ishlatiladi.
 */
export const INITIAL_GOV_AGRO_DISEASES: AgroDiseaseRecord[] = [
  {
    id: 'gov-dis-001',
    plantType: 'limon',
    diseaseName: 'Limon Gommozi va Antraknozi (Yelim oqishi & qora chirish)',
    targetPart: 'branch',
    severityLevel: 'high',
    visualSymptoms: [
      'Poya va shox qobigʻining yorilishi va toʻq qahrabo rangli yelim (smola) oqishi',
      'Barglarning uchidan boshlab sargʻayishi va qurib toʻkilishi',
      'Mevada toʻq jigarrang, botib kirgan qora nekrotik dogʻlar'
    ],
    medicines: 'Mis kuporosi (Bordeaux suyuqligi 1%), Oksixom, Abiga-Pik yoki Kuproksat',
    dosageAndUsage: '10 litr suvga 100 g mis kuporosi + 100 g soʻndirilgan ohak yoki 40 g Oksixom. Shoxlarning yara joylarini tozalab, 3% mis kuporosi bilan surtish va bogʻ qatroni bilan qoplash.',
    preventiveMeasures: 'Daraxt tanasini oqlash, ortiqcha namlikdan saqlash, yorugʻlikni taʼminlash uchun bahorgi sanitariya butash.',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    verifiedByGov: true,
    updatedAt: '2026-03-15'
  },
  {
    id: 'gov-dis-002',
    plantType: 'limon',
    diseaseName: 'Limon Oqqanoti va Qora Shira (Citrus Whitefly & Aphids)',
    targetPart: 'leaf',
    severityLevel: 'high',
    visualSymptoms: [
      'Bargning orqa tomonida mayda oq qanotli hasharotlar toʻdasi',
      'Barg yuzasida yopishqoq shira (asal shudring) va uning ustida qora kuyasimon gʻubor',
      'Barglarning buralishi, qorayishi va fotosintezning toʻxtashi'
    ],
    medicines: 'Aktara 25 WG, Teppeki 50 WG, Mospilan 20 SP yoki Bi-58 Yangi',
    dosageAndUsage: '10 litr toza suvga 4 gramm Aktara yoki 3 gramm Teppeki. Bargning ostki qismiga yaxshilab tushishi uchun kechki payt nozik purkagichda sepiladi.',
    preventiveMeasures: 'Issiqxonada sariq yelimli feromon tutqichlarni osish (har 50 kv.m ga 1 ta), begona oʻtlarni muntazam yoʻqotish.',
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
    verifiedByGov: true,
    updatedAt: '2026-03-18'
  },
  {
    id: 'gov-dis-003',
    plantType: 'limon',
    diseaseName: 'Temir va Magniy Xlorozi (Barglarning sargʻayishi)',
    targetPart: 'leaf',
    severityLevel: 'medium',
    visualSymptoms: [
      'Yosh barglarda tomirlar yashil qolib, tomirlar oraligʻining sargʻayishi (Fe tanqisligi)',
      'Qari barglarning chetlari va oʻrtasining V-simon sargʻayishi (Mg tanqisligi)',
      'Oʻsishning toʻxtashi, mevalarning maydalashishi va toʻkilishi'
    ],
    medicines: 'Xelat temir (Fe-EDDHA 6%), Magniy sulfat, Ferrovit yoki Mikromikst',
    dosageAndUsage: 'Har bir tup limon ostiga 15-20 g Fe-EDDHA xelat temirini eritib ildizdan quyish; bargdan 10L suvga 25 g Magniy sulfat purkash.',
    preventiveMeasures: 'Tuproq shoʻrlanishini pasaytirish, ohakli tuproqlarda chirigan goʻng va torf qoʻllash, meʼyordan ortiq sovuq suv quymaslik.',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80',
    verifiedByGov: true,
    updatedAt: '2026-03-10'
  },
  {
    id: 'gov-dis-004',
    plantType: 'limon',
    diseaseName: 'Oʻrgimchakkana (Citrus Red Spider Mite)',
    targetPart: 'leaf',
    severityLevel: 'high',
    visualSymptoms: [
      'Barglarning ustida mayda oqish-kulrang dogʻchalar (marmar naqsh)',
      'Barg orqasida nozik oʻrgimchak toʻri va mayda qizgʻish harakatlanuvchi kanalar',
      'Ogʻir zararlanganda barglar qovjirab yoppasiga toʻkiladi'
    ],
    medicines: 'Vertimek 018 EC, Omite 570 EW, Nissoran 10 WP yoki Oberon Rapid',
    dosageAndUsage: '10 litr suvga 5-7 ml Vertimek yoki 10 ml Omite. 7-10 kun oraligʻida turli taʼsir etuvchi moddali akaritsidlar bilan navbatlab 2 marta ishlov berish.',
    preventiveMeasures: 'Issiqxonada havoning nisbiy namligini 70-75% dan kamaytirmaslik, quruq issiq havoda havoni namlantirish.',
    imageUrl: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=600&auto=format&fit=crop&q=80',
    verifiedByGov: true,
    updatedAt: '2026-03-20'
  },
  {
    id: 'gov-dis-005',
    plantType: 'mevali_daraxt',
    diseaseName: 'Daraxt Parshasi (Qoʻtir / Venturia inaequalis)',
    targetPart: 'fruit',
    severityLevel: 'medium',
    visualSymptoms: [
      'Barglarda dastlab zaytun rangli baxmalsimon dogʻlar hosil boʻlishi',
      'Meva yuzasida qora, yorilgan, qattiq qora poʻstloqli dogʻlar',
      'Mevalarning qiyshayib, toshdek qotib qolishi va rivojlanmay qolishi'
    ],
    medicines: 'Skor 250 EC, Chorus 50 WG, Delan 700 WG yoki Poliram',
    dosageAndUsage: '10 litr suvga 2 ml Skor yoki 3 g Chorus. Kurtaklar boʻrtishida va guldan keyin meva tugish paytida purkash.',
    preventiveMeasures: 'Kuzda toʻkilgan kasal barglarni yoʻqotish, erta bahorda 3% li Bordeaux suyuqligi bilan "koʻk purkash" oʻtkazish.',
    imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&auto=format&fit=crop&q=80',
    verifiedByGov: true,
    updatedAt: '2026-03-12'
  },
  {
    id: 'gov-dis-006',
    plantType: 'uzum',
    diseaseName: 'Uzum Oidiumi (Un shudring kasalligi)',
    targetPart: 'all',
    severityLevel: 'high',
    visualSymptoms: [
      'Barg, novda va uzum mevalarida xuddi un sepilgandek oq-kulrang gʻubor',
      'Zararlangan gʻujumlar yorilib ketadi, danagi koʻrinib chiriy boshlaydi',
      'Xarakterli aynigan seld baligʻi hidi kelishi'
    ],
    medicines: 'Topaz 100 EC, Tilt 250 EC, Kolloid oltingugurt yoki Falcon',
    dosageAndUsage: '10 litr suvga 3-4 ml Topaz yoki 40-50 g kolloid oltingugurt. Havo harorati +28°C dan oshmagan paytda sepish.',
    preventiveMeasures: 'Tok shoxlarini koʻmib qoʻymaslik, soʻritoklarda shamollatishni yaxshilash, xomtokni oʻz vaqtida qilish.',
    imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80',
    verifiedByGov: true,
    updatedAt: '2026-03-21'
  },
  {
    id: 'gov-dis-007',
    plantType: 'sabzavot',
    diseaseName: 'Fitoftoroz (Kechki chirish - Phytophthora)',
    targetPart: 'leaf',
    severityLevel: 'high',
    visualSymptoms: [
      'Barglarda tez kengayuvchi toʻq qoʻngʻir suvli yirik dogʻlar',
      'Barg orqasida nam havoda nozik oqish mogʻor qatlami',
      'Meva va poyalarda qattiq toʻq qoʻngʻir dogʻlar, mevaning ichkarigacha chirishi'
    ],
    medicines: 'Ridomil Gold MZ, Infinito 687.5 SC, Quadris yoki Revus',
    dosageAndUsage: '10 litr suvga 25 g Ridomil Gold yoki 15 ml Infinito. Kasallik alomatlari koʻrinishi bilan 10-12 kun oraliq bilan 2 marta sepiladi.',
    preventiveMeasures: 'Ekinlarni tomchilatib sugʻorish, namlikni meʼyorda ushlash, kartoshka va pomidorni yonma-yon ekmaslik.',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&auto=format&fit=crop&q=80',
    verifiedByGov: true,
    updatedAt: '2026-03-19'
  },
  {
    id: 'gov-dis-008',
    plantType: 'sabzavot',
    diseaseName: 'Sabzavot Un Shudringi (Erysiphe cichoracearum)',
    targetPart: 'leaf',
    severityLevel: 'medium',
    visualSymptoms: [
      'Barg ustida oppoq kukunsimon dogʻlar paydo boʻlishi',
      'Barglarning sargʻayib, moʻrtlashib qurib qolishi',
      'Fotosintez keskin pasayib, hosildorlik 40-50% ga kamayishi'
    ],
    medicines: 'Topaz 100 EC (3 ml/10L), Tiovit Djet (30 g/10L) yoki Skor 250 EC',
    dosageAndUsage: '10 litr suvga 3-4 ml Topaz yoki 30 g Tiovit Djet. Ertalab yoki kechki payt purkaladi.',
    preventiveMeasures: 'Issiqxona havosi haroratini +26°C dan oshirmaslik, ortiqcha azotli oʻgʻitlardan tiyilish.',
    imageUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e17?w=600&auto=format&fit=crop&q=80',
    verifiedByGov: true,
    updatedAt: '2026-03-22'
  },
  {
    id: 'gov-dis-009',
    plantType: 'sabzavot',
    diseaseName: 'Sogʻlom Sabzavot Ekini (Kasallik aniqlanmadi)',
    targetPart: 'leaf',
    severityLevel: 'low',
    visualSymptoms: [
      'Toʻq yashil sogʻlom barglar, dogʻlar va zararkunandalar yoʻq',
      'Poyasi mustahkam, generativ va vegetativ oʻsish meʼyorda'
    ],
    medicines: 'Kimyoviy dori talab etilmaydi. Profilaktika uchun Gumafos yoki Biostimulyator.',
    dosageAndUsage: '10 litr suvga 20 ml Gumafos yoki Aminokislotalar majmuasi bargdan purkash.',
    preventiveMeasures: 'Muntazam tomchilatib sugʻorish va kaliy-fosforli oʻgʻitlar bilan meʼyorda oziqlantirish.',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&auto=format&fit=crop&q=80',
    verifiedByGov: true,
    updatedAt: '2026-03-24'
  },
  {
    id: 'gov-dis-010',
    plantType: 'mevali_daraxt',
    diseaseName: 'Monilioz va Meva Chirishi (Monilinia fructigena)',
    targetPart: 'fruit',
    severityLevel: 'high',
    visualSymptoms: [
      'Meva ustida aylana shaklida sargʻish-kulrang mogʻor yostiqchalari',
      'Mevaning yumshab chirishi va novdada mumiyolashib qolishi',
      'Yosh novdalar va gullarning kuygandek qoʻngʻir tus olib qurishi'
    ],
    medicines: 'Horus 75 WG, Signum WG yoki 1% Bordo suyuqligi',
    dosageAndUsage: '10 litr suvga 3 g Horus yoki 10-12 g Signum. Gullashdan oldin va meva tugishda 2 marta purkash.',
    preventiveMeasures: 'Daraxt tagidagi chirigan mevalarni yigʻib chuqur koʻmish, zararlangan shoxlarni kesish.',
    imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&auto=format&fit=crop&q=80',
    verifiedByGov: true,
    updatedAt: '2026-03-23'
  },
  {
    id: 'gov-dis-011',
    plantType: 'mevali_daraxt',
    diseaseName: 'Sogʻlom Mevali Bogʻ Daraxti (Kasallik aniqlanmadi)',
    targetPart: 'leaf',
    severityLevel: 'low',
    visualSymptoms: [
      'Barg plastinkasi toza, fotosintez toʻliq faol',
      'Zararkunanda yoki nekrotik dogʻlar mavjud emas'
    ],
    medicines: 'Kimyoviy dori talab etilmaydi.',
    dosageAndUsage: 'Mavsumiy mikroelementlar bilan bargdan oziqlantirish.',
    preventiveMeasures: 'Agrotexnik parvarish, sugʻorish jadvali va sanitariya butash meʼyorida davom ettirilsin.',
    imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&auto=format&fit=crop&q=80',
    verifiedByGov: true,
    updatedAt: '2026-03-24'
  },
  {
    id: 'gov-dis-012',
    plantType: 'boshqa_kochat',
    diseaseName: 'Koʻchat Ildiz Boʻgʻzi Chirishi (Qora oyoq / Rhizoctonia)',
    targetPart: 'branch',
    severityLevel: 'high',
    visualSymptoms: [
      'Yosh nihol va koʻchatning ildiz boʻgʻzi qorayib ingichkalashishi',
      'Niholning tuproqqa yiqilib soʻlib qolishi',
      'Ildiz toʻqimasining chirishi va oʻsishdan toʻxtashi'
    ],
    medicines: 'Previkur Enerji 840 SL, Fitolavin yoki Trichodermin',
    dosageAndUsage: '10 litr suvga 15-20 ml Previkur Enerji. Nihollar tagiga 100-150 ml dan ildizdan quyiladi.',
    preventiveMeasures: 'Tuproqni sterilizatsiya qilish, ortiqcha zaxlikka yoʻl qoʻymaslik, koʻchatxonalarni muntazam shamollatish.',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    verifiedByGov: true,
    updatedAt: '2026-03-20'
  },
  {
    id: 'gov-dis-013',
    plantType: 'boshqa_kochat',
    diseaseName: 'Sogʻlom Yosh Nihol va Koʻchat (Kasallik aniqlanmadi)',
    targetPart: 'leaf',
    severityLevel: 'low',
    visualSymptoms: [
      'Koʻchat va nihol barglari tiniq yashil rangda, turgor saqlangan',
      'Ildiz tizimi oq va sogʻlom, kasallik alomati yoʻq'
    ],
    medicines: 'Kimyoviy dori vositasi talab etilmaydi.',
    dosageAndUsage: 'Ildiz rivojlanishi uchun Kornevin (1 g/1L suv) yoki Gumat kaliy.',
    preventiveMeasures: 'Yorugʻlik va harorat rejimiga rioya qiling, tuproqni meʼyorida namlang.',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    verifiedByGov: true,
    updatedAt: '2026-03-24'
  },
  {
    id: 'gov-dis-014',
    plantType: 'limon',
    diseaseName: 'Sogʻlom Limon Bargi va Daraxti (Kasallik aniqlanmadi)',
    targetPart: 'leaf',
    severityLevel: 'low',
    visualSymptoms: [
      'Barg toʻq yashil va yaltiroq, toʻqimalar butun va sogʻlom',
      'Hech qanday zararkunanda, dogʻ yoki chirish alomatlari yoʻq'
    ],
    medicines: 'Kimyoviy preparat talab qilinmaydi.',
    dosageAndUsage: 'Profilaktik bargdan oziqlantirish: Gumafos yoki Mikromikst (15-20 g/10L).',
    preventiveMeasures: 'Optimal issiqxona iqlimi (harorat 20-25°C, namlik 65-70%) va tomchilatib sugʻorishni davom ettiring.',
    imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&auto=format&fit=crop&q=80',
    verifiedByGov: true,
    updatedAt: '2026-03-24'
  }
];

