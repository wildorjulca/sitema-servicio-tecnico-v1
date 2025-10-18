import React from 'react';
import { 
  Wifi, 
  Network, 
  Monitor, 
  Satellite,
  ArrowRight,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Productos: React.FC = () => {
  const scrollToContacto = () => {
    const contactoSection = document.getElementById('contacto');
    contactoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const productos = [
    {
      icon: Wifi,
      title: "Router WiFi 6",
      description: "Router de última generación para máxima velocidad y cobertura",
      price: "S/ 180",
      features: ["AX5400", "8 Antenas", "OFDMA"],
      badge: "Nuevo"
    },
    {
      icon: Network,
      title: "Switch 8 Puertos",
      description: "Switch Gigabit profesional para expansión de red local",
      price: "S/ 120",
      features: ["1Gbps", "Plug & Play", "Ventilación Silenciosa"],
      badge: "Popular"
    },
    {
      icon: Monitor,
      title: "PC Gamer",
      description: "Computadora optimizada para gaming y trabajo intensivo",
      price: "S/ 2,500",
      features: ["RTX 3060", "16GB RAM", "SSD 1TB"],
      badge: "Premium"
    },
    {
      icon: Satellite,
      title: "Antena Exterior",
      description: "Antena profesional para mejorar señal WiFi en grandes áreas",
      price: "S/ 85",
      features: ["24 dBi", "IP65", "360° Rotación"],
      badge: "Oferta"
    }
  ];

  return (
    <section id="productos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
            Productos y Equipos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Equipos de calidad certificada para tus proyectos de red, 
            computación y tecnología
          </p>
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {productos.map((producto, index) => (
            <Card 
              key={index} 
              className="group border border-gray-200 hover:border-inforsystems-azul/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-inforsystems-azul/10 transition-colors">
                    <producto.icon className="h-6 w-6 text-inforsystems-azul" />
                  </div>
                  {producto.badge && (
                    <Badge 
                      variant="secondary" 
                      className={
                        producto.badge === "Nuevo" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                        producto.badge === "Popular" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                        producto.badge === "Premium" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                        "bg-orange-100 text-orange-800 hover:bg-orange-100"
                      }
                    >
                      {producto.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-inforsystems-azul transition-colors">
                  {producto.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                  {producto.description}
                </p>
              </CardHeader>

              <CardContent className="pb-4">
                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {producto.features.map((feature, featureIndex) => (
                    <span 
                      key={featureIndex}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-inforsystems-azul">
                  {producto.price}
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button 
                  onClick={scrollToContacto}
                  className="w-full bg-inforsystems-azul hover:bg-inforsystems-azul-hover text-white"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Solicitar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Banner Promocional */}
        <Card className="bg-gradient-to-r from-inforsystems-azul to-cable-latino-verde border-0 text-white overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                ¿Necesitas un equipo específico?
              </h3>
              <p className="text-white/90 text-lg mb-6 leading-relaxed">
                Contamos con amplio stock en equipos de red, computadoras, 
                accesorios y soluciones tecnológicas personalizadas
              </p>
              <Button 
                onClick={scrollToContacto}
                variant="secondary" 
                size="lg"
                className="bg-white text-inforsystems-azul hover:bg-gray-100 font-semibold"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Consultar Disponibilidad
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Información Adicional */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            ¿No encuentras lo que buscas?{" "}
            <button 
              onClick={scrollToContacto}
              className="text-inforsystems-azul hover:underline font-semibold"
            >
              Contáctanos para una cotización personalizada
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Productos;