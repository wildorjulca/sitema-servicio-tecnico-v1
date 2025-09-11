import { Request, Response } from "express";
import { listServicio_equipo } from "../service/servicio_equipos.Service";

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

export { getAllServicioEquipoCTRL };