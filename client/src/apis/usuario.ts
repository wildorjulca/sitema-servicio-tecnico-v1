import { instance } from "@/lib/axios";
import { PassThrough } from "stream";

// Definir la interfaz para los tipos de documento
export interface Users {
  id:number,
  nombre:string,
  apellidos:number,
  dni:number,
  telefono:number,
  usuario:string,
  password:PassThrough,
  rol_id:number
}


// ----------------------
// Listar usuarios
// ----------------------
export const fetchUsers = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10
) => {
  try {
    const response = await instance.get<{
      data: Users[];
      total: number;
    }>(`/getUser/${usuarioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`);

    const { data, total } = response.data;

    console.log("Tipos de documento obtenidos:", { data, total });
    return { data, total };
  } catch (error) {
    console.error("Error al obtener tipos de documento:", error);
    throw error;
  }
};
