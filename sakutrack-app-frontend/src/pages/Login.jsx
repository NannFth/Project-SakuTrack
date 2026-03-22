import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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
        
        alert("Login berhasil. Selamat datang!");
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
        
        alert("Login dengan Google berhasil.");
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
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      {/* Card */}
      <div className="w-full max-w-[400px] bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-indigo-50 rounded-xl mb-3">
            <h1 className="text-3xl font-black text-indigo-600 tracking-tighter">SakuTrack</h1>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Halo, Selamat Datang!</h2>
          <p className="text-slate-400 text-sm mt-1">Kelola Uangmu, Capai Targetmu!</p>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Email</label>
            <input 
              type="email" 
              placeholder="nama@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-2 focus:ring-indigo-50 transition-all outline-none text-sm" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-2 focus:ring-indigo-50 transition-all outline-none text-sm" 
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-2xl font-bold text-sm transition-all shadow flex items-center justify-center gap-2 mt-4
              ${loading ? 'bg-slate-300 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            {loading ? 'Menghubungkan...' : 'Masuk ke Dashboard'}
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-slate-200" />
          <span className="p-2 text-xs text-slate-400 font-bold bg-white">ATAU</span>
          <hr className="w-full border-slate-200" />
        </div>

        {/* Tombol Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-4 w-full py-3 rounded-2xl font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
        >
          {/* Logo Google */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Masuk dengan Google
        </button>

        {/* Link Daftar */}
        <div className="mt-6 text-center text-sm">
          <span className="text-slate-500">Belum punya akun? </span>
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            Daftar di sini
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-300 uppercase tracking-[2px] font-bold">
            Capstone Project CC26-PS075
          </p>
        </div>
      </div>
    </div>
  );
}