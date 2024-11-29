import { error } from "console"
import { ResultSetHeader } from 'mysql2'
import { coneccion } from "../config/conexion"
import { Category } from "../interface/interface.type"
const cn = coneccion()

const createCategoria = (categoria: Category) => {
    return new Promise((resolve, reject) => {
        cn.query<ResultSetHeader>("CALL add_categoria(?,?)", (err, result) => {
            if (err) {
                return reject({ status: 500, succes: false, mensaje: err.message, error: err })
            }
            if (result) {

            }
        })
    })


}

export { createCategoria }