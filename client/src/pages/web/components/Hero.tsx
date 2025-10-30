import React from 'react';
import img from '../../../assets/latino.png'
import img1 from '../../../assets/latino2.png'

import img2 from '../../../assets/logo.jpg'
import { Button } from '@/components/ui/button';


const Hero: React.FC = () => {
  return (
    <section id="inicio" className="pt-24 pb-16 bg-gradient-to-br to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Inforsystems{' '}
              <span className="text-inforsystems-azul">Computer</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Más de 15 años brindando soluciones tecnológicas en redes, mantenimiento y equipos de calidad
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button className="bg-inforsystems-azul hover:bg-inforsystems-azul-hover text-white px-8 py-4  font-semibold text-lg transition-colors shadow-lg">
                Seguimiento de Equipos
              </Button>
              <Button className="bg-cable-latino-verde hover:bg-cable-latino-verde-hover text-white px-8 py-4 font-semibold text-lg transition-colors shadow-lg">
                Solicitar Mantenimiento
              </Button>
            </div>

            <div className="mt-7">
              <p className="text-gray-500 text-sm mb-4">Trabajamos con:</p>
              <div className="flex items-center gap-6">
                <img 
                  src={img}
                  alt="Cable Latino" 
                  className="h-32 opacity-80 hover:opacity-100 transition-opacity"
                />
                <img 
                  src={img1}
                  alt="Telecable" 
                  className="h-32 opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <img 
              src={img2}
              alt="Tecnología y Redes" 
              className="rounded-lg shadow-2xl max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;