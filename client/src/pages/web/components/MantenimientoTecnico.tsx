import React from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  Network, 
  Cable,
  CheckCircle2,
  Clock,
  Shield,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MantenimientoTecnico: React.FC = () => {
  const scrollToContacto = () => {
    const contactoSection = document.getElementById('contacto');
    contactoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const servicios = [
    {
      icon: Settings,
      title: "Mantenimiento Preventivo",
      description: "Revisiones periódicas para prevenir fallas y optimizar el rendimiento de tus equipos",
      features: [
        "Limpieza interna y externa",
        "Actualización de software", 
        "Optimización de sistema",
        "Reporte detallado"
      ],
      color: "inforsystems-azul",
      tiempo: "2-4 horas",
      garantia: "3 meses"
    },
    {
      icon: AlertTriangle,
      title: "Reparación Express",
      description: "Solución rápida para problemas técnicos urgentes con garantía incluida",
      features: [
        "Diagnóstico inmediato",
        "Reparación en sitio",
        "Partes y repuestos",
        "Garantía 30 días"
      ],
      color: "cable-latino-verde", 
      tiempo: "24-48 horas",
      garantia: "30 días"
    },
    {
      icon: Network,
      title: "Instalación de Redes",
      description: "Diseño e implementación de redes cableadas e inalámbricas profesionales",
      features: [
        "Cableado estructurado",
        "Configuración routers",
        "Puntos de acceso WiFi", 
        "Certificación de red"
      ],
      color: "inforsystems-azul",
      tiempo: "1-2 días",
      garantia: "6 meses"
    },
    {
      icon: Cable,
      title: "Fibra Óptica",
      description: "Instalación profesional de fibra óptica con los más altos estándares de calidad",
      features: [
        "Fusión de fibra",
        "Mediciones OTDR",
        "Cableado interno/externo",
        "Certificación final"
      ],
      color: "cable-latino-verde",
      tiempo: "2-3 días", 
      garantia: "1 año"
    }
  ];

  const getColorClasses = (color: string) => {
    return color === "inforsystems-azul" 
      ? "bg-inforsystems-azul hover:bg-inforsystems-azul-hover" 
      : "bg-cable-latino-verde hover:bg-cable-latino-verde-hover";
  };

  return (
    <section id="mantenimiento" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Servicios Técnicos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluciones profesionales integrales para mantener tu tecnología 
            funcionando al máximo rendimiento
          </p>
        </div>

        {/* Grid de Servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {servicios.map((servicio, index) => (
            <Card 
              key={index}
              className="group border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 h-full flex flex-col"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${
                    servicio.color === "inforsystems-azul" 
                      ? "bg-inforsystems-azul/10" 
                      : "bg-cable-latino-verde/10"
                  }`}>
                    <servicio.icon className={`h-6 w-6 ${
                      servicio.color === "inforsystems-azul" 
                        ? "text-inforsystems-azul" 
                        : "text-cable-latino-verde"
                    }`} />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {servicio.tiempo}
                    </Badge>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-inforsystems-azul transition-colors">
                  {servicio.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                  {servicio.description}
                </p>
              </CardHeader>

              <CardContent className="flex-grow pb-4">
                {/* Features */}
                <ul className="space-y-3">
                  {servicio.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Garantía */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <Shield className="h-4 w-4 mr-2" />
                    Garantía: {servicio.garantia}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button 
                  onClick={scrollToContacto}
                  className={`w-full ${getColorClasses(servicio.color)} text-white`}
                  size="sm"
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Solicitar Servicio
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>


        

        {/* Información Adicional */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            ¿Tienes una emergencia técnica?{" "}
            <button 
              onClick={scrollToContacto}
              className="text-inforsystems-azul hover:underline font-semibold"
            >
              Contáctanos para soporte inmediato
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default MantenimientoTecnico;