import { Question } from '@/types'
import { addPageToDatabase, initNotion } from '@/utils/notion'
import { useSyncStore } from '@/utils/useStore'
import { NotionReady } from './Ready'
import { NotionSave } from './Save'
import { NotionSetup } from './Setup'

const Notion = () => {
	useEffect(() => {
		browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
			console.log('Active tab:', tab)
		})
	}, [])

	const [apiKey, setApiKey] = useSyncStore<string>('notion_api_key')
	const [databaseId, setDatabaseId] = useSyncStore<string>('notion_database_id')
	const [question] = useSessionStore<Question | null>('questions')

	const handleInit = async (val: string) => {
		if (val) {
			const res = await initNotion(val)
			if (res.success && res.databaseId) {
				setApiKey(val)
				setDatabaseId(res.databaseId)
			} else {
				console.error(res.error)
			}
		}
	}

	const handleSavePage = async () => {
		if (!apiKey || !databaseId || !question) return

		const res = await addPageToDatabase(databaseId, apiKey, {
			title: question.title,
			url: `https://leetcode.com/problems/${question.slug}/`,
			level: question.difficulty,
			tags: question.tags,
		})

		if (!res.success) {
			throw new Error(res.error)
		}
	}

	const handleReset = () => {
		setApiKey(null)
		setDatabaseId(null)
	}

	return (
		<div className='flex flex-col gap-6 p-6 text-white bg-[#1a1a1a] min-h-screen font-sans'>
			<div className='flex items-center gap-2'>
				<h1 className='text-lg font-bold'>Notion</h1>
			</div>

			<div className='w-full bg-white/5 border border-white/5 rounded-2xl p-4'>
				{!apiKey ?
					<NotionSetup onSave={handleInit} />
				: !question ?
					<NotionReady onReset={handleReset} />
				:	<NotionSave />}
			</div>
		</div>
	)
}

export default Notion
