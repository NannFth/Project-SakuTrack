import React, { useMemo } from 'react';
import { Lightbulb, Target, Wallet, AlertCircle } from 'lucide-react';

export default function DailyGreeting({ totalExpense = 0, dailyLimit = 100000 }) {
  
  const reminders = [
    {
      icon: <Wallet className="text-emerald-500" size={20} />,
      text: "Jangan lupa nabung hari ini, ya! Tabungan sedikit demi sedikit lama-lama jadi bukit. 🏔️",
      color: "bg-emerald-50 border-emerald-100"
    },
    {
      icon: <Lightbulb className="text-amber-500" size={20} />,
      text: "Cek lagi pengeluaranmu. Pastikan beli yang butuh dulu, baru yang mau. ✨",
      color: "bg-amber-50 border-amber-100"
    },
    {
      icon: <Target className="text-blue-500" size={20} />,
      text: "Tetap konsisten dengan target tabunganmu bulan ini. Kamu pasti bisa! 🎯",
      color: "bg-blue-50 border-blue-100"
    }
  ];

  const randomReminder = useMemo(() => {
    return reminders[Math.floor(Math.random() * reminders.length)];
  }, []);

  const isOverLimit = totalExpense > dailyLimit;

  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Kartu Motivasi */}
      <div className={`p-4 rounded-2xl border ${randomReminder.color} flex items-start gap-3 shadow-sm`}>
        <div className="mt-1">{randomReminder.icon}</div>
        <p className="text-sm text-slate-700 font-medium leading-relaxed">
          {randomReminder.text}
        </p>
      </div>

      {/* Kartu Peringatan (Hanya muncul kalau pengeluaran > limit) */}
      {isOverLimit && (
        <div className="p-4 rounded-2xl border bg-rose-50 border-rose-200 flex items-start gap-3 animate-pulse shadow-sm">
          <div className="mt-1"><AlertCircle className="text-rose-500" size={20} /></div>
          <div>
            <p className="text-sm text-rose-800 font-bold tracking-tight">Waduh, Jaga Dompetmu!</p>
            <p className="text-xs text-rose-600 font-medium">
              Pengeluaranmu sudah Rp {totalExpense.toLocaleString('id-ID')}, melewati batas Rp {dailyLimit.toLocaleString('id-ID')}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}