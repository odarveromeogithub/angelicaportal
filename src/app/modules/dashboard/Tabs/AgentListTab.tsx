import { useCallback } from "react";
import { motion } from "motion/react";
import { Users } from "lucide-react";
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
import { useTableData } from "../../../core/hooks/useTableData";
import { TableRowSkeleton } from "../../../core/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../core/components/ui/pagination";

export function AgentListTab() {
  const { data: agents = [], isLoading: loading } =
    dashboardApi.useGetAgentsQuery();

  const {
    data: paginatedAgents,
    filteredCount,
    searchQuery,
    handleSearch,
    currentPage,
    totalPages,
    setPage,
    hasNextPage,
    hasPreviousPage,
  } = useTableData(agents, {
    searchFields: ["salesCounselorCode", "name", "scStatus"],
    pageSize: 5, // 5 items per page as requested
  });

  const handleSearchChange = useCallback(
    (value: string) => {
      handleSearch(value);
    },
    [handleSearch],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-3 sm:py-3 md:py-6 lg:py-10 xl:py-5 space-y-3 sm:space-y-3"
    >
      <TabsHeader
        title="Agent List"
        description="Manage sales counselor agents"
        count={filteredCount}
        countLabel="Agents"
      />

      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by code, name, or status..."
      />

      {/* Agent List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl md:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm font-semibold">
                  Code
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold">
                  Name
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRowSkeleton />
              ) : (
                paginatedAgents.map((agent: any, index: number) => (
                  <motion.tr
                    key={agent.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <TableCell className="font-medium">
                      {agent.salesCounselorCode}
                    </TableCell>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          agent.scStatus === "Active" ? "default" : "secondary"
                        }
                        className="font-semibold"
                      >
                        {agent.scStatus}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!loading && paginatedAgents.length === 0 && (
          <EmptyState
            icon={Users}
            title="No agents found"
            description="Try adjusting your search"
          />
        )}
      </div>

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
    </motion.div>
  );
}
