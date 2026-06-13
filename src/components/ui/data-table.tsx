'use client'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { LuChevronDown, LuChevronsUpDown, LuChevronUp } from 'react-icons/lu'
import { DataTablePagination } from './data-table-pagination'
import { ScrollArea } from './scroll-area'
interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	controls?: boolean
	filter?: string
	pageSize?: number
}

export function DataTable<TData, TValue>({
	columns,
	data,
	controls = true,
	pageSize,
}: DataTableProps<TData, TValue>) {
	const [globalFilter, setGlobalFilter] = useState<any>([])
	const [sorting, setSorting] = useState<SortingState>([])

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onGlobalFilterChange: setGlobalFilter,
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			globalFilter,
			sorting,
		},
		initialState: {
			pagination: {
				pageSize: pageSize ?? 5,
			},
		},
	})

	return (
		<div className='w-full '>
			{controls && (
				<div className='pb-4 w-full -z-10 -mt-12 flex justify-end'>
					{/* <Input
						placeholder='🔎 Filter'
						value={globalFilter ?? ''}
						onChange={(e) => {
							setGlobalFilter(e.target.value)
							table.setGlobalFilter(String(e.target.value))
						}}
						className='w-56 bg-white'
					/> */}
				</div>
			)}

			<div className='rounded-md border bg-sd-card  shadow-xs'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											<Head header={header} controls={controls} />
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ?
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className='ps-5 break-all max-w-40'
										>
											<ScrollArea className='flex max-h-20 flex-col'>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</ScrollArea>
										</TableCell>
									))}
								</TableRow>
							))
						:	<TableRow>
								<TableCell
									colSpan={columns?.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
			</div>

			<DataTablePagination table={table} />
		</div>
	)
}

function Head({ header, controls }: { header: any; controls: boolean }) {
	const sortingStates = [undefined, 'asc', 'desc']
	const [sort, setSort] = useState(0)

	const title = header.id

	return controls ?
			<div
				className='group flex items-center w-fit py-1 rounded hover:bg-gray-300 my-1 hover:cursor-pointer'
				onClick={() => {
					const nextSort = (sort + 1) % 3
					setSort(nextSort)

					const direction = sortingStates[nextSort]
					if (direction === 'asc') {
						header.column.toggleSorting(true)
					} else if (direction === 'desc') {
						header.column.toggleSorting(false)
					} else {
						header.column.clearSorting()
					}
				}}
			>
				{title}
				{sortingStates[sort] === 'asc' ?
					<LuChevronUp className='ml-2 h-4 w-4' />
				: sortingStates[sort] === 'desc' ?
					<LuChevronDown className='ml-2 h-4 w-4' />
				:	<LuChevronsUpDown className='ml-2 h-4 w-4 group-hover:opacity-100 opacity-0' />
				}
			</div>
		:	<>{title}</>
}
