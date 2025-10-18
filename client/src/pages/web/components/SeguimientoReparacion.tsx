import React, { useState } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from '@/components/ui/button';

const SeguimientoReparacion: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [showStatus, setShowStatus] = useState(false);

  // Función para validar y formatear el OTP
  const handleOtpChange = (value: string) => {
    // Convertir a mayúsculas y permitir solo letras y números
    const formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setOtp(formattedValue);
  };

  const handleConsultar = () => {
    if (otp.length === 6) {
      setShowStatus(true);
      // Aquí iría la llamada a tu API
      console.log('Código consultado:', otp);
    }
  };

  // Función para manejar el pegado de texto
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formattedText = pastedText.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setOtp(formattedText);
  };

  return (
    <section id="seguimiento" className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Seguimiento de Reparación
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Ingresa el código de seguimiento de tu equipo
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Código de Seguimiento (6 caracteres)
            </label>
            
            {/* Componente Shadcn UI Input OTP */}
            <div className="flex justify-center mb-2" onPaste={handlePaste}>
              <InputOTP 
                maxLength={6} 
                value={otp}
                onChange={handleOtpChange}
                pattern="[A-Z0-9]*"
                inputMode="text"
              >
                <InputOTPGroup>
                  <InputOTPSlot 
                    index={0} 
                    className="uppercase font-mono"
                  />
                  <InputOTPSlot 
                    index={1} 
                    className="uppercase font-mono"
                  />
                  <InputOTPSlot 
                    index={2} 
                    className="uppercase font-mono"
                  />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot 
                    index={3} 
                    className="uppercase font-mono"
                  />
                  <InputOTPSlot 
                    index={4} 
                    className="uppercase font-mono"
                  />
                  <InputOTPSlot 
                    index={5} 
                    className="uppercase font-mono"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <div className="text-center text-sm text-gray-500 mt-2 space-y-1">
              <p>Ejemplo: <span className="font-mono bg-gray-200 px-2 py-1 rounded">A1B2C3</span></p>
              <p className="text-xs text-gray-400">Solo letras (A-Z) y números (0-9)</p>
            </div>
          </div>

          <Button 
            onClick={handleConsultar}
            disabled={otp.length !== 6}
            className="w-full bg-inforsystems-azul hover:bg-inforsystems-azul-hover disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-6 text-lg transition-colors mb-8"
            size="lg"
          >
            🔍 Consultar Estado
          </Button>

          {showStatus && (
            <div className="border-t pt-8 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Equipo: Laptop Dell Inspiron</h3>
                <p className="text-gray-600">Código: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{otp}</span></p>
              </div>
              
              <div className="flex justify-center mb-6">
                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold text-sm">
                  🔧 EN REPARACIÓN
                </span>
              </div>

              {/* Timeline de Progreso */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-cable-latino-verde rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Recepción del Equipo</p>
                    <p className="text-sm text-gray-500">15 Ene, 2024 - 10:30 AM</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-cable-latino-verde rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Diagnóstico Completado</p>
                    <p className="text-sm text-gray-500">16 Ene, 2024 - 9:15 AM</p>
                    <p className="text-sm text-gray-600 mt-1">Problema: Fuente de poder dañada</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white text-sm">⏳</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">En Reparación</p>
                    <p className="text-sm text-gray-500">Estimado: 18 Ene, 2024</p>
                    <p className="text-sm text-gray-600 mt-1">Reemplazando componente</p>
                  </div>
                </div>

                <div className="flex items-center opacity-50">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-gray-600 text-sm">○</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Pruebas de Calidad</p>
                    <p className="text-sm text-gray-500">Pendiente</p>
                  </div>
                </div>

                <div className="flex items-center opacity-50">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-gray-600 text-sm">○</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Listo para Entrega</p>
                    <p className="text-sm text-gray-500">Pendiente</p>
                  </div>
                </div>
              </div>

              {/* Información del Técnico */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">💡</span>
                  <div>
                    <p className="font-semibold text-blue-900">Técnico Asignado: Carlos Rodríguez</p>
                    <p className="text-sm text-blue-700 mt-1">Contacto: +51 987 654 321</p>
                    <p className="text-sm text-blue-700">Email: tecnico@inforsystems.com</p>
                  </div>
                </div>
              </div>

              {/* Botón para nueva consulta */}
              <div className="text-center mt-6">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setOtp('');
                    setShowStatus(false);
                  }}
                  className="border-inforsystems-azul text-inforsystems-azul hover:bg-inforsystems-azul hover:text-white"
                >
                  🔄 Realizar Nueva Consulta
                </Button>
              </div>
            </div>
          )}

          {/* Mensaje cuando no hay código completo */}
          {otp.length > 0 && otp.length < 6 && (
            <div className="text-center">
              <p className="text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                ⚠️ Completa los 6 caracteres para consultar
              </p>
            </div>
          )}
        </div>

        {/* Información de Ayuda */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            ¿No encuentras tu código?{" "}
            <a href="#contacto" className="text-inforsystems-azul hover:underline font-semibold">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SeguimientoReparacion;