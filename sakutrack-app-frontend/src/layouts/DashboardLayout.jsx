import { useState, useEffect } from "react";
import Sidebar from "../components/ui/Sidebar";
import { Search, Bell, Settings, LogOut, Calendar } from "lucide-react";
import connection from "../connection";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

export default function DashboardLayout({ children, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const now = new Date();
  const currentMonth = searchParams.get("month") || String(now.getMonth() + 1);

  const [user, setUser] = useState({ 
    name: localStorage.getItem("user_nama") || "", 
    email: "" 
  });
  
  const [openMenu, setOpenMenu] = useState(null);
  const isDashboard = location.pathname === "/dashboard";

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // List Bulan
  const months = [
    { v: "1", n: "Januari" }, { v: "2", n: "Februari" }, { v: "3", n: "Maret" },
    { v: "4", n: "April" }, { v: "5", n: "Mei" }, { v: "6", n: "Juni" },
    { v: "7", n: "Juli" }, { v: "8", n: "Agustus" }, { v: "9", n: "September" },
    { v: "10", n: "Oktober" }, { v: "11", n: "November" }, { v: "12", n: "Desember" }
  ];

  // Inisial Nama
  const getInitials = (fullName) => {
    if (!fullName || fullName.trim() === "") return "U";
    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return words[0][0].toUpperCase();
  };

  const initials = getInitials(user.name);

  // Profil
  useEffect(() => {
    connection.get('/auth/profile')
      .then((res) => {
        const profile = res.data.data; 
        const currentName = profile?.name || localStorage.getItem("user_nama");
        if (currentName) {
          setUser({ name: currentName, email: profile?.email || "" });
          localStorage.setItem("user_nama", currentName);
        }
      })
      .catch((error) => console.log("Profil error:", error));
  }, []);

  const fetchNotifications = () => {
    connection.get('/notifications')
      .then((res) => {
        if (res.data.success) {
          setNotifications(res.data.data);
          setUnreadCount(res.data.unreadCount);
        }
      })
      .catch((error) => console.log("Notifikasi error:", error));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = (id, isRead) => {
    if (isRead) return;
    connection.put(`/notifications/${id}/read`)
      .then((res) => {
        if (res.data.success) fetchNotifications();
      })
      .catch((err) => console.log(err));
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) return;
    connection.put('/notifications/read-all')
      .then((res) => {
        if (res.data.success) fetchNotifications();
      })
      .catch((err) => console.log(err));
  };

  // Filter Bulan
  const handleMonthChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("month", value);
    setSearchParams(newParams);
  };

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
            <button onClick={() => setOpenMenu("sidebar")} className="p-2 bg-white rounded shadow-sm border border-slate-300">☰</button>
          </div>
        )}

        {/* Header */}
        {isDashboard && (
          <header className="h-auto md:h-20 bg-slate-100 border-b border-slate-300 sticky top-0 z-[50] px-4 md:px-8 py-3 flex flex-wrap items-center gap-3">
              <button onClick={() => setOpenMenu("sidebar")} className="md:hidden p-2 rounded hover:bg-slate-200">☰</button>

              {/* Cari */}
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

              {/* Dropdown Bulan */}
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

              {/* Menu Kanan */}
              <div className="flex items-center gap-3 ml-auto">
                
                <div className="relative">
                  <button onClick={() => setOpenMenu(openMenu === "notif" ? null : "notif")}
                    className={`relative p-2 rounded ${openMenu === 'notif' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                  </button>
                  
                  {openMenu === "notif" && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-xl border border-slate-200 rounded z-[60] overflow-hidden">
                      <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800 text-sm">Notifikasi</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline font-medium">
                            Tandai dibaca
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-[320px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-slate-500 text-center text-sm p-6 italic">Belum ada notifikasi baru</p>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              onClick={() => markAsRead(notif.id, notif.is_read)}
                              className={`p-4 border-b border-slate-50 cursor-pointer transition-colors ${notif.is_read ? 'bg-white opacity-70 hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'}`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <p className={`text-sm ${notif.is_read ? 'text-slate-600' : 'font-bold text-slate-800'}`}>
                                  {notif.title}
                                </p>
                                {!notif.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>}
                              </div>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                              <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                {new Date(notif.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

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