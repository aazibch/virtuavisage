import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigation } from 'react-router-dom';
import { apiUrl } from '../constants';
import { useHttp } from '../hooks';
import { Layout, Loader } from '../components';

const RootPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { sendRequest } = useHttp();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loadingState = isLoading || navigation.state === 'loading';

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

  return (
    <Layout>
      {loadingState ? (
        <div className="flex justify-center items-center mt-14">
          <Loader />
        </div>
      ) : (
        <Outlet />
      )}
    </Layout>
  );
};

export default RootPage;
