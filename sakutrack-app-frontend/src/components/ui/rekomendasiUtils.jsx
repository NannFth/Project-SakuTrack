import React from 'react';

// Judul
export const getTitleByType = (type) => {
  switch (type) {
    case 'daily_limit': return 'Navigasi Pengeluaran Harian'; 
    case 'warning_wants': return 'Evaluasi Belanja Keinginan'; 
    case 'yesterday_eval': return 'Tinjauan Pengeluaran Kemarin'; 
    case 'goal_progress': return 'Status Target Tabungan'; 
    case 'surplus_allocation': return 'Rekomendasi Alokasi Dana Sisa'; 
    case 'challenge': return 'Tantangan Habit Keuangan'; 
    case 'streak_praise': return 'Apresiasi Kedisiplinan'; 
    case 'financial_tip': return 'Prinsip Dasar Finansial'; 
    default: return 'Insight Tindakan Finansial';
  }
};

// Teks 
export const getActionTextByType = (type) => {
  switch (type) {
    case 'daily_limit': return 'Atur Limit Sekarang'; 
    case 'warning_wants': return 'Review Transaksi'; 
    case 'yesterday_eval': return 'Analisis Pengeluaran'; 
    case 'goal_progress': return 'status target'
    case 'surplus_allocation': return 'Kelola Target'; 
    case 'challenge': return 'Lakukan Tantangan'; 
    case 'streak_praise': return 'Catat Transaksi Lagi'; 
    default: return 'Pahami & Lanjutkan';
  }
};

// Tujuan
export const getRouteByType = (type) => {
  switch (type) {
    case 'daily_limit': 
    case 'setup_limit':
    case 'financial_health': return '/prediksi';
    case 'warning_wants': 
    case 'yesterday_eval': 
    case 'streak_praise': return '/input-transaksi';
    case 'input_expense': return '/dashboard';
    case 'goal_progress': 
    case 'surplus_allocation': 
    case 'check_goals': return '/target-tabungan';
    case 'challenge': return '/dashboard'; 
    default: return '/dashboard';
  }
};

// Warna
export const getThemeByType = (type) => {
  switch (type) {
    case 'daily_limit': 
    case 'setup_limit':
    case 'financial_health': 
      return { 
        bg: "bg-white", border: "border-blue-500", text: "text-slate-900", 
        iconBg: "bg-blue-50", iconText: "text-blue-600", 
        button: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100" 
      };

    case 'warning_wants': 
    case 'yesterday_eval': 
      return { 
        bg: "bg-white", border: "border-rose-500", text: "text-slate-900", 
        iconBg: "bg-rose-50", iconText: "text-rose-600", 
        button: "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-100" 
      };

    case 'goal_progress': 
    case 'surplus_allocation': 
    case 'check_goals': 
      return { 
        bg: "bg-white", border: "border-emerald-500", text: "text-slate-900", 
        iconBg: "bg-emerald-50", iconText: "text-emerald-600", 
        button: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100" 
      };

    case 'challenge': 
      return { 
      bg: "bg-white", border: "border-orange-500", text: "text-slate-900", 
        iconBg: "bg-orange-50", iconText: "text-orange-600", 
        button: "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-100" 
      };

    case 'streak_praise': 
      return { 
        bg: "bg-white", border: "border-violet-500", text: "text-slate-900", 
        iconBg: "bg-violet-50", iconText: "text-violet-600", 
        button: "bg-violet-600 text-white hover:bg-violet-700 shadow-violet-100" 
      };

    case 'financial_tip': 
      return { 
        bg: "bg-white", border: "border-amber-400", text: "text-slate-900", 
        iconBg: "bg-amber-50", iconText: "text-amber-600", 
        button: "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-100" 
      };

    default: 
      return { 
        bg: "bg-white", border: "border-indigo-200", text: "text-slate-900", 
        iconBg: "bg-indigo-50", iconText: "text-indigo-500", 
        button: "bg-indigo-500 text-white hover:bg-indigo-600" 
      };
  }
};

export const getIconByType = (type) => {
  switch (type) {
    case 'daily_limit':
    case 'financial_health':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
    case 'warning_wants':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />;
    case 'yesterday_eval':
    case 'input_expense':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />;
    case 'goal_progress':
    case 'surplus_allocation':
    case 'check_goals':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />;
    case 'challenge': 
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />;   
    case 'streak_praise':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />;
    case 'financial_tip': 
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674a1 1 0 00.908-.588l3.37-7c.225-.468.17-.11-.12-.412A7 7 0 105.51 9.412l3.37 7a1 1 0 00.908.588zM9 21h6" />;
    default:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
  }
};

