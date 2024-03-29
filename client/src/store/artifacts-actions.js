import { artifactsActions } from './artifacts';
import { generateHttpConfig, sendHttpRequest } from '../utils';
import { apiUrl } from '../constants';
import { uiActions } from './ui';

const thunkArtifactsActions = {
  fetchPublicArtifacts: () => {
    return async (dispatch) => {
      const requestConfig = generateHttpConfig(
        `${apiUrl}/v1/artifacts/public`,
        'GET'
      );

      const response = await sendHttpRequest(requestConfig, dispatch);

      if (response) {
        dispatch(artifactsActions.setArtifacts(response.data.artifacts));
      }
    };
  }
};

export default thunkArtifactsActions;
