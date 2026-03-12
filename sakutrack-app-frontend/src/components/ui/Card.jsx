export default function Card({ title, value }) {
    return (
        <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-sm text-slate-500">{title}</p>
            <h2 className="text-xl font bold mt-2">{value}</h2>
        </div>
    );
}