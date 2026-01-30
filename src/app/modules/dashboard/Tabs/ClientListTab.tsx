import { motion } from "motion/react";
import {
  Search,
  Edit,
  Eye,
  Download,
  ChevronDown,
  ChevronUp,
  MoreVertical,
} from "lucide-react";
import { useState, useCallback } from "react";
import { dashboardApi } from "../../../core/state/api";
import {
  TabsHeader,
  FilterBar,
  EmptyState,
} from "../../../core/components/dashboard";
import { Badge } from "../../../core/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../core/components/ui/dropdown-menu";
import { Button } from "../../../core/components/ui/button";
import { useTableData } from "../../../core/hooks/useTableData";
import { ListItemSkeleton } from "../../../core/components/ui/skeleton";
import {
  PLAN_STATUS_FILTER_OPTIONS,
  PLAN_STATUS,
} from "../../../core/constants/dashboardStats";

export function ClientListTab() {
  const { data: clients = [], isLoading } = dashboardApi.useGetClientsQuery();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    data: filteredItems,
    filteredCount,
    searchQuery,
    handleSearch,
    filters,
    setFilter,
  } = useTableData(clients, {
    searchFields: ["name"],
    customFilter: (client, filters) => {
      const statusFilter = filters.status || "all";
      return statusFilter === "all" || client.accountStatus === statusFilter;
    },
  });

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setFilter("status", value);
    },
    [setFilter],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      handleSearch(value);
    },
    [handleSearch],
  );

  const handleToggleExpand = useCallback(
    (id: string) => {
      setExpandedId(expandedId === id ? null : id);
    },
    [expandedId],
  );

  return (
    <div className="py-3 sm:py-3 md:py-6 lg:py-10 xl:py-5 space-y-3 sm:space-y-3">
      <TabsHeader
        title="List of Client Plans"
        description="View and manage all client plans"
        count={filteredCount}
        countLabel="Clients"
      />

      <FilterBar
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by name or LPAF number..."
        filterValue={(filters.status as string) || "all"}
        onFilterChange={handleStatusFilterChange}
        filterPlaceholder="Filter by status"
        filterOptions={PLAN_STATUS_FILTER_OPTIONS}
      />

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <ListItemSkeleton key={index} />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <EmptyState
            icon={Search}
            title="No clients found"
            description="Try adjusting your search or filter"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((client: any, index: number) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5 md:p-6 flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-auto">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold uppercase tracking-wide">
                      LPAF
                    </p>
                    <p className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {client.policyNo} | {client.lpafNo}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold uppercase tracking-wide">
                      Full Name
                    </p>
                    <p className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {client.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold uppercase tracking-wide">
                      Status
                    </p>
                    <Badge
                      variant={
                        client.status === PLAN_STATUS.ACTIVE
                          ? "default"
                          : client.status === PLAN_STATUS.LAPSED
                            ? "destructive"
                            : "secondary"
                      }
                      className="font-semibold"
                    >
                      {client.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 lg:border-l lg:border-slate-200 dark:lg:border-slate-800 lg:pl-4 w-full lg:w-auto justify-end">
                  <div className="hidden sm:flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleExpand(client.id)}
                      className="h-9 w-9 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {expandedId === client.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div className="sm:hidden flex items-center gap-1.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Client
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleExpand(client.id)}
                      className="h-9 w-9"
                    >
                      {expandedId === client.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {expandedId === client.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800"
                >
                  <div className="p-4 md:p-5 lg:p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold uppercase tracking-wide">
                          Plan Type
                        </p>
                        <p className="text-base font-bold text-slate-900 dark:text-white">
                          {client.planType}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold uppercase tracking-wide">
                          Contract Price
                        </p>
                        <p className="text-base font-bold text-slate-900 dark:text-white">
                          {client.contractPrice}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold uppercase tracking-wide">
                          Email
                        </p>
                        <p className="text-base font-bold text-slate-900 dark:text-white break-all">
                          {client.email}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold uppercase tracking-wide">
                          Contact
                        </p>
                        <p className="text-base font-bold text-slate-900 dark:text-white">
                          {client.contactNumber}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold uppercase tracking-wide">
                        Address
                      </p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">
                        {client.address}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
