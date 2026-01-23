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
        className="fixed top-0 left-0 md:left-60 right-0 bg-white border-b border-gray-100 z-40 shadow-sm topnav-safe"
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
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              {!minimal && (
                <div>
                  <div className="text-xl sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold leading-tight text-gray-900">
                    Welcome Back,{" "}
                    <span className="text-blue-600 font-bold">
                      {dashboardUser?.name || "User"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
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
            <div className="flex gap-1 border-b border-gray-100 -mb-5 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.path}
                  onClick={() => onTabChange?.(tab.path)}
                  className={`relative pb-3 px-5 flex-shrink-0 transition-all ${
                    currentTab === tab.path
                      ? "bg-gray-50/50"
                      : "hover:bg-gray-50/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={
                        currentTab === tab.path
                          ? "text-blue-600"
                          : "text-gray-500"
                      }
                    >
                      {tab.icon}
                    </div>
                    <span
                      className={`text-base whitespace-nowrap font-medium transition-colors ${
                        currentTab === tab.path
                          ? "text-blue-600 font-semibold"
                          : "text-gray-600"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                  {currentTab === tab.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
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
