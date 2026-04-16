import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-m3-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 disabled:pointer-events-none disabled:opacity-50 tracking-wide';
  
  const variants = {
    primary: 'bg-primary text-on-primary hover:shadow-m3-1 shadow-none active:shadow-none',
    secondary: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90',
    outline: 'border border-outline bg-transparent hover:bg-surface-variant/30 text-primary',
    ghost: 'bg-transparent hover:bg-surface-variant/30 text-primary',
    danger: 'bg-error text-on-error hover:bg-error/90',
    link: 'bg-transparent underline-offset-4 hover:underline text-primary p-0 h-auto',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
    icon: 'h-10 w-10',
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};
