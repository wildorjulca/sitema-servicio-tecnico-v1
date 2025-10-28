// components/BoletaTicketera.tsx
import { useServiceyId } from "@/hooks/useService";
import { useUser } from "@/hooks/useUser";
import { useEffect, useRef } from "react";

interface BoletaTicketeraProps {
  servicioId: string;
  onClose?: () => void;
}

export function BoletaTicketera({ servicioId, onClose }: BoletaTicketeraProps) {
  const { user } = useUser();
  const usuarioId = user?.id;
  const { data: ServiceData } = useServiceyId(usuarioId, servicioId);
  const hasPrinted = useRef(false); // 🔥 NUEVO: Para controlar impresión única

  useEffect(() => {
    // 🔥 SOLUCIÓN: Solo imprimir una vez cuando los datos estén listos
    if (ServiceData && !hasPrinted.current) {
      hasPrinted.current = true;
      
      // Pequeño delay para asegurar que el DOM esté listo
      const printTimer = setTimeout(() => {
        window.print();
      }, 300);

      return () => clearTimeout(printTimer);
    }
  }, [ServiceData]); // 🔥 Solo dependencia de ServiceData

  // 🔥 NUEVO: Manejar el evento afterprint de forma más controlada
  useEffect(() => {
    const handleAfterPrint = () => {
      // Pequeño delay antes de cerrar
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 500);
    };

    window.addEventListener('afterprint', handleAfterPrint);
    
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [onClose]);

  const handleManualClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!ServiceData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del servicio...</p>
        </div>
      </div>
    );
  }

  // Calcular totales
  const totalRepuestos = ServiceData.repuestos?.reduce((sum, rep) => sum + (rep.importe || 0), 0) || 0;
  const totalMotivos = ServiceData.motivos?.reduce((sum, mot) => sum + (mot.precio_motivo || 0), 0) || 0;
  const manoObra = ServiceData.precio || 0;

  return (
    <div className="ticketera-container">
      <style>
        {`
          @media print {
            @page {
              margin: 0;
              size: 80mm auto;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: 'Courier New', monospace;
              font-size: 11px;
              width: 80mm;
              line-height: 1.2;
            }
            .ticketera-container {
              width: 80mm;
              padding: 4mm 3mm;
              margin: 0;
            }
            .no-print {
              display: none;
            }
          }
          
          .ticketera-container {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            width: 80mm;
            padding: 12px 8px;
            margin: 0 auto;
            background: white;
            line-height: 1.2;
          }
          
          .header {
            text-align: center;
            border-bottom: 1px solid #000;
            padding-bottom: 6px;
            margin-bottom: 6px;
          }
          
          .empresa {
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 1px;
            letter-spacing: 0.5px;
          }
          
          .ruc {
            font-size: 9px;
            margin-bottom: 1px;
          }
          
          .direccion {
            font-size: 9px;
            margin-bottom: 3px;
          }
          
          .titulo {
            font-weight: bold;
            font-size: 12px;
            margin: 4px 0;
            text-transform: uppercase;
          }
          
          .linea-puntos {
            border-bottom: 1px dotted #666;
            margin: 3px 0;
          }
          
          .detalle {
            margin: 4px 0;
          }
          
          .fila {
            display: flex;
            justify-content: space-between;
            margin: 1px 0;
            padding: 0 1px;
          }
          
          .fila-doble {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            margin: 1px 0;
          }
          
          .tabla {
            width: 100%;
            border-collapse: collapse;
            margin: 3px 0;
            font-size: 10px;
          }
          
          .tabla th {
            text-align: left;
            border-bottom: 1px solid #000;
            padding: 2px 1px;
            font-weight: bold;
            font-size: 10px;
          }
          
          .tabla td {
            padding: 1px 1px;
            vertical-align: top;
            font-size: 9px;
          }
          
          .col-desc {
            width: 45mm;
            max-width: 45mm;
            word-wrap: break-word;
          }
          
          .col-cant {
            width: 8mm;
            text-align: center;
          }
          
          .col-precio {
            width: 12mm;
            text-align: right;
          }
          
          .col-total {
            width: 12mm;
            text-align: right;
          }
          
          .total {
            font-weight: bold;
            font-size: 12px;
            text-align: center;
            margin: 6px 0;
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
            padding: 3px 0;
          }
          
          .centrado {
            text-align: center;
          }
          
          .derecha {
            text-align: right;
          }
          
          .separador {
            border-top: 1px dotted #666;
            margin: 4px 0;
          }
          
          .observaciones {
            font-size: 9px;
            margin-top: 6px;
            border-top: 1px dotted #666;
            padding-top: 3px;
            line-height: 1.1;
          }
          
          .no-print {
            margin-top: 20px;
            text-align: center;
          }
          
          .btn-impresion {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 4px;
            font-size: 12px;
          }
          
          .btn-imprimir {
            background: #007bff;
            color: white;
          }
          
          .btn-cerrar {
            background: #6c757d;
            color: white;
          }
        `}
      </style>

      {/* Contenido de la boleta (igual que antes) */}
      <div className="header">
        <div className="empresa">INFORSYTEMS COMPUTER SAC</div>
        <div className="ruc">RUC: 20123456789</div>
        <div className="direccion">Av. Principal 123 - Lima</div>
        <div className="direccion">Tel: (01) 234-5678</div>
        <div className="titulo">BOLETA DE PAGO</div>
      </div>

      <div className="linea-puntos"></div>

      <div className="detalle">
        <div className="fila">
          <strong>Fecha:</strong>
          <span>{new Date().toLocaleDateString('es-ES')}</span>
        </div>
        <div className="fila">
          <strong>Hora:</strong>
          <span>{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="fila">
          <strong>Código:</strong>
          <span>{ServiceData.codigoSeguimiento}</span>
        </div>
      </div>

      <div className="linea-puntos"></div>

      <div className="detalle">
        <div><strong>Cliente:</strong></div>
        <div>{ServiceData.cliente}</div>
      </div>

      <div className="linea-puntos"></div>

      <div className="detalle">
        <div><strong>Equipo:</strong> {ServiceData.equipo}</div>
        <div className="fila-doble">
          <span>{ServiceData.marca} {ServiceData.modelo}</span>
          <span>Serie: {ServiceData.serie || 'N/A'}</span>
        </div>
      </div>

      <div className="linea-puntos"></div>

      <table className="tabla">
        <thead>
          <tr>
            <th className="col-desc">DESCRIPCIÓN</th>
            <th className="col-cant">CANT</th>
            <th className="col-precio">PRECIO</th>
            <th className="col-total">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="col-desc">Mano de obra</td>
            <td className="col-cant">1</td>
            <td className="col-precio">{manoObra.toFixed(2)}</td>
            <td className="col-total">{manoObra.toFixed(2)}</td>
          </tr>

          {ServiceData.repuestos?.map((repuesto, index) => (
            <tr key={index}>
              <td className="col-desc">{repuesto.producto_nombre}</td>
              <td className="col-cant">{repuesto.cantidad}</td>
              <td className="col-precio">{repuesto.precio_unitario?.toFixed(2)}</td>
              <td className="col-total">{repuesto.importe?.toFixed(2)}</td>
            </tr>
          ))}

          {ServiceData.motivos?.map((motivo, index) => (
            <tr key={index}>
              <td className="col-desc">{motivo.motivo_ingreso}</td>
              <td className="col-cant">1</td>
              <td className="col-precio">{motivo.precio_motivo?.toFixed(2)}</td>
              <td className="col-total">{motivo.precio_motivo?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="separador"></div>

      <div className="detalle">
        <div className="fila">
          <span>Subtotal:</span>
          <span>S/. {(manoObra + totalRepuestos + totalMotivos).toFixed(2)}</span>
        </div>
        <div className="total">
          TOTAL: S/. {ServiceData.precioTotal?.toFixed(2) || '0.00'}
        </div>
      </div>

      <div className="separador"></div>

      <div className="observaciones">
        <div className="centrado">¡Gracias por su preferencia!</div>
      </div>

      {/* Botones de control - Solo en pantalla */}
      <div className="no-print">
        <button 
          onClick={() => window.print()} 
          className="btn-impresion btn-imprimir"
        >
          🖨️ Imprimir Boleta
        </button>
        <button 
          onClick={handleManualClose}
          className="btn-impresion btn-cerrar"
        >
          ❌ Cerrar Ventana
        </button>
        <p style={{ fontSize: '10px', color: '#666', marginTop: '8px' }}>
          La boleta se imprimirá automáticamente. Use estos botones si es necesario.
        </p>
      </div>
    </div>
  );
}