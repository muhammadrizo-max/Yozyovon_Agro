import React, { useState } from 'react';
import { 
  Sprout, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Wheat, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  BarChart, 
  User as UserIcon, 
  Phone, 
  Home,
  X,
  Layers,
  ChevronRight,
  Sparkles,
  Camera
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Crop, Livestock } from '../types';

export const Profile: React.FC = () => {
  const { currentUser, crops, livestock, addCrop, deleteCrop, addLivestock, deleteLivestock, mfyList, setActiveTab } = useApp();

  // Modals
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [isAddLivestockOpen, setIsAddLivestockOpen] = useState(false);

  // Mobile Sub-View Tab: 'crops' | 'livestock' | 'yield'
  const [mobileTab, setMobileTab] = useState<'crops' | 'livestock' | 'yield'>('crops');

  // New Crop Form State
  const [newCropType, setNewCropType] = useState<'limon' | 'anor' | 'uzum' | 'bugdoy'>('limon');
  const [newAreaGa, setNewAreaGa] = useState('1.5');
  const [newLat, setNewLat] = useState('40.5175');
  const [newLng, setNewLng] = useState('71.0840');
  const [newHealth, setNewHealth] = useState<'yaxshi' | 'ortacha' | 'yomon'>('yaxshi');
  const [newPlantedDate, setNewPlantedDate] = useState('2024-03-20');
  const [newHarvestDate, setNewHarvestDate] = useState('2026-11-15');
  const [newExpectedYield, setNewExpectedYield] = useState('28');
  const [newCropNotes, setNewCropNotes] = useState('');

  // New Livestock Form State
  const [newAnimalType, setNewAnimalType] = useState<'sigir' | 'qoy' | 'tovuq' | 'ot'>('sigir');
  const [newCount, setNewCount] = useState('6');
  const [newAgeMonths, setNewAgeMonths] = useState('24');
  const [newAnimalHealth, setNewAnimalHealth] = useState<'soglom' | 'kasal' | 'homilador' | 'emlangan'>('soglom');
  const [newCheckupDate, setNewCheckupDate] = useState('2026-08-20');
  const [newTagNumber, setNewTagNumber] = useState('UZ-YZ-0220');

  const currentMfy = mfyList.find(m => m.id === currentUser.mfyId) || mfyList[0];

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    addCrop({
      mfyId: currentUser.mfyId,
      cropType: newCropType,
      areaGa: parseFloat(newAreaGa) || 1,
      coordinates: {
        lat: parseFloat(newLat) || 40.5167,
        lng: parseFloat(newLng) || 71.0833
      },
      healthStatus: newHealth,
      plantedDate: newPlantedDate,
      expectedHarvest: newHarvestDate,
      expectedYieldTons: parseFloat(newExpectedYield) || 10,
      actualYieldTons: Math.round(parseFloat(newExpectedYield) * 0.95 * 10) / 10,
      notes: newCropNotes || 'Yangi ekin maydoni'
    });
    setIsAddCropOpen(false);
  };

  const handleCreateLivestock = (e: React.FormEvent) => {
    e.preventDefault();
    addLivestock({
      animalType: newAnimalType,
      count: parseInt(newCount, 10) || 1,
      ageMonths: parseInt(newAgeMonths, 10) || 12,
      healthStatus: newAnimalHealth,
      lastCheckup: newCheckupDate,
      tagNumber: newTagNumber,
      notes: 'Veterinariya nazoratida'
    });
    setIsAddLivestockOpen(false);
  };

  // Yield Plan vs Actual metrics
  const totalPlannedYield = crops.reduce((sum, c) => sum + c.expectedYieldTons, 0);
  const totalActualYield = crops.reduce((sum, c) => sum + (c.actualYieldTons || 0), 0);
  const totalCropArea = crops.reduce((sum, c) => sum + c.areaGa, 0);
  const totalAnimals = livestock.reduce((sum, l) => sum + l.count, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 md:pb-0" id="farmer-profile-view">
      
      {/* Profile Overview Card - Geometric Balance (Mobile-first responsive) */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-7 h-7 text-[#64748B] dark:text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white tracking-tight truncate">{currentUser.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-blue-50 dark:bg-blue-950/60 text-[#3B82F6] dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Dehqon xoʻjaligi
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs text-[#64748B] dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span className="truncate">{currentMfy.name} MFY</span>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400" />
                <span>{currentUser.phone}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar - mobile full touch */}
        <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E2E8F0] dark:border-slate-800">
          <button
            onClick={() => setActiveTab('scanner')}
            className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2.5 bg-[#3B82F6] hover:bg-blue-600 active:scale-95 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>AI Skaner</span>
          </button>

          <button
            onClick={() => setIsAddCropOpen(true)}
            className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2.5 bg-[#0F172A] dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all border border-transparent dark:border-slate-700"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Ekin Qoʻshish</span>
            <span className="sm:hidden">+ Ekin</span>
          </button>
        </div>
      </div>

      {/* Yield Plan vs Actual Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider block">Jami Ekin Maydoni</span>
          <div className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white mt-1 sm:mt-2">
            {totalCropArea.toFixed(1)} <span className="text-xs font-normal text-[#64748B] dark:text-slate-400">ga</span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5">{crops.length} ta maydonda</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider block">Hosil Rejasi</span>
          <div className="text-xl sm:text-2xl font-bold text-[#3B82F6] mt-1 sm:mt-2">
            {totalPlannedYield.toFixed(1)} <span className="text-xs font-normal text-[#64748B] dark:text-slate-400">t</span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5">2026 mavsumiy reja</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider block">Yigʻilgan Hosil</span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 sm:mt-2">
            {totalActualYield.toFixed(1)} <span className="text-xs font-normal text-[#64748B] dark:text-slate-400">t</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
            <CheckCircle className="w-3 h-3" />
            <span>{Math.round((totalActualYield / (totalPlannedYield || 1)) * 100)}% bajarildi</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider block">Jami Chorva Boshlari</span>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 sm:mt-2">
            {totalAnimals} <span className="text-xs font-normal text-[#64748B] dark:text-slate-400">bosh</span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5">{livestock.length} toifada</p>
        </div>
      </div>

      {/* MOBILE SEGMENT SELECTOR - Displayed primarily on phones for quick navigation */}
      <div className="md:hidden flex items-center bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs gap-1">
        <button
          onClick={() => setMobileTab('crops')}
          className={`flex-1 py-2.5 rounded-md text-xs font-bold transition-all text-center min-h-[44px] flex items-center justify-center ${
            mobileTab === 'crops' 
              ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs' 
              : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
          }`}
        >
          🌿 Ekinlar ({crops.length})
        </button>
        <button
          onClick={() => setMobileTab('livestock')}
          className={`flex-1 py-2.5 rounded-md text-xs font-bold transition-all text-center min-h-[44px] flex items-center justify-center ${
            mobileTab === 'livestock' 
              ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs' 
              : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
          }`}
        >
          🐄 Chorva ({livestock.length})
        </button>
        <button
          onClick={() => setMobileTab('yield')}
          className={`flex-1 py-2.5 rounded-md text-xs font-bold transition-all text-center min-h-[44px] flex items-center justify-center ${
            mobileTab === 'yield' 
              ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs' 
              : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
          }`}
        >
          📊 Balans
        </button>
      </div>

      {/* SECTION 1: Hosil Rejasi vs Haqiqiy Hosil Bar Comparison Chart */}
      <div className={`bg-white p-5 sm:p-6 rounded-lg border border-[#E2E8F0] shadow-xs ${mobileTab !== 'yield' ? 'hidden md:block' : 'block'}`}>
        <div className="flex flex-wrap items-center justify-between pb-3 sm:pb-4 border-b border-[#E2E8F0] gap-2">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
              <span>Hosil Rejasi va Haqiqiy Hosil Taqqoslash Grafigi</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">Ekinlar kesimida prognoz va amaldagi hosil (tonna)</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#3B82F6]"></span>
              <span className="text-[#64748B]">Kutilgan Reja</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#0F172A]"></span>
              <span className="text-[#64748B]">Haqiqiy Hosil</span>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3">
          {crops.map((crop) => {
            const actual = crop.actualYieldTons || 0;
            const planned = crop.expectedYieldTons;
            const percent = Math.round((actual / (planned || 1)) * 100);

            return (
              <div key={crop.id} className="p-3 sm:p-3.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[#0F172A] capitalize">
                    {crop.cropType === 'limon' ? '🍋 Limon' : crop.cropType === 'anor' ? '🍷 Anor' : crop.cropType === 'uzum' ? '🍇 Uzum' : '🌾 Bugʻdoy'} ({crop.areaGa} ga)
                  </span>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-[#3B82F6] font-semibold text-[11px] sm:text-xs">Reja: {planned}t</span>
                    <span className="text-[#0F172A] font-semibold text-[11px] sm:text-xs">Amalda: {actual}t</span>
                    <span className="font-bold text-[#0F172A] bg-white px-2 py-0.5 rounded text-[10px] border border-[#E2E8F0]">
                      {percent}%
                    </span>
                  </div>
                </div>

                {/* Comparative Double Bars */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-200 rounded-xs h-2 overflow-hidden">
                    <div 
                      className="bg-[#3B82F6] h-2 rounded-xs" 
                      style={{ width: `${Math.min(100, (planned / 40) * 100)}%` }} 
                      title={`Reja: ${planned} tonna`}
                    />
                  </div>
                  <div className="w-full bg-slate-200 rounded-xs h-2 overflow-hidden">
                    <div 
                      className="bg-[#0F172A] h-2 rounded-xs" 
                      style={{ width: `${Math.min(100, (actual / 40) * 100)}%` }} 
                      title={`Amalda: ${actual} tonna`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Ekin Maydonlari (Mobile Cards + Desktop Table) */}
      <div className={`bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden ${mobileTab !== 'crops' ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#3B82F6]" />
              <span>Ekin Maydonlari Roʻyxati ({crops.length})</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5 hidden sm:block">Ekin turi, maydoni, koordinatalari va holati monitoringi</p>
          </div>
          <button
            onClick={() => setIsAddCropOpen(true)}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Ekin</span>
          </button>
        </div>

        {/* 📱 MOBILE CARD VIEW (Phones < 768px) */}
        <div className="md:hidden divide-y divide-[#E2E8F0]">
          {crops.map((crop) => (
            <div key={crop.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {crop.cropType === 'limon' ? '🍋' : crop.cropType === 'anor' ? '🍷' : crop.cropType === 'uzum' ? '🍇' : '🌾'}
                    </span>
                    <h4 className="font-bold text-sm text-[#0F172A] capitalize">
                      {crop.cropType === 'limon' ? 'Limon (Meyeri)' : crop.cropType}
                    </h4>
                  </div>
                  {crop.notes && <p className="text-xs text-[#64748B] mt-0.5">{crop.notes}</p>}
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  crop.healthStatus === 'yaxshi' 
                    ? 'bg-blue-50 text-[#3B82F6] border border-blue-200' 
                    : crop.healthStatus === 'ortacha' 
                    ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {crop.healthStatus === 'yaxshi' ? 'Yaxshi' : crop.healthStatus === 'ortacha' ? 'Oʻrtacha' : 'Yomon'}
                </span>
              </div>

              {/* Mobile Specs Row */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-[#F8FAFC] p-2.5 rounded-md border border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] text-[#64748B] block uppercase font-bold">Maydoni</span>
                  <strong className="text-[#0F172A]">{crop.areaGa} gektar</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block uppercase font-bold">Hosil Rejasi</span>
                  <strong className="text-[#3B82F6]">{crop.expectedYieldTons} tonna</strong>
                </div>
                <div className="col-span-2 pt-1 border-t border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block uppercase font-bold">Geo-koordinatalar</span>
                  <span className="font-mono text-[#334155] text-[11px]">
                    📍 {crop.coordinates.lat.toFixed(4)}, {crop.coordinates.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#64748B]">Ekilgan: {crop.plantedDate}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#3B82F6] border border-blue-200 rounded text-xs font-semibold flex items-center gap-1"
                  >
                    <Camera className="w-3 h-3" />
                    <span>AI Tahlil</span>
                  </button>
                  <button
                    onClick={() => deleteCrop(crop.id)}
                    className="p-1 text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded"
                    title="Oʻchirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 💻 DESKTOP TABLE VIEW (Screens >= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-bold text-[10px] tracking-wider border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Ekin Turi</th>
                <th className="py-3 px-4">Maydon (ga)</th>
                <th className="py-3 px-4">Koordinatalar (GeoJSON)</th>
                <th className="py-3 px-4">Ekilgan Sana</th>
                <th className="py-3 px-4">Kutilgan Hosil</th>
                <th className="py-3 px-4">Holati</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {crops.map((crop) => (
                <tr key={crop.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0F172A] capitalize flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
                      {crop.cropType === 'limon' ? 'Limon (Meyeri)' : crop.cropType === 'anor' ? 'Anor' : crop.cropType === 'uzum' ? 'Uzum' : 'Bugʻdoy'}
                    </div>
                    {crop.notes && <p className="text-[11px] text-[#64748B] mt-0.5">{crop.notes}</p>}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#0F172A]">{crop.areaGa} ga</td>
                  <td className="py-3.5 px-4 font-mono text-[#334155]">
                    <span className="bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded text-[11px]">
                      {crop.coordinates.lat.toFixed(4)}, {crop.coordinates.lng.toFixed(4)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#334155]">{crop.plantedDate}</td>
                  <td className="py-3.5 px-4 text-[#0F172A] font-semibold">{crop.expectedHarvest}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      crop.healthStatus === 'yaxshi' 
                        ? 'bg-blue-50 text-[#3B82F6] border border-blue-200' 
                        : crop.healthStatus === 'ortacha' 
                        ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {crop.healthStatus === 'yaxshi' ? 'Yaxshi' : crop.healthStatus === 'ortacha' ? 'Oʻrtacha' : 'Yomon'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => deleteCrop(crop.id)}
                      className="p-1.5 text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Oʻchirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Chorva Ro'yxati (Mobile Cards + Desktop Table) */}
      <div className={`bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden ${mobileTab !== 'livestock' ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
              <Wheat className="w-4 h-4 text-amber-600" />
              <span>Chorva Roʻyxati Jadvali ({livestock.length})</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5 hidden sm:block">Hayvon turi, soni, yoshi, salomatligi va oxirgi veterinariya tekshiruvi</p>
          </div>
          <button
            onClick={() => setIsAddLivestockOpen(true)}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Chorva</span>
          </button>
        </div>

        {/* 📱 MOBILE CARD VIEW FOR LIVESTOCK */}
        <div className="md:hidden divide-y divide-[#E2E8F0]">
          {livestock.map((item) => (
            <div key={item.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A] capitalize flex items-center gap-1.5">
                    <span>
                      {item.animalType === 'sigir' ? '🐄' : item.animalType === 'qoy' ? '🐑' : item.animalType === 'tovuq' ? '🐔' : '🐎'}
                    </span>
                    <span>
                      {item.animalType === 'sigir' ? 'Qoramol (Sigir)' : item.animalType === 'qoy' ? 'Qoʻy / Echki' : item.animalType === 'tovuq' ? 'Parranda' : 'Ot'}
                    </span>
                  </h4>
                  <span className="text-xs text-[#64748B]">Birka: {item.tagNumber || '—'}</span>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  item.healthStatus === 'soglom' 
                    ? 'bg-blue-50 text-[#3B82F6] border border-blue-200' 
                    : item.healthStatus === 'homilador' 
                    ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                    : item.healthStatus === 'emlangan'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {item.healthStatus === 'soglom' ? 'Sogʻlom' : item.healthStatus === 'homilador' ? 'Boʻgʻoz' : item.healthStatus === 'emlangan' ? 'Emlangan' : 'Kasal'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-[#F8FAFC] p-2.5 rounded-md border border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] text-[#64748B] block uppercase font-bold">Bosh Soni</span>
                  <strong className="text-[#0F172A] text-sm">{item.count} bosh</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block uppercase font-bold">Yoshi</span>
                  <strong className="text-[#334155]">{item.ageMonths} oylik</strong>
                </div>
                <div className="col-span-2 pt-1 border-t border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block uppercase font-bold">Oxirgi Tekshiruv</span>
                  <span className="text-[#334155]">{item.lastCheckup}</span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => deleteLivestock(item.id)}
                  className="p-1 text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Oʻchirish</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 💻 DESKTOP TABLE FOR LIVESTOCK */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-bold text-[10px] tracking-wider border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Hayvon Turi</th>
                <th className="py-3 px-4">Soni (bosh)</th>
                <th className="py-3 px-4">Yoshi (oy)</th>
                <th className="py-3 px-4">Holati</th>
                <th className="py-3 px-4">Oxirgi Tekshiruv</th>
                <th className="py-3 px-4">Birka / Identifikator</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {livestock.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F172A] capitalize">
                    {item.animalType === 'sigir' ? '🐄 Qoramol (Sigir)' : item.animalType === 'qoy' ? '🐑 Qoʻy / Echki' : item.animalType === 'tovuq' ? '🐔 Parranda' : '🐎 Ot'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#0F172A]">{item.count} bosh</td>
                  <td className="py-3.5 px-4 text-[#334155]">{item.ageMonths} oylik</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.healthStatus === 'soglom' 
                        ? 'bg-blue-50 text-[#3B82F6] border border-blue-200' 
                        : item.healthStatus === 'homilador' 
                        ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                        : item.healthStatus === 'emlangan'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {item.healthStatus === 'soglom' ? 'Sogʻlom' : item.healthStatus === 'homilador' ? 'Boʻgʻoz' : item.healthStatus === 'emlangan' ? 'Emlangan' : 'Kasal'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#334155]">{item.lastCheckup}</td>
                  <td className="py-3.5 px-4 font-mono text-[#64748B]">{item.tagNumber || '—'}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => deleteLivestock(item.id)}
                      className="p-1.5 text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Oʻchirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsive Modal: Yangi Ekin Maydoni Qo'shish */}
      {isAddCropOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsAddCropOpen(false); }}
          className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div className="bg-white dark:bg-slate-900 rounded-t-xl sm:rounded-lg max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#E2E8F0] dark:border-slate-800 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#0F172A] dark:text-white">Yangi Ekin Maydoni Qoʻshish</h3>
              <button onClick={() => setIsAddCropOpen(false)} className="text-[#64748B] hover:text-[#0F172A] dark:hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCrop} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Ekin turi</label>
                  <select 
                    value={newCropType}
                    onChange={(e) => setNewCropType(e.target.value as any)}
                    className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                  >
                    <option value="limon">Limon (Sitrus)</option>
                    <option value="anor">Anor</option>
                    <option value="uzum">Uzum</option>
                    <option value="bugdoy">Bugʻdoy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Maydoni (ga)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={newAreaGa} 
                    onChange={(e) => setNewAreaGa(e.target.value)}
                    className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Koordinata Lat</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    value={newLat} 
                    onChange={(e) => setNewLat(e.target.value)}
                    className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Koordinata Lng</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    value={newLng} 
                    onChange={(e) => setNewLng(e.target.value)}
                    className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Ekilgan sana</label>
                  <input 
                    type="date" 
                    value={newPlantedDate} 
                    onChange={(e) => setNewPlantedDate(e.target.value)}
                    className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Kutilayotgan hosil sanasi</label>
                  <input 
                    type="date" 
                    value={newHarvestDate} 
                    onChange={(e) => setNewHarvestDate(e.target.value)}
                    className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Kutilgan hosil (tonna)</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    value={newExpectedYield} 
                    onChange={(e) => setNewExpectedYield(e.target.value)}
                    className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Holati</label>
                  <select 
                    value={newHealth}
                    onChange={(e) => setNewHealth(e.target.value as any)}
                    className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                  >
                    <option value="yaxshi">Yaxshi (Yuqori unumdorlik)</option>
                    <option value="ortacha">Oʻrtacha (Parvarish talab)</option>
                    <option value="yomon">Yomon (Kasallik/Zararkunanda)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Izoh / Nav maʼlumotlari</label>
                <input 
                  type="text" 
                  placeholder="Masalan: Meyeri navli limon issiqxonasi"
                  value={newCropNotes}
                  onChange={(e) => setNewCropNotes(e.target.value)}
                  className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCropOpen(false)}
                  className="px-4 py-2.5 border border-[#E2E8F0] dark:border-slate-700 text-[#334155] dark:text-slate-300 rounded-md font-medium hover:bg-[#F8FAFC] dark:hover:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-md font-semibold transition-colors"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive Modal: Yangi Chorva Qo'shish */}
      {isAddLivestockOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsAddLivestockOpen(false); }}
          className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div className="bg-white dark:bg-slate-900 rounded-t-xl sm:rounded-lg max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#E2E8F0] dark:border-slate-800 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#0F172A] dark:text-white">Yangi Chorva Boshlarini Qoʻshish</h3>
              <button onClick={() => setIsAddLivestockOpen(false)} className="text-[#64748B] hover:text-[#0F172A] dark:hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLivestock} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Hayvon turi</label>
                  <select 
                    value={newAnimalType}
                    onChange={(e) => setNewAnimalType(e.target.value as any)}
                    className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                  >
                    <option value="sigir">Qoramol (Sigir / Buqa)</option>
                    <option value="qoy">Qoʻy / Echki</option>
                    <option value="tovuq">Parranda (Tovuq)</option>
                    <option value="ot">Ot</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Bosh soni</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={newCount} 
                    onChange={(e) => setNewCount(e.target.value)}
                    className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Yoshi (oy hisobida)</label>
                  <input 
                    type="number" 
                    value={newAgeMonths} 
                    onChange={(e) => setNewAgeMonths(e.target.value)}
                    className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Holati</label>
                  <select 
                    value={newAnimalHealth}
                    onChange={(e) => setNewAnimalHealth(e.target.value as any)}
                    className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                  >
                    <option value="soglom">Sogʻlom</option>
                    <option value="homilador">Homilador (Boʻgʻoz)</option>
                    <option value="emlangan">Emlangan</option>
                    <option value="kasal">Kasal / Nazoratda</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Oxirgi tekshiruv sanasi</label>
                  <input 
                    type="date" 
                    value={newCheckupDate} 
                    onChange={(e) => setNewCheckupDate(e.target.value)}
                    className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F172A] dark:text-slate-200 mb-1">Birka raqami / Kod</label>
                  <input 
                    type="text" 
                    value={newTagNumber} 
                    onChange={(e) => setNewTagNumber(e.target.value)}
                    placeholder="UZ-YZ-0104"
                    className="w-full p-2.5 border border-[#CBD5E1] dark:border-slate-700 rounded-md bg-[#F8FAFC] dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLivestockOpen(false)}
                  className="px-4 py-2.5 border border-[#E2E8F0] dark:border-slate-700 text-[#334155] dark:text-slate-300 rounded-md font-medium hover:bg-[#F8FAFC] dark:hover:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#0F172A] dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-md font-semibold transition-colors"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
