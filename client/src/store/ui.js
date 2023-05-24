import { createSlice } from '@reduxjs/toolkit';

const initialUiState = {
  loading: false,
  maximizedArtifactLoading: null,
  error: null,
  maximizedArtifact: null,
  showDeletetionModal: false,
  sampleData: [
    {
      name: 1,
      url: 'https://res.cloudinary.com/aazibch/image/upload/v1678959999/undraw_Male_avatar_g98d_jo0kfm.png'
    },
    {
      name: 2,
      url: 'https://res.cloudinary.com/aazibch/image/upload/v1632564002/Project%20Files/Markdown%20Previewer/tesla-logo.png'
    },
    {
      name: 3,
      url: 'https://res.cloudinary.com/aazibch/image/upload/v1629498025/Screenshots/Vertigo_Wristwatch.png'
    }
  ]
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
    setShowDeletionModal(state, action) {
      state.showDeletionModal = action.payload;
    },
    removeItemFromSampleData(state, action) {
      console.log(action.payload);
      state.sampleData = state.sampleData.filter(
        (item) => item.name !== action.payload
      );
    }
  }
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
