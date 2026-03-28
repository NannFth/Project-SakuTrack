import React, { useState, useEffect } from "react";
import { User, Mail, Save, ShieldCheck } from "lucide-react";
import connection from "../connection";

export default function Profil() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Ambil Data
  useEffect(() => {
    connection.get('/auth/profile')
      .then((res) => {
        const profile = res.data.data;
        setName(profile?.name || "");
        setEmail(profile?.email || "");
      })
      .catch((err) => console.log("Gagal muat profil:", err));
  }, []);

  // Inisial
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return words[0][0].toUpperCase();
  };

  // Update Nama
  const handleUpdate = (e) => {
    e.preventDefault();
    setLoading(true);

    connection.put('/auth/profile', { name })
      .then((res) => {
        if (res.data.success) {
          alert("Nama Kamu berhasil diperbarui!");
          localStorage.setItem("user_nama", name);
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log("Update gagal:", err);
        alert("Gagal memperbarui profil.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Profil</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola informasi identitas akun.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded p-6 md:p-10 space-y-8">
        
        {/* Inisial */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-20 h-20 bg-slate-900 rounded flex items-center justify-center text-white text-2xl font-black">
            {getInitials(name)}
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Pengguna SakuTrack</p>
          </div>
        </div>

        {/* Form Edit */}
        <form onSubmit={handleUpdate} className="space-y-6">
          
          {/* Input Nama */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Kamu"
              className="w-full p-3 bg-white border border-slate-200 rounded outline-none focus:border-slate-900 font-semibold text-slate-800 text-sm transition-colors"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Alamat Email
            </label>
            <div className="w-full p-3 bg-slate-50 border border-slate-100 rounded text-slate-400 text-sm font-medium flex justify-between items-center cursor-not-allowed">
              {email}
              <ShieldCheck size={16} className="text-slate-300" />
            </div>
            <p className="text-[10px] text-slate-400 italic">Email bersifat permanen untuk keamanan akun.</p>
          </div>

          {/* Tombol Simpan */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded font-bold text-sm transition-all
                ${loading ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {loading ? 'Sedang Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}