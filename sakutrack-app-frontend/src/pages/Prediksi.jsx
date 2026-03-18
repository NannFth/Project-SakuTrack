import { useState, useEffect } from "react"; 
import { BASE_URL } from "../connection";

export default function Prediksi() { // Pastikan huruf P kapital
  const [data, setData] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });

  // pilih bulan
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // ambil bulan dari selectedDate
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    
    fetch(`${BASE_URL}/dashboard?month=${currentMonth + 1}&year=${currentYear}`, {
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
  }, [selectedDate]);

  const currentDay = selectedDate.getDate();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const remainingDays = daysInMonth - currentDay;

  const safeDay = currentDay === 0 ? 1 : currentDay;
  const dailyAverage = data.expense / safeDay;
  
  // deteksi progres waktu vs uang
  const monthProgress = currentDay / daysInMonth;
  const spendingProgress = data.expense / (data.income || 1);

  // faktor boros
  const overspendFactor = spendingProgress > monthProgress ? 1.25 : 1;

  // rata-rata
  const adjustedDaily = dailyAverage * overspendFactor;

  // estimasi realistis
  const estimatedBalance = data.balance - (remainingDays * adjustedDaily);

  const incomeRatio = data.income > 0 ? data.expense / data.income : 0;

  const safeDays = adjustedDaily > 0
    ? Math.floor(data.balance / adjustedDaily)
    : 0;

  
  // logika presentasi waktu vs uang
  const budgetUsed = data.income > 0 ? (data.expense / data.income) * 100 : 0;
  const isOverspending = budgetUsed > (monthProgress * 100);

  let statusLabel = "Aman";
  let statusColor = "bg-green-50 text-green-600";
  let statusAdvice = "Kondisi keuangan Anda stabil. Pertahankan pola ini.";
  let actionPlan = "Teruskan menabung!";

  if (incomeRatio >= 0.6 && incomeRatio < 1) {
    statusLabel = "Waspada";
    statusColor = "bg-orange-50 text-orange-600";
    statusAdvice = "Pengeluaran mulai mendekati pemasukan. Kurangi belanja tersier.";
    actionPlan = `Batasi belanja harian maksimal Rp ${Math.max(0, Math.round(data.balance / (remainingDays || 1))).toLocaleString()} agar aman.`;

  } else if (incomeRatio >= 1) {
    statusLabel = "Bahaya";
    statusColor = "bg-red-50 text-red-600";
    statusAdvice = "Pengeluaran melebihi pemasukan! Segera cek riwayat transaksi Anda.";
    actionPlan = "Segera stop pengeluaran non-pokok dan cek transaksi terakhir Anda.";
  }

  // override advice
  if (overspendFactor > 1 && incomeRatio < 1) {
    statusAdvice = "Peringatan: Laju pengeluaran Anda lebih cepat dari biasanya untuk tanggal segini.";
  }

  // fungsi pindah bulan
  const changeMonth = (dir) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + dir);
    setSelectedDate(newDate);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8 p-4">

        {/* pilih bulan */}
        <div className="flex items-center justify-between">
          <button onClick={() => changeMonth(-1)}>⬅️</button>

          <h2 className="text-lg font-bold text-slate-800">
            {selectedDate.toLocaleString("id-ID", {
              month: "long",
              year: "numeric"
            })}
          </h2>

          <button onClick={() => changeMonth(1)}>➡️</button>
        </div>

        <h1 className="text-3xl font-bold text-slate-800">Prediksi Keuangan</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Data Bulan Ini</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Rata-rata Pengeluaran/Hari</span>
                <span className="font-bold text-slate-800">Rp {Math.round(adjustedDaily).toLocaleString()}</span>
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
            <p className="text-sm font-medium opacity-80 italic">
              {safeDays < remainingDays ? "Habis sebelum akhir bulan" : "Cukup sampai dapat bulanan"} 
            </p>
          </div>

          {/* visual icon */}
          <div className="hidden lg:block text-white/20">
            <svg width="100" height="100" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 2.02c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm.2 15h10v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>

          <div className="md:col-span-3 bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
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

          <div className="md:col-span-3 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-600">{statusAdvice}</p>
            <p className="text-sm font-bold text-indigo-600 mt-2">{actionPlan}</p>
          </div>
        </div>
      </div>
    </>
  );
}