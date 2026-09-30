import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterProps } from "@/types";
import { SellersTable } from "../../components/sellers-table/sellers-table";
import { TableSearchInput } from "../../components/table-search/table-search-input";
import { useUrlSearch } from "../../components/table-search/use-url-search";

const TABS: { value: string; label: string; isVerified?: FilterProps["isVerified"] }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending", isVerified: "pending" },
  { value: "verified", label: "Verified", isVerified: "verified" },
  { value: "unverified", label: "Unverified", isVerified: "unverified" },
];

export default function AdminSellersPage() {
  // The tab lives in the URL (?status=pending) so it survives refreshes and
  // other pages, like the dashboard, can link straight to it.
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab =
    TABS.find((tab) => tab.value === searchParams.get("status")) ?? TABS[0];

  const { input: searchInput, setInput: setSearchInput, search } =
    useUrlSearch();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") params.delete("status");
    else params.set("status", value);
    // Each tab has its own result set, so start again from the first page.
    params.delete("page");
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sellers</h1>
        <p className="text-muted-foreground">
          Manage all sellers in the system.
        </p>
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab.value} onValueChange={handleTabChange}>
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <TableSearchInput
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Search sellers..."
        />
      </div>
      <SellersTable isVerified={activeTab.isVerified} search={search} />
    </div>
  );
}
