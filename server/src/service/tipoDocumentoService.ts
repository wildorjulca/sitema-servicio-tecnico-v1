import { ResultSetHeader } from 'mysql2'
import { coneccion } from "../config/conexion"
import { Document_Type } from '../interface/interface.type'

const cn = coneccion()
const newTipoDocumento = async (tipo_documento: Document_Type) => {

}

export { newTipoDocumento }