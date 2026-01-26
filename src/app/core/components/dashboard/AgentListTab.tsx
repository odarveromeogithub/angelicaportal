import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { Loader2, Users } from "lucide-react";
import { dashboardApi } from "../../state/api";
import type { Agent } from "../../interfaces/dashboard.interface";
import { TabsHeader } from "./TabsHeader";
import { SearchBar } from "./SearchBar";
import { EmptyState } from "./EmptyState";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useToast } from "../../hooks/useToast";

export function AgentListTab() {
  const toast = useToast();
  const {
    data: agents = [],
    isLoading: loading,
    isError,
  } = dashboardApi.useGetAgentsQuery();
  const [searchQuery, setSearchQuery] = useState("");

  // Show error toast when data fetch fails
  useEffect(() => {
    if (isError) {
      toast.error(
        "Failed to load agents",
        "Unable to fetch agent list. Please try again later.",
      );
    }
  }, [isError, toast]);

  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return agents;
    const query = searchQuery.toLowerCase();
    return (agents as Agent[]).filter(
      (agent: Agent) =>
        agent.salesCounselorCode.toLowerCase().includes(query) ||
        agent.name.toLowerCase().includes(query) ||
        agent.scStatus.toLowerCase().includes(query),
    );
  }, [agents, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-300" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 space-y-6 sm:space-y-7"
    >
      <TabsHeader
        title="Agent List"
        description="Manage sales counselor agents"
        count={filteredAgents.length}
        countLabel="Agents"
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by code, name, or status..."
      />

      {/* Agent List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl md:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-slate-50 dark:bg-slate-800 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-slate-800">
              <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800">
                <TableHead className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Code
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Name
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent: any, index: number) => (
                <motion.tr
                  key={agent.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <TableCell className="font-medium">
                    {agent.salesCounselorCode}
                  </TableCell>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        agent.scStatus === "Active" ? "default" : "secondary"
                      }
                      className="font-semibold"
                    >
                      {agent.scStatus}
                    </Badge>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAgents.length === 0 && (
          <EmptyState
            icon={Users}
            title="No agents found"
            description="Try adjusting your search"
          />
        )}
      </div>
    </motion.div>
  );
}
