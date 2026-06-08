// this hook updates url on navigation in SPA

import { observeElement } from '@/utils/lib'

export default function useUrl() {
	const [url, setUrl] = useState(location.href)

	useEffect(() => {
		const observer = observeElement(() => {
			setUrl(location.href)
		})
		return () => observer.disconnect()
	}, [])

	return { url }
}
