import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "./useDebounce";

export interface UseTableDataOptions<T> {
  searchFields?: (keyof T)[];
  debounceMs?: number;
  initialSort?: {
    field: keyof T;
    direction: "asc" | "desc";
  };
  customFilter?: (item: T, filters: Record<string, any>) => boolean;
}

export function useTableData<T extends Record<string, any>>(
  data: T[],
  options: UseTableDataOptions<T> = {},
) {
  const {
    searchFields = [],
    debounceMs = 300,
    initialSort,
    customFilter,
  } = options;

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortField, setSortField] = useState<keyof T | null>(
    initialSort?.field || null,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSort?.direction || "asc",
  );

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

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const setFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

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
    data: sortedData,
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

    // Computed
    isSearching: debouncedSearchQuery.length > 0,
    isFiltered: Object.keys(filters).length > 0,
    isSorted: sortField !== null,
    hasResults: sortedData.length > 0,
  };
}
