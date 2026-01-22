import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit, Eye, Download, ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Plan } from '../../interfaces/dashboard.interface';
import { Badge } from '../ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

interface PlanCardProps {
  plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusVariant = (status: string): "default" | "destructive" | "secondary" => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Lapsed':
        return 'destructive';
      case 'Pending':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "bg-white rounded-xl md:rounded-2xl shadow-sm border transition-all duration-300",
          isExpanded ? "border-blue-300 shadow-md" : "border-gray-100 hover:border-gray-200 hover:shadow-md"
        )}
      >
        {/* Main Card Header */}
        <div className="p-5 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* LPAF */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">LPAF Number</h3>
                <p className="text-base font-bold text-gray-900 truncate">{plan.lpafNumber}</p>
              </div>

              {/* Full Name */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name</h3>
                <p className="text-base font-bold text-gray-900 truncate">{plan.fullName}</p>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Status</h3>
                <Badge variant={getStatusVariant(plan.status)} className="font-semibold">
                  {plan.status}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 lg:ml-4 lg:border-l lg:border-gray-200 lg:pl-4">
              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center gap-1.5">
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
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={cn(
                    "h-9 w-9 ml-1",
                    isExpanded && "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  )}
                >
                  {isExpanded ? (
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
                      Edit Plan
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
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={cn(
                    "h-9 w-9",
                    isExpanded && "bg-blue-50 text-blue-600"
                  )}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-gradient-to-b from-gray-50 to-white border-t border-gray-100"
            >
              <div className="p-4 md:p-5 lg:p-6 space-y-5 md:space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                  <h4 className="text-lg font-bold text-gray-900">Additional Details</h4>
                </div>

                {/* Plan Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
                  <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Contract Price</p>
                    <p className="text-base font-bold text-gray-900">₱ {plan.contractPrice.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Plan type</p>
                    <p className="text-base font-bold text-gray-900 truncate">{plan.planType}</p>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Mode of Payment</p>
                    <p className="text-base font-bold text-gray-900 truncate">{plan.modeOfPayment}</p>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Term of Payment</p>
                    <p className="text-base font-bold text-gray-900 truncate">{plan.termOfPayment}</p>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Installment</p>
                    <p className="text-base font-bold text-gray-900">₱ {plan.installment.toFixed(2)}</p>
                  </div>
                </div>

                {/* Personal Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
                  <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Date of Birth</p>
                    <p className="text-base font-bold text-gray-900">{plan.dateOfBirth}</p>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Gender</p>
                    <p className="text-base font-bold text-gray-900">{plan.gender}</p>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Civil Status</p>
                    <p className="text-base font-bold text-gray-900">{plan.civilStatus}</p>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100 sm:col-span-1">
                    <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Email</p>
                    <a href={`mailto:${plan.email}`} className="text-base font-bold text-blue-600 hover:text-blue-700 hover:underline break-all">
                      {plan.email}
                    </a>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Contact Number</p>
                    <p className="text-base font-bold text-gray-900">{plan.contactNumber}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white p-4 md:p-5 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Complete Address</p>
                  <p className="text-base font-bold text-gray-900">{plan.address}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  );
}
