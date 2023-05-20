import { createSlice } from '@reduxjs/toolkit';

const initialUiState = {
  loading: false,
  maximizedArtifactLoading: null,
  error: null,
  maximizedArtifact: null,
  showDeletetionModal: false
};

const uiSlice = createSlice({
  name: 'auth',
  initialState: initialUiState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setMaximizedArtifactLoading(state, action) {
      state.loading = action.payload;
    },
    setMaximizedArtifact(state, action) {
      state.maximizedArtifact = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    dismissError(state, action) {
      state.error = null;
    },
    setShowDeletionModal(state, action) {
      state.showDeletionModal = action.payload;
    }
  }
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
