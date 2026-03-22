export default function Card({ title, value }) {
  let displayValue = value;

  if (displayValue === null || displayValue === "") {
    displayValue = "Rp 0";
  }

  return (
    <div className="bg-white p-6 rounded border shadow">
      {/* Header */}
      <p className="text-sm text-slate-500 mb-1">
        {title}
      </p>
      
      {/* Konten */}
      <h2 className="text-2xl font-bold text-slate-800">
        {displayValue}
      </h2>

      {/* Dekorasi */}
      <div className="mt-3 flex items-center gap-2">
        <span className="w-6 h-1 bg-slate-200 rounded"></span>
        <span className="w-3 h-1 bg-slate-100 rounded"></span>
      </div>
    </div>
  );
}