# SPEKTOR_V — Project Guide

## Структура проекта

```
d:/Sektor/
├── site/                        ← Astro-проект (весь код сайта)
│   ├── src/
│   │   ├── components/          ← Nav.astro, Footer.astro
│   │   ├── layouts/             ← BaseLayout.astro
│   │   ├── pages/               ← index.astro, catalog.astro, about.astro, reviews.astro, sitemap.xml.ts
│   │   ├── scripts/             ← nav.js, carousel.js, filters.js
│   │   └── styles/              ← variables.css, base.css, components.css, pages/
│   ├── public/                  ← robots.txt
│   ├── astro.config.mjs
│   └── package.json
├── docs/
│   ├── brand/                   ← CONTEXT.md, DESIGN.md, SITESTRUCTURE.md, STACK.md
│   └── superpowers/plans/       ← планы агентов (пишутся автоматически)
├── .github/workflows/deploy.yml ← автодеплой на GitHub Pages при пуше в master
├── .claude/settings.json        ← хуки Claude Code
└── CLAUDE.md                    ← этот файл
```

## Команды

```bash
cd site && npm run dev      # локальный сервер на localhost:4321
cd site && npm run build    # сборка в site/dist/
```

## Ключевые решения

- **CSS и JS в `src/`** — обрабатываются Vite, не в `public/`
- **`pageCSS` пропа нет** — каждая страница импортирует свой CSS через `import '../styles/pages/home.css'`
- **`filters.js`** использует `data-filter-group` атрибут для независимых групп фильтров
- **`carousel.js`** экспортирует `window.scrollCarousel` для вызова через inline onclick
- **Nav активная ссылка** — передаётся через prop `activePage` в Nav.astro

## Деплой

Пуш в `master` → GitHub Actions собирает Astro → публикует на GitHub Pages.
Настройка в репо: Settings → Pages → Source → GitHub Actions (один раз).

## Документация бренда

Перед изменением дизайна или контента читай `docs/brand/`:
- `CONTEXT.md` — позиционирование, аудитория, воронка
- `DESIGN.md` — цвета, типографика, компоненты
- `SITESTRUCTURE.md` — структура страниц и секций
- `STACK.md` — текущий и планируемый стек
