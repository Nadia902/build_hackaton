'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/components/AdminAuth';

interface AdminStats {
  total_objects: number;
  total_users: number;
  avg_readiness: number;
  completed_count: number;
  active_count: number;
  by_stage: Record<string, number>;
  by_industry: Record<string, number>;
}

export default function AdminDashboard() {
  const { user, token, logout, isLoading } = useAdminAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'import' | 'export'>('dashboard');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (token) {
      fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(setStats)
        .catch(() => {});
    }
  }, [token]);

  if (isLoading || !user) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <header style={{
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: '#fff',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '24px' }}>🛡</span>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Админ-панель</h1>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>Портал ОКС Тульской области</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', opacity: 0.9 }}>{user.username}</span>
          <a
            href="/"
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            На портал
          </a>
          <button
            onClick={() => { logout(); router.push('/admin/login'); }}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Выйти
          </button>
        </div>
      </header>

      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        padding: '0 32px',
        display: 'flex',
        gap: '0',
      }}>
        {[
          { key: 'dashboard', label: '📊 Дашборд' },
          { key: 'users', label: '👥 Пользователи' },
          { key: 'import', label: '📥 Импорт данных' },
          { key: 'export', label: '📤 Экспорт данных' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '14px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key ? '3px solid #1a237e' : '3px solid transparent',
              color: activeTab === tab.key ? '#1a237e' : '#666',
              fontWeight: activeTab === tab.key ? 600 : 400,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'dashboard' && stats && <DashboardTab stats={stats} />}
        {activeTab === 'users' && <UsersTab token={token} />}
        {activeTab === 'import' && <ImportTab token={token} />}
        {activeTab === 'export' && <ExportTab token={token} />}
      </div>
    </div>
  );
}

