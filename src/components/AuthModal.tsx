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
  FileText,
  HelpCircle,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FarmType, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'register' // Birinchi marta kirganda default: Ro'yxatdan o'tish
}) => {
  const { login, registerFarmer, verifyEmailToken, mfyList } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);
  
  // Login states (Telefon raqam yoki email + Parol + Meni eslab qol)
  const [loginIdentifier, setLoginIdentifier] = useState('+998901234567');
  const [loginPassword, setLoginPassword] = useState('test1234');
  const [rememberMe, setRememberMe] = useState(true);

  // Register states
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+998 ');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regMfyId, setRegMfyId] = useState<number>(1);
  const [farmType, setFarmType] = useState<FarmType>('limon');
  const [customFarmType, setCustomFarmType] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Terms modal state
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // Forgot password modal state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Verification step state
  const [verificationResult, setVerificationResult] = useState<{
    email: string;
    token: string;
    link: string;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMsg('Iltimos, telefon raqam yoki email hamda parolni kiriting');
      return;
    }
    setErrorMsg('');
    
    if (rememberMe) {
      localStorage.setItem('yozyovon_remember_login', loginIdentifier.trim());
    } else {
      localStorage.removeItem('yozyovon_remember_login');
    }

    const ok = login(loginIdentifier.trim(), loginIdentifier.trim(), loginPassword.trim());
    if (!ok) {
      setErrorMsg('Login yoki parol notoʻgʻri kiritildi! Iltimos, qayta tekshiring.');
      return;
    }
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
      setErrorMsg('Telefon raqamingizni toʻliq kiriting');
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
    if (farmType === 'boshqa' && !customFarmType.trim()) {
      setErrorMsg('Xoʻjaligingizning aniq faoliyat turini yozing');
      return;
    }
    if (!agreedToTerms) {
      setErrorMsg('Roʻyxatdan oʻtish uchun foydalanish shartlariga rozilik bildirishingiz lozim');
      return;
    }

    setErrorMsg('');
    const result = registerFarmer({
      name: fullName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim(),
      password: regPassword,
      mfyId: Number(regMfyId),
      farmType,
      customFarmType: farmType === 'boshqa' ? customFarmType.trim() : undefined
    });

    setVerificationResult({
      email: regEmail.trim().toLowerCase(),
      token: result.verificationToken,
      link: result.verificationLink
    });
  };

  // Handle Simulated Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput.trim()) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotPassword(false);
      setForgotInput('');
    }, 3500);
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

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto" id="auth-modal-overlay">
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
                  Dehqonlar va sitruschilar uchun yagona monitoring va hisob platformasi
                </p>
              </div>

              {/* Tab Switcher: Ro'yxatdan o'tish (ilk marta kirganda default) vs Tizimga Kirish */}
              <div className="grid grid-cols-2 gap-1 bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 p-1 rounded-md text-xs font-semibold">
                <button
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                  className={`py-2 rounded transition-colors ${
                    activeTab === 'register' 
                      ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                      : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                  id="tab-register-btn"
                >
                  Roʻyxatdan Oʻtish
                </button>
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
              </div>

              {/* Davlat Kiber-xavfsizlik Kafolati */}
              <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    Davlat Standarti: AES-256 Shifrlangan Baza
                  </span>
                </div>
                <p className="text-[10px] text-emerald-700/90 dark:text-emerald-400 mt-1 leading-relaxed">
                  Barcha dehqon hisoblari davlat kiber-xavfsizlik talablariga muvofiq shifrlangan holda himoyalangan.
                </p>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-md">
                  {errorMsg}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 1: TIZIMGA KIRISH (LOGIN) */}
              {/* Telefon raqam yoki email + Parol + Meni eslab qol + Kirish */}
              {/* Pastida: Parolni unutdingizmi? va Ro'yxatdan o'tish linklari */}
              {/* ========================================================= */}
              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                  
                  {/* Telefon raqam yoki Email */}
                  <div>
                    <label className="block font-medium text-[#64748B] dark:text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                      Telefon Raqam yoki Email *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="+998901234567 yoki email@example.uz"
                        className="w-full pl-9 pr-3 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#3B82F6]"
                        id="login-identifier-input"
                      />
                    </div>
                  </div>

                  {/* Parol */}
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
                        id="login-password-input"
                      />
                    </div>
                  </div>

                  {/* Meni eslab qol (Remember me checkbox) */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 border-[#CBD5E1] dark:border-slate-700 focus:ring-blue-500"
                        id="login-remember-me-checkbox"
                      />
                      <span className="text-xs font-semibold text-[#334155] dark:text-slate-300">
                        Meni eslab qol
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-[#3B82F6] hover:underline font-semibold"
                      id="login-forgot-password-link"
                    >
                      Parolni unutdingizmi?
                    </button>
                  </div>

                  {/* Kirish Tugmasi */}
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#3B82F6] hover:bg-blue-600 active:scale-[0.99] text-white font-bold rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
                    id="submit-login-btn"
                  >
                    <span>Kirish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Davlat Organi Tezkor Kirishi */}
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg p-2.5 text-center">
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 mb-1.5 font-medium">
                      🏛️ Davlat organlari va inspektorlar uchun maxsus kirish:
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginIdentifier('davlatorgan@gmail.com');
                        setLoginPassword('agrocontrol14');
                      }}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded text-[11px] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>davlatorgan@gmail.com / agrocontrol14 ni toʻldirish</span>
                    </button>
                  </div>

                  {/* Kirish tugmasining tagida joylashgan matnli tugmalar / linklar */}
                  <div className="border-t border-[#E2E8F0] dark:border-slate-800 pt-3 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white underline transition-colors"
                    >
                      Parolni unutdingizmi?
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline transition-colors flex items-center gap-1"
                      id="link-go-to-register"
                    >
                      <span>Roʻyxatdan oʻtish</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </form>
              ) : (
                /* ========================================================= */
                /* TAB 2: RO'YXATDAN O'TISH (REGISTRATION)                   */
                /* Foydalanish shartlariga rozilik checkboxi + matni modal  */
                /* ========================================================= */
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
                        id="reg-fullname-input"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-medium text-[#64748B] dark:text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                      Email Manzil (Tasdiqlash havolasi yuboriladi) *
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
                        id="reg-email-input"
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
                        id="reg-phone-input"
                      />
                    </div>
                  </div>

                  {/* MFY Selection & Farm Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#64748B] dark:text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                        Yashash manzili (MFY) *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <select
                          value={regMfyId}
                          onChange={(e) => setRegMfyId(Number(e.target.value))}
                          className="w-full pl-9 pr-3 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#3B82F6]"
                          id="reg-mfy-select"
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
                        Xoʻjalik Turi *
                      </label>
                      <select
                        value={farmType}
                        onChange={(e) => setFarmType(e.target.value as FarmType)}
                        className="w-full px-3 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#3B82F6]"
                        id="reg-farmtype-select"
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

                  {farmType === 'boshqa' && (
                    <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                      <label className="block font-semibold text-emerald-900 dark:text-emerald-300 text-xs mb-1">
                        Xoʻjalik Turini Yozing *
                      </label>
                      <input
                        type="text"
                        required
                        value={customFarmType}
                        onChange={(e) => setCustomFarmType(e.target.value)}
                        placeholder="Masalan: Issiqxonada gulchilik yoki koʻchatchilik"
                        className="w-full px-3 py-2 border border-emerald-300 dark:border-emerald-700 rounded-md bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white font-medium text-xs focus:outline-hidden"
                      />
                    </div>
                  )}

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
                          id="reg-password-input"
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
                          id="reg-password-confirm-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Foydalanish Shartlariga Rozilik Checkbox va Matni */}
                  <div className="pt-2 pb-1 border-t border-[#E2E8F0] dark:border-slate-800">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-emerald-600 border-[#CBD5E1] dark:border-slate-700 focus:ring-emerald-500 shrink-0"
                        id="reg-terms-checkbox"
                        required
                      />
                      <span className="text-xs text-[#334155] dark:text-slate-300 leading-relaxed">
                        Men Yozyovon Agro tizimining{' '}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-[#3B82F6] hover:text-blue-700 dark:text-blue-400 font-bold underline inline-flex items-center gap-0.5"
                          id="terms-of-service-btn"
                        >
                          <span>Foydalanish shartlari</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        ga va shaxsiy maʼlumotlarni qayta ishlash siyosatiga roziman.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
                    id="submit-register-btn"
                  >
                    <Send className="w-4 h-4" />
                    <span>Roʻyxatdan Oʻtish & Emailga Link Yuborish</span>
                  </button>

                  {/* Link to Login */}
                  <div className="pt-2 text-center">
                    <span className="text-xs text-[#64748B] dark:text-slate-400">
                      Akkauntingiz bormi?{' '}
                      <button
                        type="button"
                        onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                        className="text-[#3B82F6] font-bold hover:underline"
                        id="link-go-to-login"
                      >
                        Tizimga kirish
                      </button>
                    </span>
                  </div>

                </form>
              )}
            </>
          )}

        </div>

      </div>

      {/* ========================================================= */}
      {/* FOYDALANISH SHARTLARI (TERMS OF SERVICE) MODAL            */}
      {/* ========================================================= */}
      {showTermsModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-xl w-full p-6 shadow-2xl border border-[#E2E8F0] dark:border-slate-800 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-[#0F172A] dark:text-white">
                  Yozyovon Agro — Foydalanish Shartlari va Maxfiylik Siyosati
                </h3>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto pr-2 space-y-4 my-4 text-xs text-[#334155] dark:text-slate-300 leading-relaxed custom-modal-scrollbar">
              <section className="space-y-1">
                <h4 className="font-bold text-emerald-700 dark:text-emerald-400">1. Umumiy Qoidalar</h4>
                <p>
                  Ushbu platforma Fargʻona viloyati Yozyovon tumani dehqonlari, sitruschilik (limonchilik) issiqxonalari egalari va chorvadorlarining agrotexnik faoliyatini raqamlashtirish, davlat subsidiyalari va xalqaro fitosanitariya eksport sertifikatlarini rasmiylashtirish uchun yaratilgan yagona davlat axborot tizimidir.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-emerald-700 dark:text-emerald-400">2. Maʼlumotlar Daxlsizligi va Kiber-Xavfsizlik</h4>
                <p>
                  Foydalanuvchining shaxsiy maʼlumotlari, telefon raqami, paroli va ekin maydoni koʻrsatkichlari Oʻzbekiston Respublikasi davlat kiber-xavfsizlik standartlariga muvofiq AES-256 va SHA-256 kriptografik algoritmlari bilan shifrlanadi. Maʼlumotlar uchinchi shaxslarga berilmaydi.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-emerald-700 dark:text-emerald-400">3. AI Skaner va Agrometeorologik Tavsiyalar</h4>
                <p>
                  Platformada taqdim etilayotgan AI agro-skaner diagnostikasi va Tomorrow.io meteorologik monitoringi dehqonlarga yordamchi ilmiy-tavsiyaviy vosita hisoblanadi. Kimyoviy preparatlarni qoʻllashda fitosanitariya xavfsizligi qoidalariga amal qilinishi shart.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-emerald-700 dark:text-emerald-400">4. Foydalanuvchining Majburiyatlari</h4>
                <p>
                  Foydalanuvchi tizimda oʻz xoʻjaligiga tegishli ekinlar, limon daraxtlari va chorva mollari soni boʻyicha haqiqiy va toʻgʻri maʼlumotlarni kiritishga, hisob xavfsizligini saqlashga masʼuldir.
                </p>
              </section>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  setAgreedToTerms(true);
                  setShowTermsModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-xs shadow-xs"
              >
                ✓ Shartlarga Roziman
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PAROLNI UNUTDINGIZMI? (FORGOT PASSWORD) MODAL             */}
      {/* ========================================================= */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-5 shadow-2xl border border-[#E2E8F0] dark:border-slate-800 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#3B82F6]" />
                <h3 className="font-bold text-xs text-[#0F172A] dark:text-white uppercase tracking-wider">
                  Parolni Qayta Tiklash
                </h3>
              </div>
              <button
                onClick={() => { setShowForgotPassword(false); setForgotSuccess(false); }}
                className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xs text-[#0F172A] dark:text-white">
                  Tiklash Havolasi Yuborildi!
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-slate-400">
                  {forgotInput} manziliga parolni yangilash uchun 6 xonali SMS/Email xavfsizlik kodi yuborildi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3 pt-3 text-xs">
                <p className="text-[11px] text-[#64748B] dark:text-slate-400 leading-relaxed">
                  Roʻyxatdan oʻtgan telefon raqamingiz yoki email manzilingizni kiriting. Biz parolni tiklash kodini joʻnatamiz.
                </p>
                <div>
                  <input
                    type="text"
                    required
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="+998901234567 yoki email"
                    className="w-full px-3 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#3B82F6]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold rounded-md shadow-xs transition-colors"
                >
                  Qayta Tiklash Kodini Yuborish
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
