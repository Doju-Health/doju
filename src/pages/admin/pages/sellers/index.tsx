import { SellersTable } from "../../components/sellers-table/sellers-table";

export default function AdminSellersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sellers</h1>
        <p className="text-muted-foreground">
          Manage all sellers in the system.
        </p>
      </div>
      <SellersTable />
    </div>
  );
}
