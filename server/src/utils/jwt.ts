import jwt from 'jsonwebtoken'
import 'dotenv/config'


export const generarToken = (payload: {}) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' }, (error, token) => {
            if (error) {
                console.error('Error al firmar el token:', error);
                reject(error);
            } else {
                resolve(token);
            }
        });
    });
};