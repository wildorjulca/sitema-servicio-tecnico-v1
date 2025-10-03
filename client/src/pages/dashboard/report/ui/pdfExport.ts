// utils/pdfExport.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Repuesto {
  idServicioRepuesto: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  importe: number;
}

interface ServicioDetallado {
  idServicio: number;
  codigoSeguimiento: string;
  fechaIngreso: string;
  motivo_ingreso_id: number;
  motivo_ingreso: string;
  descripcion_motivo: string;
  observacion: string;
  diagnostico: string;
  solucion: string;
  precio: number;
  usuario_recibe_id: number;
  usuario_recibe: string;
  usuario_soluciona_id: number;
  usuario_soluciona: string;
  fechaEntrega: string | null;
  precioRepuestos: number;
  estado_id: number;
  estado: string;
  precioTotal: number;
  servicio_equipos_id: number;
  equipo: string;
  MARCA_idMarca: number;
  marca: string;
  modelo: string;
  serie: string;
  codigo_barras: string;
  cliente_id: number;
  cliente: string;
  repuestos: Repuesto[] | null;
}

interface ResumenReporte {
  total_servicios: number;
  pendientes: string;
  en_reparacion: string;
  terminados: string;
  entregados: string;
  ingresos_totales: number;
  ticket_promedio: number;
  dias_promedio: string;
  repuestos_utilizados: string;
  valor_repuestos: string;
  clientes_unicos: number;
  tecnicos_activos: number;
  tipos_equipo_diferentes: number;
  total_mano_obra: number;
  total_repuestos: number;
  porcentaje_entregados: string;
  periodo_inicio: string;
  periodo_fin: string;
}

interface DatosExportacion {
  resumen: ResumenReporte;
  detalle: ServicioDetallado[];
  tipoPeriodo: string;
  fechaBase: string;
}

