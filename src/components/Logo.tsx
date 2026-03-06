import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48,
  };

  return (
    <div className={`flex items-center gap-2 font-sans ${className}`}>
      {/* Icon: Rounded Square with Checkmark */}
      <svg
        width={iconSizes[size]}
        height={iconSizes[size]}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary shrink-0"
      >
        <rect x="3" y="3" width="26" height="26" rx="8" stroke="currentColor" strokeWidth="4" />
        <path
          d="M9.5 16L13.5 20L22.5 11"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Text */}
      <div className={`font-extrabold tracking-tight select-none ${sizeClasses[size]}`}>
        <span className="text-primary">Ta</span>
        <span className="text-indigo-400">NaMão</span>
      </div>
    </div>
  );
};
