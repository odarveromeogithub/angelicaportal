import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ClientPlan } from '../../../interfaces/dashboard.interface';

interface ClientListState {
  items: ClientPlan[];
  filteredItems: ClientPlan[];
  searchQuery: string;
  statusFilter: string;
  loading: boolean;
}

const initialState: ClientListState = {
  items: [],
  filteredItems: [],
  searchQuery: '',
  statusFilter: 'all',
  loading: false,
};

const clientListSlice = createSlice({
  name: 'dashboard_clientList',
  initialState,
  reducers: {
    fetchClientListRequest: (state) => {
      state.loading = true;
    },
    fetchClientListSuccess: (state, action: PayloadAction<ClientPlan[]>) => {
      state.items = action.payload;
      state.filteredItems = action.payload;
      state.loading = false;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredItems = state.items.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(action.payload.toLowerCase()) ||
          item.lpafNo.toLowerCase().includes(action.payload.toLowerCase()) ||
          item.policyNo.toLowerCase().includes(action.payload.toLowerCase());
        const matchesStatus =
          state.statusFilter === 'all' || item.status === state.statusFilter;
        return matchesSearch && matchesStatus;
      });
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.filteredItems = state.items.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          item.lpafNo.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          item.policyNo.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchesStatus =
          action.payload === 'all' || item.status === action.payload;
        return matchesSearch && matchesStatus;
      });
    },
  },
});

export const clientListActions = clientListSlice.actions;
export default clientListSlice.reducer;
