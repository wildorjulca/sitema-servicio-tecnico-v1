import { coneccion } from "../config/conexion"
import { ResultSetHeader } from 'mysql2'
import {  v4 as uuidv4 } from 'uuid'
import { Equipment } from "../interface/interface.type"
const cn = coneccion()


const newEquipoService = async(equipo: Equipment) => {
    if(!equipo.nombreequipo){
        return {status: 400, succes: false,mensaje: "el nombre del equipo es obligatorio!"}
    }
    try {
        const idequipo = uuidv4()
        const [result] = await cn.promise().query<ResultSetHeader>(
            "CALL add_equipo(?,?)",
            [idequipo,equipo.nombreequipo]
        )
        if(result.affectedRows === 1){
            return {
                status: 201,
                succes: true,
                mensaje: "Equipo guardado exitosamente!"
            }
        }else{
            return {
                status: 400,
                succes: false,
                mensaje: "No se pudo guardar el equipo. Verifica los datos enviados"
            }
        }
        
    } catch (error) {
        return {
            status: 500,
            succes: false,
            mensaje: "Error en la base de datos.",
            error: error
        }
        
    }


}

export { newEquipoService }