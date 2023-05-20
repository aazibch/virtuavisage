import { createSlice } from '@reduxjs/toolkit';

const initialArtifactsState = {
  publicArtifacts: null
};

const artifactsSlice = createSlice({
  name: 'artifacts',
  initialState: initialArtifactsState,
  reducers: {
    replaceArtifacts(state, action) {
      state.publicArtifacts = action.payload;
    },
    clearArtifacts(state) {
      state.publicArtifacts = null;
    },
    removeArtifactFromPublic(state, action) {
      state.publicArtifacts = state.publicArtifacts.filter(
        (artifact) => artifact._id !== action.payload
      );
    },
    addToPublicArtifacts(state, action) {
      state.publicArtifacts.push(action.payload);
    }
  }
});

export const artifactsActions = artifactsSlice.actions;
export default artifactsSlice.reducer;
