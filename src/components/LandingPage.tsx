import React, { useState } from 'react';
import {
  Sprout,
  MapPin,
  LogIn,
  UserPlus,
  Sparkles,
  ShieldCheck,
  Sun,
  ChevronRight,
  Leaf,
  BarChart3,
  Cpu,
  Globe,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { AuthModal } from './AuthModal';

interface LandingPageProps {
  onEnterAsGuest: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterAsGuest }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const features = [
    {
      icon: <MapPin className="w-5 h-5" />,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      title: '32 MFY Interaktiv Xaritasi',
      desc: 'Haqiqiy tuman kadastr chegaralari asosida tuzilgan interaktiv xarita. Har bir MFY haqida batafsil ma\'lumot.',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      title: 'Limonchilik Qo\'llanmasi',
      desc: 'Kasalliklarni AI orqali aniqlash, tajribali dehqonlar tavsiyalari va agrotexnik ko\'rsatmalar.',
    },
    {
      icon: <Sun className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
      title: 'Agro Ob-havo & Bozor',
      desc: 'Mahalliy harorat, sug\'orish tavsiyalari, Yozyovon bozor narxlari va 7 kunlik prognoz.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
      title: 'Davlat Monitoringi',
      desc: 'Subsidiyalar, fitosanitariya xavfsizligi tizimi va eksport sertifikatlari boshqaruvi.',
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
      title: 'AI Kasallik Skaneri',
      desc: 'Rasm orqali limon daraxtlari kasalligini aniqlash va darhol davolash tavsiyalari olish.',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800',
      title: 'Statistika & Tahlil',
      desc: 'Tuman bo\'yicha agrar ko\'rsatkichlar, 12 oylik dinamika va eksport hajmlari.',
    },
  ];

  const stats = [
    { value: '32', label: 'MFY', sub: 'Yozyovon tumani' },
    { value: '580+', label: 'Fermer', sub: 'Faol foydalanuvchi' },
    { value: '185K+', label: 'Limon', sub: 'Daraxt monitoringi' },
    { value: '14K+', label: 'ga', sub: 'Qishloq xo\'jaligi' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] dark:bg-slate-950 text-[#1E293B] dark:text-slate-100">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#3B82F6] rounded flex items-center justify-center rotate-45 shadow">
              <div className="w-3.5 h-3.5 bg-white -rotate-45" />
            </div>
            <span className="font-black text-base tracking-tight text-[#0F172A] dark:text-white">
              YOZYOVON <span className="text-[#3B82F6]">AGRO</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 uppercase tracking-wider ml-1">
              Monitoring
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEnterAsGuest}
              className="hidden sm:flex px-3 py-1.5 text-xs font-semibold text-[#64748B] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white transition-colors"
            >
              Mehmon sifatida ko'rish
            </button>
            <button
              onClick={() => openAuth('login')}
              className="px-3 py-1.5 text-xs font-bold bg-[#0F172A] dark:bg-slate-700 text-white rounded hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              Kirish
            </button>
            <button
              onClick={() => openAuth('register')}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ro'yxatdan o'tish</span>
              <span className="sm:hidden">Ro'yxat</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#0F172A] via-[#1e3a5f] to-[#0c4a2e] text-white overflow-hidden">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold tracking-wider uppercase text-emerald-300 mb-5">
              <Leaf className="w-3.5 h-3.5" />
              Farg'ona Viloyati • Yozyovon Tumani
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Yozyovon Agrosanoat va<br />
              <span className="text-[#3B82F6]">Limonchilik Klasteri</span><br />
              Raqamli Portali
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              32 ta MFY bo'yicha yagona monitoring tizimi. Interaktiv xarita, AI kasallik skaneri,
              ob-havo ma'lumotlari, davlat subsidiyalari va tajribali dehqonlar tavsiyalari — barchasi bir platformada.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => openAuth('register')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded text-sm transition-all shadow-lg flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Tizimga Ro'yxatdan O'tish
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openAuth('login')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded text-sm transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Tizimga Kirish
              </button>
              <button
                onClick={onEnterAsGuest}
                className="px-6 py-3 text-slate-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                Mehmon sifatida ko'rish →
              </button>
            </div>
          </div>
        </div>
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#F1F5F9] dark:bg-slate-950" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </section>

      {/* ── STATS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-1 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded p-4 text-center shadow-sm">
              <p className="text-2xl font-black text-[#3B82F6]">{s.value}</p>
              <p className="text-sm font-bold text-[#0F172A] dark:text-white">{s.label}</p>
              <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white">
            Tizim Imkoniyatlari
          </h2>
          <p className="text-sm text-[#64748B] dark:text-slate-400 mt-2">
            Yozyovon tumani dehqonlari va davlat organlari uchun zamonaviy agrar platforma
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className={`p-4 rounded-lg border ${f.color} flex items-start gap-3`}>
              <div className={`p-2 rounded-lg ${f.color} shrink-0`}>
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-[#0F172A] dark:text-white text-sm">{f.title}</p>
                <p className="text-[12px] text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section className="bg-white dark:bg-slate-900 border-y border-[#E2E8F0] dark:border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-black text-[#0F172A] dark:text-white text-center mb-6">Kim uchun?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                role: 'Dehqonlar',
                icon: <Sprout className="w-6 h-6 text-emerald-600" />,
                points: [
                  'Shaxsiy issiqxona va hosil monitoringi',
                  'AI orqali kasallik aniqlash',
                  'Ob-havo va sug\'orish tavsiyalari',
                  'Davlat subsidiyalariga ariza',
                ],
              },
              {
                role: 'Davlat Organlari',
                icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
                points: [
                  '32 MFY bo\'yicha umumiy ko\'rsatkichlar',
                  'Fitosanitariya nazorati',
                  'Subsidiya arizalarini boshqarish',
                  'Eksport sertifikatlari tizimi',
                ],
              },
              {
                role: 'Tuman Rahbariyati',
                icon: <Globe className="w-6 h-6 text-blue-600" />,
                points: [
                  'Real-vaqt agrar statistika',
                  'MFY bo\'yicha solishtirma tahlil',
                  'Zararkunanda ogohlantirish tizimi',
                  'Yillik dinamika va prognozlar',
                ],
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#F8FAFC] dark:bg-slate-800/60 border border-[#E2E8F0] dark:border-slate-700 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  {item.icon}
                  <h3 className="font-black text-[#0F172A] dark:text-white">{item.role}</h3>
                </div>
                <ul className="space-y-2">
                  {item.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-[#475569] dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-xl p-8 text-white shadow-lg">
          <h2 className="text-xl sm:text-2xl font-black mb-2">Hoziroq Boshlang</h2>
          <p className="text-sm text-emerald-100 mb-6 max-w-lg mx-auto">
            Shaxsiy issiqxonangizni ro'yxatdan o'tkazing yoki tuman monitoringini to'liq boshqaring.
            Bepul va Yozyovon fermerlari uchun maxsus.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => openAuth('register')}
              className="px-6 py-3 bg-white text-emerald-800 hover:bg-emerald-50 font-black rounded text-sm transition-all shadow flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Ro'yxatdan O'tish — Bepul
            </button>
            <button
              onClick={() => openAuth('login')}
              className="px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/40 text-white font-bold rounded text-sm transition-all flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Kirish
            </button>
          </div>
          <button
            onClick={onEnterAsGuest}
            className="mt-4 text-emerald-200 hover:text-white text-xs transition-colors"
          >
            Yoki mehmon sifatida davom etish →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0F172A] border-t border-slate-800 py-6 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#3B82F6] rounded rotate-45 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white -rotate-45" />
              </div>
              <span className="font-bold text-white text-sm">YOZYOVON AGRO</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-slate-500">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>+998 (73) 502-12-34</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>info@yozyovon-agro.uz</span>
              </div>
            </div>
          </div>
          <p>© 2026 Yozyovon Tumani QX Boshqarmasi</p>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};
