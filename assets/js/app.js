/* ==========================================================================
   ENERGYS 24 — Lógica del sitio
   Los datos (contacto, servicios, galería, FAQ…) viven en assets/js/config.js
   ========================================================================== */
(() => {
  'use strict';

  const C = window.E24_CONFIG;
  if (!C) { console.error('Falta assets/js/config.js'); return; }
  const V = window.E24Visuals;

  /* ---------- Utilidades ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const digits = (s) => String(s || '').replace(/\D/g, '');
  const icon = (name) => `<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
  const safe = (fn) => { try { return fn(); } catch (e) { return null; } };
  const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  const has = (v) => v != null && v !== '' && !(Array.isArray(v) && !v.length);
  const TBC = 'Por confirmar';
  const WATER = ['agua', 'piscinas'];
  const toneOf = (svc) => (WATER.includes(svc.categoria) ? 'aqua' : 'sun');

  /* ---------- Origen de la visita (UTM de anuncios) ----------
     Se agrega al final de los mensajes armados: (ref: fuente/campaña/anuncio). */
  const clean = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  const ref = (() => {
    const p = new URLSearchParams(location.search);
    const parts = ['utm_source', 'utm_campaign', 'utm_content'].map((k) => clean(p.get(k))).filter(Boolean);
    if (parts.length) { safe(() => sessionStorage.setItem('e24-ref', parts.join('/'))); return parts.join('/'); }
    return safe(() => sessionStorage.getItem('e24-ref')) || '';
  })();
  const sign = (msg) => `${msg}\n\n_${C.firmaWhatsApp}_${ref ? `\n(ref: ${ref})` : ''}`;

  const waUrl = (msg) => `https://wa.me/${digits(C.whatsapp)}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
  const telUrl = `tel:${String(C.telefono).replace(/[^\d+]/g, '')}`;
  const mailUrl = (subject, body) =>
    `mailto:${C.correo}?subject=${encodeURIComponent(subject || '')}&body=${encodeURIComponent((body || '').replace(/\n/g, '\r\n'))}`;

  /* ---------- Aviso emergente ---------- */
  let toastTimer;
  function toast(msg, isError) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.toggle('is-error', !!isError);
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 4000);
  }

  /* ==========================================================================
     Datos del negocio en la página
     ========================================================================== */
  function bindStatic() {
    $$('[data-bind]').forEach((el) => {
      const v = C[el.dataset.bind];
      if (has(v)) el.textContent = v;
      else if (C.demo) { el.textContent = TBC; el.classList.add('tbc'); }
      else el.hidden = true;
    });
    $$('[data-if]').forEach((el) => { if (!has(C[el.dataset.if])) el.hidden = true; });
    $$('[data-demo]').forEach((el) => { el.hidden = !C.demo; });
    $$('[data-wa]').forEach((el) => { el.href = waUrl(el.dataset.msg || C.mensajeWhatsApp); });
    $$('[data-tel]').forEach((el) => { el.href = telUrl; });
    $$('[data-tel2]').forEach((el) => { el.href = `tel:${String(C.telefono2 || '').replace(/[^\d+]/g, '')}`; });
    $$('[data-mail]').forEach((el) => { el.href = `mailto:${C.correo}`; });
    $('#year').textContent = new Date().getFullYear();

    if (digits(C.telefono) === digits(C.whatsapp)) {
      $('#card-tel').remove();
      $('#wa-label').textContent = 'WhatsApp y llamadas';
    }

    // Horario
    const h = $('#horario');
    if (Array.isArray(C.horario) && C.horario.length) {
      h.className = 'hours';
      h.innerHTML = C.horario.map(([d, t]) => `<div><span>${esc(d)}</span><strong>${esc(t)}</strong></div>`).join('');
    } else {
      h.className = 'hours hours--none';
      h.textContent = C.demo ? `${TBC} · consulte por WhatsApp.` : 'Consulte disponibilidad por WhatsApp.';
    }

    // Datos de la empresa (Nosotros)
    const facts = [
      ['Ubicación', C.direccion],
      ['Zona de cobertura', C.zonaCobertura],
      ['Años de experiencia', C.anios],
      ['Cédula jurídica', C.cedulaJuridica]
    ].filter(([, v]) => has(v) || C.demo);
    $('#facts').innerHTML = facts.map(([k, v]) => `<div><dt>${k}</dt><dd${has(v) ? '' : ' class="tbc"'}>${esc(has(v) ? v : TBC)}</dd></div>`).join('');

    // Redes sociales
    const NETWORKS = { facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', linkedin: 'LinkedIn' };
    const socialsHtml = Object.keys(NETWORKS)
      .filter((k) => C.redes && C.redes[k])
      .map((k) => `<a href="${esc(C.redes[k])}" target="_blank" rel="noopener noreferrer" aria-label="${NETWORKS[k]} de ${esc(C.nombre)}" title="${NETWORKS[k]}">${icon(k)}</a>`)
      .join('');
    $$('[data-socials]').forEach((box) => { box.innerHTML = socialsHtml; if (!socialsHtml) box.hidden = true; });
    if (!socialsHtml) { const f = $('.follow'); if (f) f.hidden = true; }

    // Mapa
    const q = encodeURIComponent(C.mapaConsulta || C.direccion);
    const mapFrame = $('#map-frame'), mapStatic = $('#map-static');
    if (mapFrame) mapFrame.src = `https://www.google.com/maps?q=${q}&z=${C.mapaZoom || 15}&output=embed`;
    if (mapStatic) mapStatic.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
    $('#map-google').href = `https://www.google.com/maps/search/?api=1&query=${q}`;
    $('#map-waze').href = `https://waze.com/ul?q=${q}&navigate=yes`;

    $('#footer-services').innerHTML = C.servicios.map((s) => `<li><a href="#servicios">${esc(s.nombre)}</a></li>`).join('');

    // Datos estructurados (SEO)
    const biz = {
      '@context': 'https://schema.org',
      '@type': 'HomeAndConstructionBusiness',
      name: C.nombre,
      legalName: C.razonSocial,
      description: 'Electromecánica: sistemas solares, bombeo de agua, equipos para piscinas, plantas eléctricas y calentadores de agua. Venta, instalación y mantenimiento.',
      telephone: C.telefono,
      ...(C.telefono2 ? { contactPoint: [C.telefono, C.telefono2].map((t) => ({ '@type': 'ContactPoint', telephone: t, contactType: 'customer service', areaServed: 'CR', availableLanguage: 'es' })) } : {}),
      address: { '@type': 'PostalAddress', addressLocality: 'Desamparados', addressRegion: 'San José', addressCountry: 'CR' },
      areaServed: 'CR',
      sameAs: Object.values(C.redes || {}).filter(Boolean),
      makesOffer: C.servicios.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.nombre, description: s.descripcion } }))
    };
    if (C.correo) biz.email = C.correo;
    if (C.sitioWeb) { biz.url = C.sitioWeb; biz.image = `${C.sitioWeb}/assets/img/og-image.jpg`; biz.logo = `${C.sitioWeb}/assets/img/icon-512.png`; }
    const ld = [biz, {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: C.faq.map((f) => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } }))
    }];
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }

  /* ==========================================================================
     Cifras animadas + marquesina
     ========================================================================== */
  function renderStats() {
    const stats = C.estadisticas.slice();
    if (has(C.anios)) stats.unshift({ valor: Number(C.anios), prefijo: '+', etiqueta: 'años de experiencia' });
    $('#stats').innerHTML = stats.slice(0, 4).map((s) => {
      const num = s.valor != null
        ? `${s.prefijo ? `<em>${esc(s.prefijo)}</em>` : ''}<span data-count="${Number(s.valor)}">${Number(s.valor)}</span>${esc(s.sufijo || '')}`
        : esc(s.texto);
      return `<li class="stat"><span class="stat__num${s.valor != null ? '' : ' stat__num--text'}">${num}</span><span class="stat__label">${esc(s.etiqueta)}</span></li>`;
    }).join('');

    if (reduceMotion || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      $$('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count);
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / 1400);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        el.textContent = '0';
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    io.observe($('#stats'));
  }

  function renderMarquee() {
    const items = ['Venta', 'Instalación', 'Mantenimiento', ...C.servicios.map((x) => x.nombre)];
    const group = `<div class="marquee__group">${items.map((t) => `<span class="marquee__item">${esc(t)}</span>`).join('')}</div>`;
    $('#marquee').innerHTML = group + group;
  }

  /* ==========================================================================
     Servicios + filtros
     ========================================================================== */
  const media = (img, arte, alt) => (img
    ? `<img src="${esc(img)}" alt="${esc(alt || '')}" loading="lazy" width="640" height="400">`
    : (V ? V.art(arte) : ''));

  function bindFilters(box, grid, itemSel, attr) {
    box.addEventListener('click', (e) => {
      const btn = e.target.closest('.chipbtn');
      if (!btn) return;
      $$('.chipbtn', box).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      $$(itemSel, grid).forEach((card) => {
        const show = btn.dataset.cat === 'todos' || card.dataset[attr] === btn.dataset.cat;
        card.hidden = !show;
        if (show) { card.classList.add('in'); card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop'); }
      });
    });
  }

  function renderServices() {
    const used = new Set(C.servicios.map((s) => s.categoria));
    const cats = C.categorias.filter((c) => c.id === 'todos' || used.has(c.id));
    $('#filters').innerHTML = cats.map((c, i) =>
      `<button type="button" class="chipbtn" data-cat="${esc(c.id)}" aria-pressed="${i === 0}">${esc(c.nombre)}</button>`).join('');

    $('#svc-grid').innerHTML = C.servicios.map((s, i) => `
      <article class="svc reveal" style="--d:${(i % 3) * 0.07}s" data-cat="${esc(s.categoria)}" data-tone="${toneOf(s)}">
        <div class="svc__media">${media(s.imagen, s.arte, s.nombre)}</div>
        <div class="svc__icon">${icon(s.icono)}</div>
        <h3>${esc(s.nombre)}</h3>
        <p>${esc(s.descripcion)}</p>
        <ul class="svc__list">${s.puntos.map((p) => `<li>${icon('check')}<span>${esc(p)}</span></li>`).join('')}</ul>
        <div class="svc__actions">
          <button type="button" class="btn btn--primary btn--sm" data-quote="${esc(s.id)}">Cotizar ${icon('arrow')}</button>
          <a class="btn btn--outline btn--sm" href="${waUrl(`Hola ${C.nombre}, quisiera información sobre: ${s.nombre}.`)}" target="_blank" rel="noopener">${icon('whatsapp')}WhatsApp</a>
        </div>
      </article>`).join('');

    bindFilters($('#filters'), $('#svc-grid'), '.svc', 'cat');

    $('#svc-grid').addEventListener('pointermove', (e) => {
      const c = e.target.closest('.svc');
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', `${e.clientX - r.left}px`);
      c.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  }

  /* ==========================================================================
     Cotizador + visita técnica
     ========================================================================== */
  const svcById = Object.fromEntries(C.servicios.map((s) => [s.id, s]));
  const qForm = $('#quote-form');
  let lastSig = '';

  const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return isoDate(d); };
  const niceDate = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  function renderPicks() {
    $('#quote-picks').innerHTML = C.servicios.map((s) => `
      <div class="pick" data-id="${esc(s.id)}">
        <label class="pick__head">
          <input type="checkbox" name="svc" value="${esc(s.id)}">
          <span class="pick__icon">${icon(s.icono)}</span>
          <span class="pick__name">${esc(s.nombre)}</span>
          <span class="pick__check">${icon('check')}</span>
        </label>
        <div class="pick__more" inert>
          <div class="pick__inner">
            <span class="lbl">Tipo de trabajo</span>
            <div class="chips">${C.tiposTrabajo.map((t) => `<label class="chip"><input type="checkbox" value="${esc(t)}"><span>${esc(t)}</span></label>`).join('')}</div>
          </div>
        </div>
      </div>`).join('');
  }

  function setPick(pick, on) {
    pick.classList.toggle('is-on', on);
    pick.querySelector('.pick__more').toggleAttribute('inert', !on);
  }

  function selectService(id, opts = {}) {
    const pick = $(`.pick[data-id="${CSS.escape(id)}"]`, qForm);
    if (!pick) return;
    const cb = $('input[name="svc"]', pick);
    if (!cb.checked) { cb.checked = true; setPick(pick, true); }
    $('#err-svc').hidden = true;
    updateSummary();
    $('#cotizador').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    toast(opts.msg || `«${svcById[id].nombre}» agregado a su cotización.`);
  }

  function readQuote() {
    const items = $$('.pick', qForm)
      .filter((p) => $('input[name="svc"]', p).checked)
      .map((p) => ({ s: svcById[p.dataset.id], tipos: $$('.chip input:checked', p).map((i) => i.value) }));
    const f = qForm.elements;
    const v = (n) => (f[n].value || '').trim();
    const visita = f.visita.value === 'Sí';
    return {
      items,
      inmueble: f.inmueble.value,
      urgencia: f.urgencia.value,
      visita, fecha: visita ? v('fecha') : '', franja: visita ? f.franja.value : '',
      nombre: v('nombre'), telefono: v('telefono'), correo: v('correo'),
      provincia: v('provincia'), zona: v('zona'), detalle: v('detalle')
    };
  }

  const place = (q) => [q.zona, q.provincia].filter(Boolean).join(', ');

  function updateSummary() {
    const q = readQuote();
    $('#sum-count').textContent = q.items.length;
    $('#sum-empty').hidden = q.items.length > 0;
    $('#visit-fields').hidden = !q.visita;

    const sig = JSON.stringify(q.items.map((i) => [i.s.id, i.tipos]));
    if (sig !== lastSig) {
      lastSig = sig;
      $('#sum-list').innerHTML = q.items.map((i) =>
        `<li class="sitem"><strong>${esc(i.s.nombre)}</strong><span>${i.tipos.length ? esc(i.tipos.join(', ')) : 'Tipo de trabajo por definir'}</span></li>`).join('');
    }

    const meta = [['Propiedad', q.inmueble], ['Urgencia', q.urgencia], ['Visita técnica', q.visita ? 'Sí' : 'No, solo cotización']];
    if (q.visita && q.fecha) meta.push(['Fecha preferida', `${niceDate(q.fecha)} (${q.franja.toLowerCase()})`]);
    else if (q.visita) meta.push(['Horario', q.franja]);
    if (place(q)) meta.push(['Ubicación', place(q)]);
    $('#sum-meta').innerHTML = meta.map(([k, val]) => `<div><dt>${k}</dt><dd>${esc(val)}</dd></div>`).join('');
  }

  function quoteMessage(q) {
    const L = [`Hola ${C.nombre}, quisiera solicitar una cotización.`, '', '*Servicios*'];
    q.items.forEach((i) => L.push(`• ${i.s.nombre}${i.tipos.length ? ` — ${i.tipos.join(', ')}` : ''}`));
    L.push('', `*Propiedad:* ${q.inmueble}`, `*Urgencia:* ${q.urgencia}`);
    if (q.visita) L.push(`*Visita técnica:* sí${q.fecha ? `, ${niceDate(q.fecha)}` : ''} (${q.franja.toLowerCase()})`);
    else L.push('*Visita técnica:* no, solo cotización');
    if (place(q)) L.push(`*Ubicación:* ${place(q)}`);
    if (q.detalle) L.push(`*Detalles:* ${q.detalle}`);
    L.push('', '*Mis datos*', `Nombre: ${q.nombre}`);
    if (q.telefono) L.push(`Teléfono: ${q.telefono}`);
    if (q.correo) L.push(`Correo: ${q.correo}`);
    return sign(L.join('\n'));
  }

  /* ---------- Validación compartida ---------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function check(rules) {
    let first = null;
    rules.forEach((r) => {
      const bad = !r.ok;
      const e = $(`#${r.err}`);
      if (e) e.hidden = !bad;
      if (r.el) r.el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad && !first) first = r.focus || r.el;
    });
    if (first) {
      toast('Revise los campos marcados.', true);
      first.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      first.focus({ preventScroll: true });
    }
    return !first;
  }

  function phoneOk(value, email, needContact) {
    if (value) return digits(value).length >= 8;
    return !(needContact && !email);
  }

  function validateQuote(needContact) {
    const q = readQuote();
    const f = qForm.elements;
    const ok = check([
      { ok: q.items.length > 0, err: 'err-svc', focus: $('#quote-picks input') },
      { ok: !q.fecha || q.fecha >= tomorrow(), err: 'err-fecha', el: f.fecha },
      { ok: q.nombre.length >= 2, err: 'err-nombre', el: f.nombre },
      { ok: phoneOk(q.telefono, q.correo, needContact), err: 'err-telefono', el: f.telefono },
      { ok: !q.correo || EMAIL_RE.test(q.correo), err: 'err-correo', el: f.correo }
    ]);
    return ok ? q : null;
  }

  /* ---------- Envío ---------- */
  function openExternal(url) {
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    document.body.appendChild(a); a.click(); a.remove();
  }
  function openWhatsApp(msg) { openExternal(waUrl(msg)); toast('Abriendo WhatsApp…'); }
  function openMail(subject, msg) {
    window.location.href = mailUrl(subject, msg.replace(/[*_]/g, ''));
    toast('Abriendo su programa de correo…');
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand && document.execCommand('copy');
      ta.remove();
      if (!ok) throw e;
    }
  }

  async function postForm(btn, payload) {
    btn.disabled = true;
    try {
      const r = await fetch(C.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      toast('¡Solicitud enviada! Le contactaremos pronto.');
      return true;
    } catch (e) {
      toast('No pudimos enviar la solicitud. Inténtelo por WhatsApp.', true);
      return false;
    } finally {
      btn.disabled = false;
    }
  }

  function initQuote() {
    renderPicks();
    qForm.elements.fecha.min = tomorrow();

    qForm.addEventListener('change', (e) => {
      const t = e.target;
      if (t.name === 'svc') { setPick(t.closest('.pick'), t.checked); $('#err-svc').hidden = true; }
      updateSummary();
    });
    qForm.addEventListener('input', (e) => {
      const n = e.target.name;
      const er = n && $(`#err-${n}`);
      if (er) { er.hidden = true; e.target.removeAttribute('aria-invalid'); }
      updateSummary();
    });
    qForm.addEventListener('submit', (e) => e.preventDefault());

    $('#q-send-wa').addEventListener('click', () => { const q = validateQuote(false); if (q) openWhatsApp(quoteMessage(q)); });
    $('#q-send-mail').addEventListener('click', () => { const q = validateQuote(false); if (q) openMail(`Solicitud de cotización — ${q.nombre}`, quoteMessage(q)); });
    $('#q-copy').addEventListener('click', async () => {
      const q = readQuote();
      if (!q.items.length) { check([{ ok: false, err: 'err-svc', focus: $('#quote-picks input') }]); return; }
      try { await copyText(quoteMessage({ ...q, nombre: q.nombre || '(su nombre)' })); toast('Resumen copiado al portapapeles.'); }
      catch (e) { toast('No se pudo copiar el resumen.', true); }
    });

    if (C.formEndpoint) {
      const b = $('#q-send-endpoint');
      b.hidden = false;
      b.addEventListener('click', async () => {
        const q = validateQuote(true);
        if (!q) return;
        await postForm(b, {
          tipo: 'cotizacion', nombre: q.nombre, telefono: q.telefono, correo: q.correo,
          propiedad: q.inmueble, urgencia: q.urgencia, visita: q.visita ? `${q.fecha || 'sin fecha'} ${q.franja}` : 'no',
          ubicacion: place(q), detalle: q.detalle,
          servicios: q.items.map((i) => `${i.s.nombre} — ${i.tipos.join(', ') || 'sin especificar'}`).join('\n'),
          mensaje: quoteMessage(q)
        });
      });
    }
    updateSummary();
  }

  /* ==========================================================================
     Calculadora solar (estimación referencial)
     ========================================================================== */
  function initCalc() {
    const S = Object.assign({ hsp: 4.5, pr: 0.8, panelW: 550, m2PorPanel: 2.6, consumoInicial: 400 }, C.solar || {});
    const range = $('#calc-kwh'), num = $('#calc-kwh-num');
    const nf = (n, d = 0) => n.toLocaleString('es-CR', { minimumFractionDigits: d, maximumFractionDigits: d });
    let last = null;

    $('#calc-pw').textContent = S.panelW;
    $('#calc-hsp').textContent = nf(S.hsp, 1);

    function compute() {
      const kwh = Math.max(50, Math.min(20000, Number(num.value) || 0));
      const goal = Number($('input[name="calc-goal"]:checked').value);
      const target = kwh * goal;
      const kwpRaw = target / (S.hsp * 30 * S.pr);
      const n = Math.max(1, Math.ceil((kwpRaw * 1000) / S.panelW));
      const kwp = (n * S.panelW) / 1000;
      const gen = kwp * S.hsp * 30 * S.pr;
      return { kwh, goal, n, kwp, gen, m2: n * S.m2PorPanel };
    }

    function render() {
      const r = compute();
      last = r;
      $('#calc-kwh-out').textContent = nf(r.kwh);
      $('#calc-kwp').textContent = nf(r.kwp, 2);
      $('#calc-n').textContent = r.n;
      $('#calc-m2').textContent = nf(Math.round(r.m2));
      $('#calc-gen').textContent = nf(Math.round(r.gen));
      const pct = ((Math.min(3000, r.kwh) - 100) / 2900) * 100;
      range.style.setProperty('--fill', `${Math.max(0, pct).toFixed(1)}%`);
      const shown = Math.min(r.n, 48);
      $('#calc-panels').innerHTML = Array.from({ length: shown }, (_, i) => `<span class="calc__panel" style="--i:${i}"></span>`).join('')
        + (r.n > shown ? `<span class="calc__more">+${r.n - shown} paneles más</span>` : '');
      $('#calc-wa').href = waUrl(sign(calcMessage(r)));
    }

    const calcMessage = (r) => `Hola ${C.nombre}, usé la calculadora solar de su sitio:\n*Consumo:* ${nf(r.kwh)} kWh/mes\n*Cobertura deseada:* ${Math.round(r.goal * 100)} %\n*Sistema de referencia:* ${nf(r.kwp, 2)} kWp (${r.n} paneles de ${S.panelW} W)\nQuisiera una cotización.`;

    range.value = S.consumoInicial; num.value = S.consumoInicial;
    let t = 0;
    range.addEventListener('input', () => { num.value = range.value; cancelAnimationFrame(t); t = requestAnimationFrame(render); });
    num.addEventListener('input', () => { range.value = Math.min(3000, Math.max(100, Number(num.value) || 100)); render(); });
    $('#calc').addEventListener('change', (e) => { if (e.target.name === 'calc-goal') render(); });

    $('#calc-add').addEventListener('click', () => {
      const r = last || compute();
      const d = qForm.elements.detalle;
      const line = `Calculadora solar: consumo ${nf(r.kwh)} kWh/mes, cobertura ${Math.round(r.goal * 100)} %, sistema de referencia ${nf(r.kwp, 2)} kWp (${r.n} paneles).`;
      d.value = d.value.replace(/^Calculadora solar:.*$/m, '').trim();
      d.value = d.value ? `${line}\n${d.value}` : line;
      selectService('solar', { msg: 'Sistema solar y datos de la calculadora agregados a su cotización.' });
    });
    render();
  }

  /* ==========================================================================
     Formulario de contacto
     ========================================================================== */
  function initContact() {
    const f = $('#contact-form');
    $('#c-asunto').innerHTML = ['Consulta general', ...C.servicios.map((s) => s.nombre), 'Agendar una visita técnica', 'Otro']
      .map((o) => `<option>${esc(o)}</option>`).join('');

    const read = () => {
      const v = (n) => (f.elements[n].value || '').trim();
      return { nombre: v('nombre'), telefono: v('telefono'), correo: v('correo'), asunto: v('asunto'), mensaje: v('mensaje') };
    };
    const validate = (needContact) => {
      const d = read();
      const ok = check([
        { ok: d.nombre.length >= 2, err: 'cerr-nombre', el: f.elements.nombre },
        { ok: phoneOk(d.telefono, d.correo, needContact), err: 'cerr-telefono', el: f.elements.telefono },
        { ok: !d.correo || EMAIL_RE.test(d.correo), err: 'cerr-correo', el: f.elements.correo },
        { ok: d.mensaje.length >= 3, err: 'cerr-mensaje', el: f.elements.mensaje }
      ]);
      return ok ? d : null;
    };
    const message = (d) => {
      const L = [`Hola ${C.nombre}, tengo una consulta.`, '', `*Me interesa:* ${d.asunto}`, `*Mensaje:* ${d.mensaje}`, '', '*Mis datos*', `Nombre: ${d.nombre}`];
      if (d.telefono) L.push(`Teléfono: ${d.telefono}`);
      if (d.correo) L.push(`Correo: ${d.correo}`);
      return sign(L.join('\n'));
    };

    f.addEventListener('input', (e) => {
      const er = e.target.name && $(`#cerr-${e.target.name}`);
      if (er) { er.hidden = true; e.target.removeAttribute('aria-invalid'); }
    });
    f.addEventListener('submit', (e) => e.preventDefault());
    $('#c-send-wa').addEventListener('click', () => { const d = validate(false); if (d) openWhatsApp(message(d)); });
    $('#c-send-mail').addEventListener('click', () => { const d = validate(false); if (d) openMail(`Consulta web — ${d.asunto}`, message(d)); });

    if (C.formEndpoint) {
      const b = $('#c-send-endpoint');
      b.hidden = false;
      b.addEventListener('click', async () => {
        const d = validate(true);
        if (d && await postForm(b, { tipo: 'contacto', ...d })) f.reset();
      });
    }
  }

  /* ==========================================================================
     FAQ (acordeón)
     ========================================================================== */
  function renderFaq() {
    const box = $('#faq');
    box.innerHTML = C.faq.map((f, i) =>
      `<details class="faq__item"${i === 0 ? ' open' : ''}><summary>${esc(f.p)}${icon('chevron')}</summary><div class="faq__a"><p>${esc(f.r)}</p></div></details>`).join('');
    box.addEventListener('toggle', (e) => {
      if (e.target.open) $$('details', box).forEach((d) => { if (d !== e.target) d.open = false; });
    }, true);
  }

  /* ==========================================================================
     Interacción general: intro, menú, tema, scroll, animaciones
     ========================================================================== */
  function initIntro() {
    const intro = $('#intro');
    if (!intro) return;
    const seen = safe(() => sessionStorage.getItem('e24-intro'));
    safe(() => sessionStorage.setItem('e24-intro', '1'));
    if (reduceMotion || seen) { intro.remove(); return; }
    setTimeout(() => intro.classList.add('out'), 1300);
    setTimeout(() => intro.remove(), 2300);
  }

  function initChrome() {
    const header = $('#header');
    const nav = $('#nav');
    const toggle = $('#nav-toggle');

    const closeNav = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    };
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeNav(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });

    $('#theme-toggle').addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      safe(() => localStorage.setItem('energys24-theme', next));
    });

    // Cabecera, botón «subir», barra de progreso y línea del proceso
    const totop = $('#totop');
    const progress = $('#progress');
    const steps = $('.process__steps');
    const stepItems = $$('li', steps);
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
        totop.classList.toggle('is-visible', window.scrollY > 700);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.setProperty('--p', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0');
        // El proceso se «enciende» paso a paso mientras la sección cruza la pantalla.
        const r = steps.getBoundingClientRect();
        const k = Math.max(0, Math.min(1, (window.innerHeight * 0.85 - r.top) / (window.innerHeight * 0.6)));
        steps.style.setProperty('--fill', k.toFixed(3));
        stepItems.forEach((li, i) => li.classList.toggle('is-lit', k >= i / (stepItems.length - 1) - 0.02));
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

    if (!('IntersectionObserver' in window)) { $$('.reveal').forEach((el) => el.classList.add('in')); return; }

    const rev = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el) => rev.observe(el));

    const links = new Map($$('.nav__link').map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a, id) => a.classList.toggle('is-active', id === e.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  function initHero() {
    const rot = $('#rotator');
    if (rot && !reduceMotion) {
      const words = rot.dataset.words.split(',');
      const word = $('.rotator__word', rot);
      let i = 0;
      setInterval(() => {
        if (document.hidden) return;
        word.classList.add('is-out');
        setTimeout(() => { i = (i + 1) % words.length; word.textContent = words[i]; word.classList.remove('is-out'); }, 360);
      }, 2600);
    }
    if (!finePointer || reduceMotion) return;
    // Brillo que sigue al cursor, visual con parallax y botones magnéticos
    const hero = $('#inicio'), vis = $('.hero__visual');
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      hero.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      hero.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      vis.style.transform = `translate3d(${((x - 0.5) * -22).toFixed(1)}px, ${((y - 0.5) * -22).toFixed(1)}px, 0)`;
    });
    $$('.mag').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.16).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1)}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* ==========================================================================
     WhatsApp flotante con menú rápido
     ========================================================================== */
  function initWaWidget() {
    const OPTS = [
      ['Quiero cotizar un sistema solar', 'quisiera cotizar un sistema solar.'],
      ['Necesito una bomba o más presión de agua', 'necesito ayuda con una bomba o con la presión del agua.'],
      ['Equipos para mi piscina', 'quisiera información sobre equipos para piscina.'],
      ['Planta eléctrica o respaldo', 'quisiera información sobre plantas eléctricas o respaldo de energía.'],
      ['Agendar una visita técnica', 'quisiera agendar una visita técnica.'],
      ['Otra consulta', 'tengo una consulta.']
    ];
    $('#wa-opts').innerHTML = OPTS.map(([label, msg]) =>
      `<a class="wa-opt" href="${waUrl(sign(`Hola ${C.nombre}, ${msg}`))}" target="_blank" rel="noopener"><span>${esc(label)}</span>${icon('arrow')}</a>`).join('');

    const pop = $('#wa-pop'), fab = $('#wa-fab');
    const open = () => { pop.hidden = false; fab.setAttribute('aria-expanded', 'true'); const first = $('.wa-opt', pop); if (first) first.focus(); };
    const close = (focusFab) => { if (pop.hidden) return; pop.hidden = true; fab.setAttribute('aria-expanded', 'false'); if (focusFab) fab.focus(); };
    fab.addEventListener('click', () => (pop.hidden ? open() : close(false)));
    $('#wa-pop-x').addEventListener('click', () => close(true));
    pop.addEventListener('click', (e) => { if (e.target.closest('.wa-opt')) close(false); });
    document.addEventListener('click', (e) => { if (!e.target.closest('#wa-widget')) close(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) close(true); });
  }

  /* ==========================================================================
     Sistema interactivo: energía (ámbar) y agua (celeste)
     ========================================================================== */
  function initSystem() {
    const stage = $('#net-stage');
    if (!stage) return;

    const VBW = 900, VBH = 560, NS = 'http://www.w3.org/2000/svg';
    const NODES = [
      { id: 'sol', x: 90, y: 70, icono: 'sun', label: 'Sol', info: true, t: 'e' },
      { id: 'paneles', x: 265, y: 120, icono: 'panel', label: 'Paneles solares', svc: 'solar', t: 'e' },
      { id: 'inversor', x: 450, y: 195, icono: 'battery', label: 'Inversor y baterías', svc: 'hibrido', t: 'e' },
      { id: 'mant', x: 640, y: 75, icono: 'wrench', label: 'Mantenimiento', svc: 'mantenimiento', t: 'e' },
      { id: 'red', x: 815, y: 115, icono: 'pole', label: 'Red eléctrica', info: true, t: 'e' },
      { id: 'planta', x: 815, y: 290, icono: 'generator', label: 'Planta eléctrica', svc: 'plantas', t: 'e' },
      { id: 'termo', x: 110, y: 320, icono: 'heater', label: 'Calentador solar', svc: 'termosolar', t: 'w' },
      { id: 'casa', x: 450, y: 345, icono: 'home', label: 'Su casa o negocio', info: true, hub: true },
      { id: 'pozo', x: 110, y: 480, icono: 'droplet', label: 'Pozo', svc: 'pozos', t: 'w' },
      { id: 'presion', x: 300, y: 485, icono: 'gauge', label: 'Bomba de presión', svc: 'presion', t: 'w' },
      { id: 'piscina', x: 600, y: 485, icono: 'waves', label: 'Piscina', svc: 'piscinas', t: 'w' },
      { id: 'calentador', x: 800, y: 470, icono: 'flame', label: 'Calentador', svc: 'calentadores', t: 'e' }
    ];
    // [desde, hasta, tipo e|w, punteado]
    const LINKS = [
      ['sol', 'paneles', 'e'], ['paneles', 'inversor', 'e'], ['inversor', 'casa', 'e'], ['red', 'casa', 'e'],
      ['planta', 'casa', 'e'], ['sol', 'termo', 'e'], ['termo', 'casa', 'w'], ['pozo', 'presion', 'w'],
      ['presion', 'casa', 'w'], ['casa', 'piscina', 'w'], ['casa', 'calentador', 'e'], ['mant', 'casa', 'e', 1]
    ];
    const CYCLE = ['paneles', 'inversor', 'planta', 'presion', 'pozo', 'piscina', 'termo', 'calentador', 'mant'];
    const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

    const linksG = $('#net-links'), pktG = $('#net-packets');
    const links = LINKS.map(([a, b, type, dashed]) => {
      const A = byId[a], B = byId[b];
      const dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy) || 1;
      const bend = Math.abs(dx) < 30 ? 0.06 * len : 0.13 * len;
      const cx = (A.x + B.x) / 2 + (-dy / len) * bend, cy = (A.y + B.y) / 2 + (dx / len) * bend;
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', `M${A.x} ${A.y} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${B.x} ${B.y}`);
      path.setAttribute('class', `net__link net__link--${type}${dashed ? ' is-dashed' : ''}`);
      linksG.appendChild(path);
      return { a, b, type, path, len: path.getTotalLength() };
    });

    // Partículas: la energía corre más rápido que el agua.
    const packets = [];
    links.forEach((l) => {
      const n = l.type === 'w' ? 3 : 2;
      for (let i = 0; i < n; i++) {
        const el = document.createElementNS(NS, 'circle');
        el.setAttribute('r', l.type === 'w' ? '6' : '5.5');
        el.setAttribute('fill', l.type === 'w' ? 'url(#pkt-aqua)' : 'url(#pkt-sun)');
        pktG.appendChild(el);
        packets.push({ l, el, t: (i / n) + Math.random() * 0.2, v: l.type === 'w' ? 0.1 + Math.random() * 0.05 : 0.2 + Math.random() * 0.12 });
      }
    });
    const place = (p) => {
      const pt = p.l.path.getPointAtLength((p.t % 1) * p.l.len);
      p.el.setAttribute('cx', pt.x.toFixed(1));
      p.el.setAttribute('cy', pt.y.toFixed(1));
    };
    let raf = 0, last = 0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      for (const p of packets) { p.t = (p.t + p.v * dt) % 1; place(p); }
    };
    packets.forEach(place);

    const nodesBox = $('#net-nodes');
    nodesBox.innerHTML = NODES.map((n) => {
      const style = `left:${((n.x / VBW) * 100).toFixed(2)}%;top:${((n.y / VBH) * 100).toFixed(2)}%`;
      const inner = `<span class="node__icon">${icon(n.icono)}</span><span class="node__label">${esc(n.label)}</span>`;
      const cls = `node${n.t ? ` node--${n.t}` : ''}${n.hub ? ' node--hub' : ''}`;
      return n.info
        ? `<div class="${cls} node--info" style="${style}">${inner}</div>`
        : `<button type="button" class="${cls}" data-node="${n.id}" style="${style}" aria-label="${esc(n.label)}" aria-pressed="false">${inner}</button>`;
    }).join('');

    const panel = $('#net-panel');
    let auto = !reduceMotion, idx = 0, timer = 0;

    function select(id) {
      const n = byId[id];
      const svc = n && svcById[n.svc];
      if (!svc) return;
      $$('.node[data-node]', nodesBox).forEach((b) => {
        const on = b.dataset.node === id;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      links.forEach((l) => l.path.classList.toggle('is-on', l.a === id || l.b === id));
      panel.setAttribute('aria-live', auto ? 'off' : 'polite');
      panel.innerHTML = `
        <span class="net__panel-icon${n.t === 'w' ? ' net__panel-icon--w' : ''}">${icon(svc.icono)}</span>
        <h3>${esc(svc.nombre)}</h3>
        <p>${esc(svc.descripcion)}</p>
        <ul>${svc.puntos.map((p) => `<li>${icon('check')}<span>${esc(p)}</span></li>`).join('')}</ul>
        <div class="net__actions">
          <button type="button" class="btn btn--accent btn--sm" data-quote="${esc(svc.id)}">Cotizar ${icon('arrow')}</button>
          <a class="btn btn--ghost btn--sm" href="${waUrl(`Hola ${C.nombre}, quisiera información sobre: ${svc.nombre}.`)}" target="_blank" rel="noopener">${icon('whatsapp')}WhatsApp</a>
        </div>`;
    }

    nodesBox.addEventListener('click', (e) => {
      const b = e.target.closest('[data-node]');
      if (!b) return;
      auto = false;
      clearInterval(timer);
      select(b.dataset.node);
    });

    const tick = () => { idx = (idx + 1) % CYCLE.length; select(CYCLE[idx]); };
    const startTimer = () => { clearInterval(timer); if (auto) timer = setInterval(tick, 5200); };
    stage.addEventListener('pointerenter', () => clearInterval(timer));
    stage.addEventListener('pointerleave', startTimer);
    select(CYCLE[0]);

    if (!reduceMotion && 'IntersectionObserver' in window) {
      new IntersectionObserver((en) => {
        if (en[0].isIntersecting) { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } startTimer(); }
        else { cancelAnimationFrame(raf); raf = 0; clearInterval(timer); }
      }, { threshold: 0.15 }).observe(stage);
    }
  }

  /* ==========================================================================
     Comparador antes / después
     ========================================================================== */
  function initBeforeAfter() {
    const ba = $('#ba');
    if (!ba) return;
    const AD = C.antesDespues || {};
    const photos = AD.antes && AD.despues;
    $('#ba-before').innerHTML = photos ? `<img src="${esc(AD.antes)}" alt="Antes: ${esc(AD.titulo || 'proyecto')}" loading="lazy">` : (V ? V.art('solar', { before: true }) : '');
    $('#ba-after').innerHTML = photos ? `<img src="${esc(AD.despues)}" alt="Después: ${esc(AD.titulo || 'proyecto')}" loading="lazy">` : (V ? V.art('solar') : '');
    if (photos) $('#ba-cap').textContent = `${AD.titulo || 'Proyecto de Energys 24'}. Arrastre para comparar.`;

    const handle = $('.ba__handle', ba);
    let pos = 50, demo = 0, dragging = false;
    const set = (p) => {
      pos = Math.max(0, Math.min(100, p));
      ba.style.setProperty('--pos', `${pos}%`);
      handle.setAttribute('aria-valuenow', String(Math.round(pos)));
    };
    const stopDemo = () => { cancelAnimationFrame(demo); demo = 0; };
    const fromEvent = (e) => { const r = ba.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); };

    ba.addEventListener('pointerdown', (e) => { stopDemo(); dragging = true; ba.setPointerCapture(e.pointerId); fromEvent(e); });
    ba.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => ba.addEventListener(t, () => { dragging = false; }));
    handle.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 10 : 4;
      const map = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step };
      if (e.key in map) { stopDemo(); set(pos + map[e.key]); e.preventDefault(); }
      else if (e.key === 'Home') { stopDemo(); set(0); e.preventDefault(); }
      else if (e.key === 'End') { stopDemo(); set(100); e.preventDefault(); }
    });
    set(50);

    if (!reduceMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now(), dur = 3000;
        const step = (now) => {
          const k = Math.min(1, (now - t0) / dur);
          set(50 + Math.sin(k * Math.PI * 2) * 32);
          if (k < 1) demo = requestAnimationFrame(step); else set(50);
        };
        demo = requestAnimationFrame(step);
      }, { threshold: 0.6 });
      io.observe(ba);
    }
  }

  /* ==========================================================================
     Galería de proyectos + visor
     ========================================================================== */
  function initGallery() {
    const ARTE = { solar: 'solar', agua: 'presion', piscinas: 'piscina', plantas: 'planta', calentadores: 'termosolar', mantenimiento: 'mantenimiento' };
    const catName = Object.fromEntries(C.categorias.map((c) => [c.id, c.nombre]));
    const items = (C.galeria || []).slice(0, 25).filter((g) => g.foto || C.demo);
    const grid = $('#gallery');
    if (!items.length) { $('.gallery-head').hidden = true; grid.hidden = true; $('#gal-note').hidden = true; return; }
    if (items.every((g) => g.foto)) $('#gal-note').hidden = true;

    const cats = ['todos', ...new Set(items.map((g) => g.categoria))];
    $('#gal-filters').innerHTML = cats.map((c, i) =>
      `<button type="button" class="chipbtn" data-cat="${esc(c)}" aria-pressed="${i === 0}">${esc(c === 'todos' ? 'Todos' : (catName[c] || c))}</button>`).join('');

    let artToggle = 0;
    grid.innerHTML = items.map((g, i) => {
      const sub = [catName[g.categoria], g.zona].filter(Boolean).join(' · ');
      const cap = `<span class="gal__cap"><strong>${esc(g.titulo)}</strong>${sub ? `<small>${esc(sub)}</small>` : ''}</span>`;
      if (g.foto) {
        return `<button type="button" class="gal" data-cat="${esc(g.categoria)}" data-i="${i}" aria-label="Ver foto: ${esc(g.titulo)}">
          <img src="${esc(g.foto)}" alt="${esc(g.titulo)}" loading="lazy" width="380" height="380"${g.foco ? ` style="object-position:${esc(g.foco)}"` : ''}>${cap}</button>`;
      }
      let arte = g.arte || ARTE[g.categoria] || 'solar';
      if (!g.arte && g.categoria === 'agua') arte = (artToggle++ % 2) ? 'pozo' : 'presion';
      if (!g.arte && g.categoria === 'solar' && /bater|híbrid|hibrid/i.test(g.titulo)) arte = 'hibrido';
      return `<div class="gal gal--ph" data-cat="${esc(g.categoria)}" role="img" aria-label="${esc(g.titulo)}: foto por confirmar">
        ${V ? V.art(arte) : ''}<span class="gal__badge">Foto por confirmar</span>${cap}</div>`;
    }).join('');
    $('#gal-credit').hidden = !items.some((g) => g.foto);

    // Filtro + «Ver más»: con «Todos» se muestran las primeras FIRST y el resto a pedido.
    const FIRST = 12;
    const moreWrap = $('#gal-more-wrap'), moreBtn = $('#gal-more');
    let cat = 'todos', expanded = false;
    function apply(animate) {
      let n = 0;
      const total = $$('.gal', grid).filter((card) => cat === 'todos' || card.dataset.cat === cat).length;
      $$('.gal', grid).forEach((card) => {
        const match = cat === 'todos' || card.dataset.cat === cat;
        const show = match && (cat !== 'todos' || expanded || n < FIRST);
        if (match) n++;
        const was = !card.hidden;
        card.hidden = !show;
        if (show && animate && !was) { card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop'); }
      });
      const rest = total - FIRST;
      moreWrap.hidden = !(cat === 'todos' && !expanded && rest > 0);
      moreBtn.textContent = `Ver ${rest} trabajos más`;
    }
    $('#gal-filters').addEventListener('click', (e) => {
      const btn = e.target.closest('.chipbtn');
      if (!btn) return;
      $$('.chipbtn', $('#gal-filters')).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      cat = btn.dataset.cat;
      $$('.gal', grid).forEach((c) => { c.hidden = true; });
      apply(true);
    });
    moreBtn.addEventListener('click', () => {
      const first = $$('.gal', grid).filter((c) => c.hidden)[0];
      expanded = true; apply(true);
      if (first) first.focus();
    });
    apply(false);

    // Visor
    const lb = $('#lb');
    let cur = -1, opener = null;
    const visible = () => $$('.gal[data-i]', grid).filter((b) => !b.hidden).map((b) => Number(b.dataset.i));
    const show = (i) => {
      const g = items[i];
      cur = i;
      $('#lb-media').innerHTML = `<img src="${esc(g.foto)}" alt="${esc(g.titulo)}">`;
      $('#lb-cap').textContent = [g.titulo, catName[g.categoria], g.zona].filter(Boolean).join(' · ');
    };
    const move = (d) => { const v = visible(); if (!v.length) return; const k = v.indexOf(cur); show(v[(k + d + v.length) % v.length]); };
    const close = () => { lb.hidden = true; root.style.overflow = ''; if (opener) opener.focus(); };
    grid.addEventListener('click', (e) => {
      const b = e.target.closest('.gal[data-i]');
      if (!b) return;
      opener = b; show(Number(b.dataset.i));
      lb.hidden = false; root.style.overflow = 'hidden';
      $('.lb__x', lb).focus();
    });
    lb.addEventListener('click', (e) => {
      const a = e.target.closest('[data-lb]');
      if (a) { if (a.dataset.lb === 'close') close(); else move(a.dataset.lb === 'next' ? 1 : -1); return; }
      if (e.target === lb) close();
    });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') move(1);
      else if (e.key === 'ArrowLeft') move(-1);
      else if (e.key === 'Tab') {
        const f = $$('button', lb);
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ==========================================================================
     Diagnóstico rápido
     ========================================================================== */
  function initDiagnostic() {
    const box = $('#diag');
    if (!box || !Array.isArray(C.diagnostico) || !C.diagnostico.length) return;

    const STEPS = ['Problema', 'Detalles', 'Recomendación'];
    const WHO = ['Casa', 'Negocio', 'Finca'];
    const URG = ['Puedo esperar', 'Esta semana', 'Es urgente'];
    const st = { step: 1, issue: null, who: WHO[0], urg: URG[0] };
    const issue = () => C.diagnostico.find((d) => d.id === st.issue);

    const stepper = () => `<ol class="diag__steps" aria-label="Progreso del diagnóstico">${STEPS.map((t, i) =>
      `<li class="diag__step${st.step === i + 1 ? ' is-on' : ''}${st.step > i + 1 ? ' is-done' : ''}"${st.step === i + 1 ? ' aria-current="step"' : ''}><span>${t}</span></li>`).join('')}</ol>`;

    const seg = (name, label, opts, cur) => `
      <div class="qgroup"><span class="qgroup__label" id="${name}-l">${label}</span>
        <div class="seg" role="radiogroup" aria-labelledby="${name}-l">${opts.map((v) =>
          `<label class="seg__opt"><input type="radio" name="${name}" value="${esc(v)}"${v === cur ? ' checked' : ''}><span>${esc(v)}</span></label>`).join('')}</div>
      </div>`;

    function body() {
      if (st.step === 1) {
        return `<h3 class="diag__q">¿Cuál se parece más a su caso?</h3>
          <div class="issues">${C.diagnostico.map((d) => {
            const water = WATER.includes((svcById[d.servicio] || {}).categoria);
            return `<button type="button" class="issue" data-issue="${esc(d.id)}">
              <span class="issue__icon${water ? ' issue__icon--w' : ''}">${icon(d.icono)}</span>
              <span><strong>${esc(d.titulo)}</strong><small>${esc(d.detalle)}</small></span>
            </button>`;
          }).join('')}</div>`;
      }
      const d = issue();
      if (st.step === 2) {
        return `<h3 class="diag__q">${esc(d.titulo)}</h3>
          <div class="diag__ctx">${seg('dg-who', '¿Dónde es?', WHO, st.who)}${seg('dg-urg', '¿Qué tan urgente es?', URG, st.urg)}</div>
          <div class="diag__nav">
            <button type="button" class="btn btn--outline" data-act="back">${icon('back')}Atrás</button>
            <button type="button" class="btn btn--primary" data-act="next">Ver recomendación ${icon('arrow')}</button>
          </div>`;
      }
      const svc = svcById[d.servicio];
      const urgent = st.urg === URG[2];
      const msg = sign(`Hola ${C.nombre}, necesito ayuda con esto:\n*Problema:* ${d.titulo}\n*Lugar:* ${st.who}\n*Urgencia:* ${st.urg}\n(Consulta desde el diagnóstico rápido)`);
      return `<div class="diag__result">
          <div class="diag__tips">
            <h3>Primeros pasos seguros</h3>
            <ol class="tips">${d.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
            <p class="diag__note">Ante olor a quemado, chispas o agua cerca de conexiones eléctricas, corte la electricidad desde el breaker y no manipule el equipo.</p>
          </div>
          <div class="diag__rec">
            <span class="pill">${esc(st.urg)}</span>
            <div class="diag__rec-head"><span class="net__panel-icon${WATER.includes(svc.categoria) ? ' net__panel-icon--w' : ''}">${icon(svc.icono)}</span><div><small>Le recomendamos</small><strong>${esc(svc.nombre)}</strong></div></div>
            <p>${esc(svc.descripcion)}</p>
            <div class="summary__actions">
              <a class="btn btn--wa btn--block" href="${waUrl(msg)}" target="_blank" rel="noopener">${icon('whatsapp')}${urgent ? 'Escribir ahora por WhatsApp' : 'Consultar por WhatsApp'}</a>
              <button type="button" class="btn btn--accent btn--block" data-act="quote">Agregar al cotizador</button>
              <button type="button" class="btn btn--ghost btn--block" data-act="reset">${icon('refresh')}Empezar de nuevo</button>
            </div>
          </div>
        </div>
        <div class="diag__nav"><button type="button" class="btn btn--outline" data-act="back">${icon('back')}Atrás</button></div>`;
    }

    function render(focus) {
      box.innerHTML = `${stepper()}<div class="diag__body" tabindex="-1">${body()}</div>`;
      if (focus) {
        $('.diag__body', box).focus({ preventScroll: true });
        const r = box.getBoundingClientRect();
        if (r.top < 0 || r.bottom > window.innerHeight) box.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    }

    box.addEventListener('click', (e) => {
      const pick = e.target.closest('[data-issue]');
      if (pick) { st.issue = pick.dataset.issue; st.step = 2; render(true); return; }
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const act = btn.dataset.act;
      if (act === 'back') { st.step = Math.max(1, st.step - 1); render(true); }
      else if (act === 'next') { st.step = 3; render(true); }
      else if (act === 'reset') { st.step = 1; st.issue = null; render(true); }
      else if (act === 'quote') {
        if (st.urg === URG[2]) qForm.elements.urgencia.value = 'Urgente';
        const map = { Casa: 'Casa', Negocio: 'Comercio', Finca: 'Finca' };
        qForm.elements.inmueble.value = map[st.who];
        selectService(issue().servicio);
      }
    });
    box.addEventListener('change', (e) => {
      if (e.target.name === 'dg-who') st.who = e.target.value;
      if (e.target.name === 'dg-urg') st.urg = e.target.value;
    });

    render(false);
  }

  /* ---------- Arranque ---------- */
  initIntro();
  bindStatic();
  renderStats();
  renderMarquee();
  renderServices();
  initQuote();
  initCalc();
  initContact();
  renderFaq();
  initGallery();
  initChrome();
  initHero();
  initWaWidget();
  initSystem();
  initBeforeAfter();
  initDiagnostic();
  if (V) V.initHeroFlow($('#hero-canvas'), $('#inicio'));

  // Cualquier botón [data-quote] agrega ese servicio al cotizador.
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-quote]');
    if (b) selectService(b.dataset.quote);
  });
})();
