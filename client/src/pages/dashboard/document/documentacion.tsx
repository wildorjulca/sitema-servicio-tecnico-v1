
const Documentacion = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📘 Documentación del Sistema</h1>

      <h2 className="text-xl font-semibold mt-4">Introducción</h2>
      <p>
        Este sistema de servicio técnico permite gestionar clientes, equipos,
        reparaciones, inventario y reportes.
      </p>

      <h2 className="text-xl font-semibold mt-4">Módulo de Clientes</h2>
      <ul className="list-disc ml-6">
        <li>Registrar clientes nuevos</li>
        <li>Consultar historial de reparaciones</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">Módulo de Reparaciones</h2>
      <ul className="list-disc ml-6">
        <li>Registrar equipos y asignar técnicos</li>
        <li>Actualizar estados de reparación</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">Reportes</h2>
      <p>Generar reportes en PDF/Excel con filtros por fechas.</p>
    </div>

    
  );
};

export default Documentacion;
