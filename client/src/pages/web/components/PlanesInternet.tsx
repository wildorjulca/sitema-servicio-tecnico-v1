import React from 'react';
import { 
  Wifi, 
  Users, 
  Crown,
  CheckCircle2,
  Star,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PlanesInternet: React.FC = () => {
  const scrollToContacto = () => {
    const contactoSection = document.getElementById('contacto');
    contactoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const planes = [
    {
      nombre: "Internet Básico",
      precio: "S/ 50",
      periodo: "/mes",
      icon: Wifi,
      color: "gray",
      popular: false,
      caracteristicas: [
        "Velocidad estándar",
        "Conexión estable",
        "Soporte técnico básico",
        "Instalación incluida"
      ],
      velocidad: "Hasta 30 Mbps",
      dispositivos: "1-2 dispositivos"
    },
    {
      nombre: "Internet Dúo",
      precio: "S/ 70", 
      periodo: "/mes",
      icon: Users,
      color: "inforsystems-azul",
      popular: true,
      caracteristicas: [
        "Alta velocidad",
        "Para 2-4 dispositivos",
        "Soporte prioritario",
        "Instalación gratis",
        "Router incluido"
      ],
      velocidad: "Hasta 60 Mbps",
      dispositivos: "2-4 dispositivos"
    },
    {
      nombre: "Fibra Plus",
      precio: "S/ 90",
      periodo: "/mes",
      icon: Crown,
      color: "cable-latino-verde",
      popular: false,
      caracteristicas: [
        "Fibra óptica 100%",
        "Velocidad máxima", 
        "Soporte 24/7",
        "Equipo Wi-Fi 6",
        "Para toda la familia"
      ],
      velocidad: "Hasta 100 Mbps",
      dispositivos: "5+ dispositivos"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "inforsystems-azul":
        return "bg-inforsystems-azul hover:bg-inforsystems-azul-hover";
      case "cable-latino-verde":
        return "bg-cable-latino-verde hover:bg-cable-latino-verde-hover";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  const getBorderColor = (color: string) => {
    switch (color) {
      case "inforsystems-azul":
        return "border-inforsystems-azul";
      case "cable-latino-verde":
        return "border-cable-latino-verde";
      default:
        return "border-gray-200";
    }
  };

  return (
    <section id="planes" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-sans text-gray-900 ">
            Planes de Internet
          </h2>

        </div>

        {/* Grid de Planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {planes.map((plan, index) => (
            <Card 
              key={index}
              className={`group relative border-2 ${
                plan.popular 
                  ? 'border-inforsystems-azul shadow-2xl scale-105' 
                  : getBorderColor(plan.color)
              } hover:shadow-xl transition-all duration-300 h-full flex flex-col`}
            >
              {/* Badge Popular */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-inforsystems-azul text-white px-4 py-1 text-sm font-semibold border-0">
                    <Star className="h-3 w-3 mr-1" />
                    MÁS POPULAR
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6 pt-8">
                {/* Icono */}
                <div className={`inline-flex p-3 rounded-2xl ${
                  plan.popular 
                    ? 'bg-inforsystems-azul/10' 
                    : plan.color === 'cable-latino-verde' 
                    ? 'bg-cable-latino-verde/10' 
                    : 'bg-gray-100'
                } mb-4`}>
                  <plan.icon className={`h-6 w-6 ${
                    plan.popular 
                      ? 'text-inforsystems-azul' 
                      : plan.color === 'cable-latino-verde' 
                      ? 'text-cable-latino-verde' 
                      : 'text-gray-600'
                  }`} />
                </div>

                {/* Nombre y Precio */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.nombre}</h3>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-3xl font-bold text-inforsystems-azul">{plan.precio}</span>
                  <span className="text-gray-500">{plan.periodo}</span>
                </div>

                {/* Especificaciones Técnicas */}
                <div className="flex justify-center space-x-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                    {plan.velocidad}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1 text-blue-500" />
                    {plan.dispositivos}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-grow pb-6">
                {/* Características */}
                <ul className="space-y-3">
                  {plan.caracteristicas.map((caracteristica, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{caracteristica}</span>
                    </li>
                  ))}
                </ul>

                {/* Beneficios Adicionales */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Garantía
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Soporte
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button 
                  onClick={scrollToContacto}
                  className={`w-full ${
                    plan.popular 
                      ? getColorClasses('inforsystems-azul') 
                      : getColorClasses(plan.color)
                  } text-white py-3 font-semibold`}
                  size="lg"
                >
                  Contratar Ahora
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Información Adicional */}
        <div className="text-center mt-12">
          <div className="bg-gray-50 rounded-2xl p-6 max-w-2xl mx-auto">
            <h4 className="font-semibold text-gray-900 mb-2">
              ¿Necesitas un plan personalizado para tu negocio?
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Contáctanos para diseñar una solución a medida con velocidades dedicadas y soporte empresarial.
            </p>
            <Button 
              onClick={scrollToContacto}
              variant="outline"
              className="border-inforsystems-azul text-inforsystems-azul hover:bg-inforsystems-azul hover:text-white"
            >
              Solicitar Plan Empresarial
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanesInternet;