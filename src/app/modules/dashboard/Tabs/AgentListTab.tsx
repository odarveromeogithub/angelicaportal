import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { Loader2, Users } from 'lucide-react';
import { selectAgents, selectAgentsLoading } from '../../../core/state/selector/dashboard.selector';
import { DashboardHeader, SearchBar, EmptyState } from '../../../core/components/dashboard';
import { Badge } from '../../../core/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../core/components/ui/table';

export function AgentListTab() {
  const agents = useSelector(selectAgents);
  const loading = useSelector(selectAgentsLoading);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return agents;
    const query = searchQuery.toLowerCase();
    return agents.filter(
      (agent: any) =>
        agent.salesCounselorCode.toLowerCase().includes(query) ||
        agent.name.toLowerCase().includes(query) ||
        agent.scStatus.toLowerCase().includes(query)
    );
  }, [agents, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 space-y-6 sm:space-y-7"
    >
      <DashboardHeader
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
      <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm font-semibold">Code</TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold">Name</TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent: any, index: number) => (
                <motion.tr
                  key={agent.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group hover:bg-gray-50/50"
                >
                  <TableCell className="font-medium">{agent.salesCounselorCode}</TableCell>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={agent.scStatus === 'Active' ? 'default' : 'secondary'}
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