import React, { useEffect } from 'react';

import {
  Home,
  CreatePage,
  LoginPage,
  SignupPage,
  AccountPage,
  LogoutPage
} from './pages';
import { Route, Routes } from 'react-router-dom';
import { Layout, Loader, Modal } from './components';
import { useHttp } from './hooks';
import { apiUrl } from './constants';
import { useDispatch } from 'react-redux';
import { authActions } from './store/auth';

const App = () => {
  const { isLoading, sendRequest } = useHttp();
  const dispatch = useDispatch();

  useEffect(() => {
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
      };

      sendRequest(requestConfig, handleResponse);
    };

    getUser();
  }, []);

  let content = (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/logout" element={<LogoutPage />} />
        <Route path="/create-post" element={<CreatePage />} />
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
