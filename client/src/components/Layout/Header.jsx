import Button from '../UI/Button';
import { Avatar, DropdownMenu } from '../';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const user = useSelector((state) => state.user);

  return (
    <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-bottom border-b-[#e6ebf4]">
      <Link to="/">
        <h1 className="font-semibold">VirtuaVisage</h1>
      </Link>
      <div>
        {user ? (
          <DropdownMenu
            buttonContent={<Avatar content={user.name[0]} />}
            items={[
              { content: 'Account', link: '/account' },
              { content: 'Logout', link: '/auth/logout' }
            ]}
          />
        ) : (
          <Button
            elementType="link"
            styleType="primary"
            linkProps={{ to: '/auth/login' }}
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
