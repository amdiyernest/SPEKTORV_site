# SPEKTOR_V — Технический стек

## Текущий стек

### Фреймворк
- **Astro 4.x** — статическая генерация сайта (SSG), output: static
- Без UI-фреймворков (нет React, Vue, Svelte)

### Стили
- **Vanilla CSS** с CSS Custom Properties (переменные)
- Архитектура: `variables.css → base.css → components.css → pages/*.css`
- Шрифты: Google Fonts — Playfair Display + Montserrat

### JavaScript
- **Vanilla JS ES6+**, три файла:
  - `nav.js` — IntersectionObserver, переключение dark/light навигации
  - `filters.js` — переключение фильтров через data-filter-group
  - `carousel.js` — горизонтальный скролл каруселей

### Деплой
- **GitHub Pages** через GitHub Actions (`.github/workflows/deploy.yml`)
- Ветка: `master` → автосборка → публикация

### Структура проекта
```
site/           ← Astro-проект (весь код сайта)
docs/brand/     ← документация бренда
docs/superpowers/ ← планы агентов
.github/        ← CI/CD
```

---

## Планируемый стек (следующие фазы)

| Что | Зачем |
|-----|-------|
| Sanity CMS | Управление товарами и отзывами без кода |
| GSAP + ScrollTrigger | Продвинутые анимации |
| Ozon / WB API | Автообновление цен и наличия |
| ЮKassa | Приём платежей напрямую |
| Яндекс.Метрика | Аналитика и цели конверсии |
