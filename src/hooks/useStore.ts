export function useStorageItem<T>(key: string, store: StorageArea = 'sync') {
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

	const updateValue = async (newValue: T | null) => {
		await storage.setItem<T>(storageKey, newValue)
	}

	return [value, updateValue] as const
}

// Docs: https://wxt.dev/storage#watchers
