export const posts = [
  {
    id: "smart-eyes-stupid-hands",
    title: "Smart Eyes, Stupid Hands",
    slug: "smart-eyes-stupid-hands",
    date: "2026-08-23",
    formattedDate: "August 23rd, 2026",
    readingTime: "12 min read",
    author: {
      name: "Min Kim",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
      handle: "@minkim"
    },
    tags: ["design", "craft", "ai"],
    excerpt: "Turning the craft I loved into a profession made corner-cutting easier to justify. Now, AI forces me to ask: do I still want the process? Or do I just want the result?",
    bannerType: "geometric-grid",
    toc: [
      { id: "the-craft-of-looking", text: "The craft of looking", depth: 2 },
      { id: "wtlls-factor", text: "The WTLLS factor: What the line looks like", depth: 3 },
      { id: "autotelicity", text: "Autotelicity: For the love of the game", depth: 2 },
      { id: "tools-that-amplify", text: "Tools that amplify vs tools that replace", depth: 3 },
      { id: "hands-that-remember", text: "Hands that remember the grain", depth: 2 }
    ],
    content: `
      <p class="lead">
        When you spend a decade training your eyes to spot a one-pixel misalignment across browser engines, your hands don't automatically get faster—your patience just gets thinner. You develop what I call <em>the craft paradox</em>: your taste accelerates at exponential speed while your manual execution remains bound to the friction of time.
      </p>

      <h2 id="the-craft-of-looking">The craft of looking</h2>
      <p>
        In traditional Japanese woodblock printing (<em>Moku-hanga</em>), the artisan carver spends months training their eye to understand how the cherry wood grain resists a chisel before ever touching an ink stone. You cannot rush the grain because the grain is the voice of the medium.
      </p>
      
      <p>
        In modern interface development, we have replaced the resistance of wood with the instantaneous feedback of the canvas. Everything can be re-rendered in 16 milliseconds. And yet, the work often feels flatter. Why? Because when friction disappears entirely, discernment is often the first casualty.
      </p>

      <div data-callout="note">
        <summary>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span>A Note on "Taste" vs "Production"</span>
        </summary>
        <p>Taste is not just knowing what looks good; it is having an acute, visceral discomfort when something feels untrue to its materials.</p>
      </div>

      <h3 id="wtlls-factor">The WTLLS factor: What the line looks like</h3>
      <p>
        Typographers speak of the "color of the page"—the balanced density of black text against warm paper. If the word spacing is uneven, the page develops "rivers" of white space that distract the mind. 
      </p>

      <pre><code class="language-css">/* Knuth-Plass justified line distribution */
.prose-reading {
  text-align: justify;
  text-wrap: pretty;
  hyphens: auto;
  font-variant-numeric: oldstyle-nums tabular-nums;
  letter-spacing: -0.011em;
}</code></pre>

      <p>
        When you turn typography from an algorithmic afterthought into an intentional meditation, the entire screen breathes. You stop designing pages for the speed of skimming and start composing them for the grace of prolonged contemplation.
      </p>

      <blockquote class="pullquote">
        “We don't build software just to solve problems; we build software to carve a quiet corner of clarity in a noisy world.”
      </blockquote>

      <h2 id="autotelicity">Autotelicity: For the love of the game</h2>
      <p>
        Psychologist Mihaly Csikszentmihalyi popularized the term <em>autotelic</em> to describe an activity that has its purpose within itself. When a carpenter carves a mortise and tenon joint that no one will ever see behind a wardrobe panel, they do not do it for quarterly performance reviews. They do it because knowing the joint is true is where the soul enters the wood.
      </p>

      <div data-callout="tip">
        <summary>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/><path d="M12 7a5 5 0 0 1 5 5c0 1.8-.8 3-2 3.8V17H9v-1.2C7.8 15 7 13.8 7 12a5 5 0 0 1 5-5z"/></svg>
          <span>Practicing Micro-Interactions</span>
        </summary>
        <p>Always inspect hover states at 50% speed. If an animation looks abrupt when slowed down, it will feel jarring subconsciously at normal velocity.</p>
      </div>

      <h3 id="tools-that-amplify">Tools that amplify vs tools that replace</h3>
      <p>
        There is a fundamental difference between a tool that expands your range and an automation that robs you of the tactile understanding of why something works. The prompt box gives you a thousand permutations, but it doesn't give you the scar tissue of having failed fifty times before discovering the one curve that feels weightless.
      </p>

      <h2 id="hands-that-remember">Hands that remember the grain</h2>
      <p>
        Keep your eyes sharp, but give your hands the respect of deliberate practice. Build things with raw markup. Adjust leading by a quarter point. Watch how light falls across an ivory-toned screen when the evening sun strikes your desk. That is where design lives.
      </p>
    `
  },
  {
    id: "designing-for-paper-on-glass",
    title: "Designing for Paper on Glass: The Warm Editorial Web",
    slug: "designing-for-paper-on-glass",
    date: "2026-05-18",
    formattedDate: "May 18th, 2026",
    readingTime: "9 min read",
    author: {
      name: "Min Kim",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
      handle: "@minkim"
    },
    tags: ["typography", "css", "editorial"],
    excerpt: "Why digital reading shouldn't look like an airport dashboard. Exploring Japanese Mincho type, unbleached parchment tones, and typographic rhythm.",
    bannerType: "abstract-curves",
    toc: [
      { id: "the-sterile-monochrome", text: "The sterile monochrome trap", depth: 2 },
      { id: "chromatic-warmth", text: "Chromatic warmth: From #000 to unbleached ink", depth: 2 },
      { id: "mincho-and-serif", text: "Shippori Mincho and the rhythm of breath", depth: 3 },
      { id: "layout-margins", text: "The margin as negative space", depth: 2 }
    ],
    content: `
      <p class="lead">
        Most websites today are designed like dashboards. High contrast, pure sterile white (#FFFFFF) against pitch black (#000000), neon blue links screaming for attention, and notification badges pulsing at 60 frames per second. But what happens when you treat the browser as a quiet room bound with heavy vellum paper?
      </p>

      <h2 id="the-sterile-monochrome">The sterile monochrome trap</h2>
      <p>
        In physical print, pure white paper does not exist. Even the finest Japanese <em>washi</em> has an organic warmth—a whisper of linen, oat straw, and cedar bark. When light bounces off paper, it is absorbed and softened.
      </p>
      
      <p>
        A screen emits photon radiation directly into the optic nerve. Pure white on a retina display is the equivalent of staring into a miniature fluorescent bulb. By shifting our base canvas to a mellowed hue like <code>#FAF4ED</code> in light mode and a deep charcoal loam <code>#11100E</code> in dark mode, the eye immediately sighs in relief.
      </p>

      <h2 id="chromatic-warmth">Chromatic warmth: From #000 to unbleached ink</h2>
      <p>
        Let's look at the color tokens that make editorial typography singing:
      </p>

      <pre><code class="language-css">:root {
  /* Warm Parchment Light Theme */
  --bg-paper: #FAF4ED;
  --bg-surface: #EDE7DF;
  --border-subtle: #D4CDC5;
  --ink-primary: #332B21;   /* Rich roasted espresso */
  --ink-muted: #686056;     /* Muted slate sepia */
  --accent-amber: #CC4E00;  /* Traditional vermilion / hanko seal */
}

:root[data-theme="dark"] {
  /* Midnight Loam Dark Theme */
  --bg-paper: #11100E;
  --bg-surface: #1D1B19;
  --border-subtle: #34312C;
  --ink-primary: #FEEAD0;   /* Warm candlelight ivory */
  --ink-muted: #AFA391;     /* Soft weathered ash */
}</code></pre>

      <h3 id="mincho-and-serif">Shippori Mincho and the rhythm of breath</h3>
      <p>
        Mincho typefaces originate from the Ming dynasty woodblock carvings in China and were perfected by Japanese foundries during the Meiji era. The horizontal strokes are delicately thin, while the vertical strokes anchor the glyph with deliberate mass.
      </p>

      <div data-callout="tip">
        <summary>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <span>Typographic Sizing Hint</span>
        </summary>
        <p>Use fluid clamp scales: <code>font-size: clamp(1rem, 0.91rem + 0.45vw, 1.125rem);</code> with line-height of <code>calc(0.6rem + 1em)</code> to preserve comfortable eye travel across varying window widths.</p>
      </div>

      <h2 id="layout-margins">The margin as negative space</h2>
      <p>
        In Japanese aesthetics, this is known as <strong>Ma</strong> (間)—the pregnant pause, the silence between the bell tolls that defines the tone. When we give our articles generous gutters and let the table of contents float like a quiet companion in the periphery, the reader enters a state of deep, undisturbed focus.
      </p>
    `
  },
  {
    id: "tokyo-retrospective-quiet-interfaces",
    title: "Tokyo Retrospective: The Micro-Interfaces of Everyday Life",
    slug: "tokyo-retrospective-quiet-interfaces",
    date: "2025-11-12",
    formattedDate: "November 12th, 2025",
    readingTime: "15 min read",
    author: {
      name: "Min Kim",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
      handle: "@minkim"
    },
    tags: ["retrospectives", "japan", "ux"],
    excerpt: "From Shinjuku station wayfinding to the tactile click of convenience store payment screens: lessons in designing systems that respect human presence.",
    bannerType: "transit-pattern",
    toc: [
      { id: "the-shinjuku-ballet", text: "The Shinjuku ballet: Moving 3.5 million people", depth: 2 },
      { id: "tactile-soundscapes", text: "Tactile soundscapes and melodic departure chimes", depth: 3 },
      { id: "combini-kiosk", text: "The 7-Eleven payment kiosk: A masterclass in clarity", depth: 2 },
      { id: "quiet-technology", text: "The philosophy of quiet technology", depth: 2 }
    ],
    content: `
      <p class="lead">
        I spent three weeks walking through Tokyo with a notebook and a sketchbook, paying attention not to the neon spectacles of Shibuya Crossing, but to the thousands of tiny, uncredited design triumphs that make a city of 37 million people feel quieter than a suburban supermarket.
      </p>

      <h2 id="the-shinjuku-ballet">The Shinjuku ballet: Moving 3.5 million people</h2>
      <p>
        Shinjuku Station is officially the busiest transportation hub in human history. Over 3.5 million commuters cross its platforms every single day. Yet there is almost no shouting, no confusion, and virtually no panic.
      </p>

      <p>
        Why? Because information architecture isn't painted onto signs; it is built into the physical terrain. Tactile yellow paving blocks (<em>Tenji blocks</em>) guide the visually impaired. Color codes for train lines aren't arbitrary—they carry across floor strips, overhead signage, train car liveries, and digital display boards.
      </p>

      <h3 id="tactile-soundscapes">Tactile soundscapes and melodic departure chimes</h3>
      <p>
        Instead of shrill buzzer alarms that induce anxiety, Japanese trains use <strong>Hassha Merodī</strong> (departure melodies). Each station has its own short, gentle 7-second acoustic motif. Commuters internalize the jingles subconsciously. You can wake up from a nap on the Yamanote line and know exactly which station you've reached without ever opening your eyes.
      </p>

      <div data-callout="important">
        <summary>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>Software Analogy</span>
        </summary>
        <p>Do your application's notifications alert the user with grace, or do they assault their nervous system with red badges and harsh dings? Sound and micro-timing are design surfaces.</p>
      </div>

      <h2 id="combini-kiosk">The 7-Eleven payment kiosk: A masterclass in clarity</h2>
      <p>
        Step into any Japanese <em>konbini</em> and pay for an onigiri. The automated cash terminal faces both the clerk and the customer. You insert a 10,000 yen bill, coins clatter in, and the machine sorts them instantly, dispensing exact change with mechanical dignity. No awkward credit card tip prompt requesting 25% for passing you a bottle of green tea.
      </p>

      <h2 id="quiet-technology">The philosophy of quiet technology</h2>
      <p>
        Technology reaches its zenith not when it demands our awe, but when it disappears seamlessly into our rituals. As software engineers, our best work should aim to be as dependable, humble, and beautifully executed as a Tokyo train schedule.
      </p>
    `
  },
  {
    id: "knuth-plass-and-hyphenation",
    title: "Bringing Knuth–Plass Justification to the Browser",
    slug: "knuth-plass-and-hyphenation",
    date: "2025-09-04",
    formattedDate: "September 4th, 2025",
    readingTime: "11 min read",
    author: {
      name: "Min Kim",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
      handle: "@minkim"
    },
    tags: ["algorithms", "typography", "web"],
    excerpt: "Donald Knuth solved paragraph line-breaking in 1981 with dynamic programming. Here is how we emulate book-quality justified typesetting in modern CSS.",
    bannerType: "math-grid",
    toc: [
      { id: "the-greedy-broken-web", text: "The greedy-broken web", depth: 2 },
      { id: "knuth-plass-algorithm", text: "The Knuth–Plass breakthrough", depth: 2 },
      { id: "interactive-toggle", text: "Providing the user with a choice", depth: 3 },
      { id: "implementation-details", text: "CSS properties that make it possible", depth: 2 }
    ],
    content: `
      <p class="lead">
        Web browsers still format paragraphs using a primitive "greedy" line-breaking algorithm: fit as many words as possible on line one, break, and repeat. In 1981, Donald Knuth and Michael Plass revolutionized typography with TeX by solving paragraph breaking globally using dynamic programming.
      </p>

      <h2 id="the-greedy-broken-web">The greedy-broken web</h2>
      <p>
        When you apply <code>text-align: justify</code> naively in CSS, the browser expands the spaces between words on each line independently. The result? Catastrophic rivers of empty white space, loose lines next to tight lines, and an eye-straining mess.
      </p>

      <h2 id="knuth-plass-algorithm">The Knuth–Plass breakthrough</h2>
      <p>
        Knuth and Plass modeled a paragraph as an interconnected graph of <em>boxes</em> (words), <em>glue</em> (flexible spaces that can shrink or stretch), and <em>penalties</em> (costs assigned to hyphenating or leaving excessive slack).
      </p>

      <pre><code class="language-javascript">// Conceptual node evaluation
function calculateBadness(slack, stretchability) {
  if (slack < 0) return Infinity; // Overfull line
  const ratio = slack / stretchability;
  return 100 * Math.pow(Math.abs(ratio), 3);
}</code></pre>

      <h3 id="interactive-toggle">Providing the user with a choice</h3>
      <p>
        Notice the button in our sidebar labeled with the paragraph symbol (¶). It allows readers to toggle between classical <strong>Knuth-Plass justified alignment</strong> and natural <strong>ragged right alignment</strong> according to their reading preference.
      </p>

      <h2 id="implementation-details">CSS properties that make it possible</h2>
      <p>
        With modern standards like <code>text-wrap: pretty</code>, <code>hyphens: auto</code>, and font-feature-settings, we can achieve remarkably close approximations directly in native CSS without heavy WebAssembly polyfills:
      </p>

      <pre><code class="language-css">[data-text-justification="justified"] prose-content {
  text-align: justify;
  text-align-last: start;
  text-wrap: pretty;
  hyphens: auto;
  word-break: normal;
}

[data-text-justification="ragged"] prose-content {
  text-align: start;
  text-wrap: pretty;
}</code></pre>
    `
  }
];

export const projectHighlights = [
  {
    title: "TypePaper",
    year: "2026",
    role: "Creator",
    description: "A minimal distraction-free writing environment built around classical Mincho typography and local-first SQLite persistence.",
    link: "#",
    tag: "Open Source"
  },
  {
    title: "GachaEngine",
    year: "2025",
    role: "Lead Engineer",
    description: "A deterministic, verifiable simulation framework for probability-based game mechanics with real-time analytics.",
    link: "#",
    tag: "Systems"
  },
  {
    title: "Port Authority",
    year: "2024",
    role: "Game Design",
    description: "Multiplayer WebSocket maritime coordination challenge featured in global CTF competitions.",
    link: "#",
    tag: "WebSockets"
  }
];

export const aboutData = {
  name: "Min Kim",
  title: "Design engineer based in San Francisco & Seoul",
  bio: `I design and build software with an obsession for typographic hierarchy, tactile feedback, and human-scale ergonomics. 

Before this, I worked on design systems, web performance, and developer tools. When not coding, I brew light-roast pour-overs, take photographs with a 35mm rangefinder, and study classical bookbinding.`,
  principles: [
    { title: "Honor the Medium", desc: "Software is neither print nor cinema; it is an interactive living texture that should feel fluid and alive." },
    { title: "Quiet Craft", desc: "True craftsmanship whispers. Eliminate artificial urgency, unnecessary popups, and abrasive contrast." },
    { title: "Speed is Courtesy", desc: "An interface that responds instantaneously honors the reader's attention and precious time." }
  ]
};
