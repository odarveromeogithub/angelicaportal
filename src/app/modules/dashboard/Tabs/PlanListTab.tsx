import { motion } from 'motion/react';
import { Loader, Plus, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../core/components/ui/button';
import { PlanCard } from '../../../core/components/dashboard/PlanCard';
import { plansActions } from '../../../core/state/reducer/dashboard/plansSlice';
import { type AppDispatch } from '../../../core/state/store';
import { selectFilteredPlans, selectPlansLoading, selectPlansSearchQuery, selectPlansStatusFilter } from '../../../core/state/selector/dashboard.selector';
import { DashboardHeader } from '../../../core/components/dashboard/DashboardHeader';
import { FilterBar } from '../../../core/components/dashboard/FilterBar';
import { EmptyState } from '../../../core/components/dashboard/EmptyState';

export function PlanListTab() {
  const dispatch = useDispatch<AppDispatch>();
  const filteredPlans = useSelector(selectFilteredPlans);
  const loading = useSelector(selectPlansLoading);
  const searchQuery = useSelector(selectPlansSearchQuery);
  const statusFilter = useSelector(selectPlansStatusFilter);

  const handleStatusFilterChange = (value: string) => {
    dispatch(plansActions.setStatusFilter(value));
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 space-y-6 sm:space-y-7">
      <DashboardHeader
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
        onSearchChange={(value) => dispatch(plansActions.setSearchQuery(value))}
        searchPlaceholder="Search by name or LPAF number..."
        filterValue={statusFilter}
        onFilterChange={handleStatusFilterChange}
        filterPlaceholder="Filter by status"
        filterOptions={[
          { value: 'all', label: 'All Plans' },
          { value: 'Active', label: 'Active Plan' },
          { value: 'Lapsed', label: 'Lapsed Plan' },
          { value: 'Pending', label: 'Pending Plan' },
        ]}
      />

      {/* Plans List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-6 h-6 md:w-8 md:h-8 animate-spin text-blue-600" />
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
            <div className="bg-white rounded-2xl border border-gray-100">
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
