import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PostOAuth = () => {
  const searchParams = useSearchParams()[0];

  useEffect(() => {
    const url = `/?auth_status="${searchParams.get('status')}"`;

    window.opener.open(url, '_self');
    window.opener.focus();
    window.close();
  }, []);

  return <></>;
};

export default PostOAuth;
