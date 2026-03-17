import {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion'; 
import BalanceCard from "../components/dashboard/BalanceCard";
import FinanceChart from "../components/dashboard/FinanceChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import TransactionList from "../components/dashboard/TransactionList";
import {Link} from "react-router-dom";
import {Plus, SearchX} from "lucide-react";
import {BASE_URL} from "../connection";

export default function Dashboard({ searchQuery, setSearchQuery }) {
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0, 
    totalExpense: 0, 
    balance: 0, 
    activeGoals: []
  });

  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], incomeTrend: [], expenseTrend: [] });

  // tambahan state
  const [showAll, setShowAll] = useState(false);

  // Ambil Data
  const ambilData = () => {
    const kunci = localStorage.getItem("userId");

    // dashboard
    fetch(`${BASE_URL}/dashboard`, {
      headers: { "Authorization": kunci }
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          setDashboardData(result.data);
        }
      })
      .catch((err) => console.log("Gagal mengambil dashboard:", err));

    // transaksi
    fetch(`${BASE_URL}/transactions`, {
      headers: { "Authorization": kunci }
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          // data asli dari API
          const dataAsli = result.data || [];

          // urutan terbaru
          const dataTerurut = [...dataAsli].sort((a, b) => {
            const tglA = new Date(a.date).getTime();
            const tglB = new Date(b.date).getTime();

            if (isNaN(tglA)) return 1;
            if (isNaN(tglB)) return -1;


            return tglB - tglA;
          });

          setTransactions(dataTerurut);
          if (result.chartData) setChartData(result.chartData)
        }
      })
      .catch((err) => 
        console.log("Gagal mengambil transaksi:", err));
    };

    useEffect(() => {
      ambilData();
    }, []);

    // fungsi hapus transaksi
    const hapusTransaksi = async (id) => {
      if (window.confirm("Yakin ingin menghapus riwayat transaksi ini?")) {
        try {
          const kunci = localStorage.getItem("userId");
          const res = await fetch(`${BASE_URL}/transactions/${id}`, {
            method: 'DELETE',
            headers: {  "Authorization": kunci }
          });
          const result = await res.json();
          if (result.success)  {
            ambilData();
          }
         } catch (err) {
            console.error("Gagal hapus transaksi:", err);
         }
        } 
      };


  // Filter
  const query = searchQuery ? searchQuery.toLowerCase() : "";

  const filteredTransactions = transactions.filter((item) => {
    const desc = (item.description || "").toLowerCase();
    const cat = (item.category || "").toLowerCase();
    return desc.includes(query) || cat.includes(query);
  });

  const isSearching = searchQuery && searchQuery.trim() !== "";

  return (
    <>
      <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
        
        {/* Header Dashboard */}
        <div className="flex justify-between items-end">
          <div>
            <motion.h1 
              key={isSearching ? "search" : "normal"}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-3xl font-bold text-slate-800"
            >
              {isSearching ? `Hasil Pencarian: ${searchQuery}` : "Ringkasan Keuangan"}
            </motion.h1>

            <p className="text-slate-400 text-sm mt-1">
              {isSearching ? `Ditemukan ${filteredTransactions.length} transaksi` : "Pantau arus kas secara berkala."}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isSearching ? (
            <motion.div
              key="normal-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Ringkasan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <BalanceCard title="Total Saldo" amount={dashboardData.balance} />
                <BalanceCard title="Pemasukan" amount={dashboardData.totalIncome} />
                <BalanceCard title="Pengeluaran" amount={dashboardData.totalExpense} />
                <BalanceCard title="Target Aktif" amount={dashboardData.activeGoals.length} />
              </div>

              {/* Grafik & List */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8">
                  <FinanceChart 
                    pemasukan_tren={chartData.incomeTrend} 
                    pengeluaran_tren={chartData.expenseTrend} 
                    label_waktu={chartData.labels} 
                  />
                </div>

                <div className="lg:col-span-4">
                  <CategoryChart transactions={transactions} />
                </div>

                <div className="lg:col-span-12">
                  <TransactionList 
                    data={ showAll ? transactions : transactions.slice(0, 5)}
                  />

                  {/* tambahan tombol lihat semua */}
                  {transactions.length > 5&& (
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-indigo-600 font-medium text-sm hover:underline mt-2"
                      >
                        {showAll ? "Tampilkan Lebih Sedikit" : "Lihat Semua Transaksi"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="search-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              <div className="lg:col-span-4">
                <CategoryChart transactions={filteredTransactions} />
              </div>

              <div className="lg:col-span-8">
                <TransactionList data={filteredTransactions}/>
                
                {filteredTransactions.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center p-16 bg-white rounded-xl border border-dashed border-slate-200 mt-6"
                  >
                     <SearchX size={40} className="text-slate-300 mb-3" />
                     <p className="text-slate-400 text-sm">Data transaksi tidak ditemukan.</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Link to="/input-transaksi" className="md:hidden fixed bottom-8 right-8 bg-indigo-600 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg active:scale-90 z-50">
          <Plus size={28} />
        </Link>
      </div>
    </>
  );
}