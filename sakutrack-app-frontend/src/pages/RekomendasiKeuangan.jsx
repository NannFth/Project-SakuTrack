import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import connection from '../../src/connection'; 
import { 
  getTitleByType, 
  getActionTextByType, 
  getRouteByType, 
  getThemeByType, 
  getIconByType,
  getDailyExtras
} from '../components/ui/rekomendasiUtils';

const RekomendasiKeuangan = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitValue, setLimitValue] = useState(80);
  const [currentSettings, setCurrentSettings] = useState({ needs_ratio: 50, wants_ratio: 30, savings_ratio: 20 });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedLimit = 80;
        let totalIncome = 0;
        let expenseToday = 0;
        let expenseBeforeToday = 0;

        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const todayDate = date.getDate();
        const todayStr = date.toISOString().split('T')[0];
        const daysInMonth = new Date(year, month, 0).getDate();
        const remainingDays = daysInMonth - todayDate + 1;

        try {
          const resSet = await connection.get('/settings');
          if (resSet.data.success && resSet.data.data) {
            setCurrentSettings({
              needs_ratio: resSet.data.data.needs_ratio,
              wants_ratio: resSet.data.data.wants_ratio,
              savings_ratio: resSet.data.data.savings_ratio
            });
            fetchedLimit = resSet.data.data.daily_limit_percentage || 80;
            setLimitValue(fetchedLimit);
          }
        } catch (err) {
          console.error("Error fetching settings:", err);
        }

        try {
          const [resDash, resTrans] = await Promise.all([
            connection.get(`/dashboard?month=${month}&year=${year}`),
            connection.get('/transactions')
          ]);

          if (resDash.data.success) {
            totalIncome = resDash.data.data.totalIncome || 0;
          }

          if (resTrans.data.success && resTrans.data.data) {
            let totalExpenseMonth = 0;
            
            resTrans.data.data.forEach(t => {
              const tDate = new Date(t.date);
              if (tDate.getMonth() + 1 === month && tDate.getFullYear() === year && t.type === 'expense') {
                totalExpenseMonth += Number(t.amount);
                if (t.date.startsWith(todayStr)) {
                  expenseToday += Number(t.amount);
                }
              }
            });
            expenseBeforeToday = totalExpenseMonth - expenseToday;
          }
        } catch (err) {
          console.error("Error fetching dashboard or transactions:", err);
        }

        const totalBudget = totalIncome * (fetchedLimit / 100);
        const remainingBudget = totalBudget - expenseBeforeToday;

        let dailyLimitRp = 0;
        if (remainingBudget > 0) {
          dailyLimitRp = Math.floor(remainingBudget / remainingDays);
        }

        let dynamicDescription = "Sistem belum mendeteksi rencana batasan belanja untuk hari ini. Segera tentukan limit agar pengeluaran tidak melampaui sisa pendapatan bulan ini.";

        if (totalIncome === 0) {
          dynamicDescription = "Belum ada pemasukan bulan ini. Catat pemasukan agar sistem dapat mengalkulasi batas aman pengeluaran harian kamu secara akurat.";
        } else if (remainingBudget <= 0) {
          dynamicDescription = `Peringatan: Total pengeluaran kamu hari ini sudah mencapai atau melewati batas (${fetchedLimit}% dari pendapatan). Tahan pengeluaran kamu sebisa mungkin!`;
        } else if (dailyLimitRp > 0) {
          if (expenseToday < dailyLimitRp) {
            dynamicDescription = `Batas aman pengeluaran kamu hari ini adalah Rp ${dailyLimitRp.toLocaleString('id-ID')}. Kamu sudah menggunakan Rp ${expenseToday.toLocaleString('id-ID')}.`;
          } else if (expenseToday === dailyLimitRp) {
            dynamicDescription = `Pengeluaran hari ini sudah tepat Rp ${dailyLimitRp.toLocaleString('id-ID')}, usahakan berhenti.`;
          } else {
            const excess = expenseToday - dailyLimitRp;
            dynamicDescription = `Kamu sudah mengeluarkan Rp ${expenseToday.toLocaleString('id-ID')}, lebih Rp ${excess.toLocaleString('id-ID')} dari batas aman yang ditentukan.`;
          }
        }

        // Format data
        const dynamicExtras = getDailyExtras();
        setRecommendations([
          {
            id: 1,
            type: 'setup_limit',
            title: "Batas Aman Pengeluaran Harian",
            description: dynamicDescription,
            actionText: "Ubah Limit",
            theme: { bg: "bg-white", border: "border-blue-500", text: "text-slate-900", iconBg: "bg-blue-50", iconText: "text-blue-600", button: "bg-blue-600 text-white hover:bg-blue-700" }
          },
          ...dynamicExtras
        ]);

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

  const handleActionClick = (type) => {
    if (type === 'setup_limit') {
      setShowLimitModal(true);
      return;
    }
    const route = getRouteByType(type);
    navigate(route);
  };

  const handleSaveLimit = async () => {
    setIsSaving(true);
    try {
      await connection.post('/settings', {
        needs_ratio: currentSettings.needs_ratio,
        wants_ratio: currentSettings.wants_ratio,
        savings_ratio: currentSettings.savings_ratio,
        daily_limit_percentage: limitValue
      });
      setShowLimitModal(false);
      window.location.reload(); 
    } catch (error) {
      console.error("Gagal menyimpan limit:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Menganalisis tindakan...</div>;

  if (error) return <div className="p-8 text-center text-rose-500 font-medium">{error}</div>;

  // Ambil Card 
  const mainCard = recommendations[0];
  const supportingCards = recommendations.slice(1);

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Rekomendasi Tindakan Harian</h1>
        <p className="text-slate-500 mt-1">Langkah praktis berdasarkan kondisi keuanganmu saat ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mainCard && (
          <div className={`md:col-span-3 mb-8 bg-white p-8 rounded-sm border ${mainCard.theme.border} flex flex-col md:flex-row justify-between items-center gap-6`}>
            <div className="flex items-start gap-5">
              <div className={`p-3 rounded-sm flex-shrink-0 ${mainCard.theme.iconBg} ${mainCard.theme.iconText}`}>
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
              className={`whitespace-nowrap px-6 py-3 rounded-sm font-bold text-sm transition-colors ${mainCard.theme.button}`}
            >
              {mainCard.actionText}
            </button>
          </div>
        )}

        {/* Card Pendukung */}
        {supportingCards.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-sm border border-slate-200 flex flex-col">
            <div className="flex-1">
              <div className={`w-12 h-12 rounded-sm flex items-center justify-center mb-5 ${item.theme.iconBg} ${item.theme.iconText}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {getIconByType(item.type)}
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-sm p-6 w-full max-w-sm border border-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Atur Limit Pengeluaran</h3>
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              Tentukan batas maksimal pengeluaran dari total pendapatan bulan ini agar tabunganmu tetap aman.
            </p>
            
            <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3 rounded-sm border border-slate-200">
              <input 
                type="number" 
                value={limitValue}
                onChange={(e) => setLimitValue(e.target.value)}
                className="w-full bg-transparent px-2 text-2xl font-black text-slate-800 outline-none text-center"
              />
              <span className="text-2xl font-black text-slate-400 pr-2">%</span>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowLimitModal(false)}
                className="flex-1 py-3 rounded-sm font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveLimit}
                disabled={isSaving}
                className="flex-1 py-3 rounded-sm font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Limit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RekomendasiKeuangan;