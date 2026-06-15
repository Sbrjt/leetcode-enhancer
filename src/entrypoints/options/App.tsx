import { Switch } from '@/components/switch'
import { SETTINGS } from '@/utils/lib'
import { useFeatureEnabled } from '@/utils/useStore'

function App() {
	return (
		<div
			className='flex min-h-screen flex-col items-center justify-start
				bg-gray-900 p-8 text-white'
		>
			<div className='mb-6 flex items-center gap-3'>
				<img src='/icon.svg' alt='Logo' className='h-10 w-10' />
				<h1 className='text-2xl font-bold'>LeetCode Enhancer Options</h1>
			</div>
			<div className='mt-5 flex w-full max-w-md flex-col gap-4'>
				{SETTINGS.map((setting) => (
					<SettingItem key={setting.key} setting={setting} />
				))}
			</div>
		</div>
	)
}

function SettingItem({ setting }: { setting: (typeof SETTINGS)[number] }) {
	const [value, setValue] = useFeatureEnabled(setting.key)

	return (
		<div
			className='flex items-center justify-between rounded-lg border
				border-white/10 bg-white/5 p-3'
		>
			<label className='text-sm font-medium'>{setting.label}</label>
			<Switch checked={value ?? true} onChange={() => setValue(!value)} />
		</div>
	)
}

export default App
