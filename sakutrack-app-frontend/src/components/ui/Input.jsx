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
      className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-900"
    />
  );
}