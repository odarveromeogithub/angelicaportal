import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { Search, Loader2, Users } from 'lucide-react';
import type { RootState } from '../../state/store';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export function AgentListTab() {
  const { agents, loading } = useSelector((state: RootState) => state.dashboard_agentList);
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
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Agent List</h2>
        <div className="flex items-center gap-2 mt-2 sm:mt-3">
          <p className="text-xs sm:text-sm text-gray-500">Manage sales counselor agents</p>
          <Badge variant="secondary" className="font-normal text-xs sm:text-sm">
            {filteredAgents.length} {filteredAgents.length === 1 ? 'Agent' : 'Agents'}
          </Badge>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by code, name, or status..."
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            className="pl-9 sm:pl-10 md:pl-11 h-10 sm:h-11 text-xs sm:text-sm border-gray-200 focus:border-blue-300 focus:ring-blue-200 focus-visible:ring-2"
          />
        </div>
      </div>

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
          <div className="text-center py-20 text-gray-500 text-sm md:text-base">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium">No agents found</p>
            <p className="text-xs mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
