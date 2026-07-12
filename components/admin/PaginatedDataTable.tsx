'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'

export const PAGE_SIZE = 50

type Column<T> = {
  header: string
  cell: (item: T) => React.ReactNode
}

interface PaginatedDataTableProps<T> {
  columns: Column<T>[]
  items: T[]
  total: number
  page: number
  onPageChange: (page: number) => void
  isLoading: boolean
  isError: boolean
  emptyMessage: string
  errorMessage: string
  getRowKey: (item: T) => string | number
}

export function PaginatedDataTable<T>({
  columns,
  items,
  total,
  page,
  onPageChange,
  isLoading,
  isError,
  emptyMessage,
  errorMessage,
  getRowKey,
}: PaginatedDataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  if (isError) {
    return <p className="text-sm text-destructive py-4 text-center">{errorMessage}</p>
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.header}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                Cargando...
              </TableCell>
            </TableRow>
          )}
          {!isLoading && items.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            items.map((item) => (
              <TableRow key={getRowKey(item)}>
                {columns.map((column) => (
                  <TableCell key={column.header}>{column.cell(item)}</TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  if (page > 1) onPageChange(page - 1)
                }}
                className={page <= 1 ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive onClick={(event) => event.preventDefault()}>
                {page} / {totalPages}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  if (page < totalPages) onPageChange(page + 1)
                }}
                className={page >= totalPages ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
