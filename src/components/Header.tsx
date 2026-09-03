import React, { useState, useRef, useEffect } from 'react';
import { 
  Sprout, 
  MapPin, 
  Bell, 
  User, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Layers, 
  ScanLine, 
  BarChart3, 
  TrendingUp, 
  LogOut, 
  Menu, 
  X,
  FileSpreadsheet,
  AlertTriangle,
  ChevronDown,
  BookOpen,
  CheckCircle2,
  Settings,
  Key,
  Terminal,
  Lock,
  Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Sidebar } from './Sidebar';

interface HeaderProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth }) => {
  const { 
    currentUser, 
    userRole, 
    activeTab, 
    setActiveTab, 
    switchRole, 
    currentMfyWeather, 
    notifications,
    markNotificationAsRead,
    selectMfy,
    verificationBanner,
    dismissVerificationBanner,
    verifyEmailToken,
    isDarkMode,
    toggleDarkMode,
    setIsDevModalOpen,
    logout,
    siteSettings,
    isSidebarOpen,
    setIsSidebarOpen
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Close notifications and profile dropdown when clicking outside or tapping anywhere else on screen
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(target)) {
        setIsRoleDropdownOpen(false);
      }
    };

    if (isNotifOpen || isRoleDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isNotifOpen, isRoleDropdownOpen]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-[#E2E8F0] dark:border-slate-800 shadow-xs transition-colors duration-200" id="app-header">
      
      {/* Verification Notice Banner (If just registered) */}
      {verificationBanner && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 max-w-4xl truncate">
            <span className="bg-slate-950 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
              Email Tasdiqlash
            </span>
            <span className="truncate">
              <strong>{verificationBanner.email}</strong> manziliga tasdiqlash linki yuborildi. Hisobni faollashtirish uchun havolani bosing:
            </span>
            <button
              onClick={() => verifyEmailToken(verificationBanner.token)}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-white rounded text-[11px] font-bold shrink-0 transition-colors"
            >
              ✓ Hisobni Tasdiqlash
            </button>
          </div>
          <button
            onClick={dismissVerificationBanner}
            className="p-1 text-slate-950 hover:text-white"
            title="Yopish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-17">
          
          {/* Logo, Brand and Universal Sidebar Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 hover:bg-[#F1F5F9] dark:hover:bg-slate-700 text-[#0F172A] dark:text-white flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              id="header-sidebar-trigger-btn"
              title="Boʻlimlarni almashtirish menyusi (Sidebar)"
            >
              <Menu className="w-5 h-5 text-[#3B82F6]" />
              <span className="text-xs font-bold hidden lg:inline">Boʻlimlar</span>
            </button>

            <button 
              onClick={() => {
                selectMfy(null);
                if (userRole === 'admin') {
                  setIsDevModalOpen(true);
                } else if (userRole === 'davlat') {
                  setActiveTab('gov_hub');
                } else {
                  setActiveTab('profile');
                }
              }}
              className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-hidden"
              id="brand-logo-btn"
            >
              <div className="w-8 h-8 bg-[#3B82F6] rounded-xs rotate-45 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0">
                <div className="w-4 h-4 bg-white -rotate-45 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#3B82F6]"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
                    {siteSettings?.siteName ? siteSettings.siteName.split(' ')[0] : 'YOZYOVON'}
                  </span>
                  <span className="text-xl font-bold tracking-tight text-[#3B82F6]">
                    {siteSettings?.siteName && siteSettings.siteName.split(' ').length > 1 ? siteSettings.siteName.split(' ').slice(1).join(' ') : 'AGRO'}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-xs bg-[#F1F5F9] dark:bg-slate-800 text-[#64748B] dark:text-slate-300 uppercase tracking-wider border border-[#E2E8F0] dark:border-slate-700 ml-1.5">v2.5</span>
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-slate-400 font-medium hidden sm:block">
                  {siteSettings?.siteTagline || 'Dehqonchilik & Sitruschilik Portali'}
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links based on role */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            {userRole === 'admin' ? (
              <>
                <button
                  id="nav-admin-console"
                  onClick={() => setIsDevModalOpen(true)}
                  className="pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 border-emerald-500 font-bold"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Dasturchi Konsoli</span>
                </button>
                <button
                  id="nav-gov-hub"
                  onClick={() => { selectMfy(null); setActiveTab('gov_hub'); }}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'gov_hub' 
                      ? 'text-[#3B82F6] border-[#3B82F6]' 
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-[#3B82F6]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Boshqaruv Markazi</span>
                </button>
                <button
                  id="nav-gov-map"
                  onClick={() => { selectMfy(null); setActiveTab('map'); }}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'map' 
                      ? 'text-[#3B82F6] border-[#3B82F6]' 
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-[#3B82F6]'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>32 MFY Xaritasi</span>
                </button>
                <button
                  id="nav-farmer-lemon-guide"
                  onClick={() => setActiveTab('lemon_guide')}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'lemon_guide' 
                      ? 'text-amber-600 border-amber-500 font-bold' 
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-amber-600'
                  }`}
                >
                  <span>🍋 Limon Qoʻllanmasi</span>
                </button>
              </>
            ) : userRole === 'davlat' ? (
              <>
                <button
                  id="nav-gov-hub"
                  onClick={() => { selectMfy(null); setActiveTab('gov_hub'); }}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'gov_hub' 
                      ? 'text-[#3B82F6] border-[#3B82F6]' 
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-[#3B82F6]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Boshqaruv Markazi</span>
                </button>
                <button
                  id="nav-gov-map"
                  onClick={() => { selectMfy(null); setActiveTab('map'); }}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'map' 
                      ? 'text-[#3B82F6] border-[#3B82F6]' 
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-[#3B82F6]'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>32 MFY Xaritasi</span>
                </button>
                <button
                  id="nav-gov-stats"
                  onClick={() => { selectMfy(null); setActiveTab('statistics'); }}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'statistics' 
                      ? 'text-[#3B82F6] border-[#3B82F6]' 
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-[#3B82F6]'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Statistika</span>
                </button>
                <button
                  id="nav-gov-weather"
                  onClick={() => setActiveTab('weather_market')}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'weather_market' 
                      ? 'text-[#3B82F6] border-[#3B82F6]' 
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-[#3B82F6]'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Agro-Ob-havo</span>
                </button>
              </>
            ) : (
              <>
                <button
                  id="nav-farmer-profile"
                  onClick={() => setActiveTab('profile')}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'profile' 
                      ? 'text-[#3B82F6] border-[#3B82F6]' 
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-[#3B82F6]'
                  }`}
                >
                  <Sprout className="w-4 h-4" />
                  <span>Mening Xoʻjaligim</span>
                </button>
                <button
                  id="nav-farmer-lemon-guide"
                  onClick={() => setActiveTab('lemon_guide')}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'lemon_guide' 
                      ? 'text-amber-600 border-amber-500 font-bold' 
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-amber-600'
                  }`}
                >
                  <span>🍋 Limon Qoʻllanmasi</span>
                </button>
                <button
                  id="nav-farmer-scanner"
                  onClick={() => setActiveTab('scanner')}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'scanner' 
                      ? 'text-[#3B82F6] border-[#3B82F6]' 
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-[#3B82F6]'
                  }`}
                >
                  <ScanLine className="w-4 h-4" />
                  <span>AI Skaner</span>
                </button>
                <button
                  id="nav-farmer-map"
                  onClick={() => { selectMfy(null); setActiveTab('map'); }}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'map' 
                      ? 'text-[#3B82F6] border-[#3B82F6]' 
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-[#3B82F6]'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>MFY Xaritasi</span>
                </button>
                <button
                  id="nav-farmer-weather"
                  onClick={() => setActiveTab('weather_market')}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'weather_market' 
                      ? 'text-[#3B82F6] border-[#3B82F6]' 
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-[#3B82F6]'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Agro-Ob-havo & Bozor</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action Icons & Profile Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Dark / Light Mode Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleDarkMode}
              className="p-2 rounded-md border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 hover:bg-[#F1F5F9] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-100 transition-colors"
              title={isDarkMode ? 'Yorugʻ rejimga oʻtish (Light Mode)' : 'Qorongʻu rejimga oʻtish (Dark Mode)'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              )}
            </button>

            {/* Quick Agro-Weather Widget */}
            <button
              onClick={() => setActiveTab('weather_market')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-md hover:border-[#3B82F6] transition-colors text-left"
              title="Yozyovon Agro-Ob-havosi"
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <div className="text-xs">
                <span className="font-bold text-[#0F172A] dark:text-white">{currentMfyWeather.temp}°C</span>
                <span className="text-[#64748B] dark:text-slate-400 text-[10px] ml-1">Tuproq: {currentMfyWeather.soilTemp}°C</span>
              </div>
            </button>

            {/* Notifications Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-md border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 hover:bg-[#F1F5F9] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-100 transition-colors relative"
                id="notif-btn"
                title="Xabarnomalar"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-lg border border-[#E2E8F0] dark:border-slate-700 shadow-xl z-50 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-700 pb-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-[#0F172A] dark:text-white">Xabarnomalar & Ogohlantirishlar</span>
                    <span className="text-[10px] text-[#64748B] dark:text-slate-400">{notifications.length} ta xabar</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-2.5 rounded-md text-xs border cursor-pointer transition-colors ${
                          notif.unread 
                            ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' 
                            : 'bg-[#F8FAFC] dark:bg-slate-900/60 border-[#E2E8F0] dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${notif.type === 'danger' ? 'text-rose-700 dark:text-rose-400' : notif.type === 'warning' ? 'text-amber-800 dark:text-amber-300' : 'text-blue-800 dark:text-blue-400'}`}>
                            {notif.title}
                          </span>
                          {notif.unread && <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>}
                        </div>
                        <p className="text-[#334155] dark:text-slate-300 mt-1 text-[11px] leading-relaxed">{notif.message}</p>
                        <span className="text-[10px] text-[#64748B] dark:text-slate-400 mt-1 block">{notif.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher & User Profile Menu (3 ta kalit) */}
            <div className="relative" ref={roleDropdownRef}>
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-md border border-[#E2E8F0] dark:border-slate-700 hover:border-[#3B82F6] bg-[#F8FAFC] dark:bg-slate-800 transition-colors"
                id="user-profile-menu-btn"
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white ${
                  userRole === 'admin' ? 'bg-slate-950 text-emerald-400 border border-emerald-500/50' : userRole === 'davlat' ? 'bg-[#0F172A]' : 'bg-emerald-600'
                }`}>
                  {userRole === 'admin' ? <Terminal className="w-4 h-4 text-emerald-400" /> : userRole === 'davlat' ? <ShieldCheck className="w-4 h-4" /> : <Sprout className="w-4 h-4" />}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-[#0F172A] dark:text-white truncate max-w-[130px]">{currentUser.name}</span>
                    {currentUser.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Tasdiqlangan hisob" />
                    )}
                  </div>
                  <span className="text-[10px] text-[#64748B] dark:text-slate-400 uppercase font-bold block tracking-wider">
                    {userRole === 'admin' ? '👨‍💻 Dasturchi' : userRole === 'davlat' ? '🏛️ Davlat Organi' : '👨‍🌾 Dehqon'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg border border-[#E2E8F0] dark:border-slate-700 shadow-xl z-50 p-2.5 text-xs space-y-1.5">
                  <div className="p-2.5 bg-[#F8FAFC] dark:bg-slate-900/80 rounded-md border border-[#E2E8F0] dark:border-slate-700">
                    <p className="font-bold text-[#0F172A] dark:text-white text-sm">{currentUser.name}</p>
                    <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5">{currentUser.phone}</p>
                    {currentUser.email && <p className="text-[10px] text-[#3B82F6] truncate mt-0.5">{currentUser.email}</p>}
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {currentUser.isVerified ? '✓ Tasdiqlangan' : '⏳ Kutilmoqda'}
                      </span>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {userRole === 'admin' ? 'Dasturchi' : userRole === 'davlat' ? 'Inspektor' : 'Dehqon Xoʻjaligi'}
                      </span>
                    </div>
                  </div>

                  {/* Clean Profile Menu (No role switching keys) */}
                  <div className="space-y-1 pt-1">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-md hover:bg-[#F8FAFC] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-200 font-medium flex items-center gap-2"
                      id="profile-my-farm-btn"
                    >
                      <Sprout className="w-4 h-4 text-emerald-600" />
                      <span>Mening Xoʻjaligim & Profil</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('lemon_guide');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-md hover:bg-[#F8FAFC] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-200 font-medium flex items-center gap-2"
                      id="profile-lemon-guide-btn"
                    >
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      <span>Limonchilik Qoʻllanmasi</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('scanner');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-md hover:bg-[#F8FAFC] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-200 font-medium flex items-center gap-2"
                      id="profile-scanner-btn"
                    >
                      <ScanLine className="w-4 h-4 text-blue-500" />
                      <span>AI Agro-Skaner</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('weather_market');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-md hover:bg-[#F8FAFC] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-200 font-medium flex items-center gap-2"
                      id="profile-weather-btn"
                    >
                      <Sun className="w-4 h-4 text-amber-600" />
                      <span>Agro-Ob-havo & Bozor</span>
                    </button>
                  </div>

                  <div className="border-t border-[#E2E8F0] dark:border-slate-700 pt-1.5 space-y-1">
                    <button
                      onClick={() => { onOpenAuth('login'); setIsRoleDropdownOpen(false); }}
                      className="w-full text-left p-2 rounded-md hover:bg-[#F8FAFC] dark:hover:bg-slate-700 text-[#3B82F6] font-semibold flex items-center gap-2"
                      id="profile-switch-account-btn"
                    >
                      <User className="w-4 h-4" />
                      <span>Boshqa Hisobga Kirish</span>
                    </button>

                    <button
                      onClick={() => { logout(); setIsRoleDropdownOpen(false); }}
                      className="w-full text-left p-2 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2"
                      id="profile-logout-btn"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Tizimdan Chiqish</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile / Universal Sidebar Trigger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md border border-[#E2E8F0] dark:border-slate-700 md:hidden text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              id="sidebar-toggle-btn"
              title="Boʻlimlar menyusi"
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>

        </div>
      </div>

      {/* Slide-in Navigation Sidebar Drawer */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onOpenAuth={onOpenAuth} 
      />

    </header>
  );
};
