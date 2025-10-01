import { Request, Response } from "express";
import { createUser, deleteUser, listUsers, updateUser } from "../service/usuario.Service";

const getAllUserCTRL = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = Number(req.params.usuarioId) || 0;
    const pageIndex = Number(req.query.pageIndex) || 0;
    const pageSize = Number(req.query.pageSize) || 10;

    const response = await listUsers(usuarioId, pageIndex, pageSize);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      mensaje: "Error interno del servidor"
    });
  }
};

const createUserCTRL = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = req.body;
    
    if (!userData.usuarioId) {
      res.status(400).json({
        status: 400,
        success: false,
        mensaje: "El campo usuarioId es obligatorio"
      });
      return;
    }

    const result = await createUser(userData);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      mensaje: "Error interno del servidor"
    });
  }
};

const updateUserCTRL = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = req.body;
    
    if (!userData.usuarioId) {
      res.status(400).json({
        status: 400,
        success: false,
        mensaje: "El campo usuarioId es obligatorio"
      });
      return;
    }

    const result = await updateUser(userData);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      mensaje: "Error interno del servidor"
    });
  }
};

const deleteUserCTRL = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { usuarioId } = req.body;
    
    if (!usuarioId) {
      res.status(400).json({
        status: 400,
        success: false,
        mensaje: "El campo usuarioId es obligatorio"
      });
      return;
    }

    const result = await deleteUser(parseInt(id), usuarioId);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      mensaje: "Error interno del servidor"
    });
  }
};

export { getAllUserCTRL, createUserCTRL, updateUserCTRL, deleteUserCTRL };