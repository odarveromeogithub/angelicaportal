import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { UserPlus, Users, Edit, RotateCw, Mail, Trash2 } from "lucide-react";

import { AddUserDialog } from "../Dialog/AddUserDialog";
import { dashboardApi } from "../../../core/state/api";
import {
  TabsHeader,
  SearchBar,
  EmptyState,
} from "../../../core/components/dashboard";
import { Button } from "../../../core/components/ui/button";
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

export function UsersListTab() {
  const { data: users = [], isLoading: loading } =
    dashboardApi.useGetUsersQuery();
  const [addUserOpen, setAddUserOpen] = useState(false);

  const {
    data: paginatedUsers,
    filteredCount,
    searchQuery,
    handleSearch,
    currentPage,
    totalPages,
    setPage,
    hasNextPage,
    hasPreviousPage,
  } = useTableData(users, {
    searchFields: ["username", "name", "agentCode", "userType"],
    pageSize: 5, // 5 items per page as requested
  });

  const handleSearchChange = useCallback(
    (value: string) => {
      handleSearch(value);
    },
    [handleSearch],
  );

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-3 sm:py-3 md:py-6 lg:py-10 xl:py-5 space-y-3 sm:space-y-3"
      >
        <TabsHeader
          title="Users Management"
          description="Manage system users and permissions"
          count={filteredCount}
          countLabel="Users"
          actions={
            <>
              <Button variant="outline" className="gap-2 shadow-sm">
                <Users className="w-4 h-4" />
                Batch Create
              </Button>
              <Button
                className="gap-2 shadow-sm"
                onClick={() => setAddUserOpen(true)}
                type="button"
              >
                <UserPlus className="w-4 h-4" />
                Add New User
              </Button>
            </>
          }
        />

        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by username, name, agent code, or type..."
        />

        {/* Users List Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actions</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Agent Code</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead>Contact No.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRowSkeleton />
                ) : (
                  paginatedUsers.map((user: any, index: number) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit User</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/40 dark:hover:text-amber-300 transition-colors"
                              >
                                <RotateCw className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reset Password</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Send Email</TooltipContent>
                          </Tooltip>

                          {user.userType === "SC" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-300 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete User</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="font-medium text-slate-500 dark:text-slate-400">
                        {user.agentCode}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.userType === "ADMIN" ? "default" : "secondary"
                          }
                          className="font-semibold"
                        >
                          {user.userType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400">
                        {user.contactNo}
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && paginatedUsers.length === 0 && (
            <EmptyState
              icon={Users}
              title="No users found"
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
      <AddUserDialog open={addUserOpen} onOpenChange={setAddUserOpen} />
    </TooltipProvider>
  );
}
