export default function Input({ value, onChange, placeholder, type="text"}) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3 border rounded-xl"
        />
    );
}