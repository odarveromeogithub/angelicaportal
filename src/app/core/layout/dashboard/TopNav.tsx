import { motion } from "motion/react";
import { Menu, Bell } from "lucide-react";
import { useAppSelector } from "../../state/hooks";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

interface TopNavProps {
  tabs?: Array<{ label: string; path: string; icon?: React.ReactNode }>;
  currentTab?: string;
  onTabChange?: (path: string) => void;
  onMenuClick?: () => void;
  minimal?: boolean;
}

export function TopNav({
  tabs,
  currentTab,
  onTabChange,
  onMenuClick,
  minimal,
}: TopNavProps) {
  // Use auth selector to get dashboard user from authenticated user
  const authUser = useAppSelector((state) => state.auth.user);
  const dashboardUser = authUser as any; // Cast to any to access all user properties

  return (
    <TooltipProvider>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 md:left-60 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 shadow-sm topnav-safe"
      >
        <div
          className={`px-4 md:px-6 lg:px-8 ${minimal ? "py-3 md:py-4" : "py-4 md:py-5"}`}
        >
          <div
            className={`flex items-center justify-between gap-3 ${tabs ? "mb-4" : "mb-0"}`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-200" />
              </button>
              {!minimal && (
                <div>
                  <div className="text-xl sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold leading-tight text-slate-900 dark:text-white">
                    Welcome Back,{" "}
                    <span className="text-blue-600 dark:text-blue-300 font-bold">
                      {dashboardUser?.name || "User"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            {!minimal && (
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-5 h-5" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        3
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>

          {tabs && (
            <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800 -mb-5 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.path}
                  onClick={() => onTabChange?.(tab.path)}
                  className={`relative pb-2 pt-2 px-5 flex-shrink-0 transition-all rounded-t-md ${
                    currentTab === tab.path
                      ? "bg-blue-50/70 dark:bg-slate-800"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={
                        currentTab === tab.path
                          ? "text-blue-600 dark:text-blue-300"
                          : "text-slate-500 dark:text-slate-400"
                      }
                    >
                      {tab.icon}
                    </div>
                    <span
                      className={`text-base whitespace-nowrap font-medium transition-colors ${
                        currentTab === tab.path
                          ? "text-blue-600 dark:text-blue-300 font-semibold"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                  {currentTab === tab.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.header>
    </TooltipProvider>
  );
}
