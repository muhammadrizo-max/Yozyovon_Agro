import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Cpu,
  Edit3,
  Save,
  Check,
  Building,
  Calendar,
  Sparkles,
  Activity,
  Database
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
    setIsSidebarOpen,
    mfyList,
    updateUserProfile,
    devActiveSubTab,
    setDevActiveSubTab
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Edit form inputs
  const [editName, setEditName] = useState(currentUser.name);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editEmail, setEditEmail] = useState(currentUser.email || '');
  const [editMfyId, setEditMfyId] = useState(currentUser.mfyId);
  const [editActivity, setEditActivity] = useState(currentUser.activityField || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const notifListRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const desktopProfileRef = useRef<HTMLDivElement>(null);

  // Sync edit form with currentUser
  useEffect(() => {
    setEditName(currentUser.name);
    setEditPhone(currentUser.phone);
    setEditEmail(currentUser.email || '');
    setEditMfyId(currentUser.mfyId);
    setEditActivity(currentUser.activityField || '');
  }, [currentUser]);

  // Handle saving profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim() || currentUser.name,
      phone: editPhone.trim() || currentUser.phone,
      email: editEmail.trim(),
      mfyId: Number(editMfyId),
      activityField: editActivity.trim()
    });
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      setIsEditingProfile(false);
    }, 1200);
  };

  const currentMfy = mfyList.find(m => m.id === currentUser.mfyId) || mfyList[0];

  // Rolga mos xabarnomalar (bir panelga kelgan xabar boshqalarida ko'rinmasin!)
  const panelNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (n.targetRole === 'all') return true;
      return n.targetRole === userRole;
    });
  }, [notifications, userRole]);

  const unreadCount = panelNotifications.filter(n => n.unread).length;

  // Xabarnomalar menyusi ochilgach, foydalanuvchi ko'rganini tasdiqlash uchun 1.5 soniya (1500ms) kechikish bilan o'qilmagan xabarlar o'qilgan deb belgilanadi
  useEffect(() => {
    if (!isNotifOpen) return;

    const timer = setTimeout(() => {
      panelNotifications.forEach(notif => {
        if (notif.unread) {
          markNotificationAsRead(notif.id);
        }
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [isNotifOpen, panelNotifications, markNotificationAsRead]);

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
      if (desktopProfileRef.current && !desktopProfileRef.current.contains(target)) {
        setIsDesktopProfileOpen(false);
      }
    };

    if (isNotifOpen || isRoleDropdownOpen || isDesktopProfileOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isNotifOpen, isRoleDropdownOpen, isDesktopProfileOpen]);

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
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => {
                selectMfy(null);
                if (userRole === 'admin') {
                  setActiveTab('dev_hub');
                } else if (userRole === 'davlat') {
                  setActiveTab('gov_hub');
                } else {
                  setActiveTab('profile');
                }
              }}
              className="flex items-center gap-2 sm:gap-3 text-left group focus:outline-hidden"
              id="brand-logo-btn"
            >
              <div className="w-8 h-8 bg-[#3B82F6] rounded-xs rotate-45 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0">
                <div className="w-4 h-4 bg-white -rotate-45 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#3B82F6]"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-base sm:text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
                    {siteSettings?.siteName ? siteSettings.siteName.split(' ')[0] : 'YOZYOVON'}
                  </span>
                  <span className="text-base sm:text-xl font-bold tracking-tight text-[#3B82F6]">
                    {siteSettings?.siteName && siteSettings.siteName.split(' ').length > 1 ? siteSettings.siteName.split(' ').slice(1).join(' ') : 'AGRO'}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-xs bg-[#F1F5F9] dark:bg-slate-800 text-[#64748B] dark:text-slate-300 uppercase tracking-wider border border-[#E2E8F0] dark:border-slate-700 ml-1 hidden sm:inline-block">v2.5</span>
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
                  id="nav-dev-traffic"
                  onClick={() => { selectMfy(null); setActiveTab('dev_hub'); setDevActiveSubTab('traffic_monitor'); }}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'dev_hub' && devActiveSubTab === 'traffic_monitor'
                      ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500 font-bold'
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>Trafikni Real Vaqtda Kuzatish</span>
                </button>
                <button
                  id="nav-dev-database"
                  onClick={() => { selectMfy(null); setActiveTab('dev_hub'); setDevActiveSubTab('backup_restore'); }}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'dev_hub' && devActiveSubTab === 'backup_restore'
                      ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500 font-bold'
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  <Database className="w-4 h-4 text-emerald-500" />
                  <span>Bazani Tiklash va Zaxiralash</span>
                </button>
                <button
                  id="nav-dev-logs"
                  onClick={() => { selectMfy(null); setActiveTab('dev_hub'); setDevActiveSubTab('logs_and_rbac'); }}
                  className={`pb-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    activeTab === 'dev_hub' && devActiveSubTab === 'logs_and_rbac'
                      ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500 font-bold'
                      : 'text-[#64748B] dark:text-slate-400 border-transparent hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Tizim Loglari va Kirish Huquqlari</span>
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
                  <span>33 MFY Xaritasi</span>
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
                  id="nav-farmer-weather"
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
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl border border-[#E2E8F0] dark:border-slate-700 shadow-2xl z-50 p-4 space-y-3"
                    id="notification-dropdown-panel"
                  >
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs uppercase tracking-wider text-[#0F172A] dark:text-white">
                          Xabarnomalar
                        </span>
                        <AnimatePresence>
                          {unreadCount > 0 && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                              className="px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-bold"
                            >
                              {unreadCount} yangi
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <span className="text-[10px] text-[#64748B] dark:text-slate-400">
                        {panelNotifications.length} ta xabar
                      </span>
                    </div>

                    {/* Vertical Scroll Container with Fixed Max-Height */}
                    <div 
                      ref={notifListRef}
                      className="max-h-72 sm:max-h-80 overflow-y-auto space-y-2 pr-1.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700"
                      id="notifications-scroll-container"
                    >
                      {panelNotifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-[#64748B] dark:text-slate-400">
                          Hozircha yangi bildirishnomalar mavjud emas
                        </div>
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {panelNotifications.map(notif => (
                            <motion.div 
                              key={notif.id}
                              data-notif-id={notif.id}
                              data-unread={notif.unread}
                              layout
                              initial={{ opacity: 0, y: -6, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.94, y: -4 }}
                              transition={{ duration: 0.25, ease: 'easeOut' }}
                              onClick={() => markNotificationAsRead(notif.id)}
                              className={`p-3 rounded-lg text-xs border cursor-pointer transition-colors duration-300 ease-in-out relative ${
                                notif.unread 
                                  ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 shadow-xs' 
                                  : 'bg-[#F8FAFC]/90 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className={`font-bold ${
                                  notif.type === 'danger' ? 'text-rose-700 dark:text-rose-400' : 
                                  notif.type === 'warning' ? 'text-amber-700 dark:text-amber-400' : 
                                  'text-blue-700 dark:text-blue-400'
                                }`}>
                                  {notif.title}
                                </span>
                                <AnimatePresence>
                                  {notif.unread && (
                                    <motion.span 
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                                      className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs shrink-0 ring-2 ring-blue-200 dark:ring-blue-900"
                                      title="Yangi xabar"
                                    />
                                  )}
                                </AnimatePresence>
                              </div>
                              <p className="text-[#334155] dark:text-slate-300 mt-1.5 text-[11px] leading-relaxed">
                                {notif.message}
                              </p>
                              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/50 dark:border-slate-800/50 text-[10px] text-[#64748B] dark:text-slate-400">
                                <span>{notif.date}</span>
                                <span className={`font-medium ${notif.unread ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                                  {notif.unread ? 'Oʻqilmagan' : 'Oʻqilgan'}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Role Switcher & User Profile Menu (Desktop: Full Details & Edit; Mobile: Navigation Menu) */}
            <div className="relative" ref={desktopProfileRef}>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    setIsRoleDropdownOpen(!isRoleDropdownOpen);
                    setIsDesktopProfileOpen(false);
                  } else {
                    setIsDesktopProfileOpen(!isDesktopProfileOpen);
                    setIsRoleDropdownOpen(false);
                    setIsEditingProfile(false);
                  }
                }}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-md border border-[#E2E8F0] dark:border-slate-700 hover:border-[#3B82F6] bg-[#F8FAFC] dark:bg-slate-800 transition-colors cursor-pointer"
                id="user-profile-menu-btn"
                title="Foydalanuvchi profili va maʼlumotlari"
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                  userRole === 'admin' ? 'bg-slate-950 text-emerald-400 border border-emerald-500/50' : userRole === 'davlat' ? 'bg-[#0F172A]' : 'bg-emerald-600'
                }`}>
                  {userRole === 'admin' ? <Terminal className="w-4 h-4 text-emerald-400" /> : userRole === 'davlat' ? <ShieldCheck className="w-4 h-4" /> : <Sprout className="w-4 h-4" />}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-[#0F172A] dark:text-white truncate max-w-[120px]">{currentUser.name}</span>
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

              {/* ── DESKTOP ONLY: Full User Profile & Edit Details Card (Kompyuterda toʻliq maʼlumot va tahrirlash) ── */}
              {isDesktopProfileOpen && (
                <div 
                  className="hidden md:block absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-2xl z-50 p-4 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150"
                  id="desktop-profile-card"
                >
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-md bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center font-bold text-sm">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#0F172A] dark:text-white">Foydalanuvchi Profili</h3>
                        <p className="text-[10px] text-[#64748B] dark:text-slate-400">Yozyovon Agro tizimidagi shaxsiy kabinet</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsDesktopProfileOpen(false)}
                      className="p-1 rounded text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white"
                      title="Yopish"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {saveSuccessMsg && (
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-md text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2 text-xs">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Maʼlumotlar muvaffaqiyatli saqlandi!</span>
                    </div>
                  )}

                  {!isEditingProfile ? (
                    /* Read-Only Details View */
                    <div className="space-y-3">
                      <div className="bg-[#F8FAFC] dark:bg-slate-800/80 rounded-md p-3 border border-[#E2E8F0] dark:border-slate-700/80 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">F.I.SH (Toʻliq Ism)</span>
                            <p className="font-bold text-sm text-[#0F172A] dark:text-white mt-0.5">{currentUser.name}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            currentUser.isVerified 
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                          }`}>
                            {currentUser.isVerified ? '✓ Tasdiqlangan' : '⏳ Kutilmoqda'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E2E8F0] dark:border-slate-700/60 text-xs">
                          <div>
                            <span className="text-[10px] text-[#64748B] dark:text-slate-400 block">Telefon Raqami</span>
                            <span className="font-semibold text-[#0F172A] dark:text-slate-200">{currentUser.phone}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#64748B] dark:text-slate-400 block">Email Manzil</span>
                            <span className="font-semibold text-[#0F172A] dark:text-slate-200 truncate block">
                              {currentUser.email || 'Kiritilmagan'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#64748B] dark:text-slate-400 block">Mahalla (MFY)</span>
                            <span className="font-semibold text-[#0F172A] dark:text-slate-200 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#3B82F6]" />
                              <span>{currentMfy.name} MFY</span>
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#64748B] dark:text-slate-400 block">Tizimdagi Roʻli</span>
                            <span className="font-semibold text-[#3B82F6]">
                              {userRole === 'admin' ? 'Dasturchi' : userRole === 'davlat' ? 'Davlat Inspektori' : 'Dehqon Xoʻjaligi'}
                            </span>
                          </div>
                        </div>

                        <div className="pt-1.5 border-t border-[#E2E8F0] dark:border-slate-700/60">
                          <span className="text-[10px] text-[#64748B] dark:text-slate-400 block">Xoʻjalik Ixtisosi / Faoliyat Sohasi</span>
                          <span className="font-medium text-[#0F172A] dark:text-slate-200 block mt-0.5">
                            {currentUser.activityField || 'Sitruschilik, issiqxona xoʻjaligi va agromonitoring'}
                          </span>
                        </div>

                        {currentUser.hasExperienceBadge && (
                          <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded flex items-center gap-2 text-amber-800 dark:text-amber-300 text-[11px] font-semibold">
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>{currentUser.badgeTitle || 'Davlat tomonidan tasdiqlangan tajribali dehqon'}</span>
                          </div>
                        )}
                      </div>

                      {/* Edit Button */}
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="w-full py-2 px-3 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 text-[#0F172A] dark:text-white rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-[#CBD5E1] dark:border-slate-700 cursor-pointer shadow-xs"
                        id="desktop-edit-profile-btn"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span>Maʼlumotlarni Tahrirlash</span>
                      </button>

                      {/* Jump to Farm View */}
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setIsDesktopProfileOpen(false);
                        }}
                        className="w-full py-2 px-3 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                      >
                        <Sprout className="w-4 h-4" />
                        <span>Mening Xoʻjaligim Kabinetiga Oʻtish</span>
                      </button>
                    </div>
                  ) : (
                    /* Edit Form View */
                    <form onSubmit={handleSaveProfile} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-1">
                          F.I.SH (Ism va familiya)
                        </label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-md focus:ring-2 focus:ring-[#3B82F6] focus:outline-hidden text-[#0F172A] dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-1">
                            Telefon
                          </label>
                          <input
                            type="text"
                            required
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-md focus:ring-2 focus:ring-[#3B82F6] focus:outline-hidden text-[#0F172A] dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-md focus:ring-2 focus:ring-[#3B82F6] focus:outline-hidden text-[#0F172A] dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-1">
                          Yozyovon Mahallasini Tanlang (33 ta MFY)
                        </label>
                        <select
                          value={editMfyId}
                          onChange={(e) => setEditMfyId(Number(e.target.value))}
                          className="w-full px-3 py-1.5 text-xs bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-md focus:ring-2 focus:ring-[#3B82F6] focus:outline-hidden text-[#0F172A] dark:text-white"
                        >
                          {mfyList.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.id}. {m.name} MFY
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-1">
                          Faoliyat Sohasi / Xoʻjalik Ixtisosi
                        </label>
                        <input
                          type="text"
                          value={editActivity}
                          placeholder="Masalan: Issiqxonada sitruschilik, uzumchilik..."
                          onChange={(e) => setEditActivity(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-md focus:ring-2 focus:ring-[#3B82F6] focus:outline-hidden text-[#0F172A] dark:text-white"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="submit"
                          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Saqlash</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="py-2 px-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-[#0F172A] dark:text-slate-200 rounded-md font-semibold transition-colors cursor-pointer"
                        >
                          Bekor qilish
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Desktop Profile Actions */}
                  <div className="border-t border-[#E2E8F0] dark:border-slate-800 pt-2.5 flex items-center justify-between">
                    <button
                      onClick={() => { onOpenAuth('login'); setIsDesktopProfileOpen(false); }}
                      className="text-[#3B82F6] hover:underline font-semibold text-xs flex items-center gap-1"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Boshqa hisob</span>
                    </button>
                    <button
                      onClick={() => { logout(); setIsDesktopProfileOpen(false); }}
                      className="text-rose-600 dark:text-rose-400 hover:underline font-semibold text-xs flex items-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Chiqish</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── MOBILE ONLY: Navigation Menu (Telefonda ochiladigan menyu tugmalari) ── */}
              {isRoleDropdownOpen && (
                <div 
                  className="md:hidden absolute right-0 mt-2 w-[280px] max-w-[calc(100vw-24px)] bg-white dark:bg-slate-900 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-2xl z-50 p-2.5 text-xs space-y-1.5 animate-in fade-in zoom-in-95 duration-150"
                  id="mobile-profile-menu"
                >
                  <div className="p-2.5 bg-[#F8FAFC] dark:bg-slate-800/90 rounded-md border border-[#E2E8F0] dark:border-slate-700">
                    <p className="font-bold text-[#0F172A] dark:text-white text-sm truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5">{currentUser.phone}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {currentUser.isVerified ? '✓ Tasdiqlangan' : '⏳ Kutilmoqda'}
                      </span>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {userRole === 'admin' ? 'Dasturchi' : userRole === 'davlat' ? 'Inspektor' : 'Dehqon'}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="space-y-1 pt-1">
                    {userRole === 'admin' ? (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab('dev_hub');
                            setDevActiveSubTab('traffic_monitor');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2"
                        >
                          <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Trafikni Real Vaqtda Kuzatish</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('dev_hub');
                            setDevActiveSubTab('backup_restore');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2"
                        >
                          <Database className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Bazani Tiklash va Zaxiralash</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('dev_hub');
                            setDevActiveSubTab('logs_and_rbac');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Tizim Loglari va Kirish Huquqlari</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab(userRole === 'davlat' ? 'gov_hub' : 'profile');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-md hover:bg-[#F8FAFC] dark:hover:bg-slate-800 text-[#0F172A] dark:text-slate-200 font-medium flex items-center gap-2"
                          id="mobile-menu-farm-btn"
                        >
                          <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{userRole === 'davlat' ? 'Davlat Boshqaruv Markazi' : 'Mening Xoʻjaligim & Profil'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('lemon_guide');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-md hover:bg-[#F8FAFC] dark:hover:bg-slate-800 text-[#0F172A] dark:text-slate-200 font-medium flex items-center gap-2"
                          id="mobile-menu-lemon-btn"
                        >
                          <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Limonchilik Qoʻllanmasi</span>
                        </button>

                        {userRole === 'dehqon' && (
                          <button
                            onClick={() => {
                              setActiveTab('scanner');
                              setIsRoleDropdownOpen(false);
                            }}
                            className="w-full text-left p-2 rounded-md hover:bg-[#F8FAFC] dark:hover:bg-slate-800 text-[#0F172A] dark:text-slate-200 font-medium flex items-center gap-2"
                            id="mobile-menu-scanner-btn"
                          >
                            <ScanLine className="w-4 h-4 text-blue-500 shrink-0" />
                            <span>AI Agro-Skaner</span>
                          </button>
                        )}

                        {userRole === 'davlat' && (
                          <button
                            onClick={() => {
                              selectMfy(null);
                              setActiveTab('map');
                              setIsRoleDropdownOpen(false);
                            }}
                            className="w-full text-left p-2 rounded-md hover:bg-[#F8FAFC] dark:hover:bg-slate-800 text-[#0F172A] dark:text-slate-200 font-medium flex items-center gap-2"
                            id="mobile-menu-map-btn"
                          >
                            <Layers className="w-4 h-4 text-[#3B82F6] shrink-0" />
                            <span>33 MFY Xaritasi</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setActiveTab('weather_market');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-md hover:bg-[#F8FAFC] dark:hover:bg-slate-800 text-[#0F172A] dark:text-slate-200 font-medium flex items-center gap-2"
                          id="mobile-menu-weather-btn"
                        >
                          <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Agro-Ob-havo & Bozor</span>
                        </button>
                      </>
                    )}

                    {/* Mobile Edit Profile Trigger */}
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-md bg-blue-50/60 dark:bg-blue-950/40 text-[#3B82F6] font-semibold flex items-center gap-2"
                      id="mobile-menu-edit-btn"
                    >
                      <Edit3 className="w-4 h-4 text-[#3B82F6] shrink-0" />
                      <span>Profil Maʼlumotlarini Koʻrish & Tahrirlash</span>
                    </button>
                  </div>

                  <div className="border-t border-[#E2E8F0] dark:border-slate-700 pt-1.5 space-y-1">
                    <button
                      onClick={() => { onOpenAuth('login'); setIsRoleDropdownOpen(false); }}
                      className="w-full text-left p-2 rounded-md hover:bg-[#F8FAFC] dark:hover:bg-slate-800 text-[#3B82F6] font-semibold flex items-center gap-2"
                      id="mobile-menu-switch-account-btn"
                    >
                      <User className="w-4 h-4 shrink-0" />
                      <span>Boshqa Hisobga Kirish</span>
                    </button>

                    <button
                      onClick={() => { logout(); setIsRoleDropdownOpen(false); }}
                      className="w-full text-left p-2 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2"
                      id="mobile-menu-logout-btn"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span>Tizimdan Chiqish</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Sidebar Hamburger Trigger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md border border-[#E2E8F0] dark:border-slate-700 md:hidden text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
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
