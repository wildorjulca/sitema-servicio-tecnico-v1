import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import Login from '@/pages/auth/Login';
import ServicioLayout from '@/pages/dashboard/servicio/ServicioLayout';
import { Marca } from '@/pages/dashboard/marca';
import ProtectedRoute from './ProtectedRoute';
import Error404 from './error404';
import { Equipo } from '@/pages/dashboard/equipo';
import { Tipo_doc } from '@/pages/dashboard/tipo_doc';
import { Permiso } from '@/pages/dashboard/permisos';
import { Roles } from '@/pages/dashboard/rol';
import { Motivo_Ingreso } from '@/pages/dashboard/motivo_ingreso';
import { Cliente } from '@/pages/dashboard/cliente';
import { Categoria } from '@/pages/dashboard/categoria';
import Panel from '@/pages/dashboard';
import Perfil from '@/pages/dashboard/user-info';
import Documentacion from '@/pages/dashboard/document/documentacion';
import { Usuarios } from '@/pages/dashboard/usuarios';
import { Producto } from '@/pages/dashboard/producto/ui';
import { DetalleProducto } from '@/pages/dashboard/producto/ui/detalleProducto';
import { ProductLayout } from '@/pages/dashboard/producto/outlet';
import Listar_Servicio from '@/pages/dashboard/servicio/pages/list/Listar_Servicio';
import New_Service from '@/pages/dashboard/servicio/pages/new/New_service';
import Servicio_Equipos from '@/pages/dashboard/servicio_equipos';
import Estado_serv from '@/pages/dashboard/estado_serv/estado_serv';
import { DetalleService } from '@/pages/dashboard/servicio/pages/list/ui/detalleService';
import ReparacionPage from '@/pages/dashboard/servicio/pages/repare/ReparacionPage';
import { ImprimirServicio } from '@/pages/dashboard/servicio/pages/print/ImprimirServicio';
import { ReportesDashboard } from '@/pages/dashboard/report/ReportesDashboard';
import { AlertasPanel } from '@/pages/dashboard/alerts/AlertasPanel';
import AsignarRol from '@/pages/dashboard/rol/AsignarRol';
import TecnicoReporte from '@/pages/dashboard/report/tecnico/TecnicoReporte';

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
                    {/* ruta inicial  */}
                    <Route index element={<Panel />} />

                    {/* Rutas hijas del Dashboard */}

                    <Route path="cliente" element={<Cliente />} />
                    <Route path="marca" element={<Marca />} />
                    <Route path="equipo" element={<Equipo />} />
                    <Route path="cat" element={<Categoria />} />
                    <Route path="tipo_doc" element={<Tipo_doc />} />
                    <Route path="mot_ingreso" element={<Motivo_Ingreso />} />
                    <Route path="serv_e" element={<Servicio_Equipos />} />
                    <Route path="estado" element={<Estado_serv />} />
                    <Route path="users" element={<Usuarios />} />




                    <Route path="producto" element={<ProductLayout />}>
                        <Route index element={<Producto />} />
                        <Route path=":id" element={<DetalleProducto />} />
                    </Route>


                    <Route path="settings" element={<div>Settings</div>} />

                    <Route path="servicio" element={<ServicioLayout />}>

                    </Route>


                    <Route path="list" element={<ServicioLayout />}>
                        <Route index element={<Listar_Servicio />} />
                        <Route path=":id">
                            <Route index element={<DetalleService />} />
                            <Route path="reparacion" element={<ReparacionPage />} />
                            <Route path="imprimir" element={<ImprimirServicio />} />
                        </Route>
                    </Route>

                    {/* <Route path="list" element={<Listar_Servicio />} /> */}

                    <Route path="new" element={<New_Service />} />









                    <Route path="permiso" element={<Permiso />} />
                    <Route path="tecnico" element={<TecnicoReporte />} />
                    <Route path="roles" element={<Roles />} />
                    <Route path="asiganrol" element={<AsignarRol />} />


                    <Route path="perfil" element={<Perfil />} />

                    <Route path="Report" element={<ReportesDashboard />} />
                    <Route path="notif" element={<AlertasPanel />} />



                    <Route path="documentacion" element={<Documentacion />} />


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
