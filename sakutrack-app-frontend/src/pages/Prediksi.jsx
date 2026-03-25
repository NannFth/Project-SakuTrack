import { useState, useEffect } from "react"; 
import connection from "../connection";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Prediksi() { 
  const [data, setData] = useState({
    income: 0,
    expense: 0,
    balance: 0,

    // cek transaksi
    hasTransaction: false
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  // Ambil Data
  useEffect(() => {
    const m = selectedDate.getMonth() + 1;
    const y = selectedDate.getFullYear();

    setData({
      income: 0,
      expense: 0,
      balance: 0,
      hasTransaction: false
    })
    
    connection.get(`/dashboard?month=${m}&year=${y}`)
      .then((res) => {
        const result = res.data;
        if (result.success === true && result.data) { 
            
            const income = Number(result.data.totalIncome) || 0;
            const expense = Number(result.data.totalExpense) || 0;
          
          setData({
            income: income,
            expense: expense,
            balance: Number(result.data.balance) || 0,
            hasTransaction: (income > 0 || expense > 0)
          });
        }
      })
      .catch((err) => {
        console.log("Fetch error:", err);
        setData({
          income: 0,
          expense: 0,
          balance: 0,
          hasTransaction: false
        })
      });
  }, [selectedDate]);

  // Perhitungan Hari & Rata-rata
  const now = new Date();
  const isCurrentMonth = selectedDate.getMonth() === now.getMonth() &&
                         selectedDate.getFullYear() === now.getFullYear();

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const monthName = selectedDate.toLocaleString("id-ID", { month: "long" });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dayForCalculation = isCurrentMonth ? now.getDate() : daysInMonth;
  const remainingDays = isCurrentMonth ? daysInMonth - now.getDate() : 0;

  const dailyAverage = data.expense / (dayForCalculation || 1);
  
  // Deteksi progres
  const monthProgress = dayForCalculation / daysInMonth;
  const spendingProgress = data.expense / (data.income || 1);

  // Faktor boros 
  const overspendFactor = (isCurrentMonth && spendingProgress > monthProgress) ? 1.25 : 1;
  const adjustedDaily = dailyAverage * overspendFactor;

  // Estimasi Saldo
  const estimatedBalance = data.balance - (remainingDays * adjustedDaily);
  const incomeRatio = data.income > 0 ? data.expense / data.income : 0;
  const safeDays = adjustedDaily > 0 ? Math.floor(data.balance / adjustedDaily) : 0;
  
  // Status & Rekomendasi
  let statusLabel = "Aman";
  let statusColor = "bg-emerald-50 text-emerald-600";
  let statusAdvice = "Kondisi keuangan Anda stabil. Pertahankan pola ini.";
  let actionPlan = "Teruskan menabung!";

  if (incomeRatio >= 0.6 && incomeRatio < 1) {
    statusLabel = "Waspada";
    statusColor = "bg-orange-50 text-orange-600";
    statusAdvice = "Pengeluaran mulai mendekati pemasukan. Kurangi belanja tersier.";
    actionPlan = `Batasi belanja harian maksimal Rp ${Math.max(0, Math.round(data.balance / (remainingDays || 1))).toLocaleString()} agar aman.`;
  } else if (incomeRatio >= 1) {
    statusLabel = "Bahaya";
    statusColor = "bg-rose-50 text-rose-600";
    statusAdvice = "Pengeluaran melebihi pemasukan! Segera cek riwayat transaksi Anda.";
    actionPlan = "Segera stop pengeluaran non-pokok dan cek transaksi terakhir Anda.";
  }

  if (overspendFactor > 1 && incomeRatio < 1) {
    statusAdvice = "Peringatan: Laju pengeluaran Anda lebih cepat dari biasanya untuk tanggal segini.";
  }

  const changeMonth = (dir) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + dir);
    setSelectedDate(newDate);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8 p-4">
        
        {/* Navigasi Bulan */}
        <div className="flex items-center justify-between bg-white p-4 rounded border shadow-sm">
          <button 
            onClick={() => changeMonth(-1)} 
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
            title="Bulan Sebelumnya"
          >
            <ChevronLeft size={24} />
          </button>
          
          <h2 className="text-lg font-bold text-slate-800 capitalize">
            {selectedDate.toLocaleString("id-ID", { month: "long", year: "numeric" })}
          </h2>
          
          <button 
            onClick={() => changeMonth(1)} 
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
            title="Bulan Berikutnya"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <h1 className="text-3xl font-bold text-slate-800">Prediksi Keuangan</h1>

        {!data.hasTransaction ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-12 rounded-xl text-center">
            <p className="text-slate-500 font-medium">Tidak ada transaksi pada bulan {monthName}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data */}
            <div className="bg-white p-6 rounded shadow-sm border border-slate-200 flex flex-col justify-between">
              <h2 className="text-xs font-bold text-slate-500 mb-4">Data Bulan Ini</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Rata-rata Pengeluaran/Hari</span>
                  <span className="font-bold text-slate-800">Rp {Math.round(adjustedDaily).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-slate-500">Total Pengeluaran</span>
                  <span className="font-bold text-rose-500">Rp {data.expense.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Indikator Bertahan */}
            <div className="bg-slate-900 p-6 rounded shadow text-white text-center flex flex-col justify-center">
              <h2 className="text-xs font-bold opacity-80 mb-2">Saku Bertahan Selama</h2>
              <div className="flex justify-center items-baseline gap-1">
                <span className="text-5xl font-black">{safeDays}</span>
                <span className="text-lg font-bold">Hari</span>
              </div>
              <p className="text-sm font-medium opacity-80 mt-1">
                {isCurrentMonth
                  ? (safeDays < remainingDays ? "Habis sebelum akhir bulan" : "Cukup sampai dapat bulanan")
                  : "Data historis bulan lalu"}
              </p>
            </div>

            {/* Estimasi Saldo Akhir */}
            <div className="md:col-span-2 bg-white p-6 rounded border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-xs font-bold text-slate-500">Estimasi Saldo Akhir</h2>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  Rp {Math.max(0, Math.round(estimatedBalance)).toLocaleString()}
                </p>
              </div>
              <div className={`px-4 py-2 rounded font-bold text-xs ${statusColor}`}>
                {statusLabel}
              </div>
            </div>

            {/* Saran Action Plan */}
            <div className="md:col-span-2 bg-white p-6 rounded border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-600 leading-relaxed">{statusAdvice}</p>
              <p className="text-sm font-bold text-slate-900 mt-2">{actionPlan}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}