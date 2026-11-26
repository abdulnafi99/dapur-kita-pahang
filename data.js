/* Data contoh Dapurkita @pahang.
   Semua dapur dan hantaran di sini ialah CONTOH (sample: true) untuk tunjuk rupa app.
   Gantikan dengan data sebenar (contohnya dari Firebase) bila sedia. */

window.DK_DATA = {
  towns: ['Semua Pahang', 'Kuantan', 'Temerloh', 'Bentong', 'Raub', 'Pekan', 'Jerantut', 'Maran', 'Rompin', 'Lipis', 'Bera', 'Cameron Highlands'],

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
      id: 'k1', sample: true, name: 'Dapur Mak Long', town: 'Kuantan', area: 'Indera Mahkota', emoji: '🍛',
      status: 'ready', cats: ['nasi', 'lauk'],
      desc: 'Nasi lemak bungkus daun pisang, sambal sotong dan ayam goreng berempah. Siap setiap pagi.',
      menu: [['Nasi lemak sambal sotong', 'RM7.00'], ['Nasi lemak ayam berempah', 'RM8.50'], ['Sambal sotong (balang)', 'RM18.00']],
      hours: '6:30 pagi – 11:00 pagi', delivery: 'Ambil sendiri / runner sekitar Indera Mahkota'
    },
    {
      id: 'k2', sample: true, name: 'Kak Ina Frozen', town: 'Kuantan', area: 'Beserah', emoji: '🥟',
      status: 'preorder', cats: ['frozen', 'kuih'],
      desc: 'Risoles, popia dan karipap sejuk beku. Pesan sehari awal, ambil di Beserah.',
      menu: [['Risoles ayam (10 biji)', 'RM15.00'], ['Popia sayur (20 biji)', 'RM12.00'], ['Karipap pusing (15 biji)', 'RM14.00']],
      hours: 'Pesan sebelum 9 malam', delivery: 'Ambil sendiri / pos sekitar Kuantan'
    },
    {
      id: 'k3', sample: true, name: 'Patin Tempoyak Wan', town: 'Temerloh', area: 'Bandar Temerloh', emoji: '🐟',
      status: 'preorder', cats: ['lauk'],
      desc: 'Gulai tempoyak ikan patin cara Temerloh. Boleh tempah untuk kenduri kecil.',
      menu: [['Gulai tempoyak patin (sepotong)', 'RM16.00'], ['Set keluarga 5 orang', 'RM75.00']],
      hours: 'Tempah H-1', delivery: 'Ambil sendiri'
    },
    {
      id: 'k4', sample: true, name: 'Kuih Muih Cik Yah', town: 'Bentong', area: 'Karak', emoji: '🍡',
      status: 'ready', cats: ['kuih'],
      desc: 'Kuih tradisional segar setiap petang: seri muka, kuih lapis, onde-onde.',
      menu: [['Seri muka (sepotong)', 'RM1.50'], ['Onde-onde (5 biji)', 'RM3.00'], ['Kuih lapis (sepotong)', 'RM1.20']],
      hours: '3:00 – 6:00 petang', delivery: 'Ambil sendiri di Karak'
    },
    {
      id: 'k5', sample: true, name: 'Laksa Kuantan Tok Mat', town: 'Kuantan', area: 'Tanjung Lumpur', emoji: '🍜',
      status: 'ready', cats: ['lauk'],
      desc: 'Laksa Kuantan kuah ikan pekat dengan ulam segar. Hujung minggu sahaja.',
      menu: [['Laksa Kuantan', 'RM7.00'], ['Laksa bungkus 1 kg kuah', 'RM22.00']],
      hours: 'Sabtu & Ahad, 8 pagi – 1 petang', delivery: 'Ambil sendiri / runner'
    },
    {
      id: 'k6', sample: true, name: 'Teh Tarik Raub Corner', town: 'Raub', area: 'Bandar Raub', emoji: '🧋',
      status: 'ready', cats: ['minuman'],
      desc: 'Teh tarik dan kopi Raub dalam botol, sedap sejuk atau panas.',
      menu: [['Teh tarik botol 500ml', 'RM5.00'], ['Kopi Raub botol 500ml', 'RM6.00']],
      hours: '10 pagi – 6 petang', delivery: 'Runner sekitar Bandar Raub'
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
    { id: 'p1', sample: true, topic: 'open', who: 'Aisyah S.', town: 'Kuantan', ago: '12 min', title: 'Laksa Kuantan open order Sabtu ni', body: 'Kuah ikan pekat, ambil sendiri atau runner sekitar bandar. PM sebelum Jumaat malam.', likes: 24, replies: 8 },
    { id: 'p2', sample: true, topic: 'cari', who: 'Hafiz Z.', town: 'Temerloh', ago: '1 jam', title: 'Ada sesiapa jual gulai tempoyak ikan patin?', body: 'Nak order untuk 10 orang hujung minggu ni.', likes: 11, replies: 5 },
    { id: 'p3', sample: true, topic: 'runner', who: 'Farid R.', town: 'Bentong', ago: '3 jam', title: 'Runner free petang ni sekitar Karak', body: 'Boleh ambil dan hantar makanan dalam radius 10 km. Caj ikut jarak.', likes: 6, replies: 2 },
    { id: 'p4', sample: true, topic: 'review', who: 'Nurul H.', town: 'Kuantan', ago: 'Semalam', title: 'Risoles Kak Ina memang padu', body: 'Inti penuh, goreng terus dari frozen pun rangup. Recommended!', likes: 31, replies: 4 }
  ]
};
