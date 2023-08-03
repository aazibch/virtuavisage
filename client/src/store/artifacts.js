import { createSlice } from '@reduxjs/toolkit';

const initialArtifactsState = {
  publicArtifacts: null
};

const artifactsSlice = createSlice({
  name: 'artifacts',
  initialState: initialArtifactsState,
  reducers: {
    setArtifacts(state, action) {
      state.publicArtifacts = action.payload;
    },
    removeArtifactFromPublic(state, action) {
      const updatedPublicArtifacts = state.publicArtifacts.filter(
        (artifact) => artifact._id !== action.payload
      );

      if (updatedPublicArtifacts.length === 0) {
        state.publicArtifacts = null;
      } else {
        state.publicArtifacts = updatedPublicArtifacts;
      }
    },
    addArtifactToPublic(state, action) {
      state.publicArtifacts.unshift(action.payload);
    }
  }
});

export const artifactsActions = artifactsSlice.actions;
export default artifactsSlice.reducer;
