import React from "react";
import { LayoutDashboard, Wallet, Target, User, LogOut, TrendingUp } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// terima props user
export default function Sidebar({ user }){
  const location = useLocation();
  const navigate = useNavigate();

  // logika inisial
  const inisial = user?.nama ? user.nama[0].toUpperCase() : "U"

  // Navigasi
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Transaksi", path: "/input-transaksi", icon: <Wallet size={20} /> },
    { name: "Target Tabungan", path: "/target-tabungan", icon: <Target size={20} /> },
    { name: "Prediksi", path: "/prediksi", icon: <TrendingUp size={20} /> },
  ];

  // Logout
  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <div className="w-64 bg-white h-screen flex flex-col border-r">
      <div className="p-8">
        <div className="flex-iems-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Wallet className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparant">
            SakuTrack
          </span>
        </div>
      </div>
      {/* Header Profil */}
      <div className="p-6">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            {inisial}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.nama || "User"}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email || "user@gmail.com"}</p>
          </div>
        </div>
      </div>

      {/* List Navigasi */}
      <nav className="flex-1 px-4 space-y-1">
        <p className="text-xs text-slate-400 ml-2 mb-3">Navigasi</p>
        {menuItems.map((item) => {
          const { path, name, icon } = item;
          const isActive = location.pathname === path;
          
          let linkClass = "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition text-slate-500 hover:bg-slate-50";
          if (isActive) {
            linkClass = "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition bg-indigo-50 text-indigo-600";
          }

          return (
            <Link key={path} to={path} className={linkClass}>
              {icon}
              {name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition font-medium text-sm"
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </div>
  );
}