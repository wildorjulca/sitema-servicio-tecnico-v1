// utils/excelExport.ts
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Interface para los datos de servicio (igual que en tu tabla)
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

export const exportarReporteExcel = (datos: DatosExportacion) => {
  // Crear un nuevo workbook
  const workbook = XLSX.utils.book_new();
  
  // ==================== HOJA 1: RESUMEN ====================
  const datosResumen = [
    ['REPORTE DE SERVICIOS TÉCNICOS'],
    [''],
    ['Periodo', datos.tipoPeriodo],
    ['Fecha Base', datos.fechaBase],
    ['Fecha Inicio', datos.resumen.periodo_inicio],
    ['Fecha Fin', datos.resumen.periodo_fin],
    [''],
    ['MÉTRICAS PRINCIPALES', ''],
    ['Total Servicios', datos.resumen.total_servicios],
    ['Servicios Pendientes', datos.resumen.pendientes],
    ['En Reparación', datos.resumen.en_reparacion],
    ['Terminados', datos.resumen.terminados],
    ['Entregados', datos.resumen.entregados],
    [''],
    ['INGRESOS Y FINANZAS', ''],
    ['Ingresos Totales', `S/ ${datos.resumen.ingresos_totales?.toFixed(2)}`],
    ['Ticket Promedio', `S/ ${datos.resumen.ticket_promedio?.toFixed(2)}`],
    ['Total Mano de Obra', `S/ ${datos.resumen.total_mano_obra?.toFixed(2)}`],
    ['Total Repuestos', `S/ ${datos.resumen.total_repuestos?.toFixed(2)}`],
    ['Valor Repuestos Utilizados', `S/ ${datos.resumen.valor_repuestos}`],
    [''],
    ['ESTADÍSTICAS', ''],
    ['Clientes Únicos', datos.resumen.clientes_unicos],
    ['Técnicos Activos', datos.resumen.tecnicos_activos],
    ['Tipos de Equipo', datos.resumen.tipos_equipo_diferentes],
    ['Días Promedio Reparación', datos.resumen.dias_promedio],
    ['Porcentaje Entregados', `${datos.resumen.porcentaje_entregados}%`],
    ['Repuestos Utilizados', datos.resumen.repuestos_utilizados],
  ];

  const worksheetResumen = XLSX.utils.aoa_to_sheet(datosResumen);
  
  // Estilos para el resumen
  worksheetResumen['!cols'] = [
    { width: 25 },
    { width: 20 }
  ];

  // ==================== HOJA 2: DETALLE DE SERVICIOS ====================
  const datosDetalle = datos.detalle.map(servicio => ({
    'CÓDIGO': servicio.codigoSeguimiento,
    'FECHA INGRESO': new Date(servicio.fechaIngreso).toLocaleDateString('es-ES'),
    'CLIENTE': servicio.cliente,
    'EQUIPO': servicio.equipo,
    'MARCA': servicio.marca,
    'MODELO': servicio.modelo,
    'SERIE': servicio.serie,
    'MOTIVO INGRESO': servicio.motivo_ingreso,
    'DESCRIPCIÓN MOTIVO': servicio.descripcion_motivo,
    'ESTADO': servicio.estado,
    'TÉCNICO': servicio.usuario_soluciona,
    'FECHA ENTREGA': servicio.fechaEntrega ? new Date(servicio.fechaEntrega).toLocaleDateString('es-ES') : 'PENDIENTE',
    'MANO OBRA': servicio.precio,
    'REPUESTOS': servicio.precioRepuestos,
    'TOTAL': servicio.precioTotal,
    'OBSERVACIONES': servicio.observacion,
    'DIAGNÓSTICO': servicio.diagnostico,
    'SOLUCIÓN': servicio.solucion,
    'CÓDIGO BARRAS': servicio.codigo_barras,
    'REPUESTOS UTILIZADOS': servicio.repuestos 
      ? servicio.repuestos.map(r => `${r.producto_nombre} (${r.cantidad} x S/${r.precio_unitario})`).join('; ')
      : 'NINGUNO'
  }));

  const worksheetDetalle = XLSX.utils.json_to_sheet(datosDetalle);
  
  // Ajustar anchos de columnas para el detalle
  worksheetDetalle['!cols'] = [
    { width: 12 },  // CÓDIGO
    { width: 12 },  // FECHA INGRESO
    { width: 20 },  // CLIENTE
    { width: 15 },  // EQUIPO
    { width: 12 },  // MARCA
    { width: 15 },  // MODELO
    { width: 12 },  // SERIE
    { width: 20 },  // MOTIVO INGRESO
    { width: 20 },  // DESCRIPCIÓN MOTIVO
    { width: 12 },  // ESTADO
    { width: 20 },  // TÉCNICO
    { width: 12 },  // FECHA ENTREGA
    { width: 10 },  // MANO OBRA
    { width: 10 },  // REPUESTOS
    { width: 10 },  // TOTAL
    { width: 25 },  // OBSERVACIONES
    { width: 25 },  // DIAGNÓSTICO
    { width: 25 },  // SOLUCIÓN
    { width: 15 },  // CÓDIGO BARRAS
    { width: 30 },  // REPUESTOS UTILIZADOS
  ];

  // ==================== HOJA 3: RESUMEN FINANCIERO ====================
  const datosFinanciero = [
    ['RESUMEN FINANCIERO'],
    [''],
    ['CONCEPTO', 'MONTO (S/)'],
    ['Ingresos por Mano de Obra', datos.resumen.total_mano_obra],
    ['Ingresos por Repuestos', datos.resumen.total_repuestos],
    ['Ingresos Totales', datos.resumen.ingresos_totales],
    [''],
    ['PROMEDIOS', ''],
    ['Ticket Promedio por Servicio', datos.resumen.ticket_promedio],
    ['Valor Promedio Repuestos', datos.resumen.total_repuestos / datos.resumen.total_servicios],
    ['Mano de Obra Promedio', datos.resumen.total_mano_obra / datos.resumen.total_servicios],
    [''],
    ['EFICIENCIA', ''],
    ['Porcentaje de Entregados', `${datos.resumen.porcentaje_entregados}%`],
    ['Tiempo Promedio Reparación (días)', datos.resumen.dias_promedio],
  ];

  const worksheetFinanciero = XLSX.utils.aoa_to_sheet(datosFinanciero);
  worksheetFinanciero['!cols'] = [
    { width: 30 },
    { width: 20 }
  ];

  // Agregar las hojas al workbook
  XLSX.utils.book_append_sheet(workbook, worksheetResumen, 'Resumen');
  XLSX.utils.book_append_sheet(workbook, worksheetDetalle, 'Servicios Detallados');
  XLSX.utils.book_append_sheet(workbook, worksheetFinanciero, 'Resumen Financiero');

  // Generar el archivo
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });

  // Nombre del archivo con fecha
  const fechaExportacion = new Date().toISOString().split('T')[0];
  const nombreArchivo = `Reporte_Servicios_${datos.tipoPeriodo}_${fechaExportacion}.xlsx`;

  // Descargar
  saveAs(blob, nombreArchivo);
};