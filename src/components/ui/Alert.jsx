import React from 'react';

export const Alert = ({ children, variant }) => {
  const baseStyle = 'p-4 rounded-md';
  const variantStyles = {
    error: 'bg-red-100 text-red-700 border border-red-400',
    success: 'bg-green-100 text-green-700 border border-green-400',
  };

  return (
    <div className={`${baseStyle} ${variantStyles[variant]}`}>
      {children}
    </div>
  );
};
