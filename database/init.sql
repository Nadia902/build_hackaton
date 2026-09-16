-- Инициализация базы данных Imposter
-- Этот файл выполнится автоматически при первом запуске PostgreSQL

-- Создаём расширение для UUID (если понадобится)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Приветственное сообщение в логах
DO $$
BEGIN
    RAISE NOTICE 'База данных Imposter успешно инициализирована!';
END $$;
