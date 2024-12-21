import { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2'
import { v4 as uuidv4 } from 'uuid'
import { coneccion } from "../config/conexion"
import { Customer } from "../interface/interface.type"
const cn = coneccion()

const newClienteService = async (cliente: Customer) => {
    try {
        const idCliente = uuidv4()
        const [result] = await cn.promise().query<ResultSetHeader>("CALL add_cliente(?,?,?,?,?,?)",
            [idCliente, cliente.nombre, cliente.TIPO_DOCUMENTO_cod_tipo, cliente.numero_documento, cliente.direccion, cliente.telefono]
        )
        if (result.affectedRows === 1) {
            return {
                status: 201,
                succes: true,
                mensaje: "Cliente Guardado exitosamente!"
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
            mensaje: "Error de servidor o en la base de datos",
            error: error
        }
    }
}

const getAllClienteService = async (filtro: string) => {
    try {
        const [result] = await cn
            .promise()
            .query<[RowDataPacket[], ResultSetHeader]>("CALL getAllCliente(?)", [filtro]);

        const customers: Customer[] = result[0] as Customer[];
        if (customers.length > 0) {
            return { status: 200, succes: true, data: customers };
        }
        return { status: 404, succes: false, data: [], mensaje: "Datos no encontrador | datos no econtrados" };
    } catch (error) {
        return {
            status: 500,
            success: false,
            mensaje: "Error de servidor o en la base de datos",
            error: error,
        };
    }
};

export { newClienteService, getAllClienteService }