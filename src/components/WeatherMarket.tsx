import React, { useState } from 'react';
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
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WeatherMarket: React.FC = () => {
  const { currentMfyWeather, mfyList, currentUser, getMfyWeather, marketPrices } = useApp();
  const [selectedMfyId, setSelectedMfyId] = useState<number>(currentUser.mfyId || 1);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'meva' | 'chorva' | 'don'>('all');

  const activeWeather = getMfyWeather(selectedMfyId);
  const activeMfy = mfyList.find(m => m.id === selectedMfyId) || mfyList[0];

  const filteredPrices = marketPrices.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  // Calculate Agricultural Spraying Index (Purkash qulayligi)
  const isSprayingSafe = activeWeather.windSpeed < 5 && activeWeather.temp < 32;

  // Evapotranspiration calculation (L/m2 daily water loss)
  const evapoRate = Math.round((activeWeather.temp * 0.15 + (100 - activeWeather.humidity) * 0.05) * 10) / 10;

  return (
    <div className="space-y-6 max-w-7xl mx-auto" id="weather-and-market-view">
      
      {/* MFY Selector & Agro-Weather Header */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-[#3B82F6] rounded-md border border-blue-200">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0F172A] uppercase tracking-tight">
                Yozyovon Tumani Agro-Meteorologik Monitoringi
              </h2>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-200">
                Real Vaqt
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Fargʻona viloyati • Dehqonchilik va sitruschilik uchun ixtisoslashgan agrometeorologik stansiya
            </p>
          </div>
        </div>

        {/* Dynamic MFY Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#64748B]">MFY boʻyicha:</span>
          <select
            value={selectedMfyId}
            onChange={(e) => setSelectedMfyId(Number(e.target.value))}
            className="text-xs bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-semibold rounded-md px-3 py-1.5 focus:outline-hidden focus:border-[#3B82F6]"
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
                  {activeMfy.id === currentUser.mfyId && (
                    <span className="bg-[#3B82F6] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Sizning Hudud
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                  Koordinata: {activeMfy.center[0].toFixed(3)}°N, {activeMfy.center[1].toFixed(3)}°E • Yozyovon
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-black text-white">{activeWeather.temp}°C</div>
              <p className="text-xs text-[#94A3B8] mt-0.5">Sezilishi: {activeWeather.feelsLike}°C • {activeWeather.condition}</p>
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
              <div className="text-lg font-bold mt-1 text-white">{activeWeather.humidity}%</div>
              <span className="text-[10px] text-[#64748B] block truncate">Shudring: {activeWeather.dewPoint}°C</span>
            </div>

            {/* 4. Shamol Tezligi & Purkash */}
            <div className="bg-[#1E293B] p-3 rounded-md border border-[#334155]">
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                <Wind className="w-4 h-4 text-slate-300" />
                <span className="font-bold uppercase text-[10px] tracking-wider truncate">Shamol & Purkash</span>
              </div>
              <div className="text-lg font-bold mt-1 text-white">{activeWeather.windSpeed} m/s</div>
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

            {/* 6. Ayoz & Quyosh Radiatsiyasi */}
            <div className="bg-[#1E293B] p-3 rounded-md border border-[#334155]">
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                <Sun className="w-4 h-4 text-amber-300" />
                <span className="font-bold uppercase text-[10px] tracking-wider truncate">Quyosh & Ayoz</span>
              </div>
              <div className="text-lg font-bold mt-1 text-white">{activeWeather.solarRadiationWm2} <span className="text-[10px] font-normal text-[#94A3B8]">W/m²</span></div>
              <span className="text-[10px] text-emerald-400 block truncate">Ayoz xavfi: Yoʻq</span>
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
      <div className="bg-white rounded-lg p-5 sm:p-6 border border-[#E2E8F0] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
              <Store className="w-4 h-4 text-[#3B82F6]" />
              <span>Viloyat va Tuman Bozor Narxlari</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Fargʻona, Qoʻqon ulgurji hamda Yozyovon dehqon bozorlaridagi monitoring narxlari
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-md text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                selectedCategory === 'all' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Barchasi
            </button>
            <button
              onClick={() => setSelectedCategory('meva')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                selectedCategory === 'meva' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Meva & Sitrus
            </button>
            <button
              onClick={() => setSelectedCategory('chorva')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                selectedCategory === 'chorva' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Chorva & Goʻsht
            </button>
            <button
              onClick={() => setSelectedCategory('don')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                selectedCategory === 'don' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
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
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Mahsulot Nomi</th>
                <th className="py-3 px-4">Yozyovon Bozori</th>
                <th className="py-3 px-4">Fargʻona Ulgurji</th>
                <th className="py-3 px-4">Qoʻqon Bozori</th>
                <th className="py-3 px-4">Oʻzgarish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredPrices.map(item => (
                <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F172A] flex items-center gap-2">
                    <span>{item.product}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#3B82F6]">
                    {item.yozyovonPrice.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 text-[#334155]">
                    {item.ferganaPrice.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 text-[#334155]">
                    {item.qoqonPrice.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                      item.trend === 'up' 
                        ? 'text-emerald-700' 
                        : item.trend === 'down' 
                        ? 'text-rose-700' 
                        : 'text-[#64748B]'
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

    </div>
  );
};
