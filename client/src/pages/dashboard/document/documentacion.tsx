const Documentacion = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 flex items-center gap-2">
          📘 Documentación del Sistema Técnico
        </h1>

        {/* Introducción */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            Introducción
          </h2>
          <p className="leading-relaxed text-justify">
            Este documento corresponde a la <strong>documentación técnica</strong> 
            del sistema web desarrollado para <strong>INFORSYSTEMS COMPUTER S.A.C.</strong>, 
            una solución integral para la gestión de servicios técnicos, equipos, clientes, 
            inventario y reportes.  
          </p>
          <p className="leading-relaxed text-justify mt-3">
            El sistema ha sido construido bajo una arquitectura moderna con{" "}
            <strong>React + TypeScript</strong> en el frontend,{" "}
            <strong>Express + TypeScript</strong> en el backend,{" "}
            <strong>MySQL</strong> como base de datos y{" "}
            <strong>Socket.IO</strong> para comunicación en tiempo real. 
            Se implementa autenticación segura mediante{" "}
            <strong>JWT</strong> y <strong>Refresh Tokens</strong>, así como 
            interfaces optimizadas con <strong>Shadcn/UI</strong>.
          </p>
          <p className="leading-relaxed text-justify mt-3">
            Para su desarrollo se aplicaron <strong>metodologías ágiles</strong>, 
            combinando prácticas de <strong>Scrum</strong> y <strong>Kanban</strong>, 
            lo cual permitió un proceso iterativo e incremental, 
            con entregas continuas y priorización de requerimientos.
          </p>
        </section>

        {/* Índice de Módulos */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            📑 Índice de Módulos
          </h2>
          <ul className="list-decimal ml-6 space-y-1">
            <li>Módulo de Clientes</li>
            <li>Módulo de Reparaciones</li>
            <li>Módulo de Inventario</li>
            <li>Módulo de Estadísticas y Reportes</li>
            <li>Módulo de Roles y Usuarios</li>
          </ul>
        </section>

        {/* Módulo de Clientes */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-500 mb-2">
            👤 Módulo de Clientes
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Registrar clientes nuevos.</li>
            <li>Consultar historial de reparaciones.</li>
            <li>Gestión de tickets y seguimiento de servicios.</li>
          </ul>
        </section>

        {/* Módulo de Reparaciones */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-500 mb-2">
            🛠️ Módulo de Reparaciones
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Registrar equipos y asignar técnicos responsables.</li>
            <li>Actualizar estados de reparación en tiempo real.</li>
            <li>Notificaciones de avance de servicio.</li>
          </ul>
        </section>

        {/* Inventario */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-500 mb-2">
            📦 Módulo de Inventario
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Gestión de repuestos y equipos.</li>
            <li>Categorización de insumos.</li>
            <li>Control de stock con alertas.</li>
          </ul>
        </section>

        {/* Estadísticas y Reportes */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-500 mb-2">
            📊 Módulo de Estadísticas y Reportes
          </h2>
          <p>
            Generación de reportes detallados en PDF/Excel con filtros por 
            fechas, técnicos, clientes o estado de los equipos. 
            Incluye panel de métricas y gráficos en tiempo real.
          </p>
        </section>

        {/* Roles y Seguridad */}
        <section>
          <h2 className="text-xl font-semibold text-blue-500 mb-2">
            🔐 Módulo de Roles y Seguridad
          </h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Gestión de usuarios y roles con diferentes permisos.</li>
            <li>Autenticación segura con JWT y Refresh Tokens.</li>
            <li>Monitoreo de sesiones activas.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Documentacion;
