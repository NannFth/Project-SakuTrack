import { useState, useEffect } from "react";
import Sidebar from "../components/ui/Sidebar";
import { Search, Bell, Settings, User as UserIcon, LogOut, UserPlus } from "lucide-react";
import connection from "../connection";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ children, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({ name: "", email: "" });
  const [openMenu, setOpenMenu] = useState(null);
  const initials = user.name ? user.name[0].toUpperCase() : "U";

  // Ambil Data
  useEffect(() => {
    connection.get('/auth/profile')
      .then((res) => {
        const data = res.data;
        if (data.nama) {
          setUser({
            name: data.nama,
            email: data.email,
          });
        }
      })
      .catch((error) => {
        console.log("Gagal memuat profil:", error);
      });
  }, []);

  // UI
  return (
    <div className="flex min-h-screen bg-slate-50">
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
          <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 transition-transform duration-300 flex flex-col pt-16 shadow-2xl">
            <Sidebar user={user} />
          </aside>
        </>
      )}

      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Header */}
        <header className="h-16 md:h-20 bg-white border-b sticky top-0 z-[50] px-4 md:px-8 flex items-center gap-3">
            <button onClick={() => setOpenMenu("sidebar")} className="md:hidden p-2 rounded-lg hover:bg-slate-100">
              ☰
            </button>

            {/* Pencarian */}
            <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text" 
                placeholder="Cari transaksi atau kategori..."
                value={searchQuery} 
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
              />
            </div>

            {/* Menu Kanan */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto relative">
              
              {/* Notifikasi */}
              <div className="relative">
                <button onClick={() => setOpenMenu(openMenu === "notif" ? null : "notif")}
                  className={`p-2 rounded-lg transition relative ${openMenu === 'notif' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}>
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                {openMenu === "notif" && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg rounded-lg p-4 text-sm z-[60] border border-slate-100">
                    <p className="text-slate-500 text-center py-4">Belum ada notifikasi</p>
                  </div>
                )}
              </div>

              {/* Setting */}
              <div className="relative">
                <button onClick={() => setOpenMenu(openMenu === "setting" ? null : "setting")}
                  className={`p-2 rounded-lg transition ${openMenu === 'setting' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}>
                  <Settings size={20} />
                </button>
                {openMenu === "setting" && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-xl border border-slate-100 rounded-xl p-2 z-[60]">
                    <button onClick={() => { setOpenMenu(null); navigate("/profil"); }}
                      className="flex items-center gap-2 w-full text-left hover:bg-slate-50 p-2.5 rounded-lg text-sm text-slate-700">
                      <UserIcon size={16} className="text-slate-400" />
                      <span>Profil Saya</span>
                    </button>
                    <button onClick={() => navigate("/login")}
                      className="flex items-center gap-2 w-full text-left hover:bg-indigo-50 p-2.5 rounded-lg text-sm text-indigo-600 font-medium">
                      <UserPlus size={16} />
                      <span>Tambah Akun</span>
                    </button>
                    <div className="my-1 border-t border-slate-100"></div>
                    <button onClick={() => { localStorage.clear(); navigate("/"); }}
                      className="flex items-center gap-2 w-full text-left hover:bg-red-50 p-2.5 rounded-lg text-sm text-red-600 font-medium">
                      <LogOut size={16} />
                      <span>LogOut</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-slate-200 mx-2"></div>

              {/* Inisial Profil */}
              <div className="relative">
                <button onClick={() => setOpenMenu(openMenu === "profile" ? null : "profile")}
                  className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                  {initials}
                </button>
                {openMenu === "profile" && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-xl border border-slate-100 rounded-xl p-4 z-[60]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">{initials}</div>
                      <div className="overflow-hidden text-left">
                        <p className="font-bold text-sm truncate text-slate-800">{user.name || "User"}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email || "user@gmail.com"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
        </header>

        {/* Konten*/}
        <main className="p-4 md:p-8 relative z-0">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}