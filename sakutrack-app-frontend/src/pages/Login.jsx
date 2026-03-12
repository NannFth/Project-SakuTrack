import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate(); //fungsi untuk pindah ke halaman lain

    const [namaInput, setNamaInput] = useState("");
    const [sekolahInput, setSekolahInput] =useState("");

    const handleLogin = () => {
        if (namaInput.trim() !== "" && sekolahInput.trim() !== "") {
            // simpan ke localstorage
            localStorage.setItem("user_nama", namaInput);
            localStorage.setItem("user_sekolah", sekolahInput);

            navigate('/dashboard', { 
                state: { 
                    nama: namaInput,
                    sekolah: sekolahInput
                } 
            }); // kirim nama ke dashboard
        } else {
            alert("Isi nama dan sekolah/jurusan dulu yaa!");
        }
    };
    
    return (
        <div className="h-screen flex flex-col justify-center p-8 text-center bg-white">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-blue-600 tracking-tighter">SakuTrack.</h1>
                <p className="text-slate-400 text-sm mt-2 italic">"Kelola Uangmu, Capai Targetmu"</p>
            </div>

        <div className="space-y-4">
            {/* input sederhna untuk simulasi login */}
            <input type="text" placeholder="Username / ID Siswa" value={namaInput} onChange={e => setNamaInput(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="text" placeholder="Sekolah / Jurusan" value={sekolahInput} onChange={e => setSekolahInput(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />

            <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
            >
                Masuk sekarang
            </button>
        </div>
        <p className="mt-8 text-[10px] text-slate-300 uppercase tracking-widest font-bold">Capstone Project CC26-PS075</p>
        </div>
    );
};
