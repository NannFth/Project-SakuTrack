import React from 'react';
import { Utensils, Heart, PiggyBank } from 'lucide-react';

export default function BudgetWallets({ totalBalance = 0 }) {
  const kebutuhan = totalBalance * 0.5;
  const keinginan = totalBalance * 0.3;
  const tabungan = totalBalance * 0.2;

  const wallets = [
    {
      title: "Kebutuhan",
      amount: kebutuhan,
      percent: "50%",
      icon: <Utensils size={18} />,
      theme: "from-emerald-500 to-teal-600",
      lightTheme: "bg-emerald-50/60 text-emerald-700 border-emerald-100",
    },
    {
      title: "Keinginan",
      amount: keinginan,
      percent: "30%",
      icon: <Heart size={18} />,
      theme: "from-sky-500 to-indigo-500",
      lightTheme: "bg-sky-50/60 text-sky-700 border-sky-100",
    },
    {
      title: "Tabungan",
      amount: tabungan,
      percent: "20%",
      icon: <PiggyBank size={18} />,
      theme: "from-purple-500 to-fuchsia-600",
      lightTheme: "bg-purple-50/60 text-purple-700 border-purple-100",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {wallets.map((w, index) => (
        <div 
          key={index} 
          className={`flex items-center gap-5 p-5 rounded-[1.5rem] border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${w.lightTheme}`}
        >
          {/* Icon Box - Ukuran dinaikkan sedikit */}
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${w.theme} text-white shadow-md`}>
            {w.icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-60 truncate">
                {w.title}
              </p>
              <span className="text-[10px] font-black bg-white/50 px-2 py-0.5 rounded-full">
                {w.percent}
              </span>
            </div>
            <h4 className="text-lg font-black truncate leading-tight tracking-tight">
              Rp {Math.floor(w.amount).toLocaleString('id-ID')}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
}