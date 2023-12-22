import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavLinkButtonProps {
  to: string;
  children: React.ReactNode;
  icon?: React.ReactElement;
  isSidebarExtended: boolean;
  iconClassName?: string;
}

const NavLinkButton: React.FC<NavLinkButtonProps> = ({ to, children, isSidebarExtended, icon, iconClassName }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname.startsWith(to);

  console.log(isActive);

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button
        className={`flex flex-row w-full px-8 py-4 items-center text-sm font-bold transition-all duration-150 ease-linear bg-transparent rounded outline-none active:bg-white focus:outline-none hover:bg-white-color hover:dark:bg-black-color hover:text-secondary-color hover:dark:text-secondary-color hover:cursor-pointer
                    ${isSidebarExtended ? 'justify-start' : 'justify-center'} ${isActive ? 'text-secondary-color dark:text-secondary-color' : 'text-gray-500 dark:text-gray-100'}`}
        onClick={handleClick}
    >
        {icon && <span className={`${iconClassName}`}>{icon}</span>}
        {isSidebarExtended && <span className="ml-4">{children}</span>}
    </button> 
  );
};

export default NavLinkButton;