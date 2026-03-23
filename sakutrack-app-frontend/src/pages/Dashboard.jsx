import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import BalanceCard from "../components/dashboard/BalanceCard";
import FinanceChart from "../components/dashboard/FinanceChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import TransactionList from "../components/dashboard/TransactionList";
import { Link } from "react-router-dom";
import { Plus, SearchX } from "lucide-react";
import connection from "../connection";

export default function Dashboard({ searchQuery, setSearchQuery }) {
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0, 
    totalExpense: 0, 
    balance: 0, 
    activeGoals: []
  });

  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], incomeTrend: [], expenseTrend: [] });
  const [showAll, setShowAll] = useState(false);

  // Ambil Data
  const fetchData = () => {
    connection.get('/dashboard')
      .then((res) => {
        if (res.data.success) {
          setDashboardData(res.data.data);
        }
      })
      .catch((err) => console.log("Failed to load dashboard:", err));

    connection.get('/transactions')
      .then((res) => {
        const result = res.data;
        if (result.success) {
          const originalData = result.data || [];
          setTransactions(originalData);
          
          // Grafik
          if (result.chartData) {
            setChartData({
              labels: result.chartData.labels ? result.chartData.labels.map(l => l.split('T')[0]) : [],
              incomeTrend: result.chartData.incomeTrend || [],
              expenseTrend: result.chartData.expenseTrend || []
            });
          }
        }
      })
      .catch((err) => console.log("Failed to load transactions:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hapus
  const deleteTransaction = async (id) => {
    if (window.confirm("Yakin ingin menghapus riwayat transaksi ini?")) {
      try {
        const res = await connection.delete(`/transactions/${id}`);
        if (res.data.success) {
          fetchData();
        }
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    } 
  };

  // Pencarian
  const query = searchQuery ? searchQuery.toLowerCase() : "";
  const filteredTransactions = transactions.filter((item) => {
    const desc = (item.description || "").toLowerCase();
    const cat = (item.category || "").toLowerCase();
    return desc.includes(query) || cat.includes(query);
  });

  const isSearching = searchQuery && searchQuery.trim() !== "";

  // UI
  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <motion.h1 
            key={isSearching ? "search" : "normal"}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
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
          <motion.div key="normal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Ringkasan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <BalanceCard title="Total Saldo" amount={dashboardData.balance} />
              <BalanceCard title="Pemasukan" amount={dashboardData.totalIncome} />
              <BalanceCard title="Pengeluaran" amount={dashboardData.totalExpense} />
              <BalanceCard title="Target Aktif" amount={dashboardData.activeGoals.length} />
            </div>

            {/* Grafik dan Tabel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <FinanceChart 
                  incomeTrend={chartData.incomeTrend} 
                  expenseTrend={chartData.expenseTrend} 
                  timeLabels={chartData.labels} 
                />
              </div>
              <div className="lg:col-span-4">
                <CategoryChart transactions={transactions} />
              </div>
              <div className="lg:col-span-12">
                <TransactionList 
                  data={showAll ? transactions : transactions.slice(0, 5)}
                  onDelete={deleteTransaction}
                />
                {transactions.length > 5 && (
                  <div className="text-center mt-4">
                    <button onClick={() => setShowAll(!showAll)} className="text-slate-900 font-bold text-sm hover:underline mt-2">
                      {showAll ? "Tampilkan Lebih Sedikit" : "Lihat Semua Transaksi"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <CategoryChart transactions={filteredTransactions} />
            </div>
            <div className="lg:col-span-8">
              <TransactionList data={filteredTransactions} onDelete={deleteTransaction} />
              {filteredTransactions.length === 0 && (
                <div className="flex flex-col items-center justify-center p-16 bg-white rounded border border-dashed mt-6">
                   <SearchX size={40} className="text-slate-300 mb-3" />
                   <p className="text-slate-400 text-sm">Data transaksi tidak ditemukan.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link to="/input-transaksi" className="md:hidden fixed bottom-8 right-8 bg-slate-900 text-white w-14 h-14 flex items-center justify-center rounded-full shadow z-50">
        <Plus size={28} />
      </Link>
    </div>
  );
}