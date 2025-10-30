// components/FibraOptica.tsx
import React from 'react';
import { Check, Zap, Shield, Download, Upload } from 'lucide-react';

const FibraOptica: React.FC = () => {
  return (
    <section id="fibra-optica" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fibra Óptica de Alta Velocidad
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conectamos tu negocio o hogar con la tecnología más avanzada en fibra óptica
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Benefits */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              ¿Por qué elegir Fibra Óptica?
            </h3>
            
            <div className="space-y-4">
              {[
                { icon: Zap, text: 'Velocidades simétricas hasta 1 Gbps' },
                { icon: Download, text: 'Descargas ultrarrápidas' },
                { icon: Upload, text: 'Subida de archivos instantánea' },
                { icon: Shield, text: 'Conexión estable y segura' },
                { icon: Check, text: 'Latencia mínima para gaming y streaming' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <item.icon className="h-6 w-6 text-green-500" />
                  <span className="text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Services */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Nuestros Servicios de Fibra
            </h3>
            
            <div className="space-y-6">
              {[
                {
                  title: 'Instalación Residencial',
                  description: 'Conexión completa para tu hogar con equipos incluidos'
                },
                {
                  title: 'Fibra Empresarial',
                  description: 'Soluciones dedicadas para empresas con SLA garantizado'
                },
                {
                  title: 'Backbone Corporativo',
                  description: 'Interconexión entre sedes con fibra dedicada'
                },
                {
                  title: 'Mantenimiento Preventivo',
                  description: 'Monitoreo y mantenimiento de infraestructura óptica'
                }
              ].map((service, index) => (
                <div key={index} className="border-l-4 border-inforsystems-azul pl-4">
                  <h4 className="font-semibold text-gray-900">{service.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Listo para la verdadera velocidad?
          </h3>
          <p className="text-gray-600 mb-6">
            Cotiza tu instalación de fibra óptica sin compromiso
          </p>
          <button className="bg-inforsystems-azul text-white px-8 py-3 rounded-lg hover:bg-inforsystems-azul-hover transition-colors">
            Solicitar Cotización
          </button>
        </div>
      </div>
    </section>
  );
};

export default FibraOptica;