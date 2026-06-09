import { DataTable } from './ui/data-table'

function QuestionsTable({ questions }: any) {
	return <DataTable columns={columns} data={questions ?? []} pageSize={15} />
}

const columns = [
	{ accessorKey: 'ID' },
	{
		accessorKey: 'Title',
		cell: ({ row }: { row: any }) => {
			const { Title, URL } = row.original
			return <a href={URL}>{Title}</a>
		},
	},
	{ accessorKey: 'Time' },
	{ accessorKey: 'Difficulty' },
	{ accessorKey: 'Frequency %' },
]

export default QuestionsTable
