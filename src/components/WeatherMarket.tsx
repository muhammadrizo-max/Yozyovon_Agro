import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  MapPin, 
  Sparkles,
  Calendar,
  AlertCircle,
  Gauge,
  Waves,
  ShieldCheck,
  Zap,
  CheckCircle2,
  RefreshCw,
  Globe,
  Radio,
  CloudRain,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  fetchTomorrowWeather, 
  TomorrowWeatherValues 
} from '../services/tomorrowWeather';
import { 
  fetchAccuWeather, 
  AccuWeatherValues 
} from '../services/accuWeather';

export const WeatherMarket: React.FC = () => {
  const { currentMfyWeather, mfyList, currentUser, getMfyWeather, weatherProvider } = useApp();
  const [selectedMfyId, setSelectedMfyId] = useState<number>(currentUser.mfyId || 1);

  // AccuWeather integration state
  const [accuData, setAccuData] = useState<AccuWeatherValues | null>(null);
  const [isLoadingAccu, setIsLoadingAccu] = useState(false);

  // Tomorrow.io integration state
  const [tomorrowData, setTomorrowData] = useState<TomorrowWeatherValues | null>(null);
  const [isLoadingTomorrow, setIsLoadingTomorrow] = useState(false);

  const activeWeather = getMfyWeather(selectedMfyId);
  const activeMfy = mfyList.find(m => m.id === selectedMfyId) || mfyList[0];

  // Fetch real-time weather from AccuWeather and Tomorrow.io for active MFY
  const loadWeatherData = async () => {
    setIsLoadingAccu(true);
    setIsLoadingTomorrow(true);
    try {
      const [accuRes, tomorrowRes] = await Promise.allSettled([
        fetchAccuWeather(activeMfy.center[0], activeMfy.center[1]),
        fetchTomorrowWeather(activeMfy.center[0], activeMfy.center[1])
      ]);

      if (accuRes.status === 'fulfilled') {
        setAccuData(accuRes.value);
      }
      if (tomorrowRes.status === 'fulfilled') {
        setTomorrowData(tomorrowRes.value);
      }
    } catch (err) {
      console.warn("Weather fetch warning:", err);
    } finally {
      setIsLoadingAccu(false);
      setIsLoadingTomorrow(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, [selectedMfyId, activeMfy]);

  // Calculate active values based on selected provider
  const isAccuActive = weatherProvider === 'accuweather' && accuData !== null;
  const isTomorrowActive = weatherProvider === 'tomorrow' && tomorrowData !== null;

  const displayTemp = isAccuActive 
    ? accuData!.temperature 
    : isTomorrowActive 
    ? tomorrowData!.temperature 
    : activeWeather.temp;

  const displayFeelsLike = isAccuActive 
    ? accuData!.temperatureApparent 
    : isTomorrowActive 
    ? tomorrowData!.temperatureApparent 
    : activeWeather.feelsLike;

  const displayHumidity = isAccuActive 
    ? accuData!.humidity 
    : isTomorrowActive 
    ? tomorrowData!.humidity 
    : activeWeather.humidity;

  const displayWindSpeed = isAccuActive 
    ? accuData!.windSpeed 
    : isTomorrowActive 
    ? tomorrowData!.windSpeed 
    : activeWeather.windSpeed;

  const displayCondition = isAccuActive 
    ? accuData!.conditionText 
    : isTomorrowActive 
    ? tomorrowData!.conditionText 
    : activeWeather.condition;

  // Calculate Agricultural Spraying Index (Purkash qulayligi)
  const isSprayingSafe = displayWindSpeed < 5 && displayTemp < 32;

  // Evapotranspiration calculation (L/m2 daily water loss)
  const evapoRate = Math.round((displayTemp * 0.15 + (100 - displayHumidity) * 0.05) * 10) / 10;

  const isCurrentLoading = weatherProvider === 'accuweather' ? isLoadingAccu : isLoadingTomorrow;

  return (
    <div className="space-y-6 max-w-7xl mx-auto" id="weather-and-market-view">
      
      {/* MFY Selector & Agro-Weather Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-[#3B82F6] rounded-md border border-blue-200 dark:border-blue-900">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-[#0F172A] dark:text-white uppercase tracking-tight">
                Yozyovon Tumani Agro-Meteorologik Monitoringi
              </h2>
              {weatherProvider === 'accuweather' ? (
                <span className="bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  AccuWeather API (Faol)
                </span>
              ) : (
                <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Tomorrow.io API
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
              AccuWeather xalqaro meteorologiya va Tomorrow.io stansiyalaridan real vaqt maʼlumotlari
            </p>
          </div>
        </div>

        {/* Dynamic Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Weather API Authority Indicator (Davlat organi tomonidan o'rnatilgan) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F1F5F9] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[#64748B] dark:text-slate-400">Manba:</span>
            <span className="font-bold text-[#0F172A] dark:text-white">
              {weatherProvider === 'accuweather' ? 'AccuWeather API' : 'Tomorrow.io API'}
            </span>
          </div>

          {/* Refresh weather */}
          <button
            onClick={loadWeatherData}
            disabled={isCurrentLoading}
            className="p-2 rounded-md bg-[#F8FAFC] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Ob-havoni yangilash"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCurrentLoading ? 'animate-spin text-amber-500' : ''}`} />
            <span className="hidden sm:inline">Yangilash</span>
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
                {displayCondition.toLowerCase().includes('yomg') ? (
                  <CloudRain className="w-8 h-8 text-blue-400 animate-pulse" />
                ) : displayCondition.toLowerCase().includes('bulut') ? (
                  <CloudSun className="w-8 h-8 text-amber-300 animate-pulse" />
                ) : (
                  <Sun className="w-8 h-8 text-amber-400 animate-pulse" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                    {activeMfy.name} Mikroiqlimi
                  </h3>
                  {weatherProvider === 'accuweather' ? (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                      <Radio className="w-2.5 h-2.5 text-amber-400" />
                      AccuWeather Jonli (Key: 353257 / Yaz'yavan)
                    </span>
                  ) : (
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                      <Radio className="w-2.5 h-2.5 text-blue-400" />
                      {tomorrowData?.source === 'tomorrow.io' ? 'Tomorrow.io Jonli' : 'Kesh / Agro-sensor'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                  Koordinata: {activeMfy.center[0].toFixed(3)}°N, {activeMfy.center[1].toFixed(3)}°E • Yozyovon tuman markazi
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
                Shudring: {isAccuActive ? accuData!.dewPoint : (tomorrowData?.dewPoint ?? activeWeather.dewPoint)}°C
              </span>
            </div>

            {/* 4. Shamol Tezligi & Purkash */}
            <div className="bg-[#1E293B] p-3 rounded-md border border-[#334155]">
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                <Wind className="w-4 h-4 text-slate-300" />
                <span className="font-bold uppercase text-[10px] tracking-wider truncate">Shamol & Purkash</span>
              </div>
              <div className="text-lg font-bold mt-1 text-white flex items-center gap-1">
                <span>{displayWindSpeed} m/s</span>
                {isAccuActive && accuData?.windDirection && (
                  <span className="text-xs text-amber-400 font-normal">({accuData.windDirection})</span>
                )}
              </div>
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

            {/* 6. UV Indeksi & Bosim */}
            <div className="bg-[#1E293B] p-3 rounded-md border border-[#334155]">
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                <Sun className="w-4 h-4 text-amber-300" />
                <span className="font-bold uppercase text-[10px] tracking-wider truncate">UV & Bosim</span>
              </div>
              <div className="text-lg font-bold mt-1 text-white">
                UV: {isAccuActive ? accuData!.uvIndex : (tomorrowData?.uvIndex ?? 4)}
              </div>
              <span className="text-[10px] text-emerald-400 block truncate">
                Bosim: {isAccuActive ? Math.round(accuData!.pressureSurfaceLevel) : (tomorrowData?.pressureSurfaceLevel ? Math.round(tomorrowData.pressureSurfaceLevel) : 1013)} hPa
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

          {/* Agricultural Forecast Section */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                {isAccuActive ? "AccuWeather 5 Kunlik Agrometeorologik Prognozi" : "7 Kunlik Agrometeorologik Prognoz"} ({activeMfy.name}):
              </span>
              <span className="text-[10px] text-amber-400 font-mono">
                {isAccuActive ? "Manba: AccuWeather Inc." : "Manba: Yozyovon stansiyasi"}
              </span>
            </div>

            {isAccuActive && accuData && accuData.dailyForecasts && accuData.dailyForecasts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {accuData.dailyForecasts.map((f, idx) => (
                  <div key={idx} className="bg-[#1E293B] p-2.5 rounded-md text-center border border-amber-500/20 hover:border-amber-400/50 transition-colors">
                    <span className="text-[11px] font-semibold block text-[#94A3B8]">{f.dayName}</span>
                    <span className="text-[9px] text-[#64748B] block font-mono">{f.date}</span>
                    <div className="my-1.5 text-amber-400 flex justify-center">
                      {f.iconPhrase.toLowerCase().includes('yomg') ? (
                        <CloudRain className="w-4 h-4 text-blue-400" />
                      ) : f.iconPhrase.toLowerCase().includes('bulut') ? (
                        <CloudSun className="w-4 h-4" />
                      ) : (
                        <Sun className="w-4 h-4" />
                      )}
                    </div>
                    <div className="font-bold text-xs text-white">{f.tempMax}° / {f.tempMin}°</div>
                    <span className="text-[10px] text-amber-200 block truncate mt-0.5" title={f.iconPhrase}>
                      {f.iconPhrase}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
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
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
