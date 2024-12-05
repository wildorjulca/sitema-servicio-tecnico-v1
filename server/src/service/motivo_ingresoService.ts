import { coneccion } from "../config/conexion"
import { v4 as uuidv4 } from 'uuid'
import { ResultSetHeader } from 'mysql2'
import { REASON_FOR_ADMISSION } from "../interface/interface.type"
import { createResponse } from "../utils/response"
const cn = coneccion()

const newMotivo_ingreso = async (motivo_ingreso: REASON_FOR_ADMISSION) => {
    try {
        const idMOTIVO_INGRESO = uuidv4()
        const [result] = await cn.promise().query<ResultSetHeader>("CALL add_motvoIngreso(?,?,?)",
            [idMOTIVO_INGRESO, motivo_ingreso.descripcion, motivo_ingreso.precio_cobrar]
        )
        if (result.affectedRows === 1) {
            return createResponse(201, true, "Motivo ingreso guardado exitosamente")
        } else {
            return createResponse(400, false, "No se pudo guardar la marca, filas afectadas: " + result.affectedRows, result)
        }
    } catch (error) {
        return createResponse(500, false, "Error en el servidor o en la base de datos MYSQL.", error);
    }


}

export { newMotivo_ingreso }