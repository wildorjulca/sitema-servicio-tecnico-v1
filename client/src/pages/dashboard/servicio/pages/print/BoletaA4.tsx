import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 25, // Reducido de 40
    fontSize: 10, // Reducido de 12
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    textAlign: 'center',
    marginBottom: 15, // Reducido de 30
    borderBottom: '1 solid #333', // Reducido de 2
    paddingBottom: 10, // Reducido de 20
  },
  companyName: {
    fontSize: 18, // Reducido de 24
    fontWeight: 'bold',
    marginBottom: 4, // Reducido de 8
    color: '#1e40af',
  },
  companySubtitle: {
    fontSize: 10, // Reducido de 14
    color: '#666',
    marginBottom: 2, // Reducido de 4
  },
  title: {
    fontSize: 16, // Reducido de 20
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15, // Reducido de 25
    color: '#333',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 12, // Reducido de 20
  },
  sectionTitle: {
    fontSize: 11, // Reducido de 14
    fontWeight: 'bold',
    marginBottom: 6, // Reducido de 10
    backgroundColor: '#f3f4f6',
    padding: 5, // Reducido de 8
    color: '#374151',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4, // Reducido de 8
    paddingHorizontal: 8, // Reducido de 10
  },
  label: {
    fontWeight: 'bold',
    width: '40%',
    color: '#555',
    fontSize: 9, // Tamaño reducido
  },
  value: {
    width: '55%',
    textAlign: 'right',
    fontSize: 9, // Tamaño reducido
  },
  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, // Reducido de 15
  },
  column: {
    width: '48%',
  },
  table: {
    marginTop: 6, // Reducido de 10
    border: '1 solid #ddd',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e40af',
    color: 'white',
    padding: 4, // Reducido de 8
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #ddd',
    padding: 4, // Reducido de 8
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 8, // Reducido de 10
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 9, // Reducido de 11
  },
  totalSection: {
    marginTop: 12, // Reducido de 20
    paddingTop: 10, // Reducido de 15
    borderTop: '1 solid #333', // Reducido de 2
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12, // Reducido de 16
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 14, // Reducido de 18
    fontWeight: 'bold',
    color: '#059669',
  },
  footer: {
    position: 'absolute',
    bottom: 15, // Reducido de 30
    left: 25, // Reducido de 40
    right: 25, // Reducido de 40
    textAlign: 'center',
    fontSize: 8, // Reducido de 10
    color: '#666',
    borderTop: '1 solid #ddd',
    paddingTop: 6, // Reducido de 10
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20, // Reducido de 40
    paddingTop: 12, // Reducido de 20
    borderTop: '1 solid #ddd',
  },
  signatureBox: {
    width: '45%',
    alignItems: 'center',
  },
  signatureLine: {
    width: '80%',
    borderBottom: '1 solid #333',
    marginBottom: 3, // Reducido de 5
    paddingTop: 15, // Reducido de 30
  },
  signatureLabel: {
    fontSize: 8, // Reducido de 10
    color: '#666',
  },
  notes: {
    marginTop: 8, // Reducido de 15
    padding: 6, // Reducido de 10
    backgroundColor: '#f9fafb',
    border: '1 solid #e5e7eb',
    fontSize: 8, // Reducido de 10
    color: '#666',
  },
  compactText: {
    fontSize: 8, // Texto más compacto para descripciones largas
    lineHeight: 1.2, // Reducir interlineado
  }
});

interface Producto {
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  importe: number;
}

interface ServicioData {
  cliente: string;
  usuario_recibe: string;
  usuario_soluciona: string;
  fechaIngreso: string;
  fechaEntrega: string;
  equipo: string;
  marca: string;
  modelo: string;
  serie: string;
  codigo_barras: string;
  motivo_ingreso: string;
  descripcion_motivo: string;
  diagnostico: string;
  solucion: string;
  observacion: string;
  precio: number;
  precioRepuestos: number;
  precioTotal: number;
  codigoSeguimiento: string;
  estado: string;
}

