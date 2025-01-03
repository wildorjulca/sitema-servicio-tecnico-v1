// conexion.ts
// import mysql from 'mysql2';

// export const coneccion = () => {
//     const cn = mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         port: 3306,
//         password: '',
//         database: 'db_servicio',
//         waitForConnections: true,
//         connectionLimit: 10,
//         queueLimit: 0,
//         charset: 'utf8mb4' // Ajusta según sea necesario
//     });
//     return cn;
// };


import mysql from 'mysql2';

export const coneccion = () => {
    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            port: 3306,
            password: '',
            database: 'db_servicio',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            charset: 'utf8mb4', // Asegura compatibilidad con emojis y caracteres especiales
        });

        console.log("Conexión establecida exitosamente a la base de datos.");
        return pool;
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        throw error;
    }
};
