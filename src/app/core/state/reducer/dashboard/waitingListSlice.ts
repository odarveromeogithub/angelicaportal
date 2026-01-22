import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { WaitingListItem } from '../../interfaces/dashboard.interface';

interface WaitingListState {
  items: WaitingListItem[];
  filteredItems: WaitingListItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: WaitingListState = {
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
  searchQuery: ''
};

const waitingListSlice = createSlice({
  name: 'dashboard_waitingList',
  initialState,
  reducers: {
    fetchWaitingListRequest: (state) => {
      state.loading = true;
    },
    setWaitingList: (state, action: PayloadAction<WaitingListItem[]>) => {
      state.items = action.payload;
      state.filteredItems = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredItems = state.items.filter(item =>
        item.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        item.lpafNo.toLowerCase().includes(action.payload.toLowerCase())
      );
    }
  }
});

export const waitingListActions = waitingListSlice.actions;
export default waitingListSlice.reducer;
