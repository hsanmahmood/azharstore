import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LoadingProvider } from './context/LoadingContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import './i18n/config';
import './styles/index.css';
import './styles/custom.css';
import App from './App';
import LogRocket from 'logrocket';

LogRocket.init('h-lizl2/h');

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LoadingProvider>
          <DataProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </DataProvider>
        </LoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
