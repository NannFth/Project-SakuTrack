import Card from "../ui/Card";

export default function BalanceCard({ title, amount }) {
    return (
        <Card
            title={title}
            value={`Rp ${amount.toLocaleString()}`}
        />
    );
}