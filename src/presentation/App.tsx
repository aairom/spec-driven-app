import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from './components/common';
import { initializeDatabase } from '@/infrastructure/persistence/database';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const result = await initializeDatabase();
      if (result.ok) {
        setIsInitialized(true);
      } else {
        setError(result.error.message);
      }
    };

    init();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-center text-gray-900">
            Database Initialization Failed
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Personal Finance Tracker</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Welcome to your Personal Finance Tracker!</p>
            <p className="mt-2 text-sm text-gray-500">
              The application is ready. Features will be added incrementally.
            </p>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;

// Made with Bob
