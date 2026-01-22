import { motion } from 'motion/react';
import { Search, Edit, Eye, Download, ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Input } from '../ui/input';
import { clientListActions } from '../../state/reducer/dashboard/clientListSlice';
import type { RootState, AppDispatch } from '../../state/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Button } from '../ui/button';

export function ClientListTab() {
  const dispatch = useDispatch<AppDispatch>();
  const clientList = useSelector((state: RootState) => state.dashboard_clientList);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(clientListActions.setSearchQuery(e.target.value));
  };

  const handleStatusFilterChange = (value: string) => {
    dispatch(clientListActions.setStatusFilter(value));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <TooltipProvider>
      <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 space-y-6 sm:space-y-7">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">List of Client Plans</h2>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-gray-500">View and manage all client plans</p>
            <Badge variant="secondary" className="font-normal">
              {clientList.filteredItems.length} {clientList.filteredItems.length === 1 ? 'Client' : 'Clients'}
            </Badge>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 md:p-7 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <Input
                placeholder="Search by name or LPAF number..."
                value={clientList.searchQuery}
                onChange={handleSearchChange}
                className="pl-10 md:pl-11 text-sm md:text-base h-11 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
            </div>
            <Select value={clientList.statusFilter} onValueChange={handleStatusFilterChange}>
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

        {/* Client Plans List */}
        <div className="space-y-4">
          {clientList.filteredItems.map((client: any, index: number) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Main Row */}
              <div className="p-5 md:p-6 flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-auto">
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">LPAF</p>
                    <p className="text-base font-bold text-gray-900 truncate">
                      {client.policyNo} | {client.lpafNo}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Full Name</p>
                    <p className="text-base font-bold text-gray-900 truncate">{client.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Status</p>
                    <Badge
                      variant={
                        client.status === 'Active'
                          ? 'default'
                          : client.status === 'Lapsed'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className="font-semibold"
                    >
                      {client.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 lg:border-l lg:border-gray-200 lg:pl-4 w-full lg:w-auto justify-end">
                  {/* Desktop Actions */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Client</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-green-50 hover:text-green-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View Details</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download</TooltipContent>
                    </Tooltip>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(client.id)}
                      className="h-9 w-9 hover:bg-gray-100"
                    >
                      {expandedId === client.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* Mobile Actions */}
                  <div className="sm:hidden flex items-center gap-1.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Client
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(client.id)}
                      className="h-9 w-9"
                    >
                      {expandedId === client.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === client.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-gradient-to-b from-gray-50 to-white border-t border-gray-100"
                >
                  <div className="p-4 md:p-5 lg:p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Plan Type</p>
                        <p className="text-base font-bold text-gray-900">{client.planType}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Contract Price</p>
                        <p className="text-base font-bold text-gray-900">{client.contractPrice}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Email</p>
                        <p className="text-base font-bold text-gray-900 break-all">{client.email}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Contact</p>
                        <p className="text-base font-bold text-gray-900">{client.contactNumber}</p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Address</p>
                      <p className="text-base font-bold text-gray-900">{client.address}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {clientList.filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-500 text-sm md:text-base bg-white rounded-2xl border border-gray-100">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium">No clients found</p>
            <p className="text-xs mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
