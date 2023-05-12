import { createSlice } from '@reduxjs/toolkit';

const initialArtifactsState = {
  artifacts: null,
  loading: true,
  error: null
};

const artifactsSlice = createSlice({
  name: 'artifacts',
  initialState: initialArtifactsState,
  reducers: {
    replaceArtifacts(state, action) {
      state.artifacts = action.payload;
    },
    removeArtifactFromPublic(state, action) {
      state.artifacts = state.artifacts.filter(
        (artifact) => artifact._id !== action.payload
      );
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    }
  }
});

export const artifactsActions = artifactsSlice.actions;
export default artifactsSlice.reducer;
