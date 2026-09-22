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
  RotateCcw,
  Eye,
  EyeOff,
  Globe,
  Waves,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MFYData } from '../types';
import { 
  YOZYOVON_KADASTR_DISTRICT_BOUNDARY, 
  YOZYOVON_MAP_BOUNDS, 
  YOZYOVON_WATER_RESERVOIR, 
  YOZYOVON_NEIGHBORS 
} from '../data/yozyovonData';

export const MFYMap: React.FC = () => {
  const { mfyList, selectMfy, userRole } = useApp();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const labelsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const staticOverlaysGroupRef = useRef<L.LayerGroup | null>(null);

  const [hoveredMfy, setHoveredMfy] = useState<MFYData | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedSektor, setSelectedSektor] = useState<number | 'all'>('all');
  const [colorMode, setColorMode] = useState<'borders' | 'sektor' | 'limon'>('borders');
  const [mapLayer, setMapLayer] = useState<'satellite' | 'street' | 'terrain'>('satellite');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);
  };

  // Sector colors (#551-#583 grouping)
  const SEKTOR_COLORS: Record<number, { fill: string; border: string; name: string; text: string }> = {
    1: { fill: '#3b82f6', border: '#1d4ed8', name: '1-Sektor (Hokim)', text: 'text-blue-500' },
    2: { fill: '#10b981', border: '#047857', name: '2-Sektor (Prokuror)', text: 'text-emerald-500' },
    3: { fill: '#f59e0b', border: '#b45309', name: '3-Sektor (IIV)', text: 'text-amber-500' },
    4: { fill: '#8b5cf6', border: '#6d28d9', name: '4-Sektor (DSQ)', text: 'text-purple-500' }
  };

  // Helper to determine color based on borders only, sector, or limon trees
  const getMfyColor = (mfy: MFYData): { fill: string; border: string; text: string; label: string } => {
    if (colorMode === 'borders') {
      return {
        fill: 'transparent',
        border: mapLayer === 'satellite' ? '#38bdf8' : '#2563eb',
        text: 'text-blue-500',
        label: 'Chegara koʻrinishi (Rangsiz)'
      };
    }

    if (colorMode === 'sektor') {
      const s = mfy.sektorNum || 1;
      const conf = SEKTOR_COLORS[s] || SEKTOR_COLORS[1];
      return {
        fill: conf.fill,
        border: conf.border,
        text: conf.text,
        label: conf.name
      };
    }

    // Default: limon count
    if (mfy.limonDaraxtlari >= 10000) {
      return { 
        fill: '#22c55e', 
        border: '#15803d', 
        text: 'text-emerald-700',
        label: '> 10 000 (Yetakchi)' 
      };
    }
    if (mfy.limonDaraxtlari >= 5000) {
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
      label: '< 5 000 (Past)' 
    };
  };

  // Filtered MFY list
  const filteredMfyList = mfyList.filter(mfy => {
    const matchesSearch = mfy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mfy.asosiyEkinlar.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    
    if (selectedSektor !== 'all' && mfy.sektorNum !== selectedSektor) {
      return false;
    }

    if (filterType === 'high') return mfy.limonDaraxtlari >= 10000;
    if (filterType === 'medium') return mfy.limonDaraxtlari >= 5000 && mfy.limonDaraxtlari < 10000;
    if (filterType === 'low') return mfy.limonDaraxtlari < 5000;
    return true;
  });

  // Calculate totals
  const totalLimon = mfyList.reduce((acc, m) => acc + m.limonDaraxtlari, 0);
  const totalChorva = mfyList.reduce((acc, m) => acc + m.chorvaBoshlari, 0);
  const totalMaydon = mfyList.reduce((acc, m) => acc + m.dehqonchilikGa, 0);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const FARGONA_REGION_BOUNDS: [[number, number], [number, number]] = [
        [40.05, 70.80],
        [40.98, 72.25]
      ];

      const map = L.map(mapContainerRef.current, {
        center: [40.665, 71.650], // Yozyovon tumani markazi
        zoom: 12,
        minZoom: 10,
        maxZoom: 17,
        zoomDelta: 0.5,
        zoomSnap: 0.25,
        wheelPxPerZoomLevel: 100,
        maxBounds: FARGONA_REGION_BOUNDS,
        maxBoundsViscosity: 0.9,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Base tile layer: Google Satellite Hybrid (Real fazoviy suratlar)
      const satLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '&copy; Yozyovon Tuman Kadastri & Google Earth',
        maxZoom: 20
      });
      satLayer.addTo(map);
      baseTileLayerRef.current = satLayer;

      // Layer groups
      staticOverlaysGroupRef.current = L.layerGroup().addTo(map);
      polygonsLayerGroupRef.current = L.layerGroup().addTo(map);
      labelsLayerGroupRef.current = L.layerGroup().addTo(map);

      // Add Static Overlays:
      // 1. Water Reservoir (Markaziy Farg'ona Suv Ombori) - Sun'iy doira olib tashlandi, nozik kontur va tabiiy suv havzasi
      const reservoirPoly = L.polygon(YOZYOVON_WATER_RESERVOIR.polygon, {
        color: '#0284c7',
        weight: 1.5,
        dashArray: '5, 5',
        fill: false, // Foydalanuvchi so'rovi: sun'iy ko'k qoplama olib tashlangan
        interactive: true
      });
      reservoirPoly.bindTooltip(`
        <div class="p-1">
          <div class="font-bold text-xs text-sky-300">🌊 ${YOZYOVON_WATER_RESERVOIR.name}</div>
          <div class="text-[10px] text-slate-300">${YOZYOVON_WATER_RESERVOIR.capacity}</div>
        </div>
      `, { sticky: true, className: 'custom-mfy-tooltip' });
      staticOverlaysGroupRef.current.addLayer(reservoirPoly);

      // 2. Official Kadastr District Boundary (High-contrast gold outline for satellite clarity)
      const districtBoundary = L.polygon(YOZYOVON_KADASTR_DISTRICT_BOUNDARY, {
        color: '#fbbf24',
        weight: 3.5,
        dashArray: '8, 6',
        fill: false,
        interactive: false
      });
      staticOverlaysGroupRef.current.addLayer(districtBoundary);

      // 3. Neighboring district labels
      YOZYOVON_NEIGHBORS.forEach(neighbor => {
        const neighborIcon = L.divIcon({
          className: 'neighbor-label',
          html: `
            <div class="px-2 py-0.5 bg-slate-900/90 text-amber-300 text-[10px] font-semibold rounded border border-amber-400/40 pointer-events-none whitespace-nowrap shadow-sm">
              📍 ${neighbor.name} (${neighbor.direction})
            </div>
          `,
          iconSize: [0, 0]
        });
        staticOverlaysGroupRef.current?.addLayer(L.marker(neighbor.position, { icon: neighborIcon }));
      });

      // Fit bounds cleanly on initial render
      map.fitBounds(YOZYOVON_MAP_BOUNDS, { padding: [20, 20] });
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Base Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (baseTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(baseTileLayerRef.current);
    }

    let newTileLayer: L.TileLayer;
    if (mapLayer === 'satellite') {
      newTileLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '&copy; Yozyovon Tuman Kadastri & Google Earth',
        maxZoom: 20
      });
    } else if (mapLayer === 'street') {
      newTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; Yozyovon Tuman Kadastri & OpenStreetMap',
        maxZoom: 19
      });
    } else {
      newTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri, DeLorme, USGS',
        maxZoom: 18
      });
    }

    newTileLayer.addTo(mapInstanceRef.current);
    baseTileLayerRef.current = newTileLayer;
  }, [mapLayer]);

  const resetDistrictView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(YOZYOVON_MAP_BOUNDS, { padding: [20, 20], maxZoom: 13, animate: true });
    }
  };

  // Update Polygon Layers when filtered list, colorMode, or showLabels changes
  useEffect(() => {
    if (!mapInstanceRef.current || !polygonsLayerGroupRef.current || !labelsLayerGroupRef.current) return;

    polygonsLayerGroupRef.current.clearLayers();
    labelsLayerGroupRef.current.clearLayers();

    filteredMfyList.forEach(mfy => {
      const colorInfo = getMfyColor(mfy);
      const isBordersOnly = colorMode === 'borders';

      // Create boundary polygon
      const polygon = L.polygon(mfy.polygonCoordinates, {
        color: colorInfo.border,
        weight: isBordersOnly ? 2 : 2.2,
        fillColor: isBordersOnly ? 'transparent' : colorInfo.fill,
        fillOpacity: isBordersOnly ? 0 : 0.45,
        className: 'cursor-pointer transition-all duration-300'
      });

      // Tooltip on hover
      const tooltipContent = `
        <div class="p-1 space-y-1">
          <div class="font-bold text-sm text-white flex items-center justify-between gap-2 border-b border-slate-700/60 pb-1">
            <span>🌿 ${mfy.name}</span>
            <span class="text-xs font-mono text-amber-300">#${mfy.referendumNum || (550 + mfy.id)}</span>
          </div>
          <div class="text-[11px] text-blue-300 font-semibold">
            Sektor: ${mfy.sektorNum}-sektor
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
            👉 Batafsil maʼlumotlarni koʻrish uchun bosing
          </div>
        </div>
      `;

      polygon.bindTooltip(tooltipContent, {
        sticky: true,
        className: 'custom-mfy-tooltip',
        direction: 'top'
      });

      // Hover events
      polygon.on('mouseover', (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3.5,
          color: isBordersOnly ? '#60a5fa' : colorInfo.border,
          fillColor: isBordersOnly ? '#38bdf8' : colorInfo.fill,
          fillOpacity: isBordersOnly ? 0.25 : 0.75
        });
        setHoveredMfy(mfy);
      });

      polygon.on('mouseout', (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: isBordersOnly ? 2 : 2.2,
          color: colorInfo.border,
          fillColor: isBordersOnly ? 'transparent' : colorInfo.fill,
          fillOpacity: isBordersOnly ? 0 : 0.45
        });
        setHoveredMfy(null);
      });

      // Click event -> navigate to /mfy/{id}
      polygon.on('click', () => {
        selectMfy(mfy.id);
      });

      polygonsLayerGroupRef.current?.addLayer(polygon);

      // Add center marker label if showLabels is enabled
      if (showLabels) {
        // 4-rasm: Sektor raqamlari faqat sozlamalardan '4 Sektor' tanlanganda ko'rinsin, oddiy holatda faqat MFY nomi
        const isSektorMode = colorMode === 'sektor';
        const customLabelIcon = L.divIcon({
          className: 'custom-map-label',
          html: `
            <div class="px-1.5 py-0.5 bg-slate-900/85 backdrop-blur-xs text-white font-medium text-[10px] rounded shadow-sm border border-emerald-500/50 pointer-events-none whitespace-nowrap -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
              ${isSektorMode ? `<span class="text-amber-400 font-mono font-bold text-[9px]">#${mfy.referendumNum || (550 + mfy.id)}</span>` : ''}
              <span>${mfy.name.replace(' MFY', '')}</span>
            </div>
          `,
          iconSize: [0, 0]
        });

        const labelMarker = L.marker(mfy.center, { icon: customLabelIcon, interactive: false });
        labelsLayerGroupRef.current?.addLayer(labelMarker);
      }
    });
  }, [filteredMfyList, colorMode, showLabels]);

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
      
      {/* Top Banner with District Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-4 rounded-md text-center shadow-xs">
          <p className="text-2xl font-bold text-[#0F172A] dark:text-white">{mfyList.length} ta</p>
          <p className="text-[10px] text-[#64748B] dark:text-slate-400 uppercase font-semibold tracking-wider mt-1">MFYlar Soni (Toʻliq 33 ta)</p>
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
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="w-full sm:flex-1 max-w-md">
            <div className="relative w-full">
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

          {/* Map Layer and Labels View Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Satellite / Street / Terrain Switcher */}
            <div className="flex items-center bg-[#F1F5F9] dark:bg-slate-800 p-1 rounded-md border border-[#E2E8F0] dark:border-slate-700 text-xs">
              <button
                onClick={() => setMapLayer('satellite')}
                className={`px-2 py-1 rounded font-semibold transition-all flex items-center gap-1 ${
                  mapLayer === 'satellite'
                    ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs'
                    : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
                }`}
                title="Sun'iy yo'ldosh fazoviy suratlari (Google Hybrid)"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Sputnik</span>
              </button>
              <button
                onClick={() => setMapLayer('street')}
                className={`px-2 py-1 rounded font-semibold transition-all flex items-center gap-1 ${
                  mapLayer === 'street'
                    ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs'
                    : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
                }`}
                title="Sxematik ko'cha xaritasi (OpenStreetMap)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Sxema</span>
              </button>
              <button
                onClick={() => setMapLayer('terrain')}
                className={`px-2 py-1 rounded font-semibold transition-all flex items-center gap-1 ${
                  mapLayer === 'terrain'
                    ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-xs'
                    : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
                }`}
                title="Topografik relyef va landshaft"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Relyef</span>
              </button>
            </div>

            {/* Labels Toggle */}
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-2.5 py-1.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showLabels
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : 'bg-[#F8FAFC] dark:bg-slate-800 border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-slate-400'
              }`}
              title="Mahalla nomlarini xaritada ko'rsatish yoki yashirish"
            >
              {showLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showLabels ? 'Nomlar: Ochiq' : 'Nomlar: Yashirin'}</span>
            </button>

            {/* Color Mode Switcher (Default: Borders only, Sector, Lemon) */}
            <div className="flex items-center bg-[#F1F5F9] dark:bg-slate-800 p-1 rounded-md border border-[#E2E8F0] dark:border-slate-700 text-xs">
              <button
                onClick={() => setColorMode('borders')}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  colorMode === 'borders'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A]'
                }`}
                title="Standart holat: MFYlar uchun rang berilmasin, faqat chegaralari ko'rinsin"
              >
                Chegaralar (Rangsiz)
              </button>
              <button
                onClick={() => setColorMode('sektor')}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  colorMode === 'sektor'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A]'
                }`}
                title="4 ta Sektor bo'yicha ranglash"
              >
                4 Sektor
              </button>
              <button
                onClick={() => setColorMode('limon')}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  colorMode === 'limon'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A]'
                }`}
                title="Limon daraxtlari zichligi va hosildorlik bo'yicha ranglash"
              >
                Limonchilik
              </button>
            </div>
            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className="px-2.5 py-1.5 rounded-md border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              title={isFullscreen ? "To'liq ekrandan chiqish" : "Xaritani to'liq ekran qilish"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-blue-500" /> : <Maximize2 className="w-3.5 h-3.5 text-blue-500" />}
              <span>{isFullscreen ? "Kichraytirish" : "To'liq Ekran"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Container & Sidebar Grid (Supports Fullscreen Mode) */}
      <div className={isFullscreen ? "fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-3 sm:p-5 flex flex-col gap-3" : "grid grid-cols-1 lg:grid-cols-4 gap-5"}>
        
        {/* Left 3 Cols (or full width in Fullscreen): Leaflet Interactive Map */}
        <div className={`${isFullscreen ? "flex-1 w-full h-full" : "lg:col-span-3"} bg-white dark:bg-slate-900 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs overflow-hidden relative flex flex-col`}>
          
          {/* Map Header Instructions */}
          <div className="px-4 py-2 bg-[#F8FAFC] dark:bg-slate-800 border-b border-[#E2E8F0] dark:border-slate-700 flex items-center justify-between text-xs text-[#64748B] dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#3B82F6]" />
              <span><b>Koʻrsatma:</b> Kursorni poligon ustiga olib borib qisqa maʼlumot oling, toʻliq sahifani ochish uchun poligon ustiga bosing.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-amber-500 font-medium hidden sm:inline">Sariq uzuq chiziq — Yozyovon tuman chegarasi</span>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1 text-[11px] font-semibold"
                title={isFullscreen ? "To'liq ekrandan chiqish" : "To'liq ekran"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-blue-500" /> : <Maximize2 className="w-4 h-4 text-blue-500" />}
                <span className="hidden sm:inline">{isFullscreen ? "Chiqish" : "Toʻliq Ekran"}</span>
              </button>
            </div>
          </div>

          {/* Leaflet Map Stage */}
          <div className={`relative w-full ${isFullscreen ? "flex-1 min-h-[500px]" : "h-[480px] sm:h-[580px]"}`}>
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
                className="px-3 py-1.5 bg-slate-900/90 text-white backdrop-blur-md rounded-md shadow-md border border-slate-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition-all active:scale-95"
                title="Yozyovon tuman chegarasini markazlashtirish"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Yozyovon Markazi</span>
              </button>
            </div>

            {/* Floating Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 text-white backdrop-blur-md p-3 rounded-md shadow-md border border-slate-700 text-xs space-y-1.5 max-w-[220px]">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800 pb-1">
                {colorMode === 'sektor' ? '4 ta Sektor Tasnifi' : 'Limonchilik Darajasi'}
              </p>
              
              {colorMode === 'borders' ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-1 rounded-full bg-blue-400 shrink-0"></span>
                    <span className="text-slate-200 text-xs font-semibold">MFY Chegaralari (Rangsiz)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Faqat maʼmuriy chegara chiziqlari koʻrsatilgan. Ekinzor va bogʻlar tabiiy ravishda koʻrinadi.
                  </p>
                </>
              ) : colorMode === 'sektor' ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-blue-500 shrink-0"></span>
                    <span className="text-slate-200 text-xs">1-Sektor (#551-#558)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-emerald-500 shrink-0"></span>
                    <span className="text-slate-200 text-xs">2-Sektor (#559-#564)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-amber-500 shrink-0"></span>
                    <span className="text-slate-200 text-xs">3-Sektor (#565-#574)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-purple-500 shrink-0"></span>
                    <span className="text-slate-200 text-xs">4-Sektor (#575-#583)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-emerald-500 shrink-0"></span>
                    <span className="text-slate-200 text-xs">&gt; 10 000 dona (Yetakchi)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-amber-500 shrink-0"></span>
                    <span className="text-slate-200 text-xs">5 000 - 10 000 dona</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-rose-500 shrink-0"></span>
                    <span className="text-slate-200 text-xs">&lt; 5 000 dona (Past)</span>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                <span className="w-4 border-b-2 border-dashed border-amber-400 shrink-0"></span>
                <span className="text-slate-300 text-[10px] font-medium">Tuman chegarasi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-sky-400/80 border border-sky-300 shrink-0"></span>
                <span className="text-slate-300 text-[10px] font-medium">Markaziy Fargʻona suv ombori</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: MFY List Quick Navigation (Hidden in Fullscreen for immersive map) */}
        {!isFullscreen && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-[#E2E8F0] dark:border-slate-800 shadow-xs p-4 flex flex-col h-[520px] sm:h-[620px] overflow-hidden">
            <div className="pb-3 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#64748B] dark:text-slate-400">Yozyovon MFYlari ({filteredMfyList.length})</h3>
              <span className="text-[10px] text-amber-500 font-semibold font-mono">#551-#583</span>
            </div>

            <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredMfyList.map(mfy => {
              const colorInfo = getMfyColor(mfy);
              return (
                <div
                  key={mfy.id}
                  onClick={() => handleMfyClick(mfy)}
                  className="p-2.5 rounded border border-[#E2E8F0] dark:border-slate-800 hover:border-[#3B82F6] hover:bg-[#F8FAFC] dark:hover:bg-slate-800/80 transition-all cursor-pointer group bg-white dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: colorInfo.fill }}></span>
                      <span className="font-semibold text-xs text-[#0F172A] dark:text-white group-hover:text-[#3B82F6]">{mfy.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-400">#{mfy.referendumNum || (550 + mfy.id)}</span>
                      <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#3B82F6] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  
                  <div className="mt-1.5 grid grid-cols-2 gap-1 text-[11px] text-[#64748B] dark:text-slate-400">
                    <div>Limon: <b className="text-[#0F172A] dark:text-slate-200">{mfy.limonDaraxtlari.toLocaleString()}</b></div>
                    <div>Chorva: <b className="text-[#0F172A] dark:text-slate-200">{mfy.chorvaBoshlari.toLocaleString()}</b></div>
                    <div>Maydon: <b className="text-[#0F172A] dark:text-slate-200">{mfy.dehqonchilikGa} ga</b></div>
                    <div>Sektor: <b className="text-[#0F172A] dark:text-slate-200">{mfy.sektorNum}-sektor</b></div>
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
        )}

      </div>

    </div>
  );
};
