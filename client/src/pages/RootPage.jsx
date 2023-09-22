import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { uiActions } from '../store/ui';
import { Layout, Loader } from '../components';
import thunkAuthActions from '../store/auth-actions';

const RootPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(thunkAuthActions.fetchUser());
  }, []);

  useEffect(() => {
    dispatch(uiActions.setError(null));
    dispatch(uiActions.setMaximizedArtifact(null));
  }, [pathname]);

  let content;

  if (loading) {
    content = (
      <div className="flex justify-center items-center mt-14">
        <Loader />
      </div>
    );
  } else {
    content = (
      <Layout>
        <Outlet />
      </Layout>
    );
  }

  return content;
};

export default RootPage;
