import { useState, useEffect } from "react";
import Sidebar from "../components/ui/Sidebar";
import { Search, Bell, Settings, LogOut, UserPlus } from "lucide-react";
import connection from "../connection";
import { useNavigate, useLocation } from "react-router-dom";

export default function DashboardLayout({ children, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [user, setUser] = useState({ 
    name: localStorage.getItem("user_nama") || "", 
    email: "" 
  });
  
  const [openMenu, setOpenMenu] = useState(null);
  const isDashboard = location.pathname === "/dashboard";

  const getInitials = (fullName) => {
    if (!fullName || fullName.trim() === "") return "U";
    
    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  const initials = getInitials(user.name);

  useEffect(() => {
    connection.get('/auth/profile')
      .then((res) => {
        const profile = res.data.data; 
        const currentName = profile?.name || localStorage.getItem("user_nama");
        
        if (currentName) {
          setUser({
            name: currentName,
            email: profile?.email || "",
          });
          localStorage.setItem("user_nama", currentName);
        }
      })
      .catch((error) => {
        console.log("Gagal memuat profil:", error);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-200">
      {openMenu && openMenu !== "sidebar" && (
        <div className="fixed inset-0 z-[40]" onClick={() => setOpenMenu(null)}></div>
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-50">
        <Sidebar user={user} />
      </aside>

      {/* Sidebar Mobile */}
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
            <button onClick={() => setOpenMenu("sidebar")} className="p-2 bg-white rounded shadow-sm border border-slate-300">
              ☰
            </button>
          </div>
        )}

        {/* Header */}
        {isDashboard && (
          <header className="h-16 md:h-20 bg-slate-100 border-b border-slate-300 sticky top-0 z-[50] px-4 md:px-8 flex items-center gap-3">
              <button onClick={() => setOpenMenu("sidebar")} className="md:hidden p-2 rounded hover:bg-slate-200">
                ☰
              </button>

              <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Search size={18} />
                </span>
                <input
                  type="text" 
                  placeholder="Cari transaksi atau kategori..."
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-sm"
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-3 ml-auto relative">
                
                {/* Notifikasi */}
                <div className="relative">
                  <button onClick={() => setOpenMenu(openMenu === "notif" ? null : "notif")}
                    className={`p-2 rounded ${openMenu === 'notif' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  {openMenu === "notif" && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow border rounded p-4 text-sm z-[60]">
                      <p className="text-slate-500 text-center">Belum ada notifikasi</p>
                    </div>
                  )}
                </div>

                {/* Setting */}
                <div className="relative">
                  <button onClick={() => setOpenMenu(openMenu === "setting" ? null : "setting")}
                    className={`p-2 rounded ${openMenu === 'setting' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>
                    <Settings size={20} />
                  </button>
                  {openMenu === "setting" && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow border rounded p-2 z-[60]">
                      <button onClick={() => { localStorage.clear(); navigate("/"); }}
                        className="flex items-center gap-2 w-full text-left hover:bg-slate-100 p-2 rounded text-sm text-red-600">
                        <LogOut size={16} />
                        <span>LogOut</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-px h-6 bg-slate-300 mx-1"></div>

                {/* Tombol Inisial */}
                <div className="relative">
                  <button 
                    onClick={() => navigate("/profil")}
                    className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center text-white text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
                    title="Profil Saya"
                  >
                    {initials}
                  </button>
                </div>
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