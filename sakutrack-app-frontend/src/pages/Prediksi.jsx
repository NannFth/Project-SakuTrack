import { useState, useEffect } from "react"; 
import connection from "../connection";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Prediksi() { 
  const [data, setData] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    hasTransaction: false
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const now = new Date();
  const isCurrentMonth = selectedDate.getMonth() === now.getMonth() &&
                         selectedDate.getFullYear() === now.getFullYear();

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const monthName = selectedDate.toLocaleString("id-ID", { month: "long" });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dayForCalculation = isCurrentMonth ? now.getDate() : daysInMonth;
  const remainingDays = isCurrentMonth ? daysInMonth - now.getDate() : 0;

  const dailyAverageExpense = data.expense / (dayForCalculation || 1);
  const dailyAverageIncome = data.income / (dayForCalculation || 1);
  
  const spendingRatio = dailyAverageIncome > 0 ? dailyAverageExpense / dailyAverageIncome : 0;
  
  const projectedFutureExpense = remainingDays * dailyAverageExpense;
  const projectedFutureIncome = remainingDays * dailyAverageIncome;
  
  const estimatedBalance = data.balance + (isCurrentMonth ? projectedFutureIncome - projectedFutureExpense : 0);
  
  const safeDays = dailyAverageExpense > 0 ? Math.floor(data.balance / dailyAverageExpense) : 0;
  
  let statusLabel = "Aman";
  let statusColor = "bg-emerald-50 text-emerald-600";
  let statusAdvice = "Kondisi keuangan Kamu cukup stabil. Rata-rata pengeluaran harian Kamu masih berada di bawah rata-rata pemasukan harian.";
  let actionPlan = "Rencana: Pertahankan pola ini agar target tabungan Kamu tetap tercapai.";

  if (spendingRatio > 0.9) {
    statusLabel = "Waspada";
    statusColor = "bg-orange-50 text-orange-600";
    statusAdvice = "Rata-rata pengeluaran Kamu hampir menyamai rata-rata pemasukan harian. Kondisi ini membuat Kamu sulit untuk menyisihkan dana simpanan.";
    actionPlan = `Rencana: Kurangi pengeluaran non-pokok sekitar Rp ${(dailyAverageExpense * 0.1).toLocaleString('id-ID')} per hari agar saldo tetap terjaga.`;
  }

  if (estimatedBalance <= 0 && isCurrentMonth) {
    statusLabel = "Bahaya";
    statusColor = "bg-rose-50 text-rose-600";
    statusAdvice = "Jika pola pengeluaran ini terus berlanjut, saldo Kamu diperkirakan akan habis sebelum akhir bulan meskipun ada pemasukan rutin.";
    actionPlan = "Rencana: Batasi pengeluaran harian secara ketat dan fokus hanya pada kebutuhan utama saja.";
  }

  const changeMonth = (dir) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + dir);
    setSelectedDate(newDate);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8 p-4 font-sans">
        
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

        <h1 className="text-3xl font-bold text-slate-800">Proyeksi Keuangan</h1>

        {!data.hasTransaction ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-12 rounded-xl text-center">
            <p className="text-slate-500 font-medium">Belum ada data transaksi untuk bulan {monthName}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-6 rounded shadow-sm border border-slate-200 flex flex-col justify-between">
              <h2 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">Rata-rata Harian</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Pemasukan / Hari</span>
                  <span className="font-bold text-emerald-600">Rp {Math.round(dailyAverageIncome).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-slate-500">Pengeluaran / Hari</span>
                  <span className="font-bold text-rose-500">Rp {Math.round(dailyAverageExpense).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded shadow text-white text-center flex flex-col justify-center">
              <h2 className="text-xs font-bold opacity-80 mb-2 uppercase tracking-wider">Daya Tahan Saldo</h2>
              <div className="flex justify-center items-baseline gap-1">
                <span className="text-5xl font-black">{safeDays}</span>
                <span className="text-lg font-bold">Hari</span>
              </div>
              <p className="text-sm font-medium opacity-80 mt-1">
                {isCurrentMonth
                  ? "Estimasi durasi saldo jika tidak ada pemasukan baru"
                  : "Berdasarkan data historis bulan ini"}
              </p>
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimasi Saldo Akhir Bulan</h2>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  Rp {Math.max(0, Math.round(estimatedBalance)).toLocaleString('id-ID')}
                </p>
              </div>
              <div className={`px-4 py-2 rounded font-bold text-xs uppercase ${statusColor}`}>
                {statusLabel}
              </div>
            </div>

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