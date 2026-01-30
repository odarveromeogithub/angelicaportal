export const PAGINATION_CONFIG = {
  // Set to 'server' when backend supports pagination
  mode: process.env.NODE_ENV === "production" ? "server" : "client",

  // Page sizes for each entity
  pageSizes: {
    plans: 4,
    clients: 4,
    agents: 7,
    users: 6,
    waitingList: 5,
  },

  // Default pagination settings
  defaults: {
    initialPage: 1,
    maxPageSize: 100,
  },
} as const;

export type PaginationMode = "client" | "server";
export type EntityType = keyof typeof PAGINATION_CONFIG.pageSizes;
