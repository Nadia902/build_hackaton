'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

const CoatOfArms = dynamic(() => import('@/components/CoatOfArms'), { ssr: false });

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target, duration]);

  return <div ref={ref}>{count}</div>;
}

export default function LandingPage() {
  const [stats, setStats] = useState<any>(null);
  const [scrollY, setScrollY] = useState(0);

  const [sliderPos, setSliderPos] = useState(50);
  const [isDesktop, setIsDesktop] = useState(true); 
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {});
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  
  useEffect(() => {
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    setIsDesktop(hasMouse);

    
    if (!hasMouse) {
      let startTime: number | null = null;
      let animationFrameId: number;

      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const progress = (time - startTime) / 1000;
        
        const newPos = 50 + Math.sin(progress * 1.2) * 20;
        setSliderPos(newPos);
        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, []);

  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, x)));
  }, [isDesktop]);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', color: '#fff', overflow: 'hidden' }}>

      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'default', 
          userSelect: 'none',
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: 'url("/after.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />

        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: `${sliderPos}%`,
          zIndex: 0,
          backgroundImage: 'url("/before.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          borderRight: '2px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.5)',
          
          transition: isDesktop ? 'none' : 'width 0.05s ease-out',
        }} />

        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderPos}%`,
          width: '2px',
          background: '#ffffff',
          zIndex: 1,
          pointerEvents: 'none',
          boxShadow: '0 0 10px rgba(255,255,255,0.8)',
        }}>
        </div>

        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'radial-gradient(ellipse at center, rgba(10, 15, 26, 0.65) 0%, rgba(10, 15, 26, 0.85) 100%)',
          backdropFilter: 'blur(3px)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          zIndex: 2,
          padding: '6px 14px',
          background: 'rgba(95, 95, 95, 0.47)',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}>
          Было
        </div>
        <div style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          zIndex: 2,
          padding: '6px 14px',
          background: 'rgba(95, 95, 95, 0.47)',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}>
          Стало
        </div>

        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: '900px',
          transform: `translateY(${scrollY * 0.3}px)`,
          pointerEvents: 'auto',
        }}>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            <CoatOfArms />
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 5.5vw, 58px)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '20px',
            letterSpacing: '-0.5px',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Меняем регион к лучшему
            </span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #fff 0%, #93c5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              вместе
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: '#e2e8f0',
            lineHeight: 1.6,
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px',
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}>
            Интерактивный портал объектов капитального строительства
            Тульской области. Мониторинг, аналитика и управление
            в одном месте.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/map" className="landing-btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
              Открыть карту
            </a>
            <a href="/admin" className="landing-btn-secondary">
              Админ-панель
            </a>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 2, animation: 'bounce 2s infinite', pointerEvents: 'none',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      <section style={{
        position: 'relative',
        padding: '80px 24px',
        background: '#0d1b2a',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, marginBottom: '12px' }}>
              Цифры говорят сами за себя
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>Актуальная статистика по объектам</p>
          </div>

          <div className="stats-grid">
            {[
              { value: stats?.total || 0, label: 'Всего объектов', icon: '🏗', color: '#3b82f6' },
              { value: stats?.completed || 0, label: 'Введено в эксплуатацию', icon: '✅', color: '#22c55e' },
              { value: stats?.active || 0, label: 'В стадии строительства', icon: '🔨', color: '#f97316' },
              { value: Object.keys(stats?.by_industry || {}).length, label: 'Отраслей', icon: '🏭', color: '#a855f7' },
            ].map((stat, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="stat-card-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-card-value" style={{ color: stat.color }}>
                  <AnimatedCounter target={stat.value} />
                </div>
                <div className="stat-card-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        padding: '80px 24px',
        background: '#111827',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, marginBottom: '12px' }}>
              Возможности платформы
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>Всё необходимое для управления строительством</p>
          </div>

          <div className="features-grid">
            {[
              { icon: '🗺', title: 'Интерактивная карта', desc: 'Визуализация всех объектов на карте с фильтрацией по отраслям, стадиям и годам' },
              { icon: '📊', title: 'Аналитика и статистика', desc: 'Дашборд с ключевыми метриками: готовность, распределение по отраслям и этапам' },
              { icon: '🔍', title: 'Умный поиск', desc: 'Быстрый поиск по наименованию, адресу и другим параметрам объекта' },
              { icon: '📹', title: 'Видеонаблюдение', desc: 'Мониторинг строительных площадок в реальном времени для администраторов' },
              { icon: '📥', title: 'Импорт данных', desc: 'Загрузка данных из Excel и CSV файлов с автоматическим обновлением базы' },
              { icon: '📱', title: 'Мобильная версия', desc: 'Полнофункциональный доступ с любых устройств без потери работоспособности' },
            ].map((feature, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, #111827 0%, #0d1b2a 100%)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, marginBottom: '12px' }}>
            Объекты всех отраслей
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '48px' }}>
            От школ до больниц — полный контроль над строительством
          </p>

          <div className="industry-tags">
            {[
              { name: 'Образование', color: '#3b82f6', icon: '🎓' },
              { name: 'Здравоохранение', color: '#ef4444', icon: '🏥' },
              { name: 'Культура', color: '#a855f7', icon: '🎭' },
              { name: 'Спорт', color: '#f97316', icon: '⚽' },
              { name: 'Строительство', color: '#eab308', icon: '🏗' },
              { name: 'ЖКХ', color: '#22c55e', icon: '🏠' },
              { name: 'Соц. политика', color: '#06b6d4', icon: '🤝' },
              { name: 'Информатика', color: '#6366f1', icon: '💻' },
            ].map((ind, i) => (
              <div key={i} className="industry-tag" style={{
                borderColor: `${ind.color}40`,
                animationDelay: `${i * 0.05}s`,
              }}>
                <span>{ind.icon}</span>
                <span>{ind.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        padding: '80px 24px',
        background: '#0a0f1a',
        textAlign: 'center',
      }}>
        <div style={{
          maxWidth: '600px', margin: '0 auto',
          padding: '48px 32px',
          background: 'linear-gradient(135deg, rgba(13,27,62,0.5), rgba(21,101,192,0.2))',
          border: '1px solid rgba(21,101,192,0.3)',
          borderRadius: '24px',
        }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, marginBottom: '16px' }}>
            Начните использовать уже сегодня
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '15px' }}>
            Полный доступ к интерактивной карте и аналитике
          </p>
          <a href="/map" className="landing-btn-primary" style={{ fontSize: '16px', padding: '14px 32px' }}>
            Перейти к карте →
          </a>
        </div>
      </section>

      <footer style={{
        padding: '24px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center',
        color: '#475569',
        fontSize: '13px',
      }}>
        © 2026 Министерство строительства ТО
      </footer>
    </div>
  );
}