function DashboardTab({ stats }: { stats: AdminStats }) {
  const cards = [
    { label: 'Всего объектов', value: stats.total_objects, color: '#1a237e', icon: '🏗' },
    { label: 'Введено в эксплуатацию', value: stats.completed_count, color: '#2e7d32', icon: '✅' },
    { label: 'В строительстве', value: stats.active_count, color: '#ef6c00', icon: '🔨' },
    { label: 'Средняя готовность', value: `${stats.avg_readiness}%`, color: '#1565c0', icon: '📈' },
    { label: 'Пользователей', value: stats.total_users, color: '#6a1b9a', icon: '👥' },
  ];

  return (
    <>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a237e', marginBottom: '24px' }}>
        Обзор системы
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {cards.map(card => (
          <div key={card.label} style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderLeft: `4px solid ${card.color}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>{card.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: card.color }}>{card.value}</div>
              </div>
              <span style={{ fontSize: '24px' }}>{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1a237e', marginBottom: '16px' }}>
            По этапам строительства
          </h3>
          {Object.entries(stats.by_stage).map(([stage, count]) => (
            <div key={stage} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: '#555' }}>{stage}</span>
                <span style={{ fontWeight: 600, color: '#1a237e' }}>{count}</span>
              </div>
              <div style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(count / stats.total_objects) * 100}%`,
                  background: 'linear-gradient(90deg, #1a237e, #42a5f5)',
                  borderRadius: '3px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1a237e', marginBottom: '16px' }}>
            По отраслям
          </h3>
          {Object.entries(stats.by_industry).map(([industry, count]) => (
            <div key={industry} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: '#555' }}>{industry}</span>
                <span style={{ fontWeight: 600, color: '#1a237e' }}>{count}</span>
              </div>
              <div style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(count / stats.total_objects) * 100}%`,
                  background: 'linear-gradient(90deg, #ef6c00, #ffb74d)',
                  borderRadius: '3px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function UsersTab({ token }: { token: string | null }) {
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const fetchUsers = () => {
    fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setUsers)
      .catch(() => {});
  };

  useEffect(() => { fetchUsers(); }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUser),
    });
    if (res.ok) {
      setMessage('Пользователь создан');
      setNewUser({ username: '', password: '' });
      fetchUsers();
    } else {
      const data = await res.json();
      setMessage(data.detail || 'Ошибка');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить пользователя?')) return;
    await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  return (
    <>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a237e', marginBottom: '24px' }}>
        Управление пользователями
      </h2>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '24px',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1a237e', marginBottom: '16px' }}>
          Добавить пользователя
        </h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Логин</label>
            <input
              type="text"
              value={newUser.username}
              onChange={e => setNewUser({ ...newUser, username: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '13px',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Пароль</label>
            <input
              type="password"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '13px',
              }}
            />
          </div>
          <button type="submit" style={{
            padding: '8px 20px',
            background: '#1a237e',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}>
            Создать
          </button>
        </form>
        {message && (
          <div style={{
            marginTop: '12px',
            padding: '8px 12px',
            background: message.includes('Ошибка') ? '#ffebee' : '#e8f5e9',
            color: message.includes('Ошибка') ? '#c62828' : '#2e7d32',
            borderRadius: '6px',
            fontSize: '13px',
          }}>
            {message}
          </div>
        )}
      </div>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f7fa' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#888', fontWeight: 600 }}>ID</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#888', fontWeight: 600 }}>Логин</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#888', fontWeight: 600 }}>Создан</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#888', fontWeight: 600 }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#555' }}>{u.id}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 500 }}>{u.username}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#888' }}>
                  {u.created_at ? new Date(u.created_at).toLocaleDateString('ru-RU') : '—'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {u.username !== 'admin' && (
                    <button
                      onClick={() => handleDelete(u.id)}
                      style={{
                        padding: '4px 12px',
                        background: '#ffebee',
                        color: '#c62828',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Удалить
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ImportTab({ token }: { token: string | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const OBJECT_COLUMNS = [
    'num', 'grbs', 'oks_name', 'construction_stage', 'address',
    'latitude', 'longitude', 'industry', 'status', 'ownership',
    'amo', 'customer', 'np_gp_name', 'fp_name', 'project_code',
    'total_area_m2', 'capacity', 'expertise', 'year_start', 'year_end',
    'construction_period', 'land_transfer_date', 'building_permit_date',
    'contract_date', 'contract_period', 'contractor', 'construction_readiness',
    'equipment_installation_date', 'hydro_test_date', 'zos_date', 'zos_number',
    'act_input_date', 'act_input_number', 'year_commissioned', 'photo',
  ];

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/import', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.detail || 'Ошибка загрузки');
    } else {
      setResult(data);
    }
    setLoading(false);
  };

  return (
    <>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a237e', marginBottom: '24px' }}>
        Импорт данных объектов
      </h2>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '24px',
      }}>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
          Загрузите <strong>CSV</strong> или <strong>Excel (.xlsx)</strong> файл со списком объектов капитального строительства.
          <br />
          Столбцы файла должны соответствовать структуре таблицы <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '3px' }}>map_build.social_objects</code>.
          <br />
          Если в файле указан <strong>номер объекта (num)</strong> и он уже существует в базе — запись будет <strong>обновлена</strong>, иначе — <strong>добавлена</strong> как новая.
        </p>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={e => setFile(e.target.files?.[0] || null)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '13px',
            }}
          />
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            style={{
              padding: '8px 20px',
              background: file && !loading ? '#1a237e' : '#9e9e9e',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: file && !loading ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? 'Загрузка...' : 'Импортировать'}
          </button>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            background: '#ffebee',
            color: '#c62828',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '12px',
          }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{
            padding: '16px',
            background: '#f5f7fa',
            borderRadius: '8px',
            fontSize: '13px',
          }}>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '8px' }}>
              <span>Добавлено: <strong style={{ color: '#2e7d32' }}>{result.inserted}</strong></span>
              <span>Обновлено: <strong style={{ color: '#1565c0' }}>{result.updated}</strong></span>
            </div>
            {result.errors.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <strong style={{ color: '#c62828' }}>Ошибки:</strong>
                <ul style={{ margin: '4px 0 0', paddingLeft: '20px' }}>
                  {result.errors.map((e: string, i: number) => (
                    <li key={i} style={{ color: '#c62828' }}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1a237e', marginBottom: '12px' }}>
          Шаблон и столбцы
        </h3>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
          Скачайте CSV-шаблон со всеми столбцами. Заполните данные и загрузите обратно.
        </p>
        <button
          onClick={() => {
            const header = OBJECT_COLUMNS.join(',');
            const example = '1,ГРБС-001,Школа №42,Строится,"г. Тула, ул. Кутузова, 15",54.196,37.615,Образование,Строительство,Мunicipal,Администрация,Департамент образования,,,ПР-001,8500,200 мест,Да,2022,,2022-2025,,,2022-10-15,,ООО СтройИнвест,65,,,,,,,,2025,';
            const csv = header + '\n' + example;
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'social_objects_template.csv';
            a.click();
          }}
          style={{
            padding: '8px 16px',
            background: '#f5f7fa',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Скачать CSV шаблон
        </button>

        <div style={{ marginTop: '16px' }}>
          <h4 style={{ fontSize: '13px', color: '#555', marginBottom: '8px' }}>Столбцы файла:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {OBJECT_COLUMNS.map(col => (
              <span key={col} style={{
                padding: '3px 8px',
                background: '#e8eaf6',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#1a237e',
                fontFamily: 'monospace',
              }}>
                {col}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ExportTab({ token }: { token: string | null }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'csv' | 'xlsx') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/export?format=${format}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `objects.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Ошибка экспорта');
    }
    setLoading(false);
  };

  return (
    <>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a237e', marginBottom: '24px' }}>
        Экспорт данных объектов
      </h2>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        maxWidth: '500px',
      }}>
        <p style={{ fontSize: '14px', color: '#555', marginBottom: '24px', lineHeight: 1.6 }}>
          Скачайте все данные объектов капитального строительства из базы данных
          в формате CSV или Excel.
        </p>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={() => handleExport('csv')}
            disabled={loading}
            style={{
              flex: 1,
              padding: '20px',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#eff6ff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>CSV</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Текстовый формат</div>
          </button>

          <button
            onClick={() => handleExport('xlsx')}
            disabled={loading}
            style={{
              flex: 1,
              padding: '20px',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.background = '#f0fdf4'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>Excel</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Формат .xlsx</div>
          </button>
        </div>

        {loading && (
          <div style={{ marginTop: '16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
            Загрузка файла...
          </div>
        )}
      </div>
    </>
  );
}
