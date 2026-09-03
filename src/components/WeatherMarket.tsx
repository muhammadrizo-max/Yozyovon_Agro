import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MapPin, 
  Store, 
  Sparkles,
  Calendar,
  AlertCircle,
  Gauge,
  Waves,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
  RefreshCw,
  Key,
  Globe,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  fetchTomorrowWeather, 
  TomorrowWeatherValues, 
  getStoredTomorrowApiKey, 
  saveCustomTomorrowApiKey 
} from '../services/tomorrowWeather';

export const WeatherMarket: React.FC = () => {
  const { currentMfyWeather, mfyList, currentUser, getMfyWeather, marketPrices } = useApp();
  const [selectedMfyId, setSelectedMfyId] = useState<number>(currentUser.mfyId || 1);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'meva' | 'chorva' | 'don'>('all');

  // Tomorrow.io integration state
  const [tomorrowData, setTomorrowData] = useState<TomorrowWeatherValues | null>(null);
  const [isLoadingTomorrow, setIsLoadingTomorrow] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getStoredTomorrowApiKey());
  const [apiKeySavedSuccess, setApiKeySavedSuccess] = useState(false);

  const activeWeather = getMfyWeather(selectedMfyId);
  const activeMfy = mfyList.find(m => m.id === selectedMfyId) || mfyList[0];

  // Fetch real-time weather from Tomorrow.io for active MFY
  const loadWeatherData = async () => {
    setIsLoadingTomorrow(true);
    try {
      const data = await fetchTomorrowWeather(activeMfy.center[0], activeMfy.center[1]);
      setTomorrowData(data);
    } catch (err) {
      console.warn("Tomorrow.io weather fetch error:", err);
    } finally {
      setIsLoadingTomorrow(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, [selectedMfyId, activeMfy]);

  const handleSaveApiKey = () => {
    saveCustomTomorrowApiKey(apiKeyInput);
    setApiKeySavedSuccess(true);
    setTimeout(() => {
      setApiKeySavedSuccess(false);
      setIsApiKeyModalOpen(false);
      loadWeatherData();
    }, 1000);
  };

  const filteredPrices = marketPrices.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  // Display temperature and conditions, preferring live tomorrowData
  const displayTemp = tomorrowData ? tomorrowData.temperature : activeWeather.temp;
  const displayFeelsLike = tomorrowData ? tomorrowData.temperatureApparent : activeWeather.feelsLike;
  const displayHumidity = tomorrowData ? tomorrowData.humidity : activeWeather.humidity;
  const displayWindSpeed = tomorrowData ? tomorrowData.windSpeed : activeWeather.windSpeed;
  const displayCondition = tomorrowData ? tomorrowData.conditionText : activeWeather.condition;

  // Calculate Agricultural Spraying Index (Purkash qulayligi)
  const isSprayingSafe = displayWindSpeed < 5 && displayTemp < 32;

  // Evapotranspiration calculation (L/m2 daily water loss)
  const evapoRate = Math.round((displayTemp * 0.15 + (100 - displayHumidity) * 0.05) * 10) / 10;

  return (
    <div className="space-y-6 max-w-7xl mx-auto" id="weather-and-market-view">
      
      {/* MFY Selector & Agro-Weather Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-[#3B82F6] rounded-md border border-blue-200 dark:border-blue-900">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0F172A] dark:text-white uppercase tracking-tight">
                Yozyovon Tumani Agro-Meteorologik Monitoringi
              </h2>
              <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Tomorrow.io API
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
              Tomorrow.io ob-havo tarmogʻi va agrometeorologik stansiyalar integratsiyasi
            </p>
          </div>
        </div>

        {/* Dynamic Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh weather */}
          <button
            onClick={loadWeatherData}
            disabled={isLoadingTomorrow}
            className="p-2 rounded-md bg-[#F8FAFC] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Ob-havoni yangilash"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTomorrow ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">Yangilash</span>
          </button>

          {/* Tomorrow.io API Key modal trigger */}
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="p-2 rounded-md bg-[#F8FAFC] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Tomorrow.io API kalitini sozlash"
            id="tomorrow-api-key-btn"
          >
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">API Kalit</span>
          </button>

          {/* MFY Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400">MFY:</span>
            <select
              value={selectedMfyId}
              onChange={(e) => setSelectedMfyId(Number(e.target.value))}
              className="text-xs bg-[#F8FAFC] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white font-semibold rounded-md px-3 py-1.5 focus:outline-hidden focus:border-[#3B82F6]"
              id="mfy-weather-select"
            >
              {mfyList.map(mfy => (
                <option key={mfy.id} value={mfy.id}>
                  {mfy.name} {mfy.id === currentUser.mfyId ? '(Sizning MFY)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Agro-Weather Dashboard Card */}
      <div className="bg-[#0F172A] text-white rounded-lg p-6 sm:p-7 border border-[#334155] shadow-xs relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#1E293B] rounded-md border border-[#334155]">
                <Sun className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                    {activeMfy.name} Mikroiqlimi
                  </h3>
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 text-blue-400" />
                    {tomorrowData?.source === 'tomorrow.io' ? 'Tomorrow.io Jonli' : 'Kesh / Agro-sensor'}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                  Koordinata: {activeMfy.center[0].toFixed(3)}°N, {activeMfy.center[1].toFixed(3)}°E • Yozyovon
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-black text-white">{displayTemp}°C</div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Sezilishi: {displayFeelsLike}°C • {displayCondition}
              </p>
            </div>
          </div>

          {/* 6 Key AGRO-SPECIFIC Weather Indicators Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-[#334155]">
            
            {/* 1. Tuproq Harorati */}
            <div className="bg-[#1E293B] p-3 rounded-md border border-[#334155]">
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                <Thermometer className="w-4 h-4 text-rose-400" />
                <span className="font-bold uppercase text-[10px] tracking-wider truncate">Tuproq Harorati</span>
              </div>
              <div className="text-lg font-bold mt-1 text-white">{activeWeather.soilTemp}°C</div>
              <span className="text-[10px] text-[#64748B] block truncate">10 sm chuqurlikda</span>
            </div>

            {/* 2. Tuproq Namligi */}
            <div className="bg-[#1E293B] p-3 rounded-md border border-[#334155]">
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                <Waves className="w-4 h-4 text-[#3B82F6]" />
                <span className="font-bold uppercase text-[10px] tracking-wider truncate">Tuproq Namligi</span>
              </div>
              <div className="text-lg font-bold mt-1 text-white">{activeWeather.soilMoisturePercent}%</div>
              <span className="text-[10px] text-emerald-400 block truncate">Optimal oraliq (60-75%)</span>
            </div>

            {/* 3. Havo Namligi */}
            <div className="bg-[#1E293B] p-3 rounded-md border border-[#334155]">
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span className="font-bold uppercase text-[10px] tracking-wider truncate">Havo Namligi</span>
              </div>
              <div className="text-lg font-bold mt-1 text-white">{displayHumidity}%</div>
              <span className="text-[10px] text-[#64748B] block truncate">
                Shudring: {tomorrowData?.dewPoint ?? activeWeather.dewPoint}°C
              </span>
            </div>

            {/* 4. Shamol Tezligi & Purkash */}
            <div className="bg-[#1E293B] p-3 rounded-md border border-[#334155]">
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                <Wind className="w-4 h-4 text-slate-300" />
                <span className="font-bold uppercase text-[10px] tracking-wider truncate">Shamol & Purkash</span>
              </div>
              <div className="text-lg font-bold mt-1 text-white">{displayWindSpeed} m/s</div>
              <span className={`text-[10px] block truncate font-medium ${isSprayingSafe ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isSprayingSafe ? 'Dori sepishga qulay' : 'Shamolli (Ehtiyot boʻling)'}
              </span>
            </div>

            {/* 5. Kunlik Bugʻlanish */}
            <div className="bg-[#1E293B] p-3 rounded-md border border-[#334155]">
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                <Gauge className="w-4 h-4 text-amber-400" />
                <span className="font-bold uppercase text-[10px] tracking-wider truncate">Evapotranspiratsiya</span>
              </div>
              <div className="text-lg font-bold mt-1 text-white">{evapoRate} <span className="text-[10px] font-normal text-[#94A3B8]">mm/kun</span></div>
              <span className="text-[10px] text-[#64748B] block truncate">Sugʻorish: {Math.round(evapoRate * 10)} m³/ga</span>
            </div>

            {/* 6. UV Indeksi & Quyosh */}
            <div className="bg-[#1E293B] p-3 rounded-md border border-[#334155]">
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                <Sun className="w-4 h-4 text-amber-300" />
                <span className="font-bold uppercase text-[10px] tracking-wider truncate">UV & Bosim</span>
              </div>
              <div className="text-lg font-bold mt-1 text-white">
                UV: {tomorrowData?.uvIndex ?? 4}
              </div>
              <span className="text-[10px] text-emerald-400 block truncate">
                Bosim: {tomorrowData?.pressureSurfaceLevel ? Math.round(tomorrowData.pressureSurfaceLevel) : 1013} hPa
              </span>
            </div>

          </div>

          {/* Dedicated Agronomist Advice tailored specifically to this MFY */}
          <div className="mt-4 p-3.5 bg-[#1E293B] rounded-md border border-[#334155] text-xs flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase text-[10px] tracking-wider">
                {activeMfy.name} uchun agronomik tavsiya va sugʻorish rejimi:
              </span>
              <p className="text-[#CBD5E1] mt-0.5 leading-relaxed">
                {activeWeather.agroAdvice}
              </p>
            </div>
          </div>

          {/* 7-Day Agricultural Forecast */}
          <div className="mt-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
              7 Kunlik Agrometeorologik Prognoz ({activeMfy.name}):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {activeWeather.forecast.map((f, idx) => (
                <div key={idx} className="bg-[#1E293B] p-2.5 rounded-md text-center border border-[#334155]">
                  <span className="text-[11px] font-semibold block text-[#94A3B8]">{f.day}</span>
                  <div className="my-1.5 text-amber-400 flex justify-center">
                    {f.icon === 'Sun' ? <Sun className="w-4 h-4" /> : f.icon === 'Wind' ? <Wind className="w-4 h-4" /> : <CloudSun className="w-4 h-4" />}
                  </div>
                  <div className="font-bold text-xs text-white">{f.tempDay}° / {f.tempNight}°</div>
                  <span className="text-[10px] text-[#64748B] block truncate mt-0.5">{f.condition}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Market Prices Section */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-5 sm:p-6 border border-[#E2E8F0] dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-[#0F172A] dark:text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-[#3B82F6]" />
              <span>Viloyat va Tuman Bozor Narxlari</span>
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
              Fargʻona, Qoʻqon ulgurji hamda Yozyovon dehqon bozorlaridagi monitoring narxlari
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 p-1 rounded-md text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                selectedCategory === 'all' ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs' : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              Barchasi
            </button>
            <button
              onClick={() => setSelectedCategory('meva')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                selectedCategory === 'meva' ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs' : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              Meva & Sitrus
            </button>
            <button
              onClick={() => setSelectedCategory('chorva')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                selectedCategory === 'chorva' ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs' : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              Chorva & Goʻsht
            </button>
            <button
              onClick={() => setSelectedCategory('don')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                selectedCategory === 'don' ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs' : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              Don & Ozuqa
            </button>
          </div>
        </div>

        {/* Prices Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-slate-800 border-b border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Mahsulot Nomi</th>
                <th className="py-3 px-4">Yozyovon Bozori</th>
                <th className="py-3 px-4">Fargʻona Ulgurji</th>
                <th className="py-3 px-4">Qoʻqon Bozori</th>
                <th className="py-3 px-4">Oʻzgarish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
              {filteredPrices.map(item => (
                <tr key={item.id} className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                    <span>{item.product}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#3B82F6]">
                    {item.yozyovonPrice.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 text-[#334155] dark:text-slate-300">
                    {item.ferganaPrice.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 text-[#334155] dark:text-slate-300">
                    {item.qoqonPrice.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                      item.trend === 'up' 
                        ? 'text-emerald-700 dark:text-emerald-400' 
                        : item.trend === 'down' 
                        ? 'text-rose-700 dark:text-rose-400' 
                        : 'text-[#64748B] dark:text-slate-400'
                    }`}>
                      {item.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : item.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                      <span>{item.changePercent > 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tomorrow.io API Key Configuration Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#0F172A] dark:text-white">
              <Key className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Tomorrow.io API Kaliti</h3>
            </div>

            <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
              Ob-havo maʻlumotlari <strong className="text-[#0F172A] dark:text-white">tomorrow.io</strong> xizmati orqali toʻgʻridan-toʻgʻri olinadi. Oʻzingizning shaxsiy API kalitingiz boʻlsa, uni quyiga kiriting:
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0F172A] dark:text-white">
                API Kalit (API Key):
              </label>
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Masalan: YgR6q..."
                className="w-full px-3 py-2 text-xs rounded-md border border-[#CBD5E1] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white font-mono"
              />
            </div>

            {apiKeySavedSuccess && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>API kalit muvaffaqiyatli saqlandi!</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(false)}
                className="px-3.5 py-1.5 rounded-md border border-[#CBD5E1] dark:border-slate-700 text-xs font-semibold text-[#64748B] dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800"
              >
                Bekor Qilish
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-4 py-1.5 rounded-md bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-bold shadow-xs"
              >
                Saqlash va Yangilash
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
