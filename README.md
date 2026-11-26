# Dapurkita @pahang

Direktori masakan rumah dari dapur jiran sekitar Bentong, Karak, Mempaga, Raub dan Janda Baik (Pahang). Pembeli cari menu, pesan terus ke WhatsApp, tiada komisen.
Dibina sebagai **PWA** (Progressive Web App): boleh dipasang ke skrin utama tanpa Play Store atau App Store.

## Ciri
- Splash screen dengan bendera Pahang dan bar loading
- **Utama**: carian, 8 kategori (Ready, Pre-Order, Kuih, Lauk, Nasi, Minuman, Frozen), tapis ikut kawasan dan taman/kampung, butiran dapur dengan menu & butang WhatsApp
- **Komuniti**: papan warga ikut topik (Open Order, Cari Makanan, Runner, Review), tulis hantaran, suka
- **Disimpan**: dapur kegemaran
- **Akaun**: tentang, butang pasang app, panduan pemasangan iPhone/Android, tema Cerah/Gelap/Auto
- Butang **+**: iklan menu dapur atau buka diskusi warga
- Boleh dibuka tanpa internet (service worker)

## Status data
Dapur dan hantaran dalam `data.js` ialah **contoh** (bertanda "Contoh"). Iklan dan hantaran yang pengguna buat
kini disimpan dalam `localStorage` peranti sahaja. Langkah seterusnya: sambung pangkalan data (contohnya Firebase)
supaya semua pengguna nampak data yang sama.

## Jalankan secara lokal
Tiada build step. Hidangkan folder ini dengan mana-mana pelayan statik:

```sh
python3 -m http.server 8000
# buka http://localhost:8000
```

## Deploy
Boleh terus deploy ke Vercel, Netlify atau GitHub Pages (folder root). Service worker dan pemasangan PWA perlukan HTTPS.

## Fail
| Fail | Kegunaan |
| --- | --- |
| `index.html` | Splash, shell app dan tab bar |
| `styles.css` | Reka bentuk hitam & kelabu, mod gelap |
| `app.js` | Skrin, carian, borang, pemasangan PWA |
| `data.js` | Kawasan & taman, kategori, data contoh dapur dan hantaran |
| `sw.js`, `manifest.webmanifest`, `icons/` | Fail PWA |

## Kawasan & taman
Senarai dalam `data.js` → `areas`. Nama taman dikumpul dari carian awam (portal hartanah, Wikipedia) dan mungkin
belum lengkap. Tambah atau betulkan nama terus dalam fail itu. Penjual juga boleh pilih "Lain-lain" dan taip
nama taman sendiri.
