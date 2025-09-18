import { Request, Response } from "express";
import { createServicioEquipo, deleteServicioEquipo, listServicio_equipo, updateServicioEquipo } from "../service/servicio_equipos.Service";
import { ServicioEquipo } from "../interface";


const getAllServicioEquipoCTRL = async (req: Request, res: Response) => {
  const usuarioId = Number(req.params.usuarioId) || 0;
  const pageIndex = Number(req.query.pageIndex) || 0;
  const pageSize = Number(req.query.pageSize) || 10;

  // Solo filtro por marca (convertido a número)
  const filtroMarca = req.query.filtroMarca ? Number(req.query.filtroMarca) : null;

  const response = await listServicio_equipo(
    usuarioId,
    pageIndex,
    pageSize,
    filtroMarca  // Solo enviamos este parámetro
  );

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




export { getAllServicioEquipoCTRL, createServicioEquipoCTRL, updateServicioEquipoCTRL, deleteServicioEquipoCTRL };