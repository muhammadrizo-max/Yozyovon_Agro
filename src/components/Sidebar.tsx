import React from 'react';
import { 
  X, 
  Sprout, 
  Layers, 
  ScanLine, 
  BookOpen, 
  Sun, 
  Moon, 
  BarChart3, 
  ShieldCheck, 
  LogOut, 
  User, 
  CheckCircle2, 
  CloudSun,
  Bell,
  Sparkles,
  ExternalLink,
  Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenAuth }) => {
  const { 
    currentUser, 
    userRole, 
    activeTab, 
    setActiveTab, 
    selectMfy, 
    isDarkMode, 
    toggleDarkMode, 
    logout,
    currentMfyWeather,
    siteSettings
  } = useApp();

  if (!isOpen) return null;

  const handleNav = (tab: string, mfyId: number | null = null) => {
    selectMfy(mfyId);
    setActiveTab(tab);
    onClose();
  };

  const navItems = [
    {
      id: 'profile',
      label: 'Mening Xoʻjaligim',
      desc: 'Ekinlar, chorva, tomorqa va faoliyat',
      icon: Sprout,
      color: 'text-emerald-600 dark:text-emerald-400',
      activeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
    },
    {
      id: 'map',
      label: '32 MFY Interaktiv Xaritasi',
      desc: 'Yozyovon tumani mahallalari va fermerlar',
      icon: Layers,
      color: 'text-blue-600 dark:text-blue-400',
      activeBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
    },
    {
      id: 'scanner',
      label: 'AI Agro-Skaner (Kamera)',
      desc: 'Kasalliklar va zararkunandalar tahlili',
      icon: ScanLine,
      color: 'text-indigo-600 dark:text-indigo-400',
      activeBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
    },
    {
      id: 'lemon_guide',
      label: 'Limonchilik Qoʻllanmasi',
      desc: 'Sitrus yetishtirish va parvarish sirlari',
      icon: BookOpen,
      color: 'text-amber-500 dark:text-amber-400',
      activeBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
    },
    {
      id: 'weather_market',
      label: 'Agro-Ob-havo & Bozor',
      desc: 'Tomorrow.io API va Yozyovon narxlari',
      icon: Sun,
      color: 'text-amber-600 dark:text-amber-400',
      activeBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
    },
    {
      id: 'statistics',
      label: 'Tuman Statistikasi',
      desc: 'Sitrus, chorva va ekinlar koʻrsatkichlari',
      icon: BarChart3,
      color: 'text-cyan-600 dark:text-cyan-400',
      activeBg: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800'
    },
    {
      id: 'gov_hub',
      label: 'Davlat Boshqaruv Markazi',
      desc: 'Monitoring, subsidiyalar va sertifikatlar',
      icon: ShieldCheck,
      color: 'text-slate-700 dark:text-slate-300',
      activeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex" id="app-sidebar-drawer">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 h-full flex flex-col justify-between shadow-2xl border-r border-[#E2E8F0] dark:border-slate-800 z-10 animate-in slide-in-from-left duration-200">
        
        {/* Top Header */}
        <div>
          <div className="p-4 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between bg-[#F8FAFC] dark:bg-slate-950">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#3B82F6] rounded-xs rotate-45 flex items-center justify-center shadow-xs shrink-0">
                <div className="w-4 h-4 bg-white -rotate-45 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#3B82F6]"></div>
                </div>
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-[#0F172A] dark:text-white">
                  YOZYOVON <span className="text-[#3B82F6]">AGRO</span>
                </span>
                <span className="text-[10px] text-[#64748B] dark:text-slate-400 block font-medium">
                  Navigatsiya Menyusi
                </span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-md text-[#64748B] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              id="sidebar-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card inside Sidebar */}
          <div className="p-4 border-b border-[#E2E8F0] dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'D'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                    {currentUser.name}
                  </h4>
                  {currentUser.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-slate-400 truncate mt-0.5">
                  {currentUser.phone || currentUser.email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    {userRole === 'admin' ? 'Dasturchi' : userRole === 'davlat' ? 'Davlat inspektori' : 'Dehqon'}
                  </span>
                  <span className="text-[10px] text-[#64748B] dark:text-slate-400 truncate">
                    MFY #{currentUser.mfyId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <div className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-290px)] custom-scrollbar">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] dark:text-slate-500 px-3 py-1 block">
              Tizim Boʻlimlari
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all ${
                    isActive 
                      ? `${item.activeBg} font-bold shadow-xs` 
                      : 'border-transparent text-[#334155] dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800/80 hover:border-[#E2E8F0] dark:hover:border-slate-700'
                  }`}
                  id={`sidebar-nav-${item.id}`}
                >
                  <div className={`p-1.5 rounded-md ${isActive ? 'bg-white dark:bg-slate-900 shadow-xs' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs tracking-tight truncate">{item.label}</p>
                    <p className="text-[10px] text-[#64748B] dark:text-slate-400 truncate mt-0.5 font-normal">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer actions inside Sidebar */}
        <div className="p-4 border-t border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950 space-y-2.5">
          
          {/* Quick Weather and Theme toggle */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <div className="text-[11px]">
                <span className="font-bold text-[#0F172A] dark:text-white">{currentMfyWeather.temp}°C</span>
                <span className="text-[#64748B] dark:text-slate-400 text-[10px] ml-1">Tomorrow.io</span>
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1 px-2 py-1 rounded bg-[#F1F5F9] dark:bg-slate-800 text-xs font-semibold text-[#0F172A] dark:text-white border border-[#E2E8F0] dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              id="sidebar-theme-toggle"
              title="Mavzuni almashtirish"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span className="text-[10px]">{isDarkMode ? 'Yorugʻ' : 'Qorongʻu'}</span>
            </button>
          </div>

          {/* Login or Switch Account */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { onOpenAuth('login'); onClose(); }}
              className="w-full py-2 px-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#3B82F6] dark:text-blue-300 font-bold rounded-md text-xs text-center border border-blue-200 dark:border-blue-900 transition-colors"
              id="sidebar-login-btn"
            >
              Tizimga Kirish
            </button>
            <button
              onClick={() => { onOpenAuth('register'); onClose(); }}
              className="w-full py-2 px-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold rounded-md text-xs text-center border border-emerald-200 dark:border-emerald-900 transition-colors"
              id="sidebar-register-btn"
            >
              Roʻyxatdan Oʻtish
            </button>
          </div>

          {/* Logout button */}
          <button
            onClick={() => { logout(); onClose(); }}
            className="w-full py-2 px-3 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
            id="sidebar-logout-btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Tizimdan Chiqish</span>
          </button>
        </div>

      </div>
    </div>
  );
};
