import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth';
import artifactsReducer from './artifacts';

const store = configureStore({
  reducer: { auth: authReducer, artifacts: artifactsReducer }
});

export default store;
