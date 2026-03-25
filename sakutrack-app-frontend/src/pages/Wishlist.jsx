import { useState, useEffect } from "react";
import { Plus, Trash2, ShoppingBag, Heart, CheckCircle2, Wallet } from "lucide-react";

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [savings, setSavings] = useState(0);
    const [tempInputs, setTempInputs] = useState({});
    
    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem('sakutrack_wishlist')) || [];
        setWishlist(savedWishlist);
    }, []);

    // simpan localstorage
    const saveToLocal = (data, newSavings = savings) => {
        setWishlist(data);
        setSavings(newSavings);
        localStorage.setItem('sakutrack_wishlist', JSON.stringify(data));
        localStorage.setItem('sakutrack_savings', newSavings.toString());
    };

    // fungsi frormat rupiah
    const formatDisplay = (val) => {
        if (!val) return "";
        let numberString = val.toString().replace(/\D/g, "");
        return "Rp " + numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, "");
        setPrice(rawValue);
    };

    const handleTempInputChange = (id, value) => {
        const rawValue = value.replace(/\D/g, "");
        setTempInputs(prev => ({ ...prev, [id]: rawValue}));
    };

    const addWishlist = () => {
        if (!name || !price) {
            alert("Isi nama barang dan harganya dulu ya!");
            return;
        }
        const newItem = {
            id: Date.now(),
            name: name,
            price: parseInt(price),
            currentSavings: 0,
            createdAt: new Date().toLocaleDateString('id-ID')
        };
        saveToLocal([...wishlist, newItem]);
        setName('');
        setPrice('');
    };

    // fungsi tambah nominal
    const updateSaving = (id) => {
        const amount = tempInputs[id];
        if (!amount || isNaN(amount)) return;
        
        const updateWishlist = wishlist.map(item => {
            if (item.id === id) {
                return { ...item, currentSavings: (item.currentSavings || 0) + parseInt(amount) };
            }
            return item;
        });

        saveToLocal(updateWishlist);
        setTempInputs(prev => ({ ...prev, [id]: ""}));
    };
    

    const deleteWishlist = (id) => {
        if (window.confirm("Hapus dari daftar keinginan?")) {
            const filtered = wishlist.filter(item => item.id !== id);
            saveToLocal(filtered);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto p-6 space-y-8 pb-20">
            {/*header banner*/}
            <div className="bg-gradient-to-r from-rose-950 via-slate-950 p-10 rounded-3xl text-white shadow-xl relative overflow-hidden border-b-4 border-indigo-500">
                <div className="relative z-10">
                    <div>
                        <h1 className="text-3xl font-black flex items-center gap-3">
                            <ShoppingBag size={32} className="text-indigo-400 "/> Wishlist Impian
                        </h1>
                        <p className="opacity-80 mt-2 font-medium italic">Klik "Tambah nominal" di setiap kartu untuk menabung!</p>
                    </div>
                </div>
                <Heart className="absolute -right-10 -bottom-10 text-white/10 w-64 h-64" />
            </div>

            {/* input form card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-6 items-end">
                <div className="flex-1 min-w-[250px]">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Apa yang kamu inginkan?</label>
                    <input
                        className="w-full border-b-2 border-slate-100 p-2 outline-none focus:border-indigo-500 transition-all text-slate-700 font-semibold"
                        placeholder="Misal: Laptop Baru"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="w-64">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Estimasi Harga</label>
                    <input
                        type="text"
                        className="w-full border-b-2 border-slate-100 p-2 outline-none focus:border-indigo-500 transition-all text-indigo-900 font-bold"
                        placeholder="0"
                        value={formatDisplay(price)}
                        onChange={handlePriceChange}
                    />
                </div>
                <button 
                    onClick={addWishlist}
                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                >
                    <Plus size={20} /> Tambah Keinginan
                </button>
            </div>

            {/* list grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg-grid-cols-3 gap-6">
                {wishlist.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-dashed border-slate-200">
                        <p className="text-slate-400 italic">Belum ada barang di wishlist. Yuk, tulis mimpi kamu!</p>
                    </div>
                ) : (
                    wishlist.map((item) => {
                        const currentVal = item.currentSavings || 0;
                        const isAchieved = currentVal >= item.price;
                        const progress = Math.floor(Math.min((item.currentSavings / item.price) * 100, 100));

                        return (
                            <div key={item.id} className={`p-1 rounded-2xl transition-all shadow-md ${isAchieved ? 'bg-gradient-to-br from-indigo-500 to-slate-900' : 'bg-slate-200'}`}>
                                <div className="bg-white p-6 rounded-[14px] h-full flex flex-col justify-between relative overflow-hidden group">
                                    {/* label tercapai */}
                                    {isAchieved && (
                                        <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-[9px] font-black uppercase rounded-bl-lg flex items-center gap-1 shadow-md z-10">
                                            <CheckCircle2 size={10} /> Wishlist Tercapai!
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                                            <p className="text-[14px] font-black text-slate-500">{progress}%</p>
                                        </div>

                                        {/* progress bar sederhana */}
                                        <p className="text-indigo-60 font-bold text-sm mt-1">
                                            {formatDisplay(currentVal)} <span className="text-slate-400 font-medium">/ {formatDisplay(item.price)}</span>
                                        </p>

                                        <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-700 ${isAchieved ? 'bg-indigo-600' : 'bg-rose-900'}`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        {!isAchieved ? (
                                            <>
                                                <input 
                                                    type="text"
                                                    placeholder="Tambah nominal..."
                                                    className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-indigo-400 font-bold text-indigo-900"
                                                    value={formatDisplay(tempInputs[item.id] || "")}
                                                    onChange={(e) => handleTempInputChange(item.id, e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            updateSaving(item.id);
                                                        }
                                                    }}
                                                />
                                                <p className="text-[8px] text-slate-400 mt-1 uppercase italic">Tekan Enter untuk simpan</p>
                                            </>
                                        ) : (
                                            <div className="w-full bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-center">
                                                <p className="text-indigo-700 font-bold text-[11px] uppercase tracking-wider flex itemscenter justify-center gap-2">
                                                    <CheckCircle2 size={14} /> Wishlist sudah tercapai
                                                </p>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                                            <p className="text-[10px] text-slate-300 font-bold uppercase">{item.createdAt}</p>
                                            <button 
                                                onClick={() => deleteWishlist(item.id)}
                                                className="text-slate-300 hover:text-rose-600 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}    
            </div>
        </div>
    );
}