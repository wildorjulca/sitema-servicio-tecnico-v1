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
import { Edit, MoreHorizontal, Search, Trash } from "lucide-react";

import { useBuscarCtrlB } from "@/utils/hotkeys";

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pageIndex?: number;
  pageSize?: number;
  totalRows?: number; // Nueva prop para el total de registros
  onPageChange?: (newPage: number) => void;
  onPageSizeChange?: (size: number) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onRowSelect?: (row: T) => void;
  searchColumn?: keyof T;
  placeholderSearch?: string;
  actions?: React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  pageIndex = 0,
  pageSize = 10,
  totalRows = 0, // Valor por defecto
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onRowSelect,
  searchColumn,
  placeholderSearch,
  actions,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const searchInputRef = React.useRef<HTMLInputElement>(null);
  useBuscarCtrlB(searchInputRef);

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
    manualPagination: true, // Paginación manual, ya que controlamos pageIndex y pageSize
    pageCount: Math.ceil(totalRows / pageSize), // Calcular el número total de páginas
  });

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
                {(onEdit || onDelete) && <TableHead>Acciones</TableHead>}
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
                  {(onEdit || onDelete) && (
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
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(row.original)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem onClick={() => onDelete(row.original)}>
                              <Trash className="mr-2 h-4 w-4" /> Eliminar
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
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="h-24 text-center">
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
              {(onEdit || onDelete) && (
                <div className="flex justify-end gap-3 pt-2">
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={() => onEdit(row.original)}>
                      <Edit className="h-4 w-4 mr-1" /> Editar
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="destructive" size="sm" onClick={() => onDelete(row.original)}>
                      <Trash className="h-4 w-4 mr-1" /> Eliminar
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