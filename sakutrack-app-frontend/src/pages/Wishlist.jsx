import { useState, useEffect } from "react";
import { Plus, Trash2, ShoppingBag, Heart, CheckCircle2 } from "lucide-react";

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [savings, setSavings] = useState(0);
    const [tempInputs, setTempInputs] = useState({});
    
    // Ambil Data
    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem('sakutrack_wishlist')) || [];
        setWishlist(savedWishlist);
        const savedSavings = localStorage.getItem('sakutrack_savings') || "0";
        setSavings(parseInt(savedSavings));
    }, []);

    const saveToLocal = (data, newSavings = savings) => {
        setWishlist(data);
        setSavings(newSavings);
        localStorage.setItem('sakutrack_wishlist', JSON.stringify(data));
        localStorage.setItem('sakutrack_savings', newSavings.toString());
    };

    // Format Uang
    const formatDisplay = (val) => {
        if (!val) return "";
        let numberString = val.toString().replace(/\D/g, "");
        return "Rp " + numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Harga
    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, "");
        setPrice(rawValue);
    };

    // Input Tabungan
    const handleTempInputChange = (id, value) => {
        const rawValue = value.replace(/\D/g, "");
        setTempInputs(prev => ({ ...prev, [id]: rawValue}));
    };

    // Tambah Wislist
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

    // Update Tabungan
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

    // Hapus Wishlisy
    const deleteWishlist = (id) => {
        if (window.confirm("Hapus dari daftar keinginan?")) {
            const filtered = wishlist.filter(item => item.id !== id);
            saveToLocal(filtered);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 pb-20">
            
            {/* Header */}
            <div className="bg-slate-900 p-10 rounded-md text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <ShoppingBag size={32} className="text-blue-400"/> Wishlist Impian
                    </h1>
                    <p className="opacity-70 mt-2 font-medium">Simpan dulu, wujudkan nanti. Daftar kecil untuk impian besar kamu.</p>
                </div>
                <Heart className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64" />
            </div>

            {/* Form Input */}
            <div className="bg-white p-6 rounded-md border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Nama Barang</label>
                    <input
                        className="w-full border-b border-slate-200 p-2 outline-none focus:border-slate-900 transition-all text-slate-700 font-semibold"
                        placeholder="Misal: Laptop Baru"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Estimasi Harga</label>
                    <input
                        type="text"
                        className="w-full border-b border-slate-200 p-2 outline-none focus:border-slate-900 transition-all text-slate-900 font-bold"
                        placeholder="Rp 0"
                        value={formatDisplay(price)}
                        onChange={handlePriceChange}
                    />
                </div>
                <button 
                    onClick={addWishlist}
                    className="w-full md:w-auto bg-slate-900 text-white px-8 py-3 rounded-md font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={20} /> Tambah
                </button>
            </div>

            {/* Wishlist */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-md border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 italic font-medium">Belum ada barang di wishlist.</p>
                    </div>
                ) : (
                    wishlist.map((item) => {
                        const currentVal = item.currentSavings || 0;
                        const isAchieved = currentVal >= item.price;
                        const progress = Math.floor(Math.min((currentVal / item.price) * 100, 100));

                        return (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-md p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                                        {isAchieved && (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-black uppercase">Tercapai</span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-slate-900 font-bold text-sm">
                                            {formatDisplay(currentVal)} 
                                            <span className="text-slate-400 font-medium ml-1">/ {formatDisplay(item.price)}</span>
                                        </p>
                                        <p className="text-xs font-black text-slate-400">{progress}%</p>
                                    </div>

                                    {/* Progres */}
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-6">
                                        <div 
                                            className={`h-full transition-all duration-700 ${isAchieved ? 'bg-green-500' : 'bg-slate-900'}`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Input Tabungan */}
                                    {!isAchieved && (
                                        <div className="flex gap-2">
                                            <input 
                                                type="text"
                                                placeholder="Tambah nominal..."
                                                className="flex-1 border border-slate-200 rounded-md p-2 text-xs outline-none focus:border-slate-400 font-bold"
                                                value={formatDisplay(tempInputs[item.id] || "")}
                                                onChange={(e) => handleTempInputChange(item.id, e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && updateSaving(item.id)}
                                            />
                                            <button 
                                                onClick={() => updateSaving(item.id)}
                                                className="bg-slate-100 text-slate-700 px-3 py-1 text-xs font-bold rounded-md hover:bg-slate-200"
                                            >
                                                Simpan
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* Footer */}
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.createdAt}</p>
                                        <button 
                                            onClick={() => deleteWishlist(item.id)}
                                            className="text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
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