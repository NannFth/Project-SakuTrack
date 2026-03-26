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
      theme: "bg-emerald-500",
      lightTheme: "bg-emerald-50 border-emerald-200 text-emerald-700",
    },
    {
      title: "Keinginan",
      amount: keinginan,
      percent: "30%",
      icon: <Heart size={18} />,
      theme: "bg-sky-500",
      lightTheme: "bg-sky-50 border-sky-200 text-sky-700",
    },
    {
      title: "Tabungan",
      amount: tabungan,
      percent: "20%",
      icon: <PiggyBank size={18} />,
      theme: "bg-purple-500",
      lightTheme: "bg-purple-50 border-purple-200 text-purple-700",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {wallets.map((w, index) => (
        <div 
          key={index} 
          className={`flex items-center gap-4 p-4 rounded-lg border ${w.lightTheme}`}
        >
          {/* Icon Box */}
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${w.theme} text-white`}>
            {w.icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                {w.title}
              </p>
              <span className="text-[10px] font-bold bg-white/80 px-2 py-0.5 rounded border border-current/10">
                {w.percent}
              </span>
            </div>
            <h4 className="text-base font-bold truncate mt-1">
              Rp {Math.floor(w.amount).toLocaleString('id-ID')}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
}