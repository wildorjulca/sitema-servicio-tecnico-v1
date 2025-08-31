import { Request, Response } from "express";
import { createCliente, deleteCliente, listClient, updateCliente } from "../service/cliente.Service";
import { Cliente } from "../interface";

// ----------------------
// Listar clientes
// ----------------------

const getAllClienteCTRL = async (req: Request, res: Response) => {
  const usuarioId = Number(req.params.usuarioId) || 0;
  const pageIndex = Number(req.query.pageIndex) || 0; // opcional desde query
  const pageSize = Number(req.query.pageSize) || 10;   // opcional desde query

  const response = await listClient(usuarioId, pageIndex, pageSize);
  res.status(response.status).json(response);
};

// ----------------------
// Crear equipo
// ----------------------
const addClienteCTRL = async (req: Request, res: Response) => {
    const cliente: Cliente = {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        tipo_doc_id: req.body.tipo_doc_id,
        numero_documento: req.body.numero_documento,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        usuarioId: req.body.usuarioId // asegúrate de enviar el id del usuario logueado
    };

    const response = await createCliente(cliente);
    res.status(response.status).json(response);
};

// ----------------------
// Actualizar equipo
// ----------------------
const updateClienteCTRL = async (req: Request, res: Response) => {
    const clienteAcc: Cliente = {
        idCliente: Number(req.body.idCliente),
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        tipo_doc_id: req.body.tipo_doc_id,
        numero_documento: req.body.numero_documento,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        usuarioId: req.body.usuarioId // asegúrate de enviar el id del usuario logueado
    };

    const response = await updateCliente(clienteAcc);
    res.status(response.status).json(response);
};

// ----------------------
// Eliminar equipo
// ----------------------
const deleteClienteCTRL = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const usuarioId = Number(req.body.usuarioId); // usuario que hace la acción

    const response = await deleteCliente(id, usuarioId);
    res.status(response.status).json(response);
};

export { getAllClienteCTRL, addClienteCTRL, updateClienteCTRL, deleteClienteCTRL }