export const getDailyExtras = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); 
  const dayOfMonth = today.getDate();

  const dailyMessages = [
    { id: 'extra-sun', type: 'check_goals', title: 'Refleksi Finansial', description: 'Luangkan waktu hari ini untuk merekap pengeluaran minggu lalu dan merencanakan strategi keuangan untuk esok hari.', actionText: 'Evaluasi Sekarang', theme: getThemeByType('goal_progress') },
    { id: 'extra-mon', type: 'financial_health', title: 'Fokus Anggaran Mingguan', description: 'Awali minggu ini dengan meninjau kembali alokasi dana. Pastikan prioritas pengeluaran sejalan dengan target finansial Anda.', actionText: 'Lihat Proyeksi', theme: getThemeByType('daily_limit') },
    { id: 'extra-tue', type: 'input_expense', title: 'Konsistensi Pencatatan', description: 'Tetap disiplin pada rencana awal. Segera catat setiap transaksi agar arus kas di pertengahan minggu terpantau akurat.', actionText: 'Catat Transaksi', theme: getThemeByType('default') },
    { id: 'extra-wed', type: 'yesterday_eval', title: 'Evaluasi Tengah Minggu', description: 'Periksa kembali riwayat transaksi Anda. Pastikan laju pengeluaran dalam tiga hari terakhir masih berada dalam batas wajar.', actionText: 'Cek Pengeluaran', theme: getThemeByType('warning_wants') },
    { id: 'extra-thu', type: 'challenge', title: 'Prinsip Tunda Beli', description: 'Menjelang akhir pekan, terapkan aturan tunggu 24 jam sebelum memutuskan untuk membeli barang di luar kebutuhan pokok.', actionText: 'Tahan Pengeluaran', theme: getThemeByType('challenge') },
    { id: 'extra-fri', type: 'daily_limit', title: 'Antisipasi Akhir Pekan', description: 'Merayakan selesainya aktivitas minggu ini diperbolehkan, namun pastikan Anda mematuhi batas pengeluaran yang telah ditetapkan.', actionText: 'Pantau Limit', theme: getThemeByType('daily_limit') },
    { id: 'extra-sat', type: 'challenge', title: 'Kendali Hiburan', description: 'Bersenang-senang tidak harus menguras tabungan. Pilihlah alternatif kegiatan yang lebih hemat namun tetap bermakna bagi Anda.', actionText: 'Cari Alternatif', theme: getThemeByType('challenge') }
  ];

  const randomBank = [
    { id: 'rand-1', type: 'financial_tip', title: 'Investasi Pengetahuan', description: 'Sisihkan waktu untuk mempelajari instrumen keuangan. Pemahaman yang baik adalah aset masa depan yang sangat bernilai.', actionText: 'Pahami Prinsip', theme: getThemeByType('financial_tip') },
    { id: 'rand-2', type: 'surplus_allocation', title: 'Optimalisasi Dana Sisa', description: 'Apabila terdapat sisa dana dari alokasi hari ini, biasakan untuk segera mengalihkannya ke rekening tabungan atau investasi.', actionText: 'Alokasikan Dana', theme: getThemeByType('surplus_allocation') },
    { id: 'rand-3', type: 'input_expense', title: 'Akurasi Data Finansial', description: 'Sistem membutuhkan data yang valid. Jangan tunda mencatat pengeluaran sekecil apa pun demi keakuratan proyeksi.', actionText: 'Catat Sekarang', theme: getThemeByType('default') },
    { id: 'rand-4', type: 'goal_progress', title: 'Visi Jangka Panjang', description: 'Setiap nominal yang Anda sisihkan hari ini akan mempercepat realisasi visi finansial di masa mendatang. Tetap konsisten.', actionText: 'Tinjau Target', theme: getThemeByType('goal_progress') }
  ];

  const specificDayMessage = dailyMessages[dayOfWeek];
  const randomMessage = randomBank[dayOfMonth % randomBank.length];

  return [
    specificDayMessage,
    randomMessage,
    { id: 'extra-base-1', type: 'check_goals', title: 'Tinjauan Target Finansial', description: 'Pantau secara berkala target tabungan aktif Anda. Konsistensi kecil setiap hari akan mempercepat pencapaian tujuan akhir.', actionText: 'Kelola Target', theme: getThemeByType('goal_progress') },
    { id: 'extra-base-2', type: 'financial_health', title: 'Pemeriksaan Berkala', description: 'Luangkan waktu lima menit hari ini untuk meninjau proyeksi saldo dan memastikan alokasi dana berjalan sesuai rencana.', actionText: 'Lihat Proyeksi', theme: getThemeByType('daily_limit') }
  ];
};