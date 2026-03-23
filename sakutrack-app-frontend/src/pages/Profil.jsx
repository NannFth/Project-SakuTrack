import { useState, useEffect } from "react";
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
          alert("Nama berhasil diperbarui!");
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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 uppercase">Profil Saya</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola informasi akun Anda di sini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Inisial */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg">
            {getInitials(name)}
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-900 text-lg">{name || "User"}</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Pengguna SakuTrack</p>
          </div>
        </div>

        {/* Form Edit */}
        <form onSubmit={handleUpdate} className="md:col-span-2 bg-white p-6 lg:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Input Nama */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <User size={14} /> Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama baru"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-slate-900 font-semibold text-slate-800 text-sm"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Mail size={14} /> Alamat Email
            </label>
            <div className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-400 text-sm font-medium flex justify-between items-center">
              {email}
              <ShieldCheck size={16} className="text-slate-300" />
            </div>
            <p className="text-[10px] text-slate-400 italic">*Email tidak dapat diubah untuk keamanan akun.</p>
          </div>

          {/* Tombol Simpan */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2
                ${loading ? 'bg-slate-300 text-slate-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              <Save size={18} />
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}