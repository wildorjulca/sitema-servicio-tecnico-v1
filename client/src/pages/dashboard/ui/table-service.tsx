// components/ui/table-detalle.tsx
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Search, Eye, Wrench, Truck, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useBuscarCtrlB } from "@/utils/hotkeys";

interface DataTableDetalleProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pageIndex?: number;
  pageSize?: number;
  totalRows?: number;
  onPageChange?: (newPage: number) => void;
  onPageSizeChange?: (size: number) => void;
  onRepair?: (row: T) => void; // Cambiado de onEdit a onRepair
  onDeliver?: (row: T) => void; // Nueva prop para entregar equipo
  onPrint?: (row: T) => void; // Nueva prop para imprimir
  onEdit?: (row: T) => void; // Mantenemos onEdit por si acaso
  onView?: (row: T) => void;
  onRowSelect?: (row: T) => void;
  searchColumn?: keyof T;
  placeholderSearch?: string;
  actions?: React.ReactNode;
  viewRoute?: string;
  repairRoute?: string; // Nueva ruta para reparar
  deliverRoute?: string; // Nueva ruta para entregar
  printRoute?: string; // Nueva ruta para imprimir
  editRoute?: string; // Ruta para editar
}

export function DataTableService<T extends { id: string | number }>({
  columns,
  data,
  pageIndex = 0,
  pageSize = 10,
  totalRows = 0,
  onPageChange,
  onPageSizeChange,
  onRepair, // Cambiado de onEdit
  onDeliver, // Nueva prop
  onPrint, // Nueva prop
  onEdit, // Mantenemos por si acaso
  onView,
  onRowSelect,
  searchColumn,
  placeholderSearch,
  actions,
  viewRoute = "/servicios", // Cambiado a servicios
  repairRoute = "/servicios/reparar", // Nueva ruta
  deliverRoute = "/servicios/entregar", // Nueva ruta
  printRoute = "/servicios/imprimir", // Nueva ruta
  editRoute = "/servicios/editar", // Ruta para editar
}: DataTableDetalleProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const searchInputRef = React.useRef<HTMLInputElement>(null);
  useBuscarCtrlB(searchInputRef);

  const navigate = useNavigate();

  const handleView = (row: T) => {
    if (onView) {
      onView(row);
    } else if (viewRoute) {
      navigate(`${viewRoute}/${row.id}`);
    }
  };

  const handleRepair = (row: T) => {
    if (onRepair) {
      onRepair(row);
    } else if (repairRoute) {
      navigate(`${repairRoute}/${row.id}`);
    }
  };

  const handleDeliver = (row: T) => {
    if (onDeliver) {
      onDeliver(row);
    } else if (deliverRoute) {
      navigate(`${deliverRoute}/${row.id}`);
    }
  };

  const handlePrint = (row: T) => {
    if (onPrint) {
      onPrint(row);
    } else if (printRoute) {
      navigate(`${printRoute}/${row.id}`);
    }
  };

  const handleEdit = (row: T) => {
    if (onEdit) {
      onEdit(row);
    } else if (editRoute) {
      navigate(`${editRoute}/${row.id}`);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      onPageChange?.(newState.pageIndex);
      onPageSizeChange?.(newState.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalRows / pageSize),
  });

  // Determinar si hay acciones para mostrar
  const hasActions = onRepair || onDeliver || onPrint || onEdit || onView;

  return (
    <div className="w-full">
      {(searchColumn || actions) && (
        <div className="flex items-center justify-between py-4 gap-2">
          {searchColumn && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                ref={searchInputRef}
                placeholder={placeholderSearch || "Buscar... o Ctrl + G"}
                value={(table.getColumn(String(searchColumn))?.getFilterValue() as string) ?? ""}
                onChange={(e) =>
                  table.getColumn(String(searchColumn))?.setFilterValue(e.target.value)
                }
                className="pl-8"
              />
            </div>
          )}
          {actions && <div className="flex items-center">{actions}</div>}
        </div>
      )}

      <div className="hidden sm:block overflow-x-auto rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
                {hasActions && <TableHead>Acciones</TableHead>}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} onClick={() => onRowSelect?.(row.original)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Acciones</span>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          {onView && (
                            <DropdownMenuItem onClick={() => handleView(row.original)}>
                              <Eye className="mr-2 h-4 w-4" /> Ver más
                            </DropdownMenuItem>
                          )}
                          {onRepair && (
                            <DropdownMenuItem onClick={() => handleRepair(row.original)}>
                              <Wrench className="mr-2 h-4 w-4" /> Reparar
                            </DropdownMenuItem>
                          )}
                          {onDeliver && (
                            <DropdownMenuItem onClick={() => handleDeliver(row.original)}>
                              <Truck className="mr-2 h-4 w-4" /> Entregar equipo
                            </DropdownMenuItem>
                          )}
                          {onPrint && (
                            <DropdownMenuItem onClick={() => handlePrint(row.original)}>
                              <Printer className="mr-2 h-4 w-4" /> Imprimir
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="sm:hidden space-y-3">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="border rounded-lg p-3 shadow-sm bg-white cursor-pointer hover:bg-gray-50"
              onClick={() => onRowSelect?.(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="flex justify-between py-1">
                  <span className="font-medium text-gray-600">
                    {String(cell.column.columnDef.header)}:
                  </span>
                  <span>{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
                </div>
              ))}
              {hasActions && (
                <div className="flex justify-end gap-2 pt-2 flex-wrap">
                  {onView && (
                    <Button variant="outline" size="sm" onClick={() => handleView(row.original)}>
                      <Eye className="h-4 w-4 mr-1" /> Ver
                    </Button>
                  )}
                  {onRepair && (
                    <Button variant="outline" size="sm" onClick={() => handleRepair(row.original)}>
                      <Wrench className="h-4 w-4 mr-1" /> Reparar
                    </Button>
                  )}
                  {onDeliver && (
                    <Button variant="outline" size="sm" onClick={() => handleDeliver(row.original)}>
                      <Truck className="h-4 w-4 mr-1" /> Entregar
                    </Button>
                  )}
                  {onPrint && (
                    <Button variant="outline" size="sm" onClick={() => handlePrint(row.original)}>
                      <Printer className="h-4 w-4 mr-1" /> Imprimir
                    </Button>
                  )}
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={() => handleEdit(row.original)}>
                      <Edit className="h-4 w-4 mr-1" /> Editar
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Sin resultados.</p>
        )}
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-gray-600">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}