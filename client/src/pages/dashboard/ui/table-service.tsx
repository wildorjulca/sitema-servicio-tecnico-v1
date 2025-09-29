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
  onRepair?: (row: T) => void;
  onDeliver?: (row: T) => void;
  onPrint?: (row: T) => void;
  onEdit?: (row: T) => void;
  onView?: (row: T) => void;
  onRowSelect?: (row: T) => void;
  searchColumn?: keyof T;
  placeholderSearch?: string;
  actions?: React.ReactNode;
  viewRoute?: string;
  repairRoute?: string;
  deliverRoute?: string;
  printRoute?: string;
  editRoute?: string;
  // NUEVA PROPS PARA VALIDACIONES
  getActionState?: (row: T) => {
    canRepair?: boolean;
    repairText?: string;
    repairVariant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
    repairClassName?: string;
    isDeliverDisabled?: boolean;
  };
}

export function DataTableService<T extends { id: string | number }>({
  columns,
  data,
  pageIndex = 0,
  pageSize = 10,
  totalRows = 0,
  onPageChange,
  onPageSizeChange,
  onRepair,
  onDeliver,
  onPrint,
  onEdit,
  onView,
  onRowSelect,
  searchColumn,
  placeholderSearch,
  actions,
  viewRoute = "/servicios",
  repairRoute = "/servicios/reparar",
  deliverRoute = "/servicios/entregar",
  printRoute = "/servicios/imprimir",
  editRoute = "/servicios/editar",
  getActionState, // NUEVA PROPS
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
              table.getRowModel().rows.map((row) => {
                const actionState = getActionState ? getActionState(row.original) : null;
                
                return (
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

                            {/* Ver más */}
                            {onView && (
                              <DropdownMenuItem
                                onClick={() => handleView(row.original)}
                                className="text-blue-600 hover:bg-blue-50 focus:bg-blue-50"
                              >
                                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                Ver más
                              </DropdownMenuItem>
                            )}

                            {/* Reparar - CON VALIDACIÓN */}
                            {onRepair && (
                              <DropdownMenuItem
                                onClick={() => handleRepair(row.original)}
                                disabled={actionState && !actionState.canRepair}
                                className={`${
                                  actionState && !actionState.canRepair 
                                    ? 'text-gray-400 cursor-not-allowed' 
                                    : 'text-orange-600 hover:bg-orange-50 focus:bg-orange-50'
                                }`}
                              >
                                <Wrench className="mr-2 h-4 w-4 text-orange-500" />
                                {actionState?.repairText || "Reparar"}
                              </DropdownMenuItem>
                            )}

                            {/* Entregar equipo - CON VALIDACIÓN */}
                            {onDeliver && (
                              <DropdownMenuItem
                                onClick={() => handleDeliver(row.original)}
                                disabled={actionState?.isDeliverDisabled}
                                className={`${
                                  actionState?.isDeliverDisabled 
                                    ? 'text-gray-400 cursor-not-allowed' 
                                    : 'text-green-600 hover:bg-green-50 focus:bg-green-50'
                                }`}
                              >
                                <Truck className="mr-2 h-4 w-4 text-green-500" />
                                Entregar equipo
                              </DropdownMenuItem>
                            )}

                            {/* Imprimir */}
                            {onPrint && (
                              <DropdownMenuItem
                                onClick={() => handlePrint(row.original)}
                                className="text-purple-600 hover:bg-purple-50 focus:bg-purple-50"
                              >
                                <Printer className="mr-2 h-4 w-4 text-purple-500" />
                                Imprimir
                              </DropdownMenuItem>
                            )}

                            {/* Editar */}
                            {onEdit && (
                              <DropdownMenuItem
                                onClick={() => handleEdit(row.original)}
                                className="text-cyan-600 hover:bg-cyan-50 focus:bg-cyan-50"
                              >
                                <Edit className="mr-2 h-4 w-4 text-cyan-500" />
                                Editar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
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

      {/* VERSIÓN MÓVIL - CON VALIDACIONES */}
      <div className="sm:hidden space-y-3">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => {
            const actionState = getActionState ? getActionState(row.original) : null;
            
            return (
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(row.original)}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4 mr-1 text-blue-500" /> Ver
                      </Button>
                    )}
                    {onRepair && (
                      <Button
                        variant={actionState?.repairVariant || "outline"}
                        size="sm"
                        onClick={() => handleRepair(row.original)}
                        disabled={actionState && !actionState.canRepair}
                        className={`${
                          actionState?.repairClassName || "border-orange-200 text-orange-600 hover:bg-orange-50"
                        } ${actionState && !actionState.canRepair ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Wrench className="h-4 w-4 mr-1 text-orange-500" /> 
                        {actionState?.repairText || "Reparar"}
                      </Button>
                    )}
                    {onDeliver && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeliver(row.original)}
                        disabled={actionState?.isDeliverDisabled}
                        className={`border-green-200 text-green-600 hover:bg-green-50 ${
                          actionState?.isDeliverDisabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Truck className="h-4 w-4 mr-1 text-green-500" /> Entregar
                      </Button>
                    )}
                    {onPrint && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrint(row.original)}
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        <Printer className="h-4 w-4 mr-1 text-purple-500" /> Imprimir
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(row.original)}
                        className="border-cyan-200 text-cyan-600 hover:bg-cyan-50"
                      >
                        <Edit className="h-4 w-4 mr-1 text-cyan-500" /> Editar
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })
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