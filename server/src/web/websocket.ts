// // server/src/web/websocket.ts
// import { Server } from 'ws';

// const wss = new Server({ port: 3005 });
// const clients = new Set<any>();

// wss.on('connection', (ws) => {
//     console.log('Cliente WebSocket conectado');
//     clients.add(ws);

//     ws.on('message', (message: string) => {
//         console.log('Mensaje recibido:', message);
//     });

//     ws.on('close', () => {
//         console.log('Cliente WebSocket desconectado');
//         clients.delete(ws);
//     });
// });

// // 🔥 SOLUCIÓN: Solo una declaración de broadcast
// function broadcast(data: any): void {
//     const message = JSON.stringify(data);
//     clients.forEach(client => {
//         if (client.readyState === 1) { // OPEN state
//             client.send(message);
//         }
//     });
// }

// // Funciones específicas que USAN broadcast (no lo re-declaran)
// export function emitNuevoServicio(servicioData: any): void {
//     broadcast({
//         type: 'SERVICIO_CREADO',
//         servicio: servicioData,
//         timestamp: new Date().toISOString()
//     });
// }

// export function emitServicioActualizado(servicioId: number, nuevoEstado: number, servicioData: any = null): void {
//     broadcast({
//         type: 'SERVICIO_ACTUALIZADO',
//         servicioId: servicioId,
//         nuevoEstado: nuevoEstado,
//         servicio: servicioData,
//         timestamp: new Date().toISOString()
//     });
// }

// export function emitServicioEntregado(servicioId: number, servicioData: any = null): void {
//     broadcast({
//         type: 'SERVICIO_ENTREGADO',
//         servicioId: servicioId,
//         servicio: servicioData,
//         timestamp: new Date().toISOString()
//     });
// }

// // 🔥 ELIMINA esta segunda declaración de broadcast
// // export function broadcast(data: any): void { ... }