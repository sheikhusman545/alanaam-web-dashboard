import React from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';

interface ErrorProps {
  statusCode: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

const Error = ({ statusCode, err }: ErrorProps) => {
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
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        {statusCode || 'Error'}
      </h1>
      <p style={{ fontSize: '18px', marginBottom: '20px' }}>
        {statusCode === 404
          ? 'This page could not be found.'
          : 'An error occurred on the server.'}
      </p>
      {err && process.env.NODE_ENV === 'development' && (
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '4px',
          overflow: 'auto',
          maxWidth: '800px'
        }}>
          {err.message}
        </pre>
      )}
      <button
        onClick={() => Router.push('/')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
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
    </div>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? (err as any).statusCode : 404;
  return { statusCode, err };
};

export default Error;

