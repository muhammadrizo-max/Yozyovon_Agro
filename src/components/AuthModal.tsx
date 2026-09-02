import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  Lock, 
  User as UserIcon, 
  MapPin, 
  Sprout, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Send,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Terminal,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FarmType, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, registerFarmer, verifyEmailToken, mfyList } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login states (Now includes Full Name, Phone/Email, Password)
  const [loginName, setLoginName] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('+998901234567');
  const [loginPassword, setLoginPassword] = useState('test1234');

  // Register states
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+998 ');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regMfyId, setRegMfyId] = useState<number>(1);
  const [farmType, setFarmType] = useState<FarmType>('limon');

  // Verification step state
  const [verificationResult, setVerificationResult] = useState<{
    email: string;
    token: string;
    link: string;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) {
      setErrorMsg('Iltimos, ismingizni kiriting');
      return;
    }
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMsg('Iltimos, telefon/email va parolni toʻldiring');
      return;
    }
    setErrorMsg('');
    login(loginName.trim(), loginIdentifier.trim(), loginPassword.trim());
    onClose();
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Toʻliq ism-sharifingizni kiriting');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMsg('Haqiqiy email manzilini kiriting (masalan: dehqon@gmail.com)');
      return;
    }
    if (!regPhone.trim() || regPhone.length < 9) {
      setErrorMsg('Telefon raqamingizni kiriting');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Parol kamida 6 ta belgidan iborat boʻlishi kerak');
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      setErrorMsg('Kiritilgan parollar bir-biriga mos kelmadi');
      return;
    }

    setErrorMsg('');
    const result = registerFarmer({
      name: fullName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim(),
      password: regPassword,
      mfyId: Number(regMfyId),
      farmType
    });

    setVerificationResult({
      email: regEmail.trim().toLowerCase(),
      token: result.verificationToken,
      link: result.verificationLink
    });
  };

  // Handle Click on Email Link Simulation
  const handleActivateViaLink = () => {
    if (!verificationResult) return;
    setIsVerifying(true);
    setTimeout(() => {
      verifyEmailToken(verificationResult.token);
      setIsVerifying(false);
      onClose();
    }, 900);
  };

  // Quick Preset Logins (3 ta asosiy kalit)
  const handleQuickKeyLogin = (keyRole: 'dehqon' | 'davlat' | 'admin') => {
    if (keyRole === 'admin') {
      login('Tizim Dasturchisi', '+998901234569', 'admin123', 'admin');
    } else if (keyRole === 'davlat') {
      login('Akmal Karimov (Inspektor)', '+998901234568', 'gov1234', 'davlat');
    } else {
      login('Rustamjon Qodirov', '+998901234567', 'test1234', 'dehqon');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-[#E2E8F0] dark:border-slate-800 relative my-auto max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-[#64748B] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-colors"
          id="auth-modal-close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto pr-1 space-y-4 custom-modal-scrollbar">

          {/* Verification Success View (After register) */}
          {verificationResult ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                <Mail className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">
                  Tasdiqlash Havolasi Yuborildi!
                </h3>
                <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
                  <strong className="text-[#0F172A] dark:text-white">{verificationResult.email}</strong> manziliga dehqon hisobingizni tasdiqlash uchun maxsus faollashtirish havolasi joʻnatildi.
                </p>
              </div>

              {/* Simulated Email Message Box */}
              <div className="bg-[#F8FAFC] dark:bg-slate-800 p-4 rounded-lg border border-blue-200 dark:border-blue-900 text-left space-y-2">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-700 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span className="text-[11px] font-bold text-[#0F172A] dark:text-white">Yozyovon Agro Tizimi</span>
                  </div>
                  <span className="text-[10px] text-[#64748B] dark:text-slate-400">Hozirgina</span>
                </div>
                <p className="text-xs text-[#334155] dark:text-slate-300">
                  Assalomu alaykum! Yozyovon Agro portalida roʻyxatdan oʻtganingiz uchun rahmat. Hisobingizni faollashtirish uchun quyidagi tugmani bosing:
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleActivateViaLink}
                    disabled={isVerifying}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Tasdiqlanmoqda...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>✓ Havola Orqali Hisobni Faollashtirish</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white underline"
                >
                  Keyinroq faollashtirish
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Modal Header */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-md bg-[#F1F5F9] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#3B82F6] flex items-center justify-center mx-auto mb-2">
                  <Sprout className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
                  Yozyovon Tumani Agro Portali
                </h3>
                <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                  Dehqonlar, Davlat monitoring organi va Administrator uchun yagona portal
                </p>
              </div>

              {/* Tab Switcher: Kirish vs Ro'yxatdan o'tish */}
              <div className="grid grid-cols-2 gap-1 bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 p-1 rounded-md text-xs font-semibold">
                <button
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                  className={`py-2 rounded transition-colors ${
                    activeTab === 'login' 
                      ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs font-bold' 
                      : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                  id="tab-login-btn"
                >
                  Tizimga Kirish
                </button>
                <button
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                  className={`py-2 rounded transition-colors ${
                    activeTab === 'register' 
                      ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs font-bold' 
                      : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                  id="tab-register-btn"
                >
                  Yangi Roʻyxatdan Oʻtish
                </button>
              </div>

              {/* 3 ta Asosiy Kalit (Quick Presets) */}
              <div className="p-3 bg-[#F8FAFC] dark:bg-slate-800/80 rounded-lg border border-[#E2E8F0] dark:border-slate-700">
                <div className="flex items-center gap-1.5 mb-2">
                  <KeyRound className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">
                    3 ta Asosiy Kalit orqali Tez Kirish:
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickKeyLogin('dehqon')}
                    className="p-2 bg-white dark:bg-slate-900 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 border border-[#CBD5E1] dark:border-slate-700 hover:border-emerald-500 rounded-md text-left transition-all"
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      <Sprout className="w-3 h-3 shrink-0" />
                      <span className="truncate">1. Dehqon</span>
                    </div>
                    <span className="text-[9px] text-[#64748B] dark:text-slate-400 block truncate mt-0.5">Rustamjon Q.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickKeyLogin('davlat')}
                    className="p-2 bg-white dark:bg-slate-900 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 border border-[#CBD5E1] dark:border-slate-700 hover:border-blue-500 rounded-md text-left transition-all"
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#3B82F6]">
                      <ShieldCheck className="w-3 h-3 shrink-0" />
                      <span className="truncate">2. Davlat</span>
                    </div>
                    <span className="text-[9px] text-[#64748B] dark:text-slate-400 block truncate mt-0.5">Inspektor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickKeyLogin('admin')}
                    className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-950/60 border border-[#CBD5E1] dark:border-slate-700 hover:border-emerald-400 rounded-md text-left transition-all"
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800 dark:text-emerald-400">
                      <Terminal className="w-3 h-3 shrink-0" />
                      <span className="truncate">3. Dasturchi</span>
                    </div>
                    <span className="text-[9px] text-[#64748B] dark:text-slate-400 block truncate mt-0.5">Root Admin</span>
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-md">
                  {errorMsg}
                </div>
              )}

              {/* TAB 1: LOGIN (Category selection removed, Full name required) */}
              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block font-medium text-[#64748B] dark:text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                      F.I.Sh / Ismingiz *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        placeholder="Masalan: Rustamjon Qodirov"
                        className="w-full pl-9 pr-3 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>

                  {/* Identifier: Phone or Email */}
                  <div>
                    <label className="block font-medium text-[#64748B] dark:text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                      Telefon Raqam yoki Email / Login *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="+998901234567 yoki email"
                        className="w-full pl-9 pr-3 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block font-medium text-[#64748B] dark:text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                      Parol *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#3B82F6] hover:bg-blue-600 active:scale-[0.99] text-white font-bold rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 mt-3"
                  >
                    <span>Kirish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* TAB 2: FULL REGISTRATION FORM */
                <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block font-medium text-[#64748B] dark:text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                      Toʻliq Ism-Sharifingiz *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Masalan: Qodirov Rustamjon Baxtiyorovich"
                        className="w-full pl-9 pr-3 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-medium text-[#64748B] dark:text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                      Email Manzil (Tasdiqlash linki yuboriladi) *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="rustam.dehqon@example.uz"
                        className="w-full pl-9 pr-3 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>

                  {/* Phone number */}
                  <div>
                    <label className="block font-medium text-[#64748B] dark:text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                      Telefon Raqam *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+998 90 123 45 67"
                        className="w-full pl-9 pr-3 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>

                  {/* MFY Selection from 32 Mahallas & Extended Farm Types */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#64748B] dark:text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                        Yozyovondagi MFY *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <select
                          value={regMfyId}
                          onChange={(e) => setRegMfyId(Number(e.target.value))}
                          className="w-full pl-9 pr-3 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#3B82F6]"
                        >
                          {mfyList.map(mfy => (
                            <option key={mfy.id} value={mfy.id}>
                              {mfy.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-[#64748B] dark:text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                        Xoʻjalik Turi (Yoʻnalish) *
                      </label>
                      <select
                        value={farmType}
                        onChange={(e) => setFarmType(e.target.value as FarmType)}
                        className="w-full px-3 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#3B82F6]"
                      >
                        <option value="limon">🍋 Limon Issiqxonasi (Sitruschilik)</option>
                        <option value="chorva">🐄 Chorvachilik (Qoramol, Qoʻy)</option>
                        <option value="bogdorchilik">🍇 Bogʻdorchilik va Uzumchilik</option>
                        <option value="paxta_galla">🌾 Gʻallachilik va Paxtachilik</option>
                        <option value="sabzavot">🥦 Sabzavotchilik va Poliz</option>
                        <option value="tomorqa">🏡 Aholi Tomorqa Xoʻjaligi</option>
                        <option value="baliqchilik">🐟 Baliqchilik Xoʻjaligi</option>
                        <option value="parrandachilik">🐔 Parrandachilik</option>
                        <option value="asalarichilik">🐝 Asalarichilik</option>
                        <option value="issiqxona_pomidor_bodring">🍅 Pomidor & Bodring Issiqxonasi</option>
                        <option value="boshqa">🌱 Boshqa Qishloq Xoʻjaligi</option>
                      </select>
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#64748B] dark:text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                        Parol (kamida 6 belgi) *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#3B82F6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-[#64748B] dark:text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                        Parolni Tasdiqlang *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={regPasswordConfirm}
                          onChange={(e) => setRegPasswordConfirm(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#3B82F6]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 mt-3"
                    id="submit-register-btn"
                  >
                    <Send className="w-4 h-4" />
                    <span>Roʻyxatdan Oʻtish & Emailga Link Yuborish</span>
                  </button>
                </form>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};
