import { coneccion } from "../config/conexion"
import { Technical } from "../interface"
import { ResultSetHeader } from 'mysql2'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { createResponse } from "../utils/response"
import { generarToken } from "../utils/jwt"
import { response } from "express"
const cn = coneccion()

const registerUser = async (tecnico: Technical) => {
    try {
        const idTecnico = uuidv4()
        // const password = bcryptjs.hashSync(tecnico.password, 10)

        const [result] = await cn.promise().query<ResultSetHeader>("CALL add_tecnico(?,?,?,?,?,?)", [
            idTecnico, tecnico.nombre, tecnico.dni, tecnico.celular, tecnico.usuario, tecnico.password])

        if (result.affectedRows === 1) {
            return { status: 201, succes: true, memsaje: "Tecnico guardado exitosamente", idUsuario: idTecnico }
        }

    } catch (error) {
        return {
            status: 500,
            succes: false,
            mensaje: "Error de servidor o en la base de datos",
            error: error
        }
    }

}


export { registerUser }