import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '..';
import useWhenClickedOutside from '../../hooks/useWhenClickedOutside';

const DropdownMenu = ({ buttonContent, items, disableClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useWhenClickedOutside(() => {
    setIsOpen(false);
  });

  const toggleMenuHandler = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        disabled={disableClick}
        className={`hover:opacity-70 ${
          isOpen ? 'opacity-70' : ''
        } disabled:opacity-50`}
        onClick={toggleMenuHandler}
      >
        {buttonContent}
      </button>
      {isOpen && (
        <ul className="absolute border rounded right-0 top-8 w-[7rem] min-w-max z-50 shadow-md text-gray-800 text-sm bg-white">
          {items.map((item) => (
            <li key={item.content} className="border-b-1">
              {item.link ? (
                <Link
                  className="block p-2 border-b hover:bg-slate-100"
                  to={item.link}
                  onClick={toggleMenuHandler}
                >
                  {item.content}
                </Link>
              ) : (
                <span
                  className="block p-2 border-b hover:bg-slate-100 cursor-pointer"
                  onClick={() => {
                    item.onClick();
                    toggleMenuHandler();
                  }}
                >
                  {item.content}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
