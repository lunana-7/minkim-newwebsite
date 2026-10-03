import { posts, projectHighlights, aboutData } from './posts.js';
import { renderBanner, renderBrandGlyph } from './banners.js';

// ==========================================================================
// State Management
// ==========================================================================
let currentTagFilter = 'all';
let currentArticleSlug = null;
let searchSelectedIndex = -1;

// ==========================================================================
// Theme Management
// ==========================================================================
function initTheme() {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');

  function updateThemeIcons(theme) {
    if (theme === 'dark') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
    updateBrandGlyph(theme === 'dark');
  }

  const currentTheme = root.dataset.theme || 'light';
  updateThemeIcons(currentTheme);

  themeToggle.addEventListener('click', () => {
    const isDark = root.dataset.theme === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    root.dataset.theme = newTheme;
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {}
    updateThemeIcons(newTheme);

    // Re-render banners in current view
    if (currentArticleSlug) {
      const bannerEl = document.querySelector('.article-banner');
      const post = posts.find(p => p.slug === currentArticleSlug);
      if (bannerEl && post) {
        bannerEl.innerHTML = renderBanner(post.bannerType, newTheme === 'dark');
      }
    } else {
      renderBlogList();
    }
  });
}

function updateBrandGlyph(isDark) {
  const container = document.getElementById('brand-glyph-container');
  if (container) {
    container.innerHTML = renderBrandGlyph(isDark);
  }
}

// ==========================================================================
// Text Justification & Reader Mode
// ==========================================================================
function initReadingToggles() {
  const root = document.documentElement;
  const justToggle = document.getElementById('text-justification-toggle');
  const readerToggle = document.getElementById('reader-mode-toggle');

  // Justification Toggle (Knuth-Plass vs Ragged)
  if (root.dataset.textJustification === 'justified') {
    justToggle.classList.add('active');
  }

  justToggle.addEventListener('click', () => {
    const current = root.dataset.textJustification;
    const next = current === 'justified' ? 'ragged' : 'justified';
    root.dataset.textJustification = next;
    try {
      localStorage.setItem('textJustification', next);
    } catch (e) {}
    justToggle.classList.toggle('active', next === 'justified');
  });

  // Reader Mode Toggle
  readerToggle.addEventListener('click', () => {
    const isReader = document.body.hasAttribute('data-reader-mode');
    if (isReader) {
      document.body.removeAttribute('data-reader-mode');
      readerToggle.classList.remove('active');
    } else {
      document.body.setAttribute('data-reader-mode', '');
      readerToggle.classList.add('active');
    }
  });
}

// ==========================================================================
// Views / Rendering
// ==========================================================================
const mainContent = document.getElementById('main-content');
const tocSidebar = document.getElementById('page-toc');
const tocList = document.getElementById('toc-list');
const postSubnav = document.getElementById('sidebar-post-subnav');

function updateActiveNavLink(activeNav) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.nav === activeNav);
  });
}

// 1. Blog List View
function renderBlogList() {
  currentArticleSlug = null;
  tocSidebar.style.display = 'none';
  postSubnav.style.display = 'none';
  updateActiveNavLink('blog');

  // Extract unique tags
  const allTags = ['all', ...new Set(posts.flatMap(p => p.tags))];

  // Filter posts
  const filteredPosts = currentTagFilter === 'all'
    ? posts
    : posts.filter(p => p.tags.includes(currentTagFilter));

  const isDark = document.documentElement.dataset.theme === 'dark';

  let html = `
    <!-- Filter Tags -->
    <div class="filter-bar">
      ${allTags.map(tag => `
        <button class="filter-btn ${currentTagFilter === tag ? 'active' : ''}" data-filter="${tag}">
          ${tag === 'all' ? 'All Entries' : '#' + tag}
        </button>
      `).join('')}
    </div>

    <!-- Posts List -->
    <ul class="posts-list">
      ${filteredPosts.map(post => `
        <li class="post-card">
          <a href="#blog/${post.slug}" class="post-thumb-link" aria-label="Read ${post.title}">
            <div class="post-thumb-svg">
              ${renderBanner(post.bannerType, isDark)}
            </div>
          </a>
          <div class="post-card-info">
            <a href="#blog/${post.slug}" class="post-card-title">${post.title}</a>
            <div class="post-card-meta">
              <span class="author-chip">
                <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar">
                <span>${post.author.name}</span>
              </span>
              <span class="meta-dot">·</span>
              <time datetime="${post.date}">${post.formattedDate}</time>
              <span class="meta-dot">·</span>
              <span>${post.readingTime}</span>
            </div>
            <p class="post-card-excerpt">${post.excerpt}</p>
            <div class="post-card-tags">
              ${post.tags.map(t => `<a href="#tag/${t}" class="post-tag">#${t}</a>`).join(' ')}
            </div>
          </div>
        </li>
      `).join('')}
    </ul>

    <!-- Footer -->
    ${renderFooter()}
  `;

  mainContent.innerHTML = html;

  // Add click listeners to filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTagFilter = btn.dataset.filter;
      renderBlogList();
    });
  });

  // Attach post tag click handlers
  document.querySelectorAll('.post-tag').forEach(tagEl => {
    tagEl.addEventListener('click', (e) => {
      e.preventDefault();
      const tag = tagEl.textContent.replace('#', '').trim();
      currentTagFilter = tag;
      renderBlogList();
    });
  });
}

