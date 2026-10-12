# Illustrated experience map

The public Projects overview uses one generated 4:3 pixel-world illustration instead of a card grid. Ten generated transparent icons represent the ten experiences, linked to the existing public summary panels. The protected archive remains reachable from About.

- Map source: `public/experience-map/world.png`; optimized web asset `world.webp`.
- Icons: `public/experience-map/icons/`; generated source `artwork/experience-map/icons-atlas.png`.
- Generation prompts: `artwork/experience-map/manifest.json`.
- Coordinates and short labels: `src/experience-map.js`.
- Mechanical icon extraction: `scripts/package-experience-icons.py`.
- Page: `src/pages/projects/index.astro`.

Each icon is a keyboard-accessible button with the full experience name and role. Clicking nearby illustrated landmarks selects the nearest experience within a bounded hit area. Selection opens the relevant public role/contribution summary, updates the URL fragment, and retains browser exploration progress. An Experience index provides text links as an alternate navigation path. Back to the experience map returns to the illustration. All labels remain real HTML text for readability and translation; the artwork contains no baked-in names or company logos.
