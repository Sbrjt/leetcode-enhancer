export const NotionReady = ({ onReset }: { onReset: () => void }) => (
	<div className='flex flex-col gap-4'>
		<div className='p-3 bg-green-500/20 border border-green-500/20 text-green-400 rounded-xl text-center text-sm font-medium'>
			All set to save to notion
		</div>
		<button
			onClick={onReset}
			className='text-xs text-white/40 hover:text-white transition-colors underline text-center'
		>
			Reset API Key
		</button>
	</div>
)