interface ReporteProps {
  data: {
    servicio: ServicioData;
    producto: Producto[];
  };
}

const Reporte = ({ data }: ReporteProps) => {
  const { servicio, producto } = data;

  const formatCurrency = (amount: number) => {
    return `S/. ${amount}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.companyName}>INFORSYSTEMS COMPUTER</Text>
          <Text style={styles.companySubtitle}>Servicio Técnico Especializado</Text>
          <Text style={styles.companySubtitle}>Tel: 123-456-789 | Email: info@inforsystems.com</Text>
        </View>

        {/* Título principal */}
        <Text style={styles.title}>Comprobante de Servicio Técnico</Text>

        {/* Información del cliente y servicio - Más compacto */}
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>INFORMACIÓN DEL CLIENTE</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Cliente:</Text>
                <Text style={styles.value}>{servicio.cliente}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Código:</Text>
                <Text style={styles.value}>{servicio.codigoSeguimiento}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Estado:</Text>
                <Text style={styles.value}>{servicio.estado}</Text>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>FECHAS</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Ingreso:</Text>
                <Text style={styles.value}>{formatDate(servicio.fechaIngreso)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Entrega:</Text>
                <Text style={styles.value}>{formatDate(servicio.fechaEntrega)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Información del equipo - Más compacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EQUIPO</Text>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.row}>
                <Text style={styles.label}>Tipo:</Text>
                <Text style={styles.value}>{servicio.equipo}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Marca:</Text>
                <Text style={styles.value}>{servicio.marca || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.row}>
                <Text style={styles.label}>Modelo:</Text>
                <Text style={styles.value}>{servicio.modelo || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Serie:</Text>
                <Text style={styles.value}>{servicio.serie || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Detalles del servicio - Más compacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETALLES</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Problema:</Text>
            <Text style={[styles.value, { textAlign: 'left' }, styles.compactText]}>{servicio.descripcion_motivo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Diagnóstico:</Text>
            <Text style={[styles.value, { textAlign: 'left' }, styles.compactText]}>{servicio.diagnostico || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Solución:</Text>
            <Text style={[styles.value, { textAlign: 'left' }, styles.compactText]}>{servicio.solucion || 'N/A'}</Text>
          </View>
        </View>

        {/* Repuestos utilizados - Tabla más compacta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REPUESTOS</Text>
          {producto.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>Producto</Text>
                <Text style={styles.tableHeaderCell}>Cant.</Text>
                <Text style={styles.tableHeaderCell}>P.Unit.</Text>
                <Text style={styles.tableHeaderCell}>Importe</Text>
              </View>
              {producto.map((repuesto, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{repuesto.producto_nombre}</Text>
                  <Text style={styles.tableCell}>{repuesto.cantidad}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(repuesto.precio_unitario)}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(repuesto.importe)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ textAlign: 'center', color: '#666', marginTop: 6, fontStyle: 'italic', fontSize: 9 }}>
              Sin repuestos
            </Text>
          )}
        </View>

        {/* Resumen de costos - Más compacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COSTOS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Mano de obra:</Text>
            <Text style={styles.value}>{formatCurrency(servicio.precio)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Repuestos:</Text>
            <Text style={styles.value}>{formatCurrency(servicio.precioRepuestos)}</Text>
          </View>
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>TOTAL:</Text>
            <Text style={styles.totalAmount}>{formatCurrency(servicio.precioTotal)}</Text>
          </View>
        </View>

        {/* Personal y firmas - Más compacto */}
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PERSONAL</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Recibió:</Text>
                <Text style={styles.value}>{servicio.usuario_recibe}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Atendió:</Text>
                <Text style={styles.value}>{servicio.usuario_soluciona}</Text>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.signatureSection}>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureLine} />
                <Text style={styles.signatureLabel}>Firma Técnico</Text>
              </View>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureLine} />
                <Text style={styles.signatureLabel}>Firma Cliente</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text>Gracias por confiar en INFORSYSTEMS COMPUTER - Garantía: 30 días mano de obra</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Reporte;