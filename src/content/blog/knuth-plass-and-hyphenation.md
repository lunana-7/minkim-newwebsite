---
title: "Bringing Knuth–Plass Justification to the Browser"
date: "2025-09-04"
readingTime: "11 min read"
tags: ["algorithms", "typography", "web"]
excerpt: "Donald Knuth solved paragraph line-breaking in 1981 with dynamic programming. Here is how we emulate book-quality justified typesetting in modern CSS."
bannerType: "math-grid"
---

Web browsers still format paragraphs using a primitive "greedy" line-breaking algorithm: fit as many words as possible on line one, break, and repeat. In 1981, Donald Knuth and Michael Plass revolutionized typography with TeX by solving paragraph breaking globally using dynamic programming.

## The greedy-broken web

When you apply `text-align: justify` naively in CSS, the browser expands the spaces between words on each line independently. The result? Catastrophic rivers of empty white space, loose lines next to tight lines, and an eye-straining mess.

## The Knuth–Plass breakthrough

Knuth and Plass modeled a paragraph as an interconnected graph of *boxes* (words), *glue* (flexible spaces that can shrink or stretch), and *penalties* (costs assigned to hyphenating or leaving excessive slack).

```javascript
// Conceptual node evaluation
function calculateBadness(slack, stretchability) {
  if (slack < 0) return Infinity; // Overfull line
  const ratio = slack / stretchability;
  return 100 * Math.pow(Math.abs(ratio), 3);
}
```

### Providing the user with a choice

Notice the button in our sidebar labeled with the paragraph symbol (¶). It allows readers to toggle between classical **Knuth-Plass justified alignment** and natural **ragged right alignment** according to their reading preference.

## CSS properties that make it possible

With modern standards like `text-wrap: pretty`, `hyphens: auto`, and font-feature-settings, we can achieve remarkably close approximations directly in native CSS without heavy WebAssembly polyfills:

```css
[data-text-justification="justified"] .prose-content {
  text-align: justify;
  text-align-last: start;
  text-wrap: pretty;
  hyphens: auto;
  word-break: normal;
}

[data-text-justification="ragged"] .prose-content {
  text-align: start;
  text-wrap: pretty;
}
```
