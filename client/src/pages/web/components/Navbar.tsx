import React, { useState } from 'react';
import {
  Phone,
  Menu,
  Home,
  Wifi,
  Settings,
  Search,
  ShoppingCart,
  Mail,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import img from '../../../assets/inforsystem3.jpg'

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const scrollToContacto = () => {
    scrollToSection('contacto');
  };

  const menuItems = [
    { icon: Home, label: 'Inicio', href: '#inicio' },
    { icon: Wifi, label: 'Planes Internet', href: '#planes' },
    { icon: Globe, label: 'Fibra Óptica', href: '#fibra-optica' },
    { icon: Settings, label: 'Mantenimiento', href: '#mantenimiento' },
    { icon: Search, label: 'Seguimiento', href: '#seguimiento' },
    { icon: ShoppingCart, label: 'Productos', href: '#productos' },
    { icon: Mail, label: 'Contacto', href: '#contacto' }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 fixed w-full top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              className="h-10 w-auto"
              src={img}
              alt="Inforsystems Computer"
            />
            <span className="ml-3 text-xl font-bold text-gray-900 hidden sm:block">
              Inforsystems
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  onClick={() => scrollToSection(item.href.substring(1))}
                  className="text-gray-700 hover:text-inforsystems-azul hover:bg-inforsystems-azul/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={scrollToContacto}
              variant="outline"
              size="sm"
              className="border-inforsystems-azul text-inforsystems-azul hover:bg-inforsystems-azul hover:text-white"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contactar
            </Button>
            <Button
              onClick={scrollToContacto}
              size="sm"
              className="bg-inforsystems-azul hover:bg-inforsystems-azul-hover text-white"
            >
              <Phone className="h-4 w-4 mr-2" />
              Soporte
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              onClick={scrollToContacto}
              size="sm"
              className="bg-inforsystems-azul hover:bg-inforsystems-azul-hover text-white"
            >
              <Phone className="h-4 w-4" />
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-700">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-8">
                    <img
                      className="h-8 w-auto"
                      src={img}
                      alt="Inforsystems Computer"
                    />
                    <span className="text-lg font-bold text-gray-900">Inforsystems</span>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                      <Button
                        key={item.label}
                        variant="ghost"
                        onClick={() => scrollToSection(item.href.substring(1))}
                        className="w-full justify-start text-gray-700 hover:text-inforsystems-azul hover:bg-inforsystems-azul/10 py-3 px-4 rounded-lg transition-colors"
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Button>
                    ))}
                  </nav>

                  {/* Footer */}
                  <div className="pt-6 border-t border-gray-200 space-y-3">
                    <Button
                      onClick={scrollToContacto}
                      className="w-full bg-inforsystems-azul hover:bg-inforsystems-azul-hover text-white"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Soporte Técnico
                    </Button>
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

export default Navbar;