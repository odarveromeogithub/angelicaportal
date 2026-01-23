import { motion } from 'motion/react';
import { Search, Edit, Eye, Download, ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { dashboardApi } from '../../../core/state/api';
import { DashboardHeader, FilterBar, EmptyState } from '../../../core/components/dashboard';
import { Badge } from '../../../core/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../core/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../core/components/ui/tooltip';
import { Button } from '../../../core/components/ui/button';

export function ClientListTab() {
  const { data: clients = [] } = dashboardApi.useGetClientsQuery();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredItems = useMemo(() => {
    return clients.filter((client: any) => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || client.accountStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchQuery, statusFilter]);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId(expandedId === id ? null : id);
  }, [expandedId]);

  return (
    <TooltipProvider>
      <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 space-y-6 sm:space-y-7">
        <DashboardHeader
          title="List of Client Plans"
          description="View and manage all client plans"
          count={filteredItems.length}
          countLabel="Clients"
        />

        <FilterBar
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search by name or LPAF number..."
          filterValue={statusFilter}
          onFilterChange={handleStatusFilterChange}
          filterPlaceholder="Filter by status"
          filterOptions={[
            { value: 'all', label: 'All Plans' },
            { value: 'Active', label: 'Active Plan' },
            { value: 'Lapsed', label: 'Lapsed Plan' },
            { value: 'Pending', label: 'Pending Plan' },
          ]}
        />

        {/* Client Plans List */}
        <div className="space-y-4">
          {filteredItems.map((client: any, index: number) => (
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
                      onClick={() => handleToggleExpand(client.id)}
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
                      onClick={() => handleToggleExpand(client.id)}
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

        {filteredItems.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100">
            <EmptyState
              icon={Search}
              title="No clients found"
              description="Try adjusting your search or filter"
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
