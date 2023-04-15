import { useEffect } from 'react';

const GoogleSuccess = () => {
  useEffect(() => {
    const url = '/private';
    window.opener.open(url, '_self');
    window.opener.focus();
    window.close();
  }, []);

  return <div>GoogleSuccess</div>;
};

export default GoogleSuccess;
