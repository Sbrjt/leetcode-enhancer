import { CompanyQuestion } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from './ui/data-table'

function QuestionsTable({ questions }: { questions: CompanyQuestion[] }) {
	return (
		<div className='mt-10 w-full'>
			<DataTable columns={columns} data={questions} pageSize={15} />
		</div>
	)
}

const columns: ColumnDef<CompanyQuestion>[] = [
	{ accessorKey: 'ID' },
	{
		accessorKey: 'Title',
		cell: ({ row }) => {
			const { Title, URL } = row.original
			return <a href={URL}>{Title}</a>
		},
	},
	{ accessorKey: 'Time' },
	{ accessorKey: 'Difficulty' },
	{ accessorKey: 'Frequency %' },
]

export default QuestionsTable
