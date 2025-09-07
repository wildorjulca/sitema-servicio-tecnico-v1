import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from 'lucide-react';
import React from 'react';

const BreadcrumbDinamico = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Mapeo de rutas a nombres legibles
  const routeNames: Record<string, string> = {
    'dashboard': 'Dashboard',
    'cliente': 'Clientes',
    'marca': 'Marcas',
    'equipo': 'Equipos',
    'cat': 'Categorías',
    'tipo_doc': 'Tipos de Documento',
    'mot_ingreso': 'Motivos de Ingreso',
    'producto': 'Productos',
    'users': 'Usuarios',
    'servicio': 'Servicios',
    'list': 'Listar Servicios',
    'new': 'Nuevo Servicio',
    'permiso': 'Permisos',
    'roles': 'Roles',
    'perfil': 'Perfil',
    'documentacion': 'Documentación',
    'inf': 'Detalles'
  };

  // Si estamos en la raíz del dashboard
  if (pathnames.length === 1 && pathnames[0] === 'dashboard') {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1">
              <HomeIcon className="h-4 w-4" />
              Inicio
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link to="/dashboard" className="flex items-center gap-1">
              <HomeIcon className="h-4 w-4" />
              Inicio
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {pathnames.map((value, index) => {
          if (value === 'dashboard') return null;
          
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = routeNames[value] || value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ');
          
          return (
            <React.Fragment key={to}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="hidden md:block">
                    <Link to={to}>{displayName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbDinamico;