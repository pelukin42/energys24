/* ==========================================================================
   ENERGYS 24 — Visuales generados en código
   - Ilustraciones SVG por línea de servicio (tarjetas, galería, comparador)
   - Lienzo de la portada: corrientes de energía (ámbar) y agua (aqua)
   No necesitan imágenes: cuando lleguen fotos reales se indican en config.js.
   ========================================================================== */
(() => {
  'use strict';

  const SUN = ['#FFD43B', '#FF8A00'];
  const AQUA = ['#3FE0F2', '#0A8FBF'];
  let seq = 0;

  /* ---------- Piezas comunes ---------- */
  const defs = (u, night) => `
    <defs>
      <linearGradient id="${u}bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${night ? '#0B1A33' : '#14365C'}"/><stop offset="1" stop-color="${night ? '#050C18' : '#081A2E'}"/>
      </linearGradient>
      <linearGradient id="${u}sun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${SUN[0]}"/><stop offset="1" stop-color="${SUN[1]}"/></linearGradient>
      <linearGradient id="${u}aqua" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${AQUA[0]}"/><stop offset="1" stop-color="${AQUA[1]}"/></linearGradient>
      <linearGradient id="${u}pv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E6FC2"/><stop offset=".55" stop-color="#173F7A"/><stop offset="1" stop-color="#0F2C58"/></linearGradient>
      <linearGradient id="${u}wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9F0F7"/><stop offset="1" stop-color="#C9D6E4"/></linearGradient>
      <linearGradient id="${u}metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9FB2C6"/><stop offset=".45" stop-color="#EEF3F8"/><stop offset="1" stop-color="#8CA0B5"/></linearGradient>
      <radialGradient id="${u}glow"><stop offset="0" stop-color="${SUN[0]}" stop-opacity=".55"/><stop offset="1" stop-color="${SUN[0]}" stop-opacity="0"/></radialGradient>
      <radialGradient id="${u}aglow"><stop offset="0" stop-color="${AQUA[0]}" stop-opacity=".45"/><stop offset="1" stop-color="${AQUA[0]}" stop-opacity="0"/></radialGradient>
    </defs>`;

  const sky = (u) => `<rect width="400" height="250" fill="url(#${u}bg)"/>
    <g fill="#fff" opacity=".5"><circle cx="40" cy="30" r="1"/><circle cx="120" cy="18" r=".8"/><circle cx="210" cy="40" r="1"/><circle cx="380" cy="120" r=".8"/><circle cx="20" cy="110" r=".7"/></g>`;

  const ground = (y = 214) => `<path d="M0 ${y}c60-10 120-8 200-2s140 6 200-4V250H0z" fill="#0A223A"/><path d="M0 ${y + 14}c80-6 150-4 220 0s120 2 180-3V250H0z" fill="#07182B"/>`;

  const sun = (u, x, y, r = 22) => `
    <circle cx="${x}" cy="${y}" r="${r * 3}" fill="url(#${u}glow)"/>
    <g class="v-spin" style="transform-origin:${x}px ${y}px">
      ${Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        const x1 = x + Math.cos(a) * (r + 6), y1 = y + Math.sin(a) * (r + 6);
        const x2 = x + Math.cos(a) * (r + 15), y2 = y + Math.sin(a) * (r + 15);
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${SUN[0]}" stroke-width="3" stroke-linecap="round" opacity=".85"/>`;
      }).join('')}
    </g>
    <circle cx="${x}" cy="${y}" r="${r}" fill="url(#${u}sun)"/>`;

  const moon = (x, y) => `<circle cx="${x}" cy="${y}" r="18" fill="#F4E9C8"/><circle cx="${x + 8}" cy="${y - 5}" r="16" fill="#0B1A33"/>`;

  // Cuadrilátero dentro de un trapecio (para dibujar paneles sobre un techo en perspectiva).
  function pvGrid(u, TL, TR, BL, BR, cols, rows, gap = 0.035) {
    const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const P = (uu, vv) => lerp(lerp(TL, TR, uu), lerp(BL, BR, uu), vv);
    let out = '';
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const u0 = c / cols + gap / 2, u1 = (c + 1) / cols - gap / 2;
        const v0 = r / rows + gap, v1 = (r + 1) / rows - gap;
        const pts = [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)].map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
        const mid0 = P((u0 + u1) / 2, v0), mid1 = P((u0 + u1) / 2, v1);
        out += `<polygon points="${pts}" fill="url(#${u}pv)" stroke="#6FB2FF" stroke-opacity=".55" stroke-width=".8"/>`;
        out += `<line x1="${mid0[0].toFixed(1)}" y1="${mid0[1].toFixed(1)}" x2="${mid1[0].toFixed(1)}" y2="${mid1[1].toFixed(1)}" stroke="#6FB2FF" stroke-opacity=".35" stroke-width=".6"/>`;
      }
    }
    // destello que recorre los paneles
    const a = P(0, 0), b = P(0.18, 0), c2 = P(0.08, 1), d = P(-0.1, 1);
    out += `<polygon class="v-shine" points="${[a, b, c2, d].map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ')}" fill="#fff" opacity=".18"/>`;
    return out;
  }

  // Casa con techo a dos aguas visto de frente-perspectiva.
  function house(u, x, y, w, h, opts = {}) {
    const roofH = h * 0.62;
    const TL = [x + w * 0.16, y - roofH], TR = [x + w * 0.84, y - roofH];
    const BL = [x - w * 0.06, y + 4], BR = [x + w * 1.06, y + 4];
    const lit = opts.night ? '#FFD43B' : '#9ED8F5';
    const litOp = opts.night ? 0.95 : 0.55;
    let s = `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${u}wall)"/>
      <rect x="${x}" y="${y}" width="${w}" height="6" fill="#000" opacity=".12"/>
      <polygon points="${BL.join(',')} ${TL.join(',')} ${TR.join(',')} ${BR.join(',')}" fill="#2B4A6B"/>
      <polygon points="${BL.join(',')} ${TL.join(',')} ${TR.join(',')} ${BR.join(',')}" fill="none" stroke="#1A324D" stroke-width="2"/>
      <rect x="${x + w * 0.12}" y="${y + h * 0.28}" width="${w * 0.22}" height="${h * 0.3}" rx="2" fill="${lit}" opacity="${litOp}"/>
      <rect x="${x + w * 0.66}" y="${y + h * 0.28}" width="${w * 0.22}" height="${h * 0.3}" rx="2" fill="${lit}" opacity="${litOp}"/>
      <rect x="${x + w * 0.42}" y="${y + h * 0.42}" width="${w * 0.16}" height="${h * 0.58}" rx="2" fill="#1B3550"/>`;
    if (opts.panels) s += pvGrid(u, [TL[0] + 6, TL[1] + 5], [TR[0] - 6, TR[1] + 5], [BL[0] + 16, BL[1] - 7], [BR[0] - 16, BR[1] - 7], opts.cols || 5, 2);
    return s;
  }

  const flow = (d, color, w = 3, dash = '6 10') =>
    `<path d="${d}" fill="none" stroke="${color}" stroke-opacity=".25" stroke-width="${w + 3}" stroke-linecap="round"/>
     <path class="v-flow" d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${dash}"/>`;

  const drops = (x, y, n = 3) => Array.from({ length: n }, (_, i) =>
    `<path class="v-drop" style="animation-delay:${(i * 0.35).toFixed(2)}s" d="M${x + i * 7} ${y}c-2.5 3.5-3.5 5-3.5 6.5a3.5 3.5 0 0 0 7 0c0-1.5-1-3-3.5-6.5z" fill="${AQUA[0]}"/>`).join('');

  const tank = (u, x, y, w, h, fill = `url(#${u}metal)`) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2}" fill="${fill}"/>
     <rect x="${x + w * 0.18}" y="${y + h * 0.12}" width="${w * 0.12}" height="${h * 0.76}" rx="${w * 0.06}" fill="#fff" opacity=".45"/>`;

  const gauge = (x, y, r = 14) => `
    <circle cx="${x}" cy="${y}" r="${r}" fill="#F4F8FC" stroke="#0A1B2E" stroke-width="2.5"/>
    <path d="M${x - r * 0.7} ${y + r * 0.35}A${r * 0.75} ${r * 0.75} 0 0 1 ${x + r * 0.7} ${y + r * 0.35}" fill="none" stroke="${AQUA[1]}" stroke-width="2"/>
    <line class="v-needle" style="transform-origin:${x}px ${y}px" x1="${x}" y1="${y}" x2="${x + r * 0.55}" y2="${y - r * 0.45}" stroke="#E5322D" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="${x}" cy="${y}" r="2.2" fill="#0A1B2E"/>`;

  const pump = (u, x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <rect x="0" y="10" width="46" height="26" rx="8" fill="#1F7FB3"/>
      <rect x="4" y="13" width="38" height="4" rx="2" fill="#fff" opacity=".25"/>
      ${[8, 15, 22, 29, 36].map((xx) => `<rect x="${xx}" y="20" width="3" height="12" rx="1.5" fill="#0E4E73"/>`).join('')}
      <circle cx="54" cy="23" r="12" fill="url(#${u}metal)" stroke="#5D7287" stroke-width="1.5"/>
      <rect x="-2" y="34" width="70" height="6" rx="2" fill="#0E2540"/>
    </g>`;

  /* ---------- Escenas ---------- */
  const SCENES = {
    solar(u) {
      return `${sky(u)}${sun(u, 330, 58)}${ground()}
        ${house(u, 110, 140, 160, 76, { panels: true, cols: 5 })}
        <rect x="300" y="160" width="20" height="30" rx="3" fill="#E9F0F7"/><circle cx="310" cy="172" r="6" fill="#0A1B2E"/><rect x="306" y="181" width="8" height="3" fill="${SUN[0]}"/>
        ${flow('M268 176 H300', SUN[0], 3, '4 7')}
        ${flow('M300 75 C 270 85, 250 95, 230 102', SUN[0], 2.4, '3 9')}`;
    },
    hibrido(u) {
      return `${sky(u)}${moon(70, 50)}${ground()}
        ${house(u, 70, 140, 150, 76, { panels: true, cols: 4, night: true })}
        <g transform="translate(262 128)">
          <rect x="0" y="0" width="70" height="88" rx="10" fill="#E9F0F7"/>
          <rect x="22" y="-6" width="26" height="8" rx="3" fill="#C9D6E4"/>
          <rect x="10" y="12" width="50" height="64" rx="6" fill="#0A1B2E"/>
          ${[0, 1, 2, 3].map((i) => `<rect class="v-charge" style="animation-delay:${(i * 0.3).toFixed(1)}s" x="16" y="${62 - i * 15}" width="38" height="11" rx="3" fill="${i < 3 ? '#3DDC97' : AQUA[0]}"/>`).join('')}
        </g>
        ${flow('M220 182 H262', SUN[0], 3, '4 7')}
        <path d="M296 112l-9 14h7l-4 12 11-16h-7z" fill="${SUN[0]}"/>`;
    },
    termosolar(u) {
      return `${sky(u)}${sun(u, 62, 56)}${ground()}
        ${house(u, 110, 150, 200, 66)}
        <path d="M184 56 H150 V 120" fill="none" stroke="${AQUA[0]}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M300 56 H330 V 186 H310" fill="none" stroke="#FF6A3D" stroke-width="4" stroke-linejoin="round"/>
        ${flow('M300 56 H330 V 186 H310', '#FFB15C', 2.2, '4 7')}
        <g transform="translate(160 64)">
          <polygon points="0,60 30,0 130,0 100,60" fill="#0F2C58" stroke="#6FB2FF" stroke-opacity=".5"/>
          ${Array.from({ length: 10 }, (_, i) => `<line x1="${8 + i * 10}" y1="58" x2="${36 + i * 10}" y2="3" stroke="#9FB2C6" stroke-width="3" stroke-linecap="round" opacity=".85"/>`).join('')}
          <rect x="22" y="-22" width="118" height="24" rx="12" fill="url(#${u}metal)"/>
          <rect x="30" y="-17" width="102" height="5" rx="2.5" fill="#fff" opacity=".5"/>
        </g>
        <g class="v-steam" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"><path d="M344 120c-6-8 6-12 0-20"/><path d="M356 124c-6-8 6-12 0-20"/></g>`;
    },
    presion(u) {
      return `${sky(u)}${ground()}
        <rect x="236" y="70" width="128" height="146" fill="url(#${u}wall)"/>
        <polygon points="226,74 300,34 374,74" fill="#2B4A6B"/>
        <rect x="256" y="96" width="34" height="30" rx="2" fill="#9ED8F5" opacity=".55"/><rect x="312" y="96" width="34" height="30" rx="2" fill="#9ED8F5" opacity=".55"/>
        <rect x="256" y="150" width="34" height="30" rx="2" fill="#9ED8F5" opacity=".55"/><rect x="312" y="150" width="30" height="66" rx="2" fill="#1B3550"/>
        ${tank(u, 46, 104, 44, 108, `url(#${u}aqua)`)}
        ${pump(u, 104, 172, 0.95)}
        ${gauge(122, 150, 15)}
        <path d="M90 196 H104 M168 192 H200 V 112 H256" fill="none" stroke="#5D7287" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        ${flow('M168 192 H200 V 112 H256', AQUA[0], 2.5, '4 8')}`;
    },
    pozo(u) {
      return `${sky(u)}${sun(u, 330, 46, 18)}
        <rect x="0" y="120" width="400" height="130" fill="#3A2A1E"/>
        <path d="M0 120h400v14H0z" fill="#2F6B3A"/>
        <path d="M0 165c80 8 160-6 240 2s120 4 160-2v8c-60 6-90 2-160-2s-160 8-240-2z" fill="#4B3626"/>
        <path d="M0 205c90 6 170-6 250 0s110 2 150-2v45H0z" fill="url(#${u}aqua)" opacity=".75"/>
        <path class="v-wave" d="M0 210c25-5 50 5 75 0s50-5 75 0 50 5 75 0 50-5 75 0 50 5 75 0 50-5 75 0" fill="none" stroke="#B8F4FC" stroke-width="2" opacity=".6"/>
        <rect x="90" y="110" width="34" height="140" fill="#1E140D"/>
        <rect x="97" y="118" width="20" height="132" fill="#0D0906"/>
        <rect x="100" y="212" width="14" height="32" rx="6" fill="#1F7FB3"/><rect x="103" y="216" width="8" height="6" rx="2" fill="#B8F4FC" opacity=".6"/>
        <line x1="107" y1="212" x2="107" y2="80" stroke="#5D7287" stroke-width="5"/>
        ${flow('M107 212 V 80 H 210 V 96', AQUA[0], 2.5, '4 8')}
        <g transform="translate(196 34)"><rect x="0" y="16" width="56" height="54" rx="8" fill="#E9F0F7"/><rect x="0" y="16" width="56" height="10" rx="5" fill="#C9D6E4"/><path d="M6 70 L0 86 M50 70 L56 86" stroke="#9FB2C6" stroke-width="4"/></g>
        <g transform="translate(280 70)">
          <polygon points="0,30 18,0 82,0 64,30" fill="url(#${u}pv)" stroke="#6FB2FF" stroke-opacity=".6"/>
          <line x1="41" y1="0" x2="32" y2="30" stroke="#6FB2FF" stroke-opacity=".5"/><line x1="9" y1="15" x2="73" y2="15" stroke="#6FB2FF" stroke-opacity=".5"/>
          <rect x="36" y="30" width="5" height="22" fill="#9FB2C6"/>
        </g>
        ${flow('M318 122 C 300 140, 140 140, 112 150', SUN[0], 2, '3 8')}`;
    },
    piscina(u) {
      return `${sky(u)}${sun(u, 340, 50, 20)}
        <rect x="0" y="150" width="400" height="100" fill="#D9E3EC"/>
        <polygon points="40,232 90,160 310,160 360,232" fill="url(#${u}aqua)"/>
        <polygon points="40,232 90,160 310,160 360,232" fill="none" stroke="#F4F8FC" stroke-width="5"/>
        <g opacity=".7" stroke="#E6FCFF" stroke-width="2" fill="none" stroke-linecap="round">
          <path class="v-wave" d="M100 180c12-5 24 5 36 0s24-5 36 0 24 5 36 0 24-5 36 0 24 5 36 0"/>
          <path class="v-wave v-wave--2" d="M80 205c14-5 28 5 42 0s28-5 42 0 28 5 42 0 28-5 42 0 28 5 42 0"/>
        </g>
        <path d="M70 160 V 110" stroke="#9FB2C6" stroke-width="4"/><path d="M84 160 V 110 M70 124 H84 M70 140 H84" stroke="#9FB2C6" stroke-width="4"/>
        <g transform="translate(176 66)">
          <rect x="-6" y="70" width="190" height="10" rx="3" fill="#8CA0B5"/>
          ${tank(u, 120, 0, 40, 72, `url(#${u}metal)`)}
          <circle cx="140" cy="8" r="7" fill="#0A1B2E"/>${gauge(140, 8, 6)}
        </g>
        ${pump(u, 196, 102, 0.85)}
        <path d="M250 124 H296 M196 130 H170 V 166" fill="none" stroke="#5D7287" stroke-width="5" stroke-linejoin="round"/>
        ${flow('M196 130 H170 V 166', AQUA[1], 2.4, '4 7')}`;
    },
    planta(u) {
      return `${sky(u)}
        <g class="v-cloud" fill="#3A5272"><circle cx="300" cy="46" r="22"/><circle cx="330" cy="40" r="26"/><circle cx="360" cy="50" r="18"/><rect x="290" y="46" width="80" height="22" rx="11"/></g>
        <path class="v-bolt" d="M332 70l-12 20h9l-6 16 16-22h-9z" fill="${SUN[0]}"/>
        <g stroke="${AQUA[0]}" stroke-width="2" opacity=".5" stroke-linecap="round"><line x1="300" y1="76" x2="296" y2="88"/><line x1="350" y1="76" x2="346" y2="88"/><line x1="365" y1="74" x2="361" y2="84"/></g>
        ${ground()}
        ${house(u, 34, 146, 130, 70, { night: true })}
        <g transform="translate(206 132)">
          <rect x="0" y="12" width="138" height="72" rx="10" fill="#E9F0F7"/>
          <rect x="0" y="12" width="138" height="14" rx="7" fill="#C9D6E4"/>
          ${Array.from({ length: 7 }, (_, i) => `<rect x="${12 + i * 10}" y="36" width="5" height="36" rx="2.5" fill="#9FB2C6"/>`).join('')}
          <rect x="88" y="34" width="38" height="28" rx="4" fill="#0A1B2E"/>
          <circle cx="98" cy="48" r="4" fill="#3DDC97" class="v-charge"/><rect x="106" y="44" width="14" height="8" rx="2" fill="${SUN[0]}"/>
          <rect x="8" y="84" width="20" height="6" rx="2" fill="#0E2540"/><rect x="110" y="84" width="20" height="6" rx="2" fill="#0E2540"/>
          <rect x="124" y="0" width="8" height="14" rx="2" fill="#5D7287"/>
        </g>
        <g transform="translate(172 150)"><rect x="0" y="0" width="22" height="34" rx="3" fill="#C9D6E4"/><rect x="5" y="6" width="12" height="14" rx="2" fill="#0A1B2E"/><path d="M11 8l-3 5h3l-2 5 5-7h-3z" fill="${SUN[0]}"/></g>
        ${flow('M206 172 H194', SUN[0], 3, '3 5')}
        ${flow('M172 168 H164', SUN[0], 3, '3 5')}`;
    },
    calentador(u) {
      return `${sky(u)}${ground()}
        <rect x="40" y="40" width="320" height="176" rx="6" fill="#1A3655" opacity=".55"/>
        ${[60, 100, 140, 180].map((y) => `<line x1="40" y1="${y}" x2="360" y2="${y}" stroke="#244B73" stroke-width="1" opacity=".6"/>`).join('')}
        ${tank(u, 150, 52, 74, 150)}
        <rect x="150" y="196" width="74" height="10" rx="4" fill="#8CA0B5"/>
        <rect x="174" y="98" width="26" height="40" rx="5" fill="#0A1B2E"/>
        <rect x="183" y="104" width="8" height="26" rx="4" fill="#24496F"/><rect class="v-heat" x="183" y="112" width="8" height="18" rx="4" fill="#FF6A3D"/>
        <path d="M168 52 V 30 H 120 V 210" fill="none" stroke="${AQUA[0]}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M206 52 V 30 H 290 V 120" fill="none" stroke="#FF6A3D" stroke-width="5" stroke-linejoin="round"/>
        ${flow('M206 52 V 30 H 290 V 120', '#FFB15C', 2.4, '4 7')}
        <rect x="276" y="118" width="30" height="6" rx="3" fill="#E9F0F7"/>${drops(280, 130, 3)}
        <g class="v-steam" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".55"><path d="M240 100c-6-8 6-12 0-20"/><path d="M252 104c-6-8 6-12 0-20"/></g>`;
    },
    mantenimiento(u) {
      return `${sky(u)}${ground()}
        <g transform="translate(78 62)" class="v-gear">
          <circle cx="60" cy="60" r="44" fill="none" stroke="url(#${u}sun)" stroke-width="16" stroke-dasharray="14 9.1"/>
          <circle cx="60" cy="60" r="34" fill="#0F2C58" stroke="url(#${u}sun)" stroke-width="5"/>
          <circle cx="60" cy="60" r="12" fill="url(#${u}sun)"/>
        </g>
        <path d="M150 196 210 136M206 118a22 22 0 0 0 28 28l-10-10 6-12 12-6 10 10a22 22 0 0 0-28-28z" fill="none" stroke="#E9F0F7" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
        <g transform="translate(250 54)">
          <rect x="0" y="8" width="104" height="146" rx="10" fill="#E9F0F7"/>
          <rect x="30" y="0" width="44" height="18" rx="5" fill="#9FB2C6"/>
          ${[0, 1, 2, 3].map((i) => `<g transform="translate(14 ${36 + i * 28})"><rect width="16" height="16" rx="4" fill="${i < 3 ? '#3DDC97' : '#C9D6E4'}"/>${i < 3 ? '<path d="M4 8l3 3 6-6" fill="none" stroke="#0A1B2E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' : ''}<rect x="24" y="5" width="${48 - i * 6}" height="6" rx="3" fill="#9FB2C6"/></g>`).join('')}
        </g>`;
    }
  };

  /* Ilustración de una escena. opts: { panels:false } para la versión «antes» del comparador. */
  function art(name, opts = {}) {
    const u = `v${++seq}-`;
    const night = name === 'hibrido' || name === 'planta';
    let body;
    if (name === 'solar' && opts.before) {
      body = `${sky(u)}<g opacity=".55">${sun(u, 330, 58)}</g>${ground()}
        ${house(u, 110, 140, 160, 76, { panels: false })}
        <rect x="300" y="160" width="20" height="30" rx="3" fill="#E9F0F7"/><circle cx="310" cy="172" r="6" fill="#0A1B2E"/><rect x="306" y="181" width="8" height="3" fill="#E5322D"/>`;
    } else {
      body = (SCENES[name] || SCENES.solar)(u);
    }
    return `<svg class="art" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${defs(u, night)}${body}</svg>`;
  }

  /* ==========================================================================
     Portada: corrientes de energía y agua (canvas)
     ========================================================================== */
  function initHeroFlow(canvas, host) {
    if (!canvas || !canvas.getContext) return;
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1, lines = [], raf = 0, visible = true, mx = 0.5, my = 0.5, t0 = performance.now();

    function build() {
      const r = host.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = W < 700 ? 7 : 11;
      lines = Array.from({ length: n }, (_, i) => {
        const water = i % 3 === 1;
        return {
          water,
          y: H * (0.18 + (0.72 * i) / (n - 1)),
          amp: 14 + Math.random() * 26,
          freq: 0.0035 + Math.random() * 0.004,
          phase: Math.random() * Math.PI * 2,
          speed: 0.25 + Math.random() * 0.35,
          depth: 0.4 + Math.random() * 0.6,
          pulses: Array.from({ length: 2 + (Math.random() < 0.5 ? 1 : 0) }, () => ({ x: Math.random(), v: 0.04 + Math.random() * 0.06 }))
        };
      });
    }

    const yAt = (L, x, t) => L.y + Math.sin(x * L.freq + L.phase + t * L.speed) * L.amp + (my - 0.5) * 30 * L.depth;

    function draw(now) {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      for (const L of lines) {
        const c = L.water ? '63,224,242' : '255,190,40';
        const off = (mx - 0.5) * 40 * L.depth;
        ctx.beginPath();
        for (let x = -20; x <= W + 20; x += 14) {
          const y = yAt(L, x + off, t);
          if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${c},${0.08 + L.depth * 0.1})`;
        ctx.lineWidth = 1 + L.depth;
        ctx.stroke();
        for (const p of L.pulses) {
          if (!reduce) { p.x += p.v * 0.016 * (L.water ? 0.7 : 1); if (p.x > 1.08) p.x = -0.08; }
          const px = p.x * W, py = yAt(L, px + off, t);
          const g = ctx.createRadialGradient(px, py, 0, px, py, 16 + L.depth * 10);
          g.addColorStop(0, `rgba(255,255,255,${0.85 * L.depth})`);
          g.addColorStop(0.25, `rgba(${c},${0.7 * L.depth})`);
          g.addColorStop(1, `rgba(${c},0)`);
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(px, py, 16 + L.depth * 10, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      draw(now);
    }

    build();
    if (reduce) { draw(performance.now()); return; }
    window.addEventListener('resize', () => { build(); }, { passive: true });
    host.addEventListener('pointermove', (e) => {
      const r = host.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height;
    }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(host);
    }
    raf = requestAnimationFrame(loop);
  }

  window.E24Visuals = { art, initHeroFlow };
})();
