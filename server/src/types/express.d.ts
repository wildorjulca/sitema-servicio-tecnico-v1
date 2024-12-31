
import * as express from "express";

declare global {
    namespace Express {
        interface Request {
            user?: any; // Cambia `any` por el tipo adecuado si sabes cómo es `user`
        }
    }
}
