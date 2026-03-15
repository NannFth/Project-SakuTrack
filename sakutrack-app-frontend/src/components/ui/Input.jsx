export default function Input({ type, value, onChange, placeholder }) {
  let inputType = "text";

  if (type !== undefined && type !== null) {
    inputType = type;
  }

  return (
    <input
      type={inputType}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
    />
  );
}