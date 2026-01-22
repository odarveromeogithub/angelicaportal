import { motion } from 'motion/react';
import { Search, Loader, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { PlanCard } from './PlanCard';
import { plansActions } from '../../state/reducer/dashboard/plansSlice';
import { type RootState, type AppDispatch } from '../../state/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';

export function PlanListTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredPlans, loading, searchQuery, statusFilter } = useSelector((state: RootState) => state.dashboard_plans);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(plansActions.setSearchQuery(e.target.value));
  };

  const handleStatusFilterChange = (value: string) => {
    dispatch(plansActions.setStatusFilter(value));
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 space-y-6 sm:space-y-7">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">List of Plans</h2>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-gray-500">Manage and view all your plans</p>
            <Badge variant="secondary" className="font-normal">
              {filteredPlans.length} {filteredPlans.length === 1 ? 'Plan' : 'Plans'}
            </Badge>
          </div>
        </div>
        <Button className="w-full sm:w-auto shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add New Plan
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 md:p-7 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <Input
              placeholder="Search by name or LPAF number..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 md:pl-11 text-sm md:text-base h-11 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px] h-11">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Active">Active Plan</SelectItem>
              <SelectItem value="Lapsed">Lapsed Plan</SelectItem>
              <SelectItem value="Pending">Pending Plan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
            <div className="text-center py-20 text-gray-500 text-sm md:text-base bg-white rounded-2xl border border-gray-100">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No plans found</p>
              <p className="text-xs mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
