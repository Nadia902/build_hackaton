'use client';

import { useEffect, useRef, useState } from 'react';
import type { SocialObject, Builder, MunicipalityColors, TrafficColor } from '@/types';
import { BUILDER_CATEGORY_COLOR_FIELD } from '@/types';

interface MapComponentProps {
  objects: SocialObject[];
  selectedObject: SocialObject | null;
  onSelectObject: (obj: SocialObject) => void;
  showSatellite: boolean;
  loading: boolean;
  darkMode?: boolean;
  onToggleDark?: () => void;
  
  
  showBuilders?: boolean;
  builders?: Builder[];
  selectedBuilder?: Builder | null;
  onSelectBuilder?: (b: Builder) => void;
  
  
  
  builderCategory?: string;
  municipalitiesColors?: MunicipalityColors[];
}

const TULA_CENTER: [number, number] = [54.19, 37.62];
const ZOOM = 9;
const TULA_BOUNDS = [[53.3, 35.5], [55.2, 39.3]];


const ISOCHRONE_MODE = 'walking';
const ISOCHRONE_DURATION_SEC = 15 * 60;

const INDUSTRY_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  'Образование': {
    icon: `<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>`,
    color: '#3b82f6', bg: '#2563eb',
  },
  'Здравоохранение': {
    icon: `<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg>`,
    color: '#ef4444', bg: '#dc2626',
  },
  'Культура': {
    icon: `<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>`,
    color: '#a855f7', bg: '#9333ea',
  },
  'Физическая культура и спорт': {
    icon: `<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><circle cx="12" cy="12" r="10" fill="none" stroke="white" stroke-width="2"/><path d="M12 2a10 10 0 0 0-7.35 16.76C6.23 16.1 8.94 15 12 15s5.77 1.1 7.35 3.76A10 10 0 0 0 12 2z" fill="white" opacity="0.3"/></svg>`,
    color: '#f97316', bg: '#ea580c',
  },
  'Строительство': {
    icon: `<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M22 22H2v-2h1V11l4.5-3V4h3v2h3V4h3v2h3V4h3v7l4.5 3v9h-1v2zM6 19h12v-4H6v4zm6-14v-2h-2v2H8v2h2v2h2v-2h2v-2h-2z"/></svg>`,
    color: '#eab308', bg: '#ca8a04',
  },
  'Жилищно-коммунальное хозяйство': {
    icon: `<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
    color: '#22c55e', bg: '#16a34a',
  },
  'Социальная политика': {
    icon: `<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
    color: '#06b6d4', bg: '#0891b2',
  },
  'Связь и информатика': {
    icon: `<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`,
    color: '#6366f1', bg: '#4f46e5',
  },
};

function getIndustryConfig(industry: string | null) {
  if (!industry) return { icon: `<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><circle cx="12" cy="12" r="6"/></svg>`, color: '#64748b', bg: '#475569' };
  const trimmed = industry.trim();
  if (INDUSTRY_CONFIG[trimmed]) return INDUSTRY_CONFIG[trimmed];
  for (const [key, config] of Object.entries(INDUSTRY_CONFIG)) {
    if (trimmed.includes(key) || key.includes(trimmed)) return config;
  }
  return { icon: `<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><circle cx="12" cy="12" r="6"/></svg>`, color: '#64748b', bg: '#475569' };
}


const BUILDER_CATEGORY_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  'Спортивная площадка': {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0-7.35 16.76C6.23 16.1 8.94 15 12 15s5.77 1.1 7.35 3.76A10 10 0 0 0 12 2z" fill="white" opacity="0.3"/></svg>`,
    color: '#f97316', bg: '#ea580c',
  },
  'МБОУ ЦО': {
    icon: `<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>`,
    color: '#3b82f6', bg: '#2563eb',
  },
  'Больница': {
    icon: `<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg>`,
    color: '#ef4444', bg: '#dc2626',
  },
};

function getBuilderCategoryConfig(category: string | null) {
  const fallback = { icon: `<svg viewBox="0 0 24 24" fill="white" width="14" height="14"><circle cx="12" cy="12" r="6"/></svg>`, color: '#64748b', bg: '#475569' };
  if (!category) return fallback;
  return BUILDER_CATEGORY_CONFIG[category.trim()] || fallback;
}

const LIGHT_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';













