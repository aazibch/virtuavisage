import { Link } from 'react-router-dom';

const Button = ({
  children,
  onClick,
  className,
  type,
  elementType,
  styleType,
  linkProps,
  disabled
}) => {
  let textClass = 'text-gray-600';
  let bgClass = 'bg-white';

  if (styleType === 'primary') {
    textClass = 'text-white';
    bgClass = 'bg-[#6469ff]';
  }

  const classNames = `${bgClass} ${textClass} font-inter px-4 py-2 rounded-md text-center disabled:opacity-50 border border-gray-300 ${
    className ? className : ''
  }`;

  let element = (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={classNames}
    >
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
