import { useEffect } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function Popup({ socket }) {
  useEffect(() => {
    if (!socket) return;

    socket.on("new_notification", (data) => {
      console.log("🔥 Paket PopUp Diterima", data);
      const getDetails = (type) => {
        switch (type) {
          case 'success':
            return { icon: '🏆', label: 'Pencapaian Target' };
          case 'alert':
            return { icon: '🚨', label: 'Peringatan Bahaya' };
          case 'warning':
            return { icon: '⚠️', label: 'Perhatian Sistem' };
          case 'info':
            return { icon: '✨', label: 'Info Transaksi' };
          default:
            return { icon: '🔔', label: 'Notifikasi Baru' };
        }
      };

      const { icon, label } = getDetails(data.type);

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          } max-w-2xl w-full bg-slate-900 text-white shadow-xl rounded-lg pointer-events-auto flex transition-all duration-300 transform z-[9999] mt-2`}
        >
          {/* Konten */}
          <div className="flex-1 flex items-center p-4">
            {/* Icon */}
            <div className="text-3xl mr-5">
              {icon}
            </div>
            
            <div className="flex flex-col">
              {/* Label */}
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {label}
              </p>
              <p className="text-sm font-bold text-white">
                {data.title.replace(/[🏆🚨⚠️✨🔔]/g, '').trim()} 
              </p>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                {data.message}
              </p>
            </div>
          </div>

          {/* Tutup */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 border-l border-slate-800 hover:bg-slate-800 transition-colors flex items-center justify-center group"
          >
            <X size={18} className="text-slate-500 group-hover:text-white" />
          </button>
        </div>
      ), {
        position: 'top-center',
        duration: 10000,
      });
    });

    return () => socket.off("new_notification");
  }, [socket]);

  return null;
}