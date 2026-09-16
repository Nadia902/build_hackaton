'use client';

import { useState, useEffect } from 'react';
import type { SocialObject, Builder } from '@/types';

interface ObjectCardProps {
  object?: SocialObject | null;
  builder?: Builder | null;
  onClose: () => void;
  isAdmin?: boolean;
  darkMode?: boolean;
}

const VIDEO_URL = 'https://runtime.strm.yandex.ru/player/episode/vpleltr5pek64qhahpyp?autoplay=0&mute=0&tv=0&mute=1&autoplay=1&play_on_visible=true&hidden=sound2';
const COMPLAINT_URL = 'https://or71.ru/solve/add/stroitelnyy-nadzor/';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU');
  } catch { return dateStr; }
}

function getStageBadgeClass(stage: string | null): string {
  if (!stage) return 'badge-planned';
  const s = stage.toLowerCase();
  if (s.includes('введен')) return 'badge-completed';
  if (s.includes('строит')) return 'badge-active';
  return 'badge-planned';
}

function FieldRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="card-field">
      <span className="card-field-label">{label}</span>
      <span className="card-field-value">{value}</span>
    </div>
  );
}

function DateFieldRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  const formatted = formatDate(value);
  if (!formatted) return null;
  return (
    <div className="card-field">
      <span className="card-field-label">{label}</span>
      <span className="card-field-value">{formatted}</span>
    </div>
  );
}

