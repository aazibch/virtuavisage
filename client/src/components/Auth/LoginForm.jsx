import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../../store/auth';
import { Input, Button, Loader } from '../index';
import { useHttp } from '../../hooks';
import { apiUrl } from '../../constants';
import Modal from '../UI/Modal/Modal';
import { generateHttpConfig } from '../../utils';

const validationSchema = yup.object({
  email: yup
    .string('Please provide a valid email address.')
    .email('Please provide a valid email address.')
    .max(
      50,
      'The email address should be the maxiumum length of 50 characters.'
    )
    .min(5, 'The email address should be the minimum length of 5 characters.')
    .required('Please provide an email address.'),
  password: yup
    .string('Please provide a valid password.')
    .min(8, 'The password should be a minimum length of 8 characters.')
    .required('Please provide a password.')
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, dismissErrorHandler } = useHttp();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      sendData(values);
      formik.resetForm();
    }
  });

  const sendData = (values) => {
    const requestConfig = generateHttpConfig(
      `${apiUrl}/v1/users/auth/login`,
      'POST',
      true,
      values
    );

    const handleResponse = (response) => {
      dispatch(authActions.login(response.data.user));
      navigate('/');
    };

    sendRequest(requestConfig, handleResponse);
  };

  let content = (
    <form className="mb-5" onSubmit={formik.handleSubmit}>
      <Input
        error={formik.touched.email && formik.errors.email}
        label="Email"
        input={{
          id: 'email',
          type: 'email',
          value: formik.values.email,
          onChange: formik.handleChange
        }}
      />
      <Input
        className="mb-5"
        error={formik.touched.password && formik.errors.password}
        label="Password"
        input={{
          id: 'password',
          type: 'password',
          value: formik.values.password,
          onChange: formik.handleChange
        }}
      />
      <Button type="submit" styleType="primary">
        Login
      </Button>
    </form>
  );

  if (isLoading) {
    content = (
      <div className="flex justify-center items-center my-20">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {error && (
        <Modal
          heading="Error"
          content={error}
          dismissModalHandler={dismissErrorHandler}
        />
      )}
      {content}
    </>
  );
};

export default LoginForm;
