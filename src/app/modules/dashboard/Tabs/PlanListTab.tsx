import { motion } from 'motion/react';
import { useCallback, useMemo, useState } from 'react';
import { Loader, Plus, Search } from 'lucide-react';
import { Button } from '../../../core/components/ui/button';
import { PlanCard, DashboardHeader, FilterBar, EmptyState } from '../../../core/components/dashboard';
import { dashboardApi } from '../../../core/state/api';

export function PlanListTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: plans = [], isLoading: loading } = dashboardApi.useGetPlansQuery();

  const filteredPlans = useMemo(() => {
    return plans.filter((plan: any) => {
      const matchesSearch = plan.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           plan.lpafNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
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
        onSearchChange={handleSearchChange}
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
