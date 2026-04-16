import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;
type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`rounded-m3-l bg-surface text-on-surface shadow-m3-1 hover:shadow-m3-2 transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>{children}</div>
);

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '', ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>{children}</p>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>{children}</div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>{children}</div>
);
