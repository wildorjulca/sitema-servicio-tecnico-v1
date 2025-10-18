import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PlanesInternet from './components/PlanesInternet';
import MantenimientoTecnico from './components/MantenimientoTecnico';
import SeguimientoReparacion from './components/SeguimientoReparacion';
import Productos from './components/Productos';
import Contacto from './components/Contacto';
import Footer from './components/Footer';

const Web: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <PlanesInternet />
      <MantenimientoTecnico />
      <SeguimientoReparacion />
      <Productos />
      <Contacto />
      <Footer />
    </div>
  );
};

export default Web;