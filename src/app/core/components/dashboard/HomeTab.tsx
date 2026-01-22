import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { FileText, Users, Clock, TrendingUp, Calendar } from 'lucide-react';
import type { RootState } from '../../state/store';
import { selectDashboardUser } from '../../state/selector/auth.selector';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface HomeTabProps {
  userRole: 'client' | 'sales' | 'admin';
}

export function HomeTab({ userRole }: HomeTabProps) {
  const plans = useSelector((state: RootState) => state.dashboard_plans.plans);
  const waitingList = useSelector((state: RootState) => state.dashboard_waitingList.items);
  const clientList = useSelector((state: RootState) => state.dashboard_clientList.items);
  const currentUser = useSelector(selectDashboardUser);

  const activePlans = plans.filter((p: any) => p.status === 'Active').length;
  const pendingPlans = plans.filter((p: any) => p.status === 'Pending').length;
  const lapsedPlans = plans.filter((p: any) => p.status === 'Lapsed').length;

  const clientStats = [
    {
      title: 'Total Plans',
      value: plans.length,
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Active Plans',
      value: activePlans,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-100',
    },
    {
      title: 'Pending Plans',
      value: pendingPlans + waitingList.length,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-100',
    },
  ];

  const salesStats = [
    {
      title: 'Total Clients',
      value: clientList.length,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Active Plans',
      value: activePlans,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-100',
    },
    {
      title: 'Pending Applications',
      value: waitingList.length,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-100',
    },
    {
      title: 'Total Plans',
      value: plans.length,
      icon: FileText,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-100',
    },
  ];

  const stats = userRole === 'client' ? clientStats : salesStats;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 space-y-6 sm:space-y-7 md:space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Welcome, {currentUser?.name}! 👋
            </h1>
            <p className="text-blue-50 text-base md:text-lg max-w-2xl">
              {userRole === 'client'
                ? 'Track and manage your plans in one place'
                : userRole === 'sales'
                ? 'Manage your clients and their plans efficiently'
                : 'Comprehensive overview of all system activities'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm bg-blue-600/50 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="sm:hidden">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border ${stat.borderColor} hover:shadow-lg transition-all duration-300 h-full`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1.5">
                  {stat.value === 1 ? stat.title.slice(0, -1) : stat.title}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Summary */}
      {userRole === 'client' && (
        <Card>
          <CardHeader>
            <CardTitle>Plan Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">Active</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{activePlans}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700 font-medium">Lapsed</p>
                <p className="text-2xl font-bold text-red-900 mt-1">{lapsedPlans}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-700 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{pendingPlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