function resolveLatLng(lat: number | null, lng: number | null): [number, number] | null {
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) return null;

  const [latMin, lngMin] = TULA_BOUNDS[0];
  const [latMax, lngMax] = TULA_BOUNDS[1];
  const pad = 1.0; 
  const inBounds = (la: number, lo: number) =>
    la >= latMin - pad && la <= latMax + pad && lo >= lngMin - pad && lo <= lngMax + pad;

  if (inBounds(lat, lng)) return [lat, lng];
  if (inBounds(lng, lat)) return [lng, lat];
  return null;
}



function makeClusterIcon(cluster: any) {
  const L = require('leaflet');
  const count = cluster.getChildCount();
  const sizeClass = count < 10 ? '' : count < 50 ? 'cluster-marker--md' : 'cluster-marker--lg';
  const size = count < 10 ? 34 : count < 50 ? 42 : 50;
  return L.divIcon({
    html: `<div class="cluster-marker ${sizeClass}">${count}</div>`,
    className: 'custom-cluster-icon',
    iconSize: L.point(size, size),
  });
}


const TRAFFIC_COLOR_HEX: Record<TrafficColor, string> = {
  green: '#16a34a',
  yellow: '#eab308',
  red: '#dc2626',
};

const TRAFFIC_COLOR_LABEL: Record<TrafficColor, string> = {
  green: 'Хорошая обеспеченность',
  yellow: 'Средняя обеспеченность',
  red: 'Низкая обеспеченность',
};







