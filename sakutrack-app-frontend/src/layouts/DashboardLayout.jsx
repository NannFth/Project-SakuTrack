import { useState } from "react";
import Sidebar from "../components/ui/Sidebar";
import { Search, Settings, LogOut, Calendar } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Notification from "../components/dashboard/Notification";

export default function DashboardLayout({ children, searchQuery, setSearchQuery, user, socket }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const now = new Date();
  const currentMonth = searchParams.get("month") || String(now.getMonth() + 1);
  
  const [openMenu, setOpenMenu] = useState(null);
  const isDashboard = location.pathname === "/dashboard";

  const months = [
    { v: "1", n: "Januari" }, { v: "2", n: "Februari" }, { v: "3", n: "Maret" },
    { v: "4", n: "April" }, { v: "5", n: "Mei" }, { v: "6", n: "Juni" },
    { v: "7", n: "Juli" }, { v: "8", n: "Agustus" }, { v: "9", n: "September" },
    { v: "10", n: "Oktober" }, { v: "11", n: "November" }, { v: "12", n: "Desember" }
  ];

  const getInitials = (fullName) => {
    if (!fullName || fullName.trim() === "") return "U";
    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return words[0][0].toUpperCase();
  };

  const initials = getInitials(user.name);

  const handleMonthChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("month", value);
    setSearchParams(newParams);
  };

  return (
    <div className="flex min-h-screen bg-slate-200">
      {openMenu && (
        <div className="fixed inset-0 z-[40]" onClick={() => setOpenMenu(null)}></div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-50">
        <Sidebar user={user} />
      </aside>

      {/* Mobile Sidebar */}
      {openMenu === "sidebar" && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setOpenMenu(null)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col pt-16 shadow-lg">
            <Sidebar user={user} />
          </aside>
        </>
      )}

      <div className="flex-1 md:ml-64 flex flex-col">
        {!isDashboard && (
          <div className="md:hidden p-4">
            <button onClick={() => setOpenMenu("sidebar")} className="p-2 bg-white rounded shadow-sm border border-slate-300">☰</button>
          </div>
        )}

        {isDashboard && (
          <header className="h-auto md:h-20 bg-slate-100 border-b border-slate-300 sticky top-0 z-[50] px-4 md:px-8 py-3 flex flex-wrap items-center gap-3">
              <button onClick={() => setOpenMenu("sidebar")} className="md:hidden p-2 rounded hover:bg-slate-200">☰</button>

              <div className="relative flex-1 min-w-[200px] max-w-md">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Search size={18} />
                </span>
                <input
                  type="text" 
                  placeholder="Cari transaksi..."
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded focus:border-slate-900 text-sm outline-none"
                />
              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-300 rounded px-3 py-2 shadow-sm">
                <Calendar size={16} className="text-slate-400" />
                <select 
                  value={currentMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-2"
                >
                  {months.map(m => <option key={m.v} value={m.v}>{m.n}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <Notification userId={user.id} socket={socket} />

                <div className="relative">
                  <button onClick={() => setOpenMenu(openMenu === "setting" ? null : "setting")}
                    className={`p-2 rounded ${openMenu === 'setting' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>
                    <Settings size={20} />
                  </button>
                  {openMenu === "setting" && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl border border-slate-200 rounded p-2 z-[60]">
                      <button onClick={() => { localStorage.clear(); navigate("/"); }}
                        className="flex items-center gap-2 w-full text-left hover:bg-slate-50 p-2 rounded text-sm text-red-600 font-bold">
                        <LogOut size={16} />
                        <span>LogOut</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-px h-6 bg-slate-300 mx-1"></div>

                <button 
                  onClick={() => navigate("/profil")}
                  className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center text-white text-xs font-bold"
                >
                  {initials}
                </button>
              </div>
          </header>
        )}

        <main className="p-4 md:p-8 relative z-0">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}