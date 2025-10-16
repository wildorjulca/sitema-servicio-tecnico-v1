import { coneccion } from "../config/conexion"
import { ServiceFilterParams, StatsFilterParams, Tecnico } from "../interface"
import { RowDataPacket } from 'mysql2'

const cn = coneccion()

const tecnicoFiltre = async (filters: ServiceFilterParams) => {
    try {
        const { tecnico_id, estado_id, fecha_desde, fecha_hasta } = filters
        
        console.log('Filtros recibidos en service:', { tecnico_id, estado_id, fecha_desde, fecha_hasta });

        // Convertir valores undefined a null para MySQL
        const params = [
            tecnico_id || null,
            estado_id || null, 
            fecha_desde || null,
            fecha_hasta || null
        ];

        const [result] = await cn.promise().query<RowDataPacket[]>(
            "CALL sp_servicios_por_tecnico(?,?,?,?)", 
            params
        )

        const servicios = result[0] || []

        return { 
            status: 200, 
            success: true, 
            mensaje: "Servicios filtrados exitosamente", 
            data: servicios,
            total: servicios.length
        }

    } catch (error: any) {
        console.error('Error en tecnicoFiltre:', error);
        return {
            status: 500,
            success: false,
            mensaje: "Error de servidor o en la base de datos",
            error: error.message
        }
    }
}

const estadisticas = async (filters: StatsFilterParams) => {
    try {
        const { tecnico_id, fecha_desde, fecha_hasta } = filters
        
        console.log('Filtros estadísticas:', { tecnico_id, fecha_desde, fecha_hasta });

        // Convertir valores undefined a null para MySQL
        const params = [
            tecnico_id || null,
            fecha_desde || null,
            fecha_hasta || null
        ];

        const [result] = await cn.promise().query<RowDataPacket[]>(
            "CALL sp_estadisticas_tecnico(?,?,?)",
            params
        )

        const estadisticas = result[0] || []

        return { 
            status: 200, 
            success: true, 
            mensaje: "Estadísticas obtenidas exitosamente", 
            data: estadisticas
        }

    } catch (error: any) {
        console.error('Error en estadisticas:', error);
        return {
            status: 500,
            success: false,
            mensaje: "Error de servidor o en la base de datos",
            error: error.message
        }
    }
}

const listarTecnicos = async () => {
    try {
        const [result] = await cn.promise().query<RowDataPacket[]>(
            "CALL sp_listar_tecnicos()"
        )

        const tecnicos = result[0] as Tecnico[] || []

        return { 
            status: 200, 
            success: true, 
            mensaje: "Técnicos obtenidos exitosamente", 
            data: tecnicos,
            total: tecnicos.length
        }

    } catch (error: any) {
        console.error('Error en listarTecnicos:', error);
        return {
            status: 500,
            success: false,
            mensaje: "Error de servidor o en la base de datos",
            error: error.message
        }
    }
}

export { tecnicoFiltre, estadisticas, listarTecnicos }