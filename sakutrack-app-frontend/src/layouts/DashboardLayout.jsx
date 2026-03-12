import Sidebar from "../components/ui/Sidebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-100 p-6">
            {children}
        </div>
    );
}