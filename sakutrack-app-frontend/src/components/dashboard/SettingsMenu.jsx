import { useState, useEffect } from "react";
import { Settings, LogOut, Save, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import connection from "../../connection";

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [needs, setNeeds] = useState(50);
  const [wants, setWants] = useState(30);
  const [savings, setSavings] = useState(20);
  const [dailyLimit, setDailyLimit] = useState(80); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      connection.get('/settings')
        .then((res) => {
          if (res.data.success && res.data.data) {
            setNeeds(res.data.data.needs_ratio);
            setWants(res.data.data.wants_ratio);
            setSavings(res.data.data.savings_ratio);
            setDailyLimit(res.data.data.daily_limit_percentage || 80);
          }
        })
        .catch((err) => console.error("Error get settings:", err));
    }
  }, [isOpen]);

  const total = Number(needs) + Number(wants) + Number(savings);

  const handleSaveRatio = async () => {
    if (total === 100) {
      setIsLoading(true);
      try {
        await connection.post('/settings', {
          needs_ratio: needs,
          wants_ratio: wants,
          savings_ratio: savings,
          daily_limit_percentage: dailyLimit
        });
        setIsOpen(false);
        window.location.reload(); 
      } catch (error) {
        console.error("Error save settings:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth); 
      localStorage.clear(); 
      navigate("/login", { replace: true }); 
    } catch (error) {
      console.error("Gagal logout dari Firebase:", error);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded ${isOpen ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
      >
        <Settings className="w-[18px] h-[18px] md:w-5 md:h-5" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white shadow-xl border border-slate-200 rounded-lg p-2 z-[60] flex flex-col gap-1">
          
          <div className="p-2 border-b border-slate-100 mb-2">
            <h4 className="font-bold text-slate-800 text-sm">Pengaturan Rasio</h4>
            <div className="flex items-start gap-1.5 mt-2 bg-blue-50 text-blue-700 p-2 rounded text-[11px] font-medium leading-relaxed">
              <Info size={14} className="shrink-0 mt-0.5" />
              <p>Rasio ideal yang disarankan pakar keuangan adalah <strong>50%</strong> Kebutuhan, <strong>30%</strong> Keinginan, <strong>20%</strong> Tabungan.</p>
            </div>
          </div>

          <div className="px-2 py-1 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 font-medium">Kebutuhan</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={needs} 
                  onChange={(e) => setNeeds(e.target.value)} 
                  className="w-16 border border-slate-300 rounded px-2 py-1 text-center font-bold text-slate-800 focus:outline-none focus:border-slate-500"
                />
                <span className="text-slate-500 font-medium">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 font-medium">Keinginan</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={wants} 
                  onChange={(e) => setWants(e.target.value)} 
                  className="w-16 border border-slate-300 rounded px-2 py-1 text-center font-bold text-slate-800 focus:outline-none focus:border-slate-500"
                />
                <span className="text-slate-500 font-medium">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 font-medium">Tabungan</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={savings} 
                  onChange={(e) => setSavings(e.target.value)} 
                  className="w-16 border border-slate-300 rounded px-2 py-1 text-center font-bold text-slate-800 focus:outline-none focus:border-slate-500"
                />
                <span className="text-slate-500 font-medium">%</span>
              </div>
            </div>
          </div>

          <div className="px-2 mt-2 mb-2">
            <div className="flex items-center justify-between text-xs font-bold mb-3 border-t border-slate-100 pt-3">
              <span className="text-slate-500">Total Persentase:</span>
              <span className={total === 100 ? "text-emerald-600" : "text-rose-600"}>
                {total}%
              </span>
            </div>
            
            <button 
              onClick={handleSaveRatio}
              disabled={total !== 100 || isLoading}
              className={`flex items-center justify-center gap-2 w-full py-2 rounded text-xs font-bold transition-colors ${total === 100 ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              <span>{isLoading ? 'Menyimpan...' : 'Simpan Rasio'}</span>
            </button>
            {total !== 100 && (
              <p className="text-[10px] text-rose-500 text-center mt-2 font-medium">
                Total harus genap 100% untuk menyimpan.
              </p>
            )}
          </div>

          <div className="h-px bg-slate-100 my-1"></div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left p-2.5 rounded text-sm text-rose-600 font-bold hover:bg-rose-50 transition-colors"
          >
            <LogOut size={16} />
            <span>Keluar Akun</span>
          </button>
        </div>
      )}
    </div>
  );
}