function PhotoSection({ before, after, name, loading, darkMode }: { before: string | null; after: string | null; name: string; loading?: boolean; darkMode?: boolean }) {
  const [photoMode, setPhotoMode] = useState<'before' | 'after'>('before');
  const [fullscreen, setFullscreen] = useState(false);

  const hasBefore = !!before;
  const hasAfter = !!after;
  const currentSrc = photoMode === 'before' ? before : after;

  if (loading) {
    return (
      <div className="card-section">
        <h3>Фото</h3>
        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
          Загрузка фотографий...
        </div>
      </div>
    );
  }

  if (!hasBefore && !hasAfter) return null;

  return (
    <div className="card-section">
      <h3>Фото</h3>
      {(hasBefore || hasAfter) && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          {hasBefore && (
            <button
              className={`photo-toggle-btn ${photoMode === 'before' ? 'active' : ''} ${darkMode ? 'dark' : ''}`}
              onClick={() => setPhotoMode('before')}
            >
              До
            </button>
          )}
          {hasAfter && (
            <button
              className={`photo-toggle-btn ${photoMode === 'after' ? 'active' : ''} ${darkMode ? 'dark' : ''}`}
              onClick={() => setPhotoMode('after')}
            >
              После
            </button>
          )}
        </div>
      )}
      {currentSrc && (
        <div className="photo-section" style={{ cursor: 'pointer' }} onClick={() => setFullscreen(true)}>
          <img src={currentSrc} alt={`${name} — ${photoMode === 'before' ? 'до' : 'после'}`} />
        </div>
      )}

      {fullscreen && currentSrc && (
        <div
          className="photo-fullscreen"
          onClick={() => setFullscreen(false)}
        >
          <div className="photo-fullscreen-inner" onClick={e => e.stopPropagation()}>
            {(hasBefore || hasAfter) && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', justifyContent: 'center' }}>
                {hasBefore && (
                  <button
                    onClick={() => setPhotoMode('before')}
                    style={{
                      padding: '8px 24px', fontSize: '14px', fontWeight: 600, border: 'none', borderRadius: '8px',
                      background: photoMode === 'before' ? '#fff' : 'rgba(255,255,255,0.2)',
                      color: photoMode === 'before' ? '#1a237e' : '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    До
                  </button>
                )}
                {hasAfter && (
                  <button
                    onClick={() => setPhotoMode('after')}
                    style={{
                      padding: '8px 24px', fontSize: '14px', fontWeight: 600, border: 'none', borderRadius: '8px',
                      background: photoMode === 'after' ? '#fff' : 'rgba(255,255,255,0.2)',
                      color: photoMode === 'after' ? '#1a237e' : '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    После
                  </button>
                )}
              </div>
            )}
            <img src={currentSrc} alt={name} style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: '8px' }} />
            <button
              onClick={() => setFullscreen(false)}
              style={{
                position: 'absolute', top: '12px', right: '12px',
                width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '18px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ObjectCard({ object: obj, builder, onClose, isAdmin, darkMode = false }: ObjectCardProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [photos, setPhotos] = useState<{ photo_before: string | null; photo_after: string | null } | null>(null);
  const [photosLoading, setPhotosLoading] = useState(true);

  
  
  useEffect(() => {
    if (!obj) return;
    setPhotosLoading(true);
    fetch(`/api/objects/${obj.id}/photos`)
      .then(r => r.json())
      .then(data => { setPhotos(data); setPhotosLoading(false); })
      .catch(() => setPhotosLoading(false));
  }, [obj?.id]);

  
  
  if (builder) {
    return (
      <div className={`object-card ${darkMode ? 'dark' : ''}`}>
        <div className="card-header">
          <h2>{builder.title}</h2>
          <button className="card-close" onClick={onClose}>✕</button>
        </div>
        <div className="card-body">
          <div className="card-section">
            <h3>Основная информация</h3>
            <FieldRow label="Наименование" value={builder.title} />
            <FieldRow label="Адрес" value={builder.address} />
          </div>
        </div>
      </div>
    );
  }

  if (!obj) return null;

  return (
    <div className={`object-card ${darkMode ? 'dark' : ''}`}>
      <div className="card-header">
        <h2>{obj.oks_name || `Объект #${obj.num}`}</h2>
        <button className="card-close" onClick={onClose}>✕</button>
      </div>

      <div className="card-body">
        <div className="card-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={`card-badge ${getStageBadgeClass(obj.construction_stage)}`}>
              {obj.construction_stage || 'Строится'}
            </span>
            {obj.num && <span className="card-num">№ {obj.num}</span>}
          </div>
        </div>

        {!isAdmin && (
          <>
            <div className="card-section">
              <h3>Основная информация</h3>
              <FieldRow label="Наименование" value={obj.oks_name} />
              <FieldRow label="Адрес" value={obj.address} />
              <FieldRow label="Общая площадь" value={obj.total_area_m2 ? `${obj.total_area_m2.toLocaleString('ru-RU')} м²` : null} />
              <FieldRow label="Стадия" value={obj.construction_stage} />
              <FieldRow label="Отрасль" value={obj.industry} />
              <FieldRow label="Статус" value={obj.status} />
              <FieldRow label="Собственность" value={obj.ownership} />
              <FieldRow label="АМО" value={obj.amo} />
              <FieldRow label="Заказчик" value={obj.customer} />
              <FieldRow label="Подрядчик" value={obj.contractor} />
            </div>

            <div className="card-section">
              <h3>Сроки и даты</h3>
              <FieldRow label="Год ввода в эксплуатацию" value={obj.year_commissioned} />
              <FieldRow label="Год окончания строительства" value={obj.year_end} />
              <FieldRow label="Сроки строительства" value={obj.construction_period} />
            </div>

            <PhotoSection before={photos?.photo_before || null} after={photos?.photo_after || null} name={obj.oks_name || `Объект #${obj.num}`} loading={photosLoading} darkMode={darkMode} />

            {obj.construction_readiness != null && obj.construction_readiness > 0 && (
              <div className="card-section">
                <h3>Строительная готовность</h3>
                <div className="card-field">
                  <span className="card-field-value" style={{ fontWeight: 700 }}>{obj.construction_readiness}%</span>
                </div>
                <div className="readiness-bar">
                  <div className="readiness-fill" style={{ width: `${Math.min(obj.construction_readiness, 100)}%` }} />
                </div>
              </div>
            )}
          </>
        )}

        {isAdmin && (
          <>
            <div className="card-section">
              <h3>Основная информация</h3>
              <FieldRow label="Наименование" value={obj.oks_name} />
              <FieldRow label="Адрес" value={obj.address} />
              <FieldRow label="Общая площадь" value={obj.total_area_m2 ? `${obj.total_area_m2.toLocaleString('ru-RU')} м²` : null} />
              <FieldRow label="Мощность" value={obj.capacity} />
              <FieldRow label="Экспертиза" value={obj.expertise} />
            </div>

            <div className="card-section">
              <h3>Реквизиты</h3>
              <FieldRow label="ГРБС" value={obj.grbs} />
              <FieldRow label="Стадия" value={obj.construction_stage} />
              <FieldRow label="Отрасль" value={obj.industry} />
              <FieldRow label="Статус" value={obj.status} />
              <FieldRow label="Собственность" value={obj.ownership} />
              <FieldRow label="АМО" value={obj.amo} />
              <FieldRow label="Заказчик" value={obj.customer} />
              <FieldRow label="НП/ГП" value={obj.np_gp_name} />
              <FieldRow label="ФП" value={obj.fp_name} />
              <FieldRow label="Код проекта" value={obj.project_code} />
              <FieldRow label="Подрядчик" value={obj.contractor} />
            </div>

            <div className="card-section">
              <h3>Сроки и даты</h3>
              <FieldRow label="Год начала" value={obj.year_start} />
              <FieldRow label="Год ввода в эксплуатацию" value={obj.year_commissioned} />
              <FieldRow label="Год окончания строительства" value={obj.year_end} />
              <FieldRow label="Сроки строительства" value={obj.construction_period} />
              <DateFieldRow label="Дата передачи участка" value={obj.land_transfer_date} />
              <DateFieldRow label="Разрешение на строительство" value={obj.building_permit_date} />
              <DateFieldRow label="Дата контракта" value={obj.contract_date} />
              <FieldRow label="Сроки контракта" value={obj.contract_period} />
              <DateFieldRow label="Установка оборудования" value={obj.equipment_installation_date} />
              <DateFieldRow label="Гидроиспытания" value={obj.hydro_test_date} />
              <DateFieldRow label="Акт ввода" value={obj.zos_date} />
            </div>

            <PhotoSection before={photos?.photo_before || null} after={photos?.photo_after || null} name={obj.oks_name || `Объект #${obj.num}`} loading={photosLoading} darkMode={darkMode} />

            {obj.construction_readiness != null && obj.construction_readiness > 0 && (
              <div className="card-section">
                <h3>Строительная готовность</h3>
                <div className="card-field">
                  <span className="card-field-value" style={{ fontWeight: 700 }}>{obj.construction_readiness}%</span>
                </div>
                <div className="readiness-bar">
                  <div className="readiness-fill" style={{ width: `${Math.min(obj.construction_readiness, 100)}%` }} />
                </div>
              </div>
            )}

            <div className="card-section">
              <h3>Видеонаблюдение</h3>
              {showVideo ? (
                <div className="video-section">
                  <div className="video-container">
                    <iframe src={VIDEO_URL} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
                  </div>
                  <button className="btn btn-secondary" style={{ marginTop: '8px', width: '100%' }} onClick={() => setShowVideo(false)}>
                    Закрыть видео
                  </button>
                </div>
              ) : (
                <div className="video-placeholder" onClick={() => setShowVideo(true)}>
                  <svg viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                  <span>Нажмите для просмотра камеры</span>
                </div>
              )}
            </div>
          </>
        )}

        <div className="card-section">
          <div className="card-actions">
            <a href={COMPLAINT_URL} target="_blank" rel="noopener noreferrer" className="btn btn-complaint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
              </svg>
              Оставить обращение
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
