import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { Toaster } from "react-hot-toast";
import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import connection from "./connection";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InputTransaksi from './pages/InputTransaksi';
import TargetTabungan from './pages/TargetTabungan';
import Prediksi from './pages/Prediksi';
import Profil from './pages/Profil';
import Wishlist from './pages/Wishlist';
import DashboardLayout from './layouts/DashboardLayout';
import Popup from "./components/notification/Popup";

const socket = io("http://13.229.64.163:3000");

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState({ 
    id: null, 
    name: localStorage.getItem("user_nama") || "", 
    email: "" 
  });

  // Ambil Profil & Socket
  useEffect(() => {
    connection.get('/auth/profile')
      .then((res) => {
        const profile = res.data.data;
        if (profile) {
          console.log("Mencoba Join Room untuk User ID:", profile.id);
          setUser({ id: profile.id, name: profile.name, email: profile.email });
          localStorage.setItem("user_nama", profile.name);
          socket.emit("join", profile.id);
        }
      })
      .catch((err) => console.log("Profil global error:", err));
  }, []);

  useEffect(() => {
    if (!user.id) return;

    const handleReconnect = () => {
      console.log("Socket reconnected! Memastikan masuk ulang ke Room ID:", user.id);
      socket.emit("join", user.id);
    };

    socket.on("connect", handleReconnect);

    return () => {
      socket.off("connect", handleReconnect);
    };
  }, [user.id]);

  // Firebase Cloud Mesaging
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
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

    if (user.id) setupFCM();
  }, [user.id]);

  return (
    <Router>
      <Toaster />
      <Popup socket={socket} />

      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* App */}
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