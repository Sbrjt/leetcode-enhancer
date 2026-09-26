import { CompanyQuestionWithStatus } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { LuCircleCheck, LuCircleX, LuGithub } from 'react-icons/lu'
import { DataTable } from './ui/data-table'

function QuestionsTable({
	questions,
}: {
	questions: CompanyQuestionWithStatus[]
}) {
	return (
		<div className='mt-10 w-full'>
			<DataTable
				columns={columns}
				data={questions}
				pageSize={15}
				ariaLabel='Company problems'
			/>
			<div
				className='mt-5 flex items-center justify-center border-t border-dashed
					pt-4 text-xs text-zinc-500 dark:text-zinc-400'
			>
				<span className='mr-1.5'>Powered by</span>
				<a
					href='https://github.com/snehasishroy/leetcode-companywise-interview-questions'
					target='_blank'
					className='inline-flex items-center gap-1.5 rounded-full border
						border-zinc-200/80 bg-zinc-100 px-3 py-1 font-medium text-zinc-800
						no-underline shadow-xs transition-all hover:bg-zinc-200
						hover:text-zinc-950 dark:border-zinc-700/40 dark:bg-zinc-800/50
						dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white'
				>
					<LuGithub className='h-3.5' />
					<span>snehasishroy/leetcode-companywise-interview-questions</span>
				</a>
			</div>
		</div>
	)
}

const columns: ColumnDef<CompanyQuestionWithStatus>[] = [
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
	{
		accessorKey: 'Status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.original.Status

			if (status === 'ac') {
				return (
					<LuCircleCheck className='h-4 w-4 text-green-500' title='Solved' />
				)
			}

			if (status === 'notac') {
				return (
					<LuCircleX className='h-4 w-4 text-orange-500' title='Attempted' />
				)
			}

			return <span className='text-zinc-300 dark:text-zinc-600'>-</span>
		},
	},
]

export default QuestionsTable
