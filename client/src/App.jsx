import React, { useEffect, useState } from 'react';

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
import { Route, Routes } from 'react-router-dom';
import { Layout, Loader } from './components';
import { useHttp } from './hooks';
import { apiUrl } from './constants';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './store/auth';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { sendRequest } = useHttp();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    const getUser = () => {
      const requestConfig = {
        url: `${apiUrl}/v1/users/me`,
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      };
      const handleResponse = (response) => {
        if (response.data.user) {
          dispatch(authActions.login(response.data.user));
        }
        setIsLoading(false);
      };

      const handleError = (error) => {
        setIsLoading(false);
      };

      sendRequest(requestConfig, handleResponse, handleError);
    };

    getUser();
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

  if (isLoading) {
    content = (
      <div className="flex justify-center items-center mt-14">
        <Loader />
      </div>
    );
  }

  return content;
};

export default App;
