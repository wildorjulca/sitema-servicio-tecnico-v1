import { ResultSetHeader } from 'mysql2'
import { coneccion } from "../config/conexion"
import { Document_Type } from '../interface/interface.type'
const cn = coneccion()
const newTipoDocumento = async (tipo_documento: Document_Type) => {
    try {
        const [result] = await cn.promise().query<ResultSetHeader>
            ("CALL add_tipoDocumento(?,?,?)",
                [tipo_documento.cod_tipo, tipo_documento.nombre_tipo, tipo_documento.cant_digitos]

            )
        if (result.affectedRows === 1) {
            return {
                status: 201,
                succes: true,
                mensaje: "Tipo documento guardado con exito"
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
            mensaje: "Error en la base de datos",
            error: error
        }

    }

}

export { newTipoDocumento }