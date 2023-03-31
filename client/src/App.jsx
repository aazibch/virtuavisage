import React from 'react';

import { Home, CreatePost } from './pages';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </Layout>
  );
};

export default App;
