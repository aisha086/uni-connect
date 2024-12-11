import React, { useState, useCallback } from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  disableTime = 2000, //  2 seconds
  ...props 
}) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = useCallback(async (e) => {
    if (onClick) {
      setIsDisabled(true);
      await onClick(e);
      setTimeout(() => {
        setIsDisabled(false);
      }, disableTime);
    }
  }, [onClick, disableTime]);

  const baseStyle = 'px-4 py-2 rounded-md font-semibold text-white transition-colors duration-200';
  const variantStyles = {
    primary: 'bg-[#6A1E55] hover:bg-[#A64D79] disabled:bg-gray-400',
    secondary: 'bg-[#A64D79] hover:bg-[#6A1E55] disabled:bg-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 disabled:bg-gray-400',
  };

  return (
    <button 
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      onClick={handleClick}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
};
