import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import connection from "../../connection";

export default function Notification({ userId, socket }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

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

    if (socket) {
      socket.on("new_notification", (data) => {
        console.log("Sinyal masuk ke lonceng:", data);
        
        fetchNotifications();
      });

      socket.on("notifications_updated", () => {
        console.log("Status notifikasi berubah, mereload...");
        fetchNotifications();
      });
    }

    return () => {
      if (socket) {
        socket.off("new_notification");
        socket.off("notifications_updated");
      }
    };
  }, [socket]);

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

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded ${isOpen ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-600 text-white text-[10px] font-bold px-1 rounded-full border-2 border-slate-100 min-w-[18px] h-[18px]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifikasi */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          
          <div className="fixed md:absolute right-2 md:right-0 top-16 md:top-full mt-2 w-[calc(100vw-1rem)] md:w-80 bg-white shadow-xl border border-slate-200 rounded z-[60] overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Notifikasi</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline font-medium">
                  Tandai dibaca
                </button>
              )}
            </div>
            
            <div className="max-h-[400px] md:max-h-[320px] overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-slate-500 text-center text-sm p-6 italic">Belum ada notifikasi baru</p>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    onClick={() => {
                      markAsRead(notif.id, notif.is_read);
                    }}
                    className={`p-4 border-b border-slate-50 cursor-pointer transition-colors break-words ${notif.is_read ? 'bg-white opacity-70 hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'}`}
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
        </>
      )}
    </div>
  );
}