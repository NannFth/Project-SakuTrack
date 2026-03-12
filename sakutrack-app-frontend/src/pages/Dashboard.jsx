import DashboardLayout from "../layouts/DashboardLayout";
import BalanceCard from "../components/dashboard/BalanceCard";
import FinanceChart from "../components/dashboard/FinanceChart";
import TransactionList from "../components/dashboard/TransactionList";
import { getUser, getTransactions } from "../services/storage";
import { Link } from "lucide-react";

export default function Dashboard() {

  const user = getUser() || {nama: "user" };
  const data = getTransactions(user.nama) || [];

    const pemasukan = data 
      .filter((t) => t.jenis === "Pemasukan")
      .reduce((a,b) => a + b.nominal, 0)
    
    const pengeluaran = data 
      .filter((t) => t.jenis === "Pengeluaran")
      .reduce((a,b) => a + b.nominal, 0)

      const saldo = pemasukan - pengeluaran;

  return (
    <DashboardLayout>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <BalanceCard title="Saldo" amount={saldo} />
        <BalanceCard title="Pemasukan" amount={pemasukan} />
        <BalanceCard title="Pengeluaran" amount={pengeluaran} />
        <BalanceCard title="Target Tabungan" amount={0} />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        <FinanceChart 
          pemasukan={pemasukan}
          pengeluaran={pengeluaran}
        />

        <TransactionList data={data}/>

      </div>

      <Link
        to="/InputTransaksi"
        className="fixed bottom-6 roght-6 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 flex items-center justify-center rounded-full text-3xl shadow-lg"
      >
        +
      </Link>
    </DashboardLayout>

  );
}


