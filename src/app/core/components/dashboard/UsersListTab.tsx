import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import {
  Loader2,
  UserPlus,
  Users,
  Edit,
  RotateCw,
  Mail,
  Trash2,
} from "lucide-react";
import { dashboardApi } from "../../state/api";
import type { User } from "../../interfaces/dashboard.interface";
import { DashboardHeader } from "./DashboardHeader";
import { SearchBar } from "./SearchBar";
import { EmptyState } from "./EmptyState";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useToast } from "../../hooks/useToast";

export function UsersListTab() {
  const toast = useToast();
  const {
    data: users = [],
    isLoading: loading,
    isError,
  } = dashboardApi.useGetUsersQuery();
  const [searchQuery, setSearchQuery] = useState("");

  // Show error toast when data fetch fails
  useEffect(() => {
    if (isError) {
      toast.error(
        "Failed to load users",
        "Unable to fetch user list. Please try again later.",
      );
    }
  }, [isError, toast]);
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return (users as User[]).filter(
      (user: User) =>
        user.username.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.agentCode.toLowerCase().includes(query) ||
        user.userType.toLowerCase().includes(query),
    );
  }, [users, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 space-y-6 sm:space-y-7"
      >
        <DashboardHeader
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
              <Button className="gap-2 shadow-sm">
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-50/80 backdrop-blur-sm z-10 border-b border-gray-200">
                <TableRow className="hover:bg-gray-50/80">
                  <TableHead className="font-semibold text-gray-700">
                    Actions
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Username
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Agent Code
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    User Type
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Contact No.
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: any, index: number) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group hover:bg-gray-50/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 transition-colors"
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
                              className="h-8 w-8 hover:bg-amber-50 hover:text-amber-600 transition-colors"
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
                              className="h-8 w-8 hover:bg-purple-50 hover:text-purple-600 transition-colors"
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
                                className="h-8 w-8 hover:bg-red-50 hover:text-red-600 transition-colors"
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
                    <TableCell className="font-medium text-gray-600">
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
                    <TableCell className="text-gray-600">
                      {user.contactNo}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <EmptyState
              icon={Users}
              title="No users found"
              description="Try adjusting your search"
            />
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
