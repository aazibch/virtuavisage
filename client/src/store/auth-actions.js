import { authActions } from './auth';
import { uiActions } from './ui';
import { artifactsActions } from './artifacts';
import { generateHttpConfig, sendHttpRequest } from '../utils';
import { apiUrl } from '../constants';

const thunkAuthActions = {
  login: (values, callback) => {
    return async (dispatch) => {
      const requestConfig = generateHttpConfig(
        `${apiUrl}/v1/users/auth/login`,
        'POST',
        true,
        values
      );

      const response = await sendHttpRequest(requestConfig, dispatch);

      if (response) {
        if (callback) {
          callback();
        }
        dispatch(authActions.login(response.data.user));
      }
    };
  },
  signup: (values, callback) => {
    return async (dispatch) => {
      const requestConfig = generateHttpConfig(
        `${apiUrl}/v1/users/auth/signup`,
        'POST',
        true,
        values
      );

      const response = await sendHttpRequest(requestConfig, dispatch);

      if (response) {
        if (callback) {
          callback();
        }
        dispatch(authActions.login(response.data.user));
      }
    };
  },
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
        dispatch(authActions.setCollectedArtifacts(response.data.artifacts));
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
        dispatch(
          authActions.replaceArtifactInCollection(response.data.artifact)
        );
        dispatch(uiActions.setMaximizedArtifact(response.data.artifact));
        dispatch(artifactsActions.addArtifactToPublic(response.data.artifact));
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
  deleteArtifact: (id, callback) => {
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

        dispatch(uiActions.setMaximizedArtifact(null));

        if (presentInPublic) {
          dispatch(artifactsActions.removeArtifactFromPublic(id));
        }

        if (presentInCollection) {
          dispatch(authActions.removeArtifactFromCollection(id));
        }

        if (callback) {
          callback();
        }
      }
    };
  },
  generateArtifact: (values) => {
    return async (dispatch) => {
      const requestConfig = generateHttpConfig(
        `${apiUrl}/v1/artifacts`,
        'POST',
        true,
        values
      );

      const response = await sendHttpRequest(requestConfig, dispatch);

      if (response) {
        dispatch(
          authActions.setArtifact({
            image: `data:image/png;base64,${response.data.artifact}`,
            prompt: response.data.prompt
          })
        );
      }
    };
  },
  saveArtifactToCollection: (callback) => {
    return async (dispatch, getState) => {
      const state = getState();

      const requestConfig = generateHttpConfig(
        `${apiUrl}/v1/artifacts/collection`,
        'POST',
        true,
        {
          prompt: state.auth.artifact.prompt,
          artifact: state.auth.artifact.image
        }
      );

      const response = await sendHttpRequest(requestConfig, dispatch);

      if (response) {
        if (state.auth.collectedArtifacts) {
          dispatch(authActions.addArtifactToCollection(response.data.artifact));
        }
        if (callback) {
          callback();
        }
      }
    };
  }
};

export default thunkAuthActions;
