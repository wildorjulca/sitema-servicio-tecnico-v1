import { Router } from 'express';
import { validate } from '../middlewares/validation';
import { guardarPermisosRolCTRL, listarPermisosRolCTRL } from '../controller/rol_permiso.Controller';

const routerPermiso = Router();

// ✅ LISTAR PERMISOS DE UN ROL
routerPermiso.post('/rol/:rol_id',listarPermisosRolCTRL);

// ✅ GUARDAR PERMISOS DE UN ROL (SOLO ADMIN)
routerPermiso.post('/rol/permisos/guardar', validate, guardarPermisosRolCTRL);

export default routerPermiso;