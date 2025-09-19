import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/AppRoutes.tsx'
import { ThemeProvider } from './components/proveedor-de-tema.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './context/UseProvider.tsx';
import { ServiceProvider } from './context/ServiceContext.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <ServiceProvider> {/* 👈 Envuelve AppRoutes con ServiceProvider */}
            <AppRoutes />
            <Toaster position="top-right" />
          </ServiceProvider>
        </ThemeProvider>
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>
)