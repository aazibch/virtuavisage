import FileSaver from 'file-saver';
import { surpriseMePrompts } from '../constants';
import { artifactsActions } from '../store/artifacts';

export const getRandomPrompt = (prompt) => {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  // Check if the randomPrompt is the same as the current prompt.
  // If so, get a new one.
  if (randomPrompt === prompt) return getRandomPrompt(prompt);

  return randomPrompt;
};

export const downloadImage = async (_id, artifactUrl) => {
  FileSaver.saveAs(artifactUrl, `download-${_id}.png`);
};

export const generateHttpConfig = (url, method, allowCredentials, body) => {
  return {
    url,
    method,
    withCredentials: allowCredentials,
    credentials: allowCredentials ? 'include' : undefined,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: body ? body : undefined
  };
};

export const sendHttpRequest = async (requestConfig, dispatch) => {
  try {
    dispatch(artifactsActions.setLoading(true));

    let response = await fetch(requestConfig.url, {
      method: requestConfig.method ? requestConfig.method : 'GET',
      withCredentials: requestConfig.withCredentials,
      credentials: requestConfig.credentials,
      headers: requestConfig.headers ? requestConfig.headers : {},
      body: requestConfig.body ? JSON.stringify(requestConfig.body) : null
    });

    if (!response.ok) {
      const res = await response.json();
      // Handling JSON error response
      dispatch(artifactsActions.setLoading(false));
      return dispatch(artifactsActions.setError(res.message));
    }

    if (requestConfig.method !== 'DELETE') {
      response = await response.json();
    } else {
      response = 'deleted';
    }

    dispatch(artifactsActions.setLoading(false));
    return response;
  } catch (error) {
    console.log('[sendHttpRequest] error', error);
    dispatch(artifactsActions.setError('Something went wrong!'));
  }
};
