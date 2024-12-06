import { coneccion } from "../config/conexion"
import { ResultSetHeader } from "mysql2"
import { Service_equipment } from "../interface/interface.type"
import { v4 as uuidv4 } from 'uuid'
import { createResponse } from "../utils/response"

const cn = coneccion()
const newServicioEquipos = async (servicio_equipos: Service_equipment) => {

    try {
        const idservicioequipos = uuidv4()
        const [result] = await cn.promise().query<ResultSetHeader>("CALL add_servicioEquipos(?,?,?,?,?,?)",
            [idservicioequipos, servicio_equipos.EQUIPO_idequipo, servicio_equipos.marca_idMarca, servicio_equipos.modelo, servicio_equipos.serie, servicio_equipos.codigo_barras]
        )
        if (result.affectedRows === 1) {
            return createResponse(201, true, "Servicio equipos creado exitosamnete!")
        } else {
            return createResponse(400, false, "No se pudo guardar el Servicio equipos, filas afectadas: " + result.affectedRows, result)
        }
    } catch (error) {
        return createResponse(500, false, "Error en el servidor o en la base de datos MYSQL.", error)
    }

}

export { newServicioEquipos }