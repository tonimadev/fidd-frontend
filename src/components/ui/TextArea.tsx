import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const generatedId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label 
            htmlFor={generatedId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
          >
            {label}
          </label>
        )}
        <textarea
          id={generatedId}
          className={`flex min-h-[100px] w-full rounded-m3-m border-outline bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-on-surface-variant/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-surface-variant/10 ${
            error ? 'border-error focus-visible:ring-error' : 'border'
          } ${className}`}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs font-medium text-error">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
