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
import { ListItemSkeleton } from "../../../core/components/ui/skeleton";
import { selectIsFullyVerified } from "../../../core/state/selector/auth.selector";
import { Alert } from "../../../core/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../core/components/ui/tooltip";
import { PLAN_STATUS_FILTER_OPTIONS } from "../../../core/constants/dashboardStats";
import { AddPlanDialog } from "../Dialog/AddPlanDialog";

export function PlanListTab() {
  const toast = useToast();
  const isVerified = selectIsFullyVerified();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
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

  const handleAddPlan = useCallback(() => {
    setShowAddDialog(true);
  }, []);

  return (
    <div className="py-3 sm:py-3 md:py-6 lg:py-10 xl:py-5 space-y-3 sm:space-y-3">
      <TabsHeader
        title="List of Plans"
        description="Manage and view all your plans"
        count={filteredPlans.length}
        countLabel="Plans"
        actions={
          <div>
            {isVerified ? (
              <Button
                className="w-full sm:w-auto shadow-sm"
                onClick={handleAddPlan}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Plan
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* Wrap disabled button to allow tooltip and click */}
                  <span
                    className="inline-block"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("open-verification-prompt"),
                      )
                    }
                  >
                    <Button className="w-full sm:w-auto shadow-sm" disabled>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Plan
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent sideOffset={8}>
                  <div className="space-y-1">
                    <p className="text-xs">
                      Verification required to add plans.
                    </p>
                    <button
                      type="button"
                      className="text-xs underline"
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent("open-verification-prompt"),
                        )
                      }
                    >
                      Verify now
                    </button>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        }
      />

      {!isVerified && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <Alert>
            <div className="text-sm">
              Your account is not fully verified. Complete facial verification,
              ID upload, and three signature specimens to enable adding new
              plans.
            </div>
          </Alert>
        </div>
      )}

      <FilterBar
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by name or LPAF number..."
        filterValue={statusFilter}
        onFilterChange={handleStatusFilterChange}
        filterPlaceholder="Filter by status"
        filterOptions={PLAN_STATUS_FILTER_OPTIONS}
      />

      {/* Plans List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <ListItemSkeleton key={index} />
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

      <AddPlanDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
}
