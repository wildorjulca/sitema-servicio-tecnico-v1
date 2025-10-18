import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Partners from './Partners';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <img 
                src="/logo-inforsystems.png" 
                alt="Inforsystems" 
                className="h-8 mr-3"
              />
              <span className="text-xl font-bold">Inforsystems</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Líderes en soluciones tecnológicas integrales. Más de 10 años brindando 
              servicios de internet, mantenimiento técnico y equipos de calidad.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <MapPin className="h-4 w-4 mr-3 text-inforsystems-azul" />
                <span className="text-sm">Av. Tecnología 123, Lima, Perú</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-3 text-inforsystems-azul" />
                <span className="text-sm">+51 987 654 321</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-3 text-inforsystems-azul" />
                <span className="text-sm">info@inforsystems.com</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Clock className="h-4 w-4 mr-3 text-inforsystems-azul" />
                <span className="text-sm">Lun-Vie: 8:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Servicios</h4>
            <ul className="space-y-3">
              {[
                'Internet por Fibra Óptica',
                'Mantenimiento Técnico',
                'Instalación de Redes',
                'Soporte 24/7',
                'Venta de Equipos',
                'Consultoría IT'
              ].map((service) => (
                <li key={service}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 text-inforsystems-azul opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Empresa</h4>
            <ul className="space-y-3">
              {[
                'Sobre Nosotros',
                'Nuestro Equipo',
                'Trabaja con Nosotros',
                'Blog & Noticias',
                'Casos de Éxito',
                'Certificaciones'
              ].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 text-inforsystems-azul opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Suscríbete para recibir las últimas noticias y ofertas especiales.
            </p>
            
            <div className="space-y-3">
              <Input 
                type="email" 
                placeholder="tu@email.com"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-inforsystems-azul"
              />
              <Button className="w-full bg-inforsystems-azul hover:bg-inforsystems-azul-hover text-white">
                Suscribirse
              </Button>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h5 className="font-semibold text-white mb-4">Síguenos</h5>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Youtube, href: '#', label: 'YouTube' }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="bg-gray-800 hover:bg-inforsystems-azul w-10 h-10 rounded-lg flex items-center justify-center transition-colors group"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Partners */}
       <Partners/>
      </div>


    </footer>
  );
};

export default Footer;