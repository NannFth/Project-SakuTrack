export default function Button({ type = "button", onClick, children }) {
    return (
    <button
      type={type} 
      onClick={onClick}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition shadow-sm"
    >
      {children}
    </button>
  );
}