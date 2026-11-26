/* Data contoh Dapurkita @pahang.
   Semua dapur dan hantaran di sini ialah CONTOH (sample: true) untuk tunjuk rupa app.
   Gantikan dengan data sebenar (contohnya dari Firebase) bila sedia. */

window.DK_DATA = {
  /* Kawasan liputan dan taman/kampung berdekatan. Tambah nama lain di sini bila perlu. */
  areas: {
    'Bentong': ['Taman Bukit Bentong', 'Taman Bentong Jaya', 'Taman Desa Damai', 'Chamang Glades', 'Taman Puncak Rimba', 'Taman Sungai Marong', 'Kampung Benus', 'Sungai Penjuring'],
    'Karak': ['Taman Karak Indah', 'Taman Permai', 'Taman Karak', 'Taman Lavender', 'Perumahan Makmur Karak Setia', 'Kampung Karak Setia', 'Kampung Jambu Rias', 'Kampung Sungai Dua'],
    'Mempaga': ['FELDA Mempaga 1', 'FELDA Mempaga 2', 'FELDA Mempaga 3', 'Taman Feldajaya Mempaga', 'Kompleks Perumahan Semai Bakti'],
    'Raub': ['Taman Colonial', 'Taman Cahaya Raub', 'Taman Raub Utama', 'Taman Bukit Koman', 'Taman Desa Park'],
    'Janda Baik': ['Kampung Janda Baik', 'Ulu Janda Baik', 'Kampung Cheringin', 'Kampung Chemperoh']
  },

  categories: [
    { id: 'semua', label: 'Semua', icon: '🍽️' },
    { id: 'ready', label: 'Ready', icon: '✅' },
    { id: 'preorder', label: 'Pre-Order', icon: '🗓️' },
    { id: 'kuih', label: 'Kuih', icon: '🍡' },
    { id: 'lauk', label: 'Lauk', icon: '🍛' },
    { id: 'nasi', label: 'Nasi', icon: '🍚' },
    { id: 'minuman', label: 'Minuman', icon: '🧋' },
    { id: 'frozen', label: 'Frozen', icon: '🧊' }
  ],

  kitchens: [
    {
      id: 'k1', sample: true, name: 'Dapur Mak Long', town: 'Bentong', area: 'Taman Bentong Jaya', emoji: '🍛',
      status: 'ready', cats: ['nasi', 'lauk'],
      desc: 'Nasi lemak bungkus daun pisang, sambal sotong dan ayam goreng berempah. Siap setiap pagi.',
      menu: [['Nasi lemak sambal sotong', 'RM7.00'], ['Nasi lemak ayam berempah', 'RM8.50'], ['Sambal sotong (balang)', 'RM18.00']],
      hours: '6:30 pagi – 11:00 pagi', delivery: 'Ambil sendiri / runner sekitar bandar Bentong'
    },
    {
      id: 'k2', sample: true, name: 'Kak Ina Frozen', town: 'Karak', area: 'Taman Karak Indah', emoji: '🥟',
      status: 'preorder', cats: ['frozen', 'kuih'],
      desc: 'Risoles, popia dan karipap sejuk beku. Pesan sehari awal, ambil di Taman Karak Indah.',
      menu: [['Risoles ayam (10 biji)', 'RM15.00'], ['Popia sayur (20 biji)', 'RM12.00'], ['Karipap pusing (15 biji)', 'RM14.00']],
      hours: 'Pesan sebelum 9 malam', delivery: 'Ambil sendiri / runner sekitar Karak'
    },
    {
      id: 'k3', sample: true, name: 'Patin Tempoyak Wan', town: 'Mempaga', area: 'FELDA Mempaga 2', emoji: '🐟',
      status: 'preorder', cats: ['lauk'],
      desc: 'Gulai tempoyak ikan patin cara orang Pahang. Boleh tempah untuk kenduri kecil.',
      menu: [['Gulai tempoyak patin (sepotong)', 'RM16.00'], ['Set keluarga 5 orang', 'RM75.00']],
      hours: 'Tempah H-1', delivery: 'Ambil sendiri'
    },
    {
      id: 'k4', sample: true, name: 'Kuih Muih Cik Yah', town: 'Karak', area: 'Taman Permai', emoji: '🍡',
      status: 'ready', cats: ['kuih'],
      desc: 'Kuih tradisional segar setiap petang: seri muka, kuih lapis, onde-onde.',
      menu: [['Seri muka (sepotong)', 'RM1.50'], ['Onde-onde (5 biji)', 'RM3.00'], ['Kuih lapis (sepotong)', 'RM1.20']],
      hours: '3:00 – 6:00 petang', delivery: 'Ambil sendiri di Taman Permai'
    },
    {
      id: 'k5', sample: true, name: 'Laksa Janda Baik Tok Mat', town: 'Janda Baik', area: 'Kampung Cheringin', emoji: '🍜',
      status: 'ready', cats: ['lauk'],
      desc: 'Laksa kuah ikan pekat dengan ulam segar. Hujung minggu sahaja.',
      menu: [['Laksa kuah ikan', 'RM7.00'], ['Laksa bungkus 1 kg kuah', 'RM22.00']],
      hours: 'Sabtu & Ahad, 8 pagi – 1 petang', delivery: 'Ambil sendiri / runner'
    },
    {
      id: 'k6', sample: true, name: 'Teh Tarik Raub Corner', town: 'Raub', area: 'Taman Colonial', emoji: '🧋',
      status: 'ready', cats: ['minuman'],
      desc: 'Teh tarik dan kopi Raub dalam botol, sedap sejuk atau panas.',
      menu: [['Teh tarik botol 500ml', 'RM5.00'], ['Kopi Raub botol 500ml', 'RM6.00']],
      hours: '10 pagi – 6 petang', delivery: 'Runner sekitar bandar Raub'
    },
    {
      id: 'k7', sample: true, name: 'Halia Bentong Kak Siti', town: 'Bentong', area: 'Taman Bukit Bentong', emoji: '🫚',
      status: 'ready', cats: ['minuman', 'kuih'],
      desc: 'Air halia Bentong pekat dan kuih bakar halia. Sesuai untuk minum petang.',
      menu: [['Air halia botol 500ml', 'RM5.00'], ['Kuih bakar halia (sepotong)', 'RM2.00']],
      hours: '2 petang – 7 malam', delivery: 'Ambil sendiri / runner sekitar Bentong'
    }
  ],

  topics: [
    { id: 'semua', label: 'Semua' },
    { id: 'open', label: 'Open Order' },
    { id: 'cari', label: 'Cari Makanan' },
    { id: 'runner', label: 'Runner' },
    { id: 'review', label: 'Review' }
  ],

  posts: [
    { id: 'p1', sample: true, topic: 'open', who: 'Aisyah S.', town: 'Janda Baik', ago: '12 min', title: 'Laksa open order Sabtu ni', body: 'Kuah ikan pekat, ambil sendiri di Kampung Cheringin. PM sebelum Jumaat malam.', likes: 24, replies: 8 },
    { id: 'p2', sample: true, topic: 'cari', who: 'Hafiz Z.', town: 'Mempaga', ago: '1 jam', title: 'Ada sesiapa jual gulai tempoyak ikan patin?', body: 'Nak order untuk 10 orang hujung minggu ni.', likes: 11, replies: 5 },
    { id: 'p3', sample: true, topic: 'runner', who: 'Farid R.', town: 'Karak', ago: '3 jam', title: 'Runner free petang ni sekitar Karak', body: 'Boleh ambil dan hantar makanan dalam radius 10 km. Caj ikut jarak.', likes: 6, replies: 2 },
    { id: 'p4', sample: true, topic: 'review', who: 'Nurul H.', town: 'Karak', ago: 'Semalam', title: 'Risoles Kak Ina memang padu', body: 'Inti penuh, goreng terus dari frozen pun rangup. Recommended!', likes: 31, replies: 4 }
  ]
};
