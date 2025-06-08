import React from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  const types = {
    success: {
      icon: Check,
      bgColor: 'bg-green-500',
      textColor: 'text-white'
    },
    error: {
      icon: X,
      bgColor: 'bg-red-500',
      textColor: 'text-white'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500',
      textColor: 'text-white'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-500',
      textColor: 'text-white'
    }
  };

  const { icon: Icon, bgColor, textColor } = types[type] || types.info;

  return React.createElement('div', {
    className: `flex items-center p-4 mb-2 rounded-md shadow-lg ${bgColor} ${textColor} min-w-[300px] max-w-md animate-slide-in`,
    role: 'alert'
  },
    React.createElement(Icon, {
      size: 20,
      className: 'mr-3 flex-shrink-0'
    }),
    React.createElement('p', {
      className: 'flex-grow text-sm font-medium'
    }, message),
    React.createElement('button', {
      onClick: onClose,
      className: 'ml-4 hover:opacity-80 transition-opacity',
      'aria-label': 'Close'
    },
      React.createElement(X, {
        size: 16
      })
    )
  );
};

export default Toast; 