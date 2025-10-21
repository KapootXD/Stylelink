import React, { useState } from 'react';
import Button from './Button';

interface ErrorTestButtonProps {
  children: React.ReactNode;
}

const ErrorTestButton: React.FC<ErrorTestButtonProps> = ({ children }) => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('This is a test error to demonstrate the error boundary!');
  }

  const handleThrowError = () => {
    setShouldThrow(true);
  };

  return (
    <div className="p-4 border border-dashed border-gray-300 rounded-lg">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">
          {children}
        </p>
        <Button
          variant="secondary"
          onClick={handleThrowError}
          className="text-red-600 hover:text-red-700"
        >
          Test Error Boundary
        </Button>
      </div>
    </div>
  );
};

export default ErrorTestButton;
