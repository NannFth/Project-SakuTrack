import {useState, useEffect} from "react";
import Sidebar from "../components/ui/Sidebar";
import {Search, Bell, Settings} from "lucide-react";
import {BASE_URL} from "../connection";

export default function DashboardLayout({ children, searchQuery, setSearchQuery }) {
  const [inisial, setInisial] = useState("U");

  // Ambil Profil 
  useEffect(() => {
    const kunci = localStorage.getItem("userId");

    fetch(`${BASE_URL}/profile`, {
      headers: { "Authorization": kunci }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.nama !== null && data.nama !== "") {
          const namaUser = data.nama;
          const hurufPertama = namaUser[0];
          setInisial(hurufPertama.toUpperCase());
        }
      })
      .catch((error) => {
        console.log("Gagal memuat profil:", error);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      <aside className="w-64 fixed inset-y-0 left-0">
        <Sidebar />
      </aside>

      <div className="flex-1 ml-64 flex flex-col">
        
        <header className="h-20 bg-white border-b sticky top-0 z-40 px-8 flex items-center justify-between">
          
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

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition">
              <Settings size={20} />
            </button>

            <div className="w-px h-6 bg-slate-200 mx-2"></div>

            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold">
              {inisial}
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}