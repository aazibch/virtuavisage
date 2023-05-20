import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  loading: false,
  user: null,
  collectedArtifacts: null
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
    },
    setAuthLoading(state, action) {
      state.loading = action.payload;
    },
    replaceCollectedArtifacts(state, action) {
      state.collectedArtifacts = action.payload;
    },
    replaceArtifactInCollection(state, action) {
      state.collectedArtifacts = state.collectedArtifacts.map((elem) => {
        if (elem._id === action.payload._id) {
          return action.payload;
        }

        return elem;
      });
    },
    removeArtifactFromCollection(state, action) {
      state.collectedArtifacts = state.collectedArtifacts.filter(
        (artifact) => artifact._id !== action.payload
      );
    }
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
