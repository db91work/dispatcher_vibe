# Dispatcher Vibe — Панель управления покупателями

## Описание проекта

Веб-приложение для управления данными покупателей с визуализацией цен товаров.
Две страницы: таблица покупателей (CRUD) и график динамики цен.

## Стек технологий

| Слой       | Технология                          |
|------------|-------------------------------------|
| Frontend   | React 18, Ant Design 5, Recharts 2  |
| Backend    | Spring Boot 3.2.5, Java 17          |
| БД         | PostgreSQL (Spring Data JPA)         |
| HTTP       | Axios                               |
| Даты       | Day.js                              |

## Структура проекта

```
dispatcher_vibe/
├── backend/                        # Spring Boot API
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/example/customers/
│       │   ├── CustomersApplication.java      # Точка входа
│       │   ├── DataLoader.java                # Начальные данные (5 записей)
│       │   ├── controller/
│       │   │   └── CustomerController.java    # REST: GET, POST, PUT
│       │   ├── model/
│       │   │   └── Customer.java              # JPA-сущность
│       │   ├── repository/
│       │   │   └── CustomerRepository.java    # JpaRepository
│       │   └── service/                       # (пока пусто)
│       └── resources/
│           └── application.properties
├── frontend/                       # React SPA
│   ├── package.json
│   ├── public/index.html
│   └── src/
│       ├── index.js                # Точка входа React
│       ├── App.js                  # Табы: Покупатели / Цены
│       ├── CustomersPage.js        # Таблица покупателей (CRUD)
│       └── PricesPage.js           # График цен (Recharts)
├── start.bat                       # Запуск всего одной командой
└── .gitignore
```

## Модель данных

**Customer** (таблица `customers`):
- `id` — Long, автогенерация (IDENTITY)
- `name` — String, обязательное
- `lastVisit` — LocalDateTime
- `totalPurchased` — Double

## API-эндпоинты

| Метод | URL                    | Описание              |
|-------|------------------------|-----------------------|
| GET   | /api/customers         | Список всех покупателей |
| POST  | /api/customers         | Создать покупателя     |
| PUT   | /api/customers/{id}    | Обновить покупателя    |

## Запуск

### Предварительные требования
- Java 17+
- Maven
- Node.js 18+
- PostgreSQL (БД: `dispatcher_test`, логин: `db_test`, пароль: `test`)

### Быстрый запуск (Windows)
```bat
start.bat
```

### Ручной запуск
```bash
# Backend (порт 8080)
cd backend
mvn spring-boot:run

# Frontend (порт 3000)
cd frontend
npm install
npm start
```

## Конфигурация

- Backend порт: `8080` (application.properties)
- Frontend порт: `3000` (react-scripts default)
- CORS: разрешён `http://localhost:3000`
- Frontend proxy: `http://localhost:8080` (package.json)

## Команды разработки

```bash
# Backend
cd backend
mvn spring-boot:run          # Запуск
mvn clean package            # Сборка JAR
mvn test                     # Тесты

# Frontend
cd frontend
npm start                    # Dev-сервер
npm run build                # Production-сборка
npm install <package>        # Добавить зависимость
```

---

## Рекомендации по улучшению

### Критичные

1. **Удаление (DELETE)** — нет эндпоинта и кнопки удаления покупателя. Добавить `DELETE /api/customers/{id}` и кнопку в таблицу.

2. **Валидация на бэкенде** — нет проверки входных данных. Добавить `@Valid`, `@NotBlank`, `@Size` аннотации на поля модели + `@Validated` на контроллер.

3. **Пароль БД в коде** — `application.properties` содержит пароль в открытом виде. Использовать переменные окружения или Spring Profiles:
   ```properties
   spring.datasource.password=${DB_PASSWORD}
   ```

4. **Обработка ошибок** — нет глобального обработчика. Добавить `@RestControllerAdvice` с кастомными ответами ошибок.

### Архитектурные

5. **Service-слой пуст** — контроллер работает напрямую с репозиторием. Вынести бизнес-логику в `CustomerService`, чтобы контроллер оставался тонким.

6. **DTO** — сущность JPA напрямую отдаётся в API. Создать `CustomerDTO` / `CustomerRequest` для разделения слоёв.

7. **Пагинация** — `findAll()` вернёт все записи. При росте данных будут проблемы. Использовать `Pageable` и `Page<Customer>`.

8. **Данные графика цен генерируются на фронте** — при каждом рендере новые случайные числа. Хранить цены в БД (новая сущность `Price`) и отдавать через API.

### Качество кода

9. **Тесты** — нет ни unit-, ни integration-тестов. Добавить:
   - JUnit 5 + Mockito для сервисов
   - `@WebMvcTest` для контроллеров
   - React Testing Library для фронтенда

10. **Логирование** — нет логов. Добавить SLF4J логирование в контроллер и сервис.

11. **Линтинг фронтенда** — нет ESLint/Prettier конфигурации. Добавить для единообразия кода.

### UX / Фронтенд

12. **Поиск и фильтрация** — в таблице нет поиска по имени или фильтрации по дате/сумме. Ant Design Table поддерживает это из коробки.

13. **Сортировка** — добавить `sorter` на колонки таблицы (по имени, дате, сумме).

14. **Подтверждение действий** — нет модального окна при удалении (когда будет добавлено). Использовать `Modal.confirm()`.

15. **Локализация дат** — DatePicker на английском. Подключить `dayjs/locale/ru` и Ant Design locale.

### DevOps

16. **Docker** — нет контейнеризации. Добавить `Dockerfile` для backend и frontend + `docker-compose.yml` с PostgreSQL.

17. **CI/CD** — нет пайплайна. Добавить GitHub Actions для сборки, тестов, линтинга.

18. **Environment-файлы** — создать `.env.example` для фронтенда с `REACT_APP_API_URL`, чтобы не хардкодить `localhost:8080`.
