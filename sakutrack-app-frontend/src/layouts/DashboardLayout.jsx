import { useState } from "react";
  import Sidebar from "../components/ui/Sidebar";
  import { Search, Calendar, Menu, X } from "lucide-react";
  import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
  import Notification from "../components/dashboard/Notification";
  import SettingsMenu from "../components/dashboard/SettingsMenu";

  export default function DashboardLayout({ children, searchQuery, setSearchQuery, user, socket }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const now = new Date();
    const currentMonth = searchParams.get("month") || String(now.getMonth() + 1);
    
    const [openMenu, setOpenMenu] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
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
          <div className="fixed inset-0 z-[40] bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setOpenMenu(null)}></div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-50">
          <Sidebar user={user} />
        </aside>

        {/* Mobile Sidebar */}
        <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-200 z-[60] transform transition-transform duration-300 ease-in-out md:hidden ${openMenu === "sidebar" ? "translate-x-0" : "-translate-x-full"} shadow-2xl border-r border-slate-300}`}>
          <div className="h-full relative flex flex-col">
            <div className="absolute top-3 right-3 z-[70]">
              <button onClick={() => setOpenMenu(null)} className="p-1.5 bg-black text-white rounded-lg hover:bg-slate-900 transition-all border border-white/10 shadow-lg">
                <X size={22} />
              </button>
            </div>
            <Sidebar user={user} />
          </div>
        </aside>

        <div className="flex-1 md:ml-64 flex flex-col min-w-0">
          <header className="bg-slate-100 border-b border-slate-300 sticky top-0 z-[45] px-6 md:px-12 py-3 flex items-center justify-between gap-3 h-16 md:h-20">

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button onClick={() => setOpenMenu("sidebar")} className="md:hidden p-2 rounded border border-slate-300 hover:bg-slate-200 text-slate-700 shrink-0">
                <Menu size={20} />
              </button>

              <div className={`relative flex-1 transition-all duration-300 ${isSearchOpen ? 'flex' : 'hidden md:flex'} max-w-md`}>
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Search size={18} />
                </span>
                <input
                  type="text" 
                  placeholder="Cari transaksi..."
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-full md:rounded-lg focus:border-slate-900 text-sm outline-none"
                />
              </div>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-200 rounded-full"
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>
            </div>
          
            <div className={`items-center gap-1.5 md:gap-4 ${isSearchOpen ? 'hidden sm:flex' : 'flex'}`}>
              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2 py-1.5 shadow-sm">
                <Calendar size={14} className="text-slate-400 hidden sm:block" />
                <select 
                  value={currentMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="bg-transparent text-[10px] md:text-xs font-bold text-slate-700 outline-none cursor-pointer"
                >
                  {months.map(m => (
                  <option key={m.v} value={m.v}>
                    {m.n}
                  </option>
                ))}
                </select>
              </div>

              <div className="static md:relative">
                <Notification userId={user.id} socket={socket} />
              </div>

              <SettingsMenu />

              <div className="hidden xs:block w-px h-6 bg-slate-300 mx-0.5"></div>

              <button 
                onClick={() => navigate("/profil")}
                className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded flex items-center justify-center text-white text-[10px] md:text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                {initials}
              </button>
            </div>
          </header>
          

          <main className="p-6 md:p-12 relative z-0 min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] overflow-x-hidden pb-24 md:pb-8">
            <div className="max-w-[1400px] mx-auto w-full">
                {children}
            </div>
          </main>
        </div>
      </div>
    );
  }