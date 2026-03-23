import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Wallet, TrendingUp, LayoutDashboard, Target, ArrowRight } from "lucide-react";
import connection from '../connection';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Login Email
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Harap isi email dan password Anda.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const response = await connection.post('/auth/login'); 
      if (response.data.success) {
        localStorage.setItem("userId", response.data.data.userId);
        localStorage.setItem("user_nama", response.data.data.username);
        navigate('/dashboard');
      } else {
        alert("Gagal memverifikasi data di server.");
      }
    } catch (error) {
      console.error(error);
      alert("Login gagal. Periksa kembali email atau password Anda.");
    } finally {
      setLoading(false);
    }
  };

  // Login Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      const response = await connection.post('/auth/login');
      if (response.data.success) {
        localStorage.setItem("userId", response.data.data.userId);
        localStorage.setItem("user_nama", response.data.data.username);
        navigate('/dashboard');
      } else {
        alert("Gagal sinkronisasi data dengan server.");
      }
    } catch (error) {
      console.error(error);
      alert("Login dengan Google gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      
      {/* Kiri */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 pt-10 px-16 pb-16 flex-col justify-between relative overflow-hidden">
        {/* Background */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-slate-800 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-slate-800 rounded-full blur-3xl opacity-40"></div>

        {/* Logo */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl">
            <Wallet className="text-slate-900" size={22} />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">SakuTrack</span>
        </div>

        {/* Konten */}
        <div className="z-10 space-y-8">
          <h1 className="text-[3.25rem] font-extrabold text-white leading-tight">
            Kelola Uangmu <br /> 
            <span className="text-slate-400">Capai Targetmu</span>
          </h1>
          <p className="text-slate-400 text-base max-w-md leading-relaxed">
            Kelola finansial harian Anda dengan fitur lengkap yang dirancang untuk kemudahan navigasi.
          </p>
          
          {/* Daftar Fitur */}
          <div className="grid grid-cols-2 gap-6 mt-12">
            <div className="space-y-3 p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
                <LayoutDashboard className="text-white" size={24} />
                <div>
                  <p className="text-white font-bold text-base">Dashboard Utama</p>
                  <p className="text-slate-500 text-xs mt-1">Ringkasan pemasukan, pengeluaran, dan saldo secara real-time.</p>
                </div>
            </div>
            <div className="space-y-3 p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
                <Wallet className="text-white" size={24} />
                <div>
                  <p className="text-white font-bold text-base">Kelola Transaksi</p>
                  <p className="text-slate-500 text-xs mt-1">Catat dan pantau riwayat transaksi harian dengan mudah.</p>
                </div>
            </div>
            <div className="space-y-3 p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
                <Target className="text-white" size={24} />
                <div>
                  <p className="text-white font-bold text-base">Target Tabungan</p>
                  <p className="text-slate-500 text-xs mt-1">Setel target finansial dan pantau progres tabungan Anda.</p>
                </div>
            </div>
            <div className="space-y-3 p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
                <TrendingUp className="text-white" size={24} />
                <div>
                  <p className="text-white font-bold text-base">Proyeksi Keuangan</p>
                  <p className="text-slate-500 text-xs mt-1">Analisis dan prediksi saldo masa depan berdasarkan tren.</p>
                </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 pt-10 border-t border-slate-800">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
            Capstone Project CC26-PS075
          </p>
        </div>
      </div>

      {/* Form Login */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 bg-slate-100 lg:bg-slate-50">
        <div className="w-full max-w-[280px] lg:max-w-[420px] bg-white p-6 lg:p-12 rounded-xl lg:rounded-3xl shadow-md lg:shadow-none lg:bg-transparent border border-slate-200 lg:border-none">
          
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-block p-2 bg-slate-900 rounded-lg mb-3">
               <Wallet className="text-white" size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 uppercase">SakuTrack</h2>
          </div>

          <div className="mb-6 lg:mb-10 text-center lg:text-left">
            <h3 className="text-xl lg:text-3xl font-bold text-slate-900">Masuk Akun</h3>
            <p className="text-slate-500 mt-1 text-[10px] lg:text-sm">Lanjutkan kelola keuanganmu hari ini.</p>
          </div>

          <div className="space-y-3 lg:space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] lg:text-sm font-bold text-slate-600 ml-1">Email</label>
              <input 
                type="email" 
                placeholder="nama@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-3 lg:p-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-slate-900 text-[10px] lg:text-sm" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] lg:text-sm font-bold text-slate-600 ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-3 lg:p-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-slate-900 text-[10px] lg:text-sm" 
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 lg:py-4 rounded-lg font-bold text-xs lg:text-base mt-4 shadow-sm flex items-center justify-center gap-2
                ${loading ? 'bg-slate-300 text-slate-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {loading ? '...' : 'Masuk Sekarang'}
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <hr className="w-full border-slate-200" />
            <span className="px-3 text-[9px] text-slate-400 font-bold whitespace-nowrap uppercase">ATAU</span>
            <hr className="w-full border-slate-200" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-4 w-full py-3 rounded-lg font-bold text-[10px] lg:text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Login Dengan Google
          </button>

          <div className="mt-8 text-center text-[10px] lg:text-sm">
            <span className="text-slate-400 font-medium">Baru di SakuTrack? </span>
            <Link to="/register" className="text-slate-900 font-bold hover:underline underline-offset-4">
              Daftar di Sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}