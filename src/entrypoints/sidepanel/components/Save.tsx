import useQuestion from '../hooks'

export const NotionSave = () => {
	const { question } = useQuestion()

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-col gap-1'>
				<div className='text-xs text-white/40 ml-1 uppercase tracking-wider font-bold'>
					Current Question
				</div>
				<div className='p-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium'>
					{question?.title}
				</div>
			</div>
			<button
				onClick={() => {}}
				className={`w-full px-4 py-3 text-sm font-bold rounded-xl transition-all`}
			>
				Save to Notion
			</button>
		</div>
	)
}
