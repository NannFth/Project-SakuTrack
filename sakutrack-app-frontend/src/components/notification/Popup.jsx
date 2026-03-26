import { useEffect } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function Popup({ socket }) {
  useEffect(() => {
    if (!socket) {
      console.log("Popup: Socket tidak terdeteksi");
      return;
    }

    console.log("Popup: Listener aktif");

    const handleNewNotification = (data) => {
      console.log("Popup: Paket diterima:", data);

      const getMeta = (type) => {
        switch (type) {
          case 'success': return { icon: '🏆', label: 'Pencapaian', color: 'text-blue-400' };
          case 'alert':   return { icon: '🚨', label: 'Bahaya', color: 'text-red-500' };
          case 'warning': return { icon: '⚠️', label: 'Peringatan', color: 'text-yellow-500' };
          case 'info':    return { icon: '✨', label: 'Info Transaksi', color: 'text-blue-400' };
          default:        return { icon: '🔔', label: 'Notifikasi', color: 'text-slate-500' };
        }
      };

      const { icon, label, color } = getMeta(data.type);

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
          } max-w-md w-full bg-[#1e293b] text-white shadow-2xl rounded-xl border border-slate-700/50 pointer-events-auto flex transition-all duration-500 transform z-[99999] mt-5`}
        >
          <div className="flex-1 p-5">
            <div className="flex items-center">
              {/* Ikon besar rata tengah vertikal */}
              <div className="text-3xl mr-5 shrink-0">
                {icon}
              </div>
              
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 text-left">
                    {/* Label kategori dengan warna sesuai tipe */}
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${color}`}>
                      {label}
                    </p>
                    <p className="text-[15px] font-bold text-white leading-tight truncate">
                      {data.title 
                        ? data.title
                            .replace(/[^\x00-\x7F]/g, "")
                            .replace(/[⚠️🚨⭐📉✨🏆]/g, "")
                            .trim() 
                        : 'Notifikasi'}
                    </p>
                  </div>

                  {/* Tombol X di pojok kanan atas */}
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="ml-4 text-slate-500 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-[13px] text-slate-400 mt-2 font-medium leading-relaxed text-left">
                  {data.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      ), {
        id: `notif-${Date.now()}`,
        position: 'top-center',
        duration: 8000, 
      });
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
      console.log("Popup: Listener dimatikan");
    };
  }, [socket]);

  return null;
}