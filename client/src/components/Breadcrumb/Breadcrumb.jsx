import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon } from '@radix-ui/react-icons';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Mapeo de rutas a nombres legibles
  const routeNames = {
    'dashboard': 'Inicio',
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

  return (
    <div className="breadcrumb-container">
      <nav className="breadcrumb">
        <ol className="breadcrumb-list">
          <li className="breadcrumb-item">
            <Link to="/dashboard" className="breadcrumb-link">
              <HomeIcon className="breadcrumb-home-icon" />
            </Link>
          </li>
          
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = routeNames[value] || value.charAt(0).toUpperCase() + value.slice(1);
            
            return (
              <li key={to} className="breadcrumb-item">
                <ChevronRightIcon className="breadcrumb-separator" />
                {isLast ? (
                  <span className="breadcrumb-current">{displayName}</span>
                ) : (
                  <Link to={to} className="breadcrumb-link">
                    {displayName}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;