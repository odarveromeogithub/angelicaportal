// Dashboard CSS Classes
export const DASHBOARD_CLASSES = {
  container: "min-h-screen bg-gray-100",
  header: {
    wrapper: "bg-white shadow-lg",
    content: "mx-auto flex max-w-7xl items-center justify-between px-4 py-4",
    logo: {
      title: "text-2xl font-bold text-indigo-600",
      subtitle: "text-sm text-indigo-400",
    },
  },
  main: "mx-auto max-w-7xl px-4 py-8",
  card: {
    main: "border-indigo-100 bg-white",
    info: "rounded-2xl border-indigo-200 bg-indigo-50/80",
  },
  button: {
    logout: "h-10 rounded-full px-5 text-sm font-semibold bg-red-600 text-white hover:bg-red-700",
  },
  userInfo: {
    label: "text-sm font-semibold uppercase tracking-wide text-indigo-600",
    value: "text-2xl text-indigo-900",
    valueSmall: "text-lg text-indigo-900 break-words",
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
