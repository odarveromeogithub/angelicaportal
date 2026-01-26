import { motion } from "motion/react";
import { Search, Edit, Paperclip } from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { dashboardApi } from "../../../core/state/api";
import {
  TabsHeader,
  SearchBar,
  EmptyState,
} from "../../../core/components/dashboard";
import { Badge } from "../../../core/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../core/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../core/components/ui/tooltip";
import { Button } from "../../../core/components/ui/button";
import { useToast } from "../../../core/hooks/useToast";
import { Skeleton } from "../../../core/components/ui/skeleton";

export function WaitingListTab() {
  const toast = useToast();
  const {
    data: waitingList = [],
    isLoading: loading,
    isError,
  } = dashboardApi.useGetWaitingListQuery();
  const [searchQuery, setSearchQuery] = useState("");

  // Show error toast when data fetch fails
  useEffect(() => {
    if (isError) {
      toast.error(
        "Failed to load waiting list",
        "Unable to fetch pending applications. Please try again later.",
      );
    }
  }, [isError, toast]);

  const filteredItems = useMemo(() => {
    return waitingList.filter(
      (item: any) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.policyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lpafNo.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [waitingList, searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <TooltipProvider>
      <div className="py-3 sm:py-3 md:py-6 lg:py-10 xl:py-5 space-y-3 sm:space-y-3">
        <TabsHeader
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-50/80 dark:bg-slate-800/60 backdrop-blur-sm z-10 border-b border-gray-200 dark:border-slate-700">
                <TableRow className="hover:bg-gray-50/80 dark:hover:bg-slate-800/60">
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                    Actions
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                    Policy No-LPAF No
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Skeleton loading rows
                  <>
                    {[...Array(4)].map((_, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-gray-50 dark:border-slate-800/60"
                      >
                        <TableCell>
                          <Skeleton className="h-8 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <>
                    {filteredItems.map((item: any, index: number) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors duration-150 border-b border-gray-50 dark:border-slate-800/60"
                      >
                        <TableCell>
                          <div className="flex gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-300 transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Plan</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 transition-colors"
                                >
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
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-yellow-50 text-yellow-700 border-yellow-200 font-semibold dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800/50"
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </>
                )}
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