export const generarPDFBlob = async (datos: DatosExportacion): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Crear elemento temporal para el PDF
      const element = document.createElement('div');
      element.style.width = '210mm';
      element.style.padding = '20px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.background = 'white';
      element.style.color = 'black';

      // Calcular totales
      const totalManoObra = datos.detalle.reduce((sum, s) => sum + (s.precio || 0), 0);
      const totalRepuestos = datos.detalle.reduce((sum, s) => sum + (s.precioRepuestos || 0), 0);
      const totalGeneral = datos.detalle.reduce((sum, s) => sum + (s.precioTotal || 0), 0);

      // Contenido del PDF
      element.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: bold;">
            REPORTE DE SERVICIOS TÉCNICOS
          </h1>
          <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">
            Sistema de Gestión - Reporte ${datos.tipoPeriodo}
          </p>
          <p style="color: #374151; margin: 0; font-size: 12px;">
            Período: ${new Date(datos.resumen.periodo_inicio).toLocaleDateString('es-ES')} - ${new Date(datos.resumen.periodo_fin).toLocaleDateString('es-ES')}
          </p>
        </div>

        <!-- RESUMEN EJECUTIVO -->
        <div style="margin-bottom: 25px; background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #2563eb;">
          <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
            📊 RESUMEN EJECUTIVO
          </h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <span style="color: #6b7280; font-size: 12px;">Total Servicios</span>
              <div style="color: #1e40af; font-size: 20px; font-weight: bold;">${datos.resumen.total_servicios}</div>
            </div>
            <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <span style="color: #6b7280; font-size: 12px;">Ingresos Totales</span>
              <div style="color: #059669; font-size: 20px; font-weight: bold;">S/ ${datos.resumen.ingresos_totales?.toFixed(2)}</div>
            </div>
            <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <span style="color: #6b7280; font-size: 12px;">Clientes Únicos</span>
              <div style="color: #7c3aed; font-size: 20px; font-weight: bold;">${datos.resumen.clientes_unicos}</div>
            </div>
            <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <span style="color: #6b7280; font-size: 12px;">Eficiencia</span>
              <div style="color: #dc2626; font-size: 20px; font-weight: bold;">${datos.resumen.porcentaje_entregados}%</div>
            </div>
          </div>
        </div>

        <!-- ESTADÍSTICAS DETALLADAS -->
        <div style="margin-bottom: 25px;">
          <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
            📈 ESTADÍSTICAS DETALLADAS
          </h2>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 12px;">
            <div style="background: #fef3c7; padding: 10px; border-radius: 6px; text-align: center;">
              <div style="color: #92400e; font-weight: bold;">Pendientes</div>
              <div style="color: #b45309; font-size: 16px;">${datos.resumen.pendientes}</div>
            </div>
            <div style="background: #dbeafe; padding: 10px; border-radius: 6px; text-align: center;">
              <div style="color: #1e40af; font-weight: bold;">En Reparación</div>
              <div style="color: #2563eb; font-size: 16px;">${datos.resumen.en_reparacion}</div>
            </div>
            <div style="background: #d1fae5; padding: 10px; border-radius: 6px; text-align: center;">
              <div style="color: #065f46; font-weight: bold;">Terminados</div>
              <div style="color: #059669; font-size: 16px;">${datos.resumen.terminados}</div>
            </div>
            <div style="background: #ede9fe; padding: 10px; border-radius: 6px; text-align: center;">
              <div style="color: #5b21b6; font-weight: bold;">Entregados</div>
              <div style="color: #7c3aed; font-size: 16px;">${datos.resumen.entregados}</div>
            </div>
          </div>
        </div>

        <!-- DETALLE DE SERVICIOS -->
        <div style="margin-bottom: 20px;">
          <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
            🛠️ DETALLE DE SERVICIOS (${datos.detalle.length} registros)
          </h2>
        </div>
      `;

      // Crear tabla de servicios
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.fontSize = '10px';
      table.style.marginBottom = '20px';
      
      // Encabezados de la tabla
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr style="background: #1e40af; color: white;">
          <th style="padding: 8px; border: 1px solid #374151; text-align: left;">Código</th>
          <th style="padding: 8px; border: 1px solid #374151; text-align: left;">Cliente</th>
          <th style="padding: 8px; border: 1px solid #374151; text-align: left;">Equipo</th>
          <th style="padding: 8px; border: 1px solid #374151; text-align: left;">Estado</th>
          <th style="padding: 8px; border: 1px solid #374151; text-align: right;">Total</th>
        </tr>
      `;
      table.appendChild(thead);

      // Filas de datos
      const tbody = document.createElement('tbody');
      datos.detalle.forEach((servicio, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = index % 2 === 0 ? '#f8fafc' : 'white';
        
        const estadoColor = 
          servicio.estado === 'Pendiente' ? '#f59e0b' :
          servicio.estado === 'En Reparación' ? '#3b82f6' :
          servicio.estado === 'Terminado' ? '#10b981' :
          servicio.estado === 'Entregado' ? '#8b5cf6' : '#6b7280';

        row.innerHTML = `
          <td style="padding: 6px; border: 1px solid #d1d5db; font-weight: bold;">${servicio.codigoSeguimiento}</td>
          <td style="padding: 6px; border: 1px solid #d1d5db;">${servicio.cliente}</td>
          <td style="padding: 6px; border: 1px solid #d1d5db;">${servicio.equipo} - ${servicio.marca}</td>
          <td style="padding: 6px; border: 1px solid #d1d5db;">
            <span style="color: ${estadoColor}; font-weight: bold;">${servicio.estado}</span>
          </td>
          <td style="padding: 6px; border: 1px solid #d1d5db; text-align: right; font-weight: bold; color: #059669;">
            S/ ${servicio.precioTotal?.toFixed(2)}
          </td>
        `;
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      element.appendChild(table);

      // Totales
      const totalesDiv = document.createElement('div');
      totalesDiv.style.marginTop = '20px';
      totalesDiv.style.padding = '15px';
      totalesDiv.style.background = '#1e40af';
      totalesDiv.style.color = 'white';
      totalesDiv.style.borderRadius = '8px';
      totalesDiv.style.textAlign = 'center';
      totalesDiv.style.fontWeight = 'bold';
      
      totalesDiv.innerHTML = `
        <div style="font-size: 16px;">RESUMEN FINAL</div>
        <div style="display: flex; justify-content: space-around; margin-top: 10px; font-size: 14px;">
          <div>Mano Obra: <span style="color: #fbbf24">S/ ${totalManoObra.toFixed(2)}</span></div>
          <div>Repuestos: <span style="color: #34d399">S/ ${totalRepuestos.toFixed(2)}</span></div>
          <div>Total General: <span style="color: #f87171">S/ ${totalGeneral.toFixed(2)}</span></div>
        </div>
      `;
      element.appendChild(totalesDiv);

      // Pie de página
      const footer = document.createElement('div');
      footer.style.marginTop = '30px';
      footer.style.paddingTop = '15px';
      footer.style.borderTop = '2px solid #e5e7eb';
      footer.style.textAlign = 'center';
      footer.style.color = '#6b7280';
      footer.style.fontSize = '10px';
      footer.innerHTML = `
        <div>Reporte generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</div>
        <div style="margin-top: 5px;">Sistema de Gestión de Servicios Técnicos</div>
      `;
      element.appendChild(footer);

      // Agregar al documento y generar PDF
      document.body.appendChild(element);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Convertir a Blob
      const pdfBlob = pdf.output('blob');
      
      // Limpiar
      document.body.removeChild(element);
      
      resolve(pdfBlob);

    } catch (error) {
      reject(error);
    }
  });
};

// Mantener función original para descarga
export const exportarReportePDF = async (datos: DatosExportacion) => {
  const pdfBlob = await generarPDFBlob(datos);
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Reporte_Servicios_${datos.tipoPeriodo}_${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};