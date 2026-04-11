# SPEKTOR_V — Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the static HTML/CSS/JS mockup site to Astro with shared layouts, components, SEO metadata, and a fixed filters script — while keeping the design identical.

**Architecture:** Astro static site with a single `BaseLayout.astro` (head, nav, footer), two shared components (`Nav.astro`, `Footer.astro`), four page files, and all CSS/JS copied verbatim from `mockup/`. No UI frameworks, no Tailwind.

**Tech Stack:** Astro 4.x, static output, vanilla CSS, vanilla JS.

---

## File Map

**Create:**
- `astro.config.mjs` — Astro config, static output
- `src/layouts/BaseLayout.astro` — shared head + nav + footer + CSS links
- `src/components/Nav.astro` — nav with active link logic
- `src/components/Footer.astro` — footer HTML
- `src/pages/index.astro` — home page
- `src/pages/catalog.astro` — catalog page
- `src/pages/about.astro` — about page
- `src/pages/reviews.astro` — reviews page
- `src/pages/sitemap.xml.ts` — dynamic sitemap endpoint
- `src/styles/variables.css` — copy of mockup/css/variables.css
- `src/styles/base.css` — copy of mockup/css/base.css
- `src/styles/components.css` — copy of mockup/css/components.css
- `src/styles/pages/home.css` — copy of mockup/css/pages/home.css
- `src/styles/pages/about.css` — copy of mockup/css/pages/about.css
- `src/styles/pages/catalog.css` — copy of mockup/css/pages/catalog.css
- `src/styles/pages/reviews.css` — copy of mockup/css/pages/reviews.css
- `src/scripts/nav.js` — copy of mockup/js/nav.js
- `src/scripts/carousel.js` — copy of mockup/js/carousel.js
- `src/scripts/filters.js` — fixed version of mockup/js/filters.js
- `public/robots.txt` — robots file

**Keep untouched:**
- `mockup/` — entire folder stays as-is

---

## Task 1: Init Astro project

**Files:**
- Create: `astro.config.mjs`, `package.json`, `tsconfig.json`, `src/env.d.ts`

- [ ] **Step 1: Scaffold minimal Astro project**

Run from `d:/Sektor/`:
```bash
npm create astro@latest . -- --template minimal --no-install --no-git
```
When prompted, choose: minimal template, TypeScript: strict, no git init.

If the CLI is interactive and blocks, use instead:
```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --skip-houston --no-git
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, `package-lock.json` created.

- [ ] **Step 3: Replace astro.config.mjs with correct config**

Replace the generated `astro.config.mjs` with:
```js
// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'TODO: реальный домен',
  output: 'static',
});
```

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: server starts on `http://localhost:4321`. You'll see Astro's default empty page. Stop server with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs package.json package-lock.json tsconfig.json src/
git commit -m "chore: init Astro minimal project, static output"
```

---

## Task 2: Copy CSS into src/styles/

**Files:**
- Create: `src/styles/variables.css`, `src/styles/base.css`, `src/styles/components.css`
- Create: `src/styles/pages/home.css`, `src/styles/pages/about.css`, `src/styles/pages/catalog.css`, `src/styles/pages/reviews.css`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p src/styles/pages
```

- [ ] **Step 2: Copy CSS files verbatim**

```bash
cp mockup/css/variables.css src/styles/variables.css
cp mockup/css/base.css src/styles/base.css
cp mockup/css/components.css src/styles/components.css
cp mockup/css/pages/home.css src/styles/pages/home.css
cp mockup/css/pages/about.css src/styles/pages/about.css
cp mockup/css/pages/catalog.css src/styles/pages/catalog.css
cp mockup/css/pages/reviews.css src/styles/pages/reviews.css
```

Do NOT edit the CSS files. The spec says "не менять CSS".

- [ ] **Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat: copy CSS design tokens and component styles into src/styles"
```

---

## Task 3: Copy and fix JS into src/scripts/

**Files:**
- Create: `src/scripts/nav.js` — verbatim copy
- Create: `src/scripts/carousel.js` — verbatim copy
- Create: `src/scripts/filters.js` — fixed version

The bug: current `filters.js` uses `chip.parentElement` to deactivate siblings. If two independent filter groups share the same DOM parent (e.g., both `.filter-chip` and `.filter-tab` groups are inside `.filters-inner`), clicking a chip in one group deactivates chips in the other group. The fix: group chips by `data-filter-group` attribute instead.

HTML change required: catalog and reviews pages will need `data-filter-group="..."` on their filter buttons (done in Tasks 7–10).

- [ ] **Step 1: Create scripts directory**

```bash
mkdir -p src/scripts
```

- [ ] **Step 2: Copy nav.js and carousel.js verbatim**

```bash
cp mockup/js/nav.js src/scripts/nav.js
cp mockup/js/carousel.js src/scripts/carousel.js
```

- [ ] **Step 3: Write fixed filters.js**

Create `src/scripts/filters.js` with this content:
```js
/* ═══════════════════════════════════════════
   SPEKTOR_V — Filter chips / tabs toggle
   Groups are determined by data-filter-group attribute.
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter-chip, .filter-tab').forEach(chip => {
    chip.addEventListener('click', () => {
      const group = chip.dataset.filterGroup;
      if (group) {
        // Deactivate only chips in the same named group
        document.querySelectorAll(`[data-filter-group="${group}"]`).forEach(c => {
          c.classList.remove('active');
        });
      } else {
        // Fallback: deactivate siblings in same parent (old behaviour)
        chip.parentElement.querySelectorAll('.filter-chip, .filter-tab').forEach(c => {
          c.classList.remove('active');
        });
      }
      chip.classList.add('active');
    });
  });
});
```

- [ ] **Step 4: Commit**

```bash
git add src/scripts/
git commit -m "feat: add nav/carousel/filters scripts; fix filters.js to use data-filter-group"
```

---

## Task 4: Create Footer component

**Files:**
- Create: `src/components/Footer.astro`

The footer HTML is identical across all 4 mockup pages. Extract it verbatim.

- [ ] **Step 1: Create src/components/ directory**

```bash
mkdir -p src/components
```

- [ ] **Step 2: Create Footer.astro**

Create `src/components/Footer.astro`:
```astro
---
---
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="footer-col">
        <div class="footer-col-title">Навигация</div>
        <ul>
          <li><a href="/">Главная</a></li>
          <li><a href="/catalog">Каталог</a></li>
          <li><a href="/about">Философия бренда</a></li>
          <li><a href="/reviews">Отзывы</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">Маркетплейсы</div>
        <ul>
          <li><a href="#">Ozon</a></li>
          <li><a href="#">Wildberries</a></li>
          <li><a href="#">Яндекс.Маркет</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">Связаться</div>
        <ul>
          <li><a href="#">Telegram</a></li>
          <li><a href="#">VK</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">Документы</div>
        <ul>
          <li><a href="#">Политика конфиденциальности</a></li>
          <li><a href="#">Публичная оферта</a></li>
          <li><a href="#">Реквизиты</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">&copy; 2026 SPEKTOR_V</div>
      <div class="footer-legal">
        <a href="#">Политика конфиденциальности</a>
        <a href="#">Оферта</a>
      </div>
    </div>
  </div>
</footer>
```

Note: links updated from `index.html` → `/`, `catalog.html` → `/catalog`, etc.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add Footer component"
```

---

## Task 5: Create Nav component

**Files:**
- Create: `src/components/Nav.astro`

The nav accepts `activePage` prop ('home'|'catalog'|'about'|'reviews') and `darkInitial` boolean (true on pages that start with a hero so nav has `nav--dark` class by default).

`index.html` and `about.html` have `class="nav nav--dark"` (hero present).
`catalog.html` and `reviews.html` have `class="nav"` (no hero, light nav from start).

- [ ] **Step 1: Create Nav.astro**

Create `src/components/Nav.astro`:
```astro
---
interface Props {
  activePage: 'home' | 'catalog' | 'about' | 'reviews';
  darkInitial?: boolean;
}
const { activePage, darkInitial = false } = Astro.props;
---
<nav class={`nav${darkInitial ? ' nav--dark' : ''}`} id="mainNav">
  <div class="nav-left">
    <a href="/" class={`nav-link${activePage === 'home' ? ' active' : ''}`}>Главная</a>
    <a href="/catalog" class={`nav-link${activePage === 'catalog' ? ' active' : ''}`}>Каталог</a>
    <a href="/about" class={`nav-link${activePage === 'about' ? ' active' : ''}`}>Философия бренда</a>
    <a href="/reviews" class={`nav-link${activePage === 'reviews' ? ' active' : ''}`}>Отзывы</a>
  </div>
  <a href="#contact" class="btn-contact">Связаться</a>
</nav>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: add Nav component with activePage prop and darkInitial support"
```

---

## Task 6: Create BaseLayout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create layouts directory**

```bash
mkdir -p src/layouts
```

- [ ] **Step 2: Create BaseLayout.astro**

Create `src/layouts/BaseLayout.astro`:
```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
  pageCSS: string;
  activePage: 'home' | 'catalog' | 'about' | 'reviews';
  darkInitial?: boolean;
}

const {
  title,
  description,
  ogImage = '',
  canonical = Astro.url.href,
  pageCSS,
  activePage,
  darkInitial = false,
} = Astro.props;
---
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>{title}</title>
    <meta name="description" content={description} />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:locale" content="ru_RU" />
    {ogImage && <meta property="og:image" content={ogImage} />}

    <link rel="canonical" href={canonical} />

    <!-- TODO: favicon -->

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />

    <!-- CSS: global cascade -->
    <link rel="stylesheet" href="/styles/variables.css" />
    <link rel="stylesheet" href="/styles/base.css" />
    <link rel="stylesheet" href="/styles/components.css" />
    <!-- Page-specific CSS -->
    <link rel="stylesheet" href={`/styles/pages/${pageCSS}`} />

    <!-- TODO: Яндекс.Метрика -->
  </head>
  <body>
    <Nav activePage={activePage} darkInitial={darkInitial} />
    <slot />
    <Footer />
    <script src="/scripts/nav.js" defer></script>
  </body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add BaseLayout with head meta, OG tags, canonical, CSS cascade"
```

---

## Task 7: Move CSS/JS to public/ for static serving

**Context:** Astro serves files from `public/` at the root URL. CSS in `src/styles/` and JS in `src/scripts/` are NOT automatically served — they need to either be in `public/` or imported via Astro's asset pipeline. Since we want zero processing (copy CSS verbatim), the simplest approach is to put CSS and JS in `public/styles/` and `public/scripts/` so the `<link href="/styles/variables.css">` paths in BaseLayout work correctly.

Alternatively: keep `src/styles/` and import them in the layout via `<style>` import (Astro bundles them). But the spec says "переносить как есть" and not to change the CSS, so using `public/` is safer — the files are served as-is without bundling.

**Decision: move CSS and JS to `public/`.**

- [ ] **Step 1: Move CSS to public/styles/**

```bash
mkdir -p public/styles/pages
cp src/styles/variables.css public/styles/variables.css
cp src/styles/base.css public/styles/base.css
cp src/styles/components.css public/styles/components.css
cp src/styles/pages/home.css public/styles/pages/home.css
cp src/styles/pages/about.css public/styles/pages/about.css
cp src/styles/pages/catalog.css public/styles/pages/catalog.css
cp src/styles/pages/reviews.css public/styles/pages/reviews.css
```

- [ ] **Step 2: Move JS to public/scripts/**

```bash
mkdir -p public/scripts
cp src/scripts/nav.js public/scripts/nav.js
cp src/scripts/carousel.js public/scripts/carousel.js
cp src/scripts/filters.js public/scripts/filters.js
```

- [ ] **Step 3: Update BaseLayout.astro script path**

The `<script src="/scripts/nav.js" defer></script>` path in BaseLayout already points to `/scripts/nav.js` — which resolves to `public/scripts/nav.js`. No change needed in the layout.

- [ ] **Step 4: Remove now-redundant src/styles and src/scripts**

```bash
rm -rf src/styles src/scripts
```

- [ ] **Step 5: Commit**

```bash
git add public/ src/
git commit -m "feat: serve CSS and JS from public/ for zero-processing static delivery"
```

---

## Task 8: Create index.astro (home page)

**Files:**
- Create: `src/pages/index.astro`

Source: `mockup/index.html`. Extract everything between `<body>` and `</body>`, excluding the `<nav>`, `<footer>`, and `<script>` tags (those are in BaseLayout/components).

Apply these accessibility fixes:
- Rating star spans: add `role="img"` and `aria-label` with the actual rating value
- Keep `<script src="js/nav.js"></script>` removed (it's in BaseLayout)

Add JSON-LD Organization schema in the page `<head>` via a `<script type="application/ld+json">` slot.

- [ ] **Step 1: Create index.astro**

Create `src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="SPEKTOR_V — украшения ручной работы из полимерной глины"
  description="Серьги, подвески и броши ручной работы. Более 2000 украшений продано по всей России. Вдохновение рождается в лесу."
  pageCSS="home.css"
  activePage="home"
  darkInitial={true}
>
  <script type="application/ld+json" slot="head">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SPEKTOR_V",
    "description": "Украшения ручной работы из полимерной глины",
    "url": "TODO: реальный домен",
    "sameAs": ["TODO: Ozon", "TODO: Wildberries", "TODO: Telegram", "TODO: VK"]
  }
  </script>

  <!-- ═══ HERO ═══ -->
  <section class="hero">
    <div class="hero-content">
      <div class="hero-eyebrow">Украшения ручной работы</div>
      <h1 class="hero-title">SPEKTOR_V</h1>
      <p class="hero-subtitle">Украшения, рождённые в лесу</p>
    </div>
    <div class="hero-image-wrap">
      <div class="hero-image">
        <span class="hero-image-placeholder">Фото украшения на мхе</span>
      </div>
    </div>
    <div class="hero-scroll">
      <span>Scroll</span>
      <div class="hero-scroll-line"></div>
    </div>
  </section>

  <!-- ═══ STORY / POSITIONING ═══ -->
  <section class="section section--white">
    <div class="container">
      <div class="story">
        <div class="story-image">
          <span class="story-image-placeholder">Фото Виктории</span>
          <div class="story-badge">
            <div class="story-badge-num">2018</div>
            <div class="story-badge-label">С нами с</div>
          </div>
        </div>
        <div class="story-text">
          <h2>Каждое украшение<br><em>лепится вручную</em></h2>
          <p>Серьги-черника, подвески-малина, кольца из мха — <strong>более 2000 украшений</strong> нашли своих хозяек по всей России.</p>
          <p>Вдохновение рождается в лесу. Каждая деталь — от текстуры листика до оттенка ягоды — создаётся с любовью к природе.</p>
          <a href="/about" class="text-link">Узнать историю →</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ TOP PRODUCTS ═══ -->
  <section class="section section--gray" id="catalog">
    <div class="container">
      <div class="section-eyebrow">Каталог</div>
      <h2 class="section-title">Полюбились<br><em>больше всего</em></h2>
      <p class="section-subtitle">Лучшие украшения по мнению наших покупателей. Каждое — ручная работа.</p>

      <div class="products-grid">
        <div class="product-card">
          <div class="product-photo">
            <span class="product-photo-placeholder">Фото черники</span>
            <div class="product-dots">
              <div class="product-dot active"></div>
              <div class="product-dot"></div>
              <div class="product-dot"></div>
            </div>
          </div>
          <div class="product-info">
            <div class="product-name">Серьги «Черника»</div>
            <div class="product-desc">Ягоды черники с листиком</div>
            <div class="product-rating">
              <span class="product-stars" role="img" aria-label="Рейтинг 4.9 из 5">★★★★★</span>
              <span class="product-rating-num">4.9</span>
              <span class="product-rating-count">(42)</span>
            </div>
            <div class="product-bottom">
              <div class="product-price">490 ₽ <span class="product-price-old">650 ₽</span></div>
              <a href="#" class="btn-buy">Купить</a>
            </div>
          </div>
        </div>

        <div class="product-card">
          <div class="product-photo">
            <span class="product-photo-placeholder">Фото малины</span>
            <div class="product-dots">
              <div class="product-dot active"></div>
              <div class="product-dot"></div>
              <div class="product-dot"></div>
              <div class="product-dot"></div>
            </div>
          </div>
          <div class="product-info">
            <div class="product-name">Подвеска «Малина»</div>
            <div class="product-desc">На шариковой цепочке</div>
            <div class="product-rating">
              <span class="product-stars" role="img" aria-label="Рейтинг 5.0 из 5">★★★★★</span>
              <span class="product-rating-num">5.0</span>
              <span class="product-rating-count">(28)</span>
            </div>
            <div class="product-bottom">
              <div class="product-price">590 ₽</div>
              <a href="#" class="btn-buy">Купить</a>
            </div>
          </div>
        </div>

        <div class="product-card">
          <div class="product-photo">
            <span class="product-photo-placeholder">Фото морошки</span>
            <div class="product-dots">
              <div class="product-dot active"></div>
              <div class="product-dot"></div>
            </div>
          </div>
          <div class="product-info">
            <div class="product-name">Подвеска «Морошка»</div>
            <div class="product-desc">Оранжево-красная ягода</div>
            <div class="product-rating">
              <span class="product-stars" role="img" aria-label="Рейтинг 4.8 из 5">★★★★★</span>
              <span class="product-rating-num">4.8</span>
              <span class="product-rating-count">(19)</span>
            </div>
            <div class="product-bottom">
              <div class="product-price">550 ₽</div>
              <a href="#" class="btn-buy">Купить</a>
            </div>
          </div>
        </div>

        <div class="product-card">
          <div class="product-photo">
            <span class="product-photo-placeholder">Фото мухомора</span>
            <div class="product-dots">
              <div class="product-dot active"></div>
              <div class="product-dot"></div>
              <div class="product-dot"></div>
            </div>
          </div>
          <div class="product-info">
            <div class="product-name">Брошь «Мухомор»</div>
            <div class="product-desc">Миниатюрный мухомор</div>
            <div class="product-rating">
              <span class="product-stars" role="img" aria-label="Рейтинг 4.7 из 5">★★★★☆</span>
              <span class="product-rating-num">4.7</span>
              <span class="product-rating-count">(35)</span>
            </div>
            <div class="product-bottom">
              <div class="product-price">420 ₽</div>
              <a href="#" class="btn-buy">Купить</a>
            </div>
          </div>
        </div>
      </div>

      <div class="products-more">
        <a href="/catalog" class="btn-secondary">Смотреть весь каталог →</a>
      </div>
    </div>
  </section>

  <!-- ═══ REVIEWS ═══ -->
  <section class="section section--black" id="reviews">
    <div class="container">
      <div class="section-eyebrow">Отзывы</div>
      <h2 class="section-title">Они уже носят<br><em>лес</em></h2>

      <div class="reviews-stats">
        <div class="stat">
          <div class="stat-number">2000+</div>
          <div class="stat-label">продано</div>
        </div>
        <div class="stat">
          <div class="stat-number">4.9</div>
          <div class="stat-label">рейтинг</div>
        </div>
        <div class="stat">
          <div class="stat-number">300+</div>
          <div class="stat-label">артикулов</div>
        </div>
      </div>

      <div class="reviews-grid">
        <div class="review-card">
          <div class="review-stars" role="img" aria-label="Рейтинг 5 из 5">★★★★★</div>
          <div class="review-text">«Серёжки-черника просто невероятные! Такое ощущение, что это настоящие ягоды. Все подруги спрашивают где взяла.»</div>
          <div class="review-author">
            <div class="review-avatar">А</div>
            <div>
              <div class="review-name">Анастасия</div>
              <div class="review-source">Ozon</div>
            </div>
          </div>
        </div>
        <div class="review-card">
          <div class="review-stars" role="img" aria-label="Рейтинг 5 из 5">★★★★★</div>
          <div class="review-text">«Подвеска малина — шедевр! Качество отличное, цвет насыщенный, цепочка крепкая. Буду заказывать ещё!»</div>
          <div class="review-author">
            <div class="review-avatar">М</div>
            <div>
              <div class="review-name">Мария</div>
              <div class="review-source">Wildberries</div>
            </div>
          </div>
        </div>
        <div class="review-card">
          <div class="review-stars" role="img" aria-label="Рейтинг 5 из 5">★★★★★</div>
          <div class="review-text">«Уже третий заказ. Каждое украшение — маленький шедевр. Упаковка тоже очень милая, как подарок себе.»</div>
          <div class="review-author">
            <div class="review-avatar">Е</div>
            <div>
              <div class="review-name">Екатерина</div>
              <div class="review-source">Яндекс.Маркет</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ CTA — CONTACT ═══ -->
  <section class="cta-section" id="contact">
    <h2 class="cta-title">Чтобы заказать,<br><em>напишите нам</em></h2>
    <p class="cta-subtitle">Ответим в течение часа</p>
    <div class="cta-buttons">
      <a href="#" class="btn-primary">Написать в Telegram →</a>
      <a href="#" class="btn-secondary">Написать в VK →</a>
    </div>
    <div class="cta-socials">
      <a href="#" class="cta-social">Ozon</a>
      <a href="#" class="cta-social">Wildberries</a>
      <a href="#" class="cta-social">Яндекс.Маркет</a>
    </div>
  </section>
</BaseLayout>
```

**Note about JSON-LD slot:** Astro's `<slot name="head">` requires the BaseLayout to declare a named slot inside `<head>`. Update BaseLayout.astro to add `<slot name="head" />` just before `</head>`:

In `src/layouts/BaseLayout.astro`, add before `</head>`:
```astro
    <slot name="head" />
  </head>
```

- [ ] **Step 2: Verify dev server renders home page correctly**

```bash
npm run dev
```

Open `http://localhost:4321` — should look identical to `mockup/index.html`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro src/layouts/BaseLayout.astro
git commit -m "feat: add index page with Organization schema and accessibility fixes"
```

---

## Task 9: Create about.astro

**Files:**
- Create: `src/pages/about.astro`

Source: `mockup/about.html`. Extract body content (excluding nav, footer, script tags). No JS is loaded on this page in the mockup — only `nav.js` (already in BaseLayout).

Update internal links: `catalog.html` → `/catalog`.

- [ ] **Step 1: Create about.astro**

Create `src/pages/about.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="История бренда — SPEKTOR_V"
  description="История Виктории Спектор: от мастер-классов в 2018 до 300+ украшений ручной работы и 2000 продаж."
  pageCSS="about.css"
  activePage="about"
  darkInitial={true}
>
  <!-- ═══ HERO ═══ -->
  <section class="about-hero" id="aboutHero">
    <div class="about-hero-eyebrow">Философия бренда</div>
    <h1 class="about-hero-title">Как лес стал<br><em>украшением</em></h1>
    <p class="about-hero-subtitle">История Виктории Спектор — от мастер-классов в «Леонардо» до бренда с 2000+ продаж</p>
    <div class="about-hero-image">
      <span>Фото Виктории за работой</span>
    </div>
    <div class="about-hero-scroll">
      <span>Листайте</span>
      <div class="scroll-line"></div>
    </div>
  </section>

  <!-- ═══ INTRO QUOTE ═══ -->
  <section class="intro-quote">
    <p class="intro-quote-text">«Меня зовут Виктория Спектор, и&nbsp;я&nbsp;&mdash; основатель бренда дизайнерских украшений SPEKTOR_V. Позвольте рассказать вам эту историю.»</p>
    <div class="intro-quote-author">Виктория Спектор, основатель</div>
  </section>

  <!-- ═══ CHAPTER 1: НАЧАЛО (2018) ═══ -->
  <section class="story-block story-block--white">
    <div class="story-inner">
      <div class="story-image-wrap">
        <div class="story-image">
          <span>Фото: мастер-классы в «Леонардо»</span>
        </div>
        <div class="story-year-badge">2018</div>
      </div>
      <div class="story-text-wrap">
        <div class="story-chapter">Глава первая</div>
        <h2 class="story-heading">Всё началось <em>одним летом</em></h2>
        <p class="story-paragraph">Далёкий 2018 год. Лето, когда все учителя, как птички, улетают в тёплые края в отпуск. А я в то время была птичкой неперелётной — утруждала свой разум учением в ВУЗе.</p>
        <p class="story-paragraph">Но душа моя, как и творческая натура, требовали <strong>великих свершений</strong>.</p>
        <div class="story-highlight">Тогда задумано было начать проводить творческие мастер-классы в «Леонардо».</div>
        <p class="story-paragraph">К лепке пришла не сразу. По первости было чаще всего рисование, бисероплетение, скрапбукинг, декор, флористика, декупаж... Потом — эпоксидная смола и живые цветочки, охота за которыми и по сей день будоражит моё воображение.</p>
      </div>
    </div>
  </section>

  <!-- ═══ CHAPTER 2: КУРСЫ ═══ -->
  <section class="story-block story-block--gray">
    <div class="story-inner reverse">
      <div class="story-image-wrap">
        <div class="story-image">
          <span>Фото: процесс лепки, руки, инструменты</span>
        </div>
      </div>
      <div class="story-text-wrap">
        <div class="story-chapter">Глава вторая</div>
        <h2 class="story-heading">Курсы. Много <em>курсов</em></h2>
        <p class="story-paragraph">А потом начались курсы по лепке. Один за другим они укладывались в сознание и всё больше <strong>перетягивали одеяло на себя</strong>.</p>
        <p class="story-paragraph">Полимерная глина стала не просто увлечением — она стала языком, на котором я научилась говорить. Каждая ягодка, каждый листик, каждый гриб — это слова в моём лесном словаре.</p>
        <div class="story-highlight">Полимерная глина перетянула одеяло на себя — и больше не отпустила.</div>
      </div>
    </div>
  </section>

  <!-- ═══ CHAPTER 3: ЗАПУСК (2022) ═══ -->
  <section class="story-block story-block--black">
    <div class="story-inner">
      <div class="story-image-wrap">
        <div class="story-image">
          <span>Фото: первые украшения на Wildberries</span>
        </div>
        <div class="story-year-badge">2022</div>
      </div>
      <div class="story-text-wrap">
        <div class="story-chapter">Глава третья</div>
        <h2 class="story-heading">Момент, когда хотелось <em>всё бросить</em></h2>
        <p class="story-paragraph">В 2022 году родилась идея завести профиль в теперь уже запрещённой сети. Были куплены курсы по развитию... <strong>за неделю до её блокировки</strong> в России.</p>
        <div class="story-highlight">Я искренне хотела всё бросить. Но не сдалась — и вот мы здесь.</div>
        <p class="story-paragraph">В августе того же года появился маленький магазин на Wildberries, насчитывающий всего около <strong>10 артикулов</strong>. Маленький, но настоящий.</p>
      </div>
    </div>
  </section>

  <!-- ═══ CHAPTER 4: РОСТ (2023) ═══ -->
  <section class="story-block story-block--white">
    <div class="story-inner reverse">
      <div class="story-image-wrap">
        <div class="story-image">
          <span>Фото: команда, упаковка, отправка</span>
        </div>
        <div class="story-year-badge">2023</div>
      </div>
      <div class="story-text-wrap">
        <div class="story-chapter">Глава четвёртая</div>
        <h2 class="story-heading">Из хобби — <em>в настоящий бренд</em></h2>
        <p class="story-paragraph">Сентябрь 2023 года. Уже <strong>более 300 артикулов</strong> и несколько верных сотрудников — мы стали настоящим брендом.</p>
        <p class="story-paragraph">Вышли на Ozon и Яндекс.Маркет. Работа в образовании для меня закончилась — я смогла <strong>полностью отдаться своему делу</strong>.</p>
        <div class="story-highlight">Когда хобби становится делом жизни — это и есть счастье.</div>
      </div>
    </div>
  </section>

  <!-- ═══ CHAPTER 5: СЕГОДНЯ ═══ -->
  <section class="story-block story-block--gray">
    <div class="story-inner">
      <div class="story-image-wrap">
        <div class="story-image">
          <span>Фото: Виктория сегодня</span>
        </div>
        <div class="story-year-badge">2024</div>
      </div>
      <div class="story-text-wrap">
        <div class="story-chapter">Глава пятая</div>
        <h2 class="story-heading">2000+ украшений <em>нашли своих хозяек</em></h2>
        <p class="story-paragraph">К январю 2024 мы продали уже <strong>более 2000 украшений</strong>. Если бы кто-то рассказал мне эту историю в том самом далёком 2018 — я бы, разумеется, не поверила.</p>
        <div class="story-highlight">Но вот мы здесь и с нетерпением ждём продолжения этой истории — благодаря тебе.</div>
        <p class="story-paragraph">Каждое украшение — это частичка леса, которую я отдаю в добрые руки. Спасибо, что вы рядом.</p>
      </div>
    </div>
  </section>

  <!-- ═══ TIMELINE ═══ -->
  <section class="timeline-section">
    <div class="timeline-inner">
      <h2 class="timeline-title">Путь <em>SPEKTOR_V</em></h2>
      <div class="timeline">
        <div class="timeline-point">
          <div class="timeline-dot">18</div>
          <div class="timeline-label">2018</div>
          <div class="timeline-desc">Мастер-классы в «Леонардо»</div>
        </div>
        <div class="timeline-point">
          <div class="timeline-dot">20</div>
          <div class="timeline-label">2020</div>
          <div class="timeline-desc">Курсы по полимерной глине</div>
        </div>
        <div class="timeline-point">
          <div class="timeline-dot">22</div>
          <div class="timeline-label">2022</div>
          <div class="timeline-desc">Первый магазин на Wildberries</div>
        </div>
        <div class="timeline-point">
          <div class="timeline-dot">23</div>
          <div class="timeline-label">2023</div>
          <div class="timeline-desc">300+ артикулов, Ozon, Яндекс.Маркет</div>
        </div>
        <div class="timeline-point">
          <div class="timeline-dot">24</div>
          <div class="timeline-label">2024</div>
          <div class="timeline-desc">2000+ продаж</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ CTA ═══ -->
  <section class="about-cta" id="contact">
    <h2 class="about-cta-title">Стать частью <em>этой истории</em></h2>
    <p class="about-cta-subtitle">Выберите украшение, которое расскажет вашу историю</p>
    <div class="cta-buttons">
      <a href="/catalog" class="btn-primary">Перейти в каталог →</a>
      <a href="#" class="btn-secondary">Написать в Telegram →</a>
    </div>
    <div class="cta-socials">
      <a href="#" class="cta-social">Ozon</a>
      <a href="#" class="cta-social">Wildberries</a>
      <a href="#" class="cta-social">Яндекс.Маркет</a>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:4321/about` — should match `mockup/about.html` visually.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add about page"
```

---

## Task 10: Create catalog.astro

**Files:**
- Create: `src/pages/catalog.astro`

Source: `mockup/catalog.html`. This page loads `filters.js`. Apply:
- `data-filter-group="category"` on all `.filter-chip` buttons
- `aria-label="Добавить в избранное"` on all `.ozon-card-wishlist` buttons
- `role="img"` and `aria-label` on `.ozon-stars` spans
- Link `/catalog` stays same page (no change needed)
- Script: load `/scripts/filters.js` via `<script>` tag in page body

- [ ] **Step 1: Create catalog.astro**

Create `src/pages/catalog.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Каталог украшений — SPEKTOR_V"
  description="Более 300 украшений из полимерной глины: серьги, подвески, кольца, броши. Купить на Ozon, Wildberries, Яндекс.Маркет."
  pageCSS="catalog.css"
  activePage="catalog"
  darkInitial={false}
>
  <!-- ═══ PAGE HEADER ═══ -->
  <div class="page-header">
    <div class="page-header-eyebrow">Каталог украшений</div>
    <h1 class="page-header-title">Выберите <em>своё</em></h1>
    <p class="page-header-subtitle">Более 300 украшений ручной работы. Каждое — уникальное, как лесная ягода.</p>
  </div>

  <!-- ═══ FILTERS ═══ -->
  <div class="filters-bar">
    <div class="filters-inner">
      <button class="filter-chip active" data-filter-group="category">Все</button>
      <button class="filter-chip" data-filter-group="category">Серьги</button>
      <button class="filter-chip" data-filter-group="category">Подвески</button>
      <button class="filter-chip" data-filter-group="category">Кольца</button>
      <button class="filter-chip" data-filter-group="category">Броши</button>
      <button class="filter-chip" data-filter-group="category">Наборы</button>
      <button class="filter-chip" data-filter-group="category">Хиты</button>
      <button class="filter-chip" data-filter-group="category">Новинки</button>
      <input type="text" class="filter-search" placeholder="Поиск по названию...">
    </div>
  </div>

  <!-- ═══ CATALOG GRID ═══ -->
  <section class="catalog-section">
    <div class="catalog-container">
      <div class="catalog-count">Найдено: 24 товара</div>

      <div class="catalog-grid">

        <!-- Card 1 — Sale -->
        <div class="ozon-card">
          <div class="ozon-card-img">
            <span class="ozon-card-img-placeholder">Фото черники</span>
            <span class="ozon-card-badge badge-sale">−25%</span>
            <button class="ozon-card-wishlist" aria-label="Добавить в избранное">♡</button>
            <div class="ozon-card-dots">
              <div class="ozon-dot active"></div><div class="ozon-dot"></div><div class="ozon-dot"></div>
            </div>
          </div>
          <div class="ozon-card-body">
            <div class="ozon-card-price-row">
              <span class="ozon-card-price">490 ₽</span>
              <span class="ozon-card-price-old">650 ₽</span>
            </div>
            <div class="ozon-card-title">Серьги «Черника» — ягоды с листиком, полимерная глина</div>
            <div class="ozon-card-rating">
              <span class="ozon-stars" role="img" aria-label="Рейтинг 4.9 из 5">★★★★★</span>
              <span class="ozon-rating-num">4.9</span>
              <span class="ozon-rating-count">· 42 отзыва</span>
            </div>
            <div class="ozon-card-actions">
              <a href="#" class="ozon-btn-buy ozon-btn-primary">Купить</a>
              <a href="#" class="ozon-btn-buy ozon-btn-tg">Задать вопрос в Telegram</a>
            </div>
          </div>
        </div>

        <!-- Card 2 — Hit -->
        <div class="ozon-card">
          <div class="ozon-card-img">
            <span class="ozon-card-img-placeholder">Фото малины</span>
            <span class="ozon-card-badge badge-hit">Хит</span>
            <button class="ozon-card-wishlist" aria-label="Добавить в избранное">♡</button>
            <div class="ozon-card-dots">
              <div class="ozon-dot active"></div><div class="ozon-dot"></div><div class="ozon-dot"></div><div class="ozon-dot"></div>
            </div>
          </div>
          <div class="ozon-card-body">
            <div class="ozon-card-price-row">
              <span class="ozon-card-price">590 ₽</span>
            </div>
            <div class="ozon-card-title">Подвеска «Малина» на шариковой цепочке</div>
            <div class="ozon-card-rating">
              <span class="ozon-stars" role="img" aria-label="Рейтинг 5.0 из 5">★★★★★</span>
              <span class="ozon-rating-num">5.0</span>
              <span class="ozon-rating-count">· 28 отзывов</span>
            </div>
            <div class="ozon-card-actions">
              <a href="#" class="ozon-btn-buy ozon-btn-primary">Купить</a>
              <a href="#" class="ozon-btn-buy ozon-btn-tg">Задать вопрос в Telegram</a>
            </div>
          </div>
        </div>

        <!-- Card 3 — New -->
        <div class="ozon-card">
          <div class="ozon-card-img">
            <span class="ozon-card-img-placeholder">Фото морошки</span>
            <span class="ozon-card-badge badge-new">New</span>
            <button class="ozon-card-wishlist" aria-label="Добавить в избранное">♡</button>
            <div class="ozon-card-dots">
              <div class="ozon-dot active"></div><div class="ozon-dot"></div>
            </div>
          </div>
          <div class="ozon-card-body">
            <div class="ozon-card-price-row">
              <span class="ozon-card-price">550 ₽</span>
            </div>
            <div class="ozon-card-title">Подвеска «Морошка» — оранжево-красная ягода</div>
            <div class="ozon-card-rating">
              <span class="ozon-stars" role="img" aria-label="Рейтинг 4.8 из 5">★★★★★</span>
              <span class="ozon-rating-num">4.8</span>
              <span class="ozon-rating-count">· 19 отзывов</span>
            </div>
            <div class="ozon-card-actions">
              <a href="#" class="ozon-btn-buy ozon-btn-primary">Купить</a>
              <a href="#" class="ozon-btn-buy ozon-btn-tg">Задать вопрос в Telegram</a>
            </div>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="ozon-card">
          <div class="ozon-card-img">
            <span class="ozon-card-img-placeholder">Фото мухомора</span>
            <button class="ozon-card-wishlist" aria-label="Добавить в избранное">♡</button>
            <div class="ozon-card-dots">
              <div class="ozon-dot active"></div><div class="ozon-dot"></div><div class="ozon-dot"></div>
            </div>
          </div>
          <div class="ozon-card-body">
            <div class="ozon-card-price-row">
              <span class="ozon-card-price">420 ₽</span>
            </div>
            <div class="ozon-card-title">Брошь «Мухомор» — миниатюрная, полимерная глина</div>
            <div class="ozon-card-rating">
              <span class="ozon-stars" role="img" aria-label="Рейтинг 4.7 из 5">★★★★☆</span>
              <span class="ozon-rating-num">4.7</span>
              <span class="ozon-rating-count">· 35 отзывов</span>
            </div>
            <div class="ozon-card-actions">
              <a href="#" class="ozon-btn-buy ozon-btn-primary">Купить</a>
              <a href="#" class="ozon-btn-buy ozon-btn-tg">Задать вопрос в Telegram</a>
            </div>
          </div>
        </div>

        <!-- Card 5 — Sale -->
        <div class="ozon-card">
          <div class="ozon-card-img">
            <span class="ozon-card-img-placeholder">Фото клубники</span>
            <span class="ozon-card-badge badge-sale">−15%</span>
            <button class="ozon-card-wishlist" aria-label="Добавить в избранное">♡</button>
            <div class="ozon-card-dots">
              <div class="ozon-dot active"></div><div class="ozon-dot"></div><div class="ozon-dot"></div>
            </div>
          </div>
          <div class="ozon-card-body">
            <div class="ozon-card-price-row">
              <span class="ozon-card-price">510 ₽</span>
              <span class="ozon-card-price-old">600 ₽</span>
            </div>
            <div class="ozon-card-title">Серьги «Клубника» — спелые ягоды с цветочком</div>
            <div class="ozon-card-rating">
              <span class="ozon-stars" role="img" aria-label="Рейтинг 4.9 из 5">★★★★★</span>
              <span class="ozon-rating-num">4.9</span>
              <span class="ozon-rating-count">· 31 отзыв</span>
            </div>
            <div class="ozon-card-actions">
              <a href="#" class="ozon-btn-buy ozon-btn-primary">Купить</a>
              <a href="#" class="ozon-btn-buy ozon-btn-tg">Задать вопрос в Telegram</a>
            </div>
          </div>
        </div>

        <!-- Card 6 — Hit -->
        <div class="ozon-card">
          <div class="ozon-card-img">
            <span class="ozon-card-img-placeholder">Фото лисичек</span>
            <span class="ozon-card-badge badge-hit">Хит</span>
            <button class="ozon-card-wishlist" aria-label="Добавить в избранное">♡</button>
            <div class="ozon-card-dots">
              <div class="ozon-dot active"></div><div class="ozon-dot"></div>
            </div>
          </div>
          <div class="ozon-card-body">
            <div class="ozon-card-price-row">
              <span class="ozon-card-price">680 ₽</span>
            </div>
            <div class="ozon-card-title">Серьги «Лисички» — грибы на крючках из хирургической стали</div>
            <div class="ozon-card-rating">
              <span class="ozon-stars" role="img" aria-label="Рейтинг 5.0 из 5">★★★★★</span>
              <span class="ozon-rating-num">5.0</span>
              <span class="ozon-rating-count">· 56 отзывов</span>
            </div>
            <div class="ozon-card-actions">
              <a href="#" class="ozon-btn-buy ozon-btn-primary">Купить</a>
              <a href="#" class="ozon-btn-buy ozon-btn-tg">Задать вопрос в Telegram</a>
            </div>
          </div>
        </div>

        <!-- Card 7 -->
        <div class="ozon-card">
          <div class="ozon-card-img">
            <span class="ozon-card-img-placeholder">Фото ландыша</span>
            <button class="ozon-card-wishlist" aria-label="Добавить в избранное">♡</button>
            <div class="ozon-card-dots">
              <div class="ozon-dot active"></div><div class="ozon-dot"></div><div class="ozon-dot"></div>
            </div>
          </div>
          <div class="ozon-card-body">
            <div class="ozon-card-price-row">
              <span class="ozon-card-price">620 ₽</span>
            </div>
            <div class="ozon-card-title">Подвеска «Ландыш» — веточка с колокольчиками</div>
            <div class="ozon-card-rating">
              <span class="ozon-stars" role="img" aria-label="Рейтинг 4.8 из 5">★★★★★</span>
              <span class="ozon-rating-num">4.8</span>
              <span class="ozon-rating-count">· 14 отзывов</span>
            </div>
            <div class="ozon-card-actions">
              <a href="#" class="ozon-btn-buy ozon-btn-primary">Купить</a>
              <a href="#" class="ozon-btn-buy ozon-btn-tg">Задать вопрос в Telegram</a>
            </div>
          </div>
        </div>

        <!-- Card 8 — New + Sale -->
        <div class="ozon-card">
          <div class="ozon-card-img">
            <span class="ozon-card-img-placeholder">Фото набора</span>
            <span class="ozon-card-badge badge-new">New</span>
            <button class="ozon-card-wishlist" aria-label="Добавить в избранное">♡</button>
            <div class="ozon-card-dots">
              <div class="ozon-dot active"></div><div class="ozon-dot"></div><div class="ozon-dot"></div><div class="ozon-dot"></div><div class="ozon-dot"></div>
            </div>
          </div>
          <div class="ozon-card-body">
            <div class="ozon-card-price-row">
              <span class="ozon-card-price">1 290 ₽</span>
              <span class="ozon-card-price-old">1 540 ₽</span>
            </div>
            <div class="ozon-card-title">Набор «Лесная поляна» — серьги + подвеска + кольцо</div>
            <div class="ozon-card-rating">
              <span class="ozon-stars" role="img" aria-label="Рейтинг 5.0 из 5">★★★★★</span>
              <span class="ozon-rating-num">5.0</span>
              <span class="ozon-rating-count">· 8 отзывов</span>
            </div>
            <div class="ozon-card-actions">
              <a href="#" class="ozon-btn-buy ozon-btn-primary">Купить</a>
              <a href="#" class="ozon-btn-buy ozon-btn-tg">Задать вопрос в Telegram</a>
            </div>
          </div>
        </div>

        <!-- Card 9 -->
        <div class="ozon-card">
          <div class="ozon-card-img">
            <span class="ozon-card-img-placeholder">Фото подсолнуха</span>
            <button class="ozon-card-wishlist" aria-label="Добавить в избранное">♡</button>
            <div class="ozon-card-dots">
              <div class="ozon-dot active"></div><div class="ozon-dot"></div>
            </div>
          </div>
          <div class="ozon-card-body">
            <div class="ozon-card-price-row">
              <span class="ozon-card-price">470 ₽</span>
            </div>
            <div class="ozon-card-title">Серьги «Подсолнух» — яркие, летние, лёгкие</div>
            <div class="ozon-card-rating">
              <span class="ozon-stars" role="img" aria-label="Рейтинг 4.9 из 5">★★★★★</span>
              <span class="ozon-rating-num">4.9</span>
              <span class="ozon-rating-count">· 22 отзыва</span>
            </div>
            <div class="ozon-card-actions">
              <a href="#" class="ozon-btn-buy ozon-btn-primary">Купить</a>
              <a href="#" class="ozon-btn-buy ozon-btn-tg">Задать вопрос в Telegram</a>
            </div>
          </div>
        </div>

        <!-- Card 10 — Sale -->
        <div class="ozon-card">
          <div class="ozon-card-img">
            <span class="ozon-card-img-placeholder">Фото ромашки</span>
            <span class="ozon-card-badge badge-sale">−20%</span>
            <button class="ozon-card-wishlist" aria-label="Добавить в избранное">♡</button>
            <div class="ozon-card-dots">
              <div class="ozon-dot active"></div><div class="ozon-dot"></div><div class="ozon-dot"></div>
            </div>
          </div>
          <div class="ozon-card-body">
            <div class="ozon-card-price-row">
              <span class="ozon-card-price">400 ₽</span>
              <span class="ozon-card-price-old">500 ₽</span>
            </div>
            <div class="ozon-card-title">Кольцо «Ромашка» — нежный полевой цветок</div>
            <div class="ozon-card-rating">
              <span class="ozon-stars" role="img" aria-label="Рейтинг 4.8 из 5">★★★★★</span>
              <span class="ozon-rating-num">4.8</span>
              <span class="ozon-rating-count">· 17 отзывов</span>
            </div>
            <div class="ozon-card-actions">
              <a href="#" class="ozon-btn-buy ozon-btn-primary">Купить</a>
              <a href="#" class="ozon-btn-buy ozon-btn-tg">Задать вопрос в Telegram</a>
            </div>
          </div>
        </div>

        <!-- Card 11 -->
        <div class="ozon-card">
          <div class="ozon-card-img">
            <span class="ozon-card-img-placeholder">Фото брусники</span>
            <button class="ozon-card-wishlist" aria-label="Добавить в избранное">♡</button>
            <div class="ozon-card-dots">
              <div class="ozon-dot active"></div><div class="ozon-dot"></div>
            </div>
          </div>
          <div class="ozon-card-body">
            <div class="ozon-card-price-row">
              <span class="ozon-card-price">530 ₽</span>
            </div>
            <div class="ozon-card-title">Серьги «Брусника» — россыпь красных ягод</div>
            <div class="ozon-card-rating">
              <span class="ozon-stars" role="img" aria-label="Рейтинг 4.9 из 5">★★★★★</span>
              <span class="ozon-rating-num">4.9</span>
              <span class="ozon-rating-count">· 26 отзывов</span>
            </div>
            <div class="ozon-card-actions">
              <a href="#" class="ozon-btn-buy ozon-btn-primary">Купить</a>
              <a href="#" class="ozon-btn-buy ozon-btn-tg">Задать вопрос в Telegram</a>
            </div>
          </div>
        </div>

        <!-- Card 12 — Hit -->
        <div class="ozon-card">
          <div class="ozon-card-img">
            <span class="ozon-card-img-placeholder">Фото белого гриба</span>
            <span class="ozon-card-badge badge-hit">Хит</span>
            <button class="ozon-card-wishlist" aria-label="Добавить в избранное">♡</button>
            <div class="ozon-card-dots">
              <div class="ozon-dot active"></div><div class="ozon-dot"></div><div class="ozon-dot"></div>
            </div>
          </div>
          <div class="ozon-card-body">
            <div class="ozon-card-price-row">
              <span class="ozon-card-price">450 ₽</span>
            </div>
            <div class="ozon-card-title">Брошь «Белый гриб» — миниатюрный боровик</div>
            <div class="ozon-card-rating">
              <span class="ozon-stars" role="img" aria-label="Рейтинг 4.9 из 5">★★★★★</span>
              <span class="ozon-rating-num">4.9</span>
              <span class="ozon-rating-count">· 41 отзыв</span>
            </div>
            <div class="ozon-card-actions">
              <a href="#" class="ozon-btn-buy ozon-btn-primary">Купить</a>
              <a href="#" class="ozon-btn-buy ozon-btn-tg">Задать вопрос в Telegram</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ═══ CTA ═══ -->
  <section class="cta-section" id="contact">
    <h2 class="cta-title">Не нашли нужное?<br><em>Напишите нам</em></h2>
    <p class="cta-subtitle">Поможем выбрать украшение или сделаем на заказ</p>
    <div class="cta-buttons">
      <a href="#" class="btn-primary">Написать в Telegram →</a>
      <a href="#" class="btn-secondary">Написать в VK →</a>
    </div>
  </section>

  <script src="/scripts/filters.js"></script>
</BaseLayout>
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:4321/catalog` — should look identical to `mockup/catalog.html`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/catalog.astro
git commit -m "feat: add catalog page with accessible wishlist buttons and filter groups"
```

---

## Task 11: Create reviews.astro

**Files:**
- Create: `src/pages/reviews.astro`

Source: `mockup/reviews.html`. This page loads both `carousel.js` and `filters.js`. Apply:
- `data-filter-group="source"` on all `.filter-tab` buttons
- `aria-label="Предыдущий"` and `aria-label="Следующий"` on carousel buttons
- `role="img"` and `aria-label` on star spans in review cards
- Update internal links: `catalog.html` → `/catalog`
- Load `/scripts/carousel.js` and `/scripts/filters.js` via script tags

- [ ] **Step 1: Create reviews.astro**

Create `src/pages/reviews.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Отзывы покупателей — SPEKTOR_V"
  description="Более 350 отзывов о украшениях SPEKTOR_V. Рейтинг 4.9. 98% покупателей рекомендуют."
  pageCSS="reviews.css"
  activePage="reviews"
  darkInitial={false}
>
  <!-- ═══ PAGE HEADER ═══ -->
  <div class="page-header">
    <div class="page-header-eyebrow">Отзывы покупателей</div>
    <h1 class="page-header-title">Они уже носят <em>лес</em></h1>
    <p class="page-header-subtitle">Честные отзывы с Ozon, Wildberries и Яндекс.Маркет — от тех, кто уже выбрал SPEKTOR_V</p>
  </div>

  <!-- ═══ STATS ═══ -->
  <div class="stats-bar">
    <div class="stats-inner">
      <div class="stat">
        <div class="stat-number">2000+</div>
        <div class="stat-label">продано украшений</div>
      </div>
      <div class="stat">
        <div class="stat-number">4.9</div>
        <div class="stat-label">средний рейтинг</div>
        <div class="stat-sub">на всех маркетплейсах</div>
      </div>
      <div class="stat">
        <div class="stat-number">350+</div>
        <div class="stat-label">отзывов</div>
        <div class="stat-sub">Ozon + WB + Яндекс.Маркет</div>
      </div>
      <div class="stat">
        <div class="stat-number">98%</div>
        <div class="stat-label">рекомендуют</div>
      </div>
    </div>
  </div>

  <!-- ═══ FILTER TABS ═══ -->
  <div class="filter-tabs">
    <button class="filter-tab active" data-filter-group="source">Все отзывы</button>
    <button class="filter-tab" data-filter-group="source">Ozon</button>
    <button class="filter-tab" data-filter-group="source">Wildberries</button>
    <button class="filter-tab" data-filter-group="source">Яндекс.Маркет</button>
    <button class="filter-tab" data-filter-group="source">С фото</button>
    <button class="filter-tab" data-filter-group="source">С видео</button>
  </div>

  <!-- ═══ VIDEO REVIEWS ═══ -->
  <section class="video-section">
    <div class="video-section-inner">
      <h2 class="video-section-title">Видео-отзывы и распаковки</h2>
      <p class="video-section-subtitle">Настоящие эмоции от настоящих покупательниц</p>

      <div class="video-carousel-wrap">
        <div class="video-carousel" id="videoCarousel">
          <div class="video-card">
            <div class="video-thumb">
              <span>Видео распаковки</span>
              <div class="video-play-btn"></div>
            </div>
            <div class="video-info">
              <div class="video-author">Анна</div>
              <div class="video-type">Распаковка · Ozon</div>
            </div>
          </div>
          <div class="video-card">
            <div class="video-thumb">
              <span>Видео-отзыв</span>
              <div class="video-play-btn"></div>
            </div>
            <div class="video-info">
              <div class="video-author">Дарья</div>
              <div class="video-type">Видео-отзыв · VK</div>
            </div>
          </div>
          <div class="video-card">
            <div class="video-thumb">
              <span>Обзор набора</span>
              <div class="video-play-btn"></div>
            </div>
            <div class="video-info">
              <div class="video-author">Кристина</div>
              <div class="video-type">Обзор · Wildberries</div>
            </div>
          </div>
          <div class="video-card">
            <div class="video-thumb">
              <span>Распаковка подарка</span>
              <div class="video-play-btn"></div>
            </div>
            <div class="video-info">
              <div class="video-author">Елена</div>
              <div class="video-type">Распаковка · Ozon</div>
            </div>
          </div>
          <div class="video-card">
            <div class="video-thumb">
              <span>Видео-отзыв</span>
              <div class="video-play-btn"></div>
            </div>
            <div class="video-info">
              <div class="video-author">Полина</div>
              <div class="video-type">Видео-отзыв · VK</div>
            </div>
          </div>
        </div>
        <div class="carousel-nav">
          <button class="carousel-btn" aria-label="Предыдущий" onclick="scrollCarousel('videoCarousel', -300)">←</button>
          <button class="carousel-btn" aria-label="Следующий" onclick="scrollCarousel('videoCarousel', 300)">→</button>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ REVIEW STORIES (PHOTO CARDS CAROUSEL) ═══ -->
  <section class="reviews-section">
    <div class="reviews-inner">
      <h2 class="reviews-section-title">Истории покупателей</h2>
      <p class="reviews-section-subtitle">Фотоотзывы — как украшения живут у новых хозяек</p>

      <div class="review-stories-wrap">
        <div class="review-stories" id="storiesCarousel">

          <div class="review-story-card">
            <div class="review-story-photo">
              <span>Фото: серьги-черника на модели</span>
              <div class="review-story-source source-ozon">Ozon</div>
            </div>
            <div class="review-story-body">
              <div class="review-story-stars" role="img" aria-label="Рейтинг 5 из 5">★★★★★</div>
              <div class="review-story-text">«Серёжки-черника просто невероятные! Такое ощущение, что это настоящие ягоды. Все подруги спрашивают где взяла — теперь хотят такие же. Очень лёгкие и удобные, ношу каждый день.»</div>
              <div class="review-story-author-row">
                <div class="review-story-author">
                  <div class="review-avatar">А</div>
                  <div>
                    <div class="review-name">Анастасия</div>
                    <div class="review-date">15 декабря 2024</div>
                  </div>
                </div>
                <div class="review-product">Серьги «Черника»</div>
              </div>
            </div>
          </div>

          <div class="review-story-card">
            <div class="review-story-photo">
              <span>Фото: подвеска-малина крупным планом</span>
              <div class="review-story-source source-wb">WB</div>
            </div>
            <div class="review-story-body">
              <div class="review-story-stars" role="img" aria-label="Рейтинг 5 из 5">★★★★★</div>
              <div class="review-story-text">«Подвеска малина — шедевр! Качество отличное, цвет насыщенный, цепочка крепкая. Буду заказывать ещё! Упаковка тоже порадовала — как настоящий подарок.»</div>
              <div class="review-story-author-row">
                <div class="review-story-author">
                  <div class="review-avatar">М</div>
                  <div>
                    <div class="review-name">Мария</div>
                    <div class="review-date">3 января 2025</div>
                  </div>
                </div>
                <div class="review-product">Подвеска «Малина»</div>
              </div>
            </div>
          </div>

          <div class="review-story-card">
            <div class="review-story-photo">
              <span>Фото: набор «Лесная поляна»</span>
              <div class="review-story-source source-ozon">Ozon</div>
            </div>
            <div class="review-story-body">
              <div class="review-story-stars" role="img" aria-label="Рейтинг 5 из 5">★★★★★</div>
              <div class="review-story-text">«Уже третий заказ. Каждое украшение — маленький шедевр. Купила набор «Лесная поляна» — серьги, подвеска и кольцо сочетаются идеально. Как будто из сказки.»</div>
              <div class="review-story-author-row">
                <div class="review-story-author">
                  <div class="review-avatar">Е</div>
                  <div>
                    <div class="review-name">Екатерина</div>
                    <div class="review-date">28 декабря 2024</div>
                  </div>
                </div>
                <div class="review-product">Набор «Лесная поляна»</div>
              </div>
            </div>
          </div>

          <div class="review-story-card">
            <div class="review-story-photo">
              <span>Фото: брошь-мухомор на пальто</span>
              <div class="review-story-source source-ym">Я.М</div>
            </div>
            <div class="review-story-body">
              <div class="review-story-stars" role="img" aria-label="Рейтинг 5 из 5">★★★★★</div>
              <div class="review-story-text">«Брошь мухомор — просто чудо! Прикрепила на берет — теперь это мой любимый аксессуар. Сделана очень аккуратно, каждая точечка прорисована. Спасибо мастеру!»</div>
              <div class="review-story-author-row">
                <div class="review-story-author">
                  <div class="review-avatar">О</div>
                  <div>
                    <div class="review-name">Ольга</div>
                    <div class="review-date">10 ноября 2024</div>
                  </div>
                </div>
                <div class="review-product">Брошь «Мухомор»</div>
              </div>
            </div>
          </div>

          <div class="review-story-card">
            <div class="review-story-photo">
              <span>Фото: серьги-лисички</span>
              <div class="review-story-source source-wb">WB</div>
            </div>
            <div class="review-story-body">
              <div class="review-story-stars" role="img" aria-label="Рейтинг 5 из 5">★★★★★</div>
              <div class="review-story-text">«Серьги-лисички — это любовь с первого взгляда. Невесомые, яркие, поднимают настроение. Дочка (5 лет) говорит "мама, ты как фея из леса". Лучший комплимент!»</div>
              <div class="review-story-author-row">
                <div class="review-story-author">
                  <div class="review-avatar">Н</div>
                  <div>
                    <div class="review-name">Наталья</div>
                    <div class="review-date">22 января 2025</div>
                  </div>
                </div>
                <div class="review-product">Серьги «Лисички»</div>
              </div>
            </div>
          </div>

          <div class="review-story-card">
            <div class="review-story-photo">
              <span>Фото: подвеска-ландыш</span>
              <div class="review-story-source source-ozon">Ozon</div>
            </div>
            <div class="review-story-body">
              <div class="review-story-stars" role="img" aria-label="Рейтинг 5 из 5">★★★★★</div>
              <div class="review-story-text">«Подарила маме на 8 марта подвеску «Ландыш». Она была в восторге! Говорит, это самый нежный и душевный подарок. Теперь не снимает. Спасибо за вашу работу!»</div>
              <div class="review-story-author-row">
                <div class="review-story-author">
                  <div class="review-avatar">В</div>
                  <div>
                    <div class="review-name">Виктория</div>
                    <div class="review-date">9 марта 2025</div>
                  </div>
                </div>
                <div class="review-product">Подвеска «Ландыш»</div>
              </div>
            </div>
          </div>

        </div>
        <div class="carousel-nav">
          <button class="carousel-btn" aria-label="Предыдущий" onclick="scrollCarousel('storiesCarousel', -370)">←</button>
          <button class="carousel-btn" aria-label="Следующий" onclick="scrollCarousel('storiesCarousel', 370)">→</button>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ TEXT REVIEWS GRID ═══ -->
  <section class="text-reviews-section">
    <div class="text-reviews-inner">
      <h2 class="text-reviews-title">Ещё больше <em>тёплых слов</em></h2>

      <div class="text-reviews-grid">

        <div class="text-review-card">
          <div class="text-review-stars" role="img" aria-label="Рейтинг 5 из 5">★★★★★</div>
          <div class="text-review-text">«Заказывала клубнику — пришла идеальная. Лёгкая, цвета натуральные. Ношу на работу — коллеги в восторге, думают настоящая!»</div>
          <div class="text-review-footer">
            <div class="text-review-author">
              <div class="review-avatar">И</div>
              <div>
                <div class="review-name">Ирина</div>
                <div class="review-date">Февраль 2025</div>
              </div>
            </div>
            <span class="text-review-source source-ozon">Ozon</span>
          </div>
        </div>

        <div class="text-review-card">
          <div class="text-review-stars" role="img" aria-label="Рейтинг 5 из 5">★★★★★</div>
          <div class="text-review-text">«Второй заказ за месяц. Первый раз — себе серьги, второй — подруге в подарок. Она визжала от счастья. Качество на высоте!»</div>
          <div class="text-review-footer">
            <div class="text-review-author">
              <div class="review-avatar">С</div>
              <div>
                <div class="review-name">Светлана</div>
                <div class="review-date">Январь 2025</div>
              </div>
            </div>
            <span class="text-review-source source-wb">WB</span>
          </div>
        </div>

        <div class="text-review-card">
          <div class="text-review-stars" role="img" aria-label="Рейтинг 5 из 5">★★★★★</div>
          <div class="text-review-text">«Брошь белый гриб — маленькое произведение искусства. Ношу на шарфе, получаю комплименты каждый день. Муж даже запомнил название бренда.»</div>
          <div class="text-review-footer">
            <div class="text-review-author">
              <div class="review-avatar">Т</div>
              <div>
                <div class="review-name">Татьяна</div>
                <div class="review-date">Декабрь 2024</div>
              </div>
            </div>
            <span class="text-review-source source-ym">Я.М</span>
          </div>
        </div>

        <div class="text-review-card">
          <div class="text-review-stars" role="img" aria-label="Рейтинг 5 из 5">★★★★★</div>
          <div class="text-review-text">«Купила набор: серьги + подвеска. Упаковка как в ювелирном. Муж подумал, что я потратила тысяч пять, а когда узнал цену — сам попросил ещё заказать.»</div>
          <div class="text-review-footer">
            <div class="text-review-author">
              <div class="review-avatar">Л</div>
              <div>
                <div class="review-name">Людмила</div>
                <div class="review-date">Ноябрь 2024</div>
              </div>
            </div>
            <span class="text-review-source source-ozon">Ozon</span>
          </div>
        </div>

        <div class="text-review-card">
          <div class="text-review-stars" role="img" aria-label="Рейтинг 4 из 5">★★★★☆</div>
          <div class="text-review-text">«Серьги морошка — очень красивые и необычные. Единственное — хотелось бы чуть длиннее крючки. Но в целом — шикарно, рекомендую.»</div>
          <div class="text-review-footer">
            <div class="text-review-author">
              <div class="review-avatar">Д</div>
              <div>
                <div class="review-name">Дарья</div>
                <div class="review-date">Октябрь 2024</div>
              </div>
            </div>
            <span class="text-review-source source-wb">WB</span>
          </div>
        </div>

        <div class="text-review-card">
          <div class="text-review-stars" role="img" aria-label="Рейтинг 5 из 5">★★★★★</div>
          <div class="text-review-text">«Подвеска ландыш для мамы — лучший подарок на день рождения. Она плакала от счастья. Спасибо за то, что вкладываете душу в каждое украшение.»</div>
          <div class="text-review-footer">
            <div class="text-review-author">
              <div class="review-avatar">К</div>
              <div>
                <div class="review-name">Кристина</div>
                <div class="review-date">Март 2025</div>
              </div>
            </div>
            <span class="text-review-source source-ym">Я.М</span>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ═══ CTA ═══ -->
  <section class="cta-section" id="contact">
    <h2 class="cta-title">Хотите стать <em>частью историй?</em></h2>
    <p class="cta-subtitle">Выберите своё украшение — и напишите свой отзыв</p>
    <div class="cta-buttons">
      <a href="/catalog" class="btn-primary">Перейти в каталог →</a>
      <a href="#" class="btn-secondary">Написать в Telegram →</a>
    </div>
  </section>

  <script src="/scripts/carousel.js"></script>
  <script src="/scripts/filters.js"></script>
</BaseLayout>
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:4321/reviews` — should look identical to `mockup/reviews.html`. Test that carousel buttons scroll, and filter tabs toggle correctly within their own group.

- [ ] **Step 3: Commit**

```bash
git add src/pages/reviews.astro
git commit -m "feat: add reviews page with carousel aria-labels and filter groups"
```

---

## Task 12: Create sitemap and robots.txt

**Files:**
- Create: `src/pages/sitemap.xml.ts`
- Create: `public/robots.txt`

- [ ] **Step 1: Create robots.txt**

Create `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: TODO реальный домен/sitemap.xml
```

- [ ] **Step 2: Create sitemap.xml.ts**

Create `src/pages/sitemap.xml.ts`:
```ts
import type { APIRoute } from 'astro';

const pages = [
  { url: '/', priority: '1.0' },
  { url: '/catalog', priority: '0.9' },
  { url: '/about', priority: '0.7' },
  { url: '/reviews', priority: '0.7' },
];

const lastmod = new Date().toISOString().split('T')[0];

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site ? site.toString().replace(/\/$/, '') : 'TODO: реальный домен';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
```

- [ ] **Step 3: Verify sitemap in browser**

Open `http://localhost:4321/sitemap.xml` — should return valid XML with 4 `<url>` entries.

- [ ] **Step 4: Commit**

```bash
git add public/robots.txt src/pages/sitemap.xml.ts
git commit -m "feat: add sitemap.xml endpoint and robots.txt"
```

---

## Task 13: Final build verification

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: `dist/` directory created with no errors. Should contain:
- `dist/index.html`
- `dist/catalog/index.html`
- `dist/about/index.html`
- `dist/reviews/index.html`
- `dist/sitemap.xml`
- `dist/robots.txt`
- `dist/styles/` (all CSS files)
- `dist/scripts/` (all JS files)

- [ ] **Step 2: Preview the build**

```bash
npm run preview
```

Open `http://localhost:4321` and verify all 4 pages look correct. Check that nav active state is correct on each page.

- [ ] **Step 3: Verify mockup is untouched**

```bash
ls mockup/
```

Expected: original files still present — `index.html`, `about.html`, `catalog.html`, `reviews.html`, `css/`, `js/`.

- [ ] **Step 4: Final commit**

```bash
git add dist/ # only if dist should be committed — usually not
git commit -m "feat: complete Astro migration — 4 pages, shared layout, SEO, sitemap"
```

Note: Do NOT commit `dist/` if this project will use CI/CD to build. Typically `dist/` is in `.gitignore`. Check if `.gitignore` already excludes it.

---

## Self-Review: Spec Coverage Check

| Spec requirement | Task |
|---|---|
| Astro, minimal template, static output | Task 1 |
| CSS → src/styles/ (now public/styles/) | Task 2, 7 |
| JS → src/scripts/, filters.js fixed | Task 3, 7 |
| BaseLayout with head, CSS cascade, OG, canonical | Task 6 |
| Nav component with activePage prop | Task 5 |
| Footer component | Task 4 |
| index.astro with title/description | Task 8 |
| catalog.astro | Task 10 |
| about.astro | Task 9 |
| reviews.astro | Task 11 |
| Organization schema on index | Task 8 |
| robots.txt | Task 12 |
| sitemap.xml.ts endpoint | Task 12 |
| Stars: role="img" aria-label | Tasks 8, 10, 11 |
| Carousel buttons: aria-label | Task 11 |
| Wishlist buttons: aria-label | Task 10 |
| lang="ru" on html | BaseLayout Task 6 |
| filters.js: data-filter-group | Tasks 3, 10, 11 |
| mockup/ stays untouched | Task 13 |

All requirements covered. No Product schema added (spec says not to). No Tailwind or UI framework used.
