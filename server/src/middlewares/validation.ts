import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validate = (req: Request, res: Response, next: NextFunction): any => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log("Errores de validación:", result.array());
    return res.status(400).json({ errors: result.array() });
  }
  next();
};

export { validate };