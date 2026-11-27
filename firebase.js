/* Sambungan Firebase untuk Dapurkita @pahang.
   Realtime Database simpan dapur, foto dan hantaran; Anonymous Auth beri setiap
   peranti ID supaya hanya pemilik boleh padam iklan/hantaran sendiri.
   Nota: config web Firebase memang awam; keselamatan dikawal oleh database.rules.json. */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getDatabase, ref, onValue, push, update, get, set, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCE5EzPWa7m-M7thhXwl9V5E59BvVGA7v8',
  authDomain: 'dapurkita-6190b.firebaseapp.com',
  databaseURL: 'https://dapurkita-6190b-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'dapurkita-6190b',
  storageBucket: 'dapurkita-6190b.firebasestorage.app',
  messagingSenderId: '687897962006',
  appId: '1:687897962006:web:2f89cf332db3cab9cef737',
  measurementId: 'G-21WZWSSY5H'
};

/* Projek ini dikongsi dengan Dapurkita Taiping (vendors, community_posts).
   Semua data Pahang disimpan di bawah 'pahang/' supaya tidak bercampur. */
const ROOT = 'pahang/';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let uid = null;
let authError = null;
const authReady = new Promise((resolve) => {
  let settled = false;
  onAuthStateChanged(auth, (user) => {
    if (user) { uid = user.uid; if (!settled) { settled = true; resolve(uid); } }
  });
  signInAnonymously(auth).catch((e) => {
    authError = e && e.code ? e.code : String(e);
    console.warn('[Dapurkita] Log masuk tanpa nama gagal:', authError);
    if (!settled) { settled = true; resolve(null); }
  });
});

/* Analytics: pilihan, dimuat hanya jika pelayar menyokong */
import('https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js')
  .then((m) => m.isSupported().then((ok) => { if (ok) m.getAnalytics(app); }))
  .catch(() => {});

const toList = (snap) => {
  const v = snap.val() || {};
  return Object.keys(v).map((id) => ({ ...v[id], id, remote: true }))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

async function needUid() {
  const u = await authReady;
  if (!u) throw new Error(authError === 'auth/operation-not-allowed' || authError === 'auth/admin-restricted-operation'
    ? 'Log masuk tanpa nama belum diaktifkan di Firebase.' : 'Tidak dapat log masuk ke Firebase.');
  return u;
}

window.DK_FB = {
  get uid() { return uid; },
  get authError() { return authError; },
  authReady,

  onKitchens(cb, onErr) { return onValue(ref(db, ROOT + 'kitchens'), (s) => cb(toList(s)), onErr); },
  onPosts(cb, onErr) { return onValue(ref(db, ROOT + 'posts'), (s) => cb(toList(s)), onErr); },
  onLikes(cb, onErr) { return onValue(ref(db, ROOT + 'likes'), (s) => cb(s.val() || {}), onErr); },
  onConnection(cb) { return onValue(ref(db, '.info/connected'), (s) => cb(s.val() === true)); },

  async addKitchen(data, photos) {
    const owner = await needUid();
    const id = push(ref(db, ROOT + 'kitchens')).key;
    const updates = {};
    updates[ROOT + 'kitchens/' + id] = { ...data, owner, createdAt: serverTimestamp() };
    if (photos && photos.length) updates[ROOT + 'photos/' + id] = photos;
    await update(ref(db), updates);
    return id;
  },
  /* Kemas kini medan iklan sedia ada (null = buang medan). photos: undefined = tidak diubah */
  async updateKitchen(id, fields, photos) {
    await needUid();
    const updates = {};
    for (const [k, v] of Object.entries(fields)) updates[ROOT + 'kitchens/' + id + '/' + k] = v === undefined ? null : v;
    if (photos !== undefined) updates[ROOT + 'photos/' + id] = photos && photos.length ? photos : null;
    await update(ref(db), updates);
  },
  async getPhotos(id) {
    const s = await get(ref(db, ROOT + 'photos/' + id));
    const v = s.val();
    return Array.isArray(v) ? v : (v ? Object.values(v) : []);
  },
  async deleteKitchen(id) {
    await needUid();
    await update(ref(db), { [ROOT + 'kitchens/' + id]: null, [ROOT + 'photos/' + id]: null });
  },

  async addPost(data) {
    const owner = await needUid();
    const id = push(ref(db, ROOT + 'posts')).key;
    await set(ref(db, ROOT + 'posts/' + id), { ...data, owner, createdAt: serverTimestamp() });
    return id;
  },
  async updatePost(id, fields) {
    await needUid();
    const updates = {};
    for (const [k, v] of Object.entries(fields)) updates[ROOT + 'posts/' + id + '/' + k] = v === undefined ? null : v;
    await update(ref(db), updates);
  },
  async deletePost(id) {
    await needUid();
    await update(ref(db), { [ROOT + 'posts/' + id]: null, [ROOT + 'likes/' + id]: null });
  },
  async setLike(postId, on) {
    const u = await needUid();
    await set(ref(db, ROOT + 'likes/' + postId + '/' + u), on ? true : null);
  }
};

window.dispatchEvent(new Event('dk-firebase-ready'));
