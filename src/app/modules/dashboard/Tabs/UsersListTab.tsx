import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { UserPlus, Users, Edit, RotateCw, Mail, Trash2 } from "lucide-react";

import { AddUserDialog } from "../Dialog/AddUserDialog";
import { EditUserDialog } from "../Dialog/EditUserDialog";
import { SendEmailDialog } from "../Dialog/SendEmailDialog";
import { DeleteUserDialog } from "../Dialog/DeleteUserDialog";
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

export function UsersListTab() {
  const { data: users = [], isLoading: loading } =
    dashboardApi.useGetUsersQuery();
  const [deleteUser, { isLoading: deletingUser }] =
    dashboardApi.useDeleteUserMutation();
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [sendEmailOpen, setSendEmailOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user: any) =>
        user.username.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.agentCode.toLowerCase().includes(query) ||
        user.userType.toLowerCase().includes(query),
    );
  }, [users, searchQuery]);

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };

  const handleSendEmail = (user: any) => {
    setSelectedUser(user);
    setSendEmailOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setDeleteUserOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id).unwrap();
      setDeleteUserOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const {
    paginatedData: paginatedUsers,
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
    showingText,
  } = usePagination(filteredUsers, { pageSize: 6 });

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
          count={filteredUsers.length}
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
          onChange={setSearchQuery}
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
                                onClick={() => handleEditUser(user)}
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
                                onClick={() => handleSendEmail(user)}
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
                                  onClick={() => handleDeleteUser(user)}
                                  disabled={deletingUser}
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

          {!loading && filteredUsers.length === 0 && (
            <EmptyState
              icon={Users}
              title="No users found"
              description="Try adjusting your search"
            />
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredUsers.length > 6 && (
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
      <AddUserDialog open={addUserOpen} onOpenChange={setAddUserOpen} />
      <EditUserDialog
        open={editUserOpen}
        onOpenChange={setEditUserOpen}
        userData={selectedUser}
      />
      <SendEmailDialog
        open={sendEmailOpen}
        onOpenChange={setSendEmailOpen}
        user={selectedUser}
      />
      <DeleteUserDialog
        open={deleteUserOpen}
        onOpenChange={setDeleteUserOpen}
        user={selectedUser}
        onConfirm={confirmDeleteUser}
        isDeleting={deletingUser}
      />
    </TooltipProvider>
  );
}
