/** Small pixel landscapes for entries in Min’s World. */
export function renderBanner(type, isDark = false) {
  const scenes = {
    'geometric-grid': { sky: '#c9e2e7', hill: '#abc998', grass: '#7caa7a', roof: '#c27f84', feature: 'gate' },
    'abstract-curves': { sky: '#f0d9d8', hill: '#c7d7a0', grass: '#99b67c', roof: '#a88bb1', feature: 'book' },
    'transit-pattern': { sky: '#d4ddef', hill: '#b8cdb6', grass: '#8db3a0', roof: '#a68972', feature: 'sign' },
    'math-grid': { sky: '#dadcf0', hill: '#aec8bb', grass: '#86a795', roof: '#9b88b0', feature: 'badge' },
  };
  const c = scenes[type] || scenes['geometric-grid'];
  const sky = isDark ? '#33435f' : c.sky;
  const trees = [12, 131, 144].map((x, i) => `<g transform="translate(${x} ${38 + i * 3})"><path fill="#738861" d="M7 0h8v4h4v5h4v13H0V9h4V4h3z"/><path fill="#9db880" d="M7 0h8v4h4v5h-7v6H0V9h4V4h3z"/><path fill="#8e7557" d="M9 20h5v21H9z"/></g>`).join('');
  const features = {
    gate: `<path fill="#ddbb8b" d="M62 32h36v4H62zm-4 4h8v39h-8zm36 0h8v39h-8z"/><path fill="#805e4b" d="M62 36h4v39h-4zm36 0h4v39h-4z"/><path fill="#f4e9bd" d="M69 42h22v24H69z"/><path fill="#73987c" d="M78 46h4v4h5v7h-4v4h-6v-4h-4v-7h5z"/><path fill="#f7f2d9" d="M77 52h3v3h3v-3h3v3h-3v3h-3v-3h-3z"/>`,
    book: `<path fill="#8f644f" d="M50 66h60v4H50zm5 4h4v8h-4zm46 0h4v8h-4z"/><path fill="#b57a83" d="M59 45h21v3h21v17H80v-2H59z"/><path fill="#fff2d3" d="M61 43h16v3h3v15h-3v-2H61zm22 3h16v13H86v2h-3z"/><path fill="#d0b490" d="M65 49h9v2h-9zm0 5h9v2h-9zm23-5h7v2h-7zm0 5h7v2h-7z"/>`,
    badge: `<path fill="#957155" d="M60 31h40v39H60z"/><path fill="#ffecd0" d="M63 34h34v32H63z"/><path fill="#b987a1" d="M76 38h8v3h3v9H73v-9h3z"/><path fill="#6b8d79" d="M70 51h20v3h3v4H67v-4h3z"/><path fill="#cfb889" d="M70 61h20v2H70z"/><path fill="#d7ad81" d="M65 70h5v7h-5zm25 0h5v7h-5z"/>`,
    sign: `<path fill="#947153" d="M77 36h6v42h-6z"/><path fill="#f7e0ad" d="M52 38h50v5h5v5h-5v5H52z"/><path fill="#77957a" d="M61 43h29v5H61z"/><path fill="#f1c9bd" d="M61 55h46v14H61l-6-7z"/><path fill="#ae7484" d="M67 60h29v4H67z"/>`,
  };
  return `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">
    <rect width="160" height="90" fill="${sky}"/><path fill="#fff4cc" d="M115 10h10v10h-10z"/>
    <path fill="#fff9ed" opacity=".8" d="M20 18h8v-4h13v4h12v6H20zm70 12h9v-4h11v4h8v5H90z"/>
    <path fill="${c.hill}" d="M0 56h15V46h20V40h20v10h18v10h25V48h18V40h22v11h22v39H0z"/>
    <path fill="${c.grass}" d="M0 71h160v19H0z"/>
    ${trees}${features[c.feature]}
    <path fill="#e4cf9e" d="M72 78h18v4h14v4h14v4H58v-4h8v-4h6z"/>
    <path fill="#d68c9b" d="M27 74h3v3h-3zm4-3h3v3h-3zm93 9h3v3h-3z"/>
    <path fill="#fff0bd" d="M30 74h3v3h-3zm88-6h3v3h-3z"/>
  </svg>`;
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
