import FileSaver from 'file-saver';
import { surpriseMePrompts } from '../constants';

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
