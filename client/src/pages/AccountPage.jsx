import { useSelector } from 'react-redux';
import { Avatar, Button } from '../components';

const AccountPage = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="text-center w-[20rem] mx-auto mt-14">
      <div className="mb-10">
        <Avatar className="mb-5 mx-auto" size="large" content={user.name[0]} />
        <h2 className="font-medium mb-1">{user.name}</h2>
        <p className="text-sm text-gray-600">Human</p>
      </div>

      <div className="text-gray-800 text-sm mb-10">
        <p className="mb-1">
          <span className="font-medium">Member Since:</span>{' '}
          {new Date(user.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p>
          <span className="font-medium">Artifacts Generated:</span>{' '}
          {user.artifactsGenerated}
        </p>
      </div>
      <Button elementType="link" linkProps={{ to: '/auth/logout' }}>
        Logout
      </Button>
    </div>
  );
};

export default AccountPage;
