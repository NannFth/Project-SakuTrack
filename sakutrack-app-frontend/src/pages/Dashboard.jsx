import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import BalanceCard from "../components/dashboard/BalanceCard";
import FinanceChart from "../components/dashboard/FinanceChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import TransactionList from "../components/dashboard/TransactionList";
import { Link } from "react-router-dom";
import { Plus, SearchX } from "lucide-react";
import connection from "../connection";

export default function Dashboard({ searchQuery, setSearchQuery }) {
  const [searchParams] = useSearchParams();
  
  // Parameter Waktu
  const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") || new Date().getFullYear());

  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0, 
    totalExpense: 0, 
    balance: 0, 
    activeGoals: []
  });

  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], incomeTrend: [], expenseTrend: [] });
  const [showAll, setShowAll] = useState(false);

  // Fetch Data
  const fetchData = () => {
    // Data Dashboard
    connection.get(`/dashboard?month=${month}&year=${year}`)
      .then((res) => {
        if (res.data.success) setDashboardData(res.data.data);
      })
      .catch((err) => console.log("Dashboard error:", err));

    // Data Transaksi
    connection.get('/transactions')
      .then((res) => {
        const result = res.data;
        if (result.success) {
          setTransactions(result.data || []);
          if (result.chartData) {
            setChartData({
              labels: result.chartData.labels ? result.chartData.labels.map(l => l.split('T')[0]) : [],
              incomeTrend: result.chartData.incomeTrend || [],
              expenseTrend: result.chartData.expenseTrend || []
            });
          }
        }
      })
      .catch((err) => console.log("Transaksi error:", err));
  };

  useEffect(() => {
    fetchData();
  }, [month, year]); 

  // Filter Bulan
  const transactionsBulanIni = transactions.filter(t => {
    const d = new Date(t.date);
    return (d.getMonth() + 1) === month && d.getFullYear() === year;
  });

  // Filter Grafik
  const filteredChart = {
    labels: [],
    incomeTrend: [],
    expenseTrend: []
  };

  chartData.labels.forEach((label, i) => {
    const [y, m] = label.split('-').map(Number);
    if (y === year && m === month) {
      filteredChart.labels.push(label);
      filteredChart.incomeTrend.push(chartData.incomeTrend[i]);
      filteredChart.expenseTrend.push(chartData.expenseTrend[i]);
    }
  });

  // Hapus
  const deleteTransaction = async (id) => {
    if (window.confirm("Yakin hapus?")) {
      try {
        const res = await connection.delete(`/transactions/${id}`);
        if (res.data.success) fetchData();
      } catch (err) { console.error(err); }
    } 
  };

  const query = searchQuery ? searchQuery.toLowerCase() : "";
  const filteredTransactions = transactions.filter((item) => {
    const desc = (item.description || "").toLowerCase();
    const cat = (item.category || "").toLowerCase();
    return desc.includes(query) || cat.includes(query);
  });

  const isSearching = searchQuery && searchQuery.trim() !== "";

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
      {/* Header Info */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <BalanceCard title="Total Saldo" amount={dashboardData.balance} />
              <BalanceCard title="Pemasukan" amount={dashboardData.totalIncome} />
              <BalanceCard title="Pengeluaran" amount={dashboardData.totalExpense} />
              <BalanceCard title="Target Aktif" amount={dashboardData.activeGoals.length} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <FinanceChart 
                  incomeTrend={filteredChart.incomeTrend} 
                  expenseTrend={filteredChart.expenseTrend} 
                  timeLabels={filteredChart.labels} 
                />
              </div>
              <div className="lg:col-span-4">
                <CategoryChart transactions={transactionsBulanIni} />
              </div>
              <div className="lg:col-span-12">
                <TransactionList 
                  data={showAll ? transactionsBulanIni : transactionsBulanIni.slice(0, 5)}
                  onDelete={deleteTransaction}
                  currentMonth={month}
                />
                {transactionsBulanIni.length > 5 && (
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