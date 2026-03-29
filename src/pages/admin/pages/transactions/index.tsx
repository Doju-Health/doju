import { TransactionsTable } from "../../components/transactions-table/transactions-table";

export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          Manage all transactions in the system.
        </p>
      </div>
      <TransactionsTable />
    </div>
  );
}
