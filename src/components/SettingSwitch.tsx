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
	onToggle?: (enabled: boolean) => Promise<boolean>
}) {
	const [enabled, setEnabled] = useFeatureEnabled(settingKey)
	const [loading, setLoading] = useState(false)

	async function handleToggle() {
		if (loading) return
		setLoading(true)

		try {
			const value = !enabled

			if (onToggle) {
				const success = await onToggle(value)
				if (!success) return
			}

			setEnabled(value)

			if (reload) reloadTabs()
		} finally {
			setLoading(false)
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
			<Switch checked={enabled} onChange={handleToggle} disabled={loading} />
		</div>
	)
}
