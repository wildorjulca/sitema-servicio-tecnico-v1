import { Request, Response } from "express";
import { listTipoDoc } from "../service/tipoDocumento.Service";
import { listPermisosSistema } from "../service/permiso.Service";


const getAllPermisoCTRL = async (req: Request, res: Response) => {
  const usuarioId = Number(req.params.usuarioId) || 0;
  const pageIndex = Number(req.query.pageIndex) || 0; // opcional desde query
  const pageSize = Number(req.query.pageSize) || 10;   // opcional desde query

  const response = await listPermisosSistema(usuarioId, pageIndex, pageSize);
  res.status(response.status).json(response);
};

export { getAllPermisoCTRL }