// hooks/useNotificaciones.ts
import { useState, useEffect } from 'react';
import { useAlertasInventarioHook } from './useReporte';
import toast from 'react-hot-toast';

// Almacenar IDs de alertas ya mostradas
const ALERTAS_MOSTRADAS_KEY = 'alertas_mostradas';

export const useNotificaciones = () => {
    const { data: alertas, isLoading } = useAlertasInventarioHook();
    const [alertasMostradas, setAlertasMostradas] = useState<Set<string>>(new Set());

    // Cargar alertas ya mostradas al iniciar
    useEffect(() => {
        const stored = localStorage.getItem(ALERTAS_MOSTRADAS_KEY);
        if (stored) {
            setAlertasMostradas(new Set(JSON.parse(stored)));
        }
    }, []);

    // Mostrar toasts para nuevas alertas de stock agotado
    useEffect(() => {
        if (!alertas || isLoading) return;

        const nuevasAlertas = alertas.filter(alerta =>
            alerta.severidad === 'error' &&
            !alertasMostradas.has(`${alerta.id}-${alerta.tipo_alerta}`)
        );

        nuevasAlertas.forEach(alerta => {
            // Toast persistente para stock agotado
            toast.error(
                <div className="flex items-center gap-3 max-w-sm">
                    <div className="flex-shrink-0">
                        <span className="text-sm">⚠️</span>

                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 justify-between mb-1">
                            <strong className="text-sm font-semibold truncate flex-1">{alerta.nombre}</strong>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            Stock agotado
                        </p>
                    </div>
                </div>,
                {
                    id: `alerta-${alerta.id}`,
                    duration: 2000,
                    position: 'top-right',
                    style: {
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        maxWidth: '380px'
                    }
                }
            );

            // Marcar como mostrada
            const nuevaKey = `${alerta.id}-${alerta.tipo_alerta}`;
            const nuevasMostradas = new Set([...alertasMostradas, nuevaKey]);
            setAlertasMostradas(nuevasMostradas);
            localStorage.setItem(ALERTAS_MOSTRADAS_KEY, JSON.stringify([...nuevasMostradas]));
        });

    }, [alertas, alertasMostradas, isLoading]);

    // Contar alertas no leídas (para el badge)
    const alertasNoLeidas = alertas?.filter(alerta =>
        !alertasMostradas.has(`${alerta.id}-${alerta.tipo_alerta}`)
    ).length || 0;

    // Contar alertas por severidad
    const contarAlertasPorTipo = () => {
        if (!alertas) return { error: 0, warning: 0, info: 0 };

        return {
            error: alertas.filter(a => a.severidad === 'error').length,
            warning: alertas.filter(a => a.severidad === 'warning').length,
            info: alertas.filter(a => a.severidad === 'info').length
        };
    };

    // Marcar todas como leídas
    const marcarTodasComoLeidas = () => {
        if (!alertas) return;

        const todasLasKeys = alertas.map(alerta => `${alerta.id}-${alerta.tipo_alerta}`);
        const nuevoSet = new Set([...alertasMostradas, ...todasLasKeys]);
        setAlertasMostradas(nuevoSet);
        localStorage.setItem(ALERTAS_MOSTRADAS_KEY, JSON.stringify([...nuevoSet]));
    };

    return {
        alertas,
        alertasNoLeidas,
        contarAlertasPorTipo,
        marcarTodasComoLeidas,
        isLoading
    };
};