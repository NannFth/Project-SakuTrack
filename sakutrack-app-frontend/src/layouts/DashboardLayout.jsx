import {useState, useEffect} from "react";
import Sidebar from "../components/ui/Sidebar";
import {Search, Bell, Settings, User as UserIcon, LogOut, UserPlus} from "lucide-react";
import {BASE_URL} from "../connection";
import { useNavigate  } from "react-router-dom";

export default function DashboardLayout({ children, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  
  //  state user
  const [user, setUser] = useState({
    nama: "",
    email: "",
  });

  // inisial dari user
  const inisial= user.nama ? user.nama[0].toUpperCase() : "U";

  // state menu
  const [openMenu, setOpenMenu] = useState(null);

  // Ambil Profil 
  useEffect(() => {
    const kunci = localStorage.getItem("userId");

    fetch(`${BASE_URL}/profile`, {
      headers: { "Authorization": kunci }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.nama) {
          setUser({
            nama: data.nama,
            email: data.email,
          });
        }
      })
      .catch((error) => {
        console.log("Gagal memuat profil:", error);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {openMenu && (
        <div 
          className="fixed inset-0 z-[40]"
          onClick={() => setOpenMenu(null)}
        ></div>
      )}

      <aside className="w-64 fixed inset-y-0 left-0 z-50">
        {/*kirim ke sidebar*/}
        <Sidebar  user={user} />
      </aside>

      <div className="flex-1 ml-64 flex flex-col">
        
        <header className="h-20 bg-white border-b sticky top-0 z-[50] px-8 flex items-center justify-between">
          
          <div className="relative w-96">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Cari transaksi atau kategori..."
              value={searchQuery} 
              onChange={(e) => {
                // Pencarian
                if (setSearchQuery !== undefined && setSearchQuery !== null) {
                  setSearchQuery(e.target.value);
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-3 relative">
            {/* notif */}
            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === "notif" ? null : "notif")}
                className={`p-2 rounded-lg transition relative ${openMenu === 'notif' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {openMenu === "notif" && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 text-sm z-[60]">
                  <h4 className="font-semibold text-sm mb-2 text-slate-800">Notifikasi</h4>
                  <div className="py-6 text-center text-slate-400">
                    <p className="text-slate-500">Belum ada notifikasi</p>
                  </div>
                </div>
              )}
            </div>

            {/*setting*/}
            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === "setting" ? null : "setting")}
                className={`p-2 rounded-lg transition ${openMenu === 'setting' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
              >
                <Settings size={20} />
              </button>

              {openMenu === "setting" && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl border border-slate-100 rounded-xl p-2 z-[60]">
                  <button 
                    onClick={() => {
                      setOpenMenu(null);
                      navigate("/profil");
                    }}
                    className="flex items-center gap-2 w-full text-left hover:bg-slate-50 p-2.5 rounded-lg text-sm transition text-slate-700"
                  >
                    <UserIcon size={16} className="text-slate-400" />
                    <span>Profil Saya</span>
                  </button>
                  
                  {/* fitur tambah / ganti akun */}
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 w-full text-left hover:bg-indigo-50 p-2.5 rounded-lg text-sm transition text-indigo-600 font-medium"
                  >
                    <UserPlus size={16} />
                    <span>Tambah Akun</span>
                  </button>

                  <div className="my-1 border-t border-slate-100"></div>

                  <button 
                    onClick={() => { localStorage.clear(); navigate("/"); }}
                    className="flex items-center gap-2 w-full text-left hover:bg-red-50 p-2.5 rounded-lg text-sm transition text-red-600 font-medium"
                  >
                    <LogOut size={16} />
                    <span>LogOut</span>
                  </button>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-slate-200 mx-2"></div>

            {/* profile */}
            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === "profile" ? null : "profile")}
                className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold"
              >
                {inisial}
              </button>

              {openMenu === "profile" && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl border border-slate-100 rounded-xl p-4 z-[60]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                      {inisial}
                    </div>
                    <div className="overflow-hidden text-left">
                      <p className="font-bold text-sm truncate text-slate-800">{user.nama || "User"}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email || "user@gmail.com"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        <main className="p-8 relative z-0">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}