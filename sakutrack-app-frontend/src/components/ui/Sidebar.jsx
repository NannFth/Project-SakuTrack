import React from "react";
import { LayoutDashboard, Wallet, Target, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ user }){
  const location = useLocation();

  // Navigasi
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Transaksi", path: "/input-transaksi", icon: <Wallet size={20} /> },
    { name: "Target Tabungan", path: "/target-tabungan", icon: <Target size={20} /> },
    { name: "Prediksi", path: "/prediksi", icon: <TrendingUp size={20} /> },
  ];

  return (
    <div className="w-64 bg-white h-screen flex flex-col border-r">
      
      {/* Header Logo */}
      <div className="p-8 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Wallet className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold text-indigo-600">
            SakuTrack
          </span>
        </div>
      </div>

      {/* List Navigasi */}
      <nav className="flex-1 px-4 mt-2 space-y-1">
        <p className="text-xs text-slate-400 ml-4 mb-4">
          Navigasi Utama
        </p>
        
        {menuItems.map((item) => {
          const { path, name, icon } = item;
          const isActive = location.pathname === path;
          
          let linkClass = "flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50";
          
          if (isActive) {
            linkClass = "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold bg-indigo-50 text-indigo-600";
          }

          return (
            <Link key={path} to={path} className={linkClass}>
              {icon}
              {name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6">
        <div className="text-center">
          <p className="text-[10px] text-slate-400">
            SakuTrack v1.0
          </p>
        </div>
      </div>
    </div>
  );
}