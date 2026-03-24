import { UsersTable } from "../../components/users-table/users-table";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage all users in the system.</p>
      </div>
      <UsersTable />
    </div>
  );
}
