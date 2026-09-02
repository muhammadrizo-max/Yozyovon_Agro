import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  FileSpreadsheet, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface GovAlertsAndProgramsProps {
  initialTab?: 'alerts' | 'programs';
}

export const GovAlertsAndPrograms: React.FC<GovAlertsAndProgramsProps> = ({ initialTab = 'alerts' }) => {
  const { mfyList, aiScans, selectMfy } = useApp();
  const [tab, setTab] = useState<'alerts' | 'programs'>(initialTab);

  // Aggregate all pest alerts from all MFYs
  const allPestAlerts = mfyList.flatMap(m => 
    m.pestAlerts.map(a => ({ ...a, mfyName: m.name, mfyId: m.id }))
  );

  // Critical scans reported to gov
  const criticalScans = aiScans.filter(s => s.severity === 'high');

  // Aggregate state programs
  const allPrograms = mfyList.flatMap(m => 
    m.statePrograms.map(p => ({ ...p, mfyName: m.name, mfyId: m.id }))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto" id="gov-alerts-and-programs-view">
      
      {/* Tab Switcher - Geometric Balance */}
      <div className="bg-white p-2.5 rounded-lg border border-[#E2E8F0] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('alerts')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2 ${
              tab === 'alerts' 
                ? 'bg-[#0F172A] text-white shadow-xs' 
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Ogohlantirishlar & Zararkunandalar ({allPestAlerts.length + criticalScans.length})</span>
          </button>
          <button
            onClick={() => setTab('programs')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2 ${
              tab === 'programs' 
                ? 'bg-[#0F172A] text-white shadow-xs' 
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Davlat Dasturlari & Subsidiyalar ({allPrograms.length})</span>
          </button>
        </div>

        <span className="text-xs text-[#64748B] font-medium hidden sm:block pr-2">
          Yozyovon tumani Davlat Agroinspeksiyasi
        </span>
      </div>

      {tab === 'alerts' ? (
        <div className="space-y-6">
          
          {/* Urgent AI Scan Reports from Farmers */}
          <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Dehqonlardan Kelgan Shoshilinch AI Diagnostika Xabarlari</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Dehqonlar AI Skaner orqali aniqlagan yuqori xavfli kasalliklar toʻgʻrisida real vaqt signallari
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                {criticalScans.length} ta xavfli holat
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {criticalScans.map(scan => (
                <div key={scan.id} className="p-3.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex gap-4 text-xs">
                  <img 
                    src={scan.imageUrl} 
                    alt={scan.diseaseName} 
                    className="w-16 h-16 rounded-md object-cover border border-[#E2E8F0] shrink-0" 
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0F172A] text-sm">{scan.diseaseName}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">
                        {scan.confidence}% ishonch
                      </span>
                    </div>
                    <p className="text-[#334155] mt-1 line-clamp-2">
                      {scan.recommendations}
                    </p>
                    <div className="mt-2 text-[#64748B] text-[11px]">
                      Sana: {scan.scannedAt} • Hudud: Yozyovon tumani (MFY #{scan.mfyId})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Pest Alerts List */}
          <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#0F172A] pb-3 border-b border-[#E2E8F0] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Tuman MFYlari Boʻyicha Faol Agrotexnik Ogohlantirishlar</span>
            </h3>

            <div className="mt-4 space-y-3">
              {allPestAlerts.map(alert => (
                <div key={alert.id} className="p-4 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0F172A]">{alert.title}</span>
                      <span className="font-bold text-[10px] uppercase tracking-wider text-[#0F172A] bg-white border border-[#CBD5E1] px-2 py-0.5 rounded">
                        {alert.mfyName}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B]">{alert.date}</span>
                  </div>

                  <p className="text-[#334155] mt-2 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="mt-3 p-2.5 rounded bg-white border border-[#E2E8F0] text-[#0F172A]">
                    <b className="uppercase text-[10px] tracking-wider text-[#64748B] block mb-0.5">Koʻrilishi lozim boʻlgan chora:</b>
                    <span>{alert.recommendedAction}</span>
                  </div>

                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => selectMfy(alert.mfyId)}
                      className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1"
                    >
                      <span>{alert.mfyName} statistikasiga oʻtish</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* State Programs Section */
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#3B82F6]" />
                  <span>Amaldagi Davlat Dasturlari va Moliyaviy Subsidiyalar</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  "Yashil makon", "Obod qishloq" va Sitruschilikni rivojlantirish dasturlari ijrosi
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F172A] bg-[#F8FAFC] px-2.5 py-1 rounded border border-[#E2E8F0]">
                Jami: {allPrograms.length} ta loyiha
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPrograms.map(prog => (
                <div key={prog.id} className="p-4 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#0F172A] text-sm line-clamp-1">{prog.title}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#3B82F6] border border-blue-100">
                        {prog.status === 'faol' ? 'Faol' : 'Reja'}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] bg-white border border-[#E2E8F0] px-2 py-0.5 rounded inline-block mb-2">
                      📍 {prog.mfyName}
                    </span>

                    <p className="text-[#334155] leading-relaxed mb-3">
                      {prog.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E2E8F0] space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Ajratilgan byudjet:</span>
                      <b className="text-[#0F172A]">{prog.budget}</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Qamrab olingan dehqonlar:</span>
                      <b className="text-[#0F172A]">{prog.beneficiariesCount} xoʻjalik</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Muddat:</span>
                      <b className="text-[#64748B]">{prog.deadline}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
