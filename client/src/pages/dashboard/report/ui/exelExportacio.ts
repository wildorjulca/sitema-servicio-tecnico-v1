// utils/excelExport.ts
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Interface para los datos de servicio (actualizada para múltiples motivos)
interface Motivo {
  motivo_ingreso_id: number;
  motivo_ingreso: string;
  descripcion_adicional: string;
  precio_motivo: number;
}

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
  motivos: string; // Ahora es un JSON string con array de Motivo[]
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

// Función para procesar los motivos desde el JSON
const procesarMotivos = (motivosJson: string): { texto: string, total: number } => {
  try {
    if (!motivosJson) return { texto: 'Sin motivos', total: 0 };
    
    const motivos: Motivo[] = JSON.parse(motivosJson);
    if (!Array.isArray(motivos) || motivos.length === 0) {
      return { texto: 'Sin motivos', total: 0 };
    }
    
    const texto = motivos.map(motivo => 
      `${motivo.motivo_ingreso}${motivo.descripcion_adicional ? `: ${motivo.descripcion_adicional}` : ''}`
    ).join('; ');
    
    const total = motivos.reduce((sum, motivo) => sum + (motivo.precio_motivo || 0), 0);
    
    return { texto, total };
  } catch (error) {
    console.error('Error procesando motivos:', error);
    return { texto: 'Error al cargar motivos', total: 0 };
  }
};

// Función para calcular totales generales
const calcularTotalesGenerales = (detalle: ServicioDetallado[]) => {
  const totalManoObra = detalle.reduce((sum, s) => sum + (s.precio || 0), 0);
  const totalRepuestos = detalle.reduce((sum, s) => sum + (s.precioRepuestos || 0), 0);
  const totalMotivos = detalle.reduce((sum, s) => {
    const motivosData = procesarMotivos(s.motivos);
    return sum + motivosData.total;
  }, 0);
  const totalGeneral = detalle.reduce((sum, s) => sum + (s.precioTotal || 0), 0);

  return { totalManoObra, totalRepuestos, totalMotivos, totalGeneral };
};

export const exportarReporteExcel = (datos: DatosExportacion) => {
  // Calcular totales generales
  const { totalManoObra, totalRepuestos, totalMotivos, totalGeneral } = calcularTotalesGenerales(datos.detalle);

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
    ['Total Motivos', `S/ ${totalMotivos.toFixed(2)}`],
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
  const datosDetalle = datos.detalle.map(servicio => {
    const motivosData = procesarMotivos(servicio.motivos);
    
    return {
      'CÓDIGO': servicio.codigoSeguimiento,
      'FECHA INGRESO': new Date(servicio.fechaIngreso).toLocaleDateString('es-ES'),
      'CLIENTE': servicio.cliente,
      'EQUIPO': servicio.equipo,
      'MARCA': servicio.marca,
      'MODELO': servicio.modelo,
      'SERIE': servicio.serie,
      'MOTIVOS DE INGRESO': motivosData.texto,
      'TOTAL MOTIVOS': `S/ ${motivosData.total.toFixed(2)}`,
      'ESTADO': servicio.estado,
      'TÉCNICO': servicio.usuario_soluciona,
      'FECHA ENTREGA': servicio.fechaEntrega ? new Date(servicio.fechaEntrega).toLocaleDateString('es-ES') : 'PENDIENTE',
      'MANO OBRA': `S/ ${servicio.precio?.toFixed(2)}`,
      'REPUESTOS': `S/ ${servicio.precioRepuestos?.toFixed(2)}`,
      'TOTAL': `S/ ${servicio.precioTotal?.toFixed(2)}`,
      'OBSERVACIONES': servicio.observacion,
      'DIAGNÓSTICO': servicio.diagnostico,
      'SOLUCIÓN': servicio.solucion,
      'CÓDIGO BARRAS': servicio.codigo_barras,
      'REPUESTOS UTILIZADOS': servicio.repuestos 
        ? servicio.repuestos.map(r => `${r.producto_nombre} (${r.cantidad} x S/${r.precio_unitario})`).join('; ')
        : 'NINGUNO'
    };
  });

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
    { width: 25 },  // MOTIVOS DE INGRESO (más ancho para múltiples motivos)
    { width: 12 },  // TOTAL MOTIVOS
    { width: 12 },  // ESTADO
    { width: 20 },  // TÉCNICO
    { width: 12 },  // FECHA ENTREGA
    { width: 12 },  // MANO OBRA
    { width: 12 },  // REPUESTOS
    { width: 12 },  // TOTAL
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
    ['Ingresos por Mano de Obra', totalManoObra],
    ['Ingresos por Repuestos', totalRepuestos],
    ['Ingresos por Motivos', totalMotivos],
    ['Ingresos Totales', totalGeneral],
    [''],
    ['DISTRIBUCIÓN DE INGRESOS', ''],
    ['Porcentaje Mano de Obra', `${((totalManoObra / totalGeneral) * 100).toFixed(2)}%`],
    ['Porcentaje Repuestos', `${((totalRepuestos / totalGeneral) * 100).toFixed(2)}%`],
    ['Porcentaje Motivos', `${((totalMotivos / totalGeneral) * 100).toFixed(2)}%`],
    [''],
    ['PROMEDIOS', ''],
    ['Ticket Promedio por Servicio', datos.resumen.ticket_promedio],
    ['Valor Promedio Repuestos', totalRepuestos / datos.resumen.total_servicios],
    ['Mano de Obra Promedio', totalManoObra / datos.resumen.total_servicios],
    ['Motivos Promedio', totalMotivos / datos.resumen.total_servicios],
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

  // ==================== HOJA 4: ANÁLISIS DE MOTIVOS ====================
  const analisisMotivos: { [key: string]: number } = {};
  
  datos.detalle.forEach(servicio => {
    try {
      if (servicio.motivos) {
        const motivos: Motivo[] = JSON.parse(servicio.motivos);
        motivos.forEach(motivo => {
          const nombreMotivo = motivo.motivo_ingreso;
          analisisMotivos[nombreMotivo] = (analisisMotivos[nombreMotivo] || 0) + 1;
        });
      }
    } catch (error) {
      console.error('Error analizando motivos:', error);
    }
  });

  const datosAnalisisMotivos = [
    ['ANÁLISIS DE MOTIVOS DE INGRESO'],
    [''],
    ['MOTIVO', 'CANTIDAD DE SERVICIOS', 'PORCENTAJE'],
    ...Object.entries(analisisMotivos).map(([motivo, cantidad]) => [
      motivo,
      cantidad,
      `${((cantidad / datos.resumen.total_servicios) * 100).toFixed(2)}%`
    ])
  ];

  const worksheetAnalisisMotivos = XLSX.utils.aoa_to_sheet(datosAnalisisMotivos);
  worksheetAnalisisMotivos['!cols'] = [
    { width: 30 },
    { width: 20 },
    { width: 15 }
  ];

  // Agregar las hojas al workbook
  XLSX.utils.book_append_sheet(workbook, worksheetResumen, 'Resumen');
  XLSX.utils.book_append_sheet(workbook, worksheetDetalle, 'Servicios Detallados');
  XLSX.utils.book_append_sheet(workbook, worksheetFinanciero, 'Resumen Financiero');
  XLSX.utils.book_append_sheet(workbook, worksheetAnalisisMotivos, 'Análisis Motivos');

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