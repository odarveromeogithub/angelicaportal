import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SystemUser } from '../../interfaces/dashboard.interface';

interface UsersListState {
  users: SystemUser[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: UsersListState = {
  users: [],
  loading: false,
  error: null,
  searchQuery: '',
};

const usersListSlice = createSlice({
  name: 'dashboard_usersList',
  initialState,
  reducers: {
    fetchUsersListRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersListSuccess: (state, action: PayloadAction<SystemUser[]>) => {
      state.users = action.payload;
      state.loading = false;
    },
    fetchUsersListFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const usersListActions = usersListSlice.actions;
export default usersListSlice.reducer;
