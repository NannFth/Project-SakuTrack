import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../connection";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (email === "" || password === "") {
      alert("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    // Kirim Data
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success === true) {
          // Simpan
          localStorage.setItem("userId", result.data.userId);
          localStorage.setItem("user_nama", result.data.username);
          navigate('/dashboard');
        } else {
          alert("Login gagal, silakan cek kembali.");
        }
      })
      .catch((error) => {
        console.log("Error login:", error);
        alert("Gagal terhubung ke server.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      {/* Login */}
      <div className="w-full max-w-[400px] bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-indigo-50 rounded-xl mb-3">
            <h1 className="text-3xl font-black text-indigo-600 tracking-tighter">SakuTrack</h1>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Halo, Selamat Datang!</h2>
          <p className="text-slate-400 text-sm mt-1">Kelola Uangmu, Capai Targetmu</p>
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

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-[10px] text-slate-300 uppercase tracking-[2px] font-bold">
            Capstone Project CC26-PS075
          </p>
        </div>
      </div>
    </div>
  );
}