type Updater<T> = T | null | ((prev: T | null) => T | null)

function useStore<T>(key: string, store: StorageArea) {
	const storageKey: StorageItemKey = `${store}:${key}`
	const [value, setValue] = useState<T | null>(null)

	useEffect(() => {
		const load = async () => {
			const v = await storage.getItem<T>(storageKey)
			setValue(v)
		}

		load()

		const unwatch = storage.watch<T>(storageKey, async (newValue) => {
			setValue(newValue)
		})

		return unwatch
	}, [storageKey])

	const updateValue = async (valueOrUpdater: Updater<T>) => {
		const prev = await storage.getItem<T>(storageKey)

		const next =
			typeof valueOrUpdater === 'function' ?
				(valueOrUpdater as (prev: T | null) => T | null)(prev)
			:	valueOrUpdater

		await storage.setItem(storageKey, next)
	}

	return [value, updateValue] as const
}

export function useSessionStore<T>(key: string) {
	return useStore<T>(key, 'session')
}

export function useSyncStore<T>(key: string) {
	return useStore<T>(key, 'sync')
}

// Docs: https://wxt.dev/storage#watchers
