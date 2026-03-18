import { useState, useEffect } from "react"; 
import DashboardLayout from "../layouts/DashboardLayout"; 
import { BASE_URL } from "../connection";

export default function Prediksi() { // Pastikan huruf P kapital
  const [data, setData] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });

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

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const remainingDays = daysInMonth - currentDay;
  const dailyAverage = currentDay > 0 ? data.expense / currentDay : 0;
  
  const estimatedBalance = data.balance - (remainingDays * dailyAverage);
  const incomeRatio = data.income > 0 ? data.expense / data.income : 0;
  const safeDays = dailyAverage > 0 ? Math.floor(data.balance / dailyAverage) : 0;

  let statusLabel = "Aman";
  let statusColor = "bg-green-50 text-green-600";
  let statusAdvice = "Kondisi keuangan Anda stabil. Pertahankan pola ini.";

  if (incomeRatio >= 0.7 && incomeRatio < 1) {
    statusLabel = "Waspada";
    statusColor = "bg-orange-50 text-orange-600";
    statusAdvice = "Pengeluaran mulai mendekati pemasukan. Kurangi belanja tersier.";
  } else if (incomeRatio >= 1) {
    statusLabel = "Bahaya";
    statusColor = "bg-red-50 text-red-600";
    statusAdvice = "Pengeluaran melebihi pemasukan! Segera cek riwayat transaksi Anda.";
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Prediksi Keuangan</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Data Bulan Ini</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Rata-rata Pengeluaran/Hari</span>
                <span className="font-bold text-slate-800">Rp {Math.round(dailyAverage).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="text-slate-500">Total Pengeluaran</span>
                <span className="font-bold text-red-500">Rp {data.expense.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-6 rounded-xl shadow-lg text-white text-center">
            <h2 className="text-[10px] font-bold uppercase opacity-80 mb-2">Saku Bertahan Selama</h2>
            <div className="flex justify-center items-baseline gap-1">
              <span className="text-5xl font-black">{safeDays}</span>
              <span className="text-lg font-bold">Hari</span>
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
            <div>
              <h2 className="text-[10px] font-bold text-slate-400 uppercase">Estimasi Saldo Akhir</h2>
              <p className="text-2xl font-black text-slate-800 mt-1">
                Rp {Math.max(0, Math.round(estimatedBalance)).toLocaleString()}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold text-[10px] ${statusColor}`}>
              {statusLabel}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}