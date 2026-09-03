import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Search, 
  Filter, 
  TreePine, 
  Wheat, 
  Layers, 
  ExternalLink, 
  ChevronRight,
  Info,
  Maximize2,
  Minimize2,
  Compass,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MFYData } from '../types';
import { YOZYOVON_KADASTR_DISTRICT_BOUNDARY, YOZYOVON_MAP_BOUNDS } from '../data/yozyovonData';

export const MFYMap: React.FC = () => {
  const { mfyList, selectMfy, userRole } = useApp();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [hoveredMfy, setHoveredMfy] = useState<MFYData | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Helper to determine color based on limon trees
  const getMfyColor = (limonDaraxtlari: number): { fill: string; border: string; text: string; label: string } => {
    if (limonDaraxtlari >= 10000) {
      return { 
        fill: '#22c55e', 
        border: '#15803d', 
        text: 'text-emerald-700',
        label: '> 10 000 (Yetakchi)' 
      };
    }
    if (limonDaraxtlari >= 5000) {
      return { 
        fill: '#eab308', 
        border: '#a16207', 
        text: 'text-amber-700',
        label: '5 000 - 10 000 (Oʻrta)' 
      };
    }
    return { 
      fill: '#ef4444', 
      border: '#b91c1c', 
      text: 'text-rose-700',
      label: '< 5 000 (Xavf/Past)' 
    };
  };

  // Filtered MFY list
  const filteredMfyList = mfyList.filter(mfy => {
    const matchesSearch = mfy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mfy.asosiyEkinlar.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (filterType === 'high') return mfy.limonDaraxtlari >= 10000;
    if (filterType === 'medium') return mfy.limonDaraxtlari >= 5000 && mfy.limonDaraxtlari < 10000;
    if (filterType === 'low') return mfy.limonDaraxtlari < 5000;
    return true;
  });

  // Calculate totals
  const totalLimon = mfyList.reduce((acc, m) => acc + m.limonDaraxtlari, 0);
  const totalChorva = mfyList.reduce((acc, m) => acc + m.chorvaBoshlari, 0);
  const totalMaydon = mfyList.reduce((acc, m) => acc + m.dehqonchilikGa, 0);

  // Initialize Leaflet Map with smooth zoom & strict Kadastr bounds
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [40.665, 71.650], // Yozyovon tumani markazi
        zoom: 12,
        minZoom: 11,
        maxZoom: 16,
        zoomDelta: 0.5,
        zoomSnap: 0.25,
        wheelPxPerZoomLevel: 100,
        maxBounds: YOZYOVON_MAP_BOUNDS,
        maxBoundsViscosity: 0.95,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; Yozyovon Tuman Kadastri & OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      // Official Kadastr District Boundary from User's Kadastr PDF
      const districtBoundary = L.polygon(YOZYOVON_KADASTR_DISTRICT_BOUNDARY, {
        color: '#0f172a',
        weight: 3.5,
        dashArray: '6, 6',
        fill: false,
        interactive: false
      });
      districtBoundary.addTo(map);

      // Fit bounds cleanly on initial render
      map.fitBounds(YOZYOVON_MAP_BOUNDS, { padding: [24, 24] });

      polygonsLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const resetDistrictView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(YOZYOVON_MAP_BOUNDS, { padding: [24, 24], maxZoom: 13, animate: true });
    }
  };

  // Update Polygon Layers when filtered list or mfyList changes
  useEffect(() => {
    if (!mapInstanceRef.current || !polygonsLayerGroupRef.current) return;

    polygonsLayerGroupRef.current.clearLayers();

    filteredMfyList.forEach(mfy => {
      const colorInfo = getMfyColor(mfy.limonDaraxtlari);

      // Create organic multi-vertex boundary polygon
      const polygon = L.polygon(mfy.polygonCoordinates, {
        color: colorInfo.border,
        weight: 2.5,
        fillColor: colorInfo.fill,
        fillOpacity: 0.45,
        className: 'cursor-pointer transition-all duration-300'
      });

      // Tooltip on hover
      const tooltipContent = `
        <div class="p-1 space-y-1">
          <div class="font-bold text-sm text-white flex items-center gap-1.5 border-b border-slate-700/60 pb-1">
            <span>🌿 ${mfy.name}</span>
          </div>
          <div class="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-slate-300 pt-0.5">
            <div>Maydon: <b class="text-white">${mfy.dehqonchilikGa} ga</b></div>
            <div>Limon: <b class="text-emerald-300">${mfy.limonDaraxtlari.toLocaleString()}</b></div>
            <div>Chorva: <b class="text-amber-300">${mfy.chorvaBoshlari.toLocaleString()}</b></div>
            <div>Fermerlar: <b class="text-white">${mfy.farmersCount}</b></div>
          </div>
          <div class="text-[11px] text-slate-400 mt-1">
            Asosiy: ${mfy.asosiyEkinlar.join(', ')}
          </div>
          <div class="text-[10px] text-emerald-400 font-semibold mt-1">
            👉 Batafsil ko'rish uchun bosing
          </div>
        </div>
      `;

      polygon.bindTooltip(tooltipContent, {
        sticky: true,
        className: 'custom-mfy-tooltip',
        direction: 'top'
      });

      // Hover events - only show hover div when cursor is over polygon
      polygon.on('mouseover', (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 4,
          fillOpacity: 0.75
        });
        setHoveredMfy(mfy);
      });

      polygon.on('mouseout', (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2.5,
          fillOpacity: 0.45
        });
        setHoveredMfy(null);
      });

      // Click event -> navigate to /mfy/{id}
      polygon.on('click', () => {
        selectMfy(mfy.id);
      });

      // Add center marker label
      const customLabelIcon = L.divIcon({
        className: 'custom-map-label',
        html: `
          <div class="px-2 py-0.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-900 dark:text-slate-100 font-bold text-[11px] rounded-md shadow-xs border border-slate-300 dark:border-slate-700 pointer-events-none whitespace-nowrap -translate-x-1/2 -translate-y-1/2">
            ${mfy.name}
          </div>
        `,
        iconSize: [0, 0]
      });

      const labelMarker = L.marker(mfy.center, { icon: customLabelIcon });

      polygonsLayerGroupRef.current?.addLayer(polygon);
      polygonsLayerGroupRef.current?.addLayer(labelMarker);
    });
  }, [filteredMfyList]);

  const handleMfyClick = (mfy: MFYData) => {
    selectMfy(mfy.id);
  };

  const focusMfyOnMap = (mfy: MFYData) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(mfy.center, 14, { animate: true });
    }
  };

  return (
    <div className="space-y-5" id="yozyovon-map-section">
      
      {/* Top Banner with Geometric Balance District Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-4 rounded-md text-center shadow-xs">
          <p className="text-2xl font-bold text-[#0F172A] dark:text-white">{mfyList.length}</p>
          <p className="text-[10px] text-[#64748B] dark:text-slate-400 uppercase font-semibold tracking-wider mt-1">Jami MFYlar</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-4 rounded-md text-center shadow-xs">
          <p className="text-2xl font-bold text-[#3B82F6]">{totalLimon.toLocaleString()}</p>
          <p className="text-[10px] text-[#64748B] dark:text-slate-400 uppercase font-semibold tracking-wider mt-1">Limon Daraxtlari (Dona)</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-4 rounded-md text-center shadow-xs">
          <p className="text-2xl font-bold text-[#0F172A] dark:text-white">{totalChorva.toLocaleString()}</p>
          <p className="text-[10px] text-[#64748B] dark:text-slate-400 uppercase font-semibold tracking-wider mt-1">Chorva Boshlari (Bosh)</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-4 rounded-md text-center shadow-xs">
          <p className="text-2xl font-bold text-[#0F172A] dark:text-white">{totalMaydon.toLocaleString()} <span className="text-xs font-normal text-[#64748B]">ga</span></p>
          <p className="text-[10px] text-[#64748B] dark:text-slate-400 uppercase font-semibold tracking-wider mt-1">Dehqonchilik Maydoni</p>
        </div>
      </div>

      {/* Map Control Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="MFY nomi yoki ekin turi boʻyicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6] focus:bg-white dark:focus:bg-slate-900 text-[#0F172A] dark:text-white"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-[#64748B] dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] mr-1 hidden sm:inline">Limon Zichligi:</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filterType === 'all' 
                ? 'bg-[#0F172A] dark:bg-slate-700 text-white shadow-xs' 
                : 'bg-[#F8FAFC] dark:bg-slate-800 text-[#64748B] dark:text-slate-300 hover:text-[#0F172A] border border-[#E2E8F0] dark:border-slate-700'
            }`}
          >
            Barchasi ({mfyList.length})
          </button>
          <button
            onClick={() => setFilterType('high')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filterType === 'high' 
                ? 'bg-[#3B82F6] text-white shadow-xs' 
                : 'bg-[#F8FAFC] dark:bg-slate-800 text-[#64748B] dark:text-slate-300 hover:text-[#3B82F6] border border-[#E2E8F0] dark:border-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            &gt; 10 000 daraxt
          </button>
          <button
            onClick={() => setFilterType('medium')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filterType === 'medium' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'bg-[#F8FAFC] dark:bg-slate-800 text-[#64748B] dark:text-slate-300 hover:text-amber-700 border border-[#E2E8F0] dark:border-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            5 000 - 10 000
          </button>
          <button
            onClick={() => setFilterType('low')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filterType === 'low' 
                ? 'bg-rose-600 text-white shadow-xs' 
                : 'bg-[#F8FAFC] dark:bg-slate-800 text-[#64748B] dark:text-slate-300 hover:text-rose-700 border border-[#E2E8F0] dark:border-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            &lt; 5 000 daraxt
          </button>
        </div>
      </div>

      {/* Map Container & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Left 3 Cols: Leaflet Interactive Map */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs overflow-hidden relative flex flex-col">
          
          {/* Map Header Instructions */}
          <div className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-slate-800 border-b border-[#E2E8F0] dark:border-slate-700 flex items-center justify-between text-xs text-[#64748B] dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#3B82F6]" />
              <span><b>Koʻrsatma:</b> MFY ustiga kursorni olib borib qisqa maʼlumot oling, batafsil tahlil uchun poligon ustiga bosing.</span>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex">
              <span className="text-[11px] text-[#94A3B8] dark:text-slate-400">Markaz: 40.665° N, 71.650° E (Yozyovon markazi)</span>
            </div>
          </div>

          {/* Leaflet Map Stage */}
          <div className="relative w-full h-[460px] sm:h-[550px]">
            <div 
              ref={mapContainerRef} 
              id="leaflet-yozyovon-map"
              className="w-full h-full z-10" 
            />

            {/* Quick Map Controls: Reset to Kadastr District View */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={resetDistrictView}
                className="px-3 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-md shadow-md border border-[#E2E8F0] dark:border-slate-700 text-xs font-semibold text-[#0F172A] dark:text-white flex items-center gap-1.5 hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95"
                title="Yozyovon tuman kadastr chegarasini ekranga toʻliq sigʻdirish"
              >
                <Compass className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Yozyovon Chegarasi</span>
              </button>
            </div>

            {/* Floating Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-md shadow-md border border-[#E2E8F0] dark:border-slate-700 text-xs space-y-1.5 max-w-[210px]">
              <p className="text-[10px] uppercase font-bold text-[#64748B] dark:text-slate-400 tracking-wider border-b border-[#E2E8F0] dark:border-slate-700 pb-1">Limonchilik Rangi</p>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-emerald-500 border border-emerald-600 shrink-0"></span>
                <span className="text-[#334155] dark:text-slate-200 text-xs">&gt; 10 000 dona (Yuqori)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-amber-500 border border-amber-600 shrink-0"></span>
                <span className="text-[#334155] dark:text-slate-200 text-xs">5 000 - 10 000 dona</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-rose-500 border border-rose-600 shrink-0"></span>
                <span className="text-[#334155] dark:text-slate-200 text-xs">&lt; 5 000 dona (Past)</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-[#E2E8F0] dark:border-slate-700">
                <span className="w-4 border-b-2 border-dashed border-slate-900 dark:border-white shrink-0"></span>
                <span className="text-[#334155] dark:text-slate-300 text-[11px] font-medium">Tuman chegarasi</span>
              </div>
            </div>

            {/* Live Hover Info Card on Map - ONLY rendered when cursor is hovering over MFY */}
            {hoveredMfy && (
              <div className="absolute top-4 right-4 z-20 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-lg border border-[#E2E8F0] dark:border-slate-700 text-xs max-w-xs animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-slate-700">
                  <span className="font-bold text-sm text-[#0F172A] dark:text-white">{hoveredMfy.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getMfyColor(hoveredMfy.limonDaraxtlari).text} bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700`}>
                    {hoveredMfy.limonDaraxtlari.toLocaleString()} limon
                  </span>
                </div>
                <div className="mt-2.5 space-y-1.5 text-[#64748B] dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Ekin maydoni:</span>
                    <b className="text-[#0F172A] dark:text-white">{hoveredMfy.dehqonchilikGa} ga</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Chorva boshlari:</span>
                    <b className="text-[#0F172A] dark:text-white">{hoveredMfy.chorvaBoshlari.toLocaleString()}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Asosiy ekinlar:</span>
                    <b className="text-[#0F172A] dark:text-white">{hoveredMfy.asosiyEkinlar.join(', ')}</b>
                  </div>
                </div>
                <button
                  onClick={() => selectMfy(hoveredMfy.id)}
                  className="mt-3 w-full py-2 bg-[#0F172A] dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white rounded font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Batafsil /mfy/{hoveredMfy.id} ga oʻtish</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: MFY List Quick Navigation */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs p-4 flex flex-col h-[500px] sm:h-[600px] overflow-hidden">
          <div className="pb-3 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#64748B] dark:text-slate-400">Yozyovon MFYlari ({filteredMfyList.length})</h3>
            <span className="text-[10px] text-[#94A3B8] font-semibold uppercase">Tanlang</span>
          </div>

          <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredMfyList.map(mfy => {
              const colorInfo = getMfyColor(mfy.limonDaraxtlari);
              return (
                <div
                  key={mfy.id}
                  onClick={() => handleMfyClick(mfy)}
                  className="p-3 rounded border border-[#E2E8F0] dark:border-slate-800 hover:border-[#3B82F6] hover:bg-[#F8FAFC] dark:hover:bg-slate-800/80 transition-all cursor-pointer group bg-white dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-xs ${mfy.limonDaraxtlari >= 10000 ? 'bg-emerald-500' : mfy.limonDaraxtlari >= 5000 ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                      <span className="font-semibold text-xs text-[#0F172A] dark:text-white group-hover:text-[#3B82F6]">{mfy.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#3B82F6] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] text-[#64748B] dark:text-slate-400">
                    <div>Limon: <b className="text-[#0F172A] dark:text-slate-200">{mfy.limonDaraxtlari.toLocaleString()}</b></div>
                    <div>Chorva: <b className="text-[#0F172A] dark:text-slate-200">{mfy.chorvaBoshlari.toLocaleString()}</b></div>
                    <div>Maydon: <b className="text-[#0F172A] dark:text-slate-200">{mfy.dehqonchilikGa} ga</b></div>
                    <div>Fermer: <b className="text-[#0F172A] dark:text-slate-200">{mfy.farmersCount}</b></div>
                  </div>

                  <div className="mt-2 flex items-center gap-1 flex-wrap">
                    {mfy.asosiyEkinlar.slice(0, 3).map((crop, idx) => (
                      <span key={idx} className="text-[10px] bg-[#F1F5F9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 px-1.5 py-0.5 rounded border border-[#E2E8F0] dark:border-slate-700">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800 mt-2">
            <button
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.setView([40.665, 71.650], 12.5, { animate: true });
                }
              }}
              className="w-full py-2 bg-[#F8FAFC] dark:bg-slate-800 text-[#475569] dark:text-slate-300 hover:bg-[#F1F5F9] dark:hover:bg-slate-700 border border-[#E2E8F0] dark:border-slate-700 rounded font-medium text-xs transition-colors"
            >
              Xarita koʻrinishini tiklash (Yozyovon Markazi)
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
