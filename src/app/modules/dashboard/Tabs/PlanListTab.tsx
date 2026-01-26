import { motion } from "motion/react";
import { useCallback, useMemo, useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "../../../core/components/ui/button";
import {
  PlanCard,
  TabsHeader,
  FilterBar,
  EmptyState,
} from "../../../core/components/dashboard";
import { dashboardApi } from "../../../core/state/api";
import { useToast } from "../../../core/hooks/useToast";
import { Skeleton } from "../../../core/components/ui/skeleton";

export function PlanListTab() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const {
    data: plans = [],
    isLoading: loading,
    isError,
  } = dashboardApi.useGetPlansQuery();

  // Show error toast when data fetch fails
  useEffect(() => {
    if (isError) {
      toast.error(
        "Failed to load plans",
        "Unable to fetch your plans. Please try again later.",
      );
    }
  }, [isError, toast]);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan: any) => {
      const matchesSearch =
        plan.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.lpafNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || plan.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [plans, searchQuery, statusFilter]);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <div className="py-3 sm:py-3 md:py-6 lg:py-10 xl:py-5 space-y-3 sm:space-y-3">
      <TabsHeader
        title="List of Plans"
        description="Manage and view all your plans"
        count={filteredPlans.length}
        countLabel="Plans"
        actions={
          <Button className="w-full sm:w-auto shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add New Plan
          </Button>
        }
      />

      <FilterBar
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by name or LPAF number..."
        filterValue={statusFilter}
        onFilterChange={handleStatusFilterChange}
        filterPlaceholder="Filter by status"
        filterOptions={[
          { value: "all", label: "All Plans" },
          { value: "Active", label: "Active Plan" },
          { value: "Lapsed", label: "Lapsed Plan" },
          { value: "Pending", label: "Pending Plan" },
        ]}
      />

      {/* Plans List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6"
            >
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPlans.map((plan: any, index: number) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PlanCard plan={plan} />
            </motion.div>
          ))}
          {filteredPlans.length === 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <EmptyState
                icon={Search}
                title="No plans found"
                description="Try adjusting your search or filter"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
