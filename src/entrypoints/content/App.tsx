import useCopy from './hooks/useCopy'
import useDislike from './hooks/useDislike'
import useEditorial from './hooks/useEditorial'
import useFormatter from './hooks/useFormatter'
import usePremium from './hooks/usePremium'
import useQuestion from './hooks/useQuestion'
import useRating from './hooks/useRating'
import useTags from './hooks/useTags'
import useUrl from './hooks/useUrl'

function App() {
	const { url } = useUrl()
	const { question } = useQuestion(url)

	useFormatter(url)
	useRating(question)
	usePremium(question)
	useDislike(question)
	useCopy(question)
	useTags(question)
	useEditorial(question, url)

	return null
}

export default App
