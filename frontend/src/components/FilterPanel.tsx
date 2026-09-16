'use client';

import { useState, useEffect } from 'react';
import type { Filters } from '@/types';
import { BUILDER_CATEGORIES } from '@/types';

interface FilterPanelProps {
  mode?: 'objects' | 'builders';
  
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  totalObjects: number;
  
  builderCategory?: string;
  onBuilderCategoryChange?: (category: string) => void;
  totalBuilders?: number;
  darkMode?: boolean;
}

interface YearStat {
  year: number;
  count: number;
}

export default function FilterPanel({
  mode = 'objects',
  filters,
  onFilterChange,
  totalObjects,
  builderCategory = '',
  onBuilderCategoryChange,
  totalBuilders = 0,
  darkMode = false,
}: FilterPanelProps) {
  const [yearStats, setYearStats] = useState<YearStat[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [stages, setStages] = useState<string[]>([]);
  const [localFilters, setLocalFilters] = useState<Filters>(filters);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (mode !== 'objects') return;
    fetch('/api/years').then(r => r.json()).then(setYearStats).catch(() => {});
    fetch('/api/industries').then(r => r.json()).then(setIndustries).catch(() => {});
    fetch('/api/stages').then(r => r.json()).then(setStages).catch(() => {});
  }, [mode]);

  const selectAllYears = () => {
    setLocalFilters({ ...localFilters, yearStart: yearStats.map(ys => ys.year) });
  };

  const clearYears = () => {
    setLocalFilters({ ...localFilters, yearStart: [] });
  };

  const handleYearToggle = (year: number) => {
    const current = localFilters.yearStart;
    const updated = current.includes(year)
      ? current.filter(y => y !== year)
      : [...current, year];
    setLocalFilters({ ...localFilters, yearStart: updated });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const reset: Filters = { yearStart: [], industry: '', constructionStage: '', search: '' };
    setLocalFilters(reset);
    onFilterChange(reset);
  };

  const hasActiveFilters = localFilters.yearStart.length > 0 || localFilters.industry || localFilters.constructionStage || localFilters.search;

  if (mode === 'builders') {
    const handleCategoryToggle = (category: string) => {
      onBuilderCategoryChange?.(builderCategory === category ? '' : category);
    };

    return (
      <div className={`filter-panel ${collapsed ? 'collapsed' : ''} ${darkMode ? 'dark' : ''}`}>
        <div className="filter-header" onClick={() => setCollapsed(!collapsed)}>
          <div className="filter-header-left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Фильтры</span>
            {builderCategory && <span className="filter-active-dot" />}
          </div>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {!collapsed && (
          <div className="filter-body">
            <div className="filter-section">
              <div className="filter-section-header">
                <span className="filter-section-title">Категория</span>
                {builderCategory && (
                  <div className="filter-section-actions">
                    <button onClick={() => handleCategoryToggle(builderCategory)}>Сброс</button>
                  </div>
                )}
              </div>
              <div className="year-chips">
                {BUILDER_CATEGORIES.map(category => (
                  <button
                    key={category}
                    className={`year-chip ${builderCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-count">
              Найдено: <strong>{totalBuilders}</strong> объектов
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`filter-panel ${collapsed ? 'collapsed' : ''} ${darkMode ? 'dark' : ''}`}>
      <div className="filter-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="filter-header-left">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Фильтры</span>
          {hasActiveFilters && <span className="filter-active-dot" />}
        </div>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {!collapsed && (
        <div className="filter-body">
          <div className="filter-section">
            <div className="filter-search-wrapper">
              <svg className="filter-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="filter-search"
                placeholder="Поиск объекта..."
                value={localFilters.search}
                onChange={e => setLocalFilters({ ...localFilters, search: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleApply()}
              />
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-section-header">
              <span className="filter-section-title">Год начала</span>
              <div className="filter-section-actions">
                <button onClick={selectAllYears}>Все</button>
                <button onClick={clearYears}>Сброс</button>
              </div>
            </div>
            <div className="year-chips">
              {yearStats.map(ys => (
                <button
                  key={ys.year}
                  className={`year-chip ${localFilters.yearStart.includes(ys.year) ? 'active' : ''}`}
                  onClick={() => handleYearToggle(ys.year)}
                >
                  {ys.year}
                  <span className="year-chip-count">{ys.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <span className="filter-section-title">Отрасль</span>
            <select
              className="filter-select"
              value={localFilters.industry}
              onChange={e => setLocalFilters({ ...localFilters, industry: e.target.value })}
            >
              <option value="">Все отрасли</option>
              {industries.map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <span className="filter-section-title">Этап строительства</span>
            <select
              className="filter-select"
              value={localFilters.constructionStage}
              onChange={e => setLocalFilters({ ...localFilters, constructionStage: e.target.value })}
            >
              <option value="">Все этапы</option>
              <option value="Строится">Строится (без этапа)</option>
              {stages.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="filter-actions">
            <button className="filter-btn-primary" onClick={handleApply}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Применить
            </button>
            <button className="filter-btn-secondary" onClick={handleReset}>
              Сбросить всё
            </button>
          </div>

          <div className="filter-count">
            Найдено: <strong>{totalObjects}</strong> объектов
          </div>
        </div>
      )}
    </div>
  );
}
