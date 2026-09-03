import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { MFYMap } from './components/MFYMap';
import { MFYDetail } from './components/MFYDetail';
import { Profile } from './components/Profile';
import { AIScanner } from './components/AIScanner';
import { GovStatistics } from './components/GovStatistics';
import { WeatherMarket } from './components/WeatherMarket';
import { GovAlertsAndPrograms } from './components/GovAlertsAndPrograms';
import { GovManagementHub } from './components/GovManagementHub';
import { LemonAcademy } from './components/LemonAcademy';
import { AuthModal } from './components/AuthModal';
import { DevEmergencyPanel } from './components/DevEmergencyPanel';
import { 
  Sprout, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ExternalLink, 
  Heart,
  Globe,
  Layers, 
  Sparkles
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    selectedMfyId, 
    selectMfy, 
    userRole, 
    switchRole,
    mfyList,
    isLoggedIn 
  } = useApp();

  // Har bir yangi kelgan ilk foydalanuvchiga saytning login sahifasi ochiladi
  const [isAuthOpen, setIsAuthOpen] = useState(() => !isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsAuthOpen(true);
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] dark:bg-slate-950 text-[#1E293B] dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      
      {/* Header with Navigation and Profile */}
      <Header onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedMfyId !== null ? (
          /* Detailed MFY Page (/mfy/{id}) */
          <MFYDetail mfyId={selectedMfyId} onBack={() => selectMfy(null)} />
        ) : (
          <>
            {/* Government Management Hub (32 MFY, Subsidies, Alerts, Export Certs, Reset Test Data) */}
            {activeTab === 'gov_hub' && (
              <GovManagementHub />
            )}

            {/* 32 MFY Map View */}
            {activeTab === 'map' && (
              <div className="space-y-6">
                <MFYMap />
              </div>
            )}

            {/* Farmer Profile (Mening Xo'jaligim) */}
            {activeTab === 'profile' && (
              <Profile />
            )}

            {/* Lemon Academy (Limonchilik Qo'llanmasi & Karusel) */}
            {activeTab === 'lemon_guide' && (
              <LemonAcademy />
            )}

            {/* AI Scanner (Camera / Upload with Live Bounding Boxes & Health Diagnostics) */}
            {(activeTab === 'scanner' || activeTab === 'scanner_history') && (
              <AIScanner />
            )}

            {/* Government Statistics */}
            {activeTab === 'statistics' && (
              <GovStatistics />
            )}

            {/* Agro-Weather & Market Prices */}
            {activeTab === 'weather_market' && (
              <WeatherMarket />
            )}

            {/* Government Alerts */}
            {activeTab === 'alerts' && (
              <GovAlertsAndPrograms initialTab="alerts" />
            )}

            {/* Government Programs */}
            {activeTab === 'programs' && (
              <GovAlertsAndPrograms initialTab="programs" />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A] border-t border-slate-800 mt-12 pt-10 pb-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/80">
            
            {/* Col 1: Brand info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#3B82F6] rounded-xs rotate-45 flex items-center justify-center shadow-sm">
                  <div className="w-3.5 h-3.5 bg-white -rotate-45"></div>
                </div>
                <span className="font-bold text-base tracking-tight text-white">
                  YOZYOVON <span className="text-[#3B82F6]">AGRO</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Yozyovon tumani qishloq xoʻjaligi, sitruschilik va chorvachilik raqamli monitoring tizimi. 32 ta MFY boʻyicha yagona maʼlumotlar portali.
              </p>
              <div className="text-[10px] text-blue-400 font-semibold bg-blue-950/60 px-2.5 py-1 rounded border border-blue-800/50 inline-block uppercase tracking-wider">
                🍋 Yozyovon Sitrus Klasteri & AI Agro-Monitoring
              </div>
            </div>

            {/* Col 2: Tezkor havolalar */}
            <div>
              <h4 className="font-bold text-white mb-3 uppercase tracking-widest text-[10px]">Tizim Boʻlimlari</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button onClick={() => { selectMfy(null); switchRole('davlat'); }} className="hover:text-[#3B82F6] transition-colors text-left">
                    Davlat Boshqaruv Markazi (32 MFY)
                  </button>
                </li>
                <li>
                  <button onClick={() => { selectMfy(null); switchRole('dehqon'); }} className="hover:text-[#3B82F6] transition-colors text-left">
                    Dehqon shaxsiy xoʻjalik paneli
                  </button>
                </li>
                <li>
                  <button onClick={() => { selectMfy(null); }} className="hover:text-[#3B82F6] transition-colors text-left">
                    AI Kasallik va hosil skaneri
                  </button>
                </li>
                <li>
                  <button onClick={() => { selectMfy(null); }} className="hover:text-[#3B82F6] transition-colors text-left">
                    Yozyovon agro-meteorologik ob-havosi
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: MFYlar ro'yxati */}
            <div>
              <h4 className="font-bold text-white mb-3 uppercase tracking-widest text-[10px]">Yozyovon MFYlari (32 ta)</h4>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                {mfyList.slice(0, 10).map(m => (
                  <button 
                    key={m.id} 
                    onClick={() => selectMfy(m.id)}
                    className="text-left hover:text-white hover:underline truncate"
                  >
                    • {m.name}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 mt-2 block font-semibold">+ yana 22 ta MFY xaritada</span>
            </div>

            {/* Col 4: Aloqa va Manzil */}
            <div className="space-y-3">
              <h4 className="font-bold text-white mb-3 uppercase tracking-widest text-[10px]">Agroinspeksiya Aloqa</h4>
              <div className="space-y-2 text-slate-400 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                  <span>Fargʻona viloyati, Yozyovon tumani, Mustaqillik shoh koʻchasi 12-uy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#3B82F6] shrink-0" />
                  <span>+998 (73) 502-12-34 (Qabulxona)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#3B82F6] shrink-0" />
                  <span>info@yozyovon-agro.uz</span>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <p>© 2026 Yozyovon Tumani Qishloq Xoʻjaligi Boshqarmasi. Barcha huquqlar himoyalangan.</p>
            <div className="flex items-center gap-4">
              <span>Raqamli Qishloq Xoʻjaligi Tizimi</span>
              <span>•</span>
              <span className="text-emerald-500 font-semibold">Tizim Faol</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

      {/* Developer Emergency Access & Cyber Defense Backdoor Console */}
      <DevEmergencyPanel />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
