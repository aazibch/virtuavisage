import Button from '../UI/Button';
import { Avatar, DropdownMenu } from '../';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const user = useSelector((state) => state.user);

  return (
    <header className="w-full flex items-center bg-white sm:px-8 px-4 py-4 border-bottom border-b-[#e6ebf4]">
      <NavLink className="inline mr-5" to="/">
        <h1 className="font-semibold">VirtuaVisage</h1>
      </NavLink>
      {user && (
        <ul>
          <li>
            <NavLink
              className={({ isActive }) =>
                `hover:text-gray-700 ${
                  isActive ? 'text-gray-700' : 'text-gray-500'
                }`
              }
              to="/collection"
            >
              Collection
            </NavLink>
          </li>
        </ul>
      )}

      <div className="ml-auto flex items-center">
        {user ? (
          <>
            <Button
              className="mr-4"
              elementType="link"
              styleType="primary"
              linkProps={{ to: '/create' }}
            >
              Create
            </Button>
            <DropdownMenu
              buttonContent={<Avatar content={user.name[0]} />}
              items={[
                { content: 'Account', link: '/account' },
                { content: 'Logout', link: '/auth/logout' }
              ]}
            />
          </>
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
