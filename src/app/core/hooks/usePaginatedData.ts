import { useMemo, useCallback } from "react";
import { usePagination, type UsePaginationReturn } from "./usePagination";
import {
  PAGINATION_CONFIG,
  type EntityType,
  type PaginationMode,
} from "../config/pagination";

export interface UsePaginatedDataOptions {
  entityType: EntityType;
  searchQuery?: string;
  filters?: Record<string, any>;
  mode?: PaginationMode;
}

export interface UsePaginatedDataReturn<T> extends UsePaginationReturn<T> {
  isLoading: boolean;
  error?: any;
  refetch: () => void;
}

// This is a template hook - each entity will have its own implementation
// For now, we'll keep the existing client-side logic but prepare for server-side
export function usePaginatedData<T>(
  data: T[],
  queryHook: any, // RTK Query hook
  { entityType, searchQuery = "", filters = {}, mode }: UsePaginatedDataOptions,
): UsePaginatedDataReturn<T> {
  const pageSize = PAGINATION_CONFIG.pageSizes[entityType];
  const paginationMode = mode || PAGINATION_CONFIG.mode;

  // For now, we use the existing query without pagination params
  // When switching to server-side, we'll pass pagination params
  const queryParams =
    paginationMode === "server"
      ? { page: 1, limit: pageSize } // This will be dynamic based on current page
      : undefined;

  const {
    data: apiData = [],
    isLoading,
    error,
    refetch,
  } = queryHook(queryParams);

  // Use the data from API or fallback to passed data for client-side
  const sourceData = paginationMode === "server" ? apiData : data;

  // Apply client-side filtering if needed
  const filteredData = useMemo(() => {
    if (paginationMode === "server") {
      // Server handles filtering, just return the data
      return sourceData as T[];
    }

    // Client-side filtering logic
    let result = sourceData as T[];

    // Apply search
    if (searchQuery.trim()) {
      // This would need to be customized per entity
      result = result.filter((item: any) =>
        Object.values(item).some((value: any) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      ) as T[];
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        result = result.filter((item: any) => item[key] === value) as T[];
      }
    });

    return result;
  }, [sourceData, searchQuery, filters, paginationMode]);

  // Mock server meta for now - in real server-side, this would come from API
  const serverMeta =
    paginationMode === "server"
      ? {
          currentPage: 1,
          totalPages: Math.ceil(filteredData.length / pageSize),
          totalItems: filteredData.length,
          pageSize,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      : undefined;

  const pagination = usePagination(filteredData, {
    pageSize,
    mode: paginationMode,
    serverMeta,
  });

  // Enhanced refetch that can handle pagination params
  const enhancedRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    ...pagination,
    isLoading,
    error,
    refetch: enhancedRefetch,
  };
}
