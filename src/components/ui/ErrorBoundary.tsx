// components/ui/ErrorBoundary.tsx
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  error: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  error, 
  onRetry, 
  children 
}) => {
  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          {onRetry && (
            <button 
              onClick={onRetry} 
              className="ml-2 underline text-primary-foreground"
            >
              Try again
            </button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};
