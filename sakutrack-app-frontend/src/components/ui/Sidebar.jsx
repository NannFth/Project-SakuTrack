import { LayoutDashboard, Wallet, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="w-64 bg-white border-r p-6">
            <h1 className="text-xl font-bold text-blue-600 mb-8">
                SakuTrack
            </h1>

            <nav className="flex flex-col gap-4">

                <Link to="/dashboard" className="flex gap-2 text-slate-600">
                    <LayoutDashboard size={18}/>
                    Dashboard
                </Link>

                <Link to="/transaksi" className="flex gap-2 text-slate-600">
                    <Wallet size={18}/>
                    Transaksi
                </Link>

                <Link to="/tabungan" className="flex gap-2 text-slate-600">
                    <Target size={18}/>
                    Target Tabungan
                </Link>

            </nav>
        </div>
    );
}