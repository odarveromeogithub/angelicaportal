import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DashboardUser } from '../../interfaces/dashboard.interface';

interface DashboardUserState {
  currentUser: DashboardUser | null;
  isAuthenticated: boolean;
}

const initialState: DashboardUserState = {
  currentUser: null,
  isAuthenticated: false
};

const dashboardUserSlice = createSlice({
  name: 'dashboard_user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<DashboardUser>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    }
  }
});

export const dashboardUserActions = dashboardUserSlice.actions;
export default dashboardUserSlice.reducer;
