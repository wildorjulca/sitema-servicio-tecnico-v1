import React from 'react';
import { 
  Phone, 
  MapPin, 
  Clock,
  Send,
  User,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Contacto: React.FC = () => {
  return (
    <section id="contacto" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contáctanos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos para consultas, soporte técnico 
            o información sobre nuestros servicios.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de Contacto */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h3>
              <p className="text-gray-600 mb-8">
                No dudes en contactarnos a través de cualquiera de estos canales. 
                Nuestro equipo está listo para asistirte.
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Teléfono */}
              <div className="flex items-start p-4 bg-white rounded-xl border border-gray-200 hover:border-inforsystems-azul/50 hover:shadow-lg transition-all duration-300">
                <div className="bg-inforsystems-azul rounded-lg p-3 mr-4 flex-shrink-0">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">Teléfonos</h4>
                  <div className="space-y-1">
                    <p className="text-gray-700 hover:text-inforsystems-azul transition-colors cursor-pointer font-semibold">
                      +51 987 654 321
                    </p>
                    <p className="text-gray-700 hover:text-inforsystems-azul transition-colors cursor-pointer font-semibold">
                      +51 123 456 789
                    </p>
                  </div>
                  <p className="text-sm text-green-600 mt-2">Llamadas y WhatsApp</p>
                </div>
              </div>

              {/* Dirección */}
              <div className="flex items-start p-4 bg-white rounded-xl border border-gray-200 hover:border-inforsystems-azul/50 hover:shadow-lg transition-all duration-300">
                <div className="bg-inforsystems-azul rounded-lg p-3 mr-4 flex-shrink-0">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">Dirección</h4>
                  <p className="text-gray-700 font-medium">San Martin 346-224, Bagua Grande , Perú</p>
                  <p className="text-sm text-gray-500 mt-2">Oficina principal</p>
                </div>
              </div>

              {/* Horario */}
              <div className="flex items-start p-4 bg-white rounded-xl border border-gray-200 hover:border-inforsystems-azul/50 hover:shadow-lg transition-all duration-300">
                <div className="bg-inforsystems-azul rounded-lg p-3 mr-4 flex-shrink-0">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">Horario de Atención</h4>
                  <div className="space-y-1">
                    <p className="text-gray-700">Lunes a Viernes: 8:00 AM - 7:00 PM</p>
                    <p className="text-gray-700">Sábados: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-r from-inforsystems-azul to-blue-600 rounded-2xl p-6 mt-8">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-white mr-4" />
                <div>
                  <h4 className="font-bold text-white text-lg">¿Necesitas ayuda inmediata?</h4>
                  <p className="text-white/90 text-sm">
                    Nuestro equipo de soporte está disponible para emergencias técnicas las 24 horas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-inforsystems-azul mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Solicita Información</h3>
            </div>
            
            <p className="text-gray-600 mb-8">
              Completa el formulario y nos pondremos en contacto contigo a la brevedad.
            </p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <Input 
                    type="text" 
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-inforsystems-azul focus:ring-inforsystems-azul"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <Input 
                    type="tel" 
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-inforsystems-azul focus:ring-inforsystems-azul"
                    placeholder="+51 999 888 777"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input 
                  type="email" 
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-inforsystems-azul focus:ring-inforsystems-azul"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Servicio de Interés</label>
                <Select>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-inforsystems-azul focus:ring-inforsystems-azul">
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 text-gray-900">
                    <SelectItem value="internet">Planes de Internet</SelectItem>
                    <SelectItem value="fibra">Fibra Óptica</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento técnico</SelectItem>
                    <SelectItem value="redes">Instalación de redes</SelectItem>
                    <SelectItem value="equipos">Venta de equipos</SelectItem>
                    <SelectItem value="empresarial">Soporte empresarial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mensaje</label>
                <Textarea 
                  rows={5}
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-inforsystems-azul focus:ring-inforsystems-azul resize-none"
                  placeholder="Describe tu consulta, requerimiento o problema técnico..."
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-inforsystems-azul hover:bg-inforsystems-azul-hover text-white py-6 text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                size="lg"
              >
                <Send className="h-5 w-5 mr-2" />
                Enviar Solicitud
              </Button>
            </form>

            {/* Privacy Note */}
            <p className="text-center text-gray-500 text-sm mt-6">
              Al enviar este formulario, aceptas nuestra{' '}
              <a href="#" className="text-inforsystems-azul hover:underline font-medium">
                Política de Privacidad
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;