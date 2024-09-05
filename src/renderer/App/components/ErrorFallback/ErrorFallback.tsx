/* eslint-disable react/button-has-type */
// TypedErrorBoundary.tsx
import React, { ErrorInfo, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// Composant de fallback pour afficher un message d'erreur
const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
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
}

// Composant Error Boundary fonctionnel typé
const TypedErrorBoundary: React.FC<TypedErrorBoundaryProps> = ({ children }) => {
  const [resetKey, setResetKey] = useState(0); // Clé de reset pour forcer le re-render

  // Typage correct pour la fonction onError
  const onError = (error: Error, info: ErrorInfo) => {
    console.error('Error caught by TypedErrorBoundary:', error, info);
  };

  // Fonction onReset pour forcer un re-render
  const onReset = () => {
    setResetKey((prevKey) => prevKey + 1); // Incrémente la clé de reset pour forcer le re-render
  };

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