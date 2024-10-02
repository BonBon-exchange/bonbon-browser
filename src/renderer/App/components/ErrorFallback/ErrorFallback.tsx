/* eslint-disable react/require-default-props */
/* eslint-disable react/button-has-type */
// TypedErrorBoundary.tsx
import React, { ErrorInfo, useEffect, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { v4 } from 'uuid';

// Composant de fallback pour afficher un message d'erreur
const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

// Typage des props pour le composant ErrorBoundary
interface TypedErrorBoundaryProps {
  children: React.ReactNode;
  manualResetKey?: string;
}

// Function to log error details
const logErrorDetails = (error: Error, errorInfo: ErrorInfo) => {
  // Log error details locally for development
  console.error('Error caught by TypedErrorBoundary:', {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
    // You can add more context here like user info, state snapshot, etc.
  });
};

// Composant Error Boundary fonctionnel typé
const TypedErrorBoundary: React.FC<TypedErrorBoundaryProps> = ({
  children,
  manualResetKey,
}) => {
  const [resetKey, setResetKey] = useState<string>(manualResetKey ?? v4()); // Clé de reset pour forcer le re-render

  // Typage correct pour la fonction onError
  const onError = (error: Error, info: ErrorInfo) => {
    logErrorDetails(error, info); // Log the error with details
  };

  // Fonction onReset pour forcer un re-render
  const onReset = () => {
    setResetKey(v4()); // Incrémente la clé de reset pour forcer le re-render
  };

  useEffect(() => {
    if (manualResetKey) setResetKey(manualResetKey);
  }, [manualResetKey]);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={onReset}
      onError={onError}
      resetKeys={[resetKey]} // Utilisation de la clé de reset pour contrôler le re-render
    >
      {children}
    </ErrorBoundary>
  );
};

export default TypedErrorBoundary;
