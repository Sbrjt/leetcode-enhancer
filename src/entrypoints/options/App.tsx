import { Switch } from '@/components/ui/switch'
import type { SettingKey } from '@/types'
import { reloadTabs } from '@/utils/rpc'
import { SETTINGS } from '@/utils/settings'
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
				<SettingItem settingKey='enabled' onToggle={reloadTabs} />
				<SettingItem settingKey='showRating' />
				<SettingItem settingKey='formatOnRun' />
				<SettingItem settingKey='autoComplete' onToggle={reloadTabs} />
				<SettingItem settingKey='copyCode' />
				<SettingItem settingKey='showDislikes' />
				<SettingItem settingKey='premiumLinks' />
				<SettingItem settingKey='companyQuestions' />
				<SettingItem settingKey='videoSolutions' />
			</div>
		</div>
	)
}

function SettingItem({
	settingKey,
	onToggle,
}: {
	settingKey: SettingKey
	onToggle?: () => void
}) {
	const [value, setValue] = useFeatureEnabled(settingKey)

	const handleToggle = () => {
		onToggle?.()
		setValue(!value)
	}

	return (
		<div
			className='flex items-center justify-between rounded-lg border
				border-white/10 bg-white/5 p-3'
		>
			<label className='text-sm font-medium'>
				{SETTINGS[settingKey].label}
			</label>
			<Switch checked={value} onChange={handleToggle} />
		</div>
	)
}

export default App
