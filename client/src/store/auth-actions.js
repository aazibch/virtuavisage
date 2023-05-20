import { authActions } from './auth';
import { uiActions } from './ui';
import { artifactsActions } from './artifacts';
import { generateHttpConfig, sendHttpRequest } from '../utils';
import { apiUrl } from '../constants';

const thunkAuthActions = {
  fetchUser: () => {
    return async (dispatch) => {
      const requestConfig = generateHttpConfig(
        `${apiUrl}/v1/users/me`,
        'GET',
        true
      );

      const response = await sendHttpRequest(
        requestConfig,
        dispatch,
        authActions.setAuthLoading
      );

      if (response) {
        dispatch(authActions.login(response.data.user));
      }
    };
  },
  fetchCollectedArtifacts: () => {
    return async (dispatch) => {
      const requestConfig = generateHttpConfig(
        `${apiUrl}/v1/artifacts/collection`,
        'GET',
        true
      );

      const response = await sendHttpRequest(requestConfig, dispatch);

      if (response) {
        dispatch(
          authActions.replaceCollectedArtifacts(response.data.artifacts)
        );
      }
    };
  },
  makeArtifactPublic: (id) => {
    return async (dispatch, getState) => {
      const state = getState();

      const requestConfig = generateHttpConfig(
        `${apiUrl}/v1/artifacts/public`,
        'POST',
        true,
        {
          id
        }
      );

      const response = await sendHttpRequest(
        requestConfig,
        dispatch,
        uiActions.setMaximizedArtifactLoading
      );

      if (response) {
        if (state.artifacts.publicArtifacts) {
          dispatch(
            artifactsActions.addToPublicArtifacts(response.data.artifact)
          );
        }
        dispatch(
          authActions.replaceArtifactInCollection(response.data.artifact)
        );
        dispatch(uiActions.setMaximizedArtifact(response.data.artifact));
      }
    };
  },
  removeArtifactFromPublic: (id, dismissModal = false) => {
    return async (dispatch, getState) => {
      const state = getState();

      const requestConfig = generateHttpConfig(
        `${apiUrl}/v1/artifacts/public/${id}`,
        'DELETE',
        true
      );

      const response = await sendHttpRequest(
        requestConfig,
        dispatch,
        uiActions.setMaximizedArtifactLoading
      );

      if (response) {
        let updatedArtifact = state.auth.collectedArtifacts.find(
          (elem) => elem._id === id
        );
        updatedArtifact = { ...updatedArtifact, isPublic: false };

        dispatch(authActions.replaceArtifactInCollection(updatedArtifact));

        if (state.artifacts.publicArtifacts) {
          dispatch(artifactsActions.removeArtifactFromPublic(id));
        }

        if (dismissModal) {
          dispatch(uiActions.setMaximizedArtifact(null));
        } else {
          dispatch(uiActions.setMaximizedArtifact(updatedArtifact));
        }
      }
    };
  },
  deleteArtifact: (id) => {
    return async (dispatch, getState) => {
      const state = getState();

      const requestConfig = generateHttpConfig(
        `${apiUrl}/v1/artifacts/collection/${id}`,
        'DELETE',
        true
      );

      const response = await sendHttpRequest(
        requestConfig,
        dispatch,
        uiActions.setMaximizedArtifactLoading
      );

      if (response) {
        const presentInPublic = state.artifacts.publicArtifacts?.some(
          (item) => item._id === id
        );
        const presentInCollection = state.auth.collectedArtifacts?.some(
          (item) => item._id === id
        );

        if (presentInPublic) {
          dispatch(artifactsActions.removeArtifactFromPublic(id));
        }

        if (presentInCollection) {
          dispatch(authActions.removeArtifactFromCollection(id));
        }

        dispatch(uiActions.setMaximizedArtifact(null));
      }
    };
  }
};

export default thunkAuthActions;
