import React from 'react';

import { Home, CreatePage, LoginPage, SignupPage } from './pages';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/index';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/create-post" element={<CreatePage />} />
      </Routes>
    </Layout>
  );
};

export default App;
