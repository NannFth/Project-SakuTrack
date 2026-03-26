import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { Toaster, toast } from "react-hot-toast"; 
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import connection from "./connection";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InputTransaksi from './pages/InputTransaksi';
import TargetTabungan from './pages/TargetTabungan';
import Prediksi from './pages/Prediksi';
import Profil from './pages/Profil';
import Wishlist from './pages/Wishlist';
import RekomendasiKeuangan from './pages/RekomendasiKeuangan';
import DashboardLayout from './layouts/DashboardLayout';
import Popup from "./components/notification/Popup";

const socket = io("http://13.229.64.163:3000", {
  transports: ["websocket"],
  reconnection: true
});

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState({ 
    id: null, 
    name: localStorage.getItem("user_nama") || "", 
    email: "" 
  });

  // Profil & Soket
  useEffect(() => {
    connection.get('/auth/profile')
      .then((res) => {
        const profile = res.data.data;
        if (profile) {
          console.log("Mencoba Join Room untuk User ID:", profile.id);
          setUser({ id: profile.id, name: profile.name, email: profile.email });
          localStorage.setItem("user_nama", profile.name);
          
          if (socket.connected) {
            socket.emit("join", { id: profile.id, name: profile.name });
          } else {
            socket.once("connect", () => {
              socket.emit("join", { id: profile.id, name: profile.name });
            });
          }
        }
      })
      .catch((err) => console.log("Profil global error:", err));
  }, []);

  useEffect(() => {
    if (!user.id) return;

    const handleReconnect = () => {
      console.log("Socket reconnected! Memastikan masuk ulang ke Room ID:", user.id);
      socket.emit("join", String(user.id));
    };

    socket.on("connect", handleReconnect);

    return () => {
      socket.off("connect", handleReconnect);
    };
  }, [user.id]);

  // Firebase Cloud Messaging
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted" && user.id) {
          const token = await getToken(messaging, { 
            vapidKey: "BEj_5ubshBYkb2UcMd20vHTgpx2muHxd-xbAX3xlrcY7k9eF9LujyR1jwn9woZbjfpqt7li8lhmYC8unbzIYJ84" 
          });

          if (token) {
            console.log("FCM Token didapat:", token);
            await connection.post('/auth/save-token', { fcm_token: token });
          }
        }
      } catch (error) {
        console.log("FCM Global Error:", error);
      }
    };
    setupFCM();
  }, [user.id]);

  // Listener Notif
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      if (payload.data?.isManual !== "true") return;

      const category = payload.data?.category || 'info';
      
      const styles = {
        alert: { icon: "🚨", color: "text-red-500", label: "BAHAYA" },
        warning: { icon: "⚠️", color: "text-yellow-500", label: "PERINGATAN" },
        info: { icon: "🔔", color: "text-blue-400", label: "INFO" }
      };

      const s = styles[category] || styles.info;

      window.dispatchEvent(new Event("new-notification-received"));

      toast.custom((t) => (
        <div className={`${
            t.visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
          } max-w-md w-full bg-[#1e293b] shadow-2xl rounded-xl pointer-events-auto flex border border-slate-700/50 transition-all duration-500 transform z-[99999] mt-5`}>
          <div className="flex-1 w-0 p-5">
            <div className="flex items-center">
              
              {/* Ikon */} 
              <div className="flex-shrink-0 text-3xl">
                {s.icon}
              </div>
              
              {/* Teks */}
              <div className="ml-5 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    {/* Kategori */}
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${s.color} mb-1`}>
                        {s.label}
                    </p>
                    {/* Judul Notif */}
                    <p className="text-[15px] font-bold text-white leading-tight">
                      {payload.data?.title || "SakuTrack Info"}
                    </p>
                  </div>

                  <button 
                    onClick={() => toast.dismiss(t.id)} 
                    className="ml-4 text-slate-500 hover:text-white transition-colors"
                  >
                    <span className="text-xl leading-none">×</span>
                  </button>
                </div>
                {/* Isi */}
                <p className="mt-2 text-[13px] text-slate-400 font-medium leading-relaxed">
                  {payload.data?.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      ), { duration: 10000, position: 'top-center' });
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Toaster />
      <Popup socket={socket} />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={
          <DashboardLayout user={user} socket={socket} searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            <Dashboard searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </DashboardLayout> 
        } />
        
        <Route path="/input-transaksi" element={
          <DashboardLayout user={user} socket={socket} searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            <InputTransaksi />
          </DashboardLayout>
        } />
        
        <Route path="/target-tabungan" element={
          <DashboardLayout user={user} socket={socket} searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            <TargetTabungan />
          </DashboardLayout>
        } />

        <Route path="/wishlist" element={
          <DashboardLayout user={user} socket={socket} searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            <Wishlist />
          </DashboardLayout>
        } />

        <Route path="/rekomendasi-keuangan" element={
          <DashboardLayout user={user} socket={socket} searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            <RekomendasiKeuangan />
          </DashboardLayout>
        } />

        <Route path="/prediksi" element={
          <DashboardLayout user={user} socket={socket} searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            <Prediksi />
          </DashboardLayout>
        } />
        
        <Route path="/profil" element={
          <DashboardLayout user={user} socket={socket} searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            <Profil />
          </DashboardLayout>
        } />
      </Routes>
    </Router>
  );
};

export default App;