import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import http from 'http'; // 🔥 IMPORTAR HTTP
import { Server } from 'ws'; // 🔥 IMPORTAR WEBSOCKET

// ... tus imports de routers
import { routerEquipo } from './router/equipo.Routes'
import { routerServicio } from './router/servicio.Routes'
import { routerCat } from './router/categoria.Routes';
import { routerProducto } from './router/producto.Routes';
import { routerTipDocument } from './router/tipo_documento.Routes';
import { routerMarca } from './router/marca.Routes';
import routerImg from './router/images.Routes';
import { routerUsuario } from './router/ususario.Routes';
import { routerRol } from './router/rol.Routes';
import { routerPermisos } from './router/permiso.Routes';
import { protectedRoute } from './router/protectedRoute';
import { routerLogin } from './router/authRouter';
import { routerTecnico } from './router/tecnicoRouter';
import { routerServicioEquipos } from './router/servicio_equipos.Routes';
import { routerMotivoIngreso } from './router/motivo_ingreso.Routes';
import { routerCliente } from './router/cliente.Routes';
import { routerReportes } from './router/reporte.Routes';
import { routerEmail } from './router/emailRouter';
import routerPermiso from './router/rol_permiso.Routes';
// ... otros imports

const PORT = process.env.PORT || 3005
const app = express()

// 🔥 CREAR SERVIDOR HTTP
const server = http.createServer(app);

// 🔥 CONFIGURAR WEBSOCKET EN EL MISMO SERVIDOR
const wss = new Server({ server });

const clients = new Set<any>();

wss.on('connection', (ws) => {
    console.log('✅ Cliente WebSocket conectado');
    clients.add(ws);

    ws.on('message', (message: string) => {
        console.log('📨 Mensaje recibido:', message);
    });

    ws.on('close', () => {
        console.log('❌ Cliente WebSocket desconectado');
        clients.delete(ws);
    });
});

// 🔥 FUNCIONES WEBSOCKET PARA EXPORTAR
export function broadcast(data: any): void {
    const message = JSON.stringify(data);
    clients.forEach(client => {
        if (client.readyState === 1) { // OPEN
            client.send(message);
        }
    });
}

export function emitNuevoServicio(servicioData: any): void {
    console.log('🔥 Emitiendo SERVICIO_CREADO:', servicioData);
    broadcast({
        type: 'SERVICIO_CREADO',
        servicio: servicioData,
        timestamp: new Date().toISOString()
    });
}

export function emitServicioActualizado(servicioId: number, nuevoEstado: number | null, servicioData: any = null): void {
    console.log('🔥 Emitiendo SERVICIO_ACTUALIZADO:', { servicioId, nuevoEstado });
    broadcast({
        type: 'SERVICIO_ACTUALIZADO',
        servicioId: servicioId,
        nuevoEstado: nuevoEstado,
        servicio: servicioData,
        timestamp: new Date().toISOString()
    });
}

export function emitServicioEntregado(servicioId: number, servicioData: any = null): void {
    console.log('🔥 Emitiendo SERVICIO_ENTREGADO:', servicioId);
    broadcast({
        type: 'SERVICIO_ENTREGADO',
        servicioId: servicioId,
        servicio: servicioData,
        timestamp: new Date().toISOString()
    });
}

// En tu index.ts - AGREGA ESTOS LOGS
wss.on('connection', (ws) => {
    console.log('✅ Cliente WebSocket conectado');
    clients.add(ws);

    // 🔥 NUEVO: Enviar mensaje de prueba al conectar
    ws.send(JSON.stringify({
        type: 'CONEXION_EXITOSA',
        message: 'Conexión WebSocket establecida',
        timestamp: new Date().toISOString()
    }));

    ws.on('message', (message: string) => {
        console.log('📨 Mensaje recibido del cliente:', message);
    });

    ws.on('close', () => {
        console.log('❌ Cliente WebSocket desconectado');
        clients.delete(ws);
    });
});

// 🔥 NUEVO: Función para probar manualmente
export function testWebSocket() {
    broadcast({
        type: 'TEST_MESSAGE',
        message: 'Este es un mensaje de prueba del WebSocket',
        timestamp: new Date().toISOString()
    });
}

// MIDLEWAR
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// RUTAS DE LOS ENDPOINTS
app.use("/api/servicio", routerCat)
app.use("/api/servicio", routerProducto)
app.use("/api/servicio", routerEquipo)
app.use("/api/servicio", routerMarca)
app.use("/api/servicio", routerTipDocument)
app.use("/api/servicio", routerCliente)
app.use("/api/servicio", routerMotivoIngreso)
app.use("/api/servicio", routerServicioEquipos)
app.use("/api/servicio", routerTecnico)
app.use("/api/servicio", routerLogin)
app.use("/api/servicio", protectedRoute)
app.use("/api/servicio", routerPermisos)
app.use("/api/servicio", routerPermisos)
app.use("/api/servicio", routerRol)
app.use("/api/servicio", routerUsuario)
app.use("/api/servicio", routerImg)
app.use("/api/servicio", routerServicio)
app.use("/api/servicio", routerReportes)
app.use("/api/servicio", routerPermiso)

app.use("/api/servicio", routerEmail)

// 🔥 INICIAR SERVIDOR COMBINADO
server.listen(PORT, () => {
    console.log(`🚀 Servidor Express en http://localhost:${PORT}`)
    console.log(`📡 WebSocket Server en ws://localhost:${PORT}`)
})