import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Save, Shield } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import { useRolHook } from '@/hooks/useRol';
import { useGuardarPermisos, usePermisosRol } from '@/hooks/useRol_Permiso';

const AsignarRol = () => {
    const { user } = useUser();
    const usuarioId = user?.id;
    const [rolSeleccionado, setRolSeleccionado] = useState<number>(0);
    const [permisosSeleccionados, setPermisosSeleccionados] = useState<number[]>([]);

    const { data: roles, isLoading: isLoadingRoles } = useRolHook(usuarioId);
    const { data: permisosData, isLoading: isLoadingPermisos } = usePermisosRol(rolSeleccionado);
    const { mutate: guardarPermisos, isPending: isGuardando } = useGuardarPermisos();

    const esAdmin = user?.rol === 'ADMIN';

    useEffect(() => {
        if (permisosData?.data) {
            const permisosActivos = permisosData.data
                .filter(permiso => permiso.tiene_permiso)
                .map(permiso => permiso.permiso_id);
            setPermisosSeleccionados(permisosActivos);
        }
    }, [permisosData]);

    const handleTogglePermiso = (permisoId: number) => {
        if (!esAdmin) {
            toast.error('Solo los administradores pueden modificar permisos');
            return;
        }

        setPermisosSeleccionados(prev =>
            prev.includes(permisoId)
                ? prev.filter(id => id !== permisoId)
                : [...prev, permisoId]
        );
    };

    const handleGuardarPermisos = () => {
        if (!rolSeleccionado) {
            toast.error('Selecciona un rol primero');
            return;
        }

        guardarPermisos({
            rol_id: rolSeleccionado,
            permisos: permisosSeleccionados
        });
    };

    const getNombreRolSeleccionado = () => {
        if (!roles || !rolSeleccionado) return '';
        const rol = roles.find(r => r.id === rolSeleccionado);
        return rol?.tipo_rol || '';
    };

    if (isLoadingRoles) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">Cargando roles...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto pl-3 space-y-3 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
            {/* ✅ HEADER SIMPLIFICADO */}
            <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Gestión de Permisos por Rol</span>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Asigna y gestiona los permisos para cada tipo de usuario</p>
                </div>
            </div>

            {/* ✅ SELECTOR DE ROLES */}
            <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {roles?.map(rol => (
                        <div
                            key={rol.id}
                            className={`
                                p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                                ${rolSeleccionado === rol.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 shadow-md'
                                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm'
                                }
                            `}
                            onClick={() => setRolSeleccionado(rol.id)}
                        >
                            <div className="flex items-center justify-between">
                                <span className={`font-medium text-sm ${
                                    rolSeleccionado === rol.id 
                                        ? 'text-blue-700 dark:text-blue-300' 
                                        : 'text-gray-700 dark:text-gray-200'
                                }`}>
                                    {rol.tipo_rol}
                                </span>
                                
                                {rol.tipo_rol === 'ADMIN' && (
                                    <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-0 text-xs">
                                        Admin
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ✅ LISTA DE PERMISOS */}
            {rolSeleccionado > 0 && (
                <div className="space-y-4">
                    <div className="border-b pb-3 dark:border-gray-700"></div>

                    {isLoadingPermisos ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400 dark:text-gray-500" />
                            <span className="ml-2 text-gray-500 dark:text-gray-400">Cargando permisos...</span>
                        </div>
                    ) : (
                        <div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
                            {permisosData?.data?.map(permiso => (
                                <div
                                    key={permiso.permiso_id}
                                    className={`
                                        flex flex-col p-2 rounded-lg border transition-all duration-200 min-h-[100px]
                                        ${!permiso.tiene_permiso && !esAdmin
                                            ? 'bg-gray-50 dark:bg-gray-800/50 opacity-70'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                                        }
                                        ${permisosSeleccionados.includes(permiso.permiso_id) 
                                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-200 dark:ring-blue-800' 
                                            : ''
                                        }
                                    `}
                                >
                                    {/* ✅ CHECKBOX Y BADGE COMPACTOS */}
                                    <div className="flex justify-between items-start mb-1">
                                        <Checkbox
                                            checked={permisosSeleccionados.includes(permiso.permiso_id)}
                                            onCheckedChange={() => handleTogglePermiso(permiso.permiso_id)}
                                            disabled={!esAdmin || !permiso.puede_editar}
                                            className="h-4 w-4"
                                        />
                                        <Badge 
                                            variant={permiso.tiene_permiso ? "default" : "outline"}
                                            className={`
                                                text-[10px] px-1 h-4
                                                ${permiso.tiene_permiso
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-0"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-0"
                                                }
                                            `}
                                        >
                                            {permiso.tiene_permiso ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </div>

                                    {/* ✅ CONTENIDO COMPACTO */}
                                    <div className="flex-1 space-y-1">
                                        <span className={`
                                            font-medium text-xs leading-tight block
                                            ${!permiso.tiene_permiso && !esAdmin
                                                ? 'text-gray-500 dark:text-gray-500'
                                                : 'text-gray-900 dark:text-gray-100'
                                            }
                                        `}>
                                            {permiso.permiso_nombre}
                                        </span>
                                        
                                        <p className={`
                                            text-[10px] text-gray-500 dark:text-gray-400 leading-tight line-clamp-2
                                            ${!permiso.tiene_permiso && !esAdmin
                                                ? 'text-gray-400 dark:text-gray-600'
                                                : 'text-gray-600 dark:text-gray-400'
                                            }
                                        `}>
                                            {permiso.permiso_descripcion}
                                        </p>
                                    </div>

                                    {/* ✅ INDICADOR DE SELECCIÓN COMPACTO */}
                                    {permisosSeleccionados.includes(permiso.permiso_id) && (
                                        <div className="mt-1 flex items-center justify-center space-x-1 pt-1 border-t border-blue-200 dark:border-blue-700">
                                            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Seleccionado</span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {permisosData?.data?.length === 0 && (
                                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                    <Shield className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                                    <p className="text-sm">No se encontraron permisos para este rol</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ✅ BOTÓN GUARDAR (SOLO ADMIN) */}
                    {esAdmin && rolSeleccionado > 0 && (
                        <div className="pt-4 border-t dark:border-gray-700">
                            <Button
                                onClick={handleGuardarPermisos}
                                disabled={isGuardando || isLoadingPermisos}
                                className="w-full sm:w-auto min-w-[180px]"
                                size="sm"
                            >
                                {isGuardando ? (
                                    <>
                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-3 w-3 mr-1" />
                                        Guardar Permisos
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* ✅ INFO PARA NO-ADMIN */}
            {!esAdmin && rolSeleccionado > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-blue-700 dark:text-blue-300 font-medium text-sm">Modo de solo lectura</span>
                    </div>
                    <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                        Solo los administradores pueden modificar los permisos. 
                        Estás viendo los permisos actuales asignados a cada rol.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AsignarRol;