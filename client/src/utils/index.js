import FileSaver from 'file-saver';
import { surpriseMePrompts } from '../constants';
import { uiActions } from '../store/ui';
import store from '../store';

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

export const sendHttpRequest = async (
  requestConfig,
  dispatch,
  loadingAction = uiActions.setLoading,
  errorHandler
) => {
  try {
    dispatch(loadingAction(true));

    let response = await fetch(requestConfig.url, {
      method: requestConfig.method ? requestConfig.method : 'GET',
      withCredentials: requestConfig.withCredentials,
      credentials: requestConfig.credentials,
      headers: requestConfig.headers ? requestConfig.headers : {},
      body: requestConfig.body ? JSON.stringify(requestConfig.body) : null
    });

    if (!response.ok) {
      const res = await response.json();
      dispatch(loadingAction(false));

      if (errorHandler) {
        errorHandler();
      }

      // Handling JSON error response
      dispatch(uiActions.setError(res.message));
      return;
    }

    if (requestConfig.method !== 'DELETE') {
      response = await response.json();
    } else {
      response = 'deleted';
    }

    dispatch(loadingAction(false));
    return response;
  } catch (error) {
    dispatch(uiActions.setError('Something went wrong!'));
  }
};

export function checkAuthLoader() {
  console.log(store.getState());

  const {
    auth: { user }
  } = store.getState();

  console.log('[checkAuthLoader]', user);

  if (!user) {
    throw json({ message: 'Page not found.' }, { status: 404 });
  }

  return null;
}
