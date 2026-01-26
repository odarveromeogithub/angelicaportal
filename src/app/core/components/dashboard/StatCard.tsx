import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  bgColor?: string;
  iconColor?: string;
  borderColor?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  bgColor = "bg-blue-50",
  iconColor = "text-blue-600",
  borderColor = "border-blue-100",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card
        className={`${borderColor} border-2 hover:shadow-lg transition-shadow`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {title}
          </CardTitle>
          <div className={`${bgColor} p-2 rounded-lg`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
