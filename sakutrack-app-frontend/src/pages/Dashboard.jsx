import Swal from 'sweetalert2';
import BudgetWallets from '../components/dashboard/BudgetWallets';
import DailyGreeting from '../components/dashboard/DailyGreeting';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import BalanceCard from "../components/dashboard/BalanceCard";
import FinanceChart from "../components/dashboard/FinanceChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import TransactionList from "../components/dashboard/TransactionList";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import connection from "../connection";

export default function Dashboard({ searchQuery, setSearchQuery }) {
  const [searchParams] = useSearchParams();
  
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

const fetchData = () => {
    // Ambil Data
    connection.get(`/dashboard?month=${month}&year=${year}`)
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          setDashboardData(data);

          const jatahKeinginan = data.balance * 0.3;
          
          // Peringtan Boros
          if (data.totalExpense > jatahKeinginan && data.totalExpense > 0) {
            Swal.fire({
              title: 'Waduh, Pengeluaranmu Boros! 💸',
              html: `Pengeluaranmu (<b>Rp ${data.totalExpense.toLocaleString('id-ID')}</b>) sudah melewati jatah keinginanmu (<b>Rp ${Math.floor(jatahKeinginan).toLocaleString('id-ID')}</b>). <br><br> Yuk, rem dulu Pengeluarannya biar tabungan aman!`,
              icon: 'warning',
              background: '#ffffff',
              borderRadius: '20px',
              confirmButtonText: '<span style="color: black !important; font-weight: bold;">Siap, Saya Tobat!</span>',
              confirmButtonColor: '#ffffff',
              buttonsStyling: true,
              customClass: { confirmButton: 'force-show-text border border-slate-300 px-6 py-2' }
            });
          } 
          
          // Saldo Kritis
          else if (data.balance < 50000 && data.balance > 0) {
            Swal.fire({
              title: 'Saldo Kritis! ⚠️',
              html: `Waduh, saldo kamu tinggal <b>Rp ${data.balance.toLocaleString('id-ID')}</b> nih. <br> Hati-hati ya, jangan sampai minus!`,
              icon: 'error',
              background: '#ffffff',
              borderRadius: '20px',
              confirmButtonText: '<span style="color: black !important; font-weight: bold;">Oke, Saya Irit!</span>',
              confirmButtonColor: '#ffffff',
              buttonsStyling: true,
              customClass: { confirmButton: 'force-show-text border border-slate-300 px-6 py-2' }
            });
          }

          // Apareisiasi Hemat
          else if (data.totalExpense > 0 && data.totalExpense < (jatahKeinginan * 0.1)) {
            Swal.fire({
              title: 'Wah, Kamu Hebat! 🌟',
              html: `Pengeluaranmu bulan ini masih terkendali banget. <br> Pertahankan gaya hidup hematmu ya!`,
              icon: 'success',
              background: '#ffffff',
              borderRadius: '20px',
              confirmButtonText: '<span style="color: black !important; font-weight: bold;">Mantap!</span>',
              confirmButtonColor: '#ffffff',
              buttonsStyling: true,
              customClass: { confirmButton: 'force-show-text border border-slate-300 px-6 py-2' }
            });
          }
        }
      })
      .catch((err) => console.log("Dashboard error:", err));

    
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

  const transactionsBulanIni = transactions.filter(t => {
    const d = new Date(t.date);
    return (d.getMonth() + 1) === month && d.getFullYear() === year;
  });

  const filteredChart = { labels: [], incomeTrend: [], expenseTrend: [] };
  chartData.labels.forEach((label, i) => {
    const [y, m] = label.split('-').map(Number);
    if (y === year && m === month) {
      filteredChart.labels.push(label);
      filteredChart.incomeTrend.push(chartData.incomeTrend[i]);
      filteredChart.expenseTrend.push(chartData.expenseTrend[i]);
    }
  });

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
            <DailyGreeting 
              totalExpense={dashboardData.totalExpense} 
              dailyLimit={100000} 
            />
            <BudgetWallets totalBalance={dashboardData.balance} />
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