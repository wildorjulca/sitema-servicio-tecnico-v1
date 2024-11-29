// conexion.ts
import mysql from 'mysql2';

export const coneccion = () => {
    const cn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        port: 3306,
        password: '',
        database: 'db_restaurante',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
    return cn;
};