// 2. Full Article View
function renderArticle(slug) {
  const post = posts.find(p => p.slug === slug);
  if (!post) {
    window.location.hash = '#blog';
    return;
  }

  currentArticleSlug = slug;
  updateActiveNavLink('blog');

  // Update sidebar sub-item
  postSubnav.style.display = 'block';
  postSubnav.innerHTML = `
    <li>
      <span style="color: var(--foreground); font-size: 0.85rem; font-weight: 500; line-height: 1.3; display: block; border-left: 2px solid var(--accent-vermilion); padding-left: 0.5rem;">
        ${post.title}
      </span>
    </li>
  `;

  // Populate Right Table of Contents Rail
  if (post.toc && post.toc.length > 0) {
    tocSidebar.style.display = 'block';
    tocList.innerHTML = post.toc.map(item => `
      <li>
        <a href="#${item.id}" class="toc-link" data-depth="${item.depth}">
          ${item.text}
        </a>
      </li>
    `).join('');
  } else {
    tocSidebar.style.display = 'none';
  }

  // Find next and prev posts
  const currentIndex = posts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  const isDark = document.documentElement.dataset.theme === 'dark';

  // Retrieve stored comments
  const storedCommentsKey = `comments_${slug}`;
  let comments = [];
  try {
    const raw = localStorage.getItem(storedCommentsKey);
    comments = raw ? JSON.parse(raw) : [
      { author: "Elena Vance", text: "The reflection on friction in digital craft hits so close to home. Beautiful typesetting on this site!", time: "2 days ago" }
    ];
  } catch (e) {}

  let html = `
    <article>
      <header class="article-header">
        <a href="#blog" class="back-to-blog">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to entries</span>
        </a>
        <h1 class="article-title">${post.title}</h1>
        <div class="article-meta">
          <span class="author-chip">
            <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar">
            <span>${post.author.name}</span>
          </span>
          <span class="meta-dot">·</span>
          <time datetime="${post.date}">${post.formattedDate}</time>
          <span class="meta-dot">·</span>
          <span>${post.readingTime}</span>
          <span class="meta-dot">·</span>
          <span>${post.tags.map(t => `#${t}`).join(', ')}</span>
        </div>
        <p class="article-excerpt">${post.excerpt}</p>
      </header>

      <div class="article-banner">
        ${renderBanner(post.bannerType, isDark)}
      </div>

      <div class="prose-content">
        ${post.content}
      </div>

      <!-- Bottom Navigation Prev / Next -->
      <nav class="article-nav-bottom" aria-label="Adjacent Articles">
        ${prevPost ? `
          <a href="#blog/${prevPost.slug}" class="nav-card">
            <span class="nav-direction">← Earlier Entry</span>
            <span class="nav-title">${prevPost.title}</span>
          </a>
        ` : `<div></div>`}

        ${nextPost ? `
          <a href="#blog/${nextPost.slug}" class="nav-card" style="text-align: right;">
            <span class="nav-direction">Later Entry →</span>
            <span class="nav-title">${nextPost.title}</span>
          </a>
        ` : `<div></div>`}
      </nav>

      <!-- Interactive Comments Section -->
      <section class="comments-section" id="comments">
        <div class="comments-header">
          <h2 class="comments-title">Thoughts & Discussion</h2>
          <span class="comments-count" id="comments-count">(${comments.length})</span>
        </div>

        <form class="comment-form" id="comment-form">
          <textarea class="comment-input" id="comment-input" placeholder="Leave a reflection or note on this essay..." required></textarea>
          <div class="comment-submit-row">
            <button type="submit" class="comment-btn">Share Reflection</button>
          </div>
        </form>

        <div class="comments-list" id="comments-list">
          ${comments.map(c => `
            <div class="comment-item">
              <div class="comment-meta">
                <span class="comment-author">${c.author}</span>
                <span>${c.time}</span>
              </div>
              <p class="comment-text">${c.text}</p>
            </div>
          `).join('')}
        </div>
      </section>
    </article>

    <!-- Footer -->
    ${renderFooter()}
  `;

  mainContent.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Add Copy Buttons to all code snippets
  document.querySelectorAll('pre').forEach(pre => {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'icon-btn';
    copyBtn.style.position = 'absolute';
    copyBtn.style.top = '0.5rem';
    copyBtn.style.right = '0.5rem';
    copyBtn.style.width = '1.75rem';
    copyBtn.style.height = '1.75rem';
    copyBtn.title = 'Copy code';
    copyBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `;
    copyBtn.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.innerText || '';
      try {
        await navigator.clipboard.writeText(code);
        copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tone-green)" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          `;
        }, 1800);
      } catch (err) {}
    });
    pre.appendChild(copyBtn);
  });

  // Handle Comment Submission
  const commentForm = document.getElementById('comment-form');
  const commentInput = document.getElementById('comment-input');
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = commentInput.value.trim();
    if (!text) return;

    const newComment = {
      author: "Visiting Reader",
      text,
      time: "Just now"
    };

    comments.unshift(newComment);
    try {
      localStorage.setItem(storedCommentsKey, JSON.stringify(comments));
    } catch (e) {}

    // Update comment list UI
    const listEl = document.getElementById('comments-list');
    const countEl = document.getElementById('comments-count');
    const commentEl = document.createElement('div');
    commentEl.className = 'comment-item';
    commentEl.innerHTML = `
      <div class="comment-meta">
        <span class="comment-author">${newComment.author}</span>
        <span>${newComment.time}</span>
      </div>
      <p class="comment-text">${newComment.text}</p>
    `;
    listEl.prepend(commentEl);
    countEl.textContent = `(${comments.length})`;
    commentInput.value = '';
  });

  initScrollSpy();
}

