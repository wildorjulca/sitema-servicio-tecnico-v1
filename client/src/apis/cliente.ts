import { Clientes, ClienteEdit } from "@/interface";
import { instance } from "@/lib/axios";

// ----------------------
// Listar cliente
// ----------------------
export const fetchCliente = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10
) => {
  try {
    const response = await instance.get<{
      data: Clientes[];
      total: number;
    }>(`/getAllCliente/${usuarioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`);

    const { data, total } = response.data;

    console.log("cleintes obtenidos:", { data, total });
    return { data, total };
  } catch (error) {
    console.error("Error al obtener los cleintes:", error);
    throw error;
  }
};


export const addClienteAPI = async ({ nombre, apellidos, tipo_doc_id, numero_documento, direccion, telefono, usuarioId }: ClienteEdit) => {
  try {
    const response = await instance.post("/addCli", { nombre, apellidos, tipo_doc_id, numero_documento, direccion, telefono, usuarioId });
    console.log("Cliente agregada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al agregar Cliente:", error);
    throw error;
  }
}

// ----------------------
// Actualizar motivo ingreso
// ----------------------

// CORREGIR: La función debe aceptar un objeto, no parámetros destructurados
export const editClienteAPI = async (clienteData: ClienteEdit) => {
  try {
    console.log("➡️ editcliente payload:", clienteData);
    const response = await instance.put(`/updateCli`, clienteData);
    console.log("cliente actualizado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al editar cliente:", error);
    throw error;
  }
}
// ----------------------
// Eliminar motivo ingreso
// ----------------------
export const deleteClienteAPI = async (id: number, usuarioId: number) => {
  try {
    const response = await instance.delete(`/deleteCli/${id}`, { data: { usuarioId } });
    console.log("Cliente eliminado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar cleinte:", error);
    throw error;
  }
}
