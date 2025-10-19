import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="App">
        <main className="min-h-screen bg-secondary-50">
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary-600 mb-4">
                      StyleLink
                    </h1>
                    <p className="text-secondary-600 text-lg">
                      Fashion discovery and shopping platform
                    </p>
                  </div>
                </div>
              } 
            />
          </Routes>
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
