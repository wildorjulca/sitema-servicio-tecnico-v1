import { ResultSetHeader } from 'mysql2'
import { v4 as uuidv4 } from 'uuid'
import { coneccion } from "../config/conexion"
import { Category } from "../interface/interface.type"
const cn = coneccion()

const createCategoria = async (categoria: Category) => {
    if (!categoria || !categoria.descripcion) {
        return {
            status: 400,
            success: false,
            mensaje: "El nombre de la categoría es obligatorio.",
        };
    }
    try {
        const idCATEGORIA = uuidv4()
        const [result] = await cn.promise().query<ResultSetHeader>(
            "CALL add_categoria(?,?)",
            [idCATEGORIA, categoria.descripcion]
        );

        if (result.affectedRows > 0) {
            return {
                status: 201,
                success: true,
                mensaje: "Categoría guardada exitosamente!",
            };
        } else {
            return {
                status: 400,
                success: false,
                mensaje: "No se pudo guardar la categoría. Verifica los datos enviados.",
            };
        }
    } catch (error: any) {
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos.",
            error: error.message,
        };
    }
};

export { createCategoria }