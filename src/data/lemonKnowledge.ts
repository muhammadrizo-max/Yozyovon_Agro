/**
 * Yozyovon tumani Limonchilik Bilimlar Bazasi
 * Manba: Qishloq xo'jaligi vazirligi, Yozyovon agro-inspeksiyasi va ilmiy-tadqiqot institutlari
 */

export interface LemonCarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  description: string;
}

export interface LemonDiseaseGuide {
  id: string;
  name: string;
  scientificName: string;
  imageUrl: string;
  symptoms: string[];
  severity: 'high' | 'medium' | 'low';
  causes: string;
  prevention: string;
  treatment: string;
}

export interface LemonPestGuide {
  id: string;
  name: string;
  scientificName: string;
  imageUrl: string;
  damage: string;
  identification: string;
  biologicalControl: string;
  chemicalControl: string;
}

export interface BeginnerStep {
  step: number;
  title: string;
  timeline: string;
  summary: string;
  checklist: string[];
}

export const LEMON_CAROUSEL_SLIDES: LemonCarouselSlide[] = [
  {
    id: 1,
    title: "Yozyovon Oltin Limonlari (Meyeri & Toshkent navlari)",
    subtitle: "Yuqori hosildorlik va serhosil sitruszorlar siri",
    category: "Navlar & Hosil",
    imageUrl: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=1200&auto=format&fit=crop&q=80",
    description: "Yozyovon iqlimiga moslashtirilgan Meyeri navi bir tupdan 40-70 kg gacha xushbo'y, yupqa po'stloqli hosil beradi."
  },
  {
    id: 2,
    title: "Sertifikatlangan Limon Ko'chatlari Tanlash",
    subtitle: "2 yillik baquvvat payvandlangan sog'lom nihollar",
    category: "Ko'chat & Ekish",
    imageUrl: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=1200&auto=format&fit=crop&q=80",
    description: "Sog'lom ko'chat ildiz tizimi yaxshi rivojlangan, barglari yaltiroq va hech qanday zararkunanda izlarisiz bo'lishi shart."
  },
  {
    id: 3,
    title: "Xandaq va Issiqxona Usulida Yetishtirish",
    subtitle: "Qishki qattiq sovuqlardan 100% himoyalangan mikroiqlim",
    category: "Agrotexnologiya",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&auto=format&fit=crop&q=80",
    description: "Xandaq chuqurligi 1.5-2 metr bo'lib, qishda qo'shimcha isitish xarajatlarini 50-70% gacha tejaydi."
  },
  {
    id: 4,
    title: "Bahorgi Gullash va Bo'g'oz Tugunlar Davri",
    subtitle: "Namlik 70-75%, harorat 20-25°C da saqlanishi zarur",
    category: "Parvarish",
    imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=1200&auto=format&fit=crop&q=80",
    description: "Gullash paytida ortiqcha shamollatish va sovuq suv bilan sug'orish gul to'kilishiga sabab bo'ladi."
  },
  {
    id: 5,
    title: "Yig'im-terim, Saralash va Eksport Standartlari",
    subtitle: "Noyabr-Yanvar oylarida eng yuqori bozor narxi",
    category: "Bozor & Daromad",
    imageUrl: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=1200&auto=format&fit=crop&q=80",
    description: "Eksportbop limonlar kalibrlanib, 12-14°C va 85% namlikda saqlansa 4 oygacha yangiligini yo'qotmaydi."
  }
];

