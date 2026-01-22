import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Agent } from '../../interfaces/dashboard.interface';

interface AgentListState {
  agents: Agent[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: AgentListState = {
  agents: [],
  loading: false,
  error: null,
  searchQuery: '',
};

const agentListSlice = createSlice({
  name: 'dashboard_agentList',
  initialState,
  reducers: {
    fetchAgentListRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAgentListSuccess: (state, action: PayloadAction<Agent[]>) => {
      state.agents = action.payload;
      state.loading = false;
    },
    fetchAgentListFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const agentListActions = agentListSlice.actions;
export default agentListSlice.reducer;
