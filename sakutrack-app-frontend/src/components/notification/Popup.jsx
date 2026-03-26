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
          case 'success': return { icon: '🏆', label: 'Pencapaian' };
          case 'alert':   return { icon: '🚨', label: 'Bahaya' };
          case 'warning': return { icon: '⚠️', label: 'Peringatan' };
          case 'info':    return { icon: '✨', label: 'Info Transaksi' };
          default:        return { icon: '🔔', label: 'Notifikasi' };
        }
      };

      const { icon, label } = getMeta(data.type);

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
          } max-w-md w-full bg-slate-900 text-white shadow-2xl rounded-xl border border-slate-700 pointer-events-auto flex transition-all duration-500 transform z-[99999] mt-5`}
        >
          <div className="flex-1 flex items-center p-4">
            <div className="text-3xl mr-5 shrink-0">
              {icon}
            </div>
            
            <div className="flex flex-col min-w-0 text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                {label}
              </p>
              <p className="text-sm font-bold text-white truncate">
                {data.title 
                  ? data.title
                      .replace(/[^\x00-\x7F]/g, "")
                      .replace(/[⚠️🚨⭐📉✨🏆]/g, "")
                      .trim() 
                  : 'Notifikasi'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                {data.message}
              </p>
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-5 border-l border-slate-800 hover:bg-slate-800 transition-colors flex items-center justify-center group"
          >
            <X size={18} className="text-slate-500 group-hover:text-white" />
          </button>
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