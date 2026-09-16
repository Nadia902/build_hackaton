# СтройПортал — Тульская область

Интерактивный портал объектов капитального строительства Тульской области. Мониторинг, аналитика и управление в одном месте.

## Стек

- **Frontend**: Next.js 14, React 18, Leaflet, TypeScript
- **Backend**: FastAPI, Python 3.11, SQLAlchemy (async), PostgreSQL
- **Infra**: Docker Compose, Nginx

## Возможности

- Фильтрация по годам, отраслям и стадиям строительства
- Светофор обеспеченности муниципалитетов
- Пешие изохроны (зона доступности 15 мин) через Yandex Isoline API
- Карточки объектов с фото до/после, видеонаблюдением и статусом готовности
- Импорт/экспорт данных из CSV и Excel
- Админ-панель с управлением пользователями и статистикой
- Тёмная тема, адаптивный дизайн

## Запуск

```bash
docker compose up --build
```

## Структура

```
PORTAL/
├── backend/          # FastAPI сервер
│   ├── main.py       # API маршруты
│   ├── database.py   # SQLAlchemy модели
│   ├── auth.py       # JWT аутентификация
│   └── Dockerfile
├── frontend/         # Next.js приложение
│   ├── src/
│   │   ├── app/      # Страницы (landing, map, admin)
│   │   ├── components/
│   │   └── types/
│   └── Dockerfile
├── nginx/            # Nginx прокси
└── docker-compose.yml

<img width="1903" height="870" alt="2026-09-16_20-39-37" src="https://github.com/user-attachments/assets/bf650eb9-ce7d-4a31-8d64-f02cd6b78d1c" />
<img width="1171" height="438" alt="2026-09-16_20-39-56" src="https://github.com/user-attachments/assets/5f00204d-bff0-464b-a7a2-f770d5ac89e1" />
<img width="1290" height="670" alt="2026-09-16_20-40-04" src="https://github.com/user-attachments/assets/593052aa-9fa5-4792-8527-f89612a13774" />
<img width="1913" height="880" alt="2026-09-16_20-40-26" src="https://github.com/user-attachments/assets/b1f4f9ab-5ed0-47e5-93ce-eede94d8097e" />
<img width="1909" height="874" alt="2026-09-16_20-41-02" src="https://github.com/user-attachments/assets/7536043d-a09b-4287-b665-8ab1ba839f76" />





