import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import Login from '@/pages/auth/Login';
import ClientePage from '@/pages/dashboard/cliente/ClientePage';
import ServicioLayout from '@/layouts/ServicioLayout';
import SearchClientService from '@/pages/dashboard/servicio/search-client-exist/page';
import { Marca } from '@/pages/dashboard/marca';
import ProtectedRoute from './ProtectedRoute';

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
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Rutas hijas del Dashboard */}
                    <Route path="cliente" element={<ClientePage />} />
                    <Route path="marca" element={<Marca />} />
                    <Route path="settings" element={<div>Settings</div>} />
                    <Route path="servicio" element={<ServicioLayout />}>
                        <Route index element={<div>Listado de servicios</div>} />
                        <Route path="new" element={<SearchClientService />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
