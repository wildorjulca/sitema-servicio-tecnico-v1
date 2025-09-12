import { Request, Response } from "express";
import { createServicioEquipo, deleteServicioEquipo, listServicio_equipo, updateServicioEquipo } from "../service/servicio_equipos.Service";
import { ServicioEquipo } from "../interface";
import { listEstadoServ, listServicio } from "../service/servicio.Service";


const getAllServicioCTRL = async (req: Request, res: Response) => {
  const usuarioId = Number(req.params.usuarioId) || 0;
  const pageIndex = Number(req.query.pageIndex) || 0;
  const pageSize = Number(req.query.pageSize) || 10;

  // Obtener los filtros que espera el SP
  const estadoId = req.query.estadoId ? Number(req.query.estadoId) : null;
  const clienteId = req.query.clienteId ? Number(req.query.clienteId) : null;

  const response = await listServicio(
    usuarioId,
    pageIndex,
    pageSize,
    estadoId,
    clienteId
  );

  res.status(response.status).json(response);
};

const getEstadoCTRL = async (req: Request, res: Response) => {
  const response = await listEstadoServ();
  res.status(response.status).json(response);
};

const createServicioEquipoCTRL = async (req: Request, res: Response) => {
  const servicioEquipo: ServicioEquipo = req.body;
  const response = await createServicioEquipo(servicioEquipo);
  res.status(response.status).json(response);
};

const updateServicioEquipoCTRL = async (req: Request, res: Response) => {
  const servicioEquipo: ServicioEquipo = req.body;
  const response = await updateServicioEquipo(servicioEquipo);
  res.status(response.status).json(response);
};

const deleteServicioEquipoCTRL = async (req: Request, res: Response) => {
  const idServicioEquipos = Number(req.params.idServicioEquipos);
  const usuarioId = Number(req.body.usuarioId);

  const response = await deleteServicioEquipo(idServicioEquipos, usuarioId);
  res.status(response.status).json(response);
};




export { getAllServicioCTRL, createServicioEquipoCTRL, updateServicioEquipoCTRL, deleteServicioEquipoCTRL,getEstadoCTRL };