import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

const data = [
  { name: "En reparación", value: 8 },
  { name: "Listo para entregar", value: 4 },
  { name: "Entregado", value: 10 },
  { name: "Pendiente", value: 3 },
]

const COLORS = ["#3b82f6", "#facc15", "#22c55e", "#ef4444"]

export default function Panel() {
  return (
    <div className="flex flex-col gap-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Servicios en curso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipos entregados hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes nuevos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos bajos en stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de estado de servicios */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Estado de servicios</CardTitle>
          <Link to={'/dashboard/new'}>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nuevo servicio
            </Button>
          </Link>

        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Últimos servicios */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos servicios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha ingreso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Juan Pérez</TableCell>
                <TableCell>Laptop HP</TableCell>
                <TableCell>En reparación</TableCell>
                <TableCell>2025-08-25</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>María López</TableCell>
                <TableCell>PC Gamer</TableCell>
                <TableCell>Listo para entregar</TableCell>
                <TableCell>2025-08-26</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Carlos Díaz</TableCell>
                <TableCell>Impresora Epson</TableCell>
                <TableCell>Entregado</TableCell>
                <TableCell>2025-08-27</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
