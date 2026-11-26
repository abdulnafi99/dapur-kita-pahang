/* Dapurkita @pahang — logik app (vanilla JS, tanpa build step) */
(function () {
  'use strict';

  const D = window.DK_DATA;
  const $ = (s, el = document) => el.querySelector(s);
  const view = $('#view');
  const sheet = $('#sheet');
  const backdrop = $('#sheetBackdrop');

  /* ---------- Storan peranti (selamat jika disekat) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('dk.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('dk.' + k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };

  const ALL = 'Semua kawasan';
  const TOWNS = Object.keys(D.areas);
  const savedTown = store.get('town', ALL);
  const state = {
    tab: 'home',
    cat: 'semua',
    town: TOWNS.includes(savedTown) ? savedTown : ALL,
    taman: TOWNS.includes(savedTown) ? store.get('taman', '') : '',
    query: '',
    topic: 'semua',
    favs: new Set(store.get('favs', [])),
    liked: new Set(store.get('liked', [])),
    theme: store.get('theme', 'auto'),
    myKitchens: store.get('myKitchens', []),
    myPosts: store.get('myPosts', [])
  };

  /* ---------- Ikon ---------- */
  const I = {
    pin: '<svg viewBox="0 0 24 24"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
    chev: '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 12 5.5 5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/></svg>',
    pen: '<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    shop: '<svg viewBox="0 0 24 24"><path d="M3 9 4.5 4h15L21 9"/><path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 13v7h14v-7"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/></svg>',
    dl: '<svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
    bolt: '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.4z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.3-1.8-1-1 .8a4 4 0 0 1-2-2l.8-1-1-1.8z"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m8 7 4-4 4 4"/><path d="M6 11H5v10h14V11h-1"/></svg>',
    plusSq: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></svg>',
    dots: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.5"/></svg>',
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>',
    auto: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>',
    camera: '<svg viewBox="0 0 24 24"><path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M6 7h12l1 14H5z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
    fork: '<svg viewBox="0 0 24 24"><path d="M7 2v8a2 2 0 0 0 2 2v10"/><path d="M11 2v8a2 2 0 0 1-2 2"/><path d="M9 2v6"/><path d="M17 2c-1.7 1.3-2.5 3.6-2.5 6.5V13H17v9"/></svg>'
  };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeImg = (src) => (typeof src === 'string' && /^data:image\/(jpeg|png|webp);base64,/.test(src)) ? src : '';
  const coverOf = (k) => safeImg((k.photos || [])[0]);
  const thumbHTML = (k) => { const c = coverOf(k); return c ? `<img src="${c}" alt="" loading="lazy" decoding="async">` : esc(k.emoji || '🍽️'); };

  /* Kecilkan foto dalam pelayar (maks 1000px, JPEG) supaya ringan disimpan */
  function resizeImage(file, max = 1000, quality = 0.72) {
    return new Promise((resolve, reject) => {
      if (!file || !/^image\//.test(file.type)) { reject(new Error('Bukan fail gambar')); return; }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Gambar tidak dapat dibaca')); };
      img.src = url;
    });
  }

  /* Harga: "RM7.50" -> 7.5 */
  const priceOf = (txt) => { const m = String(txt || '').replace(/,/g, '').match(/(\d+(?:\.\d{1,2})?)/); return m ? parseFloat(m[1]) : null; };
  const rm = (n) => 'RM' + n.toFixed(2);

  const flag = (sm) => `<span class="flag${sm ? ' sm' : ''}" role="img" aria-label="Bendera Pahang"><i></i><i></i></span>`;

  /* ---------- Tema ---------- */
  function applyTheme() {
    const root = document.documentElement;
    if (state.theme === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', state.theme);
  }
  applyTheme();

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2400);
  }

  /* ---------- Data gabungan ---------- */
  const allKitchens = () => [...state.myKitchens, ...D.kitchens];
  const allPosts = () => [...state.myPosts, ...D.posts];

  function locLabel() {
    if (state.taman) return state.taman;
    return state.town === ALL ? 'Semua kawasan' : state.town;
  }
  function setLoc(town, taman) {
    state.town = town; state.taman = taman || '';
    store.set('town', state.town); store.set('taman', state.taman);
  }

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat pagi';
    if (h < 15) return 'Selamat tengah hari';
    if (h < 19) return 'Selamat petang';
    return 'Selamat malam';
  }

  function filteredKitchens() {
    const q = state.query.trim().toLowerCase();
    return allKitchens().filter((k) => {
      if (state.town !== ALL && k.town !== state.town) return false;
      if (state.taman && k.area !== state.taman) return false;
      if (state.cat === 'ready' && k.status !== 'ready') return false;
      if (state.cat === 'preorder' && k.status !== 'preorder') return false;
      if (!['semua', 'ready', 'preorder'].includes(state.cat) && !(k.cats || []).includes(state.cat)) return false;
      if (q) {
        const hay = [k.name, k.desc, k.area, k.town, ...(k.menu || []).map((m) => m[0])].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function statusChip(k) {
    return k.status === 'ready'
      ? '<span class="chip"><span class="dot"></span>Ready Stock</span>'
      : '<span class="chip"><span class="dot po"></span>Pre-Order H-1</span>';
  }

  function kitchenCard(k) {
    const fav = state.favs.has(k.id);
    return `
      <div class="card row-item" data-open="${esc(k.id)}" role="button" tabindex="0" aria-label="Buka ${esc(k.name)}">
        <div class="thumb" aria-hidden="true">${thumbHTML(k)}</div>
        <div class="card-body">
          <strong>${esc(k.name)}</strong>
          <span class="loc">${I.pin}<span>${esc(k.area ? k.area + ', ' : '')}${esc(k.town)}</span></span>
          <span class="meta">${esc(k.desc)}</span>
          <div class="chips">${statusChip(k)}${k.sample ? '<span class="chip ghost-chip">Contoh</span>' : ''}</div>
        </div>
        <button class="fav" data-fav="${esc(k.id)}" aria-pressed="${fav}" aria-label="${fav ? 'Buang dari' : 'Simpan ke'} Disimpan">${I.heart}</button>
      </div>`;
  }

  /* ---------- Skrin: Utama ---------- */
  function renderHome() {
    const list = filteredKitchens();
    const catTitle = state.cat === 'semua' ? 'Dapur berhampiran' : D.categories.find((c) => c.id === state.cat).label;
    view.innerHTML = `
      <header class="hero pad">
        <div class="hero-top">
          <div class="brand-row">
            <div class="mini-logo">${I.fork}</div>
            <button class="loc-btn" id="locBtn" aria-label="Tukar kawasan">
              <small>${esc(state.taman ? state.town + ', Pahang' : 'Kawasan')}</small>
              <strong>${esc(locLabel())} ${I.down}</strong>
            </button>
          </div>
          <button class="icon-btn" id="bellBtn" aria-label="Notifikasi">${I.bell}</button>
        </div>
        <h1><span class="h1-sub">${greeting()} 👋</span>Lapar? <span class="hl">Dapur jiran</span><br>dah siap masak.</h1>
      </header>
      <div class="pad stack">
        <label class="search" for="q">${I.search}
          <input id="q" type="search" placeholder="Cari nasi lemak, kuih, lauk…" value="${esc(state.query)}" autocomplete="off" enterkeyhint="search">
        </label>
        <section class="section" aria-labelledby="h-cat">
          <div class="sec-head"><h2 id="h-cat">Pilih selera</h2></div>
          <div class="panel">
            <div class="cats" role="group" aria-label="Kategori">
              ${D.categories.map((c) => `<button class="cat" data-cat="${c.id}" aria-pressed="${state.cat === c.id}"><span class="cat-ico" aria-hidden="true">${c.icon}</span><span>${c.label}</span></button>`).join('')}
            </div>
          </div>
        </section>
        <button class="panel banner" id="sellBtn">
          <span class="banner-txt"><span class="eyebrow">Ada dapur sendiri?</span><strong>Iklan menu percuma. Pesanan terus ke WhatsApp, tiada komisen.</strong></span>
          <span class="round-go" aria-hidden="true">${I.arrow}</span>
        </button>
        <section class="section" aria-labelledby="h-list">
          <div class="sec-head"><h2 id="h-list">${esc(catTitle)}</h2><span class="count" id="count">${list.length} dapur</span></div>
          <div class="panel list-panel" id="klist">${listOrEmpty(list)}</div>
        </section>
      </div>`;

    $('#q').addEventListener('input', (e) => {
      state.query = e.target.value;
      const l = filteredKitchens();
      $('#klist').innerHTML = listOrEmpty(l);
      $('#count').textContent = l.length + ' dapur';
    });
    $('#locBtn').onclick = () => openTownPicker();
    $('#bellBtn').onclick = askNotif;
    $('#sellBtn').onclick = openListingForm;
  }

  function listOrEmpty(list) {
    if (list.length) return list.map(kitchenCard).join('');
    return `<div class="empty in-panel"><span class="big" aria-hidden="true">🍽️</span><strong>Tiada menu dijumpai</strong>
      <p>Cuba kata carian lain atau tukar kawasan. Ada dapur sendiri? Iklankan menu anda di sini.</p>
      <button class="btn outline" style="max-width:240px" data-action="reset">Tunjuk semua menu</button></div>`;
  }

  /* ---------- Skrin: Komuniti ---------- */
  function renderKomuniti() {
    const posts = allPosts().filter((p) => state.topic === 'semua' || p.topic === state.topic);
    view.innerHTML = `
      <header class="page-head pad">
        <div class="row"><h1>Komuniti</h1><button class="pill-loc" id="locBtn2">${I.pin}${esc(state.town === ALL ? 'Semua kawasan' : state.town)}</button></div>
        <div class="chip-row" role="group" aria-label="Topik">
          ${D.topics.map((t) => `<button class="topic" data-topic="${t.id}" aria-pressed="${state.topic === t.id}">${t.label}</button>`).join('')}
        </div>
      </header>
      <div class="pad stack page-body">
        <div class="hero-card">
          <span class="eyebrow">Papan warga Pahang</span>
          <span class="big">Tanya <span class="hl">port makan</span>, cari runner, atau kongsi open order hari ini.</span>
          <button class="white-btn" id="writeBtn">${I.pen}Tulis hantaran</button>
        </div>
        <section class="section" aria-labelledby="h-posts">
          <div class="sec-head"><h2 id="h-posts">Perbincangan</h2><span class="count">${posts.length} perkongsian</span></div>
          <div class="post-list">${posts.length ? posts.map(postCard).join('') : '<div class="panel empty"><span class="big" aria-hidden="true">💬</span><strong>Belum ada hantaran</strong><p>Jadi yang pertama tulis dalam topik ini.</p></div>'}</div>
        </section>
      </div>`;
    $('#writeBtn').onclick = openPostForm;
    $('#locBtn2').onclick = () => openTownPicker();
  }

  function postCard(p) {
    const topic = D.topics.find((t) => t.id === p.topic);
    const liked = state.liked.has(p.id);
    const initials = p.who.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return `
      <article class="panel post">
        <div class="post-head">
          <div class="avatar" aria-hidden="true">${esc(initials)}</div>
          <div class="who"><strong>${esc(p.who)}</strong><span>${esc(p.town)} · ${esc(p.ago)}</span></div>
          <span class="chip">${esc(topic ? topic.label : '')}</span>
        </div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.body)}</p>
        <div class="post-foot">
          <button class="ghost" data-like="${esc(p.id)}" aria-pressed="${liked}">${I.heart}${p.likes + (liked ? 1 : 0)} suka</button>
          <span class="ghost" aria-label="${p.replies} balasan">${I.chat}${p.replies} balasan</span>
          ${p.sample ? '<span class="ghost" style="margin-left:auto">Contoh</span>' : ''}
        </div>
      </article>`;
  }

  /* ---------- Skrin: Disimpan ---------- */
  function renderDisimpan() {
    const list = allKitchens().filter((k) => state.favs.has(k.id));
    view.innerHTML = `
      <header class="page-head pad"><div class="row"><h1>Disimpan</h1><span class="count muted small">${list.length} dapur</span></div></header>
      <div class="pad stack page-body">
        <div class="panel list-panel">${list.length ? list.map(kitchenCard).join('') : `<div class="empty in-panel"><span class="big" aria-hidden="true">🤍</span><strong>Belum ada yang disimpan</strong><p>Tekan ikon hati pada mana-mana dapur untuk simpan di sini.</p><button class="btn outline" style="max-width:240px" data-goto="home">Cari dapur</button></div>`}</div>
      </div>`;
  }

  /* ---------- Skrin: Akaun / Tentang ---------- */
  function renderAkaun() {
    const installed = isStandalone();
    view.innerHTML = `
      <header class="page-head pad"><div class="row"><h1>Akaun</h1></div></header>
      <div class="pad stack page-body">
        <section class="panel">
          <span class="eyebrow">Tentang</span>
          <div class="about-title"><h2>Dapurkita</h2><span class="mini-pill">${flag(true)}@pahang</span></div>
          <p class="muted" style="margin:0">Inisiatif komuniti percuma (PWA) yang menghubungkan pembeli dengan dapur rumah sekitar Bentong, Karak, Mempaga, Raub dan Janda Baik secara terus.</p>
        </section>

        <div class="install-card">
          <div class="head"><div class="ic">${I.phone}</div><div><strong>${installed ? 'Aplikasi sudah dipasang' : 'Pasang aplikasi'}</strong><span>Tanpa Play Store atau App Store</span></div></div>
          ${installed ? '' : `<button class="btn" id="installBtn">${I.dl}Pasang sekarang</button>`}
          <button class="link-btn" id="guideBtn">Lihat panduan pemasangan langkah demi langkah</button>
        </div>

        <section class="section" aria-labelledby="h-perks">
        <div class="sec-head"><h2 id="h-perks">Kelebihan app</h2></div>
        <div class="perks">
          <div class="perk"><span class="pi">${I.bolt}</span>Pasang ke skrin utama dalam 2 saat</div>
          <div class="perk"><span class="pi">${I.bell}</span>Notifikasi bila ada open order baru</div>
          <div class="perk"><span class="pi">${I.wa}</span>Pesan terus ke WhatsApp, tiada komisen</div>
        </div>
        </section>

        <section class="section" aria-labelledby="h-theme">
        <div class="sec-head"><h2 id="h-theme">Tema paparan</h2></div>
        <div class="panel tight">
        <div class="seg" role="group" aria-label="Tema paparan">
          <button data-theme-set="light" aria-pressed="${state.theme === 'light'}">${I.sun}Cerah</button>
          <button data-theme-set="dark" aria-pressed="${state.theme === 'dark'}">${I.moon}Gelap</button>
          <button data-theme-set="auto" aria-pressed="${state.theme === 'auto'}">${I.auto}Auto</button>
        </div>
        </div>
        </section>

        <section class="section" aria-labelledby="h-mine">
        <div class="sec-head"><h2 id="h-mine">Dapur & hantaran saya</h2></div>
        <div class="perks">
          <div class="perk"><span class="pi">${I.shop}</span>${state.myKitchens.length} iklan menu</div>
          <div class="perk"><span class="pi">${I.chat}</span>${state.myPosts.length} hantaran komuniti</div>
          <p class="perk-note muted small">Iklan dan hantaran anda kini disimpan di peranti ini sahaja. Ia akan dikongsi dengan semua pengguna bila pangkalan data disambung.</p>
        </div>
        </section>
        <button class="btn outline" id="splashAgain">Tunjuk skrin pembuka semula</button>
      </div>`;
    const ib = $('#installBtn');
    if (ib) ib.onclick = doInstall;
    $('#guideBtn').onclick = openGuide;
    $('#splashAgain').onclick = () => runSplash(true);
  }

  /* ---------- Router ---------- */
  const ORDER = ['home', 'komuniti', 'disimpan', 'akaun'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function render(anim) {
    document.querySelectorAll('.tab').forEach((b) => {
      if (b.dataset.tab === state.tab) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    ({ home: renderHome, komuniti: renderKomuniti, disimpan: renderDisimpan, akaun: renderAkaun })[state.tab]();
    if (anim && !reduceMotion.matches) animateView(anim);
  }

  /* Gelongsor halaman ikut arah tab + kemunculan berperingkat */
  function animateView(dir) {
    view.classList.remove('enter-r', 'enter-l', 'enter-f');
    void view.offsetWidth; // mula semula animasi
    view.classList.add(dir === 'r' ? 'enter-r' : dir === 'l' ? 'enter-l' : 'enter-f');
    const items = view.querySelectorAll('.list-panel > .row-item, .post-list > .post, .cats > .cat, .perks > .perk');
    items.forEach((el, i) => { el.style.setProperty('--i', Math.min(i, 10)); el.classList.add('rise'); });
  }

  function softList() {
    if (reduceMotion.matches) return;
    view.querySelectorAll('.list-panel > .row-item, .post-list > .post, .list-panel > .empty').forEach((el, i) => {
      el.style.setProperty('--i', Math.min(i, 8)); el.classList.add('rise');
    });
  }

  function go(tab, force) {
    if (tab === state.tab && !force) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (tab === state.tab) { window.scrollTo({ top: 0, behavior: 'instant' }); render('f'); showBar(); return; }
    const dir = ORDER.indexOf(tab) > ORDER.indexOf(state.tab) ? 'r' : 'l';
    state.tab = tab;
    window.scrollTo({ top: 0, behavior: 'instant' });
    render(dir);
    showBar();
  }

  /* Tab bar terapung: sembunyi bila skrol ke bawah, muncul bila skrol ke atas */
  const bar = $('.tabbar');
  let lastY = window.scrollY, ticking = false;
  function showBar() { bar.classList.remove('hide'); }
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 40;
      if (y > lastY + 8 && y > 140 && !nearBottom) bar.classList.add('hide');
      else if (y < lastY - 8 || y < 140 || nearBottom) bar.classList.remove('hide');
      lastY = y; ticking = false;
    });
  }, { passive: true });

  /* ---------- Sheet ---------- */
  let lastFocus = null;
  function openSheet(html, opts = {}) {
    lastFocus = document.activeElement;
    clearTimeout(closeTimer);
    backdrop.classList.remove('closing');
    sheet.className = 'sheet' + (opts.full ? ' full' : '');
    sheet.innerHTML = (opts.full ? '' : '<div class="grabber" aria-hidden="true"></div>') + html;
    sheet.hidden = false; backdrop.hidden = !!opts.full;
    document.body.style.overflow = 'hidden';
    const f = sheet.querySelector('input, select, textarea, button');
    if (f && !opts.noFocus) f.focus({ preventScroll: true });
  }
  let closeTimer;
  function closeSheet() {
    if (sheet.hidden) return;
    $('#plusBtn').classList.remove('open');
    const done = () => {
      sheet.hidden = true; backdrop.hidden = true; sheet.innerHTML = '';
      sheet.classList.remove('closing'); backdrop.classList.remove('closing');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };
    if (reduceMotion.matches) { done(); return; }
    sheet.classList.add('closing'); backdrop.classList.add('closing');
    closeTimer = setTimeout(done, 250);
  }
  backdrop.onclick = closeSheet;
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });
  const head = (title, eyebrow) => `<div class="sheet-head"><div>${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}<h2>${title}</h2></div><button class="close" data-close aria-label="Tutup">${I.x}</button></div>`;

  function openCreate() {
    $('#plusBtn').classList.add('open');
    openSheet(`${head('Apa nak buat?')}
      <button class="option primary" id="optSell"><span class="o-ico">${I.shop}</span><span class="o-txt"><strong>Iklan menu dapur rumah</strong><span>Terima pesanan terus ke WhatsApp, percuma</span></span>${I.chev}</button>
      <button class="option" id="optPost"><span class="o-ico">${I.chat}</span><span class="o-txt"><strong>Buka diskusi warga</strong><span>Cari makanan, open order, runner, review</span></span>${I.chev}</button>
      <div class="muted small" style="display:flex;align-items:center;justify-content:center;gap:8px">${flag(true)}Dapurkita @pahang · inisiatif komuniti</div>`, { noFocus: true });
    $('#optSell').onclick = openListingForm;
    $('#optPost').onclick = openPostForm;
  }

  function openTownPicker(pick) {
    const cur = pick || (state.town === ALL ? TOWNS[0] : state.town);
    const tick = (on) => on ? '<b aria-hidden="true">✓</b>' : '';
    const row = 'style="width:100%;border:0;background:none;text-align:left;justify-content:space-between"';
    openSheet(`${head('Pilih kawasan', 'Taman berdekatan')}
      <button class="option${state.town === ALL ? ' primary' : ''}" data-loc="${ALL}" data-taman=""><span class="o-ico">${I.pin}</span><span class="o-txt"><strong>Semua kawasan</strong><span>${TOWNS.join(' · ')}</span></span></button>
      <div class="chip-row" role="tablist" aria-label="Kawasan">
        ${TOWNS.map((t) => `<button class="topic" role="tab" data-pick-town="${esc(t)}" aria-pressed="${t === cur}" aria-selected="${t === cur}">${esc(t)}</button>`).join('')}
      </div>
      <div class="perks">
        <button class="perk" ${row} data-loc="${esc(cur)}" data-taman=""><span><b>Semua taman di ${esc(cur)}</b></span>${tick(state.town === cur && !state.taman)}</button>
        ${D.areas[cur].map((tm) => `<button class="perk" ${row} data-loc="${esc(cur)}" data-taman="${esc(tm)}">${esc(tm)}${tick(state.taman === tm)}</button>`).join('')}
      </div>
      <p class="muted small" style="margin:0">Taman anda tiada dalam senarai? Pilih “Semua taman di ${esc(cur)}”.</p>`, { noFocus: true });
  }

  function openDetail(id) {
    const k = allKitchens().find((x) => x.id === id);
    if (!k) return;
    const fav = state.favs.has(k.id);
    const photos = (k.photos || []).map(safeImg).filter(Boolean);
    openSheet(`${head(esc(k.name), esc((k.area ? k.area + ', ' : '') + k.town))}
      ${photos.length
        ? `<div class="gallery" aria-label="Foto makanan">${photos.map((src, i) => `<img src="${src}" alt="Foto makanan ${i + 1} dari ${esc(k.name)}" decoding="async">`).join('')}</div>${photos.length > 1 ? `<div class="dots" aria-hidden="true">${photos.map((_, i) => `<i${i ? '' : ' class="on"'}></i>`).join('')}</div>` : ''}`
        : `<div class="detail-thumb" aria-hidden="true">${esc(k.emoji || '🍽️')}</div>`}
      <div class="chips">${statusChip(k)}${(k.cats || []).map((c) => { const cc = D.categories.find((x) => x.id === c); return cc ? `<span class="chip">${cc.label}</span>` : ''; }).join('')}${k.sample ? '<span class="chip">Contoh</span>' : ''}</div>
      <p style="margin:0">${esc(k.desc)}</p>
      ${(k.menu && k.menu.length) ? `<div><div class="sec-head" style="margin-bottom:6px"><h2 style="font-size:16px">Menu</h2></div><div class="box">${k.menu.map((m) => `<div class="menu-item"><span>${esc(m[0])}</span>${m[1] ? `<b class="price">${esc(m[1])}</b>` : ''}</div>`).join('')}</div></div>` : ''}
      ${(k.hours || k.delivery) ? `<div class="box">
        ${k.hours ? `<div class="menu-item"><span class="muted">Masa</span><span>${esc(k.hours)}</span></div>` : ''}
        ${k.delivery ? `<div class="menu-item"><span class="muted">Penghantaran</span><span style="text-align:right">${esc(k.delivery)}</span></div>` : ''}
      </div>` : ''}
      <button class="btn accent" id="orderBtn">${I.bag}Buat pesanan</button>
      <div class="row2">
        <button class="btn outline" data-fav="${esc(k.id)}" aria-pressed="${fav}">${I.heart}${fav ? 'Disimpan' : 'Simpan'}</button>
        <button class="btn outline" id="shareBtn">${I.share}Kongsi</button>
      </div>`, { noFocus: true });
    $('#shareBtn').onclick = () => shareText(`${k.name} (${k.town}) di Dapurkita @pahang`);
    $('#orderBtn').onclick = () => openOrder(k);
    const g = sheet.querySelector('.gallery');
    if (g) g.addEventListener('scroll', () => {
      const i = Math.round(g.scrollLeft / g.clientWidth);
      sheet.querySelectorAll('.dots i').forEach((d, j) => d.classList.toggle('on', j === i));
    }, { passive: true });
  }

  /* ---------- Borang pesanan -> WhatsApp ---------- */
  function openOrder(k) {
    const saved = store.get('buyer', {});
    const items = (k.menu || []).map((m, i) => ({ i, name: m[0], label: m[1] || '', price: priceOf(m[1]), qty: 0 }));
    const tomorrow = new Date(Date.now() + 86400000);
    const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const minDate = k.status === 'preorder' ? iso(tomorrow) : iso(new Date());
    let method = saved.method === 'hantar' ? 'hantar' : 'ambil';

    openSheet(`<div class="sheet-head"><button class="close" data-back aria-label="Kembali">${I.back}</button><div style="flex:1;min-width:0"><span class="eyebrow">Pesanan kepada</span><h2 style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(k.name)}</h2></div></div>
      <form id="orderForm" class="stack" novalidate>
        <section class="section">
          <div class="sec-head"><h2>Pilih menu</h2><span class="count">${k.status === 'preorder' ? 'Pre-Order H-1' : 'Ready Stock'}</span></div>
          <div class="panel list-panel">
            ${items.length ? items.map((it) => `
              <div class="order-item">
                <div class="oi-txt"><strong>${esc(it.name)}</strong><span class="${it.label ? 'price' : ''}">${esc(it.label || 'Harga ikut peniaga')}</span></div>
                <div class="stepper" role="group" aria-label="Kuantiti ${esc(it.name)}">
                  <button type="button" data-step="-1" data-idx="${it.i}" aria-label="Kurang">${I.minus}</button>
                  <output id="q-${it.i}" aria-live="polite">0</output>
                  <button type="button" data-step="1" data-idx="${it.i}" aria-label="Tambah">${I.plus}</button>
                </div>
              </div>`).join('') : '<p class="muted small" style="margin:12px 0">Peniaga belum senaraikan menu. Tulis pesanan anda dalam nota di bawah.</p>'}
          </div>
        </section>

        <section class="section">
          <div class="sec-head"><h2>Cara terima</h2></div>
          <div class="panel">
            <div class="seg" role="group" aria-label="Cara terima">
              <button type="button" data-method="ambil" aria-pressed="${method === 'ambil'}">Ambil sendiri</button>
              <button type="button" data-method="hantar" aria-pressed="${method === 'hantar'}">Minta hantar</button>
            </div>
            <div class="field" id="o-addr-wrap" ${method === 'hantar' ? '' : 'hidden'}><label for="o-addr">Alamat penghantaran</label><textarea id="o-addr" maxlength="200" placeholder="No. rumah, jalan, taman">${esc(saved.addr || '')}</textarea><span class="hint">Caj penghantaran (jika ada) ditetapkan oleh peniaga.</span></div>
            <div class="row2">
              <div class="field"><label for="o-date">Tarikh</label><input id="o-date" type="date" min="${minDate}" value="${minDate}"></div>
              <div class="field"><label for="o-time">Masa</label><input id="o-time" type="time" value="12:00"></div>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="sec-head"><h2>Maklumat anda</h2></div>
          <div class="panel">
            <div class="field"><label for="o-name">Nama</label><input id="o-name" maxlength="40" autocomplete="name" placeholder="cth. Aisyah" value="${esc(saved.name || '')}"></div>
            <div class="field"><label for="o-phone">No. telefon (pilihan)</label><input id="o-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="cth. 012-345 6789" value="${esc(saved.phone || '')}"></div>
            <div class="field"><label for="o-note">Nota (pilihan)</label><textarea id="o-note" maxlength="300" placeholder="cth. Kurang pedas, tambah sambal">${''}</textarea></div>
          </div>
        </section>

        <div class="panel order-sum">
          <div class="sum-row"><span>Jumlah item</span><b id="o-count">0</b></div>
          <div class="sum-row total"><span>Anggaran jumlah</span><b id="o-total">RM0.00</b></div>
          <span class="hint" id="o-hint">Harga akhir disahkan oleh peniaga di WhatsApp.</span>
        </div>
        <details class="preview"><summary>Lihat mesej WhatsApp</summary><pre id="o-preview"></pre></details>
        <p class="small" id="orderErr" style="margin:0;font-weight:700" role="alert" hidden></p>
        <button class="btn accent" type="submit">${I.wa}${k.phone ? 'Hantar pesanan ke WhatsApp' : 'Semak pesanan (dapur contoh)'}</button>
      </form>`, { noFocus: true });

    const form = $('#orderForm');
    const val = (id) => ($('#' + id) ? $('#' + id).value.trim() : '');
    const fmtDate = (v) => { if (!v) return ''; const [y, m, d] = v.split('-'); return `${d}/${m}/${y}`; };
    const buildMsg = () => {
      const chosen = items.filter((it) => it.qty > 0);
      const known = chosen.every((it) => it.price != null);
      const total = chosen.reduce((sum, it) => sum + (it.price || 0) * it.qty, 0);
      const lines = [
        `Assalamualaikum ${k.name} 👋`,
        'Saya nak buat pesanan melalui *Dapurkita @pahang*:',
        '',
        ...(chosen.length ? chosen.map((it) => `• ${it.qty} x ${it.name}${it.price != null ? ` — ${rm(it.price * it.qty)}` : ''}`) : ['• (lihat nota)']),
        '',
        chosen.length ? `*Anggaran jumlah: ${rm(total)}${known ? '' : ' + item tanpa harga'}*` : null,
        `Cara terima: ${method === 'hantar' ? 'Minta hantar' : 'Ambil sendiri'}`,
        method === 'hantar' && val('o-addr') ? `Alamat: ${val('o-addr')}` : null,
        `Tarikh/masa: ${fmtDate(val('o-date'))} ${val('o-time')}`.trim(),
        `Nama: ${val('o-name') || '-'}`,
        val('o-phone') ? `Telefon: ${val('o-phone')}` : null,
        val('o-note') ? `Nota: ${val('o-note')}` : null,
        '',
        'Terima kasih!'
      ].filter((l) => l !== null);
      return { text: lines.join('\n').trim(), chosen, total, known };
    };
    const refresh = () => {
      const { text, chosen, total, known } = buildMsg();
      $('#o-count').textContent = chosen.reduce((n, it) => n + it.qty, 0);
      $('#o-total').textContent = rm(total) + (known ? '' : '+');
      $('#o-preview').textContent = text;
    };
    form.addEventListener('click', (e) => {
      const st = e.target.closest('[data-step]');
      if (st) {
        const it = items[+st.dataset.idx];
        it.qty = Math.max(0, Math.min(99, it.qty + (+st.dataset.step)));
        const out = $('#q-' + it.i); out.textContent = it.qty;
        out.classList.remove('bump'); void out.offsetWidth; out.classList.add('bump');
        out.closest('.order-item').classList.toggle('picked', it.qty > 0);
        refresh(); return;
      }
      const m = e.target.closest('[data-method]');
      if (m) {
        method = m.dataset.method;
        form.querySelectorAll('[data-method]').forEach((b) => b.setAttribute('aria-pressed', b === m));
        $('#o-addr-wrap').hidden = method !== 'hantar';
        refresh();
      }
    });
    form.addEventListener('input', refresh);
    refresh();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = $('#orderErr');
      const { text, chosen } = buildMsg();
      const fail = (msg, id) => { err.textContent = msg; err.hidden = false; if (id) $('#' + id).focus(); };
      if (!chosen.length && !val('o-note')) return fail('Pilih sekurang-kurangnya satu menu, atau tulis pesanan dalam nota.');
      if (!val('o-name')) return fail('Sila isi nama anda.', 'o-name');
      if (method === 'hantar' && !val('o-addr')) return fail('Sila isi alamat penghantaran.', 'o-addr');
      err.hidden = true;
      store.set('buyer', { name: val('o-name'), phone: val('o-phone'), addr: val('o-addr'), method });
      if (!k.phone) {
        $('.preview').open = true;
        toast('Ini dapur contoh, tiada nombor WhatsApp. Mesej di atas yang akan dihantar.');
        return;
      }
      const url = `https://wa.me/${k.phone}?text=${encodeURIComponent(text)}`;
      const w = window.open(url, '_blank', 'noopener');
      if (!w) location.href = url;
      toast('Membuka WhatsApp…');
    });
    sheet.querySelector('[data-back]').onclick = () => openDetail(k.id);
  }

  async function shareText(text) {
    const url = location.origin + location.pathname;
    try {
      if (navigator.share) { await navigator.share({ title: 'Dapurkita @pahang', text, url }); return; }
      await navigator.clipboard.writeText(text + ' ' + url);
      toast('Pautan disalin');
    } catch (e) { /* pengguna batal */ }
  }

  /* ---------- Borang ---------- */
  function openListingForm() {
    const cats = D.categories.filter((c) => !['semua', 'ready', 'preorder'].includes(c.id));
    openSheet(`${head('Iklan menu dapur', 'Percuma')}
      <form id="sellForm" class="stack" novalidate>
        <div class="field"><span style="font-size:13px;font-weight:700">Foto makanan <span class="muted" style="font-weight:600">(maks 3, yang pertama jadi gambar utama)</span></span>
          <div class="photo-grid" id="photoGrid"></div>
          <input id="f-photo" type="file" accept="image/*" multiple hidden>
        </div>
        <div class="field"><label for="f-name">Nama dapur</label><input id="f-name" required maxlength="50" placeholder="cth. Dapur Mak Long"></div>
        <div class="row2">
          <div class="field"><label for="f-town">Kawasan</label><select id="f-town">${TOWNS.map((t) => `<option${t === state.town ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></div>
          <div class="field"><label for="f-taman">Taman / kampung</label><select id="f-taman"></select></div>
        </div>
        <div class="field" id="f-other-wrap" hidden><label for="f-other">Nama taman / kampung</label><input id="f-other" maxlength="40" placeholder="cth. Taman Sri Bentong"></div>
        <div class="field"><span style="font-size:13px;font-weight:700">Status</span>
          <div class="seg" role="group" aria-label="Status"><button type="button" data-status="ready" aria-pressed="true">Ready Stock</button><button type="button" data-status="preorder" aria-pressed="false">Pre-Order</button></div></div>
        <div class="field"><span style="font-size:13px;font-weight:700">Kategori</span>
          <div class="chips">${cats.map((c) => `<button type="button" class="topic" data-pick="${c.id}" aria-pressed="false">${c.icon} ${c.label}</button>`).join('')}</div></div>
        <div class="field"><label for="f-desc">Penerangan</label><textarea id="f-desc" maxlength="300" placeholder="Apa yang istimewa tentang masakan anda?"></textarea></div>
        <div class="field"><label for="f-menu">Menu & harga</label><textarea id="f-menu" placeholder="Nasi lemak sambal sotong - RM7&#10;Karipap (10 biji) - RM10"></textarea><span class="hint">Satu item setiap baris. Guna tanda - sebelum harga.</span></div>
        <div class="field"><label for="f-phone">Nombor WhatsApp</label><input id="f-phone" type="tel" inputmode="tel" required placeholder="cth. 012-345 6789"><span class="hint">Pembeli akan hubungi nombor ini terus.</span></div>
        <div class="field"><label for="f-hours">Masa / cara ambil (pilihan)</label><input id="f-hours" maxlength="60" placeholder="cth. 7 pagi – 11 pagi, ambil sendiri"></div>
        <p class="muted small" id="sellErr" style="margin:0;color:var(--fg);font-weight:700" hidden></p>
        <button class="btn" type="submit">Terbitkan iklan</button>
      </form>`);
    const form = $('#sellForm');
    const fillTaman = () => {
      const t = $('#f-town').value;
      $('#f-taman').innerHTML = D.areas[t].map((tm) => `<option${tm === state.taman ? ' selected' : ''}>${esc(tm)}</option>`).join('') + '<option value="__lain">Lain-lain (taip sendiri)</option>';
      $('#f-other-wrap').hidden = true;
    };
    fillTaman();
    $('#f-town').onchange = fillTaman;
    $('#f-taman').onchange = () => { $('#f-other-wrap').hidden = $('#f-taman').value !== '__lain'; if (!$('#f-other-wrap').hidden) $('#f-other').focus(); };
    let status = 'ready';
    const picked = new Set();
    const photos = [];
    const drawPhotos = () => {
      $('#photoGrid').innerHTML = photos.map((src, i) => `<div class="ph"><img src="${src}" alt="Foto ${i + 1}">${i === 0 ? '<span class="ph-tag">Utama</span>' : ''}<button type="button" class="ph-del" data-del="${i}" aria-label="Buang foto ${i + 1}">${I.x}</button></div>`).join('')
        + (photos.length < 3 ? `<button type="button" class="ph-add" id="phAdd">${I.camera}<span>${photos.length ? 'Tambah' : 'Tambah foto'}</span></button>` : '');
      const add = $('#phAdd'); if (add) add.onclick = () => $('#f-photo').click();
    };
    drawPhotos();
    $('#f-photo').onchange = async (e) => {
      const files = [...e.target.files].slice(0, 3 - photos.length);
      e.target.value = '';
      for (const f of files) {
        try { photos.push(await resizeImage(f)); } catch (er) { toast(er.message); }
      }
      drawPhotos();
    };
    $('#photoGrid').addEventListener('click', (e) => {
      const d = e.target.closest('[data-del]');
      if (d) { photos.splice(+d.dataset.del, 1); drawPhotos(); }
    });
    form.addEventListener('click', (e) => {
      const s = e.target.closest('[data-status]');
      if (s) { status = s.dataset.status; form.querySelectorAll('[data-status]').forEach((b) => b.setAttribute('aria-pressed', b === s)); }
      const p = e.target.closest('[data-pick]');
      if (p) { const id = p.dataset.pick; picked.has(id) ? picked.delete(id) : picked.add(id); p.setAttribute('aria-pressed', picked.has(id)); }
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#f-name').value.trim();
      const phone = normalizePhone($('#f-phone').value);
      const err = $('#sellErr');
      if (!name) { err.textContent = 'Sila isi nama dapur.'; err.hidden = false; $('#f-name').focus(); return; }
      if (!phone) { err.textContent = 'Nombor WhatsApp tidak sah. Contoh: 012-345 6789.'; err.hidden = false; $('#f-phone').focus(); return; }
      const menu = $('#f-menu').value.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
        const i = l.lastIndexOf('-'); return i > 0 ? [l.slice(0, i).trim(), l.slice(i + 1).trim()] : [l, ''];
      });
      const k = {
        id: 'u' + Date.now(), name, town: $('#f-town').value, area: ($('#f-taman').value === '__lain' ? $('#f-other').value.trim() : $('#f-taman').value), emoji: '🍽️',
        status, cats: [...picked], desc: $('#f-desc').value.trim() || 'Masakan rumah dari dapur jiran.',
        menu, hours: $('#f-hours').value.trim(), delivery: '', phone, photos: photos.slice()
      };
      state.myKitchens.unshift(k);
      if (!store.set('myKitchens', state.myKitchens)) {
        // Storan peranti penuh: simpan tanpa foto
        k.photos = [];
        if (!store.set('myKitchens', state.myKitchens)) { state.myKitchens.shift(); err.textContent = 'Storan peranti penuh. Buang iklan lama dahulu.'; err.hidden = false; return; }
        toast('Storan penuh: iklan disimpan tanpa foto');
      }
      closeSheet(); state.cat = 'semua'; state.query = ''; setLoc(ALL, ''); go('home', true);
      toast('Iklan diterbitkan');
    });
  }

  function normalizePhone(v) {
    let d = String(v).replace(/\D/g, '');
    if (d.startsWith('0')) d = '6' + d;
    if (!d.startsWith('60')) d = '60' + d;
    return /^60\d{8,10}$/.test(d) ? d : '';
  }

  function openPostForm() {
    openSheet(`${head('Tulis hantaran', 'Komuniti')}
      <form id="postForm" class="stack" novalidate>
        <div class="row2">
          <div class="field"><label for="p-topic">Topik</label><select id="p-topic">${D.topics.slice(1).map((t) => `<option value="${t.id}">${t.label}</option>`).join('')}</select></div>
          <div class="field"><label for="p-town">Kawasan</label><select id="p-town">${TOWNS.map((t) => `<option${t === state.town ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></div>
        </div>
        <div class="field"><label for="p-name">Nama paparan</label><input id="p-name" maxlength="30" placeholder="cth. Aisyah S." value="${esc(store.get('displayName', ''))}"></div>
        <div class="field"><label for="p-title">Tajuk</label><input id="p-title" maxlength="80" required placeholder="cth. Siapa jual nasi kerabu area Karak?"></div>
        <div class="field"><label for="p-body">Butiran</label><textarea id="p-body" maxlength="500" placeholder="Tulis butiran di sini…"></textarea></div>
        <p class="small" id="postErr" style="margin:0;font-weight:700" hidden></p>
        <button class="btn" type="submit">Hantar</button>
      </form>`);
    $('#postForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = $('#p-title').value.trim();
      if (!title) { const er = $('#postErr'); er.textContent = 'Sila isi tajuk hantaran.'; er.hidden = false; $('#p-title').focus(); return; }
      const who = $('#p-name').value.trim() || 'Warga Pahang';
      store.set('displayName', who);
      const p = { id: 'up' + Date.now(), topic: $('#p-topic').value, who, town: $('#p-town').value, ago: 'Baru tadi', title, body: $('#p-body').value.trim(), likes: 0, replies: 0 };
      state.myPosts.unshift(p); store.set('myPosts', state.myPosts);
      closeSheet(); state.topic = 'semua'; go('komuniti', true);
      toast('Hantaran diterbitkan');
    });
  }

  /* ---------- Panduan pemasangan ---------- */
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

  function guideSteps(os) {
    const step = (n, t, s, ico) => `<div class="step"><span class="n">${n}</span><span class="t"><strong>${t}</strong><span>${s}</span></span>${ico ? `<span class="ico" aria-hidden="true">${ico}</span>` : ''}</div>`;
    return os === 'ios'
      ? step(1, 'Buka di Safari', 'Buka pautan Dapurkita di Safari, bukan di dalam WhatsApp atau Facebook.') +
        step(2, 'Tekan butang Kongsi', 'Ikon kotak dengan anak panah ke atas, di bar bawah atau atas.', I.share) +
        step(3, 'Pilih “Tambah ke Skrin Utama”', 'Skrol ke bawah senarai jika tak nampak.', I.plusSq) +
        step(4, 'Tekan “Tambah”', 'Di penjuru kanan atas. Ikon Dapurkita akan muncul di skrin utama.')
      : step(1, 'Buka di Chrome', 'Atau tekan “Pasang sekarang” di skrin Akaun jika butang itu muncul.') +
        step(2, 'Tekan menu ⋮', 'Tiga titik di penjuru kanan atas.', I.dots) +
        step(3, 'Pilih “Pasang aplikasi”', 'Sesetengah telefon tulis “Tambah ke skrin utama”.', I.dl) +
        step(4, 'Tekan “Pasang”', 'Ikon Dapurkita akan muncul di skrin utama.');
  }

  function openGuide() {
    let os = isIOS() ? 'ios' : 'android';
    const draw = () => {
      openSheet(`
        <div class="sheet-head"><button class="close" data-close aria-label="Kembali">${I.back}</button><span class="muted small" style="align-self:center;flex:1">Panduan pemasangan</span></div>
        <div><h2 style="margin:0 0 6px;font-size:24px;letter-spacing:-.5px">Pasang Dapurkita di telefon anda</h2>
        <p class="muted" style="margin:0">Percuma dan terus muncul di skrin utama macam app biasa.</p></div>
        <div class="seg" role="tablist" aria-label="Jenis telefon">
          <button role="tab" data-os="ios" aria-pressed="${os === 'ios'}" aria-selected="${os === 'ios'}">iPhone</button>
          <button role="tab" data-os="android" aria-pressed="${os === 'android'}" aria-selected="${os === 'android'}">Android</button>
        </div>
        <div class="steps">${guideSteps(os)}</div>
        <div class="note">${I.info}<span>Buka pautan dari WhatsApp? Tekan ⋮ atau ikon kompas dan pilih “Buka dalam pelayar” dahulu.</span></div>
        <button class="btn" data-close>Faham, tutup panduan</button>`, { full: true, noFocus: true });
      sheet.querySelectorAll('[data-os]').forEach((b) => { b.onclick = () => { os = b.dataset.os; draw(); }; });
    };
    draw();
  }

  /* ---------- Pemasangan PWA ---------- */
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; toast('Dapurkita dipasang!'); if (state.tab === 'akaun') render(); });
  async function doInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch (e) { /* abaikan */ }
      deferredPrompt = null;
    } else {
      openGuide();
    }
  }

  async function askNotif() {
    if (!('Notification' in window)) { toast('Notifikasi tidak disokong di pelayar ini'); return; }
    if (Notification.permission === 'granted') { toast('Notifikasi sudah aktif'); return; }
    try {
      const r = await Notification.requestPermission();
      toast(r === 'granted' ? 'Notifikasi diaktifkan' : 'Notifikasi tidak dibenarkan');
    } catch (e) { toast('Pasang app dahulu untuk notifikasi'); }
  }

  /* ---------- Delegasi klik global ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target;
    const fav = t.closest('[data-fav]');
    if (fav) {
      e.stopPropagation();
      const id = fav.dataset.fav;
      const on = !state.favs.has(id);
      on ? state.favs.add(id) : state.favs.delete(id);
      store.set('favs', [...state.favs]);
      toast(on ? 'Disimpan' : 'Dibuang dari Disimpan');
      if (!sheet.hidden && sheet.contains(fav)) { openDetail(id); }
      render();
      return;
    }
    const open = t.closest('[data-open]');
    if (open) { openDetail(open.dataset.open); return; }
    const cat = t.closest('[data-cat]');
    if (cat) { state.cat = cat.dataset.cat; render(); softList(); return; }
    const topic = t.closest('[data-topic]');
    if (topic) { state.topic = topic.dataset.topic; render(); softList(); return; }
    const like = t.closest('[data-like]');
    if (like) {
      const id = like.dataset.like;
      state.liked.has(id) ? state.liked.delete(id) : state.liked.add(id);
      store.set('liked', [...state.liked]); render(); return;
    }
    const pt = t.closest('[data-pick-town]');
    if (pt) { openTownPicker(pt.dataset.pickTown); return; }
    const loc = t.closest('[data-loc]');
    if (loc) { setLoc(loc.dataset.loc, loc.dataset.taman); closeSheet(); render(); toast('Kawasan: ' + locLabel()); return; }
    const th = t.closest('[data-theme-set]');
    if (th) { state.theme = th.dataset.themeSet; store.set('theme', state.theme); applyTheme(); render(); return; }
    if (t.closest('[data-close]')) { closeSheet(); return; }
    const gt = t.closest('[data-goto]');
    if (gt) { go(gt.dataset.goto); return; }
    if (t.closest('[data-action="reset"]')) { state.cat = 'semua'; state.query = ''; setLoc(ALL, ''); render(); return; }
    const tab = t.closest('.tab');
    if (tab) { go(tab.dataset.tab); }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-open]')) { e.preventDefault(); openDetail(e.target.dataset.open); }
  });
  $('#plusBtn').onclick = openCreate;

  /* ---------- Splash ---------- */
  function runSplash(replay) {
    const sp = $('#splash');
    const bar = $('#splashBar'), pct = $('#splashPct'), msg = $('#splashMsg');
    const msgs = ['Memulakan dapur tempatan…', 'Memanaskan kuali…', 'Menyusun menu jiran…', 'Hampir siap!'];
    sp.hidden = false; sp.classList.remove('leave');
    let p = 0;
    const fast = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return new Promise((resolve) => {
      const tick = () => {
        p = Math.min(100, p + (fast ? 50 : 6 + Math.random() * 10));
        bar.style.width = p + '%'; pct.textContent = Math.round(p) + '%';
        msg.textContent = msgs[Math.min(msgs.length - 1, Math.floor(p / 26))];
        if (p < 100) { setTimeout(tick, fast ? 60 : 110); return; }
        setTimeout(() => {
          sp.classList.add('leave');
          $('#app').hidden = false;
          setTimeout(() => { sp.hidden = true; resolve(); }, 420);
        }, replay ? 300 : 200);
      };
      tick();
    });
  }

  render();
  runSplash(false).then(() => animateView('f'));

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
