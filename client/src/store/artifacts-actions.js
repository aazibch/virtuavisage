import { artifactsActions } from './artifacts';
import { generateHttpConfig, sendHttpRequest } from '../utils';
import { apiUrl } from '../constants';

const thunkArtifactsActions = {
  fetchPublicArtifacts: () => {
    return async (dispatch) => {
      const requestConfig = generateHttpConfig(
        `${apiUrl}/v1/artifacts/public`,
        'GET'
      );

      const response = await sendHttpRequest(requestConfig, dispatch);
      if (response) {
        dispatch(artifactsActions.replaceArtifacts(response.data.artifacts));
      }
    };
  }
};

export default thunkArtifactsActions;
