import { coneccion } from "../config/conexion"
import { ResultSetHeader } from 'mysql2'
import { v4 as uuidv4 } from 'uuid'
import { Brands } from "../interface/interface.type"

const cn = coneccion()

const newMarcaService = async (marca: Brands) => {
    // if (!marca.nombre) {
    //     return { status: 400, succes: false, mensaje: "Nombre de la marca es Obligatorio!" }
    // }
    try {
        const idMarca = uuidv4()
        const [result] = await cn.promise().query<ResultSetHeader>(
            "CALL add_marca(?,?)",
            [idMarca, marca.nombre]
        )

        if (result.affectedRows === 1) {
            return {
                status: 201,
                succes: true,
                mensaje: "Marca guardado exitosamente"
            }
        } else {
            return {
                status: 400,
                succes: false,
                mensaje: "No se pudo guardar la marca, filas afectadas: " + result.affectedRows,
                result: result
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

export { newMarcaService }