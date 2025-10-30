// components/web/WebNavbar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Phone, Menu, Home, Wifi, Globe, Settings, 
  Search, ShoppingCart, Mail 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import img from '@/assets/inforsystem3.jpg';

const WebNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/web' },
    { icon: Wifi, label: 'Planes Internet', path: '/web/planes-internet' },
    { icon: Globe, label: 'Fibra Óptica', path: '/web/fibra-optica' },
    { icon: Settings, label: 'Mantenimiento', path: '/web/mantenimiento' },
    { icon: Search, label: 'Seguimiento', path: '/web/seguimiento' },
    { icon: ShoppingCart, label: 'Productos', path: '/web/productos' },
    { icon: Mail, label: 'Contacto', path: '/web/contacto' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 fixed w-full top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/web" className="flex-shrink-0 flex items-center">
            <img className="h-10 w-auto" src={img} alt="Inforsystems Computer" />
            <span className="ml-3 text-xl font-bold text-gray-900 hidden sm:block">
              Inforsystems
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {menuItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`${
                      isActive(item.path)
                        ? 'text-inforsystems-azul bg-inforsystems-azul/10'
                        : 'text-gray-700 hover:text-inforsystems-azul hover:bg-inforsystems-azul/10'
                    } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/web/contacto">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Contactar
              </Button>
            </Link>
            <Link to="/web/mantenimiento">
              <Button size="sm" className="bg-inforsystems-azul hover:bg-inforsystems-azul-hover text-white">
                <Phone className="h-4 w-4 mr-2" />
                Soporte
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/web/mantenimiento">
              <Button size="sm" className="bg-inforsystems-azul hover:bg-inforsystems-azul-hover text-white">
                <Phone className="h-4 w-4" />
              </Button>
            </Link>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-3 mb-8">
                    <img className="h-8 w-auto" src={img} alt="Inforsystems" />
                    <span className="text-lg font-bold text-gray-900">Inforsystems</span>
                  </div>

                  <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                      <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start ${
                            isActive(item.path)
                              ? 'text-inforsystems-azul bg-inforsystems-azul/10'
                              : 'text-gray-700 hover:text-inforsystems-azul'
                          } py-3 px-4 rounded-lg`}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </nav>

                  <div className="pt-6 border-t border-gray-200 space-y-3">
                    <Link to="/web/mantenimiento" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-inforsystems-azul hover:bg-inforsystems-azul-hover text-white">
                        <Phone className="h-4 w-4 mr-2" />
                        Soporte Técnico
                      </Button>
                    </Link>
                    <div className="text-center text-sm text-gray-500">
                      <p>¿Necesitas ayuda?</p>
                      <p className="font-semibold text-inforsystems-azul">+51 987 654 321</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default WebNavbar;