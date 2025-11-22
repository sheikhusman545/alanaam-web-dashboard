import React, { useEffect, useState } from 'react';
import Router from 'next/router';

const NotFound: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      Router.push('/');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '72px', marginBottom: '20px', color: '#333' }}>
        404
      </h1>
      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
        The page you are looking for does not exist.
      </p>
      {mounted && (
        <button
          onClick={handleClick}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Go to Home
        </button>
      )}
    </div>
  );
};

export default NotFound;

