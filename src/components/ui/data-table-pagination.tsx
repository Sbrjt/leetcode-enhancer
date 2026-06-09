import { Table } from '@tanstack/react-table'
import {
	LuChevronLeft,
	LuChevronRight,
	LuChevronsLeft,
	LuChevronsRight,
} from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

interface DataTablePaginationProps<TData> {
	table: Table<TData>
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	const pageSize = table.getState().pagination.pageSize
	const rows = table.getCoreRowModel().rows.length

	if (rows < pageSize) return <></>

	return (
		<div className='flex items-center justify-between pt-3 px-0.5'>
			<div className='flex items-center space-x-6 lg:space-x-8 justify-between  w-full'>
				<div className='flex items-center space-x-2'>
					<p className='text-sm font-medium'>Rows per page</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value))
						}}
					>
						<SelectTrigger className='h-auto w-auto px-2.5 py-0'>
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side='top'>
							{[5, 10, 15, 20, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='flex items-center space-x-2'>
					<div className='flex w-25 items-center justify-center text-sm font-medium'>
						Page {table.getState().pagination.pageIndex + 1} of{' '}
						{table.getPageCount()}
					</div>
					<div className='flex items-center space-x-2'>
						<Button
							variant='outline'
							className='hidden h-8 w-8 p-0 lg:flex'
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className='sr-only'>Go to first page</span>
							<LuChevronsLeft className='h-4 w-4' />
						</Button>
						<Button
							variant='outline'
							className='h-8 w-8 p-0'
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className='sr-only'>Go to previous page</span>
							<LuChevronLeft className='h-4 w-4' />
						</Button>
						<Button
							variant='outline'
							className='h-8 w-8 p-0'
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className='sr-only'>Go to next page</span>
							<LuChevronRight className='h-4 w-4' />
						</Button>
						<Button
							variant='outline'
							className='hidden h-8 w-8 p-0 lg:flex'
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className='sr-only'>Go to last page</span>
							<LuChevronsRight className='h-4 w-4' />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
