import useFormatter from './hooks/useFormatter'
import usePremium from './hooks/usePremium'
import useQuestion from './hooks/useQuestion'
import useRating from './hooks/useRating'

function App() {
	const { question, url } = useQuestion()

	useFormatter(url)
	useRating(question)
	usePremium(question)
	// useEditorial(question, url)

	return (
		<>
			{/* {question?.id}
			{question?.title} */}
		</>
	)
}

export default App
