import { BuyersTable } from "../../components/buyers-table/buyers-table";

export default function AdminBuyersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Buyers</h1>
        <p className="text-muted-foreground">
          Manage all buyers in the system.
        </p>
      </div>
      <BuyersTable />
    </div>
  );
}
