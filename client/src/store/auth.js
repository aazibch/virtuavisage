import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    }
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
