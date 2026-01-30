import { motion } from "motion/react";
import { useCallback, useState, useEffect } from "react";
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
import { useTableData } from "../../../core/hooks/useTableData";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../core/components/ui/pagination";

export function PlanListTab() {
  const toast = useToast();
  const isVerified = selectIsFullyVerified();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const {
    data: plans = [],
    isLoading: loading,
    isError,
  } = dashboardApi.useGetPlansQuery();

  const {
    data: paginatedPlans,
    filteredCount,
    searchQuery,
    handleSearch,
    filters,
    setFilter,
    currentPage,
    totalPages,
    setPage,
    hasNextPage,
    hasPreviousPage,
  } = useTableData(plans, {
    searchFields: ["fullName", "lpafNumber"],
    pageSize: 4, // 4 plans per page as requested
    customFilter: (plan, filters) => {
      const statusFilter = filters.status || "all";
      return statusFilter === "all" || plan.status === statusFilter;
    },
  });

  // Show error toast when data fetch fails
  useEffect(() => {
    if (isError) {
      toast.error(
        "Failed to load plans",
        "Unable to fetch your plans. Please try again later.",
      );
    }
  }, [isError, toast]);

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

  const handleAddPlan = useCallback(() => {
    setShowAddDialog(true);
  }, []);

  return (
    <div className="py-3 sm:py-3 md:py-6 lg:py-10 xl:py-5 space-y-3 sm:space-y-3">
      <TabsHeader
        title="List of Plans"
        description="Manage and view all your plans"
        count={filteredCount}
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
        filterValue={String(filters.status || "all")}
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
          {paginatedPlans.map((plan: any, index: number) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PlanCard plan={plan} />
            </motion.div>
          ))}
          {paginatedPlans.length === 0 && (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(currentPage - 1)}
                  className={
                    !hasPreviousPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  if (!showPage && page === currentPage - 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  if (!showPage && page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setPage(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                },
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(currentPage + 1)}
                  className={
                    !hasNextPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <AddPlanDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
}
