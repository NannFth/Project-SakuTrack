import { useEffect } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function Popup({ socket }) {
  useEffect(() => {
    if (!socket) return;

    socket.on("new_notification", (data) => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-2xl w-full bg-slate-900 shadow-2xl rounded-xl border-l-4 ${
            data.type === 'success' ? 'border-green-500' : (data.type === 'alert' ? 'border-red-500' : 'border-yellow-500')
          } pointer-events-auto flex ring-1 ring-black ring-opacity-5 transition-all duration-300`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-2xl">
                {data.type === 'success' ? '🎉' : (data.type === 'alert' ? '🚨' : '⚠️')}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-bold text-white uppercase tracking-wider">
                  {data.title}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {data.message}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex border-l border-slate-700">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg px-4 flex items-center justify-center text-slate-400 hover:text-white transition-colors focus:outline-none"
              title="Tutup"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ), {
        position: 'top-center',
        duration: Infinity,
      });
    });

    return () => socket.off("new_notification");
  }, [socket]);

  return null;
}