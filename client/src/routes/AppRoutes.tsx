import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import Login from '@/pages/auth/Login';
import ProtectedRoute from '@/components/protected-route';
import ClientePage from '@/pages/dashboard/cliente/ClientePage.tsx';
import ServicioLayout from '@/layouts/ServicioLayout';
import PageServicio from '@/pages/dashboard/servicio/pageServicio';
import IndexElement from '@/pages/dashboard/servicio/indexElement';
import TablePoducts from '@/pages/dashboard/servicio/table-products';


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta inicial */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Ruta de Login */}
                <Route path="/login" element={<Login />} />

                {/* Ruta protegida para el Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Rutas hijas dentro de /dashboard */}
                    <Route path="cliente" element={<ClientePage />} />
                    <Route path="settings" element={"setting"} />
                    <Route path="servicio" element={<ServicioLayout />}>
                        <Route index element={"listado de servicio"} /> {/* Ruta inicial */}
                        {/* <Route path="nuevo" element={<ServicioNuevo />} > */}
                        <Route path="nuevo" element={<PageServicio />} >
                            <Route index element={<IndexElement />} />
                            <Route path='paso2' element={<TablePoducts />} />
                            <Route path='paso3' element={"paso 3"} />
                        </Route>
                    </Route>
                    {/* Agrega más rutas hijas según sea necesario */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
