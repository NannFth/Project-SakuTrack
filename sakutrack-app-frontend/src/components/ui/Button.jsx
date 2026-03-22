export default function Button({ type = "button", onClick, children }) {
    return (
    <button
      type={type} 
      onClick={onClick}
      className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800"
    >
      {children}
    </button>
  );
}