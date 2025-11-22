import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import authStorage from '@/api/config/storage';

interface UserState {
  user: any | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      // Store in localStorage
      if (action.payload) {
        authStorage.storeUser(action.payload);
      }
    },
    login: (state, action: PayloadAction<{ userDetails: any; jwtToken: string }>) => {
      const userData = {
        ...action.payload.userDetails,
        JWT_Token: action.payload.jwtToken,
      };
      state.user = userData;
      state.isAuthenticated = true;
      authStorage.storeUser(userData);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      authStorage.deleteUser();
    },
  },
});

export const { setUser, login, logout } = authSlice.actions;
export default authSlice.reducer;

