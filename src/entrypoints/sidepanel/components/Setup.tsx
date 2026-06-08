import { useState } from 'react'

export const NotionSetup = ({ onSave }: { onSave: (val: string) => void }) => {
	const [input, setInput] = useState('')

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-col gap-2'>
				<label htmlFor='apiKey' className='text-xs text-white/40 ml-1'>
					Notion API Key
				</label>
				<input
					id='apiKey'
					type='password'
					className='p-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-white/20 transition-all font-sans'
					placeholder='ntn_1234abcd'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							onSave(input)
						}
					}}
				/>
			</div>
			<button
				onClick={() => onSave(input)}
				className='w-full px-4 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-all'
			>
				Save Key
			</button>
		</div>
	)
}
