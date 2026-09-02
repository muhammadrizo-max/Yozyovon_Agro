import React, { useState } from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  Printer, 
  TreePine, 
  Wheat, 
  Layers, 
  Users, 
  ArrowUpDown, 
  ExternalLink,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MFYData } from '../types';

export const GovStatistics: React.FC = () => {
  const { mfyList, selectMfy, exportToCsv } = useApp();
  const [sortField, setSortField] = useState<keyof MFYData>('limonDaraxtlari');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterSearch, setFilterSearch] = useState('');

  const sortedMfyList = [...mfyList]
    .filter(m => m.name.toLowerCase().includes(filterSearch.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'desc' ? valB - valA : valA - valB;
      }
      return 0;
    });

  const handleSort = (field: keyof MFYData) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportAll = () => {
    const headers = ['MFY Nomi', 'Dehqonchilik Maydoni (ga)', 'Limon Daraxtlari (dona)', 'Chorva Boshlari (bosh)', 'Fermer Xo\'jaliklari'];
    const rows = sortedMfyList.map(m => [
      m.name,
      m.dehqonchilikGa,
      m.limonDaraxtlari,
      m.chorvaBoshlari,
      m.farmersCount
    ]);
    exportToCsv('Yozyovon_tumani_umumiy_statistika', headers, rows);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" id="gov-statistics-view">
      
      {/* Title Card - Geometric Balance */}
      <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#3B82F6]" />
            <span>Davlat Monitoringi: Tuman Umumiy Statistikasi</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Yozyovon tumanidagi 10 ta MFY boʻyicha qiyosiy dehqonchilik va chorvachilik tahlili
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAll}
            className="px-3.5 py-1.5 bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] rounded-md text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#3B82F6]" />
            <span>Excel / CSV Eksport</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-[#0F172A] text-white hover:bg-slate-800 rounded-md text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Chop Etish</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input 
            type="text"
            placeholder="MFY nomi boʻyicha filtrlash..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#0F172A] focus:bg-white text-[#0F172A]"
          />
        </div>

        <div className="text-xs text-[#64748B]">
          Koʻrsatilmoqda: <b className="text-[#0F172A]">{sortedMfyList.length} ta MFY</b>
        </div>
      </div>

      {/* Main Consolidated Table */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase text-[10px] tracking-wider font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">T/r</th>
                <th className="py-3 px-4 cursor-pointer hover:text-[#0F172A]" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>MFY Nomi</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-[#0F172A]" onClick={() => handleSort('limonDaraxtlari')}>
                  <div className="flex items-center gap-1">
                    <span>Limon Daraxtlari</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-[#0F172A]" onClick={() => handleSort('chorvaBoshlari')}>
                  <div className="flex items-center gap-1">
                    <span>Chorva Boshlari</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-[#0F172A]" onClick={() => handleSort('dehqonchilikGa')}>
                  <div className="flex items-center gap-1">
                    <span>Ekin Maydoni (ga)</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4">Fermerlar</th>
                <th className="py-3 px-4">Asosiy Ekinlar</th>
                <th className="py-3 px-4 text-right">Tahlil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {sortedMfyList.map((mfy, idx) => (
                <tr key={mfy.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#64748B]">{idx + 1}</td>
                  <td className="py-3 px-4 font-bold text-[#0F172A] flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-xs shrink-0 ${
                      mfy.limonDaraxtlari >= 10000 ? 'bg-[#3B82F6]' : mfy.limonDaraxtlari >= 5000 ? 'bg-amber-500' : 'bg-slate-400'
                    }`} />
                    <span>{mfy.name}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#0F172A] text-sm">
                    {mfy.limonDaraxtlari.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#334155]">
                    {mfy.chorvaBoshlari.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#334155]">
                    {mfy.dehqonchilikGa} ga
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">
                    {mfy.farmersCount} ta
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {mfy.asosiyEkinlar.map((c, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-[#F1F5F9] text-[#0F172A] rounded-xs text-[10px] font-medium border border-[#E2E8F0]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => selectMfy(mfy.id)}
                      className="px-2.5 py-1 bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] hover:border-[#0F172A] font-semibold rounded-md transition-colors inline-flex items-center gap-1 text-xs shadow-xs"
                    >
                      <span>Batafsil</span>
                      <ExternalLink className="w-3 h-3 text-[#3B82F6]" />
                    </button>
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
