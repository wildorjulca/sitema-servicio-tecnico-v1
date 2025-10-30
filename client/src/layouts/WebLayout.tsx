// layouts/WebLayout.tsx
import WebFooter from '@/pages/web/components/WebFooter';
import WebNavbar from '@/pages/web/components/WebNavbar';
import React from 'react';
import { Outlet } from 'react-router-dom'; // Importar Outlet


// Ya no necesitamos las props children
const WebLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <WebNavbar />
      <main>
        <Outlet /> {/* Aquí se renderizarán las rutas hijas */}
      </main>
      <WebFooter />
    </div>
  );
};

export default WebLayout;