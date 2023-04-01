import { Button, SignupForm } from '../../components';
import styles from './Auth.module.css';
import { google } from '../../assets';
import { urlBase } from '../../constants';

const SignupPage = () => {
  console.log(urlBase);
  return (
    <div className="border rounded-md border-gray-300 max-w-lg mx-auto p-10">
      <h1 className="font-semibold text-2xl mb-5">Signup</h1>
      <SignupForm />
      <div className="mb-5">
        <p className={`${styles.signupMessage} text-gray-500 text-sm mb-5`}>
          Or
        </p>
        <Button
          className="block w-full"
          elementType="link"
          linkProps={{ to: `${urlBase}/v1/users/auth/google` }}
        >
          <div className="flex justify-center items-center">
            <div className="mr-3">
              <img className="w-5" src={google} alt="" />
            </div>
            <div className="text-center flex-1 ml-[-1rem]">
              Signup with Google
            </div>
          </div>
        </Button>
      </div>
      <div>
        <p className={`${styles.signupMessage} text-gray-500 text-sm mb-5`}>
          Already have a VirtuaVisage account?
        </p>
        <Button
          className="block w-full"
          elementType="link"
          linkProps={{ to: '/auth/login' }}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default SignupPage;
