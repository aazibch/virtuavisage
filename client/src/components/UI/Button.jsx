import { Link } from 'react-router-dom';

const Button = ({
  children,
  onClick,
  className,
  type,
  elementType,
  styleType,
  linkProps
}) => {
  let textClass = 'text-gray-500';
  let bgClass = 'bg-[#ececf1]';

  if (styleType === 'primary') {
    textClass = 'text-white';
    bgClass = 'bg-[#6469ff]';
  }

  const classNames = `${bgClass} ${textClass} font-inter font-medium px-4 py-2 rounded-md text-center ${className}`;

  let element = (
    <button type={type} onClick={onClick} className={classNames}>
      {children}
    </button>
  );

  if (elementType === 'link') {
    element = (
      <Link {...linkProps} className={classNames}>
        {children}
      </Link>
    );
  }

  return element;
};

export default Button;
