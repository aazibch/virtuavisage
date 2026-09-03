import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import thunkArtifactsActions from './store/artifacts-actions';

import {
  Home,
  CreatePage,
  LoginPage,
  SignupPage,
  AccountPage,
  LogoutPage,
  NotFoundPage,
  CollectionPage,
  PostOAuth
} from './pages';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Layout, Loader } from './components';
import thunkAuthActions from './store/auth-actions';
import { uiActions } from './store/ui';
import { apiUrl } from './constants';
import { useHttp } from './hooks';

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const [statusLoading, setStatusLoading] = useState(true);
  const dispatch = useDispatch();
  const { sendRequest } = useHttp();
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    dispatch(uiActions.setError(null));
    dispatch(uiActions.setMaximizedArtifact(null));
  }, [pathname]);

  useEffect(() => {
    dispatch(thunkAuthActions.fetchUser());
  }, []);

  useEffect(() => {
    sendRequest(
      {
        url: `${apiUrl}/api/v1/status`,
        method: 'GET',
        withCredentials: false
      },
      () => setStatusLoading(false),
      () => setStatusLoading(false)
    );
  }, [sendRequest]);

  const authenticatedUserRoutes = (
    <>
      <Route path="/auth/logout" element={<LogoutPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/collection" element={<CollectionPage />} />
    </>
  );

  let content = (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        {user && authenticatedUserRoutes}
        <Route path="/oauth/post" element={<PostOAuth />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );

  if (loading) {
    content = (
      <div className="flex justify-center items-center mt-14">
        <Loader />
      </div>
    );
  }

  if (statusLoading) {
    content = (
      <div className="mt-14">
        <Loader className="text-center" />
        <p className="text-center mt-10">
          Waking up the server...This might take 50 seconds or more.
        </p>
      </div>
    );
  }

  return content;
};

export default App;
