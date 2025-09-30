// server/websocket.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');
  clients.add(ws);

  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message);
  });

  ws.on('close', () => {
    console.log('Cliente WebSocket desconectado');
    clients.delete(ws);
  });
});

// Función para broadcast a todos los clientes
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Ejemplo: Emitir cuando un servicio se actualiza
function emitServicioActualizado(servicioId, nuevoEstado) {
  broadcast({
    type: 'SERVICIO_ACTUALIZADO',
    servicioId,
    nuevoEstado,
    timestamp: new Date().toISOString()
  });
}

function emitNuevoServicio(servicioData) {
  broadcast({
    type: 'SERVICIO_CREADO',
    servicio: servicioData,
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  broadcast,
  emitServicioActualizado,
  emitNuevoServicio
};