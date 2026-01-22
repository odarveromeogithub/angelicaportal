/**
 * Dashboard Statistics Configuration
 * Centralized stat card configurations for different user roles
 */

import type { LucideIcon } from 'lucide-react';
import { FileText, Users, Clock, TrendingUp } from 'lucide-react';

export interface StatConfig {
  title: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'purple';
  bgColor: string;
  iconColor: string;
  borderColor: string;
}

/**
 * Base stat configuration templates (without values)
 * Values are computed at runtime from Redux selectors
 */
export const STAT_CONFIG_TEMPLATES = {
  totalPlans: {
    title: 'Total Plans',
    icon: FileText,
    color: 'blue' as const,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-100',
  },
  activePlans: {
    title: 'Active Plans',
    icon: TrendingUp,
    color: 'green' as const,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    borderColor: 'border-green-100',
  },
  pendingPlans: {
    title: 'Pending Plans',
    icon: Clock,
    color: 'yellow' as const,
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    borderColor: 'border-yellow-100',
  },
  pendingApplications: {
    title: 'Pending Applications',
    icon: Clock,
    color: 'yellow' as const,
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    borderColor: 'border-yellow-100',
  },
  totalClients: {
    title: 'Total Clients',
    icon: Users,
    color: 'blue' as const,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-100',
  },
  totalPlansAlt: {
    title: 'Total Plans',
    icon: FileText,
    color: 'purple' as const,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-100',
  },
} as const;

/**
 * Client role stats configuration
 * Shows: Total Plans, Active Plans, Pending Plans
 */
export const CLIENT_STATS_CONFIG = [
  STAT_CONFIG_TEMPLATES.totalPlans,
  STAT_CONFIG_TEMPLATES.activePlans,
  STAT_CONFIG_TEMPLATES.pendingPlans,
] as const;

/**
 * Sales/Admin role stats configuration
 * Shows: Total Clients, Active Plans, Pending Applications, Total Plans
 */
export const SALES_STATS_CONFIG = [
  STAT_CONFIG_TEMPLATES.totalClients,
  STAT_CONFIG_TEMPLATES.activePlans,
  STAT_CONFIG_TEMPLATES.pendingApplications,
  STAT_CONFIG_TEMPLATES.totalPlansAlt,
] as const;
