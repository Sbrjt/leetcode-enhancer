import type { SettingKey } from '@/types'
import { SETTINGS } from '@/utils/lib'

/**
 * A hook to read/write in the browser extension storage.
 *
 * @example
 * ```ts
 * const [value, setValue] = useStore("username", "local");
 * console.log(value);
 * setValue("shub");
 * ```
 */
function useStore<T>(key: string, store: StorageArea) {
	const storageKey: StorageItemKey = `${store}:${key}`
	const [value, setValue] = useState<T | null>(null)

	// sync: storage → react
	useEffect(() => {
		;(async () => {
			const val = await storage.getItem<T>(storageKey)
			setValue(val)
		})()

		const unwatch = storage.watch<T>(storageKey, (val) => {
			setValue(val)
		})

		return () => unwatch()
	}, [storageKey])

	// sync: react → storage
	useEffect(() => {
		if (value == null) return
		storage.setItem(storageKey, value)
	}, [value])

	return [value, setValue] as const
}

export function useSessionStore<T>(key: string) {
	return useStore<T>(key, 'session')
}

export function useSyncStore<T>(key: string) {
	return useStore<T>(key, 'sync')
}

/**
 * A hook to manage the enabled/disabled state of a settings flag.
 * Falls back to the default setting if not set.
 */
export function useFeatureEnabled(flag: SettingKey) {
	const [value, setValue] = useSyncStore<boolean>(flag)
	return [value ?? SETTINGS[flag].default, setValue] as const
}

// Docs: https://wxt.dev/storage#watchers
