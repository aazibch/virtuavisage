import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import {
  RootPage,
  HomePage,
  ErrorPage,
  CreatePage,
  LoginPage,
  SignupPage,
  AccountPage,
  LogoutPage,
  NotFoundPage,
  CollectionPage,
  PostOAuth
} from './pages';
import { checkAuthLoader } from './utils';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: '/auth/login',
        element: <LoginPage />
      },
      {
        path: '/auth/signup',
        element: <SignupPage />
      },
      {
        path: '/oauth/post',
        element: <PostOAuth />
      },
      {
        path: '/collection',
        element: <CollectionPage />,
        loader: checkAuthLoader
      },
      {
        path: '/create',
        element: <CreatePage />,
        loader: checkAuthLoader
      },
      {
        path: '/account',
        element: <AccountPage />,
        loader: checkAuthLoader
      },
      {
        path: '/auth/logout',
        element: <LogoutPage />,
        loader: checkAuthLoader
      }
    ]
  }
]);

const App = () => {
  let content = <RouterProvider router={router} />;

  return content;
};

export default App;
