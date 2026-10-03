/**
 * Generative Architectural & Geometric SVG Banners inspired by enscribe.dev
 */

export function renderBanner(type, isDark = false) {
  const strokeColor = isDark ? "#483F35" : "#BBB3AB";
  const strokeLight = isDark ? "#34312C" : "#D4CDC5";
  const accentFill = isDark ? "rgba(255, 160, 87, 0.12)" : "rgba(204, 78, 0, 0.08)";
  const accentStroke = isDark ? "#FFA057" : "#CC4E00";
  const bgFill = isDark ? "#1D1B19" : "#EDE7DF";

  switch (type) {
    case "geometric-grid":
      return `
        <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <rect width="800" height="450" fill="${bgFill}"/>
          <!-- Isometric Hatching Grid -->
          <g stroke="${strokeLight}" stroke-width="1.2" stroke-dasharray="3 3">
            <line x1="50" y1="0" x2="50" y2="450"/>
            <line x1="150" y1="0" x2="150" y2="450"/>
            <line x1="250" y1="0" x2="250" y2="450"/>
            <line x1="350" y1="0" x2="350" y2="450"/>
            <line x1="450" y1="0" x2="450" y2="450"/>
            <line x1="550" y1="0" x2="550" y2="450"/>
            <line x1="650" y1="0" x2="650" y2="450"/>
            <line x1="750" y1="0" x2="750" y2="450"/>
            
            <line x1="0" y1="75" x2="800" y2="75"/>
            <line x1="0" y1="150" x2="800" y2="150"/>
            <line x1="0" y1="225" x2="800" y2="225"/>
            <line x1="0" y1="300" x2="800" y2="300"/>
            <line x1="0" y1="375" x2="800" y2="375"/>
          </g>
          
          <!-- Diagonal Rays -->
          <g stroke="${strokeColor}" stroke-width="1.5">
            <line x1="200" y1="450" x2="650" y2="0"/>
            <line x1="260" y1="450" x2="710" y2="0"/>
            <line x1="320" y1="450" x2="770" y2="0"/>
            <line x1="140" y1="450" x2="590" y2="0"/>
          </g>

          <!-- Golden Focus Circle & Accent geometry -->
          <circle cx="500" cy="225" r="130" stroke="${strokeColor}" stroke-width="2" fill="${accentFill}"/>
          <circle cx="500" cy="225" r="90" stroke="${strokeLight}" stroke-width="1.5"/>
          <circle cx="500" cy="225" r="4" fill="${accentStroke}"/>
          <rect x="420" y="145" width="160" height="160" stroke="${accentStroke}" stroke-width="1.5" stroke-dasharray="5 5" fill="none"/>
          
          <!-- Callout coordinate mark -->
          <text x="430" y="130" font-family="monospace" font-size="11" fill="${accentStroke}" letter-spacing="1">SEC. 01 // PROSE PROPORTIONS</text>
        </svg>
      `;

    case "abstract-curves":
      return `
        <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <rect width="800" height="450" fill="${bgFill}"/>
          <!-- Organic typographic contours -->
          <path d="M-50,300 C200,100 450,420 850,180" stroke="${strokeColor}" stroke-width="2" fill="none"/>
          <path d="M-50,340 C200,140 450,460 850,220" stroke="${strokeLight}" stroke-width="1.5" fill="none"/>
          <path d="M-50,260 C200,60 450,380 850,140" stroke="${strokeLight}" stroke-width="1.2" fill="none"/>
          <path d="M-50,220 C200,20 450,340 850,100" stroke="${strokeLight}" stroke-width="1" stroke-dasharray="4 4" fill="none"/>

          <!-- Mincho glyph abstraction -->
          <g transform="translate(480, 80)">
            <rect x="0" y="0" width="220" height="280" stroke="${strokeColor}" stroke-width="1.5" fill="${accentFill}"/>
            <line x1="20" y1="20" x2="200" y2="20" stroke="${accentStroke}" stroke-width="3"/>
            <line x1="110" y1="20" x2="110" y2="260" stroke="${accentStroke}" stroke-width="3"/>
            <line x1="50" y1="120" x2="170" y2="120" stroke="${strokeColor}" stroke-width="1.5"/>
            <line x1="30" y1="260" x2="190" y2="260" stroke="${strokeColor}" stroke-width="2"/>
            <text x="20" y="275" font-family="serif" font-size="12" fill="${accentStroke}">間 — SPACE IN BREATH</text>
          </g>

          <circle cx="280" cy="240" r="60" stroke="${strokeColor}" stroke-width="1.5" fill="none"/>
          <circle cx="280" cy="240" r="3" fill="${accentStroke}"/>
        </svg>
      `;

    case "transit-pattern":
      return `
        <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <rect width="800" height="450" fill="${bgFill}"/>
          <!-- Tokyo Metro inspired schematic network -->
          <g stroke="${strokeColor}" stroke-width="3">
            <line x1="100" y1="225" x2="700" y2="225"/>
            <path d="M250,225 L350,120 L550,120 L650,225" stroke="${accentStroke}" stroke-width="2.5" fill="none"/>
            <path d="M200,225 L300,330 L500,330 L600,225" stroke="${strokeLight}" stroke-width="2" fill="none"/>
          </g>
          
          <!-- Station Nodes -->
          <circle cx="250" cy="225" r="9" fill="${bgFill}" stroke="${strokeColor}" stroke-width="3"/>
          <circle cx="400" cy="225" r="11" fill="${bgFill}" stroke="${accentStroke}" stroke-width="3.5"/>
          <circle cx="550" cy="225" r="9" fill="${bgFill}" stroke="${strokeColor}" stroke-width="3"/>
          
          <circle cx="350" cy="120" r="7" fill="${bgFill}" stroke="${accentStroke}" stroke-width="2"/>
          <circle cx="550" cy="120" r="7" fill="${bgFill}" stroke="${accentStroke}" stroke-width="2"/>
          
          <circle cx="300" cy="330" r="7" fill="${bgFill}" stroke="${strokeLight}" stroke-width="2"/>
          <circle cx="500" cy="330" r="7" fill="${bgFill}" stroke="${strokeLight}" stroke-width="2"/>

          <text x="375" y="260" font-family="monospace" font-size="11" fill="${strokeColor}" letter-spacing="1">SHINJUKU [S-01]</text>
          <text x="215" y="200" font-family="monospace" font-size="10" fill="${strokeLight}">YOYOGI</text>
          <text x="525" y="200" font-family="monospace" font-size="10" fill="${strokeLight}">SHIBUYA</text>
        </svg>
      `;

    case "math-grid":
    default:
      return `
        <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <rect width="800" height="450" fill="${bgFill}"/>
          <!-- Knuth-Plass dynamic programming nodes -->
          <g stroke="${strokeLight}" stroke-width="1.5">
            <line x1="120" y1="150" x2="260" y2="120"/>
            <line x1="120" y1="150" x2="260" y2="200"/>
            <line x1="120" y1="150" x2="260" y2="280"/>
            
            <line x1="260" y1="120" x2="420" y2="160"/>
            <line x1="260" y1="200" x2="420" y2="160"/>
            <line x1="260" y1="280" x2="420" y2="240"/>

            <line x1="420" y1="160" x2="580" y2="200" stroke="${accentStroke}" stroke-width="2.5"/>
            <line x1="420" y1="240" x2="580" y2="200"/>
            
            <line x1="580" y1="200" x2="700" y2="200" stroke="${accentStroke}" stroke-width="2.5"/>
          </g>

          <!-- Nodes with penalties (Demerit calculation) -->
          <circle cx="120" cy="150" r="14" fill="${bgFill}" stroke="${strokeColor}" stroke-width="2"/>
          <text x="114" y="154" font-family="monospace" font-size="10" fill="${strokeColor}">B0</text>

          <circle cx="260" cy="120" r="12" fill="${bgFill}" stroke="${strokeColor}" stroke-width="2"/>
          <circle cx="260" cy="200" r="12" fill="${bgFill}" stroke="${strokeColor}" stroke-width="2"/>
          <circle cx="260" cy="280" r="12" fill="${bgFill}" stroke="${strokeColor}" stroke-width="2"/>

          <circle cx="420" cy="160" r="14" fill="${accentFill}" stroke="${accentStroke}" stroke-width="2.5"/>
          <circle cx="420" cy="240" r="12" fill="${bgFill}" stroke="${strokeColor}" stroke-width="2"/>

          <circle cx="580" cy="200" r="14" fill="${accentFill}" stroke="${accentStroke}" stroke-width="2.5"/>
          <circle cx="700" cy="200" r="16" fill="${bgFill}" stroke="${accentStroke}" stroke-width="3"/>
          <text x="693" y="204" font-family="monospace" font-size="11" fill="${accentStroke}">END</text>

          <text x="440" y="145" font-family="monospace" font-size="11" fill="${accentStroke}">d(i, j) = (b(i, j) + q)^2</text>
        </svg>
      `;
  }
}

