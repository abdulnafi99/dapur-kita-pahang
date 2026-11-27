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
    myPosts: store.get('myPosts', []),
    /* Data dikongsi dari Firebase (null = belum dimuat) */
    remoteKitchens: null,
    remotePosts: null,
    remoteLikes: {},
    online: false
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
    sparkle: '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
    fork: '<svg viewBox="0 0 24 24"><path d="M7 2v8a2 2 0 0 0 2 2v10"/><path d="M11 2v8a2 2 0 0 1-2 2"/><path d="M9 2v6"/><path d="M17 2c-1.7 1.3-2.5 3.6-2.5 6.5V13H17v9"/></svg>'
  };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeImg = (src) => (typeof src === 'string' && /^data:image\/(jpeg|png|webp);base64,/.test(src)) ? src : '';
  const coverOf = (k) => safeImg(k.cover) || safeImg((k.photos || [])[0]);
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

  function shrinkDataUrl(src, max, quality) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Gambar tidak dapat dibaca'));
      img.src = src;
    });
  }
  const withTimeout = (pr, ms) => Promise.race([pr, new Promise((_, rej) => setTimeout(() => rej(new Error('masa tamat')), ms))]);

  /* Harga: "RM7.50" -> 7.5 */
  const priceOf = (txt) => { const m = String(txt || '').replace(/,/g, '').match(/(\d+(?:\.\d{1,2})?)/); return m ? parseFloat(m[1]) : null; };
  const rm = (n) => 'RM' + n.toFixed(2);

  /* Tempoh tempahan Pre-Order (hari) */
  const LEADS = [{ d: 1, t: '1 hari' }, { d: 3, t: '3 hari' }, { d: 7, t: '1 minggu' }, { d: 30, t: '1 bulan' }];
  const leadOf = (k) => (LEADS.some((l) => l.d === +k.lead) ? +k.lead : 1);
  const leadText = (k) => LEADS.find((l) => l.d === leadOf(k)).t;

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
  const arr = (v) => (Array.isArray(v) ? v : v && typeof v === 'object' ? Object.values(v) : []);
  const normKitchen = (k) => ({ ...k, cats: arr(k.cats), menu: arr(k.menu).map((m) => arr(m)) });
  function agoText(ts) {
    if (!ts) return 'Baru tadi';
    const m = Math.max(0, Math.round((Date.now() - ts) / 60000));
    if (m < 1) return 'Baru tadi';
    if (m < 60) return m + ' min';
    const h = Math.round(m / 60);
    if (h < 24) return h + ' jam';
    const d = Math.round(h / 24);
    return d === 1 ? 'Semalam' : d + ' hari';
  }
  const normPost = (p) => {
    const likes = state.remoteLikes[p.id] || {};
    return { ...p, ago: agoText(p.createdAt), likes: Object.keys(likes).length, replies: 0, likedRemote: !!(fb() && fb().uid && likes[fb().uid]) };
  };
  const fb = () => window.DK_FB || null;
  const isMine = (x) => !!(x.remote && fb() && fb().uid && x.owner === fb().uid);
  /* Contoh hanya ditunjuk selagi belum ada data sebenar */
  const allKitchens = () => {
    const remote = (state.remoteKitchens || []).map(normKitchen);
    const real = [...remote, ...state.myKitchens];
    return real.length ? real : D.kitchens;
  };
  const allPosts = () => {
    const remote = (state.remotePosts || []).map(normPost);
    const real = [...remote, ...state.myPosts];
    return real.length ? real : D.posts;
  };

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
      : `<span class="chip"><span class="dot po"></span>Pre-Order · ${leadText(k)}</span>`;
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
    const liked = p.remote ? p.likedRemote : state.liked.has(p.id);
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
          <button class="ghost" data-like="${esc(p.id)}" aria-pressed="${liked}">${I.heart}${p.remote ? p.likes : p.likes + (liked ? 1 : 0)} suka</button>
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
          ${mineRows()}
          <p class="perk-note muted small"><span class="net-dot ${state.online ? 'on' : ''}"></span>${state.online ? 'Disambung ke pangkalan data. Iklan dan hantaran anda boleh dilihat oleh semua pengguna.' : 'Tiada sambungan ke pangkalan data. Iklan baru akan disimpan di peranti ini sahaja.'}</p>
        </div>
        </section>
        <div class="row2">
          <button class="btn outline" id="tourAgain">${I.sparkle}Panduan interaktif</button>
          <button class="btn outline" id="splashAgain">Skrin pembuka</button>
        </div>
      </div>`;
    const ib = $('#installBtn');
    if (ib) ib.onclick = doInstall;
    $('#guideBtn').onclick = openGuide;
    $('#splashAgain').onclick = () => runSplash(true);
    $('#tourAgain').onclick = () => Tour.start();
  }

  function mineRows() {
    const ks = allKitchens().filter((k) => isMine(k) || (!k.remote && !k.sample));
    const ps = allPosts().filter((p) => isMine(p) || (!p.remote && !p.sample));
    if (!ks.length && !ps.length) return `<div class="perk"><span class="pi">${I.shop}</span>Belum ada iklan atau hantaran. Tekan + untuk mula.</div>`;
    const row = (x, kind) => `<div class="perk mine-row"><span class="pi">${kind === 'k' ? I.shop : I.chat}</span>
      <span class="mine-txt"><strong>${esc(kind === 'k' ? x.name : x.title)}</strong><span class="muted small">${kind === 'k' ? 'Iklan menu' : 'Hantaran'}${x.remote ? '' : ' · peranti ini sahaja'}</span></span>
      <button class="del-btn" data-del-${kind}="${esc(x.id)}" aria-label="Padam ${esc(kind === 'k' ? x.name : x.title)}">Padam</button></div>`;
    return ks.map((k) => row(k, 'k')).join('') + ps.map((p) => row(p, 'p')).join('');
  }

  async function deleteItem(kind, id, btn) {
    if (btn.dataset.armed !== '1') { btn.dataset.armed = '1'; btn.textContent = 'Pasti?'; setTimeout(() => { if (btn.isConnected) { btn.dataset.armed = ''; btn.textContent = 'Padam'; } }, 3000); return; }
    btn.disabled = true; btn.textContent = '…';
    const list = kind === 'k' ? state.myKitchens : state.myPosts;
    const localIdx = list.findIndex((x) => x.id === id);
    try {
      if (localIdx >= 0) { list.splice(localIdx, 1); store.set(kind === 'k' ? 'myKitchens' : 'myPosts', list); }
      else if (kind === 'k') await fb().deleteKitchen(id);
      else await fb().deletePost(id);
      toast(kind === 'k' ? 'Iklan dipadam' : 'Hantaran dipadam');
    } catch (e) { toast('Gagal padam: ' + (e.message || e)); }
    render();
  }

  /* ---------- Firebase: data masa nyata ---------- */
  let fbStarted = false;
  function startFirebase() {
    const F = fb();
    if (!F || fbStarted) return;
    fbStarted = true;
    const onErr = (e) => { console.warn('[Dapurkita] Firebase:', e && e.message); };
    F.onConnection((on) => { state.online = on; if (state.tab === 'akaun') softRender(); });
    F.onKitchens((list) => { state.remoteKitchens = list; softRender(); }, onErr);
    F.onPosts((list) => { state.remotePosts = list; softRender(); }, onErr);
    F.onLikes((likes) => { state.remoteLikes = likes; if (state.tab === 'komuniti') softRender(); }, onErr);
    F.authReady.then(() => softRender());
  }
  /* Kemas kini tanpa ganggu input yang sedang ditaip */
  function softRender() {
    if ($('#splash') && !$('#splash').hidden && $('#app').hidden) { render(); return; }
    if (state.tab === 'home' && $('#klist')) {
      const l = filteredKitchens();
      $('#klist').innerHTML = listOrEmpty(l);
      $('#count').textContent = l.length + ' dapur';
      return;
    }
    if (state.tab === 'komuniti' && $('.post-list')) {
      const posts = allPosts().filter((p) => state.topic === 'semua' || p.topic === state.topic);
      $('.post-list').innerHTML = posts.length ? posts.map(postCard).join('') : '<div class="panel empty"><span class="big" aria-hidden="true">💬</span><strong>Belum ada hantaran</strong><p>Jadi yang pertama tulis dalam topik ini.</p></div>';
      const c = view.querySelector('#h-posts + .count'); if (c) c.textContent = posts.length + ' perkongsian';
      return;
    }
    if (document.activeElement && view.contains(document.activeElement) && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    render();
  }
  if (fb()) startFirebase(); else window.addEventListener('dk-firebase-ready', startFirebase, { once: true });

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
      if (document.body.classList.contains('touring')) { lastY = y; ticking = false; return; }
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
    const photos = (k.photos && k.photos.length ? k.photos : k.cover ? [k.cover] : []).map(safeImg).filter(Boolean);
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
    if (k.remote && (k.photoCount || 0) > 0 && !k._fullLoaded && fb()) {
      fb().getPhotos(k.id).then((list) => {
        const imgs = list.map(safeImg).filter(Boolean);
        const gal = sheet.querySelector('.gallery');
        if (!imgs.length || !gal || sheet.hidden) return;
        gal.innerHTML = imgs.map((src, i) => `<img src="${src}" alt="Foto makanan ${i + 1} dari ${esc(k.name)}" decoding="async">`).join('');
        let dots = sheet.querySelector('.dots');
        if (imgs.length > 1 && !dots) { gal.insertAdjacentHTML('afterend', '<div class="dots" aria-hidden="true"></div>'); dots = sheet.querySelector('.dots'); }
        if (dots) dots.innerHTML = imgs.map((_, i) => `<i${i ? '' : ' class="on"'}></i>`).join('');
      }).catch(() => {});
    }
    const g = sheet.querySelector('.gallery');
    if (g) g.addEventListener('scroll', () => {
      const i = Math.round(g.scrollLeft / g.clientWidth);
      sheet.querySelectorAll('.dots i').forEach((d, j) => d.classList.toggle('on', j === i));
    }, { passive: true });
  }

  /* ---------- Borang pesanan -> WhatsApp ---------- */
  function fmtDay(d) {
    try { return d.toLocaleDateString('ms-MY', { weekday: 'short', day: 'numeric', month: 'short' }); }
    catch (e) { return d.toISOString().slice(0, 10); }
  }

  function openOrder(k) {
    const saved = store.get('buyer', {});
    const items = (k.menu || []).map((m, i) => ({ i, name: m[0], label: m[1] || '', price: priceOf(m[1]), qty: 0 }));
    const earliest = new Date(Date.now() + (k.status === 'preorder' ? leadOf(k) : 0) * 86400000);
    const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const minDate = iso(earliest);
    let method = saved.method === 'hantar' ? 'hantar' : 'ambil';

    openSheet(`<div class="sheet-head"><button class="close" data-back aria-label="Kembali">${I.back}</button><div style="flex:1;min-width:0"><span class="eyebrow">Pesanan kepada</span><h2 style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(k.name)}</h2></div></div>
      <form id="orderForm" class="stack" novalidate>
        <section class="section">
          <div class="sec-head"><h2>Pilih menu</h2><span class="count">${k.status === 'preorder' ? 'Pre-Order · tempah ' + leadText(k) + ' awal' : 'Ready Stock'}</span></div>
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
            ${k.status === 'preorder' ? `<span class="hint lead-hint">${I.info}<span>Dapur ini terima tempahan sekurang-kurangnya <b>${leadText(k)}</b> lebih awal. Tarikh paling awal: <b>${fmtDay(earliest)}</b>.</span></span>` : ''}
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
        k.status === 'preorder' ? `Jenis: Pre-Order (tempah ${leadText(k)} awal)` : null,
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
      if (!val('o-date') || val('o-date') < minDate) return fail(k.status === 'preorder' ? `Dapur ini perlukan tempahan ${leadText(k)} awal. Pilih ${fmtDay(earliest)} atau selepasnya.` : 'Sila pilih tarikh.', 'o-date');
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
        <div class="field" id="f-lead-wrap" hidden><span style="font-size:13px;font-weight:700">Tempoh tempahan awal</span>
          <div class="seg seg-4" role="group" aria-label="Tempoh tempahan awal">${LEADS.map((l) => `<button type="button" data-lead="${l.d}" aria-pressed="${l.d === 1}">${l.t}</button>`).join('')}</div>
          <span class="hint">Pembeli hanya boleh pilih tarikh selepas tempoh ini.</span></div>
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
    let lead = 1;
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
        try { photos.push(await resizeImage(f, 900, 0.7)); } catch (er) { toast(er.message); }
      }
      drawPhotos();
    };
    $('#photoGrid').addEventListener('click', (e) => {
      const d = e.target.closest('[data-del]');
      if (d) { photos.splice(+d.dataset.del, 1); drawPhotos(); }
    });
    form.addEventListener('click', (e) => {
      const s = e.target.closest('[data-status]');
      if (s) { status = s.dataset.status; form.querySelectorAll('[data-status]').forEach((b) => b.setAttribute('aria-pressed', b === s)); $('#f-lead-wrap').hidden = status !== 'preorder'; }
      const ld = e.target.closest('[data-lead]');
      if (ld) { lead = +ld.dataset.lead; form.querySelectorAll('[data-lead]').forEach((b) => b.setAttribute('aria-pressed', b === ld)); }
      const p = e.target.closest('[data-pick]');
      if (p) { const id = p.dataset.pick; picked.has(id) ? picked.delete(id) : picked.add(id); p.setAttribute('aria-pressed', picked.has(id)); }
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = $('#f-name').value.trim();
      const phone = normalizePhone($('#f-phone').value);
      const err = $('#sellErr');
      if (!name) { err.textContent = 'Sila isi nama dapur.'; err.hidden = false; $('#f-name').focus(); return; }
      if (!phone) { err.textContent = 'Nombor WhatsApp tidak sah. Contoh: 012-345 6789.'; err.hidden = false; $('#f-phone').focus(); return; }
      const menu = $('#f-menu').value.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
        const i = l.lastIndexOf('-'); return i > 0 ? [l.slice(0, i).trim(), l.slice(i + 1).trim()] : [l, ''];
      });
      const data = {
        name: name.slice(0, 60), town: $('#f-town').value, area: ($('#f-taman').value === '__lain' ? $('#f-other').value.trim() : $('#f-taman').value).slice(0, 60), emoji: '🍽️',
        status, cats: [...picked], desc: ($('#f-desc').value.trim() || 'Masakan rumah dari dapur jiran.').slice(0, 400),
        menu: menu.slice(0, 30).map((m) => [m[0].slice(0, 80), (m[1] || '').slice(0, 80)]), hours: $('#f-hours').value.trim().slice(0, 80), phone
      };
      if (status === 'preorder') data.lead = lead;
      const submitBtn = form.querySelector('button[type=submit]');
      if (fb()) {
        submitBtn.disabled = true; submitBtn.textContent = 'Menerbitkan…';
        try {
          data.photoCount = photos.length;
          if (photos.length) data.cover = await shrinkDataUrl(photos[0], 360, 0.7);
          await withTimeout(fb().addKitchen(data, photos.slice()), 20000);
          closeSheet(); state.cat = 'semua'; state.query = ''; setLoc(ALL, ''); go('home', true);
          toast('Iklan diterbitkan untuk semua pembeli');
          return;
        } catch (er) {
          submitBtn.disabled = false; submitBtn.textContent = 'Terbitkan iklan';
          err.textContent = 'Tidak dapat terbit ke pangkalan data (' + (er.message || er) + '). Iklan disimpan di peranti ini dahulu.';
          err.hidden = false;
          delete data.cover; delete data.photoCount;
        }
      }
      const k = { ...data, id: 'u' + Date.now(), delivery: '', photos: photos.slice() };
      state.myKitchens.unshift(k);
      if (!store.set('myKitchens', state.myKitchens)) {
        // Storan peranti penuh: simpan tanpa foto
        k.photos = [];
        if (!store.set('myKitchens', state.myKitchens)) { state.myKitchens.shift(); err.textContent = 'Storan peranti penuh. Buang iklan lama dahulu.'; err.hidden = false; return; }
        toast('Storan penuh: iklan disimpan tanpa foto');
      }
      closeSheet(); state.cat = 'semua'; state.query = ''; setLoc(ALL, ''); go('home', true);
      toast(fb() ? 'Disimpan di peranti ini (tiada sambungan)' : 'Iklan disimpan di peranti ini');
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
    $('#postForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = $('#p-title').value.trim();
      if (!title) { const er = $('#postErr'); er.textContent = 'Sila isi tajuk hantaran.'; er.hidden = false; $('#p-title').focus(); return; }
      const who = $('#p-name').value.trim() || 'Warga Pahang';
      store.set('displayName', who);
      const data = { topic: $('#p-topic').value, who: who.slice(0, 40), town: $('#p-town').value, title: title.slice(0, 100), body: $('#p-body').value.trim().slice(0, 600) };
      if (fb()) {
        const btn = $('#postForm button[type=submit]'); btn.disabled = true; btn.textContent = 'Menghantar…';
        try {
          await withTimeout(fb().addPost(data), 15000);
          closeSheet(); state.topic = 'semua'; go('komuniti', true);
          toast('Hantaran diterbitkan');
          return;
        } catch (er) {
          btn.disabled = false; btn.textContent = 'Hantar';
          toast('Tiada sambungan: disimpan di peranti ini (' + (er.message || er) + ')');
        }
      }
      const p = { ...data, id: 'up' + Date.now(), ago: 'Baru tadi', likes: 0, replies: 0 };
      state.myPosts.unshift(p); store.set('myPosts', state.myPosts);
      closeSheet(); state.topic = 'semua'; go('komuniti', true);
      if (!fb()) toast('Hantaran disimpan di peranti ini');
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
    const dk = t.closest('[data-del-k]');
    if (dk) { deleteItem('k', dk.dataset.delK, dk); return; }
    const dp = t.closest('[data-del-p]');
    if (dp) { deleteItem('p', dp.dataset.delP, dp); return; }
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
      const post = allPosts().find((x) => x.id === id);
      if (post && post.remote && fb()) {
        fb().setLike(id, !post.likedRemote).catch((er) => toast('Gagal: ' + (er.message || er)));
        return;
      }
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


  /* ---------- Panduan interaktif (spotlight titik ke titik) ---------- */
  const Tour = (() => {
    const inApp = () => /FBAN|FBAV|Instagram|WhatsApp|Line\/|TikTok|Messenger/i.test(navigator.userAgent);
    const isAndroid = () => /android/i.test(navigator.userAgent);
    const isIPad = () => navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    let steps = [], idx = 0, root, hole, tip, ring, active = false;

    const T = (sel) => () => document.querySelector(sel);
    function build() {
      const list = [
        { tab: 'home', target: T('#locBtn'), title: 'Pilih kawasan anda', text: 'Tekan di sini untuk pilih Bentong, Karak, Mempaga, Raub atau Janda Baik, dan taman berdekatan.' },
        { tab: 'home', target: T('.search'), title: 'Cari makanan', text: 'Taip nama menu, kuih atau dapur. Senarai terus ditapis.' },
        { tab: 'home', target: T('.cats'), title: 'Pilih selera', text: 'Tapis ikut Ready Stock, Pre-Order atau jenis makanan.', pad: 6 },
        { tab: 'home', target: T('#klist .row-item'), title: 'Buka dapur & pesan', text: 'Tekan mana-mana dapur untuk lihat menu, foto dan harga. Kemudian tekan “Buat pesanan” dan pesanan terus dihantar ke WhatsApp peniaga.' },
        { tab: 'home', target: T('#klist .fav'), title: 'Simpan kegemaran', text: 'Tekan ikon hati untuk simpan dapur. Ia muncul dalam tab Disimpan.', round: true },
        { tab: 'home', target: T('#plusBtn'), title: 'Peniaga? Iklan percuma', text: 'Tekan + untuk iklankan menu dapur anda, atau tulis hantaran komuniti.', round: true },
        { tab: 'home', target: T('.tab[data-tab="komuniti"]'), title: 'Komuniti warga', text: 'Tanya port makan, cari runner atau kongsi open order dengan jiran.', round: true }
      ];
      if (isStandalone()) {
        list.push({ title: 'Siap! 🎉', text: 'Aplikasi sudah dipasang di skrin utama. Selamat menjamu selera!', final: true });
        return list;
      }
      list.push({ tab: 'akaun', target: T('.install-card'), title: 'Pasang ke skrin utama', text: 'Akhir sekali, pasang Dapurkita supaya boleh dibuka macam app biasa. Ikut langkah seterusnya.' });
      if (inApp()) {
        list.push({ chrome: 'top-right', title: 'Buka dalam pelayar dahulu', text: 'Anda sedang buka dari dalam WhatsApp/Facebook. Tekan ⋮ atau ikon kompas di atas, kemudian pilih “Buka dalam pelayar” (Safari atau Chrome).' });
      } else if (isIOS()) {
        const pos = isIPad() ? 'top-right' : 'bottom';
        list.push({ chrome: pos, icon: I.share, title: '1. Tekan butang Kongsi', text: 'Ikon kotak dengan anak panah ke atas, di bar Safari ' + (isIPad() ? 'atas.' : 'bawah.') });
        list.push({ chrome: pos, icon: I.plusSq, title: '2. “Tambah ke Skrin Utama”', text: 'Skrol senarai ke bawah dan pilih “Tambah ke Skrin Utama”.' });
        list.push({ chrome: 'top-right', title: '3. Tekan “Tambah”', text: 'Di penjuru kanan atas. Ikon Dapurkita akan muncul di skrin utama anda.' });
      } else if (deferredPrompt) {
        list.push({ tab: 'akaun', target: T('#installBtn'), title: 'Tekan “Pasang sekarang”', text: 'Pengesahan akan muncul. Tekan “Pasang” dan ikon Dapurkita akan berada di skrin utama.', action: { label: 'Pasang sekarang', run: () => doInstall() } });
      } else if (isAndroid()) {
        list.push({ chrome: 'top-right', icon: I.dots, title: '1. Tekan menu ⋮', text: 'Tiga titik di penjuru kanan atas Chrome.' });
        list.push({ chrome: 'top-right', icon: I.dl, title: '2. “Pasang aplikasi”', text: 'Pilih “Pasang aplikasi” atau “Tambah ke skrin utama”, kemudian tekan “Pasang”.' });
      } else {
        list.push({ chrome: 'top-right', icon: I.dl, title: 'Pasang dari bar alamat', text: 'Tekan ikon pasang di hujung kanan bar alamat pelayar, kemudian “Pasang”.' });
      }
      list.push({ title: 'Siap! 🎉', text: 'Anda sudah tahu semua yang penting. Selamat mencari makanan sedap di Pahang!', final: true });
      return list;
    }

    function mount() {
      root = document.createElement('div');
      root.className = 'tour';
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      root.setAttribute('aria-label', 'Panduan interaktif');
      root.innerHTML = '<div class="tour-hole"></div><div class="tour-ring"></div><div class="tour-tip" tabindex="-1"></div>';
      document.body.appendChild(root);
      hole = root.querySelector('.tour-hole'); ring = root.querySelector('.tour-ring'); tip = root.querySelector('.tour-tip');
      root.addEventListener('click', (e) => {
        const b = e.target.closest('[data-tour]');
        if (b) { const a = b.dataset.tour; if (a === 'next') next(); else if (a === 'back') back(); else if (a === 'skip') end(); else if (a === 'act') { const st = steps[idx]; st.action.run(); next(); } }
      });
    }

    function place() {
      if (!active) return;
      const st = steps[idx];
      const el = st.target ? st.target() : null;
      const vw = window.innerWidth, vh = window.innerHeight;
      root.classList.toggle('dim-only', !el);
      root.dataset.chrome = st.chrome || '';
      if (el) {
        const r = el.getBoundingClientRect(), pad = st.pad != null ? st.pad : 8;
        const x = r.left - pad, y = r.top - pad, w = r.width + pad * 2, h = r.height + pad * 2;
        const rad = st.round ? Math.min(w, h) / 2 : 18;
        Object.assign(hole.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', borderRadius: rad + 'px' });
        Object.assign(ring.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', borderRadius: rad + 'px' });
        // Letak bubble di bawah atau atas sasaran
        const tw = Math.min(340, vw - 32);
        tip.style.width = tw + 'px';
        const th = tip.offsetHeight;
        const below = y + h + 14 + th < vh - 12;
        const top = below ? y + h + 14 : Math.max(12 + safeTop(), y - th - 14);
        let left = r.left + r.width / 2 - tw / 2;
        left = Math.max(16, Math.min(vw - tw - 16, left));
        tip.style.left = left + 'px'; tip.style.top = top + 'px';
        tip.dataset.side = below ? 'below' : 'above';
        tip.style.setProperty('--arrow-x', Math.max(20, Math.min(tw - 20, r.left + r.width / 2 - left)) + 'px');
      } else {
        const tw = Math.min(340, vw - 32);
        tip.style.width = tw + 'px';
        tip.dataset.side = '';
        const th = tip.offsetHeight;
        let top = (vh - th) / 2, left = (vw - tw) / 2;
        if (st.chrome === 'bottom') top = vh - th - 96 - safeBottom();
        if (st.chrome === 'top-right') { top = 70 + safeTop(); left = vw - tw - 16; }
        tip.style.left = left + 'px'; tip.style.top = top + 'px';
      }
    }
    const safeTop = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-t')) || 0;
    const safeBottom = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-b')) || 0;

    function show() {
      const st = steps[idx];
      const n = steps.length;
      tip.innerHTML = `
        <div class="tour-top"><span class="tour-count">${idx + 1} / ${n}</span><button class="tour-skip" data-tour="skip">${st.final ? 'Tutup' : 'Langkau'}</button></div>
        ${st.icon ? `<div class="tour-icon" aria-hidden="true">${st.icon}</div>` : ''}
        <strong class="tour-title">${st.title}</strong>
        <p class="tour-text">${st.text}</p>
        <div class="tour-bar" aria-hidden="true"><i style="width:${((idx + 1) / n) * 100}%"></i></div>
        <div class="tour-btns">
          ${idx > 0 && !st.final ? '<button class="tour-back" data-tour="back">Kembali</button>' : '<span></span>'}
          ${st.action ? `<button class="tour-next" data-tour="act">${st.action.label}</button>` : `<button class="tour-next" data-tour="next">${st.final ? 'Mula guna' : idx === n - 2 ? 'Selesai' : 'Seterusnya'}</button>`}
        </div>`;
      tip.classList.remove('in'); void tip.offsetWidth; tip.classList.add('in');
      place();
      tip.focus({ preventScroll: true });
    }

    async function go2(i) {
      idx = Math.max(0, Math.min(steps.length - 1, i));
      const st = steps[idx];
      if (st.tab && state.tab !== st.tab) { go(st.tab); await wait(480); }
      const el = st.target ? st.target() : null;
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.top < 90 + safeTop() || r.bottom > window.innerHeight - 110 - safeBottom()) {
          el.scrollIntoView({ block: 'center', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
          await wait(420);
        }
      }
      if (st.chrome) bar.classList.add('hide'); else showBar();
      show();
    }
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const next = () => (idx >= steps.length - 1 ? end() : go2(idx + 1));
    const back = () => go2(idx - 1);

    function onKey(e) {
      if (!active) return;
      if (e.key === 'Escape') { e.preventDefault(); end(); }
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') back();
    }
    const onMove = () => requestAnimationFrame(place);

    function start() {
      if (active) return;
      if (!sheet.hidden) closeSheet();
      steps = build();
      if (!root) mount();
      active = true;
      document.body.classList.add('touring');
      root.hidden = false; root.classList.add('on');
      window.addEventListener('resize', onMove);
      window.addEventListener('scroll', onMove, { passive: true });
      document.addEventListener('keydown', onKey);
      go2(0);
    }
    function end() {
      active = false;
      store.set('tourDone', true);
      document.body.classList.remove('touring');
      root.classList.remove('on');
      setTimeout(() => { if (!active) root.hidden = true; }, 300);
      window.removeEventListener('resize', onMove);
      window.removeEventListener('scroll', onMove);
      document.removeEventListener('keydown', onKey);
      showBar();
      if (state.tab !== 'home') go('home');
    }
    return { start, end, get active() { return active; } };
  })();

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
  runSplash(false).then(() => {
    animateView('f');
    // Panduan automatik pada lawatan pertama
    if (!store.get('tourDone', false)) setTimeout(() => { if (sheet.hidden) Tour.start(); }, 900);
  });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
