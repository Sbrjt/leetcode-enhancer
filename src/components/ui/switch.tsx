export const Switch = ({
	checked,
	onChange,
	disabled = false,
}: {
	checked: boolean
	disabled?: boolean
	onChange: () => void
}) => (
	<button
		disabled={disabled}
		onClick={onChange}
		className={`h-6 w-11 rounded-full p-1 transition-colors ${
			checked ? 'bg-[#5d51d6]' : 'bg-white/10'
		}`}
	>
		<div
			className={`h-4 w-4 rounded-full bg-white transition-transform ${
				checked ? 'translate-x-5' : 'translate-x-0'
			}`}
		/>
	</button>
)
