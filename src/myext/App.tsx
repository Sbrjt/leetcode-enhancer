import useEditorial from './hooks/useEditorial'
import usePremium from './hooks/usePremium'
import useQuestion from './hooks/useQuestion'
import useRating from './hooks/useRating'

function App() {
	const { question, url } = useQuestion()

	useEditorial(question, url)
	useRating(question)
	usePremium(question)

	return (
		<>
			{/* {question?.id}
			{question?.title} */}
		</>
	)
}

export default App
