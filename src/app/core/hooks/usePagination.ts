import { useState, useMemo, useCallback } from "react";

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface UsePaginationOptions {
  initialPage?: number;
  pageSize: number;
  mode?: "client" | "server";
  serverMeta?: PaginationMeta;
}

export interface UsePaginationReturn<T> {
  // Data
  paginatedData: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;

  // Navigation
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;

  // State
  canGoNext: boolean;
  canGoPrevious: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;

  // Page info
  pageSize: number;
  showingText: string;
  mode: "client" | "server";
}

export function usePagination<T>(
  data: T[],
  {
    initialPage = 1,
    pageSize,
    mode = "client",
    serverMeta,
  }: UsePaginationOptions,
): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Server-side pagination mode
  if (mode === "server" && serverMeta) {
    const {
      currentPage: serverCurrentPage,
      totalPages: serverTotalPages,
      totalItems: serverTotalItems,
      pageSize: serverPageSize,
      hasNextPage,
      hasPreviousPage,
    } = serverMeta;

    const startIndex = (serverCurrentPage - 1) * serverPageSize;
    const endIndex = Math.min(startIndex + serverPageSize, serverTotalItems);

    return {
      // Data
      paginatedData: data, // Data comes pre-paginated from server
      currentPage: serverCurrentPage,
      totalPages: serverTotalPages,
      totalItems: serverTotalItems,
      startIndex,
      endIndex,

      // Navigation
      goToPage: useCallback((page: number) => {
        // This will be handled by the parent component calling the API
        console.log("Server pagination: go to page", page);
      }, []),
      goToNextPage: useCallback(() => {
        console.log("Server pagination: go to next page");
      }, []),
      goToPreviousPage: useCallback(() => {
        console.log("Server pagination: go to previous page");
      }, []),
      goToFirstPage: useCallback(() => {
        console.log("Server pagination: go to first page");
      }, []),
      goToLastPage: useCallback(() => {
        console.log("Server pagination: go to last page");
      }, []),

      // State
      canGoNext: hasNextPage ?? false,
      canGoPrevious: hasPreviousPage ?? false,
      isFirstPage: serverCurrentPage === 1,
      isLastPage: serverCurrentPage === serverTotalPages,

      // Page info
      pageSize: serverPageSize,
      showingText:
        serverTotalItems > 0
          ? `Showing ${startIndex + 1}-${endIndex} of ${serverTotalItems}`
          : "No items to show",
      mode: "server",
    };
  }

  // Client-side pagination mode (existing logic)
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Ensure current page is valid
  const validCurrentPage = useMemo(() => {
    if (totalPages === 0) return 1;
    if (currentPage > totalPages) return totalPages;
    if (currentPage < 1) return 1;
    return currentPage;
  }, [currentPage, totalPages]);

  // Update current page if it becomes invalid
  useMemo(() => {
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);
    }
  }, [validCurrentPage, currentPage]);

  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedData = data.slice(startIndex, endIndex);

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages],
  );

  const goToNextPage = useCallback(() => {
    if (validCurrentPage < totalPages) {
      setCurrentPage(validCurrentPage + 1);
    }
  }, [validCurrentPage, totalPages]);

  const goToPreviousPage = useCallback(() => {
    if (validCurrentPage > 1) {
      setCurrentPage(validCurrentPage - 1);
    }
  }, [validCurrentPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const canGoNext = validCurrentPage < totalPages;
  const canGoPrevious = validCurrentPage > 1;
  const isFirstPage = validCurrentPage === 1;
  const isLastPage = validCurrentPage === totalPages;

  const showingText =
    totalItems > 0
      ? `Showing ${startIndex + 1}-${endIndex} of ${totalItems}`
      : "No items to show";

  return {
    // Data
    paginatedData,
    currentPage: validCurrentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,

    // Navigation
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,

    // State
    canGoNext,
    canGoPrevious,
    isFirstPage,
    isLastPage,

    // Page info
    pageSize,
    showingText,
    mode: "client",
  };
}
