'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { CSSProperties } from 'react';
import type { SocialObject, Filters, Builder, MunicipalityColors } from '@/types';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="loading-overlay">
      <div className="spinner" />
      <span>Загрузка карты...</span>
    </div>
  ),
});

const ObjectCard = dynamic(() => import('@/components/ObjectCard'), { ssr: false });
const FilterPanel = dynamic(() => import('@/components/FilterPanel'), { ssr: false });
const CoatOfArms = dynamic(() => import('@/components/CoatOfArms'), { ssr: false });

export default function Home() {
  const [objects, setObjects] = useState<SocialObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<SocialObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    yearStart: [],
    industry: '',
    constructionStage: '',
    search: '',
  });
  const [showSatellite, setShowSatellite] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMap, setDarkMap] = useState(false);
  
  
  
  const [showBuilders, setShowBuilders] = useState(false);
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [buildersLoading, setBuildersLoading] = useState(false);
  const [selectedBuilder, setSelectedBuilder] = useState<Builder | null>(null);
  const [builderCategory, setBuilderCategory] = useState('');
  
  
  
  const [municipalitiesColors, setMunicipalitiesColors] = useState<MunicipalityColors[]>([]);

  
  
  
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(80);

  
  
  const controlsRef = useRef<HTMLDivElement>(null);
  const [controlsHeight, setControlsHeight] = useState(84);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsAdmin(!!token);
  }, []);

  useEffect(() => {
    
    
    
    
    
    
    
    const observe = (el: HTMLDivElement | null, setHeight: (h: number) => void) => {
      if (!el || typeof ResizeObserver === 'undefined') return undefined;
      const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
      ro.observe(el);
      setHeight(el.offsetHeight);
      return () => ro.disconnect();
    };
    const disconnectHeader = observe(headerRef.current, setHeaderHeight);
    const disconnectControls = observe(controlsRef.current, setControlsHeight);
    return () => {
      disconnectHeader?.();
      disconnectControls?.();
    };
  }, []);

  const fetchObjects = useCallback(async (activeFilters: Filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      activeFilters.yearStart.forEach(y => params.append('year_start', y.toString()));
      if (activeFilters.industry) params.append('industry', activeFilters.industry);
      if (activeFilters.constructionStage) params.append('construction_stage', activeFilters.constructionStage);
      if (activeFilters.search) params.append('search', activeFilters.search);

      const res = await fetch(`/api/objects?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setObjects(data);
      }
    } catch (e) {
      console.error('Failed to fetch objects:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchObjects(filters);
  }, []);

  const fetchBuilders = useCallback(async (category: string) => {
    setBuildersLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      const res = await fetch(`/api/builders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBuilders(data);
      }
    } catch (e) {
      console.error('Failed to fetch builders:', e);
    } finally {
      setBuildersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!showBuilders) return;
    fetchBuilders(builderCategory);
  }, [showBuilders, builderCategory, fetchBuilders]);

  
  
  
  useEffect(() => {
    if (!showBuilders || municipalitiesColors.length > 0) return;
    fetch('/api/municipalities-colors')
      .then(res => (res.ok ? res.json() : []))
      .then(setMunicipalitiesColors)
      .catch(e => console.error('Failed to fetch municipalities colors:', e));
  }, [showBuilders, municipalitiesColors.length]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    fetchObjects(newFilters);
  };

  const completedCount = objects.filter(
    o => o.construction_stage?.toLowerCase().includes('введен') || o.year_commissioned
  ).length;

  const activeCount = objects.filter(
    o => !o.year_end || (o.construction_stage && !o.construction_stage.toLowerCase().includes('введен'))
  ).length;

  return (
    <div
      className="map-container"
      style={{
        '--header-h': `${headerHeight}px`,
        '--controls-h': `${controlsHeight}px`,
      } as CSSProperties}
    >
      <div className="header" ref={headerRef}>
        <div className="header-title">
          <CoatOfArms />
          <div>
            <h1>Интерактивный портал объектов капитального строительства</h1>
            <div className="subtitle">Тульская область</div>
          </div>
        </div>
        <div className="header-nav">
          <label
            className="header-markers-toggle"
            title={showBuilders ? 'Показать объекты капитального строительства' : 'Показать социальную нагрузку'}
          >
            <span className="header-markers-toggle-label">Социальная нагрузка</span>
            <span className="switch">
              <input
                type="checkbox"
                checked={showBuilders}
                onChange={() => setShowBuilders(v => !v)}
              />
              <span className="switch-slider" />
            </span>
          </label>
          <a href="/" className="header-nav-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="header-nav-link-text">Главная</span>
          </a>
          <a href="/admin" className="header-nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            <span className="header-nav-link-text">{isAdmin ? 'Админ-панель' : 'Вход для администраторов'}</span>
          </a>
        </div>
      </div>

      {showBuilders ? (
        <FilterPanel
          mode="builders"
          filters={filters}
          onFilterChange={handleFilterChange}
          totalObjects={objects.length}
          builderCategory={builderCategory}
          onBuilderCategoryChange={setBuilderCategory}
          totalBuilders={builders.length}
          darkMode={darkMap}
        />
      ) : (
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          totalObjects={objects.length}
          darkMode={darkMap}
        />
      )}

      <div className="map-controls" ref={controlsRef}>
        <button
          className={`map-control-btn ${darkMap ? 'active' : ''}`}
          onClick={() => setDarkMap(!darkMap)}
          title={darkMap ? 'Светлая тема' : 'Тёмная тема'}
        >
          {darkMap ? '☀' : '🌙'}
        </button>
        <button
          className={`map-control-btn ${showSatellite ? 'active' : ''}`}
          onClick={() => setShowSatellite(!showSatellite)}
          title={showSatellite ? 'Карта' : 'Спутник'}
        >
          {showSatellite ? '🗺' : '🛰'}
        </button>
      </div>

      <MapComponent
        objects={objects}
        selectedObject={selectedObject}
        onSelectObject={setSelectedObject}
        showSatellite={showSatellite}
        loading={loading}
        darkMode={darkMap}
        showBuilders={showBuilders}
        builders={builders}
        selectedBuilder={selectedBuilder}
        onSelectBuilder={setSelectedBuilder}
        builderCategory={builderCategory}
        municipalitiesColors={municipalitiesColors}
      />

      <div className={`stats-bar ${darkMap ? 'dark' : ''}`}>
        <div className="stat">
          <span className="stat-value">{objects.length}</span>
          <span className="stat-label">Всего объектов</span>
        </div>
        <div className="stat">
          <span className="stat-value">{completedCount}</span>
          <span className="stat-label">Введено в эксплуатацию</span>
        </div>
        <div className="stat">
          <span className="stat-value">{activeCount}</span>
          <span className="stat-label">В строительстве</span>
        </div>
      </div>

      {showBuilders
        ? selectedBuilder && (
            <ObjectCard
              builder={selectedBuilder}
              onClose={() => setSelectedBuilder(null)}
              darkMode={darkMap}
            />
          )
        : selectedObject && (
            <ObjectCard
              object={selectedObject}
              onClose={() => setSelectedObject(null)}
              isAdmin={isAdmin}
              darkMode={darkMap}
            />
          )}

      {buildersLoading && showBuilders && (
        <div className="loading-overlay">
          <div className="spinner" />
          <span>Загрузка реестра строителей...</span>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <span>Загрузка данных...</span>
        </div>
      )}
    </div>
  );
}
