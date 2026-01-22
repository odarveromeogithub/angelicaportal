export type UserRole = "admin" | "client" | "sc" | "um";

export interface RolePermissions {
  sidebar: {
    angelica: boolean;
    dashboard: boolean;
    settings: boolean;
    profile: boolean;
  };
  header: {
    home: boolean;
    planList: boolean;
    waitingList: boolean;
  };
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  client: {
    sidebar: {
      angelica: true,
      dashboard: false,
      settings: true,
      profile: true,
    },
    header: {
      home: true,
      planList: true,
      waitingList: false,
    },
  },
  admin: {
    sidebar: {
      angelica: true,
      dashboard: true,
      settings: true,
      profile: true,
    },
    header: {
      home: true,
      planList: true,
      waitingList: true,
    },
  },
  sc: {
    sidebar: {
      angelica: true,
      dashboard: true,
      settings: true,
      profile: true,
    },
    header: {
      home: true,
      planList: true,
      waitingList: true,
    },
  },
  um: {
    sidebar: {
      angelica: true,
      dashboard: true,
      settings: true,
      profile: true,
    },
    header: {
      home: true,
      planList: true,
      waitingList: true,
    },
  },
};

export const getPermissionsForRole = (role: string): RolePermissions => {
  return ROLE_PERMISSIONS[role as UserRole] || ROLE_PERMISSIONS.client;
};

