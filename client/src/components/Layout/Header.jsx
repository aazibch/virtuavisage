import Button from '../UI/Button';
import { Avatar, DropdownMenu } from '../';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="bg-white border-b-[#e6ebf4]">
      <div className="w-full flex items-center sm:px-8 px-4 py-4 border-bottom max-w-screen-xl mx-auto">
        <NavLink className="inline mr-2" to="/">
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
                  {
                    content: 'Account',
                    link: '/account'
                  },
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
      </div>
    </header>
  );
};

export default Header;
