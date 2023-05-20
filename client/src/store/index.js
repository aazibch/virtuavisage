import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth';
import artifactsReducer from './artifacts';
import uiReducer from './ui';

const store = configureStore({
  reducer: { auth: authReducer, artifacts: artifactsReducer, ui: uiReducer }
});

export default store;
