import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface NavLinkButtonProps {
  to: string;
  children: React.ReactNode;
}

const NavButton: React.FC<NavLinkButtonProps> = ({ to, children }) => {

  const navigator = useNavigate();

  const handleClick = () => {
    navigator(to);
  };
  
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Button variant="ghost" className={`w-full ${isActive ? "text-primary bg-primarylighter font-bold" : "" }`} onClick={handleClick}>{children}</Button>
  );
};

export default NavButton;