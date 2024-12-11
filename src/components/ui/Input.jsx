import React from 'react';

export const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full p-2 bg-[#1A1A1D] text-white border border-[#6A1E55] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A64D79] ${className}`}
      {...props}
    />
  );
};
