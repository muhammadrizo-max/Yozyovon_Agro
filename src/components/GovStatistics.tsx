import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  Printer, 
  Layers, 
  Users, 
  ArrowUpDown, 
  ExternalLink,
  Search,
  Sparkles,
  TrendingUp,
  PieChart as PieIcon,
  Activity,
  Droplets,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { MFYData } from '../types';

export const GovStatistics: React.FC = () => {
  const { mfyList, selectMfy, exportToCsv, registeredFarmers, subsidies } = useApp();
  const [sortField, setSortField] = useState<keyof MFYData>('limonDaraxtlari');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterSearch, setFilterSearch] = useState('');
  const [chartViewMode, setChartViewMode] = useState<'all' | 'limon' | 'chorva' | 'maydon'>('all');

  // Aggregated totals
  const totalLimon = useMemo(() => (mfyList || []).reduce((acc, curr) => acc + (curr.limonDaraxtlari || 0), 0), [mfyList]);
  const totalChorva = useMemo(() => (mfyList || []).reduce((acc, curr) => acc + (curr.chorvaBoshlari || 0), 0), [mfyList]);
  const totalMaydon = useMemo(() => (mfyList || []).reduce((acc, curr) => acc + (curr.dehqonchilikGa || 0), 0), [mfyList]);
  const totalFarmers = useMemo(() => (mfyList || []).reduce((acc, curr) => acc + (curr.farmersCount || 0), 0), [mfyList]);

  // Safely calculate pending subsidies and registered farmers count
  const pendingSubsidiesCount = useMemo(() => {
    return (subsidies || []).filter(s => s.status === 'kutilmoqda').length;
  }, [subsidies]);

  // Top 10 MFY Data for Bar Charts
  const topMfyData = useMemo(() => {
    return [...(mfyList || [])]
      .sort((a, b) => b.limonDaraxtlari - a.limonDaraxtlari)
      .slice(0, 10)
      .map(m => ({
        name: m.name.replace(' MFY', '').replace(' mahalla fuqarolar yigʻini', ''),
        limon: m.limonDaraxtlari,
        chorva: m.chorvaBoshlari,
        maydon: m.dehqonchilikGa,
        fermerlar: m.farmersCount
      }));
  }, [mfyList]);

  // Sector breakdown data
  const sectorData = useMemo(() => {
    const sectors: Record<number, { sector: string; maydon: number; limon: number; chorva: number; mfyCount: number }> = {
      1: { sector: '1-Sektor (Hokim)', maydon: 0, limon: 0, chorva: 0, mfyCount: 0 },
      2: { sector: '2-Sektor (Prokuror)', maydon: 0, limon: 0, chorva: 0, mfyCount: 0 },
      3: { sector: '3-Sektor (IIV)', maydon: 0, limon: 0, chorva: 0, mfyCount: 0 },
      4: { sector: '4-Sektor (Soliq)', maydon: 0, limon: 0, chorva: 0, mfyCount: 0 },
    };

    mfyList.forEach(m => {
      const s = m.sektor || (m.id % 4 + 1);
      if (sectors[s]) {
        sectors[s].maydon += m.dehqonchilikGa;
        sectors[s].limon += m.limonDaraxtlari;
        sectors[s].chorva += m.chorvaBoshlari;
        sectors[s].mfyCount += 1;
      }
    });

    return Object.values(sectors);
  }, [mfyList]);

  // Monthly yield and dynamic growth trend (Line / Area chart data)
  const monthlyTrendData = useMemo(() => [
    { oy: 'Yan', hosil: 420, suv: 110, eksport: 85 },
    { oy: 'Fev', hosil: 580, suv: 140, eksport: 120 },
    { oy: 'Mar', hosil: 890, suv: 210, eksport: 240 },
    { oy: 'Apr', hosil: 1250, suv: 320, eksport: 390 },
    { oy: 'May', hosil: 1780, suv: 460, eksport: 580 },
    { oy: 'Iyn', hosil: 2400, suv: 590, eksport: 820 },
    { oy: 'Iyl', hosil: 2950, suv: 680, eksport: 1150 },
    { oy: 'Avg', hosil: 3400, suv: 620, eksport: 1480 },
    { oy: 'Sen', hosil: 4100, suv: 510, eksport: 1920 },
    { oy: 'Okt', hosil: 4850, suv: 380, eksport: 2350 },
    { oy: 'Noy', hosil: 5400, suv: 220, eksport: 2780 },
    { oy: 'Dek', hosil: 5900, suv: 150, eksport: 3100 },
  ], []);

  // Land distribution for Pie Chart
  const landDistribution = useMemo(() => [
    { name: 'Issiqxona va Limonchilik', value: 38, color: '#F59E0B' },
    { name: 'Bogʻdorchilik & Mevalar', value: 24, color: '#10B981' },
    { name: 'Don va Gʻallachilik', value: 20, color: '#3B82F6' },
    { name: 'Sabzavot va Poliz', value: 12, color: '#8B5CF6' },
    { name: 'Boshqa Ekin Maydonlari', value: 6, color: '#64748B' },
  ], []);

  // Sorted list for Table
  const sortedMfyList = useMemo(() => {
    return [...mfyList]
      .filter(m => m.name.toLowerCase().includes(filterSearch.toLowerCase()))
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'desc' ? valB - valA : valA - valB;
        }
        return 0;
      });
  }, [mfyList, filterSearch, sortField, sortDirection]);

  const handleSort = (field: keyof MFYData) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportAll = () => {
    const headers = ['MFY Nomi', 'Sektor', 'Dehqonchilik Maydoni (ga)', 'Limon Daraxtlari (dona)', 'Chorva Boshlari (bosh)', 'Fermer Xo\'jaliklari'];
    const rows = sortedMfyList.map(m => [
      m.name,
      `${m.sektor || (m.id % 4 + 1)}-sektor`,
      m.dehqonchilikGa,
      m.limonDaraxtlari,
      m.chorvaBoshlari,
      m.farmersCount
    ]);
    exportToCsv('Yozyovon_tumani_batafsil_statistika', headers, rows);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12" id="gov-statistics-view">
      
      {/* Title Card */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-[#E2E8F0] dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] dark:text-white flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span>Yozyovon Tumani Agro-Statistik Tahliliy Markazi</span>
          </h2>
          <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
            33 ta MFY boʻyicha limonchilik, chorvachilik, ekin maydonlari va fermerlar dinamikasi (Recharts interaktiv vizualizatsiyasi)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAll}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-white hover:bg-[#F8FAFC] rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            id="export-statistics-btn"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel / CSV Eksport</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            id="print-statistics-btn"
          >
            <Printer className="w-4 h-4" />
            <span>Chop Etish</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Indicator Cards (Boshqaruv markazidan ko'chirilgan asosiy statistik ko'rsatkichlar) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Jami Limon Daraxtlari</span>
            <div className="p-1.5 bg-amber-50 dark:bg-amber-950/60 rounded-md text-amber-500">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white mt-2">
            {totalLimon.toLocaleString()} <span className="text-xs font-normal text-[#64748B] dark:text-slate-400">tup</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 33 ta MFY boʻyicha toʻliq hisob
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Chorva Boshlari</span>
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/60 rounded-md text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white mt-2">
            {totalChorva.toLocaleString()} <span className="text-xs font-normal text-[#64748B] dark:text-slate-400">bosh</span>
          </div>
          <span className="text-[11px] text-[#64748B] dark:text-slate-400 block mt-1">
            Qoramol, mayda tuyoqli va parrandalar
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Dehqonchilik Maydoni</span>
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-md text-emerald-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white mt-2">
            {totalMaydon.toLocaleString()} <span className="text-xs font-normal text-[#64748B] dark:text-slate-400">ga</span>
          </div>
          <span className="text-[11px] text-[#64748B] dark:text-slate-400 block mt-1">
            {totalFarmers.toLocaleString()} ta fermer va dehqon xoʻjaligi
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Arizalar & Subsidiyalar</span>
            <div className="p-1.5 bg-rose-50 dark:bg-rose-950/60 rounded-md text-rose-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white mt-2">
            {pendingSubsidiesCount} <span className="text-xs font-normal text-[#64748B] dark:text-slate-400">ta kutilmoqda</span>
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold block mt-1">
            Monitoring va koʻrib chiqishda
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 📊 INTERACTIVE CHARTS & DIAGRAMS (Recharts) */}
      {/* ======================================================== */}

      {/* ROW 1: Bar Chart (Top 10 MFY) & Pie Chart (Ekin Yerlari Taqsimoti) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top 10 MFY Bar Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-[#E2E8F0] dark:border-slate-800 shadow-xs">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-slate-800 gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A] dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                <span>Top 10 MFY: Limon Daraxtlari va Chorvachilik Solishtirmasi</span>
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5">
                Eng yirik dehqonchilik salohiyatiga ega boʻlgan hududlar koʻrsatkichi
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
              <button
                onClick={() => setChartViewMode('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${chartViewMode === 'all' ? 'bg-white dark:bg-slate-700 text-[#0F172A] dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Barchasi
              </button>
              <button
                onClick={() => setChartViewMode('limon')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${chartViewMode === 'limon' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Faqat Limon
              </button>
              <button
                onClick={() => setChartViewMode('chorva')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${chartViewMode === 'chorva' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Faqat Chorva
              </button>
            </div>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMfyData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis 
                  dataKey="name" 
                  angle={-30} 
                  textAnchor="end" 
                  interval={0} 
                  tick={{ fontSize: 10, fill: '#64748B' }} 
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    color: '#fff', 
                    borderRadius: '8px', 
                    fontSize: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }} 
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                {(chartViewMode === 'all' || chartViewMode === 'limon') && (
                  <Bar 
                    dataKey="limon" 
                    name="Limon Daraxtlari (tup)" 
                    fill="#F59E0B" 
                    radius={[4, 4, 0, 0]} 
                    animationDuration={1000}
                  />
                )}
                {(chartViewMode === 'all' || chartViewMode === 'chorva') && (
                  <Bar 
                    dataKey="chorva" 
                    name="Chorva Boshlari (bosh)" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]} 
                    animationDuration={1000}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Land Distribution Pie Chart (1 Col) */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-[#E2E8F0] dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
            <h3 className="font-bold text-sm text-[#0F172A] dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-600" />
              <span>Ekin Maydonlari Ulush Taqsimoti</span>
            </h3>
            <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5">
              Yozyovon dehqonchiligidagi ixtisoslashuv darajasi
            </p>
          </div>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={landDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {landDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Ulush']}
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    color: '#fff', 
                    borderRadius: '8px', 
                    fontSize: '12px' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Stat */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-[#0F172A] dark:text-white">100%</span>
              <span className="text-[10px] text-[#64748B] uppercase font-bold">Hisoblangan</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
            {landDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#334155] dark:text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-[#0F172A] dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ROW 2: Monthly Yield Growth Trend (Area / Line Chart) & 4 Sectors Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Trend Area Chart */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-[#E2E8F0] dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A] dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Yillik Hosildorlik va Eksport Oʻsish Dinamikasi</span>
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5">
                Oylar kesimida yetishtirilgan mahsulot va eksport hajmi (tonna)
              </p>
            </div>
            <div className="text-[10px] px-2 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded">
              +28% Oʻsish
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHosil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorEksport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="oy" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    color: '#fff', 
                    borderRadius: '8px', 
                    fontSize: '12px',
                    border: 'none' 
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="hosil" 
                  name="Jami Hosil (tonna)" 
                  stroke="#10B981" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorHosil)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="eksport" 
                  name="Tashqi Eksport (tonna)" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorEksport)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4 Sectors Breakdown Chart */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-[#E2E8F0] dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A] dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>4 ta Davlat Sektori Boʻyicha Qiyosiy Koʻrsatkich</span>
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5">
                Hokim, Prokuror, IIV va Soliq sektorlari oʻrtasidagi mutanosiblik
              </p>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 dark:bg-purple-950 px-2 py-1 rounded">
              33 MFY
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} margin={{ top: 10, right: 10, left: -10, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="sector" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    color: '#fff', 
                    borderRadius: '8px', 
                    fontSize: '12px' 
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="limon" name="Limon Daraxtlari (tup)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="maydon" name="Ekin Maydoni (ga)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="chorva" name="Chorva Boshlari" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 📋 MFY LAR BO'YICHA TO'LIQ STATISTIK JADVAL */}
      {/* ======================================================== */}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-[#E2E8F0] dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input 
            type="text"
            placeholder="MFY nomi boʻyicha tezkor qidiruv..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAFC] dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0F172A] text-[#0F172A] dark:text-white"
            id="search-statistics-input"
          />
        </div>

        <div className="text-xs text-[#64748B] dark:text-slate-400">
          Koʻrsatilmoqda: <b className="text-[#0F172A] dark:text-white">{sortedMfyList.length} ta MFY</b> (Jami 33 ta)
        </div>
      </div>

      {/* Main Consolidated Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#E2E8F0] dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] dark:bg-slate-800/80 text-[#64748B] dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-[#E2E8F0] dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">T/r</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-[#0F172A] dark:hover:text-white" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>MFY Nomi</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Sektor</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-[#0F172A] dark:hover:text-white" onClick={() => handleSort('limonDaraxtlari')}>
                  <div className="flex items-center gap-1">
                    <span>Limon Daraxtlari</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-[#0F172A] dark:hover:text-white" onClick={() => handleSort('chorvaBoshlari')}>
                  <div className="flex items-center gap-1">
                    <span>Chorva Boshlari</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-[#0F172A] dark:hover:text-white" onClick={() => handleSort('dehqonchilikGa')}>
                  <div className="flex items-center gap-1">
                    <span>Ekin Maydoni (ga)</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Fermerlar</th>
                <th className="py-3.5 px-4">Yetakchi Ekinlar</th>
                <th className="py-3.5 px-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
              {sortedMfyList.map((mfy, idx) => {
                const sektorNum = mfy.sektor || (mfy.id % 4 + 1);
                return (
                  <tr key={mfy.id} className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#64748B]">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        mfy.limonDaraxtlari >= 10000 ? 'bg-amber-500' : mfy.limonDaraxtlari >= 5000 ? 'bg-emerald-500' : 'bg-slate-400'
                      }`} />
                      <span>{mfy.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {sektorNum}-sektor
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400 text-sm">
                      {mfy.limonDaraxtlari.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#334155] dark:text-slate-300">
                      {mfy.chorvaBoshlari.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#334155] dark:text-slate-300">
                      {mfy.dehqonchilikGa} ga
                    </td>
                    <td className="py-3 px-4 text-[#64748B]">
                      {mfy.farmersCount} ta
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {mfy.asosiyEkinlar.map((c, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-slate-200 rounded-md text-[10px] font-medium border border-[#E2E8F0] dark:border-slate-700">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => selectMfy(mfy.id)}
                        className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-[#F8FAFC] text-[#0F172A] dark:text-white border border-[#CBD5E1] dark:border-slate-700 font-semibold rounded-md transition-colors inline-flex items-center gap-1 text-xs shadow-xs"
                      >
                        <span>Batafsil</span>
                        <ExternalLink className="w-3 h-3 text-[#3B82F6]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
