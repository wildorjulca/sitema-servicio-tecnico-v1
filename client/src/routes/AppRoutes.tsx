import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import Login from '@/pages/auth/Login';
import ServicioLayout from '@/layouts/ServicioLayout';
import SearchClientService from '@/pages/dashboard/servicio/search-client-exist/page';
import { Marca } from '@/pages/dashboard/marca';
import ProtectedRoute from './ProtectedRoute';
import Error404 from './error404';
import { Equipo } from '@/pages/dashboard/equipo';
import { Tipo_doc } from '@/pages/dashboard/tipo_doc';
import Producto from '@/pages/dashboard/producto';
import { Permiso } from '@/pages/dashboard/permisos';
import { Roles } from '@/pages/dashboard/rol';
import { Motivo_Ingreso } from '@/pages/dashboard/motivo_ingreso';
import { Cliente } from '@/pages/dashboard/cliente';
import { Categoria } from '@/pages/dashboard/categoria';

const NotFound = () => <div><Error404 /></div>;

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta raíz */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Login */}
                <Route path="/login" element={<Login />} />

                {/* Rutas protegidas */}
                <Route
                    path="/dashboard"
                    element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
                >
                    {/* Rutas hijas del Dashboard */}
                    <Route path="cliente" element={<Cliente />} />
                    <Route path="marca" element={<Marca />} />
                    <Route path="equipo" element={<Equipo />} />
                    <Route path="cat" element={<Categoria />} />
                    <Route path="tipo_doc" element={<Tipo_doc />} />
                    <Route path="mot_ingreso" element={<Motivo_Ingreso />} />
                    <Route path="producto" element={<Producto />} />
                    <Route path="settings" element={<div>Settings</div>} />
                    <Route path="servicio" element={<ServicioLayout />}>
                        <Route index element={<div>Listado de servicios</div>} />
                        <Route path="new" element={<SearchClientService />} />
                    </Route>
                    <Route path="permiso" element={<Permiso />} />
                    <Route path="roles" element={<Roles />} />
 
                    {/* Ruta para cuando no exista una ruta hija */}
                    <Route path="*" element={<NotFound />} />
                </Route>

                {/* Ruta global 404 para cualquier otra ruta que no sea /dashboard */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
