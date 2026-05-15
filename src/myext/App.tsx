import useCopy from './hooks/useCopy'
import useDislike from './hooks/useDislike'
import useEditorial from './hooks/useEditorial'
import useFormatter from './hooks/useFormatter'
import usePremium from './hooks/usePremium'
import useQuestion from './hooks/useQuestion'
import useRating from './hooks/useRating'

function App() {
	const { question, url } = useQuestion()

	useFormatter(url)
	useRating(question)
	usePremium(question)
	useDislike(question)
	useCopy(question)
	useEditorial(question, url)

	return (
		<>
			{/* {question?.id}
			{question?.title} */}
		</>
	)
}

export default App
