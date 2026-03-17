import { useState, useEffect } from "react"; 
import { BASE_URL } from "../connection";

export default function Prediksi() {
  const [data, setData] = useState({ income: 0, expense: 0, balance: 0 });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  const daftarBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(`${BASE_URL}/dashboard?month=${selectedMonth + 1}`, {
      headers: { "Authorization": userId }
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData({
            income: result.data.totalIncome,
            expense: result.data.totalExpense,
            balance: result.data.balance
          });
        }
      })
      .catch((err) => console.log("Fetch error:", err));
  }, [selectedMonth]);

  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), selectedMonth + 1, 0).getDate();
  
  let remainingDays = selectedMonth === now.getMonth() ? daysInMonth - currentDay : (selectedMonth > now.getMonth() ? daysInMonth : 0);
  const dailyAverage = currentDay > 0 ? data.expense / currentDay : 0;
  const estimatedBalance = data.balance - (remainingDays * dailyAverage);
  const incomeRatio = data.income > 0 ? data.expense / data.income : 0;
  const safeDays = dailyAverage > 0 ? Math.floor(data.balance / dailyAverage) : 0;

  // UI States logic
  const isDanger = incomeRatio >= 1;
  const isWarning = incomeRatio >= 0.7 && incomeRatio < 1;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Prediksi Keuangan</h1>
          <p className="text-slate-500 mt-1 text-sm">Analisis cerdas untuk masa depan finansialmu.</p>
        </div>
        
        <div className="relative">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 px-5 pr-10 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer font-medium"
          >
            {daftarBulan.map((bulan, index) => (
              <option key={index} value={index}>{bulan}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: RINGKASAN DATA */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </span>
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rata-rata/Hari</h2>
            <p className="text-2xl font-bold text-slate-800">Rp {Math.round(dailyAverage).toLocaleString()}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <p className="text-xs text-slate-400">Total Pengeluaran: <span className="font-semibold text-red-500">Rp {data.expense.toLocaleString()}</span></p>
          </div>
        </div>

        {/* CARD 2: SURVIVAL TIME (Dibuat lebih menonjol) */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xs font-bold uppercase opacity-80 tracking-widest mb-4">Daya Tahan Saldo</h2>
            <div className="flex items-center gap-3">
              <span className="text-6xl font-black">{safeDays}</span>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-none text-indigo-100">Hari</span>
                <span className="text-xs opacity-70">Tersisa</span>
              </div>
            </div>
          </div>
          {/* Dekorasi lingkaran di background */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>

        {/* CARD 3: ESTIMASI AKHIR BULAN */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
           <span className={`p-2 rounded-lg w-fit mb-4 font-bold text-xs uppercase ${isDanger ? 'bg-red-50 text-red-600' : isWarning ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
            Status: {isDanger ? 'Bahaya' : isWarning ? 'Waspada' : 'Aman'}
          </span>
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estimasi Saldo Akhir</h2>
            <p className="text-2xl font-black text-slate-800">Rp {Math.max(0, Math.round(estimatedBalance)).toLocaleString()}</p>
          </div>
        </div>

        {/* REKOMENDASI BOX - FULL WIDTH */}
        <div className="md:col-span-3 mt-4">
          <div className={`p-1 rounded-[32px] ${isDanger ? 'bg-red-100' : isWarning ? 'bg-orange-100' : 'bg-green-100'}`}>
            <div className="bg-white p-8 rounded-[30px] flex flex-col md:flex-row items-center gap-6">
              <div className={`p-4 rounded-2xl ${isDanger ? 'bg-red-50 text-red-600' : isWarning ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                {isDanger ? (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Rekomendasi Pintar</h3>
                <p className="text-slate-600 leading-relaxed">
                  {isDanger ? "Pengeluaranmu sudah lewat batas! Yuk, rem dulu jajan-jajannya biar saldo nggak minus di akhir bulan." : 
                   isWarning ? "Waspada ya, pengeluaranmu sudah 70% dari pemasukan. Kurangi belanja yang nggak perlu." : 
                   "Mantap! Kondisi keuanganmu sehat. Terus pertahankan pola hematmu ya!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}