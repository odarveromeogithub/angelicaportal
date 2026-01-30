import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "./useDebounce";

export interface UseTableDataOptions<T> {
  searchFields?: (keyof T)[];
  debounceMs?: number;
  initialSort?: {
    field: keyof T;
    direction: "asc" | "desc";
  };
  customFilter?: (item: T, filters: Record<string, unknown>) => boolean;
  pageSize?: number;
}

export function useTableData<T>(
  data: T[],
  options: UseTableDataOptions<T> = {},
) {
  const {
    searchFields = [],
    debounceMs = 300,
    initialSort,
    customFilter,
    pageSize = 10,
  } = options;

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [sortField, setSortField] = useState<keyof T | null>(
    initialSort?.field || null,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSort?.direction || "asc",
  );
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchQuery = useDebounce(searchQuery, debounceMs);

  const filteredData = useMemo(() => {
    let result = data;

    // Apply search filter
    if (debouncedSearchQuery && searchFields.length > 0) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) =>
          String(item[field]).toLowerCase().includes(query),
        ),
      );
    }

    // Apply custom filters
    if (customFilter) {
      result = result.filter((item) => customFilter(item, filters));
    }

    return result;
  }, [data, debouncedSearchQuery, searchFields, customFilter, filters]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Update current page, ensuring it's within bounds
  const setPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages],
  );

  const goToNextPage = useCallback(() => {
    setPage(currentPage + 1);
  }, [currentPage, setPage]);

  const goToPreviousPage = useCallback(() => {
    setPage(currentPage - 1);
  }, [currentPage, setPage]);

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const goToLastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages, setPage]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      resetPage();
    },
    [resetPage],
  );

  const setFilter = useCallback(
    (key: string, value: unknown) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      resetPage();
    },
    [resetPage],
  );

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handleSort = useCallback(
    (field: keyof T) => {
      if (sortField === field) {
        // Toggle direction if same field
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        // New field, default to ascending
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField],
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const clearSort = useCallback(() => {
    setSortField(null);
    setSortDirection("asc");
  }, []);

  return {
    // Data
    data: paginatedData,
    allData: sortedData,
    totalCount: data.length,
    filteredCount: sortedData.length,

    // Search
    searchQuery,
    handleSearch,
    clearSearch,

    // Filters
    filters,
    setFilter,
    clearFilters,

    // Sort
    sortField,
    sortDirection,
    handleSort,
    clearSort,

    // Pagination
    currentPage,
    totalPages,
    pageSize,
    setPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    resetPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,

    // Computed
    isSearching: debouncedSearchQuery.length > 0,
    isFiltered: Object.keys(filters).length > 0,
    isSorted: sortField !== null,
    hasResults: sortedData.length > 0,
  };
}
