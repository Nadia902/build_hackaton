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

Портал будет доступен по адресу: `http://158.160.191.122:16000`

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