export const LEMON_DISEASES: LemonDiseaseGuide[] = [
  {
    id: 'canker',
    name: "Sitrus rak kasalligi (Citrus Canker)",
    scientificName: "Xanthomonas axonopodis pv. citri",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    severity: 'high',
    symptoms: [
      "Barg, novda va mevalarda bo'rtib chiqqan qo'pol qo'ng'ir dog'lar",
      "Dog'larning atrofi doirasimon sariq halqa bilan o'ralgan bo'ladi",
      "Zararlangan barglar va mevalar pishmasdan ommaviy to'kiladi"
    ],
    causes: "Yuqori namlik va issiqlik, yomg'irli havoda yoki tomchilar orqali bakteriyalarning tarqalishi.",
    prevention: "Sertifikatlangan sog'lom ko'chat ekish, asboblarni 70% spirt bilan dezinfeksiya qilish, shamoldan himoyalovchi to'siqlar.",
    treatment: "Mis kuporosi (1%), Bordo suyuqligi yoki mis oksixlorid bilan erta bahorda va har bir o'sish to'lqinida profilaktik purkash. Qattiq zararlangan shoxlar kesilib kuydiriladi."
  },
  {
    id: 'phytophthora',
    name: "Fitofthora ildiz va tana chirishi (Gummosis)",
    scientificName: "Phytophthora spp.",
    imageUrl: "https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=600&auto=format&fit=crop&q=80",
    severity: 'high',
    symptoms: [
      "Tana pastki qismi va ildiz bo'g'zida po'stloq yorilishi va yelim (smola) oqishi",
      "Ildizlarning chirishi, suv o'tkazuvchanligining buzilishi",
      "Barglarning sarg'ayishi, tojlarning qisman qurib qolishi"
    ],
    causes: "Tuproqda suv turg'unligi, ildiz bo'g'zining tuproq ostiga ko'milib qolishi, og'ir gil tuproq.",
    prevention: "Ildiz bo'g'zini tuproq sathidan 5-10 sm yuqorida ekish, drenaj ariqlari qilish, tomchilatib sug'orish.",
    treatment: "Zararlangan po'stloq sog'lom yog'ochgacha tozalanadi, 3% Bordo suyuqligi yoki mis oksixlorid pastasi surtiladi. Ildiz atrofi Ridomil Gold yoki Fitolavin bilan sug'oriladi."
  },
  {
    id: 'greasy_spot',
    name: "Yog'simon dog'lanish (Greasy Spot)",
    scientificName: "Zasmidium citri-griseum",
    imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80",
    severity: 'medium',
    symptoms: [
      "Bargning orqa tomonida moy sachragandek qoramtir-jigarrang pufakchali dog'lar",
      "Barg ustki tomonida sariq notekis dog'lar",
      "Kuz va qish davrida barglarning erta to'kilib ketishi"
    ],
    causes: "Issiqxonada havoning dimiqishi, 25-30°C harorat va uzoq vaqt saqlanib turgan shudring.",
    prevention: "Issiqxonani muntazam shamollatish, to'kilgan barcha quruq barglarni to'plab issiqxonadan tashqariga chiqarish.",
    treatment: "Mineral moylar bilan aralashtirilgan misli preparatlar (Kuprikol, Champion) sepish."
  },
  {
    id: 'anthracnose',
    name: "Sitrus antraknozi (Anthracnose)",
    scientificName: "Colletotrichum gloeosporioides",
    imageUrl: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600&auto=format&fit=crop&q=80",
    severity: 'medium',
    symptoms: [
      "Novdalarning uchki qismidan boshlab orqaga qarab qurishi (dieback)",
      "Mevalarda qora botiq yaralar paydo bo'lishi",
      "Barg chetlarida quruq nekrotik dog'lar"
    ],
    causes: "Daraxtning sovuqdan, o'g'it yetishmovchiligidan yoki ildiz zararlanishidan kuchsizlanishi.",
    prevention: "O'z vaqtida kaliy-fosfor bilan oziqlantirish, butash paytida novdalarni sanitariya holatiga keltirish.",
    treatment: "Skor (2 ml / 10 litr suv) yoki Quadris fungitsidi bilan purkash. Qurigan novdalarni sog'lom joyigacha kesish."
  },
  {
    id: 'sooty_mold',
    name: "Qora mog'or (Sooty Mold / Qurum)",
    scientificName: "Capnodium citri",
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80",
    severity: 'medium',
    symptoms: [
      "Barg, novda va meva yuzasida qora qurumsimon qora plyonka paydo bo'lishi",
      "Fotosintez jarayoni 80% gacha to'xtaydi",
      "Meva tovar ko'rinishini yo'qotadi"
    ],
    causes: "Shira, oqqanot va qalqondorlar ajratgan shirin asalshira (honeydew) ustida zamburug' rivojlanishi.",
    prevention: "Zararkunanda hasharotlarni vaqtida yo'q qilish.",
    treatment: "Avvalo oqqanot va shiraga qarshi Aktara yoki Fitoverm sepiladi. So'ngra barglar sovunli suv yoki 1% li soda eritmasi bilan yuvib tashlanadi."
  },
  {
    id: 'hlb_greening',
    name: "Sitrus ko'karishi / HLB (Huanglongbing)",
    scientificName: "Candidatus Liberibacter asiaticus",
    imageUrl: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=80",
    severity: 'high',
    symptoms: [
      "Barg tomirlari bo'ylab notekis 'marmarsimon' sarg'ayish (assimmetrik xloroz)",
      "Meva qiyshiq, mayda va yarmi yashil bo'lib pishmay qolishi",
      "Daraxtning 2-3 yilda butunlay so'lib nobud bo'lishi"
    ],
    causes: "Sitrus psillidi hasharoti orqali yuqumli bakteriyaning o'simlik floemasiga kirishi.",
    prevention: "Karantin nazorati, psillid hasharotiga qarshi qat'iy profilaktika, faqat toza ko'chatxonadan xarid qilish.",
    treatment: "HLB ga qarshi kimyoviy davo yo'q! Gumon qilingan daraxt zudlik bilan fitosanitarga bildirilishi va yoqib yuborilishi shart."
  }
];

