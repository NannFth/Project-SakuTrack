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
    case 'setup_limit':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />;
    case 'daily_limit':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
    case 'financial_health':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />;
    case 'warning_wants':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />;
    case 'yesterday_eval':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
    case 'goal_progress':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />;
    case 'surplus_allocation':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
    case 'check_goals':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />;
    case 'challenge': 
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />;   
    case 'streak_praise':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />;
    case 'financial_tip': 
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674a1 1 0 00.908-.588l3.37-7c.225-.468.17-.11-.12-.412A7 7 0 105.51 9.412l3.37 7a1 1 0 00.908.588zM9 21h6" />;
    default:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
  }
};

export const getDailyExtras = () => {
  const userEmail = localStorage.getItem('user_email') || 'default_user';
  const todayDate = new Date().toISOString().split('T')[0];
  
  const seedString = userEmail + todayDate;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
    hash |= 0; 
  }
  const absoluteHash = Math.abs(hash);

  const bankData = [
    { id: 'b1', type: 'challenge', title: 'Tantangan Habit Keuangan', description: 'Cobalah untuk tidak membeli jajanan di luar hari ini. Alokasikan uang tersebut langsung ke target tabungan Kamu.', theme: getThemeByType('challenge') },
    { id: 'b2', type: 'challenge', title: 'Tantangan Habit Keuangan', description: 'Terapkan aturan "Tunggu 24 Jam" sebelum Kamu memutuskan untuk membeli barang di luar kebutuhan pokok hari ini.', theme: getThemeByType('challenge') },
    { id: 'b3', type: 'challenge', title: 'Tantangan Habit Keuangan', description: 'Cari alternatif hiburan gratis hari ini. Bersenang-senang tidak harus selalu menguras isi dompet Kamu.', theme: getThemeByType('challenge') },
    { id: 'b4', type: 'financial_tip', title: 'Prinsip Dasar Finansial', description: 'Sisihkan minimal 10% pendapatan Kamu untuk dana darurat segera setelah gajian, jangan menunggu sisa uang di akhir bulan.', theme: getThemeByType('financial_tip') },
    { id: 'b5', type: 'financial_tip', title: 'Prinsip Dasar Finansial', description: 'Investasikan waktu untuk mempelajari instrumen keuangan baru. Pemahaman yang matang adalah aset masa depan yang sangat berharga.', theme: getThemeByType('financial_tip') },
    { id: 'b6', type: 'financial_tip', title: 'Prinsip Dasar Finansial', description: 'Setiap nominal yang Kamu sisihkan hari ini akan mempercepat tercapainya visi finansial Kamu di masa depan. Tetaplah konsisten.', theme: getThemeByType('financial_tip') },
    { id: 'b7', type: 'yesterday_eval', title: 'Tinjauan Pengeluaran Kemarin', description: 'Periksa kembali riwayat transaksi kemarin. Pastikan laju pengeluaran Kamu masih berada dalam batas aman yang Kamu tentukan.', theme: getThemeByType('yesterday_eval') },
    { id: 'b8', type: 'warning_wants', title: 'Evaluasi Belanja Keinginan', description: 'Berhati-hatilah dengan pengeluaran impulsif. Pastikan barang yang Kamu beli hari ini benar-benar memberikan nilai manfaat jangka panjang.', theme: getThemeByType('warning_wants') },
    { id: 'b9', type: 'goal_progress', title: 'Status Target Tabungan', description: 'Setiap Rupiah yang Kamu hemat hari ini adalah langkah nyata menuju impian Kamu. Jangan menyerah pada keinginan sesaat.', theme: getThemeByType('goal_progress') },
    { id: 'b10', type: 'surplus_allocation', title: 'Rekomendasi Alokasi Dana', description: 'Jika Kamu memiliki sisa uang belanja hari ini, segera pindahkan ke rekening tabungan agar tidak terpakai secara tidak sengaja.', theme: getThemeByType('surplus_allocation') },
    { id: 'b11', type: 'streak_praise', title: 'Apresiasi Kedisiplinan', description: 'Kedisiplinan Kamu dalam mencatat keuangan adalah kunci utama. Pertahankan kebiasaan baik ini demi kebebasan finansial Kamu.', theme: getThemeByType('streak_praise') },
    { id: 'b12', type: 'financial_tip', title: 'Manajemen Utang', description: 'Prioritaskan pelunasan tagihan dengan bunga tertinggi terlebih dahulu untuk meringankan beban finansial Kamu secara keseluruhan.', theme: getThemeByType('financial_tip') },
    { id: 'b13', type: 'challenge', title: 'Tantangan Memasak Harian', description: 'Cobalah untuk memasak makanan Kamu sendiri hari ini. Selain lebih sehat, Kamu bisa menghemat biaya makan hingga 50%.', theme: getThemeByType('challenge') },
    { id: 'b14', type: 'financial_tip', title: 'Efek Inflasi', description: 'Ingatlah bahwa nilai uang akan menurun seiring waktu. Pertimbangkan untuk mulai berinvestasi agar kekayaan Kamu tetap bertumbuh.', theme: getThemeByType('financial_tip') },
    { id: 'b15', type: 'yesterday_eval', title: 'Analisis Biaya Langganan', description: 'Tinjau kembali layanan berlangganan Kamu. Hapus layanan yang sudah jarang Kamu gunakan untuk menambah jatah tabungan harian.', theme: getThemeByType('yesterday_eval') },
    { id: 'b16', type: 'streak_praise', title: 'Pencapaian Mingguan', description: 'Kamu telah berhasil mencatat transaksi secara rutin minggu ini. Langkah kecil ini akan membawa perubahan besar bagi masa depan Kamu.', theme: getThemeByType('streak_praise') },
    { id: 'b17', type: 'challenge', title: 'Hari Tanpa Belanja', description: 'Mampukah Kamu melewati hari ini tanpa melakukan pengeluaran non-rutin sama sekali? Mari kita uji kedisiplinan Kamu.', theme: getThemeByType('challenge') },
    { id: 'b18', type: 'financial_tip', title: 'Diversifikasi Aset', description: 'Jangan meletakkan semua uang Kamu di satu tempat. Diversifikasi adalah strategi terbaik untuk meminimalisir risiko keuangan.', theme: getThemeByType('financial_tip') },
    { id: 'b19', type: 'warning_wants', title: 'Kontrol Keinginan Belanja', description: 'Sebelum membeli sesuatu, tanyakan pada diri sendiri: "Apakah saya benar-benar membutuhkannya atau hanya menginginkannya sekarang?"', theme: getThemeByType('warning_wants') },
    { id: 'b20', type: 'goal_progress', title: 'Optimasi Dana Sisa', description: 'Gunakan dana tak terduga yang Kamu terima untuk mempercepat pelunasan target wishlist impian Kamu.', theme: getThemeByType('goal_progress') },
    { id: 'b21', type: 'financial_tip', title: 'Pentingnya Asuransi', description: 'Proteksi diri dan aset Kamu adalah bagian dari perencanaan keuangan yang sehat untuk menghindari pengeluaran darurat yang besar.', theme: getThemeByType('financial_tip') },
    { id: 'b22', type: 'challenge', title: 'Tantangan Hemat Transportasi', description: 'Gunakan transportasi umum atau berjalan kaki untuk jarak dekat hari ini guna mengurangi pengeluaran bahan bakar.', theme: getThemeByType('challenge') },
    { id: 'b23', type: 'streak_praise', title: 'Konsistensi Anggaran', description: 'Hebat! Kamu berhasil menjaga pengeluaran tetap di bawah batas aman hari ini. Terus pertahankan ritme ini.', theme: getThemeByType('streak_praise') },
    { id: 'b24', type: 'yesterday_eval', title: 'Refleksi Pengeluaran Makan', description: 'Apakah biaya makan Kamu kemarin terlalu tinggi? Cobalah untuk mencari alternatif menu yang lebih ekonomis namun tetap bergizi.', theme: getThemeByType('yesterday_eval') },
    { id: 'b25', type: 'financial_tip', title: 'Kekuatan Bunga Majemuk', description: 'Mulailah berinvestasi sedini mungkin. Waktu adalah teman terbaik bagi pertumbuhan aset Kamu melalui bunga majemuk.', theme: getThemeByType('financial_tip') }
  ];

  const index1 = absoluteHash % bankData.length;
  const index2 = (absoluteHash + 13) % bankData.length;
  const index3 = (absoluteHash + 21) % bankData.length;

  const uniqueIndices = Array.from(new Set([index1, index2, index3]));
  
  while (uniqueIndices.length < 3) {
    let nextIndex = (uniqueIndices[uniqueIndices.length - 1] + 5) % bankData.length;
    uniqueIndices.push(nextIndex);
  }

  return uniqueIndices.map(idx => bankData[idx]);
};