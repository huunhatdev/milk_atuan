export const Routes = {
  HOME: "/",
  LOGIN: "/login",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    SERVICES: "/admin/services",
    ORDERS: "/admin/orders",
    REPORTS: "/admin/reports",
    API_DOCS: "/admin/api-docs",
    PHONE_USAGE: "/admin/phone-usage",
  },
  CUSTOMER: {
    DASHBOARD: "/customer/dashboard",
    ORDERS: "/customer/orders",
    CREATE_ORDER: "/customer/create-order",
  },
  API: {
    AUTH: {
      LOGIN: "/api/auth/login",
      LOGOUT: "/api/auth/logout",
      REFRESH: "/api/auth/refresh",
    },
    ORDERS: "/api/orders",
    SERVICES: "/api/services",
    ADMIN: {
      ORDERS: "/api/admin/orders",
      CHECK_PHONES: "/api/admin/check-phones",
      ORDER_SUCCESS: "/api/admin/order-success",
      EXPORT_ORDERS: "/api/admin/export-orders",
      USERS: "/api/admin/users",
      SERVICES: "/api/admin/services",
      DASHBOARD_STATS: "/api/admin/dashboard/stats",
      PHONE_USAGE: "/api/admin/phone-usage",
    },
  },
} as const
