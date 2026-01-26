import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import { useEffect } from "react";
import { dashboardApi } from "../../../core/state/api";
import { StatCard } from "../../../core/components/dashboard/StatCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../core/components/ui/card";
import {
  CLIENT_STATS_CONFIG,
  SALES_STATS_CONFIG,
} from "../../../core/constants/dashboard-stats";
import { useAppSelector } from "../../../core/state/hooks";
import { useToast } from "../../../core/hooks/useToast";

interface HomeTabProps {
  userRole: "client" | "sales" | "admin";
}

export function HomeTab({ userRole }: HomeTabProps) {
  const toast = useToast();
  const { data: plans = [], isError: plansError } =
    dashboardApi.useGetPlansQuery();
  const { data: waitingList = [], isError: waitingListError } =
    dashboardApi.useGetWaitingListQuery();
  const { data: clientList = [], isError: clientsError } =
    dashboardApi.useGetClientsQuery();
  const authUser = useAppSelector((state) => state.auth.user);
  const currentUser = authUser as any; // Cast to access all properties

  // Handle errors with toast notifications
  useEffect(() => {
    if (plansError) {
      toast.error(
        "Failed to load plans",
        "Unable to fetch your plans. Please try again.",
      );
    }
  }, [plansError, toast]);

  useEffect(() => {
    if (waitingListError) {
      toast.error(
        "Failed to load waiting list",
        "Unable to fetch waiting list data. Please try again.",
      );
    }
  }, [waitingListError, toast]);

  useEffect(() => {
    if (clientsError) {
      toast.error(
        "Failed to load clients",
        "Unable to fetch client data. Please try again.",
      );
    }
  }, [clientsError, toast]);

  const activePlans = plans.filter((p: any) => p.status === "Active").length;
  const pendingPlans = plans.filter((p: any) => p.status === "Pending").length;
  const lapsedPlans = plans.filter((p: any) => p.status === "Lapsed").length;

  // Build stats array with values from selectors
  const clientStats = CLIENT_STATS_CONFIG.map((config) => ({
    ...config,
    value:
      config.title === "Total Plans"
        ? plans.length
        : config.title === "Active Plans"
          ? activePlans
          : pendingPlans + waitingList.length,
  }));

  const salesStats = SALES_STATS_CONFIG.map((config) => ({
    ...config,
    value:
      config.title === "Total Clients"
        ? clientList.length
        : config.title === "Active Plans"
          ? activePlans
          : config.title === "Pending Applications"
            ? waitingList.length
            : plans.length,
  }));

  const stats = userRole === "client" ? clientStats : salesStats;

  return (
    <div className="py-3 sm:py-3 md:py-6 lg:py-10 xl:py-5 space-y-3 sm:space-y-3 md:space-y-3">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-900 rounded-2xl p-6 md:p-8 text-white shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Welcome, {currentUser?.name}! 👋
            </h1>
            <p className="text-blue-50 dark:text-blue-100/80 text-base md:text-lg max-w-2xl">
              {userRole === "client"
                ? "Track and manage your plans in one place"
                : userRole === "sales"
                  ? "Manage your clients and their plans efficiently"
                  : "Comprehensive overview of all system activities"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm bg-blue-600/50 dark:bg-blue-900/50 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="sm:hidden">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
            iconColor={stat.iconColor}
            borderColor={stat.borderColor}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Quick Summary */}
      {userRole === "client" && (
        <Card>
          <CardHeader>
            <CardTitle>Plan Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 dark:bg-green-950/40 dark:border-green-900/50">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Active
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-200 mt-1">
                  {activePlans}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200 dark:bg-red-950/40 dark:border-red-900/50">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                  Lapsed
                </p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-200 mt-1">
                  {lapsedPlans}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 dark:bg-yellow-950/40 dark:border-yellow-900/50">
                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200 mt-1">
                  {pendingPlans}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
