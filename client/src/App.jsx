import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { AccessibilityProvider } from './context/AccessibilityContext.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';

export function App() {
  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <AuthProvider>
          <ProgressProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  borderRadius: '16px',
                  background: '#0f172a',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '14px',
                },
              }}
            />
            <AppRoutes />
          </ProgressProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  );
}

export default App;
