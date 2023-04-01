import { Link } from 'react-router-dom';
import Button from '../UI/Button';

const Header = () => {
  return (
    <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-bottom border-b-[#e6ebf4]">
      <Link to="/">
        <h1 className="font-semibold">VirtuaVisage</h1>
      </Link>
      <div>
        <Button
          elementType="link"
          styleType="primary"
          linkProps={{ to: '/auth/login' }}
        >
          Login
        </Button>
      </div>
    </header>
  );
};

export default Header;
