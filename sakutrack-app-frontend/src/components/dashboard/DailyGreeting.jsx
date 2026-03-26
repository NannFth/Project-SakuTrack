import React, { useMemo } from 'react';
import { Lightbulb, Target, Wallet, AlertCircle } from 'lucide-react';

export default function DailyGreeting({ totalExpense = 0, dailyLimit = 100000 }) {
  
  const reminders = [
    {
      icon: <Wallet className="text-emerald-600" size={20} />,
      text: "Jangan lupa nabung hari ini, ya! Sedikit demi sedikit lama-lama jadi bukit. 🏔️",
      color: "bg-emerald-50 border-emerald-200"
    },
    {
      icon: <Lightbulb className="text-amber-600" size={20} />,
      text: "Cek lagi pengeluaranmu. Pastikan beli yang butuh dulu, baru yang mau. ✨",
      color: "bg-amber-50 border-amber-200"
    },
    {
      icon: <Target className="text-blue-600" size={20} />,
      text: "Tetap konsisten dengan target tabunganmu bulan ini. Kamu pasti bisa! 🎯",
      color: "bg-blue-50 border-blue-200"
    }
  ];

  const randomReminder = useMemo(() => {
    return reminders[Math.floor(Math.random() * reminders.length)];
  }, []);

  const isOverLimit = totalExpense > dailyLimit;

  return (
    <div className="space-y-3 mb-6">
      {/* Kartu Motivasi */}
      <div className={`p-4 rounded-lg border ${randomReminder.color} flex items-center gap-3`}>
        <div className="shrink-0">{randomReminder.icon}</div>
        <p className="text-sm text-slate-700">
          {randomReminder.text}
        </p>
      </div>

      {/* Kartu Peringatan */}
      {isOverLimit && (
        <div className="p-4 rounded-lg border bg-red-50 border-red-200 flex items-center gap-3">
          <div className="shrink-0">
            <AlertCircle className="text-red-600" size={20} />
          </div>
          <div>
            <p className="text-sm text-red-700 font-bold">Waduh, Jaga Dompetmu!</p>
            <p className="text-xs text-red-600">
              Pengeluaranmu Rp {totalExpense.toLocaleString('id-ID')} (Batas: Rp {dailyLimit.toLocaleString('id-ID')}).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}