export const LEMON_PESTS: LemonPestGuide[] = [
  {
    id: 'leafminer',
    name: "Sitrus bargmineri (Citrus Leafminer)",
    scientificName: "Phyllocnistis citrella",
    imageUrl: "https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=600&auto=format&fit=crop&q=80",
    damage: "Yosh nozik barglar ichida kumushsimon ilonizi yo'llar qaziydi. Barglar bujmayib, o'sishdan to'xtaydi.",
    identification: "Yoz oylarida yangi unib chiqqan yosh novdalarda ko'p uchraydi.",
    biologicalControl: "Foydali Cirrospilus tebranish qurtlari, nimb daraxti yog'i (Neem oil).",
    chemicalControl: "Vertimek (0.5-0.75 ml/litr) yoki Mospilan (2-3 g/10 litr suv) yosh barglar 2 sm ga yetganda."
  },
  {
    id: 'whitefly',
    name: "Sitrus oqqanoti (Citrus Whitefly)",
    scientificName: "Dialeurodes citri",
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80",
    damage: "Barg orqasidan sharbat so'radi, mo'l asalshira ajratib, qora mog'or paydo bo'lishiga zamin yaratadi.",
    identification: "Barg silkitilganda mayda oppoq parvonalar havoga uchadi, barg orqasida shaffof lichinkalar bo'ladi.",
    biologicalControl: "Sariq yopishqoq tuzoqlar (har 15 m² ga 1 dona), Enkarsiya foydali paraziti.",
    chemicalControl: "Aktara (2-3 g/10 l suv), Teppeki (1.5 g/10 l suv) yoki Admiral gormonal preparati."
  },
  {
    id: 'aphid',
    name: "Sitrus qora va yashil shirasi (Citrus Aphids)",
    scientificName: "Toxoptera aurantii / Aphis gossypii",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    damage: "Yosh poya va gullarni o'rab olib, sharbatini so'radi, g'unchalarning to'kilishiga sabab bo'ladi.",
    identification: "Uchki novdalar va barglar buralib qoladi, chumolilar faolligi sezilarli oshadi.",
    biologicalControl: "Xonqizi qo'ng'izlari (Ladybugs), oltinko'z (Lacewing) lichinkalari.",
    chemicalControl: "Biotlin, Karate Zeon yoki sarimsoq/sovun damlamasi bilan dastlabki o'choqlarga purkash."
  },
  {
    id: 'red_mite',
    name: "Sitrus qizil kanasi (Red Spider Mite)",
    scientificName: "Panonychus citri",
    imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80",
    damage: "Barglarda mayda och nuqtalar hosil qiladi, barglar kulrang-bronza tus olib to'kiladi.",
    identification: "Quruq va issiq havoda (harorat > 30°C, namlik < 40%) tez ko'payadi, mayda o'rgimchak to'ri bo'ladi.",
    biologicalControl: "Fitoseyid yirtqich kanalar, havoni namlash (purkash orqali namlikni 65% dan oshirish).",
    chemicalControl: "Omayt, Envidor, Sanmayt yoki Nisoran akaritsidlari. (Akaritsidlarni navbatlab qo'llash shart)."
  }
];

export const BEGINNER_GUIDE: BeginnerStep[] = [
  {
    step: 1,
    title: "Joy tanlash va tuproq tahlili",
    timeline: "Ekishdan 2 oy oldin (Yanvar-Fevral)",
    summary: "Quyoshli, shamoldan himoyalangan, yer osti suvi kamida 1.5-2 metr chuqurda bo'lgan joy tanlanadi.",
    checklist: [
      "Tuproq pH qiymatini tekshiring (ideal: 6.0 - 7.0 orasida)",
      "Tuproq mexanik tarkibini aniqlang (qumoq yoki o'rtacha qumloq)",
      "1 gektar maydonga 30-40 tonna chirigan go'ng va 300 kg superfosfat solib haydang"
    ]
  },
  {
    step: 2,
    title: "Issiqxona yoki Xandaq qurilishi",
    timeline: "Fevral - Mart",
    summary: "Yozyovon iqlimida qishki -15°C dan limonni asrash uchun eng qulayi xandaq yoki polikarbonatli issiqxona.",
    checklist: [
      "Xandaq eni 4-6 metr, chuqurligi 1.5-1.8 metr qilib qaziladi",
      "Janub tomoni yorug'lik tushadigan nishablikda polietilen plyonka bilan qoplanadi",
      "Ventilyatsiya (shamollatish) tuynuklari va suv oqimi uchun drenaj qilinadi"
    ]
  },
  {
    step: 3,
    title: "Ko'chat tanlash va ekish sxemasi",
    timeline: "Mart - Aprel",
    summary: "Trifoliata (uchbargli ponisirus) payvandtagiga ulangan 2 yillik Meyeri yoki Toshkent navli nihollar ekiladi.",
    checklist: [
      "Ekish oraliqlari: xandaqda 3x3m yoki 4x3m; baland issiqxonada 5x5m",
      "Chuqur o'lchami: 60x60x60 sm, har bir chuqurga 10-15 kg gumus va 100g superfosfat",
      "Ildiz bo'g'zi tuproq sathidan kamida 5-8 sm balandda qoldiriladi"
    ]
  },
  {
    step: 4,
    title: "Tomchilatib sug'orish va mikroiqlim",
    timeline: "May - Sentabr (O'suv davri)",
    summary: "Limon ildizi yuzada joylashganligi sababli muntazam va me'yorida namlik talab etadi.",
    checklist: [
      "Har bir tup atrofiga 2-4 ta tomizgich (soatiga 4 litr) o'rnatiladi",
      "Yozda har 3-4 kunda 20-30 litr suv beriladi",
      "Issiqxona harorati 32°C dan oshmasligi uchun ustiga 50% li soya qiluvchi to'r tortiladi"
    ]
  },
  {
    step: 5,
    title: "O'g'itlash va mikronutriyentlar",
    timeline: "Yil davomida 4-5 marta",
    summary: "Azot (bahorda o'sish uchun), Fosfor (ildiz va g'uncha uchun), Kaliy (meva shirinligi va qishki chidamlilik uchun).",
    checklist: [
      "Mart-Aprel: Karbamid yoki ammoniy selitrasi (har bir tupga 50-80 g)",
      "Iyun-Iyul: Kompleks NPK 18-18-18 va Temir xelati (xloroz oldini olish uchun)",
      "Avgust-Sentabr: Kaliy sulfat va superfosfat (qishki sovuqqa chidamlilikni oshiradi)"
    ]
  },
  {
    step: 6,
    title: "Shakl berish, butash va sanitariya",
    timeline: "Fevral oxiri va Iyul oyi",
    summary: "Markaziy poyada 3-4 ta asosiy skelet shox qoldirib, past bo'yli 'butasimon' shakl beriladi.",
    checklist: [
      "Ichkariga qarab o'sgan va bir-biriga soya soluvchi novdalar kesiladi",
      "Yovvoyi bachki novdalar (suv shoxlari) 10 sm bo'lgandayoq olib tashlanadi",
      "Kesilgan joylarga bog' malhami (sadoviy var) surtiladi"
    ]
  },
  {
    step: 7,
    title: "Hosilni terish va qishki saqlash",
    timeline: "Noyabr - Yanvar",
    summary: "Meva po'sti sarg'ayib, 70-80% rang olganda meva bandi maxsus qaychi bilan kesib olinadi.",
    checklist: [
      "Limonni qo'l bilan yulib olmang — meva bandi orqali chirish kiradi",
      "Quruq havoda teriladi va yog'och qutilarga bir qavatdan teriladi",
      "Qishda xandaq/issiqxona harorati +3°C dan pastga tushmasligi nazorat qilinadi"
    ]
  }
];
