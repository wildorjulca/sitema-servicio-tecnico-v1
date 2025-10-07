import { BookOpen, Code, Database, Shield, Cpu, Users, BarChart3, GitBranch, Calendar } from 'lucide-react';

const Documentacion = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Documentación del Sistema Técnico
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Solución integral para la gestión de servicios técnicos de INFORSYSTEMS COMPUTER S.A.C.
        </p>
      </div>

      {/* Introducción */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Cpu className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Introducción
          </h2>
        </div>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p className="flex items-start gap-3">
            <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
            <span>
              Este documento corresponde a la documentación técnica del sistema web desarrollado para <strong>INFORSYSTEMS COMPUTER S.A.C.</strong>, una solución integral para la gestión de servicios técnicos, equipos, clientes, inventario y reportes.
            </span>
          </p>

          <p className="flex items-start gap-3">
            <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
            <span>
              El sistema ha sido construido bajo una arquitectura moderna con <strong>React + TypeScript</strong> en el frontend, <strong>Express + TypeScript</strong> en el backend, <strong>MySQL</strong> como base de datos y <strong>Socket.IO</strong> para comunicación en tiempo real.
            </span>
          </p>

          <p className="flex items-start gap-3">
            <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
            <span>
              Se implementa autenticación segura mediante <strong>JWT</strong> y <strong>Refresh Tokens</strong>, así como interfaces optimizadas con <strong>Shadcn/UI</strong>.
            </span>
          </p>

          <p className="flex items-start gap-3">
            <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
            <span>
              Para su desarrollo se aplicaron <strong>metodologías ágiles</strong>, combinando prácticas de <strong>Scrum</strong> y <strong>Kanban</strong>, lo cual permitió un proceso iterativo e incremental, con entregas continuas y priorización de requerimientos.
            </span>
          </p>
        </div>
      </section>

      {/* Stack Tecnológico */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-50 rounded-lg">
            <Code className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Stack Tecnológico
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Frontend</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                React 18 + TypeScript
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Tailwind CSS + Shadcn/UI
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                React Query & Axios
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Backend & Base de Datos</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Node.js + Express + TypeScript
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                MySQL con relaciones avanzadas
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Socket.IO para tiempo real
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Características Principales */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Características Principales
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Gestión de Clientes</h3>
            <p className="text-sm text-gray-600">Administración completa de información de clientes y equipos</p>
          </div>

          <div className="text-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Seguridad</h3>
            <p className="text-sm text-gray-600">Autenticación JWT con refresh tokens y roles</p>
          </div>

          <div className="text-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Reportes</h3>
            <p className="text-sm text-gray-600">Reportes avanzados y dashboards en tiempo real</p>
          </div>
        </div>
      </section>

      {/* Footer con información del proyecto */}
      <footer className="border-t border-gray-200 pt-8 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">2025</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <GitBranch className="w-4 h-4" />
              <span className="text-sm">v1.0.0</span>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600 mb-2">
              © 2025 INFORSYSTEMS COMPUTERS S.A.C. - Todos los derechos reservados
            </p>
            <div className="flex items-center justify-center md:justify-end gap-4">
              <a
                href="https://github.com/user12cx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                GitHub Repository
              </a>
              <a
                href="https://portafolio-one-silk.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-700 transition-colors"
              >
                Visitar Sitio
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Documentacion;