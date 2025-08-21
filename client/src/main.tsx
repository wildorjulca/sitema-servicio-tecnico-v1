import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/AppRoutes.tsx'
import { ThemeProvider } from './components/proveedor-de-tema.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from 'react';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppRoutes />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>


)