function normalizeMunicipalityName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\bмуниципальный округ\b/g, ' ')
    .replace(/\bмуниципальный район\b/g, ' ')
    .replace(/\bгородской округ\b/g, ' ')
    .replace(/\bрабочий посел[ое]к\b/g, ' ')
    .replace(/\bгород\b/g, ' ')
    .replace(/\bрайон\b/g, ' ')
    .replace(/[^а-я0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const CLUSTER_OPTIONS = {
  maxClusterRadius: 60,
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  chunkedLoading: true,
  iconCreateFunction: makeClusterIcon,
};

export default function MapComponent({
  objects,
  selectedObject,
  onSelectObject,
  showSatellite,
  darkMode = false,
  onToggleDark,
  showBuilders = false,
  builders = [],
  selectedBuilder = null,
  onSelectBuilder,
  builderCategory = '',
  municipalitiesColors = [],
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  
  
  
  const objectsClusterRef = useRef<any>(null);
  const builderClusterRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const overlayRef = useRef<any>(null);
  const isochroneLayerRef = useRef<any>(null);
  
  
  const trafficOverlayRef = useRef<any>(null);
  const [municipalitiesGeojson, setMunicipalitiesGeojson] = useState<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [isochroneLoading, setIsochroneLoading] = useState(false);
  const [isochroneError, setIsochroneError] = useState(false);
  const [isochroneVisible, setIsochroneVisible] = useState(false);

  
  
  useEffect(() => {
    fetch('/tula_municipalities.geojson')
      .then(r => (r.ok ? r.json() : null))
      .then(setMunicipalitiesGeojson)
      .catch(() => setMunicipalitiesGeojson(null));
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = require('leaflet');
    require('leaflet.markercluster');
    const bounds = L.latLngBounds(TULA_BOUNDS);

    const map = L.map(mapRef.current, {
      center: TULA_CENTER,
      zoom: ZOOM,
      minZoom: 7,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
      keyboard: false,
      maxBounds: bounds.pad(0.3),
      maxBoundsViscosity: 0.8,
    });

    const streetLayer = L.tileLayer(LIGHT_TILE_URL, { maxZoom: 19 });
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19 }
    );

    streetLayer.addTo(map);
    tileLayerRef.current = { street: streetLayer, satellite: satelliteLayer, current: 'street' };

    objectsClusterRef.current = L.markerClusterGroup(CLUSTER_OPTIONS);
    builderClusterRef.current = L.markerClusterGroup(CLUSTER_OPTIONS);

    mapInstanceRef.current = map;
    setMapReady(true);

    loadBoundaries(map, L, overlayRef);

    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  
  useEffect(() => {
    if (!mapReady || !tileLayerRef.current) return;
    const map = mapInstanceRef.current;
    const tiles = tileLayerRef.current;
    map.removeLayer(tiles[tiles.current]);

    if (showSatellite) {
      tiles.current = 'satellite';
    } else {
      tiles.current = 'street';
    }
    tiles[tiles.current].addTo(map);

    
    const mapEl = mapRef.current;
    if (mapEl) {
      const tilePane = mapEl.querySelector('.leaflet-tile-pane') as HTMLElement;
      const useDark = darkMode && !showSatellite;
      if (tilePane) {
        tilePane.style.filter = useDark
          ? 'invert(0.9) hue-rotate(180deg) saturate(0.6) brightness(0.9)'
          : 'none';
      }
    }

    
    if (overlayRef.current) {
      if (showSatellite) {
        
        overlayRef.current.setStyle({
          fillColor: '#000000',
          fillOpacity: 0.65,
        });
      } else if (darkMode) {
        
        overlayRef.current.setStyle({
          fillColor: '#030712',
          fillOpacity: 0.75,
        });
      } else {
        
        overlayRef.current.setStyle({
          fillColor: '#0f172a',
          fillOpacity: 0.5,
        });
      }
    }
  }, [showSatellite, darkMode, mapReady]);

  
  useEffect(() => {
    if (!mapReady) return;
    const L = require('leaflet');
    const map = mapInstanceRef.current;
    const cluster = objectsClusterRef.current;
    if (!cluster) return;

    cluster.clearLayers();

    if (showBuilders) {
      if (map.hasLayer(cluster)) map.removeLayer(cluster);
      return;
    }

    const newMarkers: any[] = [];
    objects.forEach(obj => {
      const latLng = resolveLatLng(obj.latitude, obj.longitude);
      if (!latLng) {
        if (obj.latitude != null && obj.longitude != null) {
          console.warn(
            `Объект #${obj.num ?? obj.id} («${obj.oks_name ?? 'без названия'}») пропущен: некорректные координаты`,
            obj.latitude, obj.longitude
          );
        }
        return;
      }
      const config = getIndustryConfig(obj.industry);
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="industry-marker" style="--mc: ${config.color}; --mbg: ${config.bg};"><div class="industry-marker-inner">${config.icon}</div></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      const marker = L.marker(latLng, { icon });
      marker.on('click', () => onSelectObject(obj));
      marker.bindTooltip(obj.oks_name || `Объект #${obj.num}`, { direction: 'top', offset: [0, -16], className: 'custom-tooltip' });
      newMarkers.push(marker);
    });

    cluster.addLayers(newMarkers);
    if (!map.hasLayer(cluster)) cluster.addTo(map);
  }, [objects, mapReady, onSelectObject, showBuilders]);

  
  
  useEffect(() => {
    if (!mapReady) return;
    const L = require('leaflet');
    const map = mapInstanceRef.current;
    const cluster = builderClusterRef.current;
    if (!cluster) return;

    cluster.clearLayers();

    if (!showBuilders) {
      if (map.hasLayer(cluster)) map.removeLayer(cluster);
      return;
    }

    const newMarkers: any[] = [];
    builders.forEach(b => {
      const latLng = resolveLatLng(b.latitude, b.longitude);
      if (!latLng) {
        if (b.latitude != null && b.longitude != null) {
          console.warn(
            `Строитель #${b.id} («${b.title}», категория «${b.category}») пропущен: некорректные координаты`,
            b.latitude, b.longitude
          );
        }
        return;
      }
      const config = getBuilderCategoryConfig(b.category);
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="industry-marker" style="--mc: ${config.color}; --mbg: ${config.bg};"><div class="industry-marker-inner">${config.icon}</div></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      const marker = L.marker(latLng, { icon });
      marker.on('click', () => onSelectBuilder?.(b));
      marker.bindTooltip(b.title, { direction: 'top', offset: [0, -16], className: 'custom-tooltip' });
      newMarkers.push(marker);
    });

    cluster.addLayers(newMarkers);
    if (!map.hasLayer(cluster)) cluster.addTo(map);
  }, [builders, mapReady, onSelectBuilder, showBuilders]);

  useEffect(() => {
    if (!selectedObject || !mapReady || showBuilders) return;
    const map = mapInstanceRef.current;
    if (selectedObject.latitude && selectedObject.longitude) {
      map.flyTo([selectedObject.latitude, selectedObject.longitude], 14, { duration: 0.5 });
    }
  }, [selectedObject, mapReady, showBuilders]);

  useEffect(() => {
    if (!selectedBuilder || !mapReady || !showBuilders) return;
    const map = mapInstanceRef.current;
    if (selectedBuilder.latitude && selectedBuilder.longitude) {
      map.flyTo([selectedBuilder.latitude, selectedBuilder.longitude], 14, { duration: 0.5 });
    }
  }, [selectedBuilder, mapReady, showBuilders]);

  
  
  useEffect(() => {
    if (!mapReady) return;
    const L = require('leaflet');
    const map = mapInstanceRef.current;

    
    if (isochroneLayerRef.current) {
      map.removeLayer(isochroneLayerRef.current);
      isochroneLayerRef.current = null;
    }
    setIsochroneError(false);
    setIsochroneLoading(false);
    setIsochroneVisible(false);

    if (showBuilders || !selectedObject || !selectedObject.latitude || !selectedObject.longitude) return;

    const controller = new AbortController();
    setIsochroneLoading(true);

    const params = new URLSearchParams({
      lat: String(selectedObject.latitude),
      lon: String(selectedObject.longitude),
      duration: String(ISOCHRONE_DURATION_SEC),
      mode: ISOCHRONE_MODE,
    });

    fetch(`/api/isochrone?${params.toString()}`, { signal: controller.signal })
      .then(res => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then(data => {
        const geometry = data?.hull?.geometry;
        if (!geometry) throw new Error('Изохрона не найдена в ответе API');

        const layer = L.geoJSON(geometry, {
          interactive: false,
          style: {
            color: '#16a34a',
            weight: 2,
            opacity: 0.9,
            fillColor: '#22c55e',
            fillOpacity: 0.22,
            dashArray: '6, 4',
          },
        });
        layer.addTo(map);
        isochroneLayerRef.current = layer;
        setIsochroneVisible(true);
      })
      .catch(err => {
        if (err?.name === 'AbortError') return;
        console.warn('Не удалось загрузить изохрону:', err);
        setIsochroneError(true);
      })
      .finally(() => {
        setIsochroneLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [selectedObject, mapReady, showBuilders]);

  
  
  
  useEffect(() => {
    if (!mapReady) return;
    const L = require('leaflet');
    const map = mapInstanceRef.current;

    if (trafficOverlayRef.current) {
      map.removeLayer(trafficOverlayRef.current);
      trafficOverlayRef.current = null;
    }

    const colorField = showBuilders ? BUILDER_CATEGORY_COLOR_FIELD[builderCategory] : undefined;
    if (!colorField || !municipalitiesGeojson || municipalitiesColors.length === 0) return;

    
    const colorByName = new Map<string, MunicipalityColors>();
    municipalitiesColors.forEach(row => {
      colorByName.set(normalizeMunicipalityName(row.municipality), row);
    });

    const layer = L.geoJSON(municipalitiesGeojson, {
      interactive: true,
      style: (feature: any) => {
        const areaName: string = feature?.properties?.areaName || '';
        const row = colorByName.get(normalizeMunicipalityName(areaName));
        const color = row ? (row[colorField] as TrafficColor | null) : null;
        return {
          color: color ? TRAFFIC_COLOR_HEX[color] : '#94a3b8',
          weight: 1.5,
          opacity: 0.8,
          fillColor: color ? TRAFFIC_COLOR_HEX[color] : '#94a3b8',
          fillOpacity: color ? 0.35 : 0.08,
        };
      },
      onEachFeature: (feature: any, featureLayer: any) => {
        const areaName: string = feature?.properties?.areaName || 'Муниципалитет';
        const row = colorByName.get(normalizeMunicipalityName(areaName));
        if (!row) {
          featureLayer.bindTooltip(`${areaName}<br/>Нет данных`, { sticky: true, className: 'custom-tooltip' });
          return;
        }
        let detail = '';
        if (colorField === 'color_hospital') {
          detail = `Больниц: ${row.hospitals_count ?? 0}` +
            (row.people_per_hospital != null ? `<br/>${row.people_per_hospital} чел. на 1 больницу` : '');
        } else if (colorField === 'color_school') {
          detail = `Обеспеченность: ${row.schools_per_1000 ?? 0} на 1000 жит.`;
        } else if (colorField === 'color_sport') {
          detail = `Площадок: ${row.sports_count ?? 0}` +
            (row.people_per_sport != null ? `<br/>${row.people_per_sport} чел. на 1 площадку` : '');
        }
        featureLayer.bindTooltip(`<strong>${areaName}</strong><br/>${detail}`, { sticky: true, className: 'custom-tooltip' });
      },
    });

    layer.addTo(map);
    layer.bringToBack();
    trafficOverlayRef.current = layer;
  }, [showBuilders, builderCategory, municipalitiesColors, municipalitiesGeojson, mapReady]);

  const activeColorField = showBuilders ? BUILDER_CATEGORY_COLOR_FIELD[builderCategory] : undefined;

  return (
    <>
      <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />
      {activeColorField && (
        <div className={`traffic-legend ${darkMode ? 'dark' : ''}`}>
          <strong className="traffic-legend-title">
            Обеспеченность муниципалитетов
            {activeColorField === 'color_hospital' && ' больницами'}
            {activeColorField === 'color_school' && ' школами'}
            {activeColorField === 'color_sport' && ' спортплощадками'}
          </strong>
          {(['green', 'yellow', 'red'] as TrafficColor[]).map(c => (
            <div className="traffic-legend-row" key={c}>
              <span className="traffic-legend-swatch" style={{ background: TRAFFIC_COLOR_HEX[c] }} />
              <span>{TRAFFIC_COLOR_LABEL[c]}</span>
            </div>
          ))}
        </div>
      )}
      {isochroneVisible && (
        <div className={`isochrone-legend ${darkMode ? 'dark' : ''}`}>
          <span className="isochrone-legend-swatch" />
          <div className="isochrone-legend-text">
            <strong>Зона пешей доступности</strong>
            <span>До объекта — не более 15 минут пешком</span>
          </div>
        </div>
      )}
      {isochroneLoading && (
        <div className="isochrone-status-badge">
          Строим зону пешей доступности (15 мин)…
        </div>
      )}
      {isochroneError && !isochroneLoading && (
        <div className="isochrone-status-badge isochrone-status-badge--error">
          Не удалось построить изохрону
        </div>
      )}
    </>
  );
}

async function loadBoundaries(map: any, L: any, overlayRef: React.MutableRefObject<any>) {
  try {
    const [oblastRes, districtsRes] = await Promise.all([
      fetch('/tula_region_outer_boundary.geojson'),
      fetch('/tula_municipalities.geojson'),
    ]);

    
    if (districtsRes.ok) {
      const geojson = await districtsRes.json();
      L.geoJSON(geojson, {
        style: {
          color: '#296ac5',
          weight: 1,
          opacity: 1,
          fillOpacity: 0,
          dashArray: '3, 4',
        },
      }).addTo(map);
    }

    if (oblastRes.ok) {
      const geojson = await oblastRes.json();

      
      
      L.geoJSON(geojson, {
        style: {
          color: '#2563eb',
          weight: 8,
          opacity: 0.35,
          fillOpacity: 0,
        },
      }).addTo(map);

      
      const regionLayer = L.geoJSON(geojson, {
        style: {
          color: '#1d4ed8',
          weight: 2.5,
          opacity: 0.9,
          fillOpacity: 0,
        },
      }).addTo(map);

      
      map.fitBounds(regionLayer.getBounds(), { padding: [20, 20] });

      
      
      const worldCoords = [
        [90, -180],
        [90, 180],
        [-90, 180],
        [-90, -180],
        [90, -180],
      ];

      const oblastCoords: number[][][] = [];

      const extractRings = (geometry: any) => {
        if (geometry.type === 'Polygon') {
          
          const ring = geometry.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);
          oblastCoords.push(ring);
        } else if (geometry.type === 'MultiPolygon') {
          geometry.coordinates.forEach((poly: number[][][]) => {
            const ring = poly[0].map((coord: number[]) => [coord[1], coord[0]]);
            oblastCoords.push(ring);
          });
        }
      };

      if (geojson.type === 'FeatureCollection') {
        geojson.features.forEach((f: any) => extractRings(f.geometry));
      } else if (geojson.type === 'Feature') {
        extractRings(geojson.geometry);
      } else {
        extractRings(geojson);
      }

      if (oblastCoords.length > 0) {
        
        const invertedPolygon = L.polygon([worldCoords, ...oblastCoords], {
          color: 'transparent',
          weight: 0,
          fillColor: '#0f172a',
          fillOpacity: 0.5,
          interactive: false,
        }).addTo(map);

        overlayRef.current = invertedPolygon;
      }
    }
  } catch (e) {
    console.warn('Boundary data not loaded:', e);
  }
}