import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  padding = 'p-6 sm:p-8',
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/65 rounded-3xl border border-white/20 backdrop-blur-2xl shadow-2xl text-white transition-all duration-300 ${
        hoverEffect ? 'hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)] hover:border-white/40 hover:-translate-y-1' : ''
      } ${padding} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

