import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  let message = 'Something went wrong.';

  if (error.status === 404) {
    message = error.message ? error.message : message;
  }

  return (
    <>
      <p>{message}</p>
    </>
  );
};

export default ErrorPage;
