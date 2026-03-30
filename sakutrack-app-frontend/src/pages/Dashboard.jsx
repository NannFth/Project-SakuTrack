import BudgetWallets from "../components/dashboard/BudgetWallets";
import DailyGreeting from "../components/dashboard/DailyGreeting";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BalanceCard from "../components/dashboard/BalanceCard";
import FinanceChart from "../components/dashboard/FinanceChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import TransactionList from "../components/dashboard/TransactionList";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import connection from "../connection";
import { checkDashboardAlerts } from "../components/dashboard/dashboardAlerts";

export default function Dashboard({ searchQuery, setSearchQuery }) {
  const [searchParams] = useSearchParams();

  const month = parseInt(
    searchParams.get("month") || new Date().getMonth() + 1,
  );

  const year = parseInt(searchParams.get("year") || new Date().getFullYear());

  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    activeGoals: [],
  });

  const [transactions, setTransactions] = useState([]);

  const [chartData, setChartData] = useState({
    labels: [],
    incomeTrend: [],
    expenseTrend: [],
  });

  const [showAll, setShowAll] = useState(false);

  const [userSettings, setUserSettings] = useState({
    needsRatio: 50,
    wantsRatio: 30,
    savingsRatio: 20,
    dailyLimit: 80,
  });

  // Ambil data

  const fetchData = async () => {
    let currentWantsRatio = 30;

    try {
      const resSet = await connection.get("/settings");

      if (resSet.data.success && resSet.data.data) {
        setUserSettings({
          needsRatio: resSet.data.data.needs_ratio,
          wantsRatio: resSet.data.data.wants_ratio,
          savingsRatio: resSet.data.data.savings_ratio,
          dailyLimit: resSet.data.data.daily_limit_percentage || 80,
        });
        currentWantsRatio = resSet.data.data.wants_ratio;
      }
    } catch (err) {
      console.log(err);
    }

    connection
      .get(`/dashboard?month=${month}&year=${year}`)

      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;

          setDashboardData(data);

          checkDashboardAlerts(data, currentWantsRatio);
        }
      })

      .catch((err) => console.log("Dashboard error:", err));

    connection
      .get("/transactions")
      .then((res) => {
        const result = res.data;
        if (result.success) {
          setTransactions(result.data || []);
          if (result.chartData) {
            setChartData({
              labels: result.chartData.labels
                ? result.chartData.labels.map((l) => l.split("T")[0])
                : [],
              incomeTrend: result.chartData.incomeTrend || [],
              expenseTrend: result.chartData.expenseTrend || [],
            });
          }
        }
      })
      .catch((err) => console.log("Transaksi error:", err));
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  // Filter data
  const transactionsBulanIni = transactions.filter((t) => {
    const d = new Date(t.date);

    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  const filteredChart = { labels: [], incomeTrend: [], expenseTrend: [] };
  chartData.labels.forEach((label, i) => {
    const [y, m] = label.split("-").map(Number);

    if (y === year && m === month) {
      filteredChart.labels.push(label);
      filteredChart.incomeTrend.push(chartData.incomeTrend[i]);
      filteredChart.expenseTrend.push(chartData.expenseTrend[i]);
    }
  });

  // Hapus transaksi
  const deleteTransaction = async (id) => {
    if (window.confirm("Yakin hapus?")) {
      try {
        const res = await connection.delete(`/transactions/${id}`);

        if (res.data.success) fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const query = searchQuery ? searchQuery.toLowerCase() : "";
  const filteredTransactions = transactions.filter((item) => {
    const desc = (item.description || "").toLowerCase();
    const cat = (item.category || "").toLowerCase();
    return desc.includes(query) || cat.includes(query);
  });

  const isSearching = searchQuery && searchQuery.trim() !== "";
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const expenseToday = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(todayStr))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpMonth = transactionsBulanIni
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expBeforeToday = totalExpMonth - expenseToday;

  const daysTotal = new Date(year, month, 0).getDate();

  const remainDays =
    month === now.getMonth() + 1 && year === now.getFullYear()
      ? daysTotal - now.getDate() + 1
      : daysTotal;

  const budgetTotal =
    dashboardData.totalIncome * (userSettings.dailyLimit / 100);

  const budgetSisa = budgetTotal - expBeforeToday;

  const dynamicDailyLimit =
    dashboardData.totalIncome > 0
      ? budgetSisa > 0
        ? Math.floor(budgetSisa / remainDays)
        : 0
      : 100000;

  // Tampilan utama

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {isSearching
              ? `Hasil Pencarian: ${searchQuery}`
              : "Ringkasan Keuangan"}
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            {isSearching
              ? `Ditemukan ${filteredTransactions.length} transaksi`
              : "Pantau arus kas secara berkala."}
          </p>
        </div>
      </div>

      <div>
        {!isSearching ? (
          <div className="space-y-8">
            <DailyGreeting
              totalExpense={expenseToday}
              dailyLimit={dynamicDailyLimit}
            />

            <BudgetWallets
              totalBalance={dashboardData.balance}
              needsRatio={userSettings.needsRatio}
              wantsRatio={userSettings.wantsRatio}
              savingsRatio={userSettings.savingsRatio}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <BalanceCard title="Total Saldo" amount={dashboardData.balance} />

              <BalanceCard
                title="Pemasukan"
                amount={dashboardData.totalIncome}
              />

              <BalanceCard
                title="Pengeluaran"
                amount={dashboardData.totalExpense}
              />

              <BalanceCard
                title="Target Aktif"
                amount={dashboardData.activeGoals.length}
              />
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
                  data={
                    showAll
                      ? transactionsBulanIni
                      : transactionsBulanIni.slice(0, 5)
                  }
                  onDelete={deleteTransaction}
                  currentMonth={month}
                />

                {transactionsBulanIni.length > 5 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="text-slate-900 font-bold text-sm hover:underline mt-2"
                    >
                      {showAll
                        ? "Tampilkan Lebih Sedikit"
                        : "Lihat Semua Transaksi"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <CategoryChart transactions={filteredTransactions} />
            </div>

            <div className="lg:col-span-8">
              <TransactionList
                data={filteredTransactions}
                onDelete={deleteTransaction}
              />
            </div>
          </div>
        )}
      </div>

      <Link
        to="/input-transaksi"
        className="md:hidden fixed bottom-8 right-8 bg-slate-900 text-white w-14 h-14 flex items-center justify-center rounded-full shadow z-50"
      >
        <Plus size={28} />
      </Link>
    </div>
  );
}
