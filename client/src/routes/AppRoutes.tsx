import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import Login from '@/pages/auth/Login';
import ProtectedRoute from '@/components/protected-route';

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
                    <Route path="cliente" element={"cliente"} />
                    <Route path="settings" element={"setting"} />
                    {/* Agrega más rutas hijas según sea necesario */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
