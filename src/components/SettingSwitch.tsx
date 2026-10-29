import type { SettingKey } from '@/types'
import { reloadTabs } from '@/utils/rpc'
import { SETTINGS } from '@/utils/settings'
import { useFeatureEnabled } from '@/utils/useStore'
import { Switch } from './ui/switch'

export default function SettingSwitch({
	settingKey,
	reload = false,
	onToggle,
}: {
	settingKey: SettingKey
	reload?: boolean
	onToggle?: () => void
}) {
	const [value, setValue] = useFeatureEnabled(settingKey)

	function handleToggle() {
		setValue(!value)

		if (reload) {
			reloadTabs()
		}
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
