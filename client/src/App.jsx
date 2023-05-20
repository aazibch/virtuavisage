import React, { useEffect } from 'react';
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

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    dispatch(uiActions.setError(null));
    dispatch(uiActions.setMaximizedArtifact(null));
  }, [pathname]);

  useEffect(() => {
    dispatch(thunkAuthActions.fetchUser());
  }, []);

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

  return content;
};

export default App;
