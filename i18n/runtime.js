/* Seoul i18n runtime — expects window.SEOUL_DICT = {ko:{...}, en:{...}, ja:{...}, zh:{...}} */
(() => {
  'use strict';
  const DICT = window.SEOUL_DICT || {};
  const ORDER = ['ko', 'en', 'ja', 'zh'];
  const LABELS = { ko: 'KO', en: 'EN', ja: 'JA', zh: 'CN' };
  const NAMES = { ko: '한국어', en: 'English', ja: '日本語', zh: '中文' };
  const q = (s) => document.querySelector(s);
  const qa = (s) => [...document.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const br = (s) => esc(s).replace(/\n/g, '<br>');

  let lang = 'ko';
  try {
    const saved = localStorage.getItem('seoul-lang');
    if (saved && DICT[saved]) lang = saved;
    else {
      const nav = (navigator.language || 'ko').toLowerCase();
      lang = nav.startsWith('ko') ? 'ko' : nav.startsWith('ja') ? 'ja' : nav.startsWith('zh') ? 'zh' : nav.startsWith('en') ? 'en' : 'ko';
      if (!DICT[lang]) lang = 'ko';
    }
  } catch (e) { /* storage blocked */ }

  function t(key, ...args) {
    const table = DICT[lang] || {};
    let value = table[key];
    if (value === undefined) value = (DICT.ko || {})[key];
    if (value === undefined) return key;
    return args.length ? String(value).replace(/\{(\d+)\}/g, (m, i) => (args[i] === undefined ? m : args[i])) : value;
  }

  function text(sel, key) { const el = typeof sel === 'string' ? q(sel) : sel; if (el) el.textContent = t(key); }
  function html(sel, markup) { const el = typeof sel === 'string' ? q(sel) : sel; if (el) el.innerHTML = markup; }
  function attr(sel, name, key) { const el = typeof sel === 'string' ? q(sel) : sel; if (el) el.setAttribute(name, t(key)); }

  function applyStatic() {
    document.title = t('meta.title');
    const desc = q('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('meta.desc'));

    /* top bar */
    attr('.brand', 'aria-label', 'brand.aria');
    const brand = q('.brand');
    if (brand) {
      const node = [...brand.childNodes].find((n) => n.nodeType === 3 && n.nodeValue.trim());
      if (node) node.nodeValue = t('brand.name');
    }
    text('.brand-en', 'brand.en');
    html('.edition', `${esc(t('edition'))} <span>2026</span>`);

    /* rail + slide titles */
    qa('.rail button').forEach((b, i) => b.setAttribute('aria-label', t(`rail.${i}`)));
    const slides = qa('.slide');
    slides.forEach((s, i) => { s.dataset.title = t(`slide.title.${i}`); });

    /* cover */
    html('#slide-1 .eyebrow', `<span class="dot red"></span>${esc(t('cover.eyebrow'))}`);
    html('#title-1', `${esc(t('cover.h1a'))}<br><em>${esc(t('cover.h1b'))}</em>`);
    html('#slide-1 .summary strong', `${esc(t('cover.summary1'))}<br>${esc(t('cover.summary2'))}`);
    text('#slide-1 .english', 'cover.english');
    html('#slide-1 .start-button', `${esc(t('cover.start'))} <span>↗</span>`);
    text('#slide-1 .cover-note', 'cover.note');
    attr('#slide-1 .cover-visual', 'aria-label', 'cover.visualAria');
    attr('#dayCoverVideo', 'aria-label', 'cover.videoAria');
    text('.landscape-video-toolbar span', 'cover.toolbar');

    /* slide 02 — chart */
    html('#slide-3 h1', `${esc(t('chart.h1a'))} <em>${esc(t('chart.h1b'))}</em>`);
    text('#slide-3 .subtitle', 'chart.subtitle');
    attr('.activity-chart', 'aria-label', 'chart.aria');
    html('.chart-caption', `${esc(t('chart.caption'))} <span>${esc(t('chart.captionUnit'))}</span>`);
    qa('.bar-row').forEach((b, i) => {
      text(b.querySelector('.bar-label'), `chart.${i}.label`);
      b.dataset.chartTitle = t(`chart.${i}.title`);
      b.dataset.chartDesc = t(`chart.${i}.desc`);
      b.setAttribute('aria-label', t(`chart.${i}.aria`));
    });
    html('.activity-chart .source-line', br(t('chart.source')));
    text('.focus-ring small', 'chart.focusSmall');
    text('.interaction-hint', 'chart.hint');
    qa('.stats-ribbon > div').forEach((row, i) => {
      const value = t(`stats.${i}.value`);
      const strong = row.querySelector('strong');
      if (strong && value !== `stats.${i}.value`) {
        strong.dataset.count = value;
        strong.textContent = value;
        if (strong.dataset.running === undefined) strong.dataset.valueOverride = value;
      }
      html(row.querySelector('span'), `${esc(t(`stats.${i}.unit`))}<small>${esc(t(`stats.${i}.small`))}</small>`);
    });

    /* slide 03 — heritage & culture */
    html('#slide-4 h1', `${esc(t('history.h1a'))} <em class="purple-text">${esc(t('history.h1b'))}</em>`);
    attr('.heritage-line', 'aria-label', 'history.heritageAria');
    qa('.heritage-node').forEach((b, i) => {
      text(b.querySelector('h2'), `heritnode.${i}.name`);
      text(b.querySelector('p'), `heritnode.${i}.desc`);
      b.setAttribute('aria-label', t(`heritnode.${i}.aria`));
    });
    text('.heritage-hint', 'history.hint');
    html('.small-title', `${esc(t('history.pickTitle'))} <span class="click-hint">${esc(t('history.clickHint'))}</span>`);
    attr('.culture-choices', 'aria-label', 'history.choicesAria');
    qa('.culture-choice').forEach((b, i) => {
      html(b, `<span>0${i + 1}</span>${esc(t(`culopt.${i}`))}`);
    });
    html('#slide-4 .culture-content > .source-line', br(t('history.source')));

    /* slide 04 — tastes */
    html('#slide-5 h1', `${esc(t('taste.h1a'))} <em class="gold-text">${esc(t('taste.h1b'))}</em>`);
    text('#slide-5 .subtitle', 'taste.subtitle');
    html('.taste-center', `<span>${esc(t('taste.center'))}</span><strong data-count="81.7" data-decimals="1">81.7</strong><small>${esc(t('taste.centerSmall'))}</small>`);
    qa('.taste-stop').forEach((b, i) => {
      html(b, `<i>0${i + 1}</i><span>${esc(t(`tasteopt.${i}.name`))}<small>${esc(t(`tasteopt.${i}.sub`))}</small></span>`);
    });
    html('.taste-source', br(t('taste.source')));

    /* slide 05 — night */
    html('#slide-6 h1', `${esc(t('night.h1a'))} <em class="teal-text">${esc(t('night.h1b'))}</em>`);
    text('.night-interaction', 'night.interaction');
    qa('.night-option').forEach((b, i) => {
      html(b, `<span>0${i + 1}</span><div><h2>${esc(t(`nightopt.${i}.title`))}</h2><p>${br(t(`nightopt.${i}.desc`))}</p></div>`);
    });
    html('#slide-6 > .source-line', br(t('night.source')));

    /* slide 06 — days */
    html('#slide-7 h1', `${esc(t('day.h1a'))} <em>${esc(t('day.h1b'))}</em>`);
    text('#slide-7 .subtitle', 'day.subtitle');
    attr('.day-tabs', 'aria-label', 'day.aria');
    qa('.day-tab').forEach((b, i) => {
      html(b, `<span>DAY 0${i + 1}</span><h2>${esc(t(`daytab.${i}.title`))}</h2><small>${esc(t(`daytab.${i}.small`))}</small>`);
    });
    const slots = qa('.day-route .route-stop > span');
    ['day.morning', 'day.afternoon', 'day.evening'].forEach((k, i) => { if (slots[i]) slots[i].textContent = t(k); });
    text('.route-adjust > span', 'day.adjustLabel');
    html('#slide-7 > .source-line', br(t('day.source')));

    /* slide 07 — closing */
    html('#slide-8 h1', `${esc(t('closing.h1a'))}<br><em class="teal-text">${esc(t('closing.h1b'))}</em>`);
    text('#slide-8 .subtitle', 'closing.subtitle');
    html('#slide-8 .start-button', `${esc(t('closing.cta'))} <span>↗</span>`);
    text('#slide-8 .english', 'closing.english');
    qa('.prepare-list a').forEach((a, i) => {
      text(a.querySelector('h2'), `prep.${i}.title`);
      text(a.querySelector('p'), `prep.${i}.desc`);
    });
    html('.prepare-list .source-line', br(t('closing.source')));
    attr('#closingShortsVideo', 'aria-label', 'closing.videoAria');
    text('.closing-film figcaption span', 'closing.videoCaption');
    text('.created-time', 'createdTime');

    /* slide 08 — credits */
    qa('#title-9 span').forEach((s, i) => { s.textContent = t(i === 0 ? 'credits.h1a' : 'credits.h1b'); });
    attr('.credits-logo-link', 'aria-label', 'credits.logoAria');
    attr('.credits-logo-link', 'title', 'credits.logoAria');

    /* footer + dialogs */
    attr('#overviewBtn', 'aria-label', 'footer.overviewAria');
    attr('#prev', 'aria-label', 'footer.prevAria');
    attr('#next', 'aria-label', 'footer.nextAria');
    html('.footer-hint', `${esc(t('footer.hint'))} <span>·</span> ${esc(t('footer.keys'))}`);
    qa('.ai-image-label').forEach((el) => { el.textContent = t('drawer.aiLabel'); });
    text('.drawer-photo figcaption', 'drawer.aiLabel');
    text('.drawer-tip > span', 'drawer.tipLabel');
    html('#detailLink', `${esc(t('drawer.link'))} <span>↗</span>`);
    text('#overviewTitle', 'overview.title');
    attr('#detailDrawer .close-dialog', 'aria-label', 'drawer.closeAria');
    attr('#overviewDialog .close-dialog', 'aria-label', 'overview.closeAria');

    /* switcher state */
    qa('.lang-switch button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    const group = q('.lang-switch');
    if (group) group.setAttribute('aria-label', t('lang.aria'));
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang;
  }

  function buildSwitcher() {
    if (q('.lang-switch')) return;
    const host = q('.top-actions');
    if (!host) return;
    const box = document.createElement('div');
    box.className = 'lang-switch';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', NAMES.ko);
    ORDER.forEach((code) => {
      if (!DICT[code]) return;
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.lang = code;
      b.textContent = LABELS[code];
      b.title = NAMES[code];
      b.setAttribute('aria-label', NAMES[code]);
      b.addEventListener('click', () => set(code));
      box.append(b);
    });
    host.prepend(box);
  }

  function set(code) {
    if (!DICT[code] || code === lang) return;
    lang = code;
    try { localStorage.setItem('seoul-lang', code); } catch (e) { /* ignore */ }
    applyStatic();
    document.dispatchEvent(new CustomEvent('seoul-i18n', { detail: { lang } }));
  }

  window.SEOUL_I18N = {
    get lang() { return lang; },
    get langs() { return ORDER.filter((c) => DICT[c]); },
    t,
    set,
    apply: applyStatic,
  };

  buildSwitcher();
  applyStatic();
})();