// 3. Work View
function renderWork() {
  currentArticleSlug = null;
  tocSidebar.style.display = 'none';
  postSubnav.style.display = 'none';
  updateActiveNavLink('work');

  let html = `
    <div>
      <h1 class="page-title">Work & Selected Projects</h1>
      <p class="page-lead">
        A catalog of software systems, typography experiments, and tools built with an emphasis on craftsmanship and performance.
      </p>

      <div class="projects-grid">
        ${projectHighlights.map(proj => `
          <div class="project-card">
            <div class="project-header">
              <h2 class="project-name">${proj.title}</h2>
              <span class="project-tag">${proj.tag}</span>
            </div>
            <div style="font-size: 0.82rem; color: var(--muted-foreground); margin-bottom: 0.4rem; font-family: var(--font-sans);">
              ${proj.year} · ${proj.role}
            </div>
            <p class="project-desc">${proj.description}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Footer -->
    ${renderFooter()}
  `;

  mainContent.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 4. About View
function renderAbout() {
  currentArticleSlug = null;
  tocSidebar.style.display = 'none';
  postSubnav.style.display = 'none';
  updateActiveNavLink('about');

  let html = `
    <div>
      <h1 class="page-title">About</h1>
      <p class="page-lead">${aboutData.title}</p>
      
      <div class="prose-content" style="margin-bottom: var(--space-xl);">
        ${aboutData.bio.split('\n\n').map(p => `<p>${p}</p>`).join('')}
      </div>

      <h2 style="font-family: var(--font-serif); font-size: var(--step-2); margin-bottom: var(--space-s); font-weight: 500;">
        Design Principles
      </h2>
      <div class="principles-list">
        ${aboutData.principles.map(item => `
          <div class="principle-item">
            <h3 class="principle-title">${item.title}</h3>
            <p class="principle-desc">${item.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Footer -->
    ${renderFooter()}
  `;

  mainContent.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderFooter() {
  return `
    <footer class="page-footer">
      <div>© ${new Date().getFullYear()} Min Kim. Built with craft & quiet typography.</div>
      <ul class="footer-socials">
        <li>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>
        </li>
        <li>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.2 4.2 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84q-.51 0-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23"/>
            </svg>
          </a>
        </li>
        <li>
          <a href="#rss" aria-label="RSS Feed">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 10c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h2c3.771 0 5.657 0 6.828 1.172S21 6.229 21 10v4c0 3.771 0 5.657-1.172 6.828S16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.172S3 17.771 3 14zm3 2c0-1.414 0-2.121.44-2.56C6.878 9 7.585 9 9 9h6c1.414 0 2.121 0 2.56.44.44.439.44 1.146.44 2.56v4c0 1.414 0 2.121-.44 2.56c-.439.44-1.146.44-2.56.44H9c-1.414 0-2.121 0-2.56-.44C6 18.122 6 17.415 6 16zm1-6.75a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5z"/>
            </svg>
          </a>
        </li>
      </ul>
    </footer>
  `;
}

// ==========================================================================
// Scroll Spy for Table of Contents
// ==========================================================================
function initScrollSpy() {
  const headings = document.querySelectorAll('.prose-content h2, .prose-content h3');
  const tocLinks = document.querySelectorAll('.toc-link');

  if (headings.length === 0 || tocLinks.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-80px 0px -70% 0px',
    threshold: 0
  });

  headings.forEach(h => observer.observe(h));
}

// ==========================================================================
// Command-K Search Dialog Modal
// ==========================================================================
function initSearch() {
  const modal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchTrigger = document.getElementById('search-trigger');

  function openSearch() {
    modal.classList.add('open');
    searchInput.value = '';
    searchSelectedIndex = -1;
    renderSearchResults('');
    setTimeout(() => searchInput.focus(), 50);
  }

  function closeSearch() {
    modal.classList.remove('open');
  }

  searchTrigger.addEventListener('click', openSearch);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSearch();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (modal.classList.contains('open')) closeSearch();
      else openSearch();
    } else if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeSearch();
    }
  });

  function renderSearchResults(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      searchResults.innerHTML = `
        <li class="search-empty">
          Type to search essays, typography notes, and technical articles...
        </li>
      `;
      return;
    }

    const matches = posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <li class="search-empty">
          No articles found matching "<em>${query}</em>"
        </li>
      `;
      return;
    }

    searchResults.innerHTML = matches.map((post, idx) => `
      <li>
        <a href="#blog/${post.slug}" class="search-item-link ${idx === searchSelectedIndex ? 'selected' : ''}">
          <span class="search-item-title">${post.title}</span>
          <span class="search-item-excerpt">${post.excerpt}</span>
        </a>
      </li>
    `).join('');

    // Clicking a search result closes modal and opens post
    searchResults.querySelectorAll('.search-item-link').forEach(link => {
      link.addEventListener('click', () => closeSearch());
    });
  }

  searchInput.addEventListener('input', (e) => {
    searchSelectedIndex = -1;
    renderSearchResults(e.target.value);
  });
}

// ==========================================================================
// Routing Engine (Hash-based)
// ==========================================================================
function handleRouting() {
  const hash = window.location.hash.slice(1) || 'blog';

  if (hash.startsWith('blog/')) {
    const slug = hash.split('blog/')[1];
    renderArticle(slug);
  } else if (hash === 'work') {
    renderWork();
  } else if (hash === 'about') {
    renderAbout();
  } else {
    // Default: blog list
    renderBlogList();
  }
}

// ==========================================================================
// Application Bootstrap
// ==========================================================================
function bootstrap() {
  initTheme();
  initReadingToggles();
  initSearch();
  handleRouting();
  window.addEventListener('hashchange', handleRouting);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

