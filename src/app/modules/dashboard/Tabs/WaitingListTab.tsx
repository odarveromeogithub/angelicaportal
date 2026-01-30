import { motion } from "motion/react";
import { Search, Edit, Upload } from "lucide-react";
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
import { FormDialog } from "../../../core/components/ui/form-dialog";
import { Input } from "../../../core/components/ui/input";
import { useToast } from "../../../core/hooks/useToast";
import { useDebounce } from "../../../core/hooks/useDebounce";
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
import { EditPlanDialog } from "../Dialog/EditPlanDialog";

export function WaitingListTab() {
  const toast = useToast();
  const {
    data: waitingList = [],
    isLoading: loading,
    isError,
  } = dashboardApi.useGetWaitingListQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Attach dialog state
  const [attachDialogOpen, setAttachDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<any | null>(
    null,
  );

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle submit (simulate upload)
  const handleAttachSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedItem) return;
    setIsSubmitting(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsSubmitting(false);
      setAttachDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success("Payment image attached successfully!");
    }, 1200);
  };

  // Handle edit plan
  const handleEditPlan = (item: any) => {
    setSelectedPlanForEdit(item);
    setEditDialogOpen(true);
  };

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
        item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.policyNo
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        item.lpafNo.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
    );
  }, [waitingList, debouncedSearchQuery]);

  const {
    paginatedData: paginatedItems,
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
    showingText,
  } = usePagination(filteredItems, { pageSize: 5 });

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
                  <TableRowSkeleton />
                ) : (
                  <>
                    {paginatedItems.map((item: any, index: number) => (
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
                                  onClick={() => handleEditPlan(item)}
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
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setAttachDialogOpen(true);
                                  }}
                                  aria-label="Attach Payment Image"
                                >
                                  <Upload className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Attach Payment Image
                              </TooltipContent>
                            </Tooltip>
                            {/* Attach Payment Image Dialog */}
                            <FormDialog
                              open={attachDialogOpen}
                              onOpenChange={(open) => {
                                setAttachDialogOpen(open);
                                if (!open) {
                                  setSelectedFile(null);
                                  setPreviewUrl(null);
                                }
                              }}
                              title="Upload Payment Image"
                              description="Attach a payment proof image for this application."
                              icon={<Upload className="w-6 h-6" />}
                              cancelLabel="Cancel"
                              submitLabel="Submit"
                              isSubmitting={isSubmitting}
                              isValid={!!selectedFile}
                              onSubmit={handleAttachSubmit}
                            >
                              <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                  Select an image:
                                </label>
                                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
                                  {previewUrl ? (
                                    <img
                                      src={previewUrl}
                                      alt="Preview"
                                      className="max-h-48 object-contain mb-2 rounded"
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-48 w-full">
                                      <Upload className="w-20 h-20 text-gray-300 mb-2" />
                                      <span className="text-gray-400">
                                        No image selected
                                      </span>
                                    </div>
                                  )}
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="mt-2"
                                    disabled={isSubmitting}
                                  />
                                </div>
                              </div>
                            </FormDialog>
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

        {/* Pagination */}
        {!loading && filteredItems.length > 5 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {showingText}
            </p>
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
          </div>
        )}
      </div>

      {/* Edit Plan Dialog */}
      <EditPlanDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        planData={selectedPlanForEdit}
      />
    </TooltipProvider>
  );
}
