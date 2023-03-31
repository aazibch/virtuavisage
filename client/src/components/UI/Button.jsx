import { Link } from 'react-router-dom';

const Button = ({ children, onClick, elementType, styleType, linkProps }) => {
  let textClass = 'text-gray-500';
  let bgClass = 'bg-[#ececf1]';

  if (styleType === 'primary') {
    textClass = 'text-white';
    bgClass = 'bg-[#6469ff]';
  }

  let element = (
    <button
      onClick={onClick}
      className={`${bgClass} ${textClass} font-inter font-medium px-4 py-2 rounded-md`}
    >
      {children}
    </button>
  );

  if (elementType === 'link') {
    element = (
      <Link
        {...linkProps}
        className={`${bgClass} ${textClass} font-inter font-medium px-4 py-2 rounded-md`}
      >
        {children}
      </Link>
    );
  }

  return element;
};

export default Button;
