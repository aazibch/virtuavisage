import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '..';
import useWhenClickedOutside from '../../hooks/useWhenClickedOutside';

const DropdownMenu = ({ buttonContent, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useWhenClickedOutside(() => {
    setIsOpen(false);
  });

  const toggleMenuHandler = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button onClick={toggleMenuHandler}>{buttonContent}</button>
      {isOpen && (
        <ul className="absolute border rounded right-0 top-9 min-w-[8rem] shadow-md text-gray-800 text-sm bg-white">
          {items.map((item) => (
            <li key={item.link} className="border-b-1">
              {' '}
              <Link
                className="block p-2 border-b hover:bg-slate-100"
                to={item.link}
                onClick={toggleMenuHandler}
              >
                {item.content}
              </Link>{' '}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
