import { useState, useMemo } from "react";
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
import { TableRowSkeleton } from "../../../core/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../core/components/ui/pagination";
import { usePagination } from "../../../core/hooks/usePagination";

export function AgentListTab() {
  const { data: agents = [], isLoading: loading } =
    dashboardApi.useGetAgentsQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return agents;
    const query = searchQuery.toLowerCase();
    return agents.filter(
      (agent: any) =>
        agent.salesCounselorCode.toLowerCase().includes(query) ||
        agent.name.toLowerCase().includes(query) ||
        agent.scStatus.toLowerCase().includes(query),
    );
  }, [agents, searchQuery]);

  const {
    paginatedData: paginatedAgents,
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
    showingText,
  } = usePagination(filteredAgents, { pageSize: 7 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-3 sm:py-3 md:py-6 lg:py-10 xl:py-5 space-y-3 sm:space-y-3"
    >
      <TabsHeader
        title="Agent List"
        description="Manage sales counselor agents"
        count={filteredAgents.length}
        countLabel="Agents"
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
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

        {!loading && filteredAgents.length === 0 && (
          <EmptyState
            icon={Users}
            title="No agents found"
            description="Try adjusting your search"
          />
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredAgents.length > 7 && (
        <div className="flex flex-col items-center gap-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={goToPreviousPage}
                  className={
                    !canGoPrevious
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => goToPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={goToNextPage}
                  className={
                    !canGoNext
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            {showingText}
          </p>
        </div>
      )}
    </motion.div>
  );
}
