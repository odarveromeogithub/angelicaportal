import { motion } from 'motion/react';
import { Search, Edit, Paperclip } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { dashboardApi } from '../../../core/state/api';
import { DashboardHeader, SearchBar, EmptyState } from '../../../core/components/dashboard';
import { Badge } from '../../../core/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../core/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../core/components/ui/tooltip';
import { Button } from '../../../core/components/ui/button';

export function WaitingListTab() {
  const { data: waitingList = [], isLoading: loading } = dashboardApi.useGetWaitingListQuery();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return waitingList.filter((item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.policyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lpafNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [waitingList, searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <TooltipProvider>
      <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 space-y-6 sm:space-y-7">
        <DashboardHeader
          title="Pending Plans"
          description="Review and manage pending applications"
          count={filteredItems.length}
          countLabel="Pending"
        />

        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name or LPAF number..."
        />

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
                {filteredItems.map((item: any, index: number) => (
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

          {filteredItems.length === 0 && !loading && (
            <EmptyState
              icon={Search}
              title="No pending plans found"
              description="All applications have been processed"
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
