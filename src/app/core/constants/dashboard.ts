// Dashboard CSS Classes - Enhanced Responsive Design
export const DASHBOARD_CLASSES = {
  container: "min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50",
  header: {
    wrapper: "bg-white border-b border-gray-200 shadow-sm",
    content: "mx-auto w-full max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6",
    logo: {
      title: "text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600 break-words",
      subtitle: "text-xs sm:text-sm text-indigo-400 mt-1 sm:mt-0",
    },
  },
  main: "mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12",
  card: {
    main: "border border-indigo-100 bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-shadow",
    info: "rounded-lg sm:rounded-xl md:rounded-2xl border border-indigo-200 bg-indigo-50/80 shadow-xs hover:shadow-sm transition-all",
  },
  button: {
    logout: "h-9 sm:h-10 md:h-11 rounded-full px-4 sm:px-5 md:px-6 text-xs sm:text-sm md:text-base font-semibold bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition-colors",
  },
  userInfo: {
    label: "text-xs sm:text-sm font-semibold uppercase tracking-wide text-indigo-600",
    value: "text-lg sm:text-xl md:text-2xl text-indigo-900 font-bold mt-1",
    valueSmall: "text-sm sm:text-base md:text-lg text-indigo-900 break-words font-semibold mt-1",
  },
} as const

// Dashboard Configuration
export const DASHBOARD_CONFIG = {
  appName: "Angelica Portal",
  appSubtitle: "Secure member access",
  maxWidth: "max-w-7xl",
} as const

// Dashboard Messages
export const DASHBOARD_MESSAGES = {
  welcome: "Welcome! You are successfully logged in.",
  noUser: "No user data available",
} as const
