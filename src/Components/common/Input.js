import React from 'react';

const Input = ({
  type = 'text',
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  className = '',
  name,
  disabled = false,
  min,
  max,
  rows,
  ...props
}) => {
  const baseInputStyles = `
    w-full 
    border 
    border-gray-300 
    rounded-md 
    p-2 
    focus:outline-none 
    focus:ring-2 
    focus:ring-red-500 
    disabled:bg-gray-50 
    disabled:text-gray-500
  `;

  const inputProps = {
    type,
    value,
    onChange: (e) => onChange(e.target.value),
    placeholder,
    required,
    disabled,
    name,
    className: `${baseInputStyles} ${error ? 'border-red-500' : ''} ${className}`,
    min,
    max,
    ...props
  };

  const renderInput = () => {
    if (type === 'textarea') {
      return React.createElement('textarea', {
        ...inputProps,
        rows: rows || 3
      });
    }

    return React.createElement('input', inputProps);
  };

  return React.createElement('div', { className: 'mb-4' },
    label && React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' },
      label,
      required && React.createElement('span', { className: 'text-red-500 ml-1' }, '*')
    ),
    renderInput(),
    error && React.createElement('p', { className: 'mt-1 text-sm text-red-500' }, error)
  );
};

// Reusable PasswordInput component
export const PasswordInput = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  className = '',
  name,
  disabled = false,
  readOnly = false,
  ...props
}) => {
  const [show, setShow] = React.useState(false);

  const baseInputStyles = `
    w-full 
    border 
    border-gray-300 
    rounded-md 
    p-2 
    focus:outline-none 
    focus:ring-2 
    focus:ring-red-500 
    disabled:bg-gray-50 
    disabled:text-gray-500
    pr-10
  `;

  return (
    <div className="mb-4 relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        name={name}
        readOnly={readOnly}
        className={`${baseInputStyles} ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow(s => !s)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none bg-transparent"
        style={{ cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? (
          // Crossed eye SVG (hide)
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 4C5 4 2 10 2 10C2 10 3.5 12.5 6 14.1M14.1 16C16.5 14.5 18 12 18 12C18 12 15 4 10 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
        ) : (
          // Simple eye SVG (show)
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="10" cy="10" rx="8" ry="5" stroke="currentColor" strokeWidth="2"/>
            <circle cx="10" cy="10" r="2.5" fill="currentColor"/>
          </svg>
        )}
      </button>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input; 