import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);

  const baseStyles = 'px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors';
  const normalStyles = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500';
  const disabledStyles = 'bg-gray-100 cursor-not-allowed';
  const widthStyle = fullWidth ? 'w-full' : '';

  const inputClassName = [
    baseStyles,
    hasError ? errorStyles : normalStyles,
    props.disabled ? disabledStyles : '',
    widthStyle,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={inputClassName}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
      {!error && helperText && (
        <p
          id={`${inputId}-helper`}
          className="mt-1 text-sm text-gray-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

// Made with Bob
