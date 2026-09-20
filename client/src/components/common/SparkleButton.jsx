import React from 'react';
import { Link } from 'react-router-dom';

export const SparkleButton = ({
  children = 'Get Started Free',
  to,
  href,
  onClick,
  className = '',
}) => {
  const buttonMarkup = (
    <div className={`sp ${className}`}>
      <span className="sparkle-button">
        <span className="spark" />
        <span className="backdrop" />
        <svg
          className="sparkle"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
            fill="currentColor"
          />
          <path
            d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
            fill="currentColor"
          />
          <path
            d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
            fill="currentColor"
          />
        </svg>
        <span className="text btn-text">{children}</span>
      </span>

      {/* Floating Particles Pen */}
      <div className="particle-pen">
        <svg
          className="particle"
          style={{ '--x': 15, '--y': 20, '--duration': 1.8, '--delay': 0.1, '--size': 0.25 }}
          viewBox="0 0 15 15"
        >
          <path d="M7.5 0L9 6L15 7.5L9 9L7.5 15L6 9L0 7.5L6 6L7.5 0Z" />
        </svg>
        <svg
          className="particle"
          style={{ '--x': 80, '--y': 15, '--duration': 2.2, '--delay': 0.3, '--size': 0.3 }}
          viewBox="0 0 15 15"
        >
          <path d="M7.5 0L9 6L15 7.5L9 9L7.5 15L6 9L0 7.5L6 6L7.5 0Z" />
        </svg>
        <svg
          className="particle"
          style={{ '--x': 30, '--y': 80, '--duration': 1.5, '--delay': 0.4, '--size': 0.2 }}
          viewBox="0 0 15 15"
        >
          <path d="M7.5 0L9 6L15 7.5L9 9L7.5 15L6 9L0 7.5L6 6L7.5 0Z" />
        </svg>
        <svg
          className="particle"
          style={{ '--x': 85, '--y': 75, '--duration': 2.5, '--delay': 0.2, '--size': 0.35 }}
          viewBox="0 0 15 15"
        >
          <path d="M7.5 0L9 6L15 7.5L9 9L7.5 15L6 9L0 7.5L6 6L7.5 0Z" />
        </svg>
        <svg
          className="particle"
          style={{ '--x': 50, '--y': 10, '--duration': 2.0, '--delay': 0.5, '--size': 0.22 }}
          viewBox="0 0 15 15"
        >
          <path d="M7.5 0L9 6L15 7.5L9 9L7.5 15L6 9L0 7.5L6 6L7.5 0Z" />
        </svg>
        <svg
          className="particle"
          style={{ '--x': 10, '--y': 65, '--duration': 1.7, '--delay': 0.35, '--size': 0.28 }}
          viewBox="0 0 15 15"
        >
          <path d="M7.5 0L9 6L15 7.5L9 9L7.5 15L6 9L0 7.5L6 6L7.5 0Z" />
        </svg>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex text-decoration-none">
        {buttonMarkup}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className="inline-flex text-decoration-none">
        {buttonMarkup}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-flex bg-transparent border-0 p-0 cursor-pointer">
      {buttonMarkup}
    </button>
  );
};

export default SparkleButton;
