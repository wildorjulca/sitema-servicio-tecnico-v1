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

// controllers/usuario.controller.ts - CORREGIR
const updateUserCTRL = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = req.body;

    console.log("🔍 BACKEND - updateUserCTRL:");
    console.log("Body completo:", userData);
    console.log("userData.id:", userData.id);
    console.log("userData.usuarioId:", userData.usuarioId);
    console.log("Tipo de userData.id:", typeof userData.id);
    console.log("Tipo de userData.usuarioId:", typeof userData.usuarioId);

    // ✅ MODIFICAR VALIDACIÓN - mostrar valores específicos
    if (!userData.id || !userData.usuarioId) {
      console.log("❌ VALIDACIÓN FALLIDA:");
      console.log("userData.id es falsy?:", !userData.id);
      console.log("userData.usuarioId es falsy?:", !userData.usuarioId);
      console.log("userData.id valor:", userData.id);
      console.log("userData.usuarioId valor:", userData.usuarioId);

      res.status(400).json({
        status: 400,
        success: false,
        mensaje: `Los campos id y usuarioId son obligatorios. id: ${userData.id}, usuarioId: ${userData.usuarioId}`
      });
      return;
    }

    console.log("✅ Validación pasada, llamando a updateUser...");
    const result = await updateUser(userData);
    res.status(result.status).json(result);
  } catch (error) {
    console.error("❌ Error en controller:", error);
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