export function renderBrandGlyph(isDark = false) {
  const eyeColor = isDark ? "#483F35" : "#483F35";
  const blobFill = isDark ? "#FEEAD0" : "#FAF4ED";
  const blobStroke = isDark ? "#BBB3AB" : "#BBB3AB";

  return `
    <svg width="24" height="24" viewBox="0 0 280 280" fill="none">
      <path d="M111.007 9.20703C183.244 -6.80756 254.786 38.7697 270.801 111.007C286.815 183.244 241.238 254.786 169.001 270.801C96.7638 286.815 25.2217 241.238 9.20703 169.001C-6.80756 96.7638 38.7697 25.2217 111.007 9.20703Z" fill="${blobFill}" stroke="${blobStroke}" stroke-width="16" />
      <path d="M118.435 99.4604C115.891 105.574 108.873 108.448 102.759 105.882C96.6453 103.315 93.7506 96.2782 96.2938 90.1651C98.837 84.052 105.855 81.1771 111.969 83.744C118.083 86.3108 120.978 93.3473 118.435 99.4604Z" fill="${eyeColor}" />
      <path d="M229.54 119.624C226.997 125.738 219.979 128.612 213.865 126.046C207.751 123.479 204.856 116.442 207.399 110.329C209.942 104.216 216.961 101.341 223.075 103.908C229.189 106.475 232.083 113.511 229.54 119.624Z" fill="${eyeColor}" />
      <path d="M175.958 114.435C178.004 114.806 179.368 116.766 179.004 118.813L174.979 141.464C173.166 151.664 163.43 158.433 153.233 156.583C143.036 154.733 136.239 144.964 138.051 134.764L142.076 112.113C142.44 110.066 144.394 108.708 146.44 109.079L175.958 114.435Z" stroke="${eyeColor}" stroke-width="10" stroke-linejoin="round" />
    </svg>
  `;
}
