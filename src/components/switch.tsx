export const Switch = ({
	checked,
	onChange,
}: {
	checked: boolean
	onChange: () => void
}) => (
	<button
		onClick={onChange}
		className={`w-11 h-6 rounded-full p-1 transition-colors ${
			checked ? 'bg-[#5d51d6]' : 'bg-white/10'
		}`}
	>
		<div
			className={`w-4 h-4 bg-white rounded-full transition-transform ${
				checked ? 'translate-x-5' : 'translate-x-0'
			}`}
		/>
	</button>
)
