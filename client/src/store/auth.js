import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  loading: false,
  user: null,
  artifact: null,
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
    setCollectedArtifacts(state, action) {
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
    addArtifactToCollection(state, action) {
      state.collectedArtifacts.unshift(action.payload);
    },
    removeArtifactFromCollection(state, action) {
      const updatedCollectedArtifacts = state.collectedArtifacts.filter(
        (artifact) => artifact._id !== action.payload
      );

      if (updatedCollectedArtifacts.length === 0) {
        state.collectedArtifacts = null;
      } else {
        state.collectedArtifacts = updatedCollectedArtifacts;
      }
    },
    setArtifact(state, action) {
      state.artifact = action.payload;
    }
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
