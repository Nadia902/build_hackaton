<div align="center">

# 🏗️ СтройПортал — Тульская область

**Интерактивный портал объектов капитального строительства Тульской области**

Мониторинг · Аналитика · Управление — в одном месте

![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker_Compose-2496ED?logo=docker&logoColor=white)

</div>

---

## 📖 О проекте

Интерактивный портал для мониторинга и управления объектами капитального строительства Тульской области. Позволяет отслеживать ход строительства, анализировать обеспеченность муниципалитетов и работать с данными в удобном веб-интерфейсе.

---

## 🧰 Стек технологий

| Слой         | Технологии                                                          |
| ------------ | ------------------------------------------------------------------ |
| **Frontend** | Next.js 14, React 18, Leaflet, TypeScript                          |
| **Backend**  | FastAPI, Python 3.11, SQLAlchemy (async), PostgreSQL               |
| **Infra**    | Docker Compose, Nginx                                              |

---

## ✨ Возможности

- 🗓️ **Фильтрация** по годам, отраслям и стадиям строительства
- 🚦 **Светофор обеспеченности** муниципалитетов
- 🚶 **Пешие изохроны** (зона доступности 15 мин) через Yandex Isoline API
- 🏢 **Карточки объектов** с фото до/после, видеонаблюдением и статусом готовности
- 📊 **Импорт / экспорт** данных из CSV и Excel
- 🔐 **Админ-панель** с управлением пользователями и статистикой
- 🌙 **Тёмная тема** и адаптивный дизайн

---

## 🚀 Запуск

```bash
docker compose up --build
```

После сборки приложение будет доступно по адресу, указанному в `docker-compose.yml` (по умолчанию — через Nginx-прокси).

---

## 📁 Структура проекта

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
```

---

## 🖼️ Скриншот

<img width="1903" height="870" alt="2026-09-16_20-39-37" src="https://github.com/user-attachments/assets/8596b581-7476-4857-a5f8-503e0e8919c1" />
<img width="1171" height="438" alt="2026-09-16_20-39-56" src="https://github.com/user-attachments/assets/945f9166-fc52-491f-b5bc-03a863b1d2ef" />
<img width="1290" height="670" alt="2026-09-16_20-40-04" src="https://github.com/user-attachments/assets/d9ca1904-a0ac-4da9-b5db-849c519e2002" />
<img width="1913" height="880" alt="2026-09-16_20-40-26" src="https://github.com/user-attachments/assets/9a1133d5-08cf-4732-acfb-ddc6207925c4" />
<img width="1909" height="874" alt="2026-09-16_20-41-02" src="https://github.com/user-attachments/assets/adefd339-4bb6-4a25-bee8-c37956eecd93" />

---

<div align="center">

<sub>Сделано для Тульской области · 2026</sub>

</div>








