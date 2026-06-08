import { Switch } from '@/components/switch'
import { SETTINGS } from '@/utils/lib'

function App() {
	return (
		<div className='p-8 bg-gray-900 text-white min-h-screen flex flex-col items-center justify-start'>
			<div className='flex items-center gap-3 mb-6'>
				<img src='/icon.svg' alt='Logo' className='w-10 h-10' />
				<h1 className='text-2xl font-bold'>LeetCode Enhancer Options</h1>
			</div>
			<div className='flex flex-col gap-4 w-full max-w-md mt-5'>
				{SETTINGS.map((setting) => (
					<SettingItem key={setting.key} setting={setting} />
				))}
			</div>
		</div>
	)
}

function SettingItem({ setting }: { setting: (typeof SETTINGS)[0] }) {
	const [value, setValue] = useSyncStore<boolean>(setting.key)

	return (
		<div className='flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10'>
			<label className='text-sm font-medium'>{setting.label}</label>
			<Switch checked={value ?? true} onChange={() => setValue(!value)} />
		</div>
	)
}

export default App
