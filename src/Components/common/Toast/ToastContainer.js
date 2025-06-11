import React from 'react';
import Toast from './Toast';

const ToastContainer = ({ toasts, removeToast }) => {
  return React.createElement('div', {
    className: 'fixed top-4 right-4 z-50 flex flex-col items-end'
  },
    toasts.map((toast) =>
      React.createElement(Toast, {
        key: toast.id,
        message: toast.message,
        type: toast.type,
        onClose: () => removeToast(toast.id)
      })
    )
  );
};

export default ToastContainer; 