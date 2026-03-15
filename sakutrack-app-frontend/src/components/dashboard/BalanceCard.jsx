import Card from "../ui/Card";

export default function BalanceCard({ title, amount }) {
  let displayValue;
  const saldo = amount || 0;

  if (title === "Pengeluaran") {
    displayValue = (
      <span className="text-rose-500">
        Rp {saldo.toLocaleString()}
      </span>
    );
  } else if (title === "Pemasukan") {
    displayValue = (
      <span className="text-emerald-500">
        Rp {saldo.toLocaleString()}
      </span>
    );
  } else if (title === "Total Saldo") {
    const colorClass = saldo < 0 ? "text-rose-500" : "text-slate-900";
    displayValue = (
      <span className={`font-bold ${colorClass}`}>
        Rp {saldo.toLocaleString()}
      </span>
    );
  } else {
    displayValue = (
      <span className="text-slate-800">
        {amount}
      </span>
    );
  }

  return (
    <Card 
      title={title} 
      value={displayValue} 
    />
  );
}