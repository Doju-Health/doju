import { BuyersTable } from "../../components/buyers-table/buyers-table";
import { TableSearchInput } from "../../components/table-search/table-search-input";
import { useUrlSearch } from "../../components/table-search/use-url-search";

export default function AdminBuyersPage() {
  const { input, setInput, search } = useUrlSearch();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Buyers</h1>
        <p className="text-muted-foreground">
          Manage all buyers in the system.
        </p>
      </div>
      <div className="flex justify-end">
        <TableSearchInput
          value={input}
          onChange={setInput}
          placeholder="Search buyers..."
        />
      </div>
      <BuyersTable search={search} />
    </div>
  );
}
