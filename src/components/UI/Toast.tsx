import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useApp } from '../../context/AppContext';
import 'react-toastify/dist/ReactToastify.css';

const ToastProvider: React.FC = () => {
  const { isDarkMode } = useApp();

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDarkMode ? 'dark' : 'light'}
      style={{
        fontSize: '14px',
      }}
      toastStyle={{
        borderRadius: '8px',
        ...(isDarkMode && {
          backgroundColor: '#374151',
          color: '#ffffff',
        }),
      }}
    />
  );
};

export default ToastProvider;