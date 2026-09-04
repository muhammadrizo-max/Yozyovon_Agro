import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  ShieldAlert, 
  Bug, 
  Calculator, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Thermometer, 
  Droplets, 
  Sun, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  Share2,
  Calendar,
  Layers,
  Award,
  ThumbsUp,
  PlusCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import { 
  LEMON_CAROUSEL_SLIDES, 
  LEMON_DISEASES, 
  LEMON_PESTS, 
  BEGINNER_GUIDE,
  LemonDiseaseGuide,
  LemonPestGuide
} from '../data/lemonKnowledge';
import { useApp } from '../context/AppContext';

export const LemonAcademy: React.FC = () => {
  const { 
    setActiveTab, 
    currentUser, 
    farmerAdvices, 
    addFarmerAdvice, 
    toggleLikeAdvice,
    mfyList,
    isLoggedIn
  } = useApp();

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Section Tabs
  const [activeSection, setActiveSection] = useState<'beginner' | 'diseases' | 'pests' | 'calculator' | 'sources' | 'farmer_advices'>('beginner');

  // Selected details modal
  const [selectedDisease, setSelectedDisease] = useState<LemonDiseaseGuide | null>(null);
  const [selectedPest, setSelectedPest] = useState<LemonPestGuide | null>(null);

  // New Advice Form States
  const [showNewAdviceModal, setShowNewAdviceModal] = useState(false);
  const [adviceTitle, setAdviceTitle] = useState('');
  const [adviceCategory, setAdviceCategory] = useState<'parvarish' | 'kasallik' | 'hosildorlik' | 'qishlash' | 'sugorish'>('parvarish');
  const [adviceContent, setAdviceContent] = useState('');
  const [advicePrecautions, setAdvicePrecautions] = useState('');
  const [adviceMedicines, setAdviceMedicines] = useState('');

  // Calculator State
  const [calcAreaGa, setCalcAreaGa] = useState<number>(1);
  const [calcSpacing, setCalcSpacing] = useState<'3x2' | '3x3' | '4x3'>('3x2');
  const [calcSoilType, setCalcSoilType] = useState<'qumloq' | 'boz_tuproq' | 'shorxok'>('boz_tuproq');

  // Auto-advance carousel every 4.5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % LEMON_CAROUSEL_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % LEMON_CAROUSEL_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + LEMON_CAROUSEL_SLIDES.length) % LEMON_CAROUSEL_SLIDES.length);
  };

  // Calculator computations
  const treeDensityPerGa = calcSpacing === '3x2' ? 1660 : calcSpacing === '3x3' ? 1110 : 830;
  const totalTrees = Math.round(treeDensityPerGa * calcAreaGa);
  const expectedYieldKgPerTree = 35; // 3-4 yillik meyeri o'rtacha
  const totalYieldTons = Math.round((totalTrees * expectedYieldKgPerTree) / 1000 * 10) / 10;
  const estimatedRevenueMln = Math.round(totalYieldTons * 12); // 12 mln som/tonna (12,000 som/kg)
  const seedlingsCostMln = Math.round((totalTrees * 35000) / 1000000 * 10) / 10; // 35,000 som/kochat

  return (
    <div className="space-y-8 max-w-7xl mx-auto" id="lemon-academy-section">
      
      {/* Top Banner & Header */}
      <div className="bg-[#0F172A] text-white p-6 sm:p-8 rounded-xl border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 -bottom-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <span>🍋 Yozyovon Sitruschilik Klasteri Maxsus Portali</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Limonchilik Akademiyasi va Bilimlar Bazasi
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Yangi boshlovchi va tajribali dehqonlar uchun ilmiy asoslangan sitrus yetishtirish sirlari, 
              koʻchat tanlash, zararkunandalarga qarshi kurash hamda zamonaviy agrotexnologiyalar toʻplami.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('scanner')}
              className="px-4 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-md text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Sprout className="w-4 h-4" />
              <span>AI Kasallik Skaneri</span>
            </button>
            <button
              onClick={() => setActiveSection('calculator')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Hosildorlik Kalkulyatori</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. ANIMATED CAROUSEL (Limonlar va Ko'chatlar Rasmlari Karuseli) */}
      <div 
        className="relative bg-black rounded-xl overflow-hidden border border-[#E2E8F0] shadow-lg group h-[340px] sm:h-[440px]"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Slides */}
        {LEMON_CAROUSEL_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover brightness-[0.75]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-10">
                <div className="max-w-3xl space-y-2 text-white">
                  <span className="inline-block px-3 py-1 rounded-sm bg-[#3B82F6] text-white text-[11px] font-bold uppercase tracking-widest">
                    {slide.category}
                  </span>
                  <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
                    {slide.title}
                  </h2>
                  <p className="text-amber-300 text-xs sm:text-sm font-semibold">
                    {slide.subtitle}
                  </p>
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed hidden sm:block max-w-2xl">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 group-hover:opacity-100 border border-white/20"
          aria-label="Oldingi slayd"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 group-hover:opacity-100 border border-white/20"
          aria-label="Keyingi slayd"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Slide Indicators */}
        <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10">
          {LEMON_CAROUSEL_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Slayd ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. SECTION NAVIGATION TABS - Geometric Balance Slate */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-3">
        <button
          onClick={() => setActiveSection('beginner')}
          className={`px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeSection === 'beginner'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>Boshlovchilar Uchun Qoʻllanma</span>
        </button>

        <button
          onClick={() => setActiveSection('diseases')}
          className={`px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeSection === 'diseases'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Kasalliklar Katalogi & Davolash</span>
        </button>

        <button
          onClick={() => setActiveSection('pests')}
          className={`px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeSection === 'pests'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
          }`}
        >
          <Bug className="w-4 h-4 text-emerald-500" />
          <span>Zararkunandalar & Himoya</span>
        </button>

        <button
          onClick={() => setActiveSection('calculator')}
          className={`px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeSection === 'calculator'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
          }`}
        >
          <Calculator className="w-4 h-4 text-[#3B82F6]" />
          <span>Hosildorlik Kalkulyatori</span>
        </button>

        <button
          onClick={() => setActiveSection('sources')}
          className={`px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeSection === 'sources'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
          }`}
        >
          <ExternalLink className="w-4 h-4 text-purple-500" />
          <span>Ochiq Manbalar</span>
        </button>

        <button
          onClick={() => setActiveSection('farmer_advices')}
          className={`px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeSection === 'farmer_advices'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
          }`}
          id="tab-farmer-advices-btn"
        >
          <Award className="w-4 h-4 text-amber-500 fill-current" />
          <span>🏅 Tajribali Dehqonlar Tavsiyalari</span>
          <span className="bg-amber-200 text-amber-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {farmerAdvices.length}
          </span>
        </button>
      </div>

      {/* SECTION CONTENT: 1. Boshlovchilar Qo'llanmasi */}
      {activeSection === 'beginner' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Yangi Dehqonlar Uchun Sitruschilik Master-Klassi
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Xandaq qazishdan to ilk hosilni yigʻib olishgacha 6 ta asosiy agrotexnik qadam
                </p>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold rounded-md">
                Yozyovon iqlimiga 100% moslashtirilgan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {BEGINNER_GUIDE.map((step) => (
                <div 
                  key={step.step} 
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-5 flex flex-col justify-between hover:border-[#3B82F6] transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-full bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center">
                        {step.step}
                      </span>
                      <span className="text-[11px] font-semibold text-[#3B82F6] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {step.timeline}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#0F172A]">{step.title}</h4>
                    <p className="text-xs text-[#64748B] leading-relaxed">{step.summary}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] block">
                      Amaliy tavsiyalar:
                    </span>
                    {step.checklist.map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-[#334155]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Microclimate Requirements Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Thermometer className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Optimal Harorat</span>
                <p className="text-lg font-bold text-[#0F172A]">+20°C dan +26°C</p>
                <p className="text-[11px] text-[#64748B]">Qishda xandaqda +3°C dan tushmasligi shart</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Havo Namligi</span>
                <p className="text-lg font-bold text-[#0F172A]">70% — 75%</p>
                <p className="text-[11px] text-[#64748B]">Gullashda 75%, qishki tinimda 65%</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Yoritish & Soyalash</span>
                <p className="text-lg font-bold text-[#0F172A]">Tarqoq Quyosh Nuri</p>
                <p className="text-[11px] text-[#64748B]">Yozda 55% li toʻr bilan soyalash talab etiladi</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION CONTENT: 2. Kasalliklar Katalogi */}
      {activeSection === 'diseases' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Limon Daraxti va Mevasi Kasalliklari Ensiklopediyasi
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Har bir kasallikning vizual fotosuratlari, belgilari, sabablari va dori retseptlari
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {LEMON_DISEASES.map((disease) => (
                <div 
                  key={disease.id}
                  className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-xs hover:border-[#3B82F6] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img 
                        src={disease.imageUrl} 
                        alt={disease.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        disease.severity === 'high' 
                          ? 'bg-rose-600 text-white' 
                          : disease.severity === 'medium' 
                          ? 'bg-amber-500 text-white' 
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {disease.severity === 'high' ? 'Yuqori Xavf' : 'Oʻrtacha Xavf'}
                      </span>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div>
                        <h4 className="font-bold text-sm text-[#0F172A]">{disease.name}</h4>
                        <p className="text-[11px] text-[#64748B] italic">{disease.scientificName}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                          Asosiy alomatlari:
                        </span>
                        <ul className="text-xs text-[#334155] space-y-1 list-disc list-inside">
                          {disease.symptoms.slice(0, 2).map((s, idx) => (
                            <li key={idx} className="line-clamp-1">{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-2.5 bg-blue-50/60 rounded border border-blue-100 text-xs">
                        <span className="font-bold text-[#0F172A] block mb-0.5">Tavsiya etilgan dori:</span>
                        <p className="text-blue-900 line-clamp-2">{disease.treatment}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => setSelectedDisease(disease)}
                      className="w-full py-2 bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] border border-[#CBD5E1] rounded text-xs font-semibold transition-colors"
                    >
                      Batafsil maʼlumot & Davolash sxemasi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION CONTENT: 3. Zararkunandalar & Himoya */}
      {activeSection === 'pests' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Limon Issiqxonalari Zararkunandalari va Biologik / Kimyoviy Himoya
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Sitrus oqqanoti, oʻrgimchakkana, qalqondor va boshqa hasharotlarga qarshi kurash choralari
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {LEMON_PESTS.map((pest) => (
                <div 
                  key={pest.id}
                  className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-xs p-5 flex flex-col md:flex-row gap-5 items-start hover:border-[#3B82F6] transition-all"
                >
                  <div className="w-full md:w-44 h-40 rounded-md overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src={pest.imageUrl} 
                      alt={pest.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 space-y-2.5">
                    <div>
                      <h4 className="font-bold text-base text-[#0F172A]">{pest.name}</h4>
                      <p className="text-xs text-[#64748B] italic">{pest.scientificName}</p>
                    </div>

                    <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
                      <strong>Yetkazadigan zarari:</strong> {pest.damage}
                    </p>

                    <div className="space-y-1.5 text-xs text-[#334155]">
                      <p>
                        <strong className="text-emerald-700">🌱 Biologik kurash:</strong> {pest.biologicalControl}
                      </p>
                      <p>
                        <strong className="text-blue-700">🧪 Kimyoviy ishlov:</strong> {pest.chemicalControl}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION CONTENT: 4. Hosildorlik va Daromad Kalkulyatori */}
      {activeSection === 'calculator' && (
        <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs">
          <div className="pb-4 border-b border-[#E2E8F0]">
            <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#3B82F6]" />
              <span>Yozyovon Limonzori Iqtisodiy va Hosildorlik Kalkulyatori</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Ekin maydoni va sxemasiga qarab koʻchat soni, kutilayotgan hosil va daromadni aniq hisoblang
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Input Controls (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 bg-[#F8FAFC] p-5 rounded-lg border border-[#E2E8F0]">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">Parametrlarni Kiriting</h4>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Ekin Maydoni (gektar): <span className="text-[#3B82F6] font-bold">{calcAreaGa} ga</span> ({calcAreaGa * 100} sotix)
                </label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="10" 
                  step="0.1" 
                  value={calcAreaGa}
                  onChange={(e) => setCalcAreaGa(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                />
                <div className="flex justify-between text-[10px] text-[#64748B] mt-1">
                  <span>0.1 ga (10 sotix)</span>
                  <span>5 ga</span>
                  <span>10 ga</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Ekish Sxemasi (Qator orasi x Tup orasi)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '3x2', label: '3m x 2m', desc: '1,660 tup/ga' },
                    { id: '3x3', label: '3m x 3m', desc: '1,110 tup/ga' },
                    { id: '4x3', label: '4m x 3m', desc: '830 tup/ga' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setCalcSpacing(opt.id as any)}
                      className={`p-2.5 rounded border text-left transition-all ${
                        calcSpacing === opt.id 
                          ? 'border-[#3B82F6] bg-blue-50 text-[#0F172A] font-bold ring-1 ring-[#3B82F6]' 
                          : 'border-[#CBD5E1] bg-white text-[#64748B]'
                      }`}
                    >
                      <span className="block text-xs">{opt.label}</span>
                      <span className="block text-[10px] text-[#64748B] font-normal">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Tuproq Turi (Yozyovon)</label>
                <select
                  value={calcSoilType}
                  onChange={(e) => setCalcSoilType(e.target.value as any)}
                  className="w-full p-2 border border-[#CBD5E1] rounded-md bg-white text-xs text-[#0F172A]"
                >
                  <option value="boz_tuproq">Boʻz tuproq (Eng yaxshi unumdorlik)</option>
                  <option value="qumloq">Qumloq tuproq (Yengil, qoʻshimcha goʻng talab etadi)</option>
                  <option value="shorxok">Oʻrtacha shoʻrlangan (Drenaj va yuvish zarur)</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  Agrotexnik eslatma:
                </span>
                <p className="text-[11px] leading-relaxed">
                  Hisob-kitob 3 yillik hosilga kirgan Meyeri navi asosida 1 tupdan oʻrtacha 35 kg hosil va bozor narxi 12 000 soʻm/kg boʻyicha olingan.
                </p>
              </div>
            </div>

            {/* Results Display (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">Hisoblangan Natijalar</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Jami Koʻchatlar Soni</span>
                  <div className="text-2xl font-bold text-[#0F172A] mt-1">{totalTrees.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">tup</span></div>
                  <p className="text-[11px] text-[#64748B] mt-1">Koʻchat sotib olish: ~{seedlingsCostMln} mln soʻm</p>
                </div>

                <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Mavsumiy Hosil Prognozi</span>
                  <div className="text-2xl font-bold text-[#3B82F6] mt-1">{totalYieldTons.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">tonna</span></div>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">3-mavsum toʻliq hosili</p>
                </div>

                <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] col-span-2">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Kutilayotgan Yalpi Daromad</span>
                  <div className="text-3xl font-bold text-emerald-600 mt-1">
                    ~{estimatedRevenueMln.toLocaleString()} <span className="text-sm font-normal text-[#64748B]">mln soʻm</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1.5">
                    Ichki bozor va eksport narxlari asosida (oʻrtacha 12 000 soʻm/kg). Xandaq xarajatlari oʻzini 2-yildan toʻliq qoplaydi.
                  </p>
                </div>
              </div>

              {/* Resource Requirements breakdown */}
              <div className="p-4 bg-white rounded-lg border border-[#E2E8F0] space-y-3">
                <span className="font-bold text-xs text-[#0F172A] uppercase tracking-wider block">
                  Kerakli resurslar (Yillik meʼyor):
                </span>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[#64748B] block text-[10px]">Tomchilatib suv</span>
                    <strong className="text-[#0F172A]">{(calcAreaGa * 4500).toLocaleString()} m³</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[#64748B] block text-[10px]">Chirigan goʻng</span>
                    <strong className="text-[#0F172A]">{calcAreaGa * 40} tonna</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[#64748B] block text-[10px]">Mineral oʻgʻit (NPK)</span>
                    <strong className="text-[#0F172A]">{calcAreaGa * 600} kg</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION CONTENT: 5. Ochiq Manbalar & Standartlar */}
      {activeSection === 'sources' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs">
            <div className="pb-4 border-b border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#0F172A]">
                Internetdagi Ochiq Manbalar va Agrotexnik Standartlar
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Sitruschilik boʻyicha rasmiy davlat qarorlari, ilmiy-amaliy qoʻllanmalar va videodarslar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {[
                {
                  title: 'Oʻzbekiston Respublikasi Qishloq xoʻjaligi vazirligi qoʻllanmasi',
                  desc: 'Sitrus mevalarini issiqxona va xandaqlarda yetishtirish agrotexnologiyasi.',
                  source: 'agro.uz / Ilmiy nashrlar',
                  link: 'https://agro.uz'
                },
                {
                  title: 'Yozyovon Limon Klasteri Standartlari',
                  desc: 'Meyeri va Toshkent navlarini kalibrlash, qadoqlash hamda EAEU standartlari talablari.',
                  source: 'Fargʻona agro-eksport inspeksiyasi',
                  link: 'https://stat.uz'
                },
                {
                  title: 'Sitrus kasalliklariga qarshi kurash boʻyicha FAO yoʻriqnomasi',
                  desc: 'Birlashgan Millatlar Tashkilotining Oziq-ovqat va qishloq xoʻjaligi tashkiloti (FAO) tavsiyalari.',
                  source: 'FAO Citrus Crop Protection Guide',
                  link: 'https://www.fao.org'
                },
                {
                  title: 'Tomchilatib sugʻorish va suv tejash texnologiyalari',
                  desc: 'Qumloq va boʻz tuproqlarda suv sarfini 50% ga kamaytirish usullari.',
                  source: 'Suv xoʻjaligi vazirligi metodikasi',
                  link: 'https://water.gov.uz'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2 hover:border-[#3B82F6] transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-[#0F172A]">{item.title}</h4>
                    <ExternalLink className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
                  <span className="text-[10px] text-[#3B82F6] font-semibold block">{item.source}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION CONTENT: 6. TAJRIBALI DEHQONLAR TAVSIYALARI (DAVLAT NISHONLI DEHQONLAR) */}
      {activeSection === 'farmer_advices' && (
        <div className="space-y-6">
          
          {/* Section Header with Authority Info */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-6 rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                <Award className="w-3.5 h-3.5 fill-current" />
                <span>Yozyovon Tuman Qishloq Xoʻjaligi Boshqarmasi Tasdigʻi</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Koʻp Yillik Tajribaga Ega Usta Dehqonlar Amaliy Tavsiyalari
              </h3>
              <p className="text-amber-100 text-xs leading-relaxed">
                Ushbu boʻlimdagi barcha koʻrsatmalar davlat organlari tomonidan maxsus tasdiq nishoni berilgan, 
                Yozyovon iqlimida 10-30 yildan ortiq vaqt davomida yuqori hosil olgan mirishkor dehqonlar tomonidan yozilgan.
              </p>
            </div>

            {/* If current user has badge AND is logged in, show Add Advice button */}
            {isLoggedIn && currentUser.hasExperienceBadge ? (
              <div className="bg-white text-slate-900 p-4 rounded-lg shadow-lg border border-amber-300 text-center min-w-[220px]">
                <div className="flex items-center justify-center gap-1 text-amber-600 font-bold text-xs mb-1">
                  <Award className="w-4 h-4 fill-current" />
                  <span>Siz Tasdiqlangan Dehqonsiz</span>
                </div>
                <div className="text-[11px] text-slate-600 mb-2.5 font-medium">
                  {currentUser.experienceYears || 15} yillik tajriba egasi
                </div>
                <button
                  onClick={() => setShowNewAdviceModal(true)}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  id="open-add-advice-modal-btn"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tavsiya Qoʻshish</span>
                </button>
              </div>
            ) : (
              <div className="bg-black/25 backdrop-blur-xs p-4 rounded-lg border border-white/20 text-center min-w-[220px]">
                <div className="text-2xl font-black text-amber-300">
                  {farmerAdvices.length} ta
                </div>
                <div className="text-xs text-amber-100 font-semibold uppercase tracking-wider mt-0.5">
                  Rasmiy Tavsiyalar
                </div>
                <div className="text-[10px] text-amber-200/90 mt-1">
                  Oltin nishonli dehqonlardan
                </div>
              </div>
            )}
          </div>

          {/* Non-badged farmer friendly note */}
          {(!isLoggedIn || !currentUser.hasExperienceBadge) && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 text-xs">
              <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 fill-current" />
              <div className="space-y-1 text-amber-900">
                <span className="font-bold block">
                  Koʻp yillik tajribangiz bormi va oʻz koʻrsatmalaringizni qoʻshmoqchimisiz?
                </span>
                <p className="text-amber-800 leading-relaxed">
                  Yozyovon tuman qishloq xoʻjaligi boʻlimi tomonidan koʻp yillik tajribaga ega dehqonlarga beriladigan davlat tasdiq nishonini olganingizdan soʻng, siz ham ushbu akademiyaga oʻz shaxsiy tavsiyalaringizni kiritish vakolatiga ega boʻlasiz.
                </p>
              </div>
            </div>
          )}

          {/* Farmer Advices List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {farmerAdvices.map((advice) => (
              <div 
                key={advice.id}
                className="bg-white rounded-lg border border-amber-200/70 p-5 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Farmer header with verified badge */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                        {advice.farmerName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#0F172A] flex items-center gap-1.5">
                          <span>{advice.farmerName}</span>
                          <span title="Davlat tomonidan tasdiqlangan tajribali dehqon">
                            <Award className="w-4 h-4 text-amber-500 fill-current" />
                          </span>
                        </div>
                        <div className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                          <span>{advice.experienceYears} yillik Tajribali Dehqon ({advice.mfyName})</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {advice.createdAt}
                    </span>
                  </div>

                  {/* Title & Category Badge */}
                  <div>
                    <div className="inline-block px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold uppercase rounded mb-1.5">
                      {advice.category}
                    </div>
                    <h4 className="font-bold text-base text-[#0F172A] leading-snug">
                      {advice.title}
                    </h4>
                  </div>

                  {/* Main Advice Text */}
                  <div className="text-xs text-[#334155] leading-relaxed bg-[#F8FAFC] p-3.5 rounded-md border border-slate-200">
                    <p className="whitespace-pre-line">{advice.content}</p>
                  </div>

                  {/* Medicines / Remedies if any */}
                  {advice.medicines && (
                    <div className="text-xs bg-blue-50 border border-blue-200 p-3 rounded-md text-blue-950">
                      <strong className="text-blue-900 block mb-1">🧪 Qoʻllaniladigan usul va dorilar:</strong>
                      <span>{advice.medicines}</span>
                    </div>
                  )}

                  {/* Precautions if any */}
                  {advice.precautions && (
                    <div className="text-xs bg-rose-50 border border-rose-200 p-3 rounded-md text-rose-950">
                      <strong className="text-rose-900 block mb-1">⚠️ Ehtiyot choralari:</strong>
                      <span>{advice.precautions}</span>
                    </div>
                  )}
                </div>

                {/* Footer: Like / Helpful Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Limonchilik Qoʻllanmasi rasmiy tavsiyasi
                  </span>

                  <button
                    onClick={() => toggleLikeAdvice(advice.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-semibold rounded-md border border-slate-200 hover:border-amber-300 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                    <span>Foydali ({advice.likes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* If no advices yet */}
          {farmerAdvices.length === 0 && (
            <div className="bg-white p-8 rounded-lg border border-slate-200 text-center space-y-2">
              <Award className="w-8 h-8 text-amber-500 mx-auto fill-current" />
              <h4 className="font-bold text-sm text-slate-800">Hozircha dehqon tavsiyalari yoʻq</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Davlat organlari tomonidan tasdiq nishoni berilgan dehqonlar ushbu boʻlimga oʻz koʻrsatmalarini qoʻshishlari mumkin.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add New Farmer Advice Modal */}
      {showNewAdviceModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl border border-[#E2E8F0] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500 fill-current" />
                <h3 className="font-bold text-sm text-[#0F172A] uppercase">
                  Limonchilik Qoʻllanmasiga Amaliy Tavsiya Qoʻshish
                </h3>
              </div>
              <button 
                onClick={() => setShowNewAdviceModal(false)}
                className="text-[#64748B] hover:text-[#0F172A]"
              >
                ✕
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-xs text-amber-900">
              Muallif: <strong>{currentUser.name}</strong> (Tasdiqlangan dehqon, {currentUser.experienceYears || 15} yillik tajriba)
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!adviceTitle.trim() || !adviceContent.trim()) return;

                const mfy = mfyList.find(m => m.id === currentUser.mfyId);
                addFarmerAdvice({
                  farmerId: currentUser.id,
                  farmerName: currentUser.name,
                  mfyName: mfy ? mfy.name : 'Yozyovon MFY',
                  experienceYears: currentUser.experienceYears || 15,
                  badgeTitle: currentUser.badgeTitle || 'Davlat tomonidan tasdiqlangan tajribali dehqon',
                  title: adviceTitle.trim(),
                  category: adviceCategory,
                  content: adviceContent.trim(),
                  precautions: advicePrecautions.trim() || undefined,
                  medicines: adviceMedicines.trim() || undefined
                });

                setAdviceTitle('');
                setAdviceContent('');
                setAdvicePrecautions('');
                setAdviceMedicines('');
                setShowNewAdviceModal(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#334155] mb-1">
                  Tavsiya Mavzusi / Sarlavhasi *
                </label>
                <input
                  type="text"
                  required
                  value={adviceTitle}
                  onChange={(e) => setAdviceTitle(e.target.value)}
                  placeholder="Masalan: Bahorgi sovuqdan himoyalashning eng samarali usuli"
                  className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC] font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#334155] mb-1">
                  Kategoriya / Yoʻnalish
                </label>
                <select
                  value={adviceCategory}
                  onChange={(e) => setAdviceCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC]"
                >
                  <option value="parvarish">Agrotexnik Parvarish</option>
                  <option value="qishlash">Qishlash va Sovuqdan Saqlash</option>
                  <option value="sugorish">Sugʻorish va Oziqlantirish</option>
                  <option value="kasallik">Kasallik va Zararkunandalarga Qarshi Kurash</option>
                  <option value="hosildorlik">Hosildorlikni Oshirish Usullari</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#334155] mb-1">
                  Batafsil Tavsiya va Amaliy Koʻrsatma *
                </label>
                <textarea
                  rows={4}
                  required
                  value={adviceContent}
                  onChange={(e) => setAdviceContent(e.target.value)}
                  placeholder="Oʻz tajribangizdan kelib chiqib, aniq qadamlar, muddatlar va bajarilishi kerak boʻlgan ishlarni batafsil yozing..."
                  className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#334155] mb-1">
                  Tavsiya qilinadigan oʻgʻit / preparat / dori (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={adviceMedicines}
                  onChange={(e) => setAdviceMedicines(e.target.value)}
                  placeholder="Masalan: 1% li Bordo suyuqligi, chirindi oʻgʻit"
                  className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#334155] mb-1">
                  Ehtiyot choralari (nimalardan saqlanish kerak)
                </label>
                <input
                  type="text"
                  value={advicePrecautions}
                  onChange={(e) => setAdvicePrecautions(e.target.value)}
                  placeholder="Masalan: Harorat +5 darajadan past boʻlganda purkash mumkin emas"
                  className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewAdviceModal(false)}
                  className="px-4 py-2 border border-[#CBD5E1] text-[#64748B] font-semibold rounded-md hover:bg-[#F8FAFC]"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-md shadow-xs flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4 fill-current" />
                  <span>Qoʻllanmaga Eʼlon Qilish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disease Detail Modal */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-base text-[#0F172A]">{selectedDisease.name}</h3>
                <p className="text-xs text-[#64748B] italic">{selectedDisease.scientificName}</p>
              </div>
              <button 
                onClick={() => setSelectedDisease(null)}
                className="text-[#64748B] hover:text-[#0F172A] p-1 rounded hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="h-52 w-full rounded-md overflow-hidden bg-slate-100">
              <img 
                src={selectedDisease.imageUrl} 
                alt={selectedDisease.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-3 text-xs text-[#334155]">
              <div>
                <strong className="text-[#0F172A] block mb-1">Kasallik belgilari:</strong>
                <ul className="list-disc list-inside space-y-1">
                  {selectedDisease.symptoms.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-[#0F172A] block mb-1">Kelib chiqish sabablari:</strong>
                <p className="text-[#64748B] leading-relaxed">{selectedDisease.causes}</p>
              </div>

              <div>
                <strong className="text-emerald-700 block mb-1">Profilaktika va oldini olish:</strong>
                <p className="text-[#64748B] leading-relaxed">{selectedDisease.prevention}</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <strong className="text-blue-900 block mb-1">🧪 Davolash va Dori Tavsiyasi:</strong>
                <p className="text-blue-950 font-medium leading-relaxed">{selectedDisease.treatment}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
              <button
                onClick={() => setSelectedDisease(null)}
                className="px-4 py-2 bg-[#0F172A] text-white rounded text-xs font-semibold"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
