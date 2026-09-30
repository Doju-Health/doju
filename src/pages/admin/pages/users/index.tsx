import { UsersTable } from "../../components/users-table/users-table";
import { TableSearchInput } from "../../components/table-search/table-search-input";
import { useUrlSearch } from "../../components/table-search/use-url-search";

export default function AdminUsersPage() {
  const { input, setInput, search } = useUrlSearch();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage all users in the system.</p>
      </div>
      <div className="flex justify-end">
        <TableSearchInput
          value={input}
          onChange={setInput}
          placeholder="Search users..."
        />
      </div>
      <UsersTable search={search} />
    </div>
  );
}
