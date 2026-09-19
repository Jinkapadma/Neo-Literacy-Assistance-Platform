import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  padding = 'p-6',
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-card transition-all duration-300 ${
        hoverEffect ? 'hover:shadow-card-hover hover:border-brand-300 hover:-translate-y-1' : ''
      } ${padding} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
