import { useEffect } from 'react';
import { useHttp } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../constants';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';
import { Loader } from '../../components';

const LogoutPage = () => {
  const { error, sendRequest } = useHttp();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const logout = async () => {
      await sendRequest(
        {
          url: `${apiUrl}/v1/users/auth/logout`,
          method: 'GET',
          withCredentials: true,
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        },
        () => {
          navigate('/');
          dispatch(authActions.logout());
        }
      );

      navigate('/');
    };

    logout();
  }, []);

  return (
    <div className="flex justify-center items-center mt-14">
      <Loader />
    </div>
  );
};

export default LogoutPage;
