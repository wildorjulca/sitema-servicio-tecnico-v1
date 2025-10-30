import React from 'react';
import Hero from './components/Hero';
import MantenimientoTecnico from './components/MantenimientoTecnico';
import SeguimientoReparacion from './components/SeguimientoReparacion';
import Productos from './components/Productos';
import Contacto from './components/Contacto';
import WebNavbar from './components/WebNavbar';

const Web: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <WebNavbar />
      <Hero />
      <MantenimientoTecnico />
      <SeguimientoReparacion />
      <Productos />
      <Contacto />
    </div>
  );
};

export default Web;