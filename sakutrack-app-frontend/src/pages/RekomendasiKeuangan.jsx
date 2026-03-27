import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import connection from '../../src/connection'; 

const RekomendasiKeuangan = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Memanggil API menggunakan instance axios yang sudah dikonfigurasi
        const response = await connection.get('/recommendations');
        const { data } = response; // Axios membungkus response di dalam objek 'data'

        if (data.success && data.data.length > 0) {
          // Format data dari API agar sesuai dengan struktur UI
          const formattedData = data.data.map((item, index) => ({
            id: index + 1,
            title: getTitleByType(item.type),
            description: item.message,
            actionText: getActionTextByType(item.type),
            theme: getThemeByType(item.type)
          }));
          setRecommendations(formattedData);
        } else {
          // Fallback jika API mengembalikan array kosong
          setRecommendations([
            {
              id: 1,
              title: "Belum Ada Rekomendasi",
              description: "Catat transaksi pertamamu hari ini untuk mendapatkan insight keuangan.",
              actionText: "Catat Transaksi",
              theme: "bg-gray-600"
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        // Menangani error dari response Axios jika ada
        const errorMessage = err.response?.data?.message || err.message || "Gagal mengambil rekomendasi";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Helper untuk menentukan Judul berdasarkan tipe
  const getTitleByType = (type) => {
    switch (type) {
      case 'daily_limit': return 'Batas Pengeluaran Harian';
      case 'warning_wants': return 'Peringatan Anggaran';
      case 'yesterday_eval': return 'Evaluasi Kemarin';
      case 'goal_progress': return 'Progres Tabungan';
      case 'surplus_allocation': return 'Alokasi Dana Sisa';
      case 'challenge': return 'Tantangan Hari Ini';
      case 'streak_praise': return 'Konsistensi Luar Biasa!';
      case 'financial_tip': return 'Tips Finansial';
      default: return 'Insight Keuangan';
    }
  };

  // Helper untuk menentukan Teks Tombol berdasarkan tipe
  const getActionTextByType = (type) => {
    switch (type) {
      case 'daily_limit': return 'Lihat Anggaran';
      case 'warning_wants': return 'Cek Kategori';
      case 'yesterday_eval': return 'Lihat Riwayat';
      case 'goal_progress': 
      case 'surplus_allocation': return 'Lihat Target';
      case 'challenge': return 'Terima Tantangan';
      case 'streak_praise': return 'Catat Transaksi';
      default: return 'Mengerti';
    }
  };

  // Helper untuk menentukan Warna (Theme) berdasarkan tipe
  const getThemeByType = (type) => {
    switch (type) {
      case 'daily_limit': return 'bg-blue-600';
      case 'warning_wants': return 'bg-red-500';
      case 'yesterday_eval': return 'bg-orange-500';
      case 'goal_progress': return 'bg-emerald-600';
      case 'surplus_allocation': return 'bg-teal-500';
      case 'challenge': return 'bg-purple-600';
      case 'streak_praise': return 'bg-yellow-500';
      case 'financial_tip': return 'bg-indigo-500';
      default: return 'bg-gray-800';
    }
  };

  const handleNext = () => {
    if (recommendations.length > 0) {
      setActiveStep((prev) => (prev === recommendations.length - 1 ? 0 : prev + 1));
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col justify-center items-center h-64">
        <p className="text-red-500 text-sm text-center mb-4">Gagal memuat: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Rekomendasi Tindakan</h2>
        <p className="text-sm text-gray-500">Langkah cerdas kelola uangmu hari ini</p>
      </div>

      <div className="relative h-48 overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          {recommendations.length > 0 && (
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className={`absolute inset-0 p-6 text-white flex flex-col justify-between ${recommendations[activeStep].theme}`}
            >
              <div>
                <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">
                  {recommendations[activeStep].title}
                </h3>
                <p className="text-sm leading-relaxed opacity-90 line-clamp-3">
                  {recommendations[activeStep].description}
                </p>
              </div>
              
              <button className="w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold text-sm transition-colors mt-4 backdrop-blur-sm border border-white/30">
                {recommendations[activeStep].actionText}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {recommendations.length > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex space-x-2">
            {recommendations.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  activeStep === index ? 'w-8 bg-gray-800' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={handleNext}
            className="flex items-center text-sm font-bold text-gray-700 hover:text-black transition-colors"
          >
            {activeStep === recommendations.length - 1 ? "Mulai Lagi" : "Berikutnya"} 
            <span className="ml-1">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RekomendasiKeuangan;