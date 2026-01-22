import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { Search, Loader2, UserPlus, Users, Edit, RotateCw, Mail, Trash2 } from 'lucide-react';
import { type RootState } from '../../state/store';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
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

export function UsersListTab() {
  const { users, loading } = useSelector((state: RootState) => state.dashboard_usersList);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user: any) =>
        user.username.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.agentCode.toLowerCase().includes(query) ||
        user.userType.toLowerCase().includes(query)
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
        {/* Header & Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Users Management</h2>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm text-gray-500">Manage system users and permissions</p>
              <Badge variant="secondary" className="font-normal">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
            <Button variant="outline" className="gap-2 shadow-sm">
              <Users className="w-4 h-4" />
              Batch Create
            </Button>
            <Button className="gap-2 shadow-sm">
              <UserPlus className="w-4 h-4" />
              Add New User
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by username, name, agent code, or type..."
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              className="pl-10 md:pl-11 h-11 text-sm md:text-base border-gray-200 focus:border-blue-300 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Users List Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit User</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                              <RotateCw className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Reset Password</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                              <Mail className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Send Email</TooltipContent>
                        </Tooltip>

                        {user.userType === 'SC' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete User</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium">{user.username}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="font-medium text-gray-600">{user.agentCode}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.userType === 'ADMIN' ? 'default' : 'secondary'}
                        className="font-semibold"
                      >
                        {user.userType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{user.contactNo}</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-20 text-gray-500 text-sm md:text-base">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No users found</p>
              <p className="text-xs mt-1">Try adjusting your search</p>
            </div>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
