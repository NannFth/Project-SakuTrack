import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import connection from '../../src/connection'; 

const RekomendasiKeuangan = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await connection.get('/recommendations');
        const { data } = response;

        if (data.success && data.data.length > 0) {
          // Format data
          let formattedData = data.data.map((item, index) => ({
            id: index + 1,
            type: item.type,
            title: getTitleByType(item.type),
            description: item.message,
            actionText: getActionTextByType(item.type),
            theme: getThemeByType(item.type)
          }));

          const defaultExtras = [
            { id: 'extra-1', type: 'input_expense', title: 'Disiplin Pencatatan', description: 'Pastikan semua transaksi hari ini dicatat agar analisis sistem akurat dan navigasi finansial tetap relevan.', actionText: 'Catat Transaksi', theme: getThemeByType('default') },
            { id: 'extra-2', type: 'check_goals', title: 'Review Target Finansial', description: 'Pantau target tabungan aktif Anda. Konsistensi kecil setiap hari akan mempercepat pencapaian barang impian Anda.', actionText: 'Kelola Target', theme: getThemeByType('goal_progress') },
            { id: 'extra-3', type: 'financial_health', title: 'Cek Kesehatan Keuangan', description: 'Luangkan waktu 5 menit hari ini untuk mereview alokasi dana dan proyeksi saldo akhir bulan Anda.', actionText: 'Lihat Proyeksi', theme: getThemeByType('daily_limit') },
            { id: 'extra-4', type: 'challenge', title: 'Tantangan Hemat', description: 'Coba hari ini tidak jajan di luar. Simpan uangnya untuk targetmu!', actionText: 'Mulai Tantangan', theme: getThemeByType('default') }
          ];

          let extraIndex = 0;
          while (formattedData.length < 6 && extraIndex < defaultExtras.length) {
            formattedData.push(defaultExtras[extraIndex]);
            extraIndex++;
          }

          setRecommendations(formattedData);
        } else {
          setRecommendations([
            {
              id: 1,
              type: 'setup_limit',
              title: "Tentukan Rencana Belanja Harian",
              description: "Sistem belum mendeteksi rencana batasan belanja untuk hari ini. Segera tentukan limit agar pengeluaran tidak melampaui sisa pendapatan bulan ini.",
              actionText: "Terapkan Limit",
              theme: { bg: "bg-white", border: "border-blue-500", text: "text-slate-900", iconBg: "bg-blue-50", iconText: "text-blue-600", button: "bg-blue-600 text-white hover:bg-blue-700" }
            },
            {
              id: 2,
              type: 'input_expense',
              title: "Disiplin Pencatatan",
              description: "Pastikan semua transaksi yang terjadi hari ini (pemasukan atau pengeluaran sekecil apapun) dicatat agar analisis sistem tetap akurat.",
              actionText: "Catat Sekarang",
              theme: { bg: "bg-white", border: "border-slate-200", text: "text-slate-900", iconBg: "bg-slate-50", iconText: "text-slate-500", button: "bg-slate-100 text-slate-800 hover:bg-slate-200" }
            },
            {
              id: 3,
              type: 'check_goals',
              title: "Review Progres Tabungan",
              description: "Cek target tabungan aktif Anda. Konsistensi kecil setiap hari akan mempercepat pencapaian barang impian Anda.",
              actionText: "Lihat Target",
              theme: { bg: "bg-white", border: "border-slate-200", text: "text-slate-900", iconBg: "bg-slate-50", iconText: "text-slate-500", button: "bg-slate-100 text-slate-800 hover:bg-slate-200" }
            },
            {
              id: 4,
              type: 'financial_tip',
              title: "Prinsip Keuangan Harian",
              description: "Sisihkan minimal 10% pendapatan untuk tabungan atau dana darurat segera setelah gajian, jangan menunggu sisa uang.",
              actionText: "Mengerti",
              theme: { bg: "bg-white", border: "border-slate-200", text: "text-slate-900", iconBg: "bg-slate-50", iconText: "text-slate-500", button: "bg-slate-100 text-slate-800 hover:bg-slate-200" }
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        const errorMessage = err.response?.data?.message || err.message || "Gagal mengambil rekomendasi";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Penentu judul
  const getTitleByType = (type) => {
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

  //  Menentukan Teks 
  const getActionTextByType = (type) => {
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

  // Menentukan Rute Tujuan
  const getRouteByType = (type) => {
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

  // Menentukan Warna
  const getThemeByType = (type) => {
    switch (type) {
      case 'daily_limit': 
      case 'setup_limit':
      case 'financial_health': // Biru (Analisis & Proyeksi)
        return { 
          bg: "bg-white", border: "border-blue-500", text: "text-slate-900", 
          iconBg: "bg-blue-50", iconText: "text-blue-600", 
          button: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100" 
        };

      case 'warning_wants': 
      case 'yesterday_eval': // Rose/Merah (Evaluasi & Peringatan)
        return { 
          bg: "bg-white", border: "border-rose-500", text: "text-slate-900", 
          iconBg: "bg-rose-50", iconText: "text-rose-600", 
          button: "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-100" 
        };

      case 'goal_progress': 
      case 'surplus_allocation': 
      case 'check_goals': // Emerald/Hijau (Target & Tabungan)
        return { 
          bg: "bg-white", border: "border-emerald-500", text: "text-slate-900", 
          iconBg: "bg-emerald-50", iconText: "text-emerald-600", 
          button: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100" 
        };

      case 'challenge': // Orange (Tantangan)
        return { 
        bg: "bg-white", border: "border-orange-500", text: "text-slate-900", 
          iconBg: "bg-orange-50", iconText: "text-orange-600", 
          button: "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-100" 
        };

      case 'streak_praise': // Violet/Ungu (Apresiasi/Prestasi)
        return { 
          bg: "bg-white", border: "border-violet-500", text: "text-slate-900", 
          iconBg: "bg-violet-50", iconText: "text-violet-600", 
          button: "bg-violet-600 text-white hover:bg-violet-700 shadow-violet-100" 
        };

      case 'financial_tip': // Amber/Kuning (Tips & Prinsip)
        return { 
          bg: "bg-white", border: "border-amber-400", text: "text-slate-900", 
          iconBg: "bg-amber-50", iconText: "text-amber-600", 
          button: "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-100" 
        };

      default: // Indigo (Pahami & Lanjutkan / Lainnya)
        return { 
          bg: "bg-white", border: "border-indigo-200", text: "text-slate-900", 
          iconBg: "bg-indigo-50", iconText: "text-indigo-500", 
          button: "bg-indigo-500 text-white hover:bg-indigo-600" 
        };
    }
  };

  const getIconByType = (type) => {
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

  const handleActionClick = (type) => {
    const route = getRouteByType(type);
    navigate(route);
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Menganalisis tindakan...</div>;

  if (error) return <div className="p-8 text-center text-rose-500 font-medium">{error}</div>;

  // Ambil Card 
  const mainCard = recommendations[0];
  const supportingCards = recommendations.slice(1);

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Rekomendasi Tindakan Harian</h1>
        <p className="text-slate-500 mt-1">Langkah praktis berdasarkan kondisi keuanganmu saat ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mainCard && (
          <div className={`md:col-span-3 bg-white p-8 rounded border ${mainCard.theme.border} shadow-sm flex flex-col md:flex-row justify-between items-center gap-6`}>
            <div className="flex items-start gap-5">
              <div className={`p-3 rounded flex-shrink-0 ${mainCard.theme.iconBg} ${mainCard.theme.iconText}`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {getIconByType(mainCard.type)}
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{mainCard.title}</h3>
                <p className="text-slate-600 mt-2 leading-relaxed">{mainCard.description}</p>
              </div>
            </div>
            <button 
              onClick={() => handleActionClick(mainCard.type)}
              className={`whitespace-nowrap px-6 py-3 rounded font-bold text-sm transition-colors shadow-sm ${mainCard.theme.button}`}
            >
              {mainCard.actionText}
            </button>
          </div>
        )}

        {/* Card Pendukung */}
        {supportingCards.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex-1">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${item.theme.iconBg} ${item.theme.iconText}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {getIconByType(item.type)}
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
            <button 
              onClick={() => handleActionClick(item.type)}
              className={`mt-6 w-full py-3 rounded font-bold text-xs transition-colors border ${item.theme.button}`}
            >
              {item.actionText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RekomendasiKeuangan;