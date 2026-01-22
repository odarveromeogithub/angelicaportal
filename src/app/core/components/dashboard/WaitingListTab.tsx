import { motion } from 'motion/react';
import { Search, Edit, Paperclip } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../ui/input';
import { waitingListActions } from '../../state/reducer/dashboard/waitingListSlice';
import { type RootState, type AppDispatch } from '../../state/store';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Button } from '../ui/button';

export function WaitingListTab() {
  const dispatch = useDispatch<AppDispatch>();
  const waitingList = useSelector((state: RootState) => state.dashboard_waitingList);

  const handleWaitingListSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(waitingListActions.setSearchQuery(e.target.value));
  };

  return (
    <TooltipProvider>
      <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 space-y-6 sm:space-y-7">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Pending Plans</h2>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-gray-500">Review and manage pending applications</p>
            <Badge variant="secondary" className="font-normal">
              {waitingList.filteredItems.length} Pending
            </Badge>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 md:p-7 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <Input
              placeholder="Search by name or LPAF number..."
              value={waitingList.searchQuery}
              onChange={handleWaitingListSearchChange}
              className="pl-10 md:pl-11 text-sm md:text-base h-11 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Waiting List Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actions</TableHead>
                  <TableHead>Policy No-LPAF No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitingList.filteredItems.map((item: any, index: number) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-gray-50/50"
                  >
                    <TableCell>
                      <div className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Plan</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                              <Paperclip className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Attachments</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.policyNo} | {item.lpafNo}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200 font-semibold">
                        {item.status}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {waitingList.filteredItems.length === 0 && !waitingList.loading && (
            <div className="text-center py-20 text-gray-500 text-sm md:text-base">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No pending plans found</p>
              <p className="text-xs mt-1">All applications have been processed</p>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
