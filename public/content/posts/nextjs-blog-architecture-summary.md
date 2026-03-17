---
slug: "nextjs-blog-architecture-summary"
title: "Next.js Blog Architecture Summary: Core Stack & Optimization"
date: "2025-12-09"
excerpt: "An overview of the stack and design choices behind this Next.js blog: App Router, SSG, content, and layout."
tags:
- Next.js
- Architecture
- TypeScript
- SSG
- Performance
---

## Next.js Blog Architecture Summary

This post describes the tech stack and main design choices used to build this blog. The goal is a simple, fast, and maintainable site that stays easy to extend.

## Core stack

- **Framework:** Next.js (App Router) with React and TypeScript.
- **Rendering:** Static Site Generation (SSG). Pages are built at build time; no runtime server needed for content.
- **Content:** Markdown files in `public/content/` (posts in `posts/`, intro in `intro.md`). Front matter (YAML) holds metadata (title, date, excerpt, tags). Content is read at build time via the filesystem and parsed with `gray-matter`.
- **Styling:** Tailwind CSS plus a global CSS file for layout, header, footer, and blog-specific styles (sidebar, prose, minimap).
- **Deployment:** Static export (e.g. GitHub Pages). No Node server required.

## Structure and layout

- **Home:** Single column: header, intro (from `intro.md`), list of recent posts, footer. Max width 42rem; padding aligned on left and right.
- **Blog:** Two-level layout. Blog index shows the latest post; post list lives in a sidebar (desktop) or is reachable via navigation. Each post has its own route `/blog/[slug]`.
- **Header:** Sticky, shared across home and blog. Navigation items (Home, Blog, Systems) and optional hamburger menu for small screens. When the hamburger is off, nav is centered on mobile.
- **Footer:** Same on all pages: links (Stack Overflow, GitHub, view source), then a second row with copyright and Resume download.

## Data and content flow

- **Posts:** Metadata (slug, title, date, excerpt, tags) is read from Markdown front matter. Full post content is loaded by slug when rendering a post page. Posts are sorted by date (newest first).
- **Intro:** Home intro comes from `public/content/intro.md` (title + body). Optional paragraphs are split by double newline and rendered as separate paragraphs.
- **Table of contents:** Headings are extracted from post Markdown (e.g. with a utility) to build an on-page minimap for long articles.

## Performance and optimization

- **Static generation:** All post pages are pre-rendered at build time via `generateStaticParams`, so first load is fast and no content API is needed at runtime.
- **Images:** Next.js `Image` is used where needed (e.g. favicon in the header) for optimization.
- **Fonts:** Google fonts (e.g. Source Sans 3, Source Serif 4) are loaded via `next/font` with `display: swap` to avoid layout shift.

## Summary

The blog is a static Next.js app: Markdown as the source of truth, SSG for speed and simplicity, shared layout (header/footer), and a small set of utilities for content and headings. This keeps the codebase straightforward and suitable for adding more posts or pages later.
