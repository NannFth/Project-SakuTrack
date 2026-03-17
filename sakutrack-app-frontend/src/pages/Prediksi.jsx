import { useState, useEffect } from "react"; 
import DashboardLayout from "../layouts/DashboardLayout";
import { BASE_URL } from "../connection";

export default function Prediksi() {
  const [data, setData] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });

  // Ambil data
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    
    fetch(`${BASE_URL}/dashboard`, {
      headers: { "Authorization": userId }
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          setData({
            income: result.data.totalIncome,
            expense: result.data.totalExpense,
            balance: result.data.balance
          });
        }
      })
      .catch((err) => {
        console.log("Fetch error:", err);
      });
  }, []);

  // Hitung proyeksi
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const remainingDays = daysInMonth - currentDay;
  const dailyAverage = currentDay > 0 ? data.expense / currentDay : 0;
  

  const estimatedBalance = data.balance - (remainingDays * dailyAverage);
  const netFlow = data.income - data.expense;

  // logika baru
  const incomeRatio = data.income > 0 ? data.expense / data.income : 0;
  const burnRate = dailyAverage;
  const safeDays = burnRate > 0 ? Math.floor(data.balance / burnRate) : 0;

  // Status baru 
  let statusLabel = "";
  let statusColor = "";
  let statusAdvice = "";

  if (incomeRatio <= 0.7) {
    statusLabel = "Aman";
    statusColor = "bg-green-50 text-green-600";
    statusAdvice = "Kondisi keuangan Anda sangat stabil. Pertahankan pola pengeluaran saat ini dan pertimbangkan untuk mengalokasikan dana lebih ke tabungan atau investasi.";
  } else if (incomeRatio >= 0.7 && incomeRatio < 1) {
    statusLabel = "Waspada";
    statusColor = "bg-red-50 text-orange-600";
    statusAdvice = "Pengeluaran mulai mendekati pemasukan. Sebaiknya mulai mengurangi pengeluaran tidak penting.";
  } else {
    statusLabel = "Bahaya";
    statusColor = "bg-orange-50 text-red-600";
    statusAdvice = "Pengeluaran melebihi pemasukan! Segera kontrol keuangan Anda sebelum saldo habis.";
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-slate-800">Prediksi Keuangan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ringkasan data */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Data Bulan Ini</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Rata-rata Pengeluaran/Hari</span>
              <span className="font-bold text-slate-800">
                Rp {Math.round(dailyAverage).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Pengeluaran</span>
              <span className="font-bold text-red-500">
                Rp {data.expense.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Kemampuan bertahan */}
        <div className="bg-indigo-600 p-6 rounded-xl shadow-lg text-white flex flex-col justify-center items-center text-center">
          <h2 className="text-xs font-bold uppercase opacity-80 tracking-[2px] mb-2">
            Saldo Anda Bertahan Selama
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black">{safeDays}</span>
            <span className="text-xl font-bold">Hari Lagi</span>
          </div>
          <p className="text-[10px] mt-4 opacity-70 italic">
            *Jika pengeluaran harian Anda tetap sama
          </p>
        </div>

        {/* Hasil estimasi */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase">Estimasi Saldo Akhir Bulan Ini</h2>
              <p className="text-2xl font-black text-slate-800 mt-1">
                Rp {Math.max(0, Math.round(estimatedBalance)).toLocaleString()}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold text-xs ${statusColor}`}>
              {statusLabel}
            </div>
          </div>
        </div>

        {/* Rekomendasi tindakan */}
        <div className="md:col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h2 className="text-sm font-bold text-slate-500 uppercase mb-2">Rekomendasi Tindakan</h2>
          <p className="text-slate-700 leading-relaxed text-sm">
            {statusAdvice}
          </p>
        </div>
      </div>
    </>